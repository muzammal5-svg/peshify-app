-- =============================================================================
-- Peshify / MZM & Associates — Complete Database Setup Script
-- Self-Contained, Single-Run Script for Fresh Supabase Project Setup
-- Generated: 2026-11-03T20:03:46.699Z
-- =============================================================================
-- INSTRUCTIONS:
-- 1. Create a new Supabase project at https://supabase.com
-- 2. Open the Supabase Dashboard -> SQL Editor -> New Query
-- 3. Paste the ENTIRE contents of this file and click "Run"
-- 4. After running:
--    - In Project Settings -> API, copy your Project URL & Anon Key to web/.env.local
--    - Verify Storage Buckets ('documents', 'avatars', 'payment-slips') in Storage section
--    - Deploy Edge Functions (send-push, create-member) if desired
-- =============================================================================

-- Ensure transaction safety
SET TIME ZONE 'Asia/Karachi';

-- =============================================================================
-- STEP 1: EXTENSIONS
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
  CREATE EXTENSION IF NOT EXISTS "pg_net";
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'pg_net extension skipped (not supported or requires superuser): %', SQLERRM;
END $$;

DO $$ BEGIN
  CREATE EXTENSION IF NOT EXISTS "pg_cron";
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'pg_cron extension skipped (not supported or requires superuser): %', SQLERRM;
END $$;

-- =============================================================================
-- STEP 2: STORAGE BUCKETS INITIALIZATION
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents', 'documents', FALSE, 52428800,
  ARRAY[
    'application/pdf', 'image/jpeg', 'image/png', 'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE
SET public = FALSE,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE
SET public = TRUE,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('payment-slips', 'payment-slips', FALSE, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO UPDATE
SET public = FALSE,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =============================================================================
-- STEP 3: MIGRATIONS (ORDERED FULL SCHEMA)
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Migration: 20240001000000_initial_schema.sql
-- -----------------------------------------------------------------------------
-- =============================================================================
-- MZM & Associates — Case Management System
-- Phase 1 Revised: Complete Multi-Tenant Schema
-- Timezone: Asia/Karachi
-- =============================================================================

-- ─── Extensions ───────────────────────────────────────────────────────────────
-- (uuid-ossp initialized)
-- (pg_trgm initialized)      -- fuzzy search on party names
-- (pg_cron initialized)      -- scheduled reminder dispatch
-- (pgcrypto initialized)

-- ─── Enums ────────────────────────────────────────────────────────────────────
DO $$ BEGIN CREATE TYPE user_role AS ENUM ('super_admin','admin','lawyer','clerk'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE case_status AS ENUM ('running','decided'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE case_outcome AS ENUM ('won','lost','dismissed','settled','withdrawn'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE From_type AS ENUM ('plaintiff','defendant'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE reminder_status AS ENUM ('upcoming','done','dismissed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE platform_type AS ENUM ('web','android','ios'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE subscription_status AS ENUM ('active','expired','trial'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- ─── Firms ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.firms (
  id                       UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                     TEXT              NOT NULL,
  logo_url                 TEXT,
  subscription_status      subscription_status NOT NULL DEFAULT 'trial',
  subscription_valid_till  DATE,
  created_at               TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.firms IS 'Law firms. All business tables carry firm_id for multi-tenancy.';

-- ─── Profiles (extends auth.users) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  firm_id     UUID        NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  full_name   TEXT        NOT NULL,
  phone       TEXT,
  email       TEXT,
  role        user_role   NOT NULL DEFAULT 'clerk',
  photo_url   TEXT,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Firm users. firm_id must match the firm they belong to.';

-- Auto-create profile row on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, firm_id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(
      (NEW.raw_user_meta_data->>'firm_id')::UUID,
      (SELECT id FROM public.firms LIMIT 1)   -- fallback for first setup
    ),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'clerk')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Clients ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.clients (
  id                   UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  firm_id              UUID        NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  full_name            TEXT        NOT NULL,
  father_husband_name  TEXT,
  cnic                 TEXT        CHECK (cnic ~ '^\d{5}-\d{7}-\d$' OR cnic IS NULL),
  phone                TEXT,
  whatsapp             TEXT,
  email                TEXT,
  address              TEXT,
  city                 TEXT,
  is_active            BOOLEAN     NOT NULL DEFAULT TRUE,
  created_by           UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.clients IS 'Clients of the firm. Linked to cases.';

-- ─── Case Types ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.case_types (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  firm_id          UUID        NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  name             TEXT        NOT NULL,
  requires_offence BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (firm_id, name)
);

COMMENT ON TABLE public.case_types IS 'Per-firm case type list. requires_offence drives Offence field visibility.';

-- ─── Courts ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courts (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  firm_id     UUID        NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (firm_id, name)
);

COMMENT ON TABLE public.courts IS 'Per-firm court list.';

-- ─── Cases ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cases (
  id               UUID               PRIMARY KEY DEFAULT uuid_generate_v4(),
  firm_id          UUID               NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  client_id        UUID               NOT NULL REFERENCES public.clients(id),
  case_ref_no      TEXT               NOT NULL,
  plaintiff_name   TEXT               NOT NULL,
  defendant_name   TEXT               NOT NULL,
  From     From_type  NOT NULL,
  judge_name       TEXT,
  court_no         TEXT,
  case_type_id     UUID               NOT NULL REFERENCES public.case_types(id),
  offence          TEXT,              -- only for case_types.requires_offence = true
  description      TEXT,
  status           case_status        NOT NULL DEFAULT 'running',
  decision_date    DATE,
  outcome          case_outcome,
  decision_notes   TEXT,
  assigned_to      UUID               REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by       UUID               REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.cases IS 'Core case records. plaintiff/defendant stored for "A vs B" display.';

-- ─── Hearings ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.hearings (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id             UUID        NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  firm_id             UUID        NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  serial_no           TEXT,       -- court cause-list serial, editable
  hearing_date        DATE        NOT NULL,
  current_proceeding  TEXT,       -- what happened at THIS hearing
  next_proceeding     TEXT,       -- what is expected next time
  next_date           DATE,
  judge_name          TEXT,
  court_no            TEXT,
  created_by          UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.hearings IS 'Each hearing is a separate row. previous_date derived from previous row ordered by hearing_date.';

-- ─── Documents ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.documents (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  firm_id      UUID        NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  client_id    UUID        REFERENCES public.clients(id) ON DELETE SET NULL,
  case_id      UUID        REFERENCES public.cases(id) ON DELETE SET NULL,
  name         TEXT        NOT NULL,
  file_path    TEXT        NOT NULL,   -- Supabase Storage path
  mime         TEXT,
  size         BIGINT,                 -- bytes
  uploaded_by  UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
);

COMMENT ON TABLE public.documents IS 'One module for case docs and client docs. Stored in private bucket.';

-- ─── Reminders ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reminders (
  id           UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
  firm_id      UUID            NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  case_id      UUID            NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  hearing_id   UUID            NOT NULL REFERENCES public.hearings(id) ON DELETE CASCADE,
  user_id      UUID            NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  remind_date  DATE            NOT NULL,
  status       reminder_status NOT NULL DEFAULT 'upcoming',
  acted_at     TIMESTAMPTZ,
  created_at   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  UNIQUE (hearing_id, user_id)
);

COMMENT ON TABLE public.reminders IS 'Auto-generated 10 days before hearing.next_date. Never inserted manually by users.';

-- ─── Notifications ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id        UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  firm_id   UUID        NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  user_id   UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title     TEXT        NOT NULL,
  body      TEXT        NOT NULL,
  type      TEXT        NOT NULL DEFAULT 'reminder',  -- 'reminder' | 'system' | 'case_update'
  ref_type  TEXT,                                     -- 'case' | 'hearing' | 'document'
  ref_id    UUID,
  is_read   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.notifications IS 'In-app notification inbox per user.';

-- ─── Device Tokens (FCM) ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.device_tokens (
  id          UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token       TEXT          NOT NULL UNIQUE,
  platform    platform_type NOT NULL DEFAULT 'web',
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.device_tokens IS 'Firebase Cloud Messaging tokens per device.';

-- =============================================================================
-- TASK 2 — INDEXES
-- =============================================================================

-- Hearings: cause list and history queries
CREATE INDEX idx_hearings_next_date       ON public.hearings (next_date)         WHERE next_date IS NOT NULL;
CREATE INDEX idx_hearings_case_date_desc  ON public.hearings (case_id, hearing_date DESC);
CREATE INDEX idx_hearings_firm_date       ON public.hearings (firm_id, hearing_date);

-- Cases: dashboard filters
CREATE INDEX idx_cases_firm_status        ON public.cases (firm_id, status);
CREATE INDEX idx_cases_client             ON public.cases (client_id);
CREATE INDEX idx_cases_assigned           ON public.cases (assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_cases_case_type          ON public.cases (case_type_id);

-- Clients: search
CREATE INDEX idx_clients_firm_name        ON public.clients (firm_id, full_name);

-- Reminders: dispatch queue
CREATE INDEX idx_reminders_remind_date    ON public.reminders (remind_date, status) WHERE status = 'upcoming';
CREATE INDEX idx_reminders_firm           ON public.reminders (firm_id);

-- Notifications: unread inbox
CREATE INDEX idx_notifications_user       ON public.notifications (user_id, is_read, created_at DESC);

-- Documents
CREATE INDEX idx_documents_case           ON public.documents (case_id)   WHERE case_id   IS NOT NULL;
CREATE INDEX idx_documents_client         ON public.documents (client_id) WHERE client_id IS NOT NULL;
CREATE INDEX idx_documents_firm           ON public.documents (firm_id);

-- ── pg_trgm fuzzy search ──────────────────────────────────────────────────────
CREATE INDEX idx_cases_plaintiff_trgm     ON public.cases USING GIN (plaintiff_name gin_trgm_ops);
CREATE INDEX idx_cases_defendant_trgm     ON public.cases USING GIN (defendant_name gin_trgm_ops);
CREATE INDEX idx_cases_ref_no_trgm        ON public.cases USING GIN (case_ref_no    gin_trgm_ops);
CREATE INDEX idx_clients_name_trgm        ON public.clients USING GIN (full_name    gin_trgm_ops);

-- =============================================================================
-- TASK 3 — TRIGGERS: updated_at + auto-reminder
-- =============================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_firms_updated_at ON public.firms;
CREATE TRIGGER trg_firms_updated_at BEFORE UPDATE ON public.firms     FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS trg_clients_updated_at ON public.clients;
CREATE TRIGGER trg_clients_updated_at BEFORE UPDATE ON public.clients   FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS trg_cases_updated_at ON public.cases;
CREATE TRIGGER trg_cases_updated_at BEFORE UPDATE ON public.cases     FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS trg_hearings_updated_at ON public.hearings;
CREATE TRIGGER trg_hearings_updated_at BEFORE UPDATE ON public.hearings  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-generate reminders for ALL active users of the firm when next_date is set
CREATE OR REPLACE FUNCTION public.auto_create_reminders()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_case_ref  TEXT;
  v_plaintiff TEXT;
  v_defendant TEXT;
  v_user      RECORD;
BEGIN
  -- Clean up if next_date cleared
  IF NEW.next_date IS NULL THEN
    UPDATE public.reminders SET status = 'dismissed', acted_at = NOW()
    WHERE hearing_id = NEW.id AND status = 'upcoming';
    RETURN NEW;
  END IF;

  -- Only act when next_date actually changed
  IF TG_OP = 'UPDATE' AND OLD.next_date = NEW.next_date THEN
    RETURN NEW;
  END IF;

  SELECT case_ref_no, plaintiff_name, defendant_name
  INTO v_case_ref, v_plaintiff, v_defendant
  FROM public.cases WHERE id = NEW.case_id;

  -- Upsert one reminder per active firm user
  FOR v_user IN
    SELECT id FROM public.profiles
    WHERE firm_id = NEW.firm_id AND is_active = TRUE
  LOOP
    INSERT INTO public.reminders
      (firm_id, case_id, hearing_id, user_id, remind_date, status)
    VALUES (
      NEW.firm_id, NEW.case_id, NEW.id, v_user.id,
      NEW.next_date - INTERVAL '10 days',
      'upcoming'
    )
    ON CONFLICT (hearing_id, user_id) DO UPDATE
      SET remind_date = EXCLUDED.remind_date,
          status      = 'upcoming',
          acted_at    = NULL;

    -- Also create in-app notification
    INSERT INTO public.notifications
      (firm_id, user_id, title, body, type, ref_type, ref_id)
    VALUES (
      NEW.firm_id, v_user.id,
      'Upcoming Hearing — ' || COALESCE(v_case_ref, ''),
      COALESCE(v_plaintiff,'') || ' vs ' || COALESCE(v_defendant,'') ||
        ' on ' || TO_CHAR(NEW.next_date AT TIME ZONE 'Asia/Karachi', 'DD Mon YYYY'),
      'reminder', 'hearing', NEW.id
    );
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_reminders ON public.hearings;
CREATE TRIGGER trg_auto_reminders AFTER INSERT OR UPDATE OF next_date ON public.hearings
  FOR EACH ROW EXECUTE FUNCTION public.auto_create_reminders();

-- =============================================================================
-- TASK 3 — ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.firms          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_types     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hearings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_tokens  ENABLE ROW LEVEL SECURITY;

-- ── Helpers ───────────────────────────────────────────────────────────────────

-- Returns the firm_id of the currently authenticated user
CREATE OR REPLACE FUNCTION public.current_firm_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT firm_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Returns role of current user
CREATE OR REPLACE FUNCTION public.current_role()
RETURNS user_role LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_above()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    (SELECT role IN ('super_admin','admin') FROM public.profiles WHERE id = auth.uid()),
    FALSE
  );
$$;

-- ── firms ──
DROP POLICY IF EXISTS "firm members read own firm" ON public.firms;
CREATE POLICY "firm members read own firm" ON public.firms FOR SELECT USING (id = public.current_firm_id());

DROP POLICY IF EXISTS "super_admin manages firms" ON public.firms;
CREATE POLICY "super_admin manages firms" ON public.firms FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- ── profiles ──
DROP POLICY IF EXISTS "users read own firm profiles" ON public.profiles;
CREATE POLICY "users read own firm profiles" ON public.profiles FOR SELECT USING (firm_id = public.current_firm_id());

DROP POLICY IF EXISTS "user updates own profile" ON public.profiles;
CREATE POLICY "user updates own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());

DROP POLICY IF EXISTS "admin manages profiles" ON public.profiles;
CREATE POLICY "admin manages profiles" ON public.profiles FOR ALL USING (
    firm_id = public.current_firm_id() AND public.is_admin_or_above()
  );

-- ── clients ──
DROP POLICY IF EXISTS "firm members read clients" ON public.clients;
CREATE POLICY "firm members read clients" ON public.clients FOR SELECT USING (firm_id = public.current_firm_id());

DROP POLICY IF EXISTS "lawyer+ inserts clients" ON public.clients;
CREATE POLICY "lawyer+ inserts clients" ON public.clients FOR INSERT WITH CHECK (
    firm_id = public.current_firm_id() AND
    public.current_role() IN ('super_admin','admin','lawyer')
  );

DROP POLICY IF EXISTS "lawyer+ updates clients" ON public.clients;
CREATE POLICY "lawyer+ updates clients" ON public.clients FOR UPDATE USING (
    firm_id = public.current_firm_id() AND
    public.current_role() IN ('super_admin','admin','lawyer')
  );

DROP POLICY IF EXISTS "admin deletes clients" ON public.clients;
CREATE POLICY "admin deletes clients" ON public.clients FOR DELETE USING (
    firm_id = public.current_firm_id() AND public.is_admin_or_above()
  );
-- NOTE: clerk cannot delete (no DELETE policy for clerk role)

-- ── case_types ──
DROP POLICY IF EXISTS "firm members read case_types" ON public.case_types;
CREATE POLICY "firm members read case_types" ON public.case_types FOR SELECT USING (firm_id = public.current_firm_id());

DROP POLICY IF EXISTS "admin manages case_types" ON public.case_types;
CREATE POLICY "admin manages case_types" ON public.case_types FOR ALL USING (
    firm_id = public.current_firm_id() AND public.is_admin_or_above()
  );

-- ── courts ──
DROP POLICY IF EXISTS "firm members read courts" ON public.courts;
CREATE POLICY "firm members read courts" ON public.courts FOR SELECT USING (firm_id = public.current_firm_id());

DROP POLICY IF EXISTS "admin manages courts" ON public.courts;
CREATE POLICY "admin manages courts" ON public.courts FOR ALL USING (
    firm_id = public.current_firm_id() AND public.is_admin_or_above()
  );

-- ── cases ──
DROP POLICY IF EXISTS "firm members read cases" ON public.cases;
CREATE POLICY "firm members read cases" ON public.cases FOR SELECT USING (firm_id = public.current_firm_id());

DROP POLICY IF EXISTS "lawyer+ inserts cases" ON public.cases;
CREATE POLICY "lawyer+ inserts cases" ON public.cases FOR INSERT WITH CHECK (
    firm_id = public.current_firm_id() AND
    public.current_role() IN ('super_admin','admin','lawyer')
  );

DROP POLICY IF EXISTS "lawyer+ updates cases" ON public.cases;
CREATE POLICY "lawyer+ updates cases" ON public.cases FOR UPDATE USING (
    firm_id = public.current_firm_id() AND
    public.current_role() IN ('super_admin','admin','lawyer')
  );

DROP POLICY IF EXISTS "admin deletes cases" ON public.cases;
CREATE POLICY "admin deletes cases" ON public.cases FOR DELETE USING (
    firm_id = public.current_firm_id() AND public.is_admin_or_above()
  );

-- ── hearings ──
DROP POLICY IF EXISTS "firm members read hearings" ON public.hearings;
CREATE POLICY "firm members read hearings" ON public.hearings FOR SELECT USING (firm_id = public.current_firm_id());

DROP POLICY IF EXISTS "all firm members insert hearings" ON public.hearings;
CREATE POLICY "all firm members insert hearings" ON public.hearings FOR INSERT WITH CHECK (firm_id = public.current_firm_id());

DROP POLICY IF EXISTS "lawyer+ updates hearings" ON public.hearings;
CREATE POLICY "lawyer+ updates hearings" ON public.hearings FOR UPDATE USING (
    firm_id = public.current_firm_id() AND
    public.current_role() IN ('super_admin','admin','lawyer')
  );

DROP POLICY IF EXISTS "admin deletes hearings" ON public.hearings;
CREATE POLICY "admin deletes hearings" ON public.hearings FOR DELETE USING (
    firm_id = public.current_firm_id() AND public.is_admin_or_above()
  );

-- ── documents ──
DROP POLICY IF EXISTS "firm members read documents" ON public.documents;
CREATE POLICY "firm members read documents" ON public.documents FOR SELECT USING (firm_id = public.current_firm_id());

DROP POLICY IF EXISTS "firm members upload documents" ON public.documents;
CREATE POLICY "firm members upload documents" ON public.documents FOR INSERT WITH CHECK (firm_id = public.current_firm_id());

DROP POLICY IF EXISTS "admin deletes documents" ON public.documents;
CREATE POLICY "admin deletes documents" ON public.documents FOR DELETE USING (
    firm_id = public.current_firm_id() AND public.is_admin_or_above()
  );

-- ── reminders ──
DROP POLICY IF EXISTS "users read own reminders" ON public.reminders;
CREATE POLICY "users read own reminders" ON public.reminders FOR SELECT
  USING (firm_id = public.current_firm_id() AND user_id = auth.uid());

DROP POLICY IF EXISTS "users update own reminder status" ON public.reminders;
CREATE POLICY "users update own reminder status" ON public.reminders FOR UPDATE
  USING (firm_id = public.current_firm_id() AND user_id = auth.uid());

-- ── notifications ──
DROP POLICY IF EXISTS "users read own notifications" ON public.notifications;
CREATE POLICY "users read own notifications" ON public.notifications FOR SELECT
  USING (firm_id = public.current_firm_id() AND user_id = auth.uid());

DROP POLICY IF EXISTS "users update own notifications" ON public.notifications;
CREATE POLICY "users update own notifications" ON public.notifications FOR UPDATE
  USING (firm_id = public.current_firm_id() AND user_id = auth.uid());

-- ── device_tokens ──
DROP POLICY IF EXISTS "users manage own tokens" ON public.device_tokens;
CREATE POLICY "users manage own tokens" ON public.device_tokens FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =============================================================================
-- TASK 4 — v_cause_list VIEW
-- =============================================================================

CREATE OR REPLACE VIEW public.v_cause_list AS
SELECT
  h.id                  AS hearing_id,
  h.case_id,
  h.firm_id,
  h.serial_no,
  h.hearing_date,
  h.next_date,
  h.current_proceeding,
  h.next_proceeding,
  h.judge_name          AS hearing_judge,
  h.court_no            AS hearing_court_no,

  -- Case fields
  c.case_ref_no,
  c.plaintiff_name,
  c.defendant_name,
  c.From,
  c.status              AS case_status,
  c.judge_name          AS case_judge,
  c.court_no            AS case_court_no,

  -- Client
  cl.full_name          AS client_name,
  cl.phone              AS client_phone,

  -- Case type
  ct.name               AS case_type_name,
  ct.requires_offence,

  -- Previous date: max hearing_date from same case BEFORE this hearing
  (
    SELECT MAX(h2.hearing_date)
    FROM public.hearings h2
    WHERE h2.case_id = h.case_id
      AND h2.hearing_date < h.hearing_date
  )                     AS previous_date,

  -- Is this the latest hearing for the case?
  (h.hearing_date = (
    SELECT MAX(h3.hearing_date)
    FROM public.hearings h3
    WHERE h3.case_id = h.case_id
  ))                    AS is_latest_hearing

FROM public.hearings   h
JOIN public.cases      c  ON c.id  = h.case_id
JOIN public.clients    cl ON cl.id = c.client_id
JOIN public.case_types ct ON ct.id = c.case_type_id;

COMMENT ON VIEW public.v_cause_list IS
  'Joined view for cause list and running cases. Filter: hearing_date = today for cause list; is_latest_hearing = true for running cases.';

-- RLS on view: inherit from underlying tables via security_invoker
ALTER VIEW public.v_cause_list SET (security_invoker = true);

-- =============================================================================
-- TASK 5 — STORAGE BUCKET (run separately or via dashboard)
-- =============================================================================
-- Supabase Storage buckets cannot be created in SQL migrations directly.
-- Run this block in the Supabase Dashboard → SQL Editor AFTER migration:
--
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--   'documents', 'documents', false,
--   52428800,   -- 50 MB
--   ARRAY['application/pdf','image/jpeg','image/png','image/webp',
--         'application/msword',
--         'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
-- ) ON CONFLICT DO NOTHING;
--
-- -- Storage RLS
-- CREATE POLICY "firm upload"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'documents' AND auth.uid() IS NOT NULL AND
--     (storage.foldername(name))[1] = public.current_firm_id()::TEXT
--   );
--
-- CREATE POLICY "firm read"
--   ON storage.objects FOR SELECT
--   USING (
--     bucket_id = 'documents' AND auth.uid() IS NOT NULL AND
--     (storage.foldername(name))[1] = public.current_firm_id()::TEXT
--   );
--
-- CREATE POLICY "admin delete"
--   ON storage.objects FOR DELETE
--   USING (
--     bucket_id = 'documents' AND public.is_admin_or_above() AND
--     (storage.foldername(name))[1] = public.current_firm_id()::TEXT
--   );


-- -----------------------------------------------------------------------------
-- Migration: 20240002000000_case_notes_softdelete.sql
-- -----------------------------------------------------------------------------
-- =============================================================================
-- Migration 002: case_notes table + soft-delete on cases
-- =============================================================================

-- ─── Soft-delete column on cases ─────────────────────────────────────────────
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS
  deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Index so queries that exclude soft-deleted rows stay fast
CREATE INDEX IF NOT EXISTS idx_cases_deleted_at
  ON public.cases (deleted_at) WHERE deleted_at IS NULL;

-- ─── Case Notes ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.case_notes (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id     UUID        NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  firm_id     UUID        NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  body        TEXT        NOT NULL,
  created_by  UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_case_notes_case
  ON public.case_notes (case_id, created_at DESC);

DROP TRIGGER IF EXISTS trg_case_notes_updated_at ON public.case_notes;
CREATE TRIGGER trg_case_notes_updated_at BEFORE UPDATE ON public.case_notes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── RLS on case_notes ────────────────────────────────────────────────────────
ALTER TABLE public.case_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "firm members read notes" ON public.case_notes;
CREATE POLICY "firm members read notes" ON public.case_notes FOR SELECT
  USING (firm_id = public.current_firm_id());

DROP POLICY IF EXISTS "firm members insert notes" ON public.case_notes;
CREATE POLICY "firm members insert notes" ON public.case_notes FOR INSERT
  WITH CHECK (firm_id = public.current_firm_id());

DROP POLICY IF EXISTS "author or admin update notes" ON public.case_notes;
CREATE POLICY "author or admin update notes" ON public.case_notes FOR UPDATE
  USING (
    firm_id = public.current_firm_id() AND
    (created_by = auth.uid() OR public.is_admin_or_above())
  );

DROP POLICY IF EXISTS "admin deletes notes" ON public.case_notes;
CREATE POLICY "admin deletes notes" ON public.case_notes FOR DELETE
  USING (firm_id = public.current_firm_id() AND public.is_admin_or_above());

-- ─── Update v_cause_list to exclude soft-deleted cases ───────────────────────
CREATE OR REPLACE VIEW public.v_cause_list AS
SELECT
  h.id                  AS hearing_id,
  h.case_id,
  h.firm_id,
  h.serial_no,
  h.hearing_date,
  h.next_date,
  h.current_proceeding,
  h.next_proceeding,
  h.judge_name          AS hearing_judge,
  h.court_no            AS hearing_court_no,
  c.case_ref_no,
  c.plaintiff_name,
  c.defendant_name,
  c.From,
  c.status              AS case_status,
  c.judge_name          AS case_judge,
  c.court_no            AS case_court_no,
  cl.full_name          AS client_name,
  cl.phone              AS client_phone,
  ct.name               AS case_type_name,
  ct.requires_offence,
  (
    SELECT MAX(h2.hearing_date)
    FROM public.hearings h2
    WHERE h2.case_id = h.case_id
      AND h2.hearing_date < h.hearing_date
  ) AS previous_date,
  (h.hearing_date = (
    SELECT MAX(h3.hearing_date)
    FROM public.hearings h3
    WHERE h3.case_id = h.case_id
  )) AS is_latest_hearing
FROM public.hearings   h
JOIN public.cases      c  ON c.id  = h.case_id  AND c.deleted_at IS NULL
JOIN public.clients    cl ON cl.id = c.client_id
JOIN public.case_types ct ON ct.id = c.case_type_id;

ALTER VIEW public.v_cause_list SET (security_invoker = true);


-- -----------------------------------------------------------------------------
-- Migration: 20240003000000_activity_log.sql
-- -----------------------------------------------------------------------------
-- =============================================================================
-- Migration 003: case_activity_log + close_case_reminders function
-- =============================================================================

-- ─── Activity Log ─────────────────────────────────────────────────────────────
DO $$ BEGIN CREATE TYPE activity_event AS ENUM (
  'case_created',
  'case_updated',
  'case_decided',
  'case_reopened',
  'hearing_added',
  'hearing_updated',
  'document_added',
  'document_deleted',
  'note_added',
  'note_deleted',
  'reminder_dismissed'
); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.case_activity_log (
  id          UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id     UUID           NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  firm_id     UUID           NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  event       activity_event NOT NULL,
  actor_id    UUID           REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_name  TEXT,                     -- denormalised for display after user deletion
  summary     TEXT           NOT NULL,  -- human-readable description
  meta        JSONB,                    -- optional structured data (old/new values)
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_log_case   ON public.case_activity_log (case_id, created_at DESC);
CREATE INDEX idx_activity_log_firm   ON public.case_activity_log (firm_id, created_at DESC);
CREATE INDEX idx_activity_log_actor  ON public.case_activity_log (actor_id) WHERE actor_id IS NOT NULL;

-- RLS
ALTER TABLE public.case_activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "firm members read activity" ON public.case_activity_log;
CREATE POLICY "firm members read activity" ON public.case_activity_log FOR SELECT
  USING (firm_id = public.current_firm_id());

-- Only the backend (service role / triggers) inserts activity log rows.
-- The client never inserts directly — use the log_case_activity() function.
DROP POLICY IF EXISTS "firm members insert activity" ON public.case_activity_log;
CREATE POLICY "firm members insert activity" ON public.case_activity_log FOR INSERT
  WITH CHECK (firm_id = public.current_firm_id());

-- ─── Helper: log_case_activity() ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.log_case_activity(
  p_case_id   UUID,
  p_firm_id   UUID,
  p_event     activity_event,
  p_actor_id  UUID,
  p_summary   TEXT,
  p_meta      JSONB DEFAULT NULL
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_actor_name TEXT;
BEGIN
  SELECT full_name INTO v_actor_name FROM public.profiles WHERE id = p_actor_id;
  INSERT INTO public.case_activity_log
    (case_id, firm_id, event, actor_id, actor_name, summary, meta)
  VALUES
    (p_case_id, p_firm_id, p_event, p_actor_id, v_actor_name, p_summary, p_meta);
END;
$$;

-- ─── Auto-log when a case is created ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.auto_log_case_created()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.log_case_activity(
    NEW.id, NEW.firm_id, 'case_created'::activity_event,
    NEW.created_by,
    'Case ' || NEW.case_ref_no || ' created — ' || NEW.plaintiff_name || ' vs ' || NEW.defendant_name
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_case_created ON public.cases;
CREATE TRIGGER trg_log_case_created AFTER INSERT ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.auto_log_case_created();

-- ─── Auto-log when a case status changes (decided / reopened) ─────────────────
CREATE OR REPLACE FUNCTION public.auto_log_case_status()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF OLD.status <> NEW.status THEN
    IF NEW.status = 'decided' THEN
      PERFORM public.log_case_activity(
        NEW.id, NEW.firm_id, 'case_decided'::activity_event,
        auth.uid(),
        'Case decided — outcome: ' || COALESCE(NEW.outcome::TEXT, '—') ||
        ', date: ' || TO_CHAR(NEW.decision_date, 'DD Mon YYYY'),
        jsonb_build_object('outcome', NEW.outcome, 'decision_date', NEW.decision_date)
      );
    ELSIF NEW.status = 'running' AND OLD.status = 'decided' THEN
      PERFORM public.log_case_activity(
        NEW.id, NEW.firm_id, 'case_reopened'::activity_event,
        auth.uid(),
        'Case reopened and moved back to Running.'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_case_status ON public.cases;
CREATE TRIGGER trg_log_case_status AFTER UPDATE OF status ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.auto_log_case_status();

-- ─── Auto-log when a hearing is added ────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.auto_log_hearing()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_ref TEXT;
BEGIN
  SELECT case_ref_no INTO v_ref FROM public.cases WHERE id = NEW.case_id;
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_case_activity(
      NEW.case_id, NEW.firm_id, 'hearing_added'::activity_event,
      NEW.created_by,
      'Hearing added for ' || COALESCE(v_ref,'') || ' on ' ||
        TO_CHAR(NEW.hearing_date, 'DD Mon YYYY') ||
        CASE WHEN NEW.next_date IS NOT NULL
          THEN ' — next date: ' || TO_CHAR(NEW.next_date, 'DD Mon YYYY')
          ELSE '' END
    );
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.log_case_activity(
      NEW.case_id, NEW.firm_id, 'hearing_updated'::activity_event,
      NEW.created_by,
      'Hearing updated for ' || COALESCE(v_ref,'') || ' on ' ||
        TO_CHAR(NEW.hearing_date, 'DD Mon YYYY')
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_hearing ON public.hearings;
CREATE TRIGGER trg_log_hearing AFTER INSERT OR UPDATE OF current_proceeding, next_date ON public.hearings
  FOR EACH ROW EXECUTE FUNCTION public.auto_log_hearing();

-- ─── Auto-log when a document is added/deleted ───────────────────────────────
CREATE OR REPLACE FUNCTION public.auto_log_document()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.case_id IS NOT NULL THEN
    IF TG_OP = 'INSERT' THEN
      PERFORM public.log_case_activity(
        NEW.case_id, NEW.firm_id, 'document_added'::activity_event,
        NEW.uploaded_by, 'Document uploaded: ' || NEW.name
      );
    ELSE
      PERFORM public.log_case_activity(
        OLD.case_id, OLD.firm_id, 'document_deleted'::activity_event,
        auth.uid(), 'Document deleted: ' || OLD.name
      );
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_log_document ON public.documents;
CREATE TRIGGER trg_log_document AFTER INSERT OR DELETE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.auto_log_document();

-- ─── close_case_reminders(): dismiss all upcoming reminders when case decided ──
CREATE OR REPLACE FUNCTION public.close_case_reminders(p_case_id UUID)
RETURNS INT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE rows_updated INT;
BEGIN
  UPDATE public.reminders
    SET status   = 'dismissed',
        acted_at = NOW()
  WHERE case_id = p_case_id
    AND status  = 'upcoming';

  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  RETURN rows_updated;
END;
$$;


-- -----------------------------------------------------------------------------
-- Migration: 20240004000000_reminders_notifications.sql
-- -----------------------------------------------------------------------------
-- =============================================================================
-- Migration 004: generate_reminders(), pg_cron, notification_preferences,
--                urgency tiers, VAPID key storage
-- =============================================================================

-- ─── Urgency enum ─────────────────────────────────────────────────────────────
DO $$ BEGIN CREATE TYPE reminder_urgency AS ENUM ('low', 'medium', 'high', 'critical'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Add urgency and notification delivery metadata to reminders.
-- days_left is calculated from the hearing date by the application; a
-- generated column cannot depend on CURRENT_DATE because it is not immutable.
ALTER TABLE public.reminders
  ADD COLUMN IF NOT EXISTS urgency      reminder_urgency NOT NULL DEFAULT 'low',
  ADD COLUMN IF NOT EXISTS days_left    INT,
  ADD COLUMN IF NOT EXISTS last_notified_at TIMESTAMPTZ;

-- ─── Notification Preferences ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID        NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  firm_id             UUID        NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  remind_days_before  INT         NOT NULL DEFAULT 10
                                  CHECK (remind_days_before BETWEEN 1 AND 30),
  notify_reminders    BOOLEAN     NOT NULL DEFAULT TRUE,
  notify_daily_summary BOOLEAN    NOT NULL DEFAULT TRUE,
  notify_case_updates BOOLEAN     NOT NULL DEFAULT TRUE,
  notify_system       BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notif_prefs_user ON public.notification_preferences (user_id);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users manage own prefs" ON public.notification_preferences;
CREATE POLICY "users manage own prefs" ON public.notification_preferences FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin read firm prefs" ON public.notification_preferences;
CREATE POLICY "admin read firm prefs" ON public.notification_preferences FOR SELECT
  USING (firm_id = public.current_firm_id() AND public.is_admin_or_above());

DROP TRIGGER IF EXISTS trg_notif_prefs_updated_at ON public.notification_preferences;
CREATE TRIGGER trg_notif_prefs_updated_at BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create preferences for new users
CREATE OR REPLACE FUNCTION public.create_default_notif_prefs()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.notification_preferences (user_id, firm_id)
  VALUES (NEW.id, NEW.firm_id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_default_notif_prefs ON public.profiles;
CREATE TRIGGER trg_default_notif_prefs AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_default_notif_prefs();

-- ─── VAPID Keys (firm-level Web Push) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.vapid_keys (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  firm_id      UUID        NOT NULL UNIQUE REFERENCES public.firms(id) ON DELETE CASCADE,
  public_key   TEXT        NOT NULL,
  private_key  TEXT        NOT NULL,  -- stored encrypted; only accessed by Edge Functions
  subject      TEXT        NOT NULL DEFAULT 'mailto:admin@mzm.pk',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Only Edge Functions (service role) access this table — no RLS for anon/user
ALTER TABLE public.vapid_keys ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "no client access" ON public.vapid_keys;
CREATE POLICY "no client access" ON public.vapid_keys USING (FALSE);

-- ─── Web Push Subscriptions ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  endpoint     TEXT        NOT NULL UNIQUE,
  p256dh       TEXT        NOT NULL,  -- public key
  auth_key     TEXT        NOT NULL,  -- auth secret
  user_agent   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_push_subs_user ON public.push_subscriptions (user_id);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users manage own push subs" ON public.push_subscriptions;
CREATE POLICY "users manage own push subs" ON public.push_subscriptions FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ─── generate_reminders() ─────────────────────────────────────────────────────
-- Idempotent: safe to call multiple times per day.
-- Creates/updates reminders for all running cases where next_date is within
-- remind_days_before days. Closes reminders for decided cases.
-- Sets urgency tier based on days remaining.

CREATE OR REPLACE FUNCTION public.generate_reminders(
  p_firm_id UUID DEFAULT NULL   -- NULL = process all firms
)
RETURNS TABLE(
  processed_cases INT,
  created_reminders INT,
  closed_reminders INT
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_case        RECORD;
  v_hearing     RECORD;
  v_user        RECORD;
  v_created     INT := 0;
  v_closed      INT := 0;
  v_processed   INT := 0;
  v_days_left   INT;
  v_urgency     reminder_urgency;
  v_remind_days INT;
BEGIN
  -- 1. Close reminders for decided/soft-deleted cases
  UPDATE public.reminders r
    SET status   = 'dismissed',
        acted_at = NOW()
  FROM public.cases c
  WHERE r.case_id     = c.id
    AND r.status      = 'upcoming'
    AND (c.status     = 'decided' OR c.deleted_at IS NOT NULL)
    AND (p_firm_id IS NULL OR r.firm_id = p_firm_id);
  GET DIAGNOSTICS v_closed = ROW_COUNT;

  -- 2. For each running case, find the latest hearing with a future next_date
  FOR v_case IN
    SELECT DISTINCT ON (c.id)
           c.id            AS case_id,
           c.firm_id,
           c.case_ref_no,
           c.plaintiff_name,
           c.defendant_name,
           h.id            AS hearing_id,
           h.next_date
    FROM public.cases    c
    JOIN public.hearings h ON h.case_id = c.id
    WHERE c.status       = 'running'
      AND c.deleted_at   IS NULL
      AND h.next_date    IS NOT NULL
      AND h.next_date    >= CURRENT_DATE
      AND (p_firm_id IS NULL OR c.firm_id = p_firm_id)
    ORDER BY c.id, h.hearing_date DESC
  LOOP
    v_processed := v_processed + 1;

    -- Per-user remind_days_before preference (fall back to firm default 10)
    FOR v_user IN
      SELECT p.id AS user_id,
             COALESCE(np.remind_days_before, 10)        AS remind_days,
             COALESCE(np.notify_reminders, TRUE)        AS notify_reminders
      FROM   public.profiles p
      LEFT   JOIN public.notification_preferences np ON np.user_id = p.id
      WHERE  p.firm_id   = v_case.firm_id
        AND  p.is_active = TRUE
        AND  p.role      IN ('admin', 'lawyer', 'super_admin')
    LOOP
      CONTINUE WHEN NOT v_user.notify_reminders;

      v_days_left   := v_case.next_date - CURRENT_DATE;
      v_remind_days := v_user.remind_days;

      -- Only generate if within the remind window
      CONTINUE WHEN v_days_left > v_remind_days;

      -- Urgency tiers
      v_urgency := CASE
        WHEN v_days_left = 0             THEN 'critical'
        WHEN v_days_left <= 3            THEN 'high'
        WHEN v_days_left <= 7            THEN 'medium'
        ELSE                                  'low'
      END;

      -- Upsert reminder (unique: hearing_id + user_id)
      INSERT INTO public.reminders
        (firm_id, case_id, hearing_id, user_id, remind_date, status, urgency)
      VALUES (
        v_case.firm_id,
        v_case.case_id,
        v_case.hearing_id,
        v_user.user_id,
        v_case.next_date - v_remind_days,
        'upcoming',
        v_urgency
      )
      ON CONFLICT (hearing_id, user_id) DO UPDATE
        SET remind_date = EXCLUDED.remind_date,
            urgency     = EXCLUDED.urgency,
            status      = CASE
              WHEN reminders.status = 'upcoming' THEN 'upcoming'
              ELSE reminders.status
            END;

      -- Create in-app notification (once per urgency tier per day)
      IF NOT EXISTS (
        SELECT 1 FROM public.notifications
        WHERE ref_type  = 'hearing'
          AND ref_id    = v_case.hearing_id
          AND user_id   = v_user.user_id
          AND created_at::date = CURRENT_DATE
      ) THEN
        INSERT INTO public.notifications
          (firm_id, user_id, title, body, type, ref_type, ref_id)
        VALUES (
          v_case.firm_id,
          v_user.user_id,
          CASE v_urgency
            WHEN 'critical' THEN '🔴 Hearing TODAY — ' || v_case.case_ref_no
            WHEN 'high'     THEN '🟠 Hearing in ' || v_days_left || ' days — ' || v_case.case_ref_no
            ELSE                 'Upcoming Hearing — ' || v_case.case_ref_no
          END,
          v_case.plaintiff_name || ' vs ' || v_case.defendant_name ||
          ' on ' || TO_CHAR(v_case.next_date AT TIME ZONE 'Asia/Karachi', 'DD Mon YYYY'),
          'reminder',
          'hearing',
          v_case.hearing_id
        );
        v_created := v_created + 1;
      END IF;
    END LOOP;
  END LOOP;

  RETURN QUERY SELECT v_processed, v_created, v_closed;
END;
$$;

-- ─── Daily morning summary notification ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.send_daily_summary()
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_firm   RECORD;
  v_user   RECORD;
  v_count  INT;
BEGIN
  FOR v_firm IN SELECT id FROM public.firms WHERE subscription_status IN ('active','trial')
  LOOP
    FOR v_user IN
      SELECT p.id AS user_id
      FROM   public.profiles p
      LEFT   JOIN public.notification_preferences np ON np.user_id = p.id
      WHERE  p.firm_id   = v_firm.id
        AND  p.is_active = TRUE
        AND  COALESCE(np.notify_daily_summary, TRUE) = TRUE
    LOOP
      SELECT COUNT(*) INTO v_count
      FROM public.hearings h
      JOIN public.cases    c ON c.id = h.case_id
      WHERE h.hearing_date = CURRENT_DATE
        AND c.firm_id      = v_firm.id
        AND c.status       = 'running'
        AND c.deleted_at   IS NULL;

      IF v_count > 0 THEN
        INSERT INTO public.notifications
          (firm_id, user_id, title, body, type, ref_type, ref_id)
        VALUES (
          v_firm.id,
          v_user.user_id,
          'Good morning — ' || v_count || ' hearing' || CASE WHEN v_count > 1 THEN 's' ELSE '' END || ' today',
          'Check today''s cause list for details.',
          'system',
          NULL, NULL
        );
      END IF;
    END LOOP;
  END LOOP;
END;
$$;

-- ─── pg_cron schedules (6:00 AM Asia/Karachi = 01:00 UTC) ────────────────────
-- Run in Supabase SQL Editor after enabling the pg_cron extension:

SELECT cron.schedule(
  'generate-reminders-daily',
  '0 1 * * *',        -- 01:00 UTC = 06:00 PKT
  $$SELECT public.generate_reminders()$$
);

DO $$ BEGIN
  PERFORM cron.unschedule('daily-summary-morning');
  PERFORM cron.schedule('daily-summary-morning', '0 1 * * *', $$SELECT public.send_daily_summary()$$);
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'cron.schedule (daily-summary-morning) skipped: %', SQLERRM;
END $$;

-- ─── Realtime: enable on reminders + notifications ────────────────────────────
-- Run in Supabase Dashboard → Database → Replication → Tables → enable these:
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.reminders;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
-- (Cannot be run in a migration file; must be done via Dashboard or CLI)


-- -----------------------------------------------------------------------------
-- Migration: 20240005000000_phase7_reminder_delivery.sql
-- -----------------------------------------------------------------------------
-- =============================================================================
-- Migration 005: reliable reminders, notification delivery, and Realtime
-- =============================================================================

ALTER TABLE public.firms
  ADD COLUMN IF NOT EXISTS default_remind_days_before INT NOT NULL DEFAULT 10
    CHECK (default_remind_days_before BETWEEN 1 AND 30);

ALTER TABLE public.notification_preferences
  ALTER COLUMN remind_days_before DROP NOT NULL,
  ALTER COLUMN remind_days_before DROP DEFAULT;

ALTER TABLE public.notification_preferences
  DROP CONSTRAINT IF EXISTS notification_preferences_remind_days_before_check;

ALTER TABLE public.notification_preferences
  ADD CONSTRAINT notification_preferences_remind_days_before_check
    CHECK (remind_days_before IS NULL OR remind_days_before BETWEEN 1 AND 30);

ALTER TABLE public.reminders
  DROP COLUMN IF EXISTS days_left,
  ADD COLUMN IF NOT EXISTS next_date DATE;

UPDATE public.reminders r
SET next_date = h.next_date
FROM public.hearings h
WHERE h.id = r.hearing_id
  AND r.next_date IS NULL;

ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS dedupe_key TEXT,
  ADD COLUMN IF NOT EXISTS push_dispatched_at TIMESTAMPTZ;

COMMENT ON TABLE public.vapid_keys IS
  'Legacy VAPID storage table; the application uses Supabase Edge Function secrets instead.';
COMMENT ON COLUMN public.vapid_keys.private_key IS
  'Do not store raw private keys here. Configure VAPID_PRIVATE_KEY as an Edge Function secret.';

-- The earlier per-hearing trigger sent reminders to every firm member and
-- could recreate a reminder immediately after a user marked it done.
DROP TRIGGER IF EXISTS trg_auto_reminders ON public.hearings;

CREATE UNIQUE INDEX IF NOT EXISTS idx_notifications_dedupe_key
  ON public.notifications (dedupe_key)
  WHERE dedupe_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reminders_user_status_date
  ON public.reminders (user_id, status, next_date);

-- Existing preference rows should inherit their firm's default until the user
-- explicitly chooses a personal reminder window.
UPDATE public.notification_preferences
SET remind_days_before = NULL;

CREATE OR REPLACE FUNCTION public.generate_reminders(p_firm_id UUID DEFAULT NULL)
RETURNS TABLE (
  processed_cases INT,
  created_reminders INT,
  closed_reminders INT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today DATE := (NOW() AT TIME ZONE 'Asia/Karachi')::DATE;
  v_case RECORD;
  v_user RECORD;
  v_reminder_id UUID;
  v_days_left INT;
  v_days_before INT;
  v_urgency reminder_urgency;
  v_created INT := 0;
  v_closed INT := 0;
  v_processed INT := 0;
  v_inserted INT;
  v_was_new BOOLEAN;
BEGIN
  -- A reminder belongs to the current latest hearing only. Replacing a
  -- hearing's next date or adding a later hearing retires the previous row.
  UPDATE public.reminders r
  SET status = 'dismissed', acted_at = NOW()
  WHERE r.status = 'upcoming'
    AND (p_firm_id IS NULL OR r.firm_id = p_firm_id)
    AND (
      r.next_date IS DISTINCT FROM (
        SELECT h.next_date
        FROM public.hearings h
        WHERE h.id = r.hearing_id
      )
      OR r.next_date IS NULL
      OR r.next_date < v_today
      OR r.next_date > v_today + COALESCE(
        (
          SELECT np.remind_days_before
          FROM public.notification_preferences np
          WHERE np.user_id = r.user_id
        ),
        (
          SELECT f.default_remind_days_before
          FROM public.firms f
          WHERE f.id = r.firm_id
        ),
        10
      )
      OR NOT EXISTS (
        SELECT 1
        FROM public.cases c
        WHERE c.id = r.case_id
          AND c.status = 'running'
          AND c.deleted_at IS NULL
          AND c.firm_id = r.firm_id
      )
      OR NOT EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = r.user_id
          AND p.is_active = TRUE
          AND p.role IN ('super_admin', 'admin', 'lawyer')
      )
      OR NOT EXISTS (
        SELECT 1
        FROM public.hearings latest
        WHERE latest.id = r.hearing_id
          AND latest.case_id = r.case_id
          AND latest.id = (
            SELECT h2.id
            FROM public.hearings h2
            WHERE h2.case_id = r.case_id
            ORDER BY h2.hearing_date DESC, h2.created_at DESC, h2.id DESC
            LIMIT 1
          )
      )
    );
  GET DIAGNOSTICS v_closed = ROW_COUNT;

  FOR v_case IN
    SELECT c.id AS case_id,
           c.firm_id,
           c.case_ref_no,
           c.plaintiff_name,
           c.defendant_name,
           c.From,
           h.id AS hearing_id,
           h.next_date,
           COALESCE(h.court_no, c.court_no) AS court_no
    FROM public.cases c
    JOIN LATERAL (
      SELECT h1.id, h1.next_date, h1.court_no
      FROM public.hearings h1
      WHERE h1.case_id = c.id
      ORDER BY h1.hearing_date DESC, h1.created_at DESC, h1.id DESC
      LIMIT 1
    ) h ON TRUE
    WHERE c.status = 'running'
      AND c.deleted_at IS NULL
      AND h.next_date BETWEEN v_today AND v_today + 30
      AND (p_firm_id IS NULL OR c.firm_id = p_firm_id)
  LOOP
    v_processed := v_processed + 1;
    v_days_left := v_case.next_date - v_today;

    FOR v_user IN
      SELECT p.id AS user_id,
             COALESCE(np.remind_days_before, f.default_remind_days_before, 10)
               AS days_before,
             COALESCE(np.notify_reminders, TRUE) AS notify_reminders
      FROM public.profiles p
      JOIN public.firms f ON f.id = p.firm_id
      LEFT JOIN public.notification_preferences np ON np.user_id = p.id
      WHERE p.firm_id = v_case.firm_id
        AND p.is_active = TRUE
        AND p.role IN ('super_admin', 'admin', 'lawyer')
    LOOP
      v_days_before := v_user.days_before;
      CONTINUE WHEN v_days_left > v_days_before;

      v_urgency := CASE
        WHEN v_days_left = 0 THEN 'critical'
        WHEN v_days_left <= 3 THEN 'high'
        WHEN v_days_left <= 7 THEN 'medium'
        ELSE 'low'
      END;

      SELECT NOT EXISTS (
        SELECT 1
        FROM public.reminders existing
        WHERE existing.hearing_id = v_case.hearing_id
          AND existing.user_id = v_user.user_id
      ) INTO v_was_new;

      v_reminder_id := NULL;
      INSERT INTO public.reminders AS existing_reminder
        (firm_id, case_id, hearing_id, user_id, remind_date, next_date, status, urgency, acted_at)
      VALUES
        (v_case.firm_id, v_case.case_id, v_case.hearing_id, v_user.user_id,
         v_case.next_date - v_days_before, v_case.next_date, 'upcoming', v_urgency, NULL)
      ON CONFLICT (hearing_id, user_id) DO UPDATE
        SET remind_date = EXCLUDED.remind_date,
            next_date = EXCLUDED.next_date,
            urgency = EXCLUDED.urgency,
            status = CASE
              WHEN existing_reminder.next_date IS DISTINCT FROM EXCLUDED.next_date
                THEN 'upcoming'::reminder_status
              ELSE existing_reminder.status
            END,
            acted_at = CASE
              WHEN existing_reminder.next_date IS DISTINCT FROM EXCLUDED.next_date
                THEN NULL
              ELSE existing_reminder.acted_at
            END
      RETURNING id INTO v_reminder_id;
      GET DIAGNOSTICS v_inserted = ROW_COUNT;
      IF v_was_new AND v_inserted > 0 THEN
        v_created := v_created + 1;
      END IF;

      IF v_user.notify_reminders AND EXISTS (
        SELECT 1
        FROM public.reminders active_reminder
        WHERE active_reminder.id = v_reminder_id
          AND active_reminder.status = 'upcoming'
      ) THEN
        INSERT INTO public.notifications
          (firm_id, user_id, title, body, type, ref_type, ref_id, dedupe_key)
        VALUES (
          v_case.firm_id,
          v_user.user_id,
          CASE
            WHEN v_days_left = 0 THEN 'Hearing today — ' || v_case.case_ref_no
            WHEN v_days_left = 1 THEN 'Hearing tomorrow — ' || v_case.case_ref_no
            WHEN v_days_left <= 3 THEN 'Hearing in ' || v_days_left || ' days — ' || v_case.case_ref_no
            ELSE 'Upcoming hearing — ' || v_case.case_ref_no
          END,
          v_case.plaintiff_name || ' vs ' || v_case.defendant_name ||
            ' · ' || TO_CHAR(v_case.next_date, 'DD Mon YYYY') ||
            COALESCE(' · ' || v_case.court_no, ''),
          'reminder',
          'case',
          v_case.case_id,
          'reminder:' || v_reminder_id::TEXT || ':' || v_today::TEXT
        )
        ON CONFLICT (dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING;
        UPDATE public.reminders
        SET last_notified_at = NOW()
        WHERE id = v_reminder_id;
      END IF;
    END LOOP;
  END LOOP;

  RETURN QUERY SELECT v_processed, v_created, v_closed;
END;
$$;

CREATE OR REPLACE FUNCTION public.send_daily_summary()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today DATE := (NOW() AT TIME ZONE 'Asia/Karachi')::DATE;
  v_firm RECORD;
  v_user RECORD;
  v_count INT;
BEGIN
  FOR v_firm IN
    SELECT f.id
    FROM public.firms f
    WHERE f.subscription_status IN ('active', 'trial')
  LOOP
    SELECT COUNT(*) INTO v_count
    FROM public.hearings h
    JOIN public.cases c ON c.id = h.case_id
    WHERE h.hearing_date = v_today
      AND c.firm_id = v_firm.id
      AND c.status = 'running'
      AND c.deleted_at IS NULL;

    CONTINUE WHEN v_count = 0;

    FOR v_user IN
      SELECT p.id AS user_id
      FROM public.profiles p
      LEFT JOIN public.notification_preferences np ON np.user_id = p.id
      WHERE p.firm_id = v_firm.id
        AND p.is_active = TRUE
        AND COALESCE(np.notify_daily_summary, TRUE) = TRUE
    LOOP
      INSERT INTO public.notifications
        (firm_id, user_id, title, body, type, dedupe_key)
      VALUES (
        v_firm.id,
        v_user.user_id,
        'Today''s cause list',
        'You have ' || v_count || ' hearing' || CASE WHEN v_count = 1 THEN '' ELSE 's' END || ' today.',
        'daily_summary',
        'daily-summary:' || v_user.user_id::TEXT || ':' || v_today::TEXT
      )
      ON CONFLICT (dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_firm_reminder_default(p_days INT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin_or_above() THEN
    RAISE EXCEPTION 'Only firm admins can change the reminder default.';
  END IF;
  IF p_days IS NULL OR p_days < 1 OR p_days > 30 THEN
    RAISE EXCEPTION 'Reminder default must be between 1 and 30 days.';
  END IF;

  UPDATE public.firms
  SET default_remind_days_before = p_days
  WHERE id = public.current_firm_id();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No firm is associated with the current user.';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.generate_reminders(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.send_daily_summary() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_firm_reminder_default(INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.generate_reminders(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.send_daily_summary() TO service_role;
GRANT EXECUTE ON FUNCTION public.set_firm_reminder_default(INT) TO authenticated;

-- Keep cron jobs idempotent when this migration is applied to a database where
-- the earlier phase migration already scheduled them.
DO $$
DECLARE v_job RECORD;
BEGIN
  FOR v_job IN
    SELECT jobid
    FROM cron.job
    WHERE jobname IN ('generate-reminders-daily', 'daily-summary-morning')
  LOOP
    PERFORM cron.unschedule(v_job.jobid);
  END LOOP;
END;
$$;

DO $$ BEGIN
  PERFORM cron.unschedule('generate-reminders-daily');
  PERFORM cron.schedule('generate-reminders-daily', '0 1 * * *', $$SELECT public.generate_reminders()$$);
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'cron.schedule (generate-reminders-daily) skipped: %', SQLERRM;
END $$;

DO $$ BEGIN
  PERFORM cron.unschedule('daily-summary-morning');
  PERFORM cron.schedule('daily-summary-morning', '0 1 * * *', $$SELECT public.send_daily_summary()$$);
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'cron.schedule (daily-summary-morning) skipped: %', SQLERRM;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'reminders'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.reminders;
    END IF;
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'notifications'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
    END IF;
  END IF;
END;
$$;


-- -----------------------------------------------------------------------------
-- Migration: 20240006000000_stage2_p0_p1.sql
-- -----------------------------------------------------------------------------
-- Stage 2 Part 1: profile protection, storage, atomic case workflows and filters.

-- Prevent users from changing firm membership; only firm admins may manage
-- roles and activation state for profiles in their own firm.
DROP POLICY IF EXISTS "users update own safe profile" ON public.profiles;
CREATE POLICY "users update own safe profile" ON public.profiles FOR UPDATE
  USING (id = auth.uid() AND firm_id = public.current_firm_id())
  WITH CHECK (id = auth.uid() AND firm_id = public.current_firm_id());

DROP POLICY IF EXISTS "admins update profiles in own firm" ON public.profiles;
CREATE POLICY "admins update profiles in own firm" ON public.profiles FOR UPDATE
  USING (firm_id = public.current_firm_id() AND public.is_admin_or_above())
  WITH CHECK (firm_id = public.current_firm_id() AND public.is_admin_or_above());

CREATE OR REPLACE FUNCTION public.guard_profile_updates()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.id IS DISTINCT FROM OLD.id
     OR NEW.email IS DISTINCT FROM OLD.email
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Profile identity fields cannot be changed through profile updates.';
  END IF;

  IF NEW.firm_id IS DISTINCT FROM OLD.firm_id THEN
    RAISE EXCEPTION 'Profile firm membership cannot be changed.';
  END IF;

  IF (NEW.role IS DISTINCT FROM OLD.role OR NEW.is_active IS DISTINCT FROM OLD.is_active)
     AND NOT public.is_admin_or_above() THEN
    RAISE EXCEPTION 'Only firm administrators may change profile roles or activation.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_profile_updates ON public.profiles;
CREATE TRIGGER trg_guard_profile_updates BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_updates();

-- The view has one, deterministic latest hearing even when multiple rows share
-- the maximum hearing_date.
CREATE OR REPLACE VIEW public.v_cause_list AS
SELECT
  h.id AS hearing_id,
  h.case_id,
  h.firm_id,
  h.serial_no,
  h.hearing_date,
  h.next_date,
  h.current_proceeding,
  h.next_proceeding,
  h.judge_name AS hearing_judge,
  h.court_no AS hearing_court_no,
  c.case_ref_no,
  c.plaintiff_name,
  c.defendant_name,
  c.From,
  c.status AS case_status,
  c.judge_name AS case_judge,
  c.court_no AS case_court_no,
  cl.full_name AS client_name,
  cl.phone AS client_phone,
  ct.name AS case_type_name,
  ct.requires_offence,
  (
    SELECT MAX(h2.hearing_date)
    FROM public.hearings h2
    WHERE h2.case_id = h.case_id
      AND h2.hearing_date < h.hearing_date
  ) AS previous_date,
  h.id = (
    SELECT h3.id
    FROM public.hearings h3
    WHERE h3.case_id = h.case_id
    ORDER BY h3.hearing_date DESC, h3.created_at DESC, h3.id DESC
    LIMIT 1
  ) AS is_latest_hearing,
  c.case_type_id
FROM public.hearings h
JOIN public.cases c ON c.id = h.case_id AND c.deleted_at IS NULL
JOIN public.clients cl ON cl.id = c.client_id
JOIN public.case_types ct ON ct.id = c.case_type_id;

ALTER VIEW public.v_cause_list SET (security_invoker = true);

-- Replace the previous function so a caller can simulate the Pakistan-local
-- date in tests while scheduled execution retains its normal default.
DROP FUNCTION public.generate_reminders(UUID);
CREATE FUNCTION public.generate_reminders(
  p_firm_id UUID DEFAULT NULL,
  p_today DATE DEFAULT NULL
)
RETURNS TABLE (
  processed_cases INT,
  created_reminders INT,
  closed_reminders INT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today DATE := COALESCE(p_today, (NOW() AT TIME ZONE 'Asia/Karachi')::DATE);
  v_case RECORD;
  v_user RECORD;
  v_reminder_id UUID;
  v_days_left INT;
  v_days_before INT;
  v_urgency reminder_urgency;
  v_created INT := 0;
  v_closed INT := 0;
  v_processed INT := 0;
  v_inserted INT;
  v_was_new BOOLEAN;
BEGIN
  IF auth.role() = 'anon'
     OR (auth.uid() IS NOT NULL AND
         (p_firm_id IS NULL OR p_firm_id IS DISTINCT FROM public.current_firm_id())) THEN
    RAISE EXCEPTION 'You may generate reminders only for your own firm.';
  END IF;

  UPDATE public.reminders r
  SET status = 'dismissed', acted_at = NOW()
  WHERE r.status = 'upcoming'
    AND (p_firm_id IS NULL OR r.firm_id = p_firm_id)
    AND (
      r.next_date IS DISTINCT FROM (
        SELECT h.next_date FROM public.hearings h WHERE h.id = r.hearing_id
      )
      OR r.next_date IS NULL
      OR r.next_date < v_today
      OR r.next_date > v_today + COALESCE(
        (SELECT np.remind_days_before FROM public.notification_preferences np WHERE np.user_id = r.user_id),
        (SELECT f.default_remind_days_before FROM public.firms f WHERE f.id = r.firm_id),
        10
      )
      OR NOT EXISTS (
        SELECT 1 FROM public.cases c
        WHERE c.id = r.case_id AND c.status = 'running'
          AND c.deleted_at IS NULL AND c.firm_id = r.firm_id
      )
      OR NOT EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = r.user_id AND p.is_active = TRUE
          AND p.role IN ('super_admin', 'admin', 'lawyer')
      )
      OR NOT EXISTS (
        SELECT 1
        FROM public.hearings latest
        WHERE latest.id = r.hearing_id
          AND latest.case_id = r.case_id
          AND latest.id = (
            SELECT h2.id
            FROM public.hearings h2
            WHERE h2.case_id = r.case_id
            ORDER BY h2.hearing_date DESC, h2.created_at DESC, h2.id DESC
            LIMIT 1
          )
      )
    );
  GET DIAGNOSTICS v_closed = ROW_COUNT;

  FOR v_case IN
    SELECT c.id AS case_id, c.firm_id, c.case_ref_no,
           c.plaintiff_name, c.defendant_name, c.From,
           h.id AS hearing_id, h.next_date,
           COALESCE(h.court_no, c.court_no) AS court_no
    FROM public.cases c
    JOIN LATERAL (
      SELECT h1.id, h1.next_date, h1.court_no
      FROM public.hearings h1
      WHERE h1.case_id = c.id
      ORDER BY h1.hearing_date DESC, h1.created_at DESC, h1.id DESC
      LIMIT 1
    ) h ON TRUE
    WHERE c.status = 'running'
      AND c.deleted_at IS NULL
      AND h.next_date BETWEEN v_today AND v_today + 30
      AND (p_firm_id IS NULL OR c.firm_id = p_firm_id)
  LOOP
    v_processed := v_processed + 1;
    v_days_left := v_case.next_date - v_today;

    FOR v_user IN
      SELECT p.id AS user_id,
             COALESCE(np.remind_days_before, f.default_remind_days_before, 10) AS days_before,
             COALESCE(np.notify_reminders, TRUE) AS notify_reminders
      FROM public.profiles p
      JOIN public.firms f ON f.id = p.firm_id
      LEFT JOIN public.notification_preferences np ON np.user_id = p.id
      WHERE p.firm_id = v_case.firm_id
        AND p.is_active = TRUE
        AND p.role IN ('super_admin', 'admin', 'lawyer')
    LOOP
      v_days_before := v_user.days_before;
      CONTINUE WHEN v_days_left > v_days_before;

      v_urgency := CASE
        WHEN v_days_left = 0 THEN 'critical'
        WHEN v_days_left <= 3 THEN 'high'
        WHEN v_days_left <= 7 THEN 'medium'
        ELSE 'low'
      END;

      SELECT NOT EXISTS (
        SELECT 1 FROM public.reminders existing
        WHERE existing.hearing_id = v_case.hearing_id
          AND existing.user_id = v_user.user_id
      ) INTO v_was_new;

      v_reminder_id := NULL;
      INSERT INTO public.reminders AS existing_reminder
        (firm_id, case_id, hearing_id, user_id, remind_date, next_date, status, urgency, acted_at)
      VALUES
        (v_case.firm_id, v_case.case_id, v_case.hearing_id, v_user.user_id,
         v_case.next_date - v_days_before, v_case.next_date, 'upcoming', v_urgency, NULL)
      ON CONFLICT (hearing_id, user_id) DO UPDATE
        SET remind_date = EXCLUDED.remind_date,
            next_date = EXCLUDED.next_date,
            urgency = EXCLUDED.urgency,
            status = CASE
              WHEN existing_reminder.next_date IS DISTINCT FROM EXCLUDED.next_date
                THEN 'upcoming'::reminder_status
              ELSE existing_reminder.status
            END,
            acted_at = CASE
              WHEN existing_reminder.next_date IS DISTINCT FROM EXCLUDED.next_date
                THEN NULL
              ELSE existing_reminder.acted_at
            END
      RETURNING id INTO v_reminder_id;
      GET DIAGNOSTICS v_inserted = ROW_COUNT;
      IF v_was_new AND v_inserted > 0 THEN
        v_created := v_created + 1;
      END IF;

      IF v_user.notify_reminders AND EXISTS (
        SELECT 1 FROM public.reminders active_reminder
        WHERE active_reminder.id = v_reminder_id
          AND active_reminder.status = 'upcoming'
      ) THEN
        INSERT INTO public.notifications
          (firm_id, user_id, title, body, type, ref_type, ref_id, dedupe_key)
        VALUES (
          v_case.firm_id, v_user.user_id,
          CASE
            WHEN v_days_left = 0 THEN 'Hearing today — ' || v_case.case_ref_no
            WHEN v_days_left = 1 THEN 'Hearing tomorrow — ' || v_case.case_ref_no
            WHEN v_days_left <= 3 THEN 'Hearing in ' || v_days_left || ' days — ' || v_case.case_ref_no
            ELSE 'Upcoming hearing — ' || v_case.case_ref_no
          END,
          v_case.plaintiff_name || ' vs ' || v_case.defendant_name ||
            ' · ' || TO_CHAR(v_case.next_date, 'DD Mon YYYY') ||
            COALESCE(' · ' || v_case.court_no, ''),
          'reminder', 'case', v_case.case_id,
          'reminder:' || v_reminder_id::TEXT || ':' || v_today::TEXT
        )
        ON CONFLICT (dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING;
        UPDATE public.reminders SET last_notified_at = NOW() WHERE id = v_reminder_id;
      END IF;
    END LOOP;
  END LOOP;

  RETURN QUERY SELECT v_processed, v_created, v_closed;
END;
$$;

REVOKE ALL ON FUNCTION public.generate_reminders(UUID, DATE) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.generate_reminders(UUID, DATE) TO authenticated, service_role;

-- Include the reopen reason in the existing status-change activity entry.
CREATE OR REPLACE FUNCTION public.auto_log_case_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reopen_reason TEXT;
BEGIN
  IF OLD.status <> NEW.status THEN
    IF NEW.status = 'decided' THEN
      PERFORM public.log_case_activity(
        NEW.id, NEW.firm_id, 'case_decided'::activity_event, auth.uid(),
        'Case decided — outcome: ' || COALESCE(NEW.outcome::TEXT, '—') ||
        ', date: ' || TO_CHAR(NEW.decision_date, 'DD Mon YYYY'),
        jsonb_build_object('outcome', NEW.outcome, 'decision_date', NEW.decision_date)
      );
    ELSIF NEW.status = 'running' AND OLD.status = 'decided' THEN
      v_reopen_reason := NULLIF(current_setting('app.case_reopen_reason', TRUE), '');
      PERFORM public.log_case_activity(
        NEW.id, NEW.firm_id, 'case_reopened'::activity_event, auth.uid(),
        CASE WHEN v_reopen_reason IS NULL
          THEN 'Case reopened and moved back to Running.'
          ELSE 'Case reopened: ' || v_reopen_reason
        END,
        CASE WHEN v_reopen_reason IS NULL THEN NULL
          ELSE jsonb_build_object('reason', v_reopen_reason)
        END
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_case_with_first_hearing(
  p_case JSONB,
  p_first_hearing JSONB DEFAULT NULL
)
RETURNS public.cases
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_case public.cases%ROWTYPE;
  v_firm_id UUID := public.current_firm_id();
  v_today DATE := (NOW() AT TIME ZONE 'Asia/Karachi')::DATE;
BEGIN
  IF auth.uid() IS NULL OR public.current_role() NOT IN ('super_admin', 'admin', 'lawyer') THEN
    RAISE EXCEPTION 'You are not allowed to create cases.';
  END IF;
  IF v_firm_id IS NULL THEN
    RAISE EXCEPTION 'Your account is not linked to a firm.';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.clients
    WHERE id = (p_case->>'client_id')::UUID AND firm_id = v_firm_id
  ) OR NOT EXISTS (
    SELECT 1 FROM public.case_types
    WHERE id = (p_case->>'case_type_id')::UUID AND firm_id = v_firm_id
  ) THEN
    RAISE EXCEPTION 'The selected client and case type must belong to your firm.';
  END IF;

  INSERT INTO public.cases (
    firm_id, client_id, case_ref_no, plaintiff_name, defendant_name,
    From, judge_name, court_no, case_type_id, offence, description,
    status, assigned_to, created_by
  ) VALUES (
    v_firm_id,
    (p_case->>'client_id')::UUID,
    p_case->>'case_ref_no',
    p_case->>'plaintiff_name',
    p_case->>'defendant_name',
    (p_case->>'From')::From_type,
    NULLIF(p_case->>'judge_name', ''),
    NULLIF(p_case->>'court_no', ''),
    (p_case->>'case_type_id')::UUID,
    NULLIF(p_case->>'offence', ''),
    NULLIF(p_case->>'description', ''),
    'running',
    COALESCE(NULLIF(p_case->>'assigned_to', '')::UUID, auth.uid()),
    auth.uid()
  )
  RETURNING * INTO v_case;

  IF p_first_hearing IS NOT NULL AND p_first_hearing <> 'null'::JSONB THEN
    INSERT INTO public.hearings (
      case_id, firm_id, hearing_date, serial_no, next_date, next_proceeding,
      judge_name, court_no, created_by
    ) VALUES (
      v_case.id, v_firm_id,
      COALESCE(NULLIF(p_first_hearing->>'hearing_date', '')::DATE, v_today),
      NULLIF(p_first_hearing->>'serial_no', ''),
      NULLIF(p_first_hearing->>'next_date', '')::DATE,
      NULLIF(p_first_hearing->>'next_proceeding', ''),
      v_case.judge_name, v_case.court_no, auth.uid()
    );
  END IF;

  RETURN v_case;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_hearing(
  p_hearing_id UUID,
  p_current_proceeding TEXT,
  p_next_proceeding TEXT,
  p_next_date DATE,
  p_serial_no TEXT DEFAULT NULL,
  p_judge_name TEXT DEFAULT NULL,
  p_court_no TEXT DEFAULT NULL
)
RETURNS public.hearings
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_current public.hearings%ROWTYPE;
  v_new public.hearings%ROWTYPE;
  v_today DATE := (NOW() AT TIME ZONE 'Asia/Karachi')::DATE;
BEGIN
  IF auth.uid() IS NULL OR public.current_role() NOT IN ('super_admin', 'admin', 'lawyer') THEN
    RAISE EXCEPTION 'You are not allowed to update hearings.';
  END IF;
  SELECT * INTO v_current
  FROM public.hearings
  WHERE id = p_hearing_id AND firm_id = public.current_firm_id()
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Hearing not found in your firm.';
  END IF;
  IF p_current_proceeding IS NULL OR btrim(p_current_proceeding) = '' THEN
    RAISE EXCEPTION 'Current proceeding is required.';
  END IF;
  IF p_next_date IS NULL OR p_next_date <= v_current.hearing_date THEN
    RAISE EXCEPTION 'Next date must be after the current hearing date.';
  END IF;

  UPDATE public.hearings
  SET current_proceeding = p_current_proceeding,
      serial_no = COALESCE(NULLIF(p_serial_no, ''), v_current.serial_no)
  WHERE id = v_current.id;

  INSERT INTO public.hearings (
    case_id, firm_id, hearing_date, next_date, next_proceeding,
    current_proceeding, judge_name, court_no, created_by
  ) VALUES (
    v_current.case_id, v_current.firm_id, v_today, p_next_date,
    NULLIF(p_next_proceeding, ''), NULL,
    COALESCE(NULLIF(p_judge_name, ''), v_current.judge_name),
    COALESCE(NULLIF(p_court_no, ''), v_current.court_no),
    auth.uid()
  )
  RETURNING * INTO v_new;

  PERFORM public.generate_reminders(v_current.firm_id, v_today);
  RETURN v_new;
END;
$$;

CREATE OR REPLACE FUNCTION public.reopen_case(p_case_id UUID, p_reason TEXT)
RETURNS public.cases
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_case public.cases%ROWTYPE;
BEGIN
  IF NOT public.is_admin_or_above() THEN
    RAISE EXCEPTION 'Only firm administrators may reopen a case.';
  END IF;
  IF p_reason IS NULL OR length(btrim(p_reason)) < 5 THEN
    RAISE EXCEPTION 'Please provide a reason of at least five characters.';
  END IF;

  PERFORM set_config('app.case_reopen_reason', btrim(p_reason), TRUE);
  UPDATE public.cases
  SET status = 'running', decision_date = NULL, outcome = NULL, decision_notes = NULL
  WHERE id = p_case_id
    AND firm_id = public.current_firm_id()
    AND status = 'decided'
    AND deleted_at IS NULL
  RETURNING * INTO v_case;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Decided case not found in your firm.';
  END IF;
  RETURN v_case;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_case_decided(
  p_case_id UUID,
  p_decision_date DATE,
  p_outcome case_outcome,
  p_decision_notes TEXT DEFAULT NULL,
  p_document JSONB DEFAULT NULL
)
RETURNS public.cases
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_case public.cases%ROWTYPE;
  v_document_path TEXT;
BEGIN
  IF auth.uid() IS NULL OR public.current_role() NOT IN ('super_admin', 'admin', 'lawyer') THEN
    RAISE EXCEPTION 'You are not allowed to decide cases.';
  END IF;
  IF p_decision_date IS NULL OR p_outcome IS NULL THEN
    RAISE EXCEPTION 'Decision date and outcome are required.';
  END IF;

  IF p_document IS NOT NULL AND p_document <> 'null'::JSONB THEN
    v_document_path := p_document->>'file_path';
    IF v_document_path IS NULL
       OR split_part(v_document_path, '/', 1) <> public.current_firm_id()::TEXT THEN
      RAISE EXCEPTION 'The final order document must be stored in your firm folder.';
    END IF;
    INSERT INTO public.documents (
      firm_id, case_id, client_id, name, file_path, mime, size, uploaded_by
    ) VALUES (
      public.current_firm_id(), p_case_id, NULL,
      COALESCE(NULLIF(p_document->>'name', ''), 'Final Order'),
      v_document_path, p_document->>'mime',
      NULLIF(p_document->>'size', '')::BIGINT, auth.uid()
    );
  END IF;

  UPDATE public.cases
  SET status = 'decided',
      decision_date = p_decision_date,
      outcome = p_outcome,
      decision_notes = p_decision_notes
  WHERE id = p_case_id
    AND firm_id = public.current_firm_id()
    AND status = 'running'
    AND deleted_at IS NULL
  RETURNING * INTO v_case;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Running case not found in your firm.';
  END IF;

  PERFORM public.close_case_reminders(p_case_id);
  RETURN v_case;
END;
$$;

REVOKE ALL ON FUNCTION public.create_case_with_first_hearing(JSONB, JSONB) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.update_hearing(UUID, TEXT, TEXT, DATE, TEXT, TEXT, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.reopen_case(UUID, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.mark_case_decided(UUID, DATE, case_outcome, TEXT, JSONB) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_case_with_first_hearing(JSONB, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_hearing(UUID, TEXT, TEXT, DATE, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reopen_case(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_case_decided(UUID, DATE, case_outcome, TEXT, JSONB) TO authenticated;

-- Private firm documents and publicly readable, user-owned avatar objects.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents', 'documents', FALSE, 52428800,
  ARRAY[
    'application/pdf', 'image/jpeg', 'image/png', 'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE
SET public = FALSE,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE
SET public = TRUE,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "firm documents read" ON storage.objects;
DROP POLICY IF EXISTS "firm documents insert" ON storage.objects;
DROP POLICY IF EXISTS "firm documents update" ON storage.objects;
DROP POLICY IF EXISTS "firm admins delete documents" ON storage.objects;
DROP POLICY IF EXISTS "users insert own avatar" ON storage.objects;
DROP POLICY IF EXISTS "users update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "firm documents read" ON storage.objects;
CREATE POLICY "firm documents read" ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = public.current_firm_id()::TEXT
  );

DROP POLICY IF EXISTS "firm documents insert" ON storage.objects;
CREATE POLICY "firm documents insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = public.current_firm_id()::TEXT
  );

DROP POLICY IF EXISTS "firm documents update" ON storage.objects;
CREATE POLICY "firm documents update" ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = public.current_firm_id()::TEXT
    AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
  )
  WITH CHECK (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = public.current_firm_id()::TEXT
    AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
  );

DROP POLICY IF EXISTS "firm admins delete documents" ON storage.objects;
CREATE POLICY "firm admins delete documents" ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = public.current_firm_id()::TEXT
    AND public.is_admin_or_above()
  );

DROP POLICY IF EXISTS "users insert own avatar" ON storage.objects;
CREATE POLICY "users insert own avatar" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

DROP POLICY IF EXISTS "users update own avatar" ON storage.objects;
CREATE POLICY "users update own avatar" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::TEXT)
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::TEXT);

DROP POLICY IF EXISTS "users delete own avatar" ON storage.objects;
CREATE POLICY "users delete own avatar" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::TEXT);


-- -----------------------------------------------------------------------------
-- Migration: 20240007000000_storage_policy_guards.sql
-- -----------------------------------------------------------------------------
-- Restrictive policies constrain any existing permissive storage policies.
-- PostgreSQL combines restrictive policies with AND, preventing a legacy
-- broad policy from granting cross-firm document access or clerk deletion.
DROP POLICY IF EXISTS "stage2 firm documents select guard" ON storage.objects;
CREATE POLICY "stage2 firm documents select guard" ON storage.objects AS RESTRICTIVE FOR SELECT TO authenticated
  USING (
    bucket_id <> 'documents'
    OR (storage.foldername(name))[1] = public.current_firm_id()::TEXT
  );

DROP POLICY IF EXISTS "stage2 firm documents insert guard" ON storage.objects;
CREATE POLICY "stage2 firm documents insert guard" ON storage.objects AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id <> 'documents'
    OR (storage.foldername(name))[1] = public.current_firm_id()::TEXT
  );

DROP POLICY IF EXISTS "stage2 firm documents update guard" ON storage.objects;
CREATE POLICY "stage2 firm documents update guard" ON storage.objects AS RESTRICTIVE FOR UPDATE TO authenticated
  USING (
    bucket_id <> 'documents'
    OR (
      (storage.foldername(name))[1] = public.current_firm_id()::TEXT
      AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
    )
  )
  WITH CHECK (
    bucket_id <> 'documents'
    OR (
      (storage.foldername(name))[1] = public.current_firm_id()::TEXT
      AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
    )
  );

DROP POLICY IF EXISTS "stage2 firm documents delete guard" ON storage.objects;
CREATE POLICY "stage2 firm documents delete guard" ON storage.objects AS RESTRICTIVE FOR DELETE TO authenticated
  USING (
    bucket_id <> 'documents'
    OR (
      (storage.foldername(name))[1] = public.current_firm_id()::TEXT
      AND public.is_admin_or_above()
    )
  );

DROP POLICY IF EXISTS "stage2 avatars insert guard" ON storage.objects;
CREATE POLICY "stage2 avatars insert guard" ON storage.objects AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id <> 'avatars'
    OR (storage.foldername(name))[1] = auth.uid()::TEXT
  );

DROP POLICY IF EXISTS "stage2 avatars update guard" ON storage.objects;
CREATE POLICY "stage2 avatars update guard" ON storage.objects AS RESTRICTIVE FOR UPDATE TO authenticated
  USING (
    bucket_id <> 'avatars'
    OR (storage.foldername(name))[1] = auth.uid()::TEXT
  )
  WITH CHECK (
    bucket_id <> 'avatars'
    OR (storage.foldername(name))[1] = auth.uid()::TEXT
  );

DROP POLICY IF EXISTS "stage2 avatars delete guard" ON storage.objects;
CREATE POLICY "stage2 avatars delete guard" ON storage.objects AS RESTRICTIVE FOR DELETE TO authenticated
  USING (
    bucket_id <> 'avatars'
    OR (storage.foldername(name))[1] = auth.uid()::TEXT
  );


-- -----------------------------------------------------------------------------
-- Migration: 20261013000000_document_delete_lawyer_admin.sql
-- -----------------------------------------------------------------------------
-- Allow lawyers and admins to delete firm documents while keeping clerks denied.
-- Replace both permissive and restrictive storage rules so policy composition
-- cannot retain the previous admin-only restriction.
DROP POLICY IF EXISTS "firm lawyers and admins delete documents" ON storage.objects;
CREATE POLICY "firm lawyers and admins delete documents" ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = public.current_firm_id()::TEXT
    AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
  );

DROP POLICY IF EXISTS "stage2 firm documents delete guard" ON storage.objects;
CREATE POLICY "stage2 firm documents delete guard" ON storage.objects AS RESTRICTIVE FOR DELETE TO authenticated
  USING (
    bucket_id <> 'documents'
    OR (
      (storage.foldername(name))[1] = public.current_firm_id()::TEXT
      AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
    )
  );

DROP POLICY IF EXISTS "lawyers and admins delete documents" ON public.documents;
CREATE POLICY "lawyers and admins delete documents" ON public.documents FOR DELETE TO authenticated
  USING (
    firm_id = public.current_firm_id()
    AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
  );


-- -----------------------------------------------------------------------------
-- Migration: 20261016000000_push_dispatch_trigger.sql
-- -----------------------------------------------------------------------------
-- =============================================================================
-- Migration 008: Web Push dispatch trigger on notification insert
-- =============================================================================
-- APPLY IN SUPABASE SQL EDITOR (Dashboard → SQL Editor) AFTER the following
-- manual steps are complete:
--
--   1. Deploy the `send-push` Edge Function (requires Docker Desktop locally:
--      `npx supabase functions deploy send-push`).
--   2. Set secret `VAPID_PRIVATE_KEY` in Edge Function settings (Dashboard →
--      Edge Functions → send-push → Secrets).
--   3. Set secret `SUPABASE_SERVICE_ROLE_KEY` in Edge Function settings.
--   4. Set `NEXT_PUBLIC_VAPID_PUBLIC_KEY` in web/.env.local (already done).
--
-- pg_net enables outbound HTTP requests from PostgreSQL to the Edge Function.
-- (pg_net initialized)

-- Trigger function: fires send-push Edge Function for new notifications.
-- The Authorization header must carry the service role key so the function
-- runs with admin privileges. Replace <SUPABASE_SERVICE_ROLE_KEY> below with
-- the actual value (set as an Edge Function secret; do NOT hardcode in SQL).
CREATE OR REPLACE FUNCTION public.dispatch_push_on_notification()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  v_status  INT;
  v_response jsonb;
BEGIN
  -- Skip daily_summary pushes (in-app only).
  IF NEW.type = 'daily_summary' THEN
    RETURN NEW;
  END IF;

  SELECT status_code, response_body
  INTO v_status, v_response
  FROM pg_net.web_post(
    url := 'https://YOUR_NEW_PROJECT_REF.functions.supabase.co/send-push',
    headers := jsonb_build_object(
      'Authorization', 'Bearer <SUPABASE_SERVICE_ROLE_KEY>',
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object('notification_ids', ARRAY[NEW.id::text])
  );

  RAISE NOTICE '[send-push] notification % dispatched status=%', NEW.id, v_status;

EXCEPTION
  WHEN OTHERS THEN
    -- Never break the notification insert because push delivery failed.
    RAISE NOTICE '[send-push] notification % push dispatch skipped: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Attach trigger: after a notification row is inserted, attempt push dispatch.
DROP TRIGGER IF EXISTS trg_dispatch_push_on_notification ON public.notifications;
CREATE TRIGGER trg_dispatch_push_on_notification AFTER INSERT ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.dispatch_push_on_notification();

COMMENT ON TRIGGER trg_dispatch_push_on_notification ON public.notifications IS
  'Invokes send-push Edge Function when a new notification is inserted.';


-- -----------------------------------------------------------------------------
-- Migration: 20261018000000_avatars_insert_policy.sql
-- -----------------------------------------------------------------------------
-- =============================================================================
-- Migration 20261018000000: Add permissive storage policies for avatars bucket
-- =============================================================================
-- The avatars bucket previously had only RESTRICTIVE policies
-- (see 20240007000000_storage_policy_guards.sql). Restrictive policies can
-- only restrict access; they cannot grant it. Without a matching PERMISSIVE
-- INSERT policy, every avatar upload was rejected with:
--   "new row violates row-level security policy" (HTTP 403/400)
--
-- This migration adds the missing permissive policies so authenticated users
-- can upload/select/update avatars under their own folder ({user_id}/...).
-- It works together with the existing restrictive guards, which still block
-- cross-firm / cross-user access.
--
-- APPLY MANUALLY: Supabase Dashboard → SQL Editor → paste and run.
-- (Supabase CLI db push is blocked in this environment by missing
--  database_write permission on the access token.)
-- =============================================================================

DO $$ BEGIN
  BEGIN DROP POLICY IF EXISTS "avatars insert own folder" ON storage.objects;
CREATE POLICY "avatars insert own folder" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::TEXT); EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN DROP POLICY IF EXISTS "avatars update own folder" ON storage.objects;
CREATE POLICY "avatars update own folder" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::TEXT) WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::TEXT); EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN DROP POLICY IF EXISTS "avatars select own folder" ON storage.objects;
CREATE POLICY "avatars select own folder" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::TEXT); EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;


-- -----------------------------------------------------------------------------
-- Migration: 20261019000000_subscription_saas.sql
-- -----------------------------------------------------------------------------
-- =============================================================================
-- Subscription SaaS: plans, subscriptions, payments, devices, settings, enforcement
-- =============================================================================

-- Extensions
-- (uuid-ossp initialized)
-- (pg_cron initialized)

-- Enums
DO $$ BEGIN
  DO $$ BEGIN CREATE TYPE payment_method AS ENUM ('bank_transfer','jazzcash','easypaisa','card','other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  DO $$ BEGIN CREATE TYPE payment_status AS ENUM ('pending','verified','rejected'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  DO $$ BEGIN CREATE TYPE sub_status AS ENUM ('trialing','pending','active','grace','expired','suspended','cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Plans
CREATE TABLE IF NOT EXISTS public.plans (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  duration_months INT  NOT NULL,
  price_pkr       NUMERIC(12,2) NOT NULL,
  max_users       INT  NOT NULL DEFAULT 5,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order      INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firm_id     UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  plan_id     UUID REFERENCES public.plans(id),
  status      sub_status NOT NULL DEFAULT 'trialing',
  starts_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at     TIMESTAMPTZ NOT NULL,
  grace_until TIMESTAMPTZ,
  created_by  UUID REFERENCES auth.users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_firm ON public.subscriptions(firm_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- Payments
CREATE TABLE IF NOT EXISTS public.payments (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firm_id        UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id),
  plan_id        UUID NOT NULL REFERENCES public.plans(id),
  amount_pkr     NUMERIC(12,2) NOT NULL,
  method         payment_method NOT NULL,
  reference_no   TEXT NOT NULL,
  slip_path      TEXT,
  status         payment_status NOT NULL DEFAULT 'pending',
  note           TEXT,
  submitted_by   UUID REFERENCES auth.users(id),
  verified_by    UUID REFERENCES auth.users(id),
  verified_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payments_firm ON public.payments(firm_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- Payment accounts (super admin editable)
CREATE TABLE IF NOT EXISTS public.payment_accounts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  method          payment_method NOT NULL,
  account_title   TEXT NOT NULL,
  account_number  TEXT NOT NULL,
  bank_name       TEXT,
  instructions    TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order      INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User devices
CREATE TABLE IF NOT EXISTS public.user_devices (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  firm_id       UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  device_id     TEXT NOT NULL,
  device_label  TEXT,
  session_id    TEXT,
  last_seen_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, device_id)
);
CREATE INDEX IF NOT EXISTS idx_user_devices_user ON public.user_devices(user_id);

-- App settings
CREATE TABLE IF NOT EXISTS public.app_settings (
  key   TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- Billing events / audit
CREATE TABLE IF NOT EXISTS public.billing_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firm_id     UUID REFERENCES public.firms(id) ON DELETE CASCADE,
  actor_id    UUID REFERENCES auth.users(id),
  event_type  TEXT NOT NULL,
  payload     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_billing_events_firm ON public.billing_events(firm_id);

-- Alter firms/profiles
ALTER TABLE public.firms ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_owner BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT FALSE;

-- Trigger to keep updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

DO $$ BEGIN
  DROP TRIGGER IF EXISTS trg_plans_updated_at ON public.plans;
CREATE TRIGGER trg_plans_updated_at BEFORE UPDATE ON public.plans FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  DROP TRIGGER IF EXISTS trg_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER trg_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  DROP TRIGGER IF EXISTS trg_payments_updated_at ON public.payments;
CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  DROP TRIGGER IF EXISTS trg_payment_accounts_updated_at ON public.payment_accounts;
CREATE TRIGGER trg_payment_accounts_updated_at BEFORE UPDATE ON public.payment_accounts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Helper: super admin check
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin');
$$;

-- Helper: current firm
CREATE OR REPLACE FUNCTION public.current_firm_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT firm_id FROM public.profiles WHERE id = auth.uid();
$$;

-- Helper: is owner
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE((SELECT is_owner FROM public.profiles WHERE id = auth.uid()), FALSE);
$$;

-- Read/write access based on subscription
CREATE OR REPLACE FUNCTION public.read_access(p_firm_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.firm_id = p_firm_id
      AND s.status IN ('trialing','active','grace')
      AND NOW() < COALESCE(s.grace_until, s.ends_at)
  );
$$;

CREATE OR REPLACE FUNCTION public.write_access(p_firm_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.firm_id = p_firm_id
      AND s.status IN ('trialing','active')
      AND NOW() < s.ends_at
  );
$$;

CREATE OR REPLACE FUNCTION public.has_active_access(p_firm_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.write_access(p_firm_id);
$$;

-- Modify handle_new_user: do not auto-attach to a firm
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.raw_user_meta_data->>'firm_id' IS NOT NULL THEN
    INSERT INTO public.profiles (id, firm_id, full_name, email, role, is_owner)
    VALUES (
      NEW.id,
      (NEW.raw_user_meta_data->>'firm_id')::UUID,
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)),
      NEW.email,
      COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'clerk'),
      COALESCE((NEW.raw_user_meta_data->>'is_owner')::BOOLEAN, FALSE)
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Register firm: callable by authenticated user without profile
CREATE OR REPLACE FUNCTION public.register_firm(p_firm_name TEXT, p_full_name TEXT, p_phone TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user UUID := auth.uid();
  v_firm UUID;
  v_trial_days INT := 7;
  v_trial_enabled BOOLEAN := TRUE;
  v_ends TIMESTAMPTZ;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = v_user) THEN
    RAISE EXCEPTION 'Profile already exists';
  END IF;
  SELECT (value)::INT INTO v_trial_days FROM public.app_settings WHERE key='trial_days';
  SELECT (value)::BOOLEAN INTO v_trial_enabled FROM public.app_settings WHERE key='trial_enabled';
  IF v_trial_days IS NULL THEN v_trial_days := 7; END IF;
  IF v_trial_enabled IS NULL THEN v_trial_enabled := TRUE; END IF;

  INSERT INTO public.firms (name, owner_id) VALUES (p_firm_name, NULL) RETURNING id INTO v_firm;
  INSERT INTO public.profiles (id, firm_id, full_name, phone, email, role, is_owner)
  VALUES (v_user, v_firm, p_full_name, p_phone, (SELECT email FROM auth.users WHERE id=v_user), 'admin', TRUE);
  UPDATE public.firms SET owner_id = v_user WHERE id = v_firm;

  IF v_trial_enabled THEN
    v_ends := NOW() + (v_trial_days || ' days')::INTERVAL;
    INSERT INTO public.subscriptions (firm_id, plan_id, status, starts_at, ends_at, created_by)
    VALUES (v_firm, NULL, 'trialing', NOW(), v_ends, v_user);
  ELSE
    -- no trial: create pending subscription placeholder
    INSERT INTO public.subscriptions (firm_id, plan_id, status, starts_at, ends_at, created_by)
    VALUES (v_firm, NULL, 'pending', NOW(), NOW(), v_user);
  END IF;

  INSERT INTO public.billing_events (firm_id, actor_id, event_type, payload)
  VALUES (v_firm, v_user, 'firm_registered', jsonb_build_object('firm_name', p_firm_name));

  RETURN jsonb_build_object('firm_id', v_firm);
END;
$$;

-- Submit payment
CREATE OR REPLACE FUNCTION public.submit_payment(p_plan_id UUID, p_method payment_method, p_reference_no TEXT, p_slip_path TEXT, p_amount NUMERIC)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user UUID := auth.uid();
  v_firm UUID;
  v_payment UUID;
BEGIN
  v_firm := public.current_firm_id();
  IF v_firm IS NULL THEN RAISE EXCEPTION 'No firm'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.plans WHERE id = p_plan_id AND is_active) THEN RAISE EXCEPTION 'Invalid plan'; END IF;
  INSERT INTO public.payments (firm_id, plan_id, amount_pkr, method, reference_no, slip_path, submitted_by)
  VALUES (v_firm, p_plan_id, p_amount, p_method, p_reference_no, p_slip_path, v_user)
  RETURNING id INTO v_payment;
  RETURN v_payment;
END;
$$;

-- Verify payment (super admin only)
CREATE OR REPLACE FUNCTION public.verify_payment(p_payment_id UUID, p_approve BOOLEAN, p_note TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_payment RECORD;
  v_plan RECORD;
  v_base TIMESTAMPTZ;
  v_ends TIMESTAMPTZ;
  v_sub UUID;
BEGIN
  IF NOT public.is_super_admin() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  SELECT * INTO v_payment FROM public.payments WHERE id = p_payment_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Payment not found'; END IF;
  IF v_payment.status <> 'pending' THEN RAISE EXCEPTION 'Payment already processed'; END IF;

  IF NOT p_approve THEN
    UPDATE public.payments SET status='rejected', note=p_note, verified_by=auth.uid(), verified_at=NOW() WHERE id=p_payment_id;
    INSERT INTO public.billing_events (firm_id, actor_id, event_type, payload) VALUES (v_payment.firm_id, auth.uid(), 'payment_rejected', jsonb_build_object('payment_id', p_payment_id, 'note', p_note));
    RETURN jsonb_build_object('status','rejected');
  END IF;

  SELECT * INTO v_plan FROM public.plans WHERE id = v_payment.plan_id;

  -- base = max(now, current ends_at of latest subscription)
  SELECT COALESCE(MAX(ends_at), NOW()) INTO v_base
  FROM public.subscriptions WHERE firm_id = v_payment.firm_id AND status IN ('trialing','active','grace');

  IF v_base < NOW() THEN v_base := NOW(); END IF;
  v_ends := v_base + (v_plan.duration_months || ' months')::INTERVAL;

  INSERT INTO public.subscriptions (firm_id, plan_id, status, starts_at, ends_at, created_by)
  VALUES (v_payment.firm_id, v_payment.plan_id, 'active', NOW(), v_ends, auth.uid())
  RETURNING id INTO v_sub;

  UPDATE public.payments SET status='verified', note=p_note, verified_by=auth.uid(), verified_at=NOW(), subscription_id=v_sub WHERE id=p_payment_id;

  INSERT INTO public.billing_events (firm_id, actor_id, event_type, payload)
  VALUES (v_payment.firm_id, auth.uid(), 'payment_verified', jsonb_build_object('payment_id', p_payment_id, 'plan', v_plan.code, 'ends_at', v_ends));

  RETURN jsonb_build_object('status','verified','ends_at',v_ends);
END;
$$;

-- Admin actions
CREATE OR REPLACE FUNCTION public.admin_extend_subscription(p_firm_id UUID, p_days INT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_sub UUID;
BEGIN
  IF NOT public.is_super_admin() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  SELECT id INTO v_sub FROM public.subscriptions WHERE firm_id=p_firm_id ORDER BY ends_at DESC LIMIT 1;
  IF v_sub IS NULL THEN RAISE EXCEPTION 'No subscription'; END IF;
  UPDATE public.subscriptions SET ends_at = ends_at + (p_days || ' days')::INTERVAL, status='active', grace_until=NULL WHERE id=v_sub;
  INSERT INTO public.billing_events (firm_id, actor_id, event_type, payload) VALUES (p_firm_id, auth.uid(), 'admin_extend', jsonb_build_object('days',p_days));
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_suspend_firm(p_firm_id UUID, p_note TEXT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_super_admin() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  UPDATE public.subscriptions SET status='suspended' WHERE firm_id=p_firm_id;
  INSERT INTO public.billing_events (firm_id, actor_id, event_type, payload) VALUES (p_firm_id, auth.uid(), 'admin_suspend', jsonb_build_object('note',p_note));
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_reactivate_firm(p_firm_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_super_admin() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  UPDATE public.subscriptions SET status='active' WHERE firm_id=p_firm_id;
  INSERT INTO public.billing_events (firm_id, actor_id, event_type, payload) VALUES (p_firm_id, auth.uid(), 'admin_reactivate', '{}'::jsonb);
END;
$$;

-- Remove member
CREATE OR REPLACE FUNCTION public.remove_member(p_user_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_firm UUID;
BEGIN
  v_firm := public.current_firm_id();
  IF NOT public.is_owner() THEN RAISE EXCEPTION 'Only owner'; END IF;
  IF p_user_id = auth.uid() THEN RAISE EXCEPTION 'Cannot remove self'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id=p_user_id AND firm_id=v_firm) THEN RAISE EXCEPTION 'Not in firm'; END IF;
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id=p_user_id AND is_owner) THEN RAISE EXCEPTION 'Cannot remove owner'; END IF;
  DELETE FROM public.profiles WHERE id=p_user_id;
  INSERT INTO public.billing_events (firm_id, actor_id, event_type, payload) VALUES (v_firm, auth.uid(), 'member_removed', jsonb_build_object('user_id',p_user_id));
END;
$$;

-- Seats
CREATE OR REPLACE FUNCTION public.seats_used(p_firm_id UUID)
RETURNS INT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COUNT(*)::INT FROM public.profiles WHERE firm_id=p_firm_id AND is_active;
$$;

CREATE OR REPLACE FUNCTION public.seat_limit(p_firm_id UUID)
RETURNS INT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE((SELECT p.max_users FROM public.subscriptions s JOIN public.plans p ON p.id=s.plan_id WHERE s.firm_id=p_firm_id ORDER BY s.ends_at DESC LIMIT 1), 5);
$$;

-- Devices
CREATE OR REPLACE FUNCTION public.register_device(p_device_id TEXT, p_label TEXT, p_session_id TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user UUID := auth.uid();
  v_firm UUID;
  v_count INT;
  v_oldest UUID;
BEGIN
  v_firm := public.current_firm_id();
  IF v_firm IS NULL THEN RAISE EXCEPTION 'No firm'; END IF;
  -- upsert
  INSERT INTO public.user_devices (user_id, firm_id, device_id, device_label, session_id, last_seen_at)
  VALUES (v_user, v_firm, p_device_id, p_label, p_session_id, NOW())
  ON CONFLICT (user_id, device_id) DO UPDATE SET last_seen_at=NOW(), revoked_at=NULL, session_id=p_session_id;

  SELECT COUNT(*) INTO v_count FROM public.user_devices WHERE user_id=v_user AND revoked_at IS NULL;
  IF v_count > 2 THEN
    SELECT id INTO v_oldest FROM public.user_devices WHERE user_id=v_user AND revoked_at IS NULL AND device_id <> p_device_id ORDER BY last_seen_at ASC LIMIT 1;
    UPDATE public.user_devices SET revoked_at=NOW() WHERE id=v_oldest;
  END IF;
  RETURN jsonb_build_object('ok', TRUE);
END;
$$;

CREATE OR REPLACE FUNCTION public.revoke_device(p_device_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_user UUID := auth.uid(); v_owner BOOLEAN := public.is_owner();
BEGIN
  IF v_owner THEN
    UPDATE public.user_devices SET revoked_at=NOW() WHERE id=p_device_id;
  ELSE
    UPDATE public.user_devices SET revoked_at=NOW() WHERE id=p_device_id AND user_id=v_user;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_session_valid()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  -- Limitation: JWT session_id claim not enforced server-side; device revocation checked client-side.
  SELECT TRUE;
$$;

-- Get subscription state
CREATE OR REPLACE FUNCTION public.get_subscription_state()
RETURNS JSONB LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    (SELECT jsonb_build_object(
      'status', s.status,
      'starts_at', s.starts_at,
      'ends_at', s.ends_at,
      'grace_until', s.grace_until,
      'days_left', CEIL(EXTRACT(EPOCH FROM (s.ends_at - NOW()))/86400.0),
      'in_grace', (s.status='grace' AND NOW() < COALESCE(s.grace_until, s.ends_at)),
      'seats_used', public.seats_used(public.current_firm_id()),
      'seats_max', COALESCE((SELECT p.max_users FROM public.plans p WHERE p.id=s.plan_id), 5)
    ) FROM public.subscriptions s WHERE s.firm_id = public.current_firm_id() ORDER BY s.ends_at DESC LIMIT 1),
    '{"status":"none"}'::jsonb
  );
$$;

-- Update subscription states (daily)
CREATE OR REPLACE FUNCTION public.update_subscription_states(p_today DATE DEFAULT NULL)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_today DATE := COALESCE(p_today, (NOW() AT TIME ZONE 'Asia/Karachi')::DATE);
  v_grace_days INT := 3;
  v_reminder_days INT := 7;
  r RECORD;
BEGIN
  SELECT (value)::INT INTO v_grace_days FROM public.app_settings WHERE key='grace_days';
  SELECT (value)::INT INTO v_reminder_days FROM public.app_settings WHERE key='reminder_days';
  IF v_grace_days IS NULL THEN v_grace_days := 3; END IF;
  IF v_reminder_days IS NULL THEN v_reminder_days := 7; END IF;

  -- active/trialing -> grace/expired
  FOR r IN SELECT * FROM public.subscriptions WHERE status IN ('trialing','active') LOOP
    IF v_today > r.ends_at::DATE THEN
      IF v_grace_days > 0 AND v_today <= (r.ends_at::DATE + v_grace_days) THEN
        UPDATE public.subscriptions SET status='grace', grace_until = r.ends_at + (v_grace_days || ' days')::INTERVAL WHERE id=r.id;
      ELSE
        UPDATE public.subscriptions SET status='expired' WHERE id=r.id;
      END IF;
    END IF;
  END LOOP;

  -- grace -> expired
  FOR r IN SELECT * FROM public.subscriptions WHERE status='grace' LOOP
    IF v_today > COALESCE(r.grace_until, r.ends_at)::DATE THEN
      UPDATE public.subscriptions SET status='expired' WHERE id=r.id;
    END IF;
  END LOOP;

  -- renewal reminders: idempotent via billing_events
  FOR r IN
    SELECT s.firm_id, s.ends_at FROM public.subscriptions s
    WHERE s.status IN ('trialing','active')
      AND s.ends_at::DATE = (v_today + v_reminder_days)
  LOOP
    IF NOT EXISTS (SELECT 1 FROM public.billing_events WHERE firm_id=r.firm_id AND event_type='renewal_reminder' AND (payload->>'ends_at')::DATE = r.ends_at::DATE) THEN
      -- notify owner
      INSERT INTO public.notifications (user_id, firm_id, title, body, type)
      SELECT p.id, r.firm_id, 'Renewal reminder', 'Your subscription expires on ' || r.ends_at::DATE, 'info'
      FROM public.profiles p WHERE p.firm_id=r.firm_id AND p.is_owner;
      INSERT INTO public.billing_events (firm_id, event_type, payload) VALUES (r.firm_id, 'renewal_reminder', jsonb_build_object('ends_at', r.ends_at));
    END IF;
  END LOOP;
END;
$$;

-- Schedule cron 06:00 Asia/Karachi (01:00 UTC)
DO $$ BEGIN
  PERFORM cron.unschedule('update-subscription-states');
EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN
  PERFORM cron.unschedule('update-subscription-states');
  PERFORM cron.schedule('update-subscription-states', '0 1 * * *', $$SELECT public.update_subscription_states()$$);
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'cron.schedule (update-subscription-states) skipped: %', SQLERRM;
END $$;

-- RLS for new tables
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_events ENABLE ROW LEVEL SECURITY;

-- plans: readable by authenticated
DROP POLICY IF EXISTS "plans_read" ON public.plans;
CREATE POLICY "plans_read" ON public.plans FOR SELECT TO authenticated USING (TRUE);
DROP POLICY IF EXISTS "plans_admin" ON public.plans;
CREATE POLICY "plans_admin" ON public.plans FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- subscriptions
DROP POLICY IF EXISTS "subs_read" ON public.subscriptions;
CREATE POLICY "subs_read" ON public.subscriptions FOR SELECT TO authenticated USING (firm_id = public.current_firm_id() OR public.is_super_admin());
DROP POLICY IF EXISTS "subs_admin" ON public.subscriptions;
CREATE POLICY "subs_admin" ON public.subscriptions FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- payments
DROP POLICY IF EXISTS "payments_read" ON public.payments;
CREATE POLICY "payments_read" ON public.payments FOR SELECT TO authenticated USING (firm_id = public.current_firm_id() OR public.is_super_admin());
DROP POLICY IF EXISTS "payments_insert" ON public.payments;
CREATE POLICY "payments_insert" ON public.payments FOR INSERT TO authenticated WITH CHECK (firm_id = public.current_firm_id());
DROP POLICY IF EXISTS "payments_admin" ON public.payments;
CREATE POLICY "payments_admin" ON public.payments FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- payment_accounts: readable by authenticated, writable by super admin
DROP POLICY IF EXISTS "accounts_read" ON public.payment_accounts;
CREATE POLICY "accounts_read" ON public.payment_accounts FOR SELECT TO authenticated USING (TRUE);
DROP POLICY IF EXISTS "accounts_admin" ON public.payment_accounts;
CREATE POLICY "accounts_admin" ON public.payment_accounts FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- user_devices
DROP POLICY IF EXISTS "devices_read" ON public.user_devices;
CREATE POLICY "devices_read" ON public.user_devices FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_owner() OR public.is_super_admin());
DROP POLICY IF EXISTS "devices_write" ON public.user_devices;
CREATE POLICY "devices_write" ON public.user_devices FOR ALL TO authenticated USING (user_id = auth.uid() OR public.is_super_admin()) WITH CHECK (user_id = auth.uid() OR public.is_super_admin());

-- app_settings: readable by authenticated, writable by super admin
DROP POLICY IF EXISTS "settings_read" ON public.app_settings;
CREATE POLICY "settings_read" ON public.app_settings FOR SELECT TO authenticated USING (TRUE);
DROP POLICY IF EXISTS "settings_admin" ON public.app_settings;
CREATE POLICY "settings_admin" ON public.app_settings FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- billing_events
DROP POLICY IF EXISTS "events_read" ON public.billing_events;
CREATE POLICY "events_read" ON public.billing_events FOR SELECT TO authenticated USING (firm_id = public.current_firm_id() OR public.is_super_admin());
DROP POLICY IF EXISTS "events_insert" ON public.billing_events;
CREATE POLICY "events_insert" ON public.billing_events FOR INSERT TO authenticated WITH CHECK (TRUE);

-- Enforce profiles: prevent changing firm_id/role by self; only owner/admin/super can update roles
DROP POLICY IF EXISTS "user updates own profile" ON public.profiles;
CREATE POLICY "user updates own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND firm_id = (SELECT firm_id FROM public.profiles WHERE id=auth.uid()) AND role = (SELECT role FROM public.profiles WHERE id=auth.uid()) AND is_owner = (SELECT is_owner FROM public.profiles WHERE id=auth.uid()));

DROP POLICY IF EXISTS "admin manages profiles" ON public.profiles;
CREATE POLICY "admin manages profiles" ON public.profiles FOR ALL TO authenticated
  USING (public.is_owner() OR public.is_super_admin())
  WITH CHECK (public.is_owner() OR public.is_super_admin());

-- Prevent self-insert into profiles (no public signup into firm)
DROP POLICY IF EXISTS "profiles_insert_none" ON public.profiles;
CREATE POLICY "profiles_insert_none" ON public.profiles FOR INSERT TO authenticated WITH CHECK (FALSE);

-- Storage: payment-slips bucket policies (bucket must be created in dashboard or via storage)
-- (Handled in storage policy migration if bucket exists)

-- Update business table RLS: SELECT requires read_access, writes require write_access
-- clients
DROP POLICY IF EXISTS "firm members read clients" ON public.clients;
CREATE POLICY "firm members read clients" ON public.clients FOR SELECT TO authenticated
  USING (firm_id = public.current_firm_id() AND public.read_access(firm_id));
DROP POLICY IF EXISTS "lawyer+ inserts clients" ON public.clients;
CREATE POLICY "lawyer+ inserts clients" ON public.clients FOR INSERT TO authenticated
  WITH CHECK (firm_id = public.current_firm_id() AND public.write_access(firm_id));
DROP POLICY IF EXISTS "lawyer+ updates clients" ON public.clients;
CREATE POLICY "lawyer+ updates clients" ON public.clients FOR UPDATE TO authenticated
  USING (firm_id = public.current_firm_id() AND public.write_access(firm_id))
  WITH CHECK (firm_id = public.current_firm_id() AND public.write_access(firm_id));
DROP POLICY IF EXISTS "admin deletes clients" ON public.clients;
CREATE POLICY "admin deletes clients" ON public.clients FOR DELETE TO authenticated
  USING (firm_id = public.current_firm_id() AND public.write_access(firm_id));

-- cases
DROP POLICY IF EXISTS "firm members read cases" ON public.cases;
CREATE POLICY "firm members read cases" ON public.cases FOR SELECT TO authenticated
  USING (firm_id = public.current_firm_id() AND public.read_access(firm_id));
DROP POLICY IF EXISTS "lawyer+ inserts cases" ON public.cases;
CREATE POLICY "lawyer+ inserts cases" ON public.cases FOR INSERT TO authenticated
  WITH CHECK (firm_id = public.current_firm_id() AND public.write_access(firm_id));
DROP POLICY IF EXISTS "lawyer+ updates cases" ON public.cases;
CREATE POLICY "lawyer+ updates cases" ON public.cases FOR UPDATE TO authenticated
  USING (firm_id = public.current_firm_id() AND public.write_access(firm_id))
  WITH CHECK (firm_id = public.current_firm_id() AND public.write_access(firm_id));
DROP POLICY IF EXISTS "admin deletes cases" ON public.cases;
CREATE POLICY "admin deletes cases" ON public.cases FOR DELETE TO authenticated
  USING (firm_id = public.current_firm_id() AND public.write_access(firm_id));

-- hearings
DROP POLICY IF EXISTS "firm members read hearings" ON public.hearings;
CREATE POLICY "firm members read hearings" ON public.hearings FOR SELECT TO authenticated
  USING (firm_id = public.current_firm_id() AND public.read_access(firm_id));
DROP POLICY IF EXISTS "all firm members insert hearings" ON public.hearings;
CREATE POLICY "all firm members insert hearings" ON public.hearings FOR INSERT TO authenticated
  WITH CHECK (firm_id = public.current_firm_id() AND public.write_access(firm_id));
DROP POLICY IF EXISTS "lawyer+ updates hearings" ON public.hearings;
CREATE POLICY "lawyer+ updates hearings" ON public.hearings FOR UPDATE TO authenticated
  USING (firm_id = public.current_firm_id() AND public.write_access(firm_id))
  WITH CHECK (firm_id = public.current_firm_id() AND public.write_access(firm_id));
DROP POLICY IF EXISTS "admin deletes hearings" ON public.hearings;
CREATE POLICY "admin deletes hearings" ON public.hearings FOR DELETE TO authenticated
  USING (firm_id = public.current_firm_id() AND public.write_access(firm_id));

-- documents
DROP POLICY IF EXISTS "firm members read documents" ON public.documents;
CREATE POLICY "firm members read documents" ON public.documents FOR SELECT TO authenticated
  USING (firm_id = public.current_firm_id() AND public.read_access(firm_id));
DROP POLICY IF EXISTS "firm members upload documents" ON public.documents;
CREATE POLICY "firm members upload documents" ON public.documents FOR INSERT TO authenticated
  WITH CHECK (firm_id = public.current_firm_id() AND public.write_access(firm_id));
DROP POLICY IF EXISTS "admin deletes documents" ON public.documents;
CREATE POLICY "admin deletes documents" ON public.documents FOR DELETE TO authenticated
  USING (firm_id = public.current_firm_id() AND public.write_access(firm_id));

-- case_notes (if exists)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='case_notes') THEN
    EXECUTE 'DROP POLICY IF EXISTS "firm members read case_notes" ON public.case_notes';
    EXECUTE 'DROP POLICY IF EXISTS "firm members read case_notes" ON public.case_notes;
CREATE POLICY "firm members read case_notes" ON public.case_notes FOR SELECT TO authenticated USING (firm_id = public.current_firm_id() AND public.read_access(firm_id))';
    EXECUTE 'DROP POLICY IF EXISTS "firm members insert case_notes" ON public.case_notes';
    EXECUTE 'DROP POLICY IF EXISTS "firm members insert case_notes" ON public.case_notes;
CREATE POLICY "firm members insert case_notes" ON public.case_notes FOR INSERT TO authenticated WITH CHECK (firm_id = public.current_firm_id() AND public.write_access(firm_id))';
    EXECUTE 'DROP POLICY IF EXISTS "firm members update case_notes" ON public.case_notes';
    EXECUTE 'DROP POLICY IF EXISTS "firm members update case_notes" ON public.case_notes;
CREATE POLICY "firm members update case_notes" ON public.case_notes FOR UPDATE TO authenticated USING (firm_id = public.current_firm_id() AND public.write_access(firm_id)) WITH CHECK (firm_id = public.current_firm_id() AND public.write_access(firm_id))';
    EXECUTE 'DROP POLICY IF EXISTS "firm members delete case_notes" ON public.case_notes';
    EXECUTE 'DROP POLICY IF EXISTS "firm members delete case_notes" ON public.case_notes;
CREATE POLICY "firm members delete case_notes" ON public.case_notes FOR DELETE TO authenticated USING (firm_id = public.current_firm_id() AND public.write_access(firm_id))';
  END IF;
END $$;

-- Seed app_settings
INSERT INTO public.app_settings (key, value) VALUES
  ('trial_enabled', 'true'::jsonb),
  ('trial_days', '7'::jsonb),
  ('grace_days', '3'::jsonb),
  ('reminder_days', '7'::jsonb),
  ('currency', '"PKR"'::jsonb),
  ('whatsapp_number', '""'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Seed plans
INSERT INTO public.plans (code, name, duration_months, price_pkr, max_users, sort_order) VALUES
  ('monthly', 'Monthly', 1, 1000, 5, 1),
  ('six_month', '6 Months', 6, 5400, 5, 2),
  ('yearly', 'Yearly', 12, 9600, 5, 3)
ON CONFLICT (code) DO NOTHING;

-- Seed payment_accounts placeholders
INSERT INTO public.payment_accounts (method, account_title, account_number, bank_name, instructions, sort_order) VALUES
  ('bank_transfer', 'MZM Associates', '14870010155786580019', 'Allied Bank', 'Transfer and share transaction ID', 1),
  ('jazzcash', 'MZM Associates', '03261929571', NULL, 'Send to JazzCash number', 2),
  ('easypaisa', 'MZM Associates', '03417359571', NULL, 'Send to Easypaisa number', 3)
ON CONFLICT DO NOTHING;

-- Storage bucket for payment slips (create if not exists) - handled via storage API; RLS below assumes bucket 'payment-slips'
-- (Bucket creation is done by admin; policies only if bucket exists)

COMMENT ON TABLE public.plans IS 'Subscription plans (configurable by super admin).';
COMMENT ON TABLE public.subscriptions IS 'Firm subscriptions.';
COMMENT ON TABLE public.payments IS 'Manual payment submissions.';
COMMENT ON TABLE public.user_devices IS 'Device tracking (max 2 active).';
COMMENT ON TABLE public.app_settings IS 'Configurable app settings.';


-- -----------------------------------------------------------------------------
-- Migration: 20261019010000_fix_rls_roles.sql
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_lawyer_or_above()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    (SELECT role IN ('super_admin','admin','lawyer') FROM public.profiles WHERE id = auth.uid()),
    FALSE
  );
$$;

-- clients
DROP POLICY IF EXISTS "lawyer+ inserts clients" ON public.clients;
CREATE POLICY "lawyer+ inserts clients" ON public.clients FOR INSERT TO authenticated
  WITH CHECK (firm_id = public.current_firm_id() AND public.write_access(firm_id) AND public.is_lawyer_or_above());
DROP POLICY IF EXISTS "lawyer+ updates clients" ON public.clients;
CREATE POLICY "lawyer+ updates clients" ON public.clients FOR UPDATE TO authenticated
  USING (firm_id = public.current_firm_id() AND public.write_access(firm_id) AND public.is_lawyer_or_above())
  WITH CHECK (firm_id = public.current_firm_id() AND public.write_access(firm_id) AND public.is_lawyer_or_above());
DROP POLICY IF EXISTS "admin deletes clients" ON public.clients;
CREATE POLICY "admin deletes clients" ON public.clients FOR DELETE TO authenticated
  USING (firm_id = public.current_firm_id() AND public.write_access(firm_id) AND public.is_admin_or_above());

-- cases
DROP POLICY IF EXISTS "lawyer+ inserts cases" ON public.cases;
CREATE POLICY "lawyer+ inserts cases" ON public.cases FOR INSERT TO authenticated
  WITH CHECK (firm_id = public.current_firm_id() AND public.write_access(firm_id) AND public.is_lawyer_or_above());
DROP POLICY IF EXISTS "lawyer+ updates cases" ON public.cases;
CREATE POLICY "lawyer+ updates cases" ON public.cases FOR UPDATE TO authenticated
  USING (firm_id = public.current_firm_id() AND public.write_access(firm_id) AND public.is_lawyer_or_above())
  WITH CHECK (firm_id = public.current_firm_id() AND public.write_access(firm_id) AND public.is_lawyer_or_above());
DROP POLICY IF EXISTS "admin deletes cases" ON public.cases;
CREATE POLICY "admin deletes cases" ON public.cases FOR DELETE TO authenticated
  USING (firm_id = public.current_firm_id() AND public.write_access(firm_id) AND public.is_admin_or_above());

-- hearings
DROP POLICY IF EXISTS "all firm members insert hearings" ON public.hearings;
CREATE POLICY "all firm members insert hearings" ON public.hearings FOR INSERT TO authenticated
  WITH CHECK (firm_id = public.current_firm_id() AND public.write_access(firm_id));
DROP POLICY IF EXISTS "lawyer+ updates hearings" ON public.hearings;
CREATE POLICY "lawyer+ updates hearings" ON public.hearings FOR UPDATE TO authenticated
  USING (firm_id = public.current_firm_id() AND public.write_access(firm_id) AND public.is_lawyer_or_above())
  WITH CHECK (firm_id = public.current_firm_id() AND public.write_access(firm_id) AND public.is_lawyer_or_above());
DROP POLICY IF EXISTS "admin deletes hearings" ON public.hearings;
CREATE POLICY "admin deletes hearings" ON public.hearings FOR DELETE TO authenticated
  USING (firm_id = public.current_firm_id() AND public.write_access(firm_id) AND public.is_admin_or_above());

-- documents
DROP POLICY IF EXISTS "firm members upload documents" ON public.documents;
CREATE POLICY "firm members upload documents" ON public.documents FOR INSERT TO authenticated
  WITH CHECK (firm_id = public.current_firm_id() AND public.write_access(firm_id));
DROP POLICY IF EXISTS "admin deletes documents" ON public.documents;
CREATE POLICY "admin deletes documents" ON public.documents FOR DELETE TO authenticated
  USING (firm_id = public.current_firm_id() AND public.write_access(firm_id) AND public.is_admin_or_above());


-- -----------------------------------------------------------------------------
-- Migration: 20261019020000_device_heartbeat.sql
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_device_valid(p_device_id TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user UUID := auth.uid();
  v_revoked TIMESTAMPTZ;
BEGIN
  SELECT revoked_at INTO v_revoked FROM public.user_devices WHERE user_id=v_user AND device_id=p_device_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', FALSE, 'reason', 'not_registered');
  END IF;
  IF v_revoked IS NOT NULL THEN
    RETURN jsonb_build_object('valid', FALSE, 'reason', 'revoked');
  END IF;
  UPDATE public.user_devices SET last_seen_at=NOW() WHERE user_id=v_user AND device_id=p_device_id;
  RETURN jsonb_build_object('valid', TRUE);
END;
$$;
GRANT EXECUTE ON FUNCTION public.check_device_valid(TEXT) TO authenticated;


-- -----------------------------------------------------------------------------
-- Migration: 20261019030000_payment_slips_storage.sql
-- -----------------------------------------------------------------------------
-- Storage policies for payment-slips bucket (bucket must be created in dashboard)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id='payment-slips') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('payment-slips', 'payment-slips', FALSE);
  END IF;
END $$;

DROP POLICY IF EXISTS "payment slips insert own firm" ON storage.objects;
CREATE POLICY "payment slips insert own firm" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'payment-slips'
    AND (storage.foldername(name))[1] = (SELECT firm_id::text FROM public.profiles WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "payment slips read own firm" ON storage.objects;
CREATE POLICY "payment slips read own firm" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'payment-slips'
    AND ((storage.foldername(name))[1] = (SELECT firm_id::text FROM public.profiles WHERE id = auth.uid()) OR public.is_super_admin())
  );

DROP POLICY IF EXISTS "payment slips delete own firm admin" ON storage.objects;
CREATE POLICY "payment slips delete own firm admin" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'payment-slips'
    AND (storage.foldername(name))[1] = (SELECT firm_id::text FROM public.profiles WHERE id = auth.uid())
    AND public.is_admin_or_above()
  );


-- -----------------------------------------------------------------------------
-- Migration: 20261019040000_public_reads.sql
-- -----------------------------------------------------------------------------
-- Allow anonymous/public reads of plans and payment_accounts (landing + pricing)
DROP POLICY IF EXISTS "plans_read_anon" ON public.plans;
CREATE POLICY "plans_read_anon" ON public.plans FOR SELECT TO anon USING (TRUE);

DROP POLICY IF EXISTS "accounts_read_anon" ON public.payment_accounts;
CREATE POLICY "accounts_read_anon" ON public.payment_accounts FOR SELECT TO anon USING (TRUE);


-- -----------------------------------------------------------------------------
-- Migration: 20261020000000_payment_accounts_auth_only_reads.sql
-- -----------------------------------------------------------------------------
-- Payment account details (bank / JazzCash / Easypaisa numbers) are only needed on /billing,
-- which is an authenticated screen. Drop the anon read added for the old public pricing page.
DROP POLICY IF EXISTS "accounts_read_anon" ON public.payment_accounts;

-- Authenticated-only read, restated explicitly so the intent survives a re-run.
DROP POLICY IF EXISTS "accounts_read" ON public.payment_accounts;
CREATE POLICY "accounts_read" ON public.payment_accounts FOR SELECT TO authenticated USING (TRUE);

-- plans keeps its anon read (plans_read_anon from 20261019040000_public_reads):
-- /pricing and the landing page render plan names/prices without a session.


-- -----------------------------------------------------------------------------
-- Migration: 20261020010000_fix_document_delete_grace_rls.sql
-- -----------------------------------------------------------------------------
-- Fix dangling document delete RLS policy and add account deletion RPC

-- 1. Drop old permissive policy from 20261013000000 that bypassed write_access
DROP POLICY IF EXISTS "lawyers and admins delete documents" ON public.documents;
DROP POLICY IF EXISTS "firm lawyers and admins delete documents" ON storage.objects;

-- 2. Restate document delete policy ensuring firm_id, role, AND write_access
DROP POLICY IF EXISTS "admin deletes documents" ON public.documents;
CREATE POLICY "admin deletes documents" ON public.documents FOR DELETE TO authenticated
  USING (firm_id = public.current_firm_id() AND public.write_access(firm_id) AND public.is_admin_or_above());

-- 3. Account deletion RPC for Google Play policy compliance and GDPR
CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_firm_id UUID;
  v_is_owner BOOLEAN;
  v_firm_users INT;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT firm_id, is_owner INTO v_firm_id, v_is_owner
  FROM public.profiles WHERE id = v_user_id;

  -- If firm owner and other users exist, require removing members first
  IF v_is_owner THEN
    SELECT COUNT(*) INTO v_firm_users FROM public.profiles WHERE firm_id = v_firm_id;
    IF v_firm_users > 1 THEN
      RAISE EXCEPTION 'Firm owner cannot delete account while other firm members exist. Remove members first.';
    END IF;
  END IF;

  -- Delete user-specific artifacts
  DELETE FROM public.device_tokens WHERE user_id = v_user_id;
  DELETE FROM public.user_devices WHERE user_id = v_user_id;
  DELETE FROM public.push_subscriptions WHERE user_id = v_user_id;
  DELETE FROM public.notification_preferences WHERE user_id = v_user_id;
  DELETE FROM public.notifications WHERE user_id = v_user_id;

  -- If sole member/owner of the firm, clean up firm data
  IF v_is_owner AND (v_firm_users <= 1 OR v_firm_users IS NULL) AND v_firm_id IS NOT NULL THEN
    DELETE FROM public.reminders WHERE firm_id = v_firm_id;
    DELETE FROM public.documents WHERE firm_id = v_firm_id;
    DELETE FROM public.hearings WHERE firm_id = v_firm_id;
    DELETE FROM public.cases WHERE firm_id = v_firm_id;
    DELETE FROM public.clients WHERE firm_id = v_firm_id;
    DELETE FROM public.case_notes WHERE firm_id = v_firm_id;
    DELETE FROM public.case_activity_log WHERE firm_id = v_firm_id;
    DELETE FROM public.payments WHERE firm_id = v_firm_id;
    DELETE FROM public.subscriptions WHERE firm_id = v_firm_id;
    DELETE FROM public.billing_events WHERE firm_id = v_firm_id;
    DELETE FROM public.courts WHERE firm_id = v_firm_id;
    DELETE FROM public.case_types WHERE firm_id = v_firm_id;
    DELETE FROM public.profiles WHERE id = v_user_id;
    DELETE FROM public.firms WHERE id = v_firm_id;
  ELSE
    -- Individual member: delete own profile
    DELETE FROM public.profiles WHERE id = v_user_id;
  END IF;
END;
$$;


-- -----------------------------------------------------------------------------
-- Migration: 20261021000000_important_forms_constraint.sql
-- -----------------------------------------------------------------------------
ALTER TABLE public.documents DROP CONSTRAINT IF EXISTS chk_doc_owner;


-- -----------------------------------------------------------------------------
-- Migration: 20261021010000_fix_representing_constraint.sql
-- -----------------------------------------------------------------------------
ALTER TABLE public.cases ALTER COLUMN representing DROP NOT NULL;
ALTER TABLE public.cases ALTER COLUMN representing SET DEFAULT 'plaintiff';


-- -----------------------------------------------------------------------------
-- Migration: 20261021020000_custom_reminders.sql
-- -----------------------------------------------------------------------------
ALTER TABLE public.reminders ADD COLUMN IF NOT EXISTS is_custom BOOLEAN NOT NULL DEFAULT FALSE;


-- -----------------------------------------------------------------------------
-- Migration: 20261021030000_custom_reminder_nullable.sql
-- -----------------------------------------------------------------------------
ALTER TABLE public.reminders ALTER COLUMN case_id DROP NOT NULL;
ALTER TABLE public.reminders ALTER COLUMN hearing_id DROP NOT NULL;
ALTER TABLE public.reminders ADD COLUMN IF NOT EXISTS title TEXT;


-- -----------------------------------------------------------------------------
-- Migration: 20261021040000_reminder_insert_policy.sql
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "users insert own custom reminders" ON public.reminders;
CREATE POLICY "users insert own custom reminders" ON public.reminders FOR INSERT WITH CHECK (firm_id = public.current_firm_id() AND user_id = auth.uid() AND is_custom = TRUE);


-- -----------------------------------------------------------------------------
-- Migration: 20261021050000_update_payment_accounts.sql
-- -----------------------------------------------------------------------------
UPDATE public.payment_accounts SET account_number = '03261929571', account_title = 'MZM Associates' WHERE method = 'jazzcash'; UPDATE public.payment_accounts SET account_number = '03417359571', account_title = 'MZM Associates' WHERE method = 'easypaisa'; UPDATE public.payment_accounts SET account_number = '14870010155786580019', account_title = 'MZM Associates', bank_name = 'Allied Bank' WHERE method = 'bank_transfer';


-- -----------------------------------------------------------------------------
-- Migration: 20261023000000_super_admin_important_forms_upload.sql
-- -----------------------------------------------------------------------------
-- Allow super_admin to upload/delete documents on Important Forms without firm_id constraint.
-- PostgreSQL RLS: need BOTH a permissive policy to pass AND all restrictive policies to pass.

-- documents.firm_id is NOT NULL — super_admin has no firm. Make it nullable so super_admin uploads work.
ALTER TABLE public.documents ALTER COLUMN firm_id DROP NOT NULL;

-- Add category column to separate Important Forms documents from regular documents
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS category TEXT;
CREATE INDEX IF NOT EXISTS idx_documents_category ON public.documents(category);

-- ─── Documents table SELECT (needed for insert().select().single()) ──────────────────────

DROP POLICY IF EXISTS "firm members read documents" ON public.documents;
CREATE POLICY "firm members read documents" ON public.documents FOR SELECT TO authenticated
  USING (
    firm_id = public.current_firm_id() AND public.read_access(firm_id)
    OR public.is_super_admin()
  );

-- ─── Storage INSERT ──────────────────────────────────────────────

-- Permissive: allow super_admin to insert into documents bucket regardless of firm folder
DROP POLICY IF EXISTS "firm documents insert" ON storage.objects;
CREATE POLICY "firm documents insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.uid() IS NOT NULL
    AND (
      (storage.foldername(name))[1] = public.current_firm_id()::TEXT
      OR public.is_super_admin()
    )
  );

-- Restrictive: keep firm guard but allow super_admin bypass
DROP POLICY IF EXISTS "stage2 firm documents insert guard" ON storage.objects;
CREATE POLICY "stage2 firm documents insert guard" ON storage.objects AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id <> 'documents'
    OR (storage.foldername(name))[1] = public.current_firm_id()::TEXT
    OR public.is_super_admin()
  );

-- ─── Storage DELETE ──────────────────────────────────────────────

-- Permissive: lawyer+ can delete, super_admin bypasses firm folder
DROP POLICY IF EXISTS "firm lawyers and admins delete documents" ON storage.objects;
CREATE POLICY "firm lawyers and admins delete documents" ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'documents'
    AND public.is_lawyer_or_above()
    AND (
      (storage.foldername(name))[1] = public.current_firm_id()::TEXT
      OR public.is_super_admin()
    )
  );

-- Also update the older admin-only delete policy for consistency
DROP POLICY IF EXISTS "firm admins delete documents" ON storage.objects;
CREATE POLICY "firm admins delete documents" ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'documents'
    AND public.is_admin_or_above()
    AND (
      (storage.foldername(name))[1] = public.current_firm_id()::TEXT
      OR public.is_super_admin()
    )
  );

-- Restrictive: keep firm guard but allow super_admin bypass
DROP POLICY IF EXISTS "stage2 firm documents delete guard" ON storage.objects;
CREATE POLICY "stage2 firm documents delete guard" ON storage.objects AS RESTRICTIVE FOR DELETE TO authenticated
  USING (
    bucket_id <> 'documents'
    OR (
      (storage.foldername(name))[1] = public.current_firm_id()::TEXT
      AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
    )
    OR public.is_super_admin()
  );

-- ─── Documents table INSERT ──────────────────────────────────────

DROP POLICY IF EXISTS "firm members upload documents" ON public.documents;
CREATE POLICY "firm members upload documents" ON public.documents FOR INSERT TO authenticated
  WITH CHECK (
    firm_id = public.current_firm_id() AND public.write_access(firm_id)
    OR public.is_super_admin()
  );

-- ─── Documents table DELETE ─────────────────────────────────────

DROP POLICY IF EXISTS "admin deletes documents" ON public.documents;
CREATE POLICY "admin deletes documents" ON public.documents FOR DELETE TO authenticated
  USING (
    firm_id = public.current_firm_id() AND public.write_access(firm_id) AND public.is_admin_or_above()
    OR public.is_super_admin()
  );


-- -----------------------------------------------------------------------------
-- Migration: 20261023000001_fix_get_subscription_state.sql
-- -----------------------------------------------------------------------------
-- Fix get_subscription_state to prioritize active/trialing/grace over expired.
-- Previously ordered by ends_at DESC only, which could pick an expired subscription
-- with a later ends_at over a newly activated one with an earlier ends_at.
CREATE OR REPLACE FUNCTION public.get_subscription_state()
RETURNS JSONB LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    (SELECT jsonb_build_object(
      'status', s.status,
      'starts_at', s.starts_at,
      'ends_at', s.ends_at,
      'grace_until', s.grace_until,
      'days_left', CEIL(EXTRACT(EPOCH FROM (s.ends_at - NOW()))/86400.0),
      'in_grace', (s.status='grace' AND NOW() < COALESCE(s.grace_until, s.ends_at)),
      'seats_used', public.seats_used(public.current_firm_id()),
      'seats_max', COALESCE((SELECT p.max_users FROM public.plans p WHERE p.id=s.plan_id), 5)
    ) FROM public.subscriptions s
    WHERE s.firm_id = public.current_firm_id()
    ORDER BY
      CASE s.status
        WHEN 'active'   THEN 1
        WHEN 'trialing' THEN 2
        WHEN 'grace'    THEN 3
        ELSE 4
      END,
      s.ends_at DESC
    LIMIT 1),
    '{"status":"none"}'::jsonb
  );
$$;


-- -----------------------------------------------------------------------------
-- Migration: 20261024000000_case_laws.sql
-- -----------------------------------------------------------------------------
-- ─── Case Laws module ──────────────────────────────────────────────────────────

-- Case laws table — firm-scoped, writable only by super_admin
CREATE TABLE IF NOT EXISTS public.case_laws (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firm_id     UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  law_report  TEXT NOT NULL,        -- e.g. MLD, PLD, SCMR
  year        INTEGER NOT NULL,     -- e.g. 2024
  page_no     INTEGER NOT NULL,     -- e.g. 279
  case_title  TEXT NOT NULL,        -- e.g. Bail Cancellation
  created_by  UUID REFERENCES auth.users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_case_laws_firm       ON public.case_laws(firm_id);
CREATE INDEX IF NOT EXISTS idx_case_laws_law_report ON public.case_laws(law_report);
CREATE INDEX IF NOT EXISTS idx_case_laws_year       ON public.case_laws(year);

-- RLS: firm-scoped read for all authenticated users
ALTER TABLE public.case_laws ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "case_laws_read" ON public.case_laws;
CREATE POLICY "case_laws_read" ON public.case_laws FOR SELECT TO authenticated
  USING (firm_id = public.current_firm_id() OR public.is_super_admin());

DROP POLICY IF EXISTS "case_laws_insert" ON public.case_laws;
CREATE POLICY "case_laws_insert" ON public.case_laws FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "case_laws_update" ON public.case_laws;
CREATE POLICY "case_laws_update" ON public.case_laws FOR UPDATE TO authenticated
  USING (public.is_super_admin());

DROP POLICY IF EXISTS "case_laws_delete" ON public.case_laws;
CREATE POLICY "case_laws_delete" ON public.case_laws FOR DELETE TO authenticated
  USING (public.is_super_admin());

-- updated_at trigger
DO $$ BEGIN
  DROP TRIGGER IF EXISTS trg_case_laws_updated_at ON public.case_laws;
CREATE TRIGGER trg_case_laws_updated_at BEFORE UPDATE ON public.case_laws FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- -----------------------------------------------------------------------------
-- Migration: 20261024000001_case_laws_firm_nullable.sql
-- -----------------------------------------------------------------------------
-- ─── Case Laws module — firm_id nullable for super_admin ─────────────────────────

-- Make firm_id nullable so super_admin (no firm) can insert case laws
ALTER TABLE public.case_laws ALTER COLUMN firm_id DROP NOT NULL;

-- Update RLS insert policy to allow NULL firm_id for super_admin
DROP POLICY IF EXISTS "case_laws_insert" ON public.case_laws;
CREATE POLICY "case_laws_insert" ON public.case_laws FOR INSERT TO authenticated
  WITH CHECK (
    public.is_super_admin()
    OR (firm_id = public.current_firm_id() AND public.write_access(firm_id))
  );

-- Update RLS select policy — super_admin sees all, others see firm-scoped
DROP POLICY IF EXISTS "case_laws_read" ON public.case_laws;
CREATE POLICY "case_laws_read" ON public.case_laws FOR SELECT TO authenticated
  USING (
    public.is_super_admin()
    OR firm_id = public.current_firm_id()
  );


-- -----------------------------------------------------------------------------
-- Migration: 20261024000002_fix_rls_shared_records.sql
-- -----------------------------------------------------------------------------
-- Fix RLS so firm members can see super_admin's shared records (firm_id = NULL)

-- ─── Case Laws: allow all authenticated users to view super_admin's NULL firm_id records ───
DROP POLICY IF EXISTS "case_laws_read" ON public.case_laws;
CREATE POLICY "case_laws_read" ON public.case_laws FOR SELECT TO authenticated
  USING (
    public.is_super_admin()
    OR firm_id = public.current_firm_id()
    OR firm_id IS NULL
  );

-- ─── Documents: allow all authenticated users to view super_admin's NULL firm_id records ───
DROP POLICY IF EXISTS "firm members read documents" ON public.documents;
CREATE POLICY "firm members read documents" ON public.documents FOR SELECT TO authenticated
  USING (
    public.is_super_admin()
    OR firm_id = public.current_firm_id()
    OR firm_id IS NULL
  );


-- -----------------------------------------------------------------------------
-- Migration: 20261024000003_fix_rls_unrestricted_read.sql
-- -----------------------------------------------------------------------------
-- Fix RLS so ALL authenticated users can view case laws and documents
-- regardless of firm_id. These are shared reference libraries.
-- Write access remains super_admin-only.

-- ─── Case Laws: unrestricted read for all authenticated users ───
DROP POLICY IF EXISTS "case_laws_read" ON public.case_laws;
CREATE POLICY "case_laws_read" ON public.case_laws FOR SELECT TO authenticated
  USING (true);

-- ─── Documents: unrestricted read for all authenticated users ───
DROP POLICY IF EXISTS "firm members read documents" ON public.documents;
CREATE POLICY "firm members read documents" ON public.documents FOR SELECT TO authenticated
  USING (true);


-- -----------------------------------------------------------------------------
-- Migration: 20261028000001_fix_documents_firm_rls.sql
-- -----------------------------------------------------------------------------
-- SEC-02: Restore firm-level RLS isolation on documents table.
--
-- The previous migration (20261024000003_fix_rls_unrestricted_read.sql)
-- accidentally set USING (true) on the documents table, allowing ANY
-- authenticated user to read documents belonging to ANY firm — a critical
-- multi-tenant data breach.
--
-- Case laws REMAIN globally readable (USING (true)) because they are an
-- intentionally shared reference library. Documents, however, must be
-- scoped to the reader's own firm via public.current_firm_id().

-- ─── Documents: restore firm-level isolation ────────────────────────────────
DROP POLICY IF EXISTS "firm members read documents" ON public.documents;
CREATE POLICY "firm members read documents" ON public.documents
  FOR SELECT
  TO authenticated
  USING (firm_id = public.current_firm_id());

-- ─── Case Laws: intentionally unrestricted (no change needed, documented) ───
-- The "case_laws_read" policy retains USING (true) as case laws are a shared
-- reference library accessible to all authenticated users across all firms.


-- -----------------------------------------------------------------------------
-- Migration: 20261028000002_fix_notification_dedup.sql
-- -----------------------------------------------------------------------------
-- Fix: prevent duplicate in-app notifications when hearing next_date changes.
-- Uses dedupe_key to ensure at most one notification per (hearing, user) pair.
--
-- Note: migration 20240005000000_phase7_reminder_delivery.sql already creates
-- a partial unique index on notifications(dedupe_key) WHERE dedupe_key IS NOT NULL
-- (idx_notifications_dedupe_key), so ON CONFLICT with that predicate works correctly.
-- No additional constraint is needed.

CREATE OR REPLACE FUNCTION public.auto_create_reminders()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_case_ref  TEXT;
  v_plaintiff TEXT;
  v_defendant TEXT;
  v_user      RECORD;
  v_dk        TEXT;
BEGIN
  -- Clean up if next_date cleared
  IF NEW.next_date IS NULL THEN
    UPDATE public.reminders SET status = 'dismissed', acted_at = NOW()
    WHERE hearing_id = NEW.id AND status = 'upcoming';
    RETURN NEW;
  END IF;

  -- Only act when next_date actually changed
  IF TG_OP = 'UPDATE' AND OLD.next_date IS NOT DISTINCT FROM NEW.next_date THEN
    RETURN NEW;
  END IF;

  SELECT case_ref_no, plaintiff_name, defendant_name
  INTO v_case_ref, v_plaintiff, v_defendant
  FROM public.cases WHERE id = NEW.case_id;

  -- Upsert one reminder per active firm user
  FOR v_user IN
    SELECT id FROM public.profiles
    WHERE firm_id = NEW.firm_id AND is_active = TRUE
  LOOP
    INSERT INTO public.reminders
      (firm_id, case_id, hearing_id, user_id, remind_date, status)
    VALUES (
      NEW.firm_id, NEW.case_id, NEW.id, v_user.id,
      NEW.next_date - INTERVAL '10 days',
      'upcoming'
    )
    ON CONFLICT (hearing_id, user_id) DO UPDATE
      SET remind_date = EXCLUDED.remind_date,
          status      = 'upcoming',
          acted_at    = NULL;

    -- Deduped in-app notification: one per (hearing, user) combination.
    -- If next_date changes, update the existing notification body instead of inserting a new one.
    v_dk := 'hearing:' || NEW.id::TEXT || ':user:' || v_user.id::TEXT;

    INSERT INTO public.notifications
      (firm_id, user_id, title, body, type, ref_type, ref_id, dedupe_key)
    VALUES (
      NEW.firm_id, v_user.id,
      'Upcoming Hearing — ' || COALESCE(v_case_ref, ''),
      COALESCE(v_plaintiff,'') || ' vs ' || COALESCE(v_defendant,'') ||
        ' on ' || TO_CHAR(NEW.next_date AT TIME ZONE 'Asia/Karachi', 'DD Mon YYYY'),
      'reminder', 'hearing', NEW.id,
      v_dk
    )
    ON CONFLICT (dedupe_key) WHERE dedupe_key IS NOT NULL DO UPDATE
      SET body       = EXCLUDED.body,
          is_read    = FALSE,
          created_at = NOW();

  END LOOP;

  RETURN NEW;
END;
$$;


-- -----------------------------------------------------------------------------
-- Migration: 20261028000003_fix_admin_reactivate_firm.sql
-- -----------------------------------------------------------------------------
-- Fix admin_reactivate_firm to ensure ends_at is in the future after reactivation.
-- Previously the function set status='active' without touching ends_at, so the
-- nightly cron would immediately flip the firm back to expired/suspended if the
-- subscription had already lapsed.

CREATE OR REPLACE FUNCTION public.admin_reactivate_firm(p_firm_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_sub_id  UUID;
  v_ends_at TIMESTAMPTZ;
BEGIN
  IF NOT public.is_super_admin() THEN RAISE EXCEPTION 'Not authorized'; END IF;

  -- Get the most recent subscription
  SELECT id, ends_at INTO v_sub_id, v_ends_at
  FROM public.subscriptions
  WHERE firm_id = p_firm_id
  ORDER BY ends_at DESC
  LIMIT 1;

  IF v_sub_id IS NULL THEN RAISE EXCEPTION 'No subscription found for firm'; END IF;

  -- If ends_at is in the past, extend by 30 days from now
  IF v_ends_at < NOW() THEN
    v_ends_at := NOW() + INTERVAL '30 days';
  END IF;

  UPDATE public.subscriptions
  SET status      = 'active',
      ends_at     = v_ends_at,
      grace_until = NULL
  WHERE id = v_sub_id;

  INSERT INTO public.billing_events (firm_id, actor_id, event_type, payload)
  VALUES (p_firm_id, auth.uid(), 'admin_reactivate',
    jsonb_build_object('new_ends_at', v_ends_at));
END;
$$;


-- -----------------------------------------------------------------------------
-- Migration: 20261028000004_optimize_cause_list_view.sql
-- -----------------------------------------------------------------------------
-- Optimize v_cause_list view by replacing correlated subqueries with window functions.
-- This eliminates O(N^2) correlated subqueries across hearings and enables efficient index scans.

CREATE OR REPLACE VIEW public.v_cause_list AS
WITH ranked_hearings AS (
  SELECT
    h.*,
    ROW_NUMBER() OVER (
      PARTITION BY h.case_id
      ORDER BY h.hearing_date DESC, h.created_at DESC, h.id DESC
    ) AS rn,
    LAG(h.hearing_date) OVER (
      PARTITION BY h.case_id
      ORDER BY h.hearing_date ASC, h.created_at ASC, h.id ASC
    ) AS prev_date
  FROM public.hearings h
)
SELECT
  rh.id AS hearing_id,
  rh.case_id,
  rh.firm_id,
  rh.serial_no,
  rh.hearing_date,
  rh.next_date,
  rh.current_proceeding,
  rh.next_proceeding,
  rh.judge_name AS hearing_judge,
  rh.court_no AS hearing_court_no,
  c.case_ref_no,
  c.plaintiff_name,
  c.defendant_name,
  c.representing,
  c.representing AS "From",
  c.status AS case_status,
  c.judge_name AS case_judge,
  c.court_no AS case_court_no,
  cl.full_name AS client_name,
  cl.phone AS client_phone,
  ct.name AS case_type_name,
  ct.requires_offence,
  rh.prev_date AS previous_date,
  (rh.rn = 1) AS is_latest_hearing,
  c.case_type_id
FROM ranked_hearings rh
JOIN public.cases c ON c.id = rh.case_id AND c.deleted_at IS NULL
JOIN public.clients cl ON cl.id = c.client_id
JOIN public.case_types ct ON ct.id = c.case_type_id;

ALTER VIEW public.v_cause_list SET (security_invoker = true);


-- -----------------------------------------------------------------------------
-- Migration: 20261029000001_reminders_from_columns.sql
-- -----------------------------------------------------------------------------
-- Add "from" and "from_party" columns to reminders table for custom from input
ALTER TABLE public.reminders 
ADD COLUMN IF NOT EXISTS "from" TEXT,
ADD COLUMN IF NOT EXISTS from_party TEXT;


-- -----------------------------------------------------------------------------
-- Migration: 20261031000000_add_firm_location_fields.sql
-- -----------------------------------------------------------------------------
-- Add location fields to firms and profiles
ALTER TABLE public.firms ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.firms ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE public.firms ADD COLUMN IF NOT EXISTS tehsil TEXT;
ALTER TABLE public.firms ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.firms ADD COLUMN IF NOT EXISTS province TEXT;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tehsil TEXT;

-- Update register_firm function to accept location fields
CREATE OR REPLACE FUNCTION public.register_firm(
  p_firm_name TEXT,
  p_full_name TEXT,
  p_phone TEXT,
  p_city TEXT DEFAULT NULL,
  p_district TEXT DEFAULT NULL,
  p_tehsil TEXT DEFAULT NULL,
  p_location TEXT DEFAULT NULL,
  p_province TEXT DEFAULT NULL
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user UUID := auth.uid();
  v_firm UUID;
  v_trial_days INT := 7;
  v_trial_enabled BOOLEAN := TRUE;
  v_ends TIMESTAMPTZ;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = v_user) THEN
    RAISE EXCEPTION 'Profile already exists';
  END IF;
  SELECT (value)::INT INTO v_trial_days FROM public.app_settings WHERE key='trial_days';
  SELECT (value)::BOOLEAN INTO v_trial_enabled FROM public.app_settings WHERE key='trial_enabled';
  IF v_trial_days IS NULL THEN v_trial_days := 7; END IF;
  IF v_trial_enabled IS NULL THEN v_trial_enabled := TRUE; END IF;

  INSERT INTO public.firms (name, owner_id, city, district, tehsil, location, province)
  VALUES (p_firm_name, NULL, p_city, p_district, p_tehsil, p_location, p_province)
  RETURNING id INTO v_firm;

  INSERT INTO public.profiles (id, firm_id, full_name, phone, email, role, is_owner, city, district, tehsil)
  VALUES (
    v_user,
    v_firm,
    p_full_name,
    p_phone,
    (SELECT email FROM auth.users WHERE id=v_user),
    'admin',
    TRUE,
    p_city,
    p_district,
    p_tehsil
  );

  UPDATE public.firms SET owner_id = v_user WHERE id = v_firm;

  IF v_trial_enabled THEN
    v_ends := NOW() + (v_trial_days || ' days')::INTERVAL;
    INSERT INTO public.subscriptions (firm_id, plan_id, status, starts_at, ends_at, created_by)
    VALUES (v_firm, NULL, 'trialing', NOW(), v_ends, v_user);
  ELSE
    INSERT INTO public.subscriptions (firm_id, plan_id, status, starts_at, ends_at, created_by)
    VALUES (v_firm, NULL, 'pending', NOW(), NOW(), v_user);
  END IF;

  INSERT INTO public.billing_events (firm_id, actor_id, event_type, payload)
  VALUES (
    v_firm,
    v_user,
    'firm_registered',
    jsonb_build_object(
      'firm_name', p_firm_name,
      'city', p_city,
      'district', p_district,
      'tehsil', p_tehsil,
      'location', p_location,
      'province', p_province
    )
  );

  RETURN jsonb_build_object('firm_id', v_firm);
END;
$$;


-- -----------------------------------------------------------------------------
-- Migration: 20261031010000_essential_court_forms_permissions.sql
-- -----------------------------------------------------------------------------
-- Ensure Essential Court Forms (category = 'important') can be viewed and downloaded
-- by all authenticated users, while ONLY super_admin can insert or delete them.

-- 1. Permissive SELECT on public.documents: allow all authenticated users to read category='important'
DROP POLICY IF EXISTS "firm members read documents" ON public.documents;
CREATE POLICY "firm members read documents" ON public.documents FOR SELECT TO authenticated
  USING (
    category = 'important'
    OR (firm_id IS NOT NULL AND firm_id = public.current_firm_id() AND public.read_access(firm_id))
    OR public.is_super_admin()
  );

-- 2. Permissive INSERT on public.documents: ONLY super_admin can insert category='important'
DROP POLICY IF EXISTS "firm members upload documents" ON public.documents;
CREATE POLICY "firm members upload documents" ON public.documents FOR INSERT TO authenticated
  WITH CHECK (
    (category = 'important' AND public.is_super_admin())
    OR (
      (category IS DISTINCT FROM 'important')
      AND firm_id = public.current_firm_id()
      AND public.write_access(firm_id)
    )
    OR public.is_super_admin()
  );

-- 3. Permissive DELETE on public.documents: ONLY super_admin can delete category='important'
DROP POLICY IF EXISTS "admin deletes documents" ON public.documents;
CREATE POLICY "admin deletes documents" ON public.documents FOR DELETE TO authenticated
  USING (
    (category = 'important' AND public.is_super_admin())
    OR (
      (category IS DISTINCT FROM 'important')
      AND firm_id = public.current_firm_id()
      AND public.write_access(firm_id)
      AND public.is_admin_or_above()
    )
    OR public.is_super_admin()
  );

-- 4. Storage objects SELECT (Permissive): allow reading essential court form files
DROP POLICY IF EXISTS "firm documents read" ON storage.objects;
CREATE POLICY "firm documents read" ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'documents'
    AND (
      (storage.foldername(name))[1] = public.current_firm_id()::TEXT
      OR (storage.foldername(name))[1] IN ('super_admin', 'essential_forms', '00000000-0000-0000-0000-000000000099')
      OR EXISTS (SELECT 1 FROM public.documents d WHERE d.file_path = storage.objects.name AND d.category = 'important')
      OR public.is_super_admin()
    )
  );

-- 5. Storage objects SELECT (Restrictive guard): allow reading essential court form files
DROP POLICY IF EXISTS "stage2 firm documents select guard" ON storage.objects;
CREATE POLICY "stage2 firm documents select guard" ON storage.objects AS RESTRICTIVE FOR SELECT TO authenticated
  USING (
    bucket_id <> 'documents'
    OR (storage.foldername(name))[1] = public.current_firm_id()::TEXT
    OR (storage.foldername(name))[1] IN ('super_admin', 'essential_forms', '00000000-0000-0000-0000-000000000099')
    OR EXISTS (SELECT 1 FROM public.documents d WHERE d.file_path = storage.objects.name AND d.category = 'important')
    OR public.is_super_admin()
  );


-- =============================================================================
-- STEP 4: PRODUCTION BASELINE SEED DATA
-- =============================================================================
-- Production seed (idempotent, no demo users, no DELETE)
INSERT INTO public.app_settings (key, value) VALUES
  ('trial_enabled', 'true'::jsonb),
  ('trial_days', '7'::jsonb),
  ('grace_days', '3'::jsonb),
  ('reminder_days', '7'::jsonb),
  ('currency', '"PKR"'::jsonb),
  ('whatsapp_number', '""'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.plans (code, name, duration_months, price_pkr, max_users, sort_order) VALUES
  ('monthly', 'Monthly', 1, 1000, 5, 1),
  ('six_month', '6 Months', 6, 5400, 5, 2),
  ('yearly', 'Yearly', 12, 9600, 5, 3)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.payment_accounts (method, account_title, account_number, bank_name, instructions, sort_order) VALUES
  ('bank_transfer', 'MZM Associates', 'REPLACE_ME', 'Bank', 'Transfer and share transaction ID', 1),
  ('jazzcash', 'MZM Associates', 'REPLACE_ME', NULL, 'Send to JazzCash number', 2),
  ('easypaisa', 'MZM Associates', 'REPLACE_ME', NULL, 'Send to Easypaisa number', 3)
ON CONFLICT DO NOTHING;


-- =============================================================================
-- STEP 5: VERIFICATION & COMPLETION
-- =============================================================================
DO $$
DECLARE
  v_table_count INT;
  v_view_count INT;
  v_bucket_count INT;
BEGIN
  SELECT count(*) INTO v_table_count FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
  SELECT count(*) INTO v_view_count FROM information_schema.views WHERE table_schema = 'public';
  SELECT count(*) INTO v_bucket_count FROM storage.buckets WHERE id IN ('documents', 'avatars', 'payment-slips');

  RAISE NOTICE '=======================================================';
  RAISE NOTICE 'DATABASE SETUP COMPLETED SUCCESSFULLY!';
  RAISE NOTICE 'Public tables created: %', v_table_count;
  RAISE NOTICE 'Public views created:  %', v_view_count;
  RAISE NOTICE 'Storage buckets ready: % (expected 3)', v_bucket_count;
  RAISE NOTICE '=======================================================';
END $$;
