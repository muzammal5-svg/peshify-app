-- Migration: 20261113010000_chamber_ledger_and_device_limits.sql
-- Description: 1. Chamber Ledger (Client Deals, Payments, Expenses, and Summary View)
--              2. Maximum 3 Active Devices per Account & Session Security Guard

-- =============================================================================
-- PART 1: CHAMBER LEDGER (FEE / DEAL TRACKING)
-- =============================================================================

-- 1.1 client_deals table
CREATE TABLE IF NOT EXISTS public.client_deals (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id        UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  client_id      UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  case_id        UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  title          TEXT NOT NULL,
  agreed_amount  NUMERIC NOT NULL CHECK (agreed_amount >= 0),
  currency       TEXT NOT NULL DEFAULT 'PKR',
  notes          TEXT,
  status         TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  created_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.2 client_payments table
CREATE TABLE IF NOT EXISTS public.client_payments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id        UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  deal_id        UUID NOT NULL REFERENCES public.client_deals(id) ON DELETE CASCADE,
  client_id      UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  amount         NUMERIC NOT NULL CHECK (amount >= 0),
  payment_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  method         TEXT NOT NULL DEFAULT 'cash' CHECK (method IN ('cash', 'bank', 'easypaisa', 'jazzcash', 'cheque', 'other')),
  reference_no   TEXT,
  notes          TEXT,
  created_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.3 chamber_expenses table
CREATE TABLE IF NOT EXISTS public.chamber_expenses (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id        UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  deal_id        UUID REFERENCES public.client_deals(id) ON DELETE SET NULL,
  category       TEXT NOT NULL CHECK (category IN ('court_fee', 'stamp_paper', 'munshi', 'travel', 'other')),
  amount         NUMERIC NOT NULL CHECK (amount >= 0),
  expense_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  notes          TEXT,
  created_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_deals_firm_client ON public.client_deals(firm_id, client_id);
CREATE INDEX IF NOT EXISTS idx_client_deals_case ON public.client_deals(case_id);
CREATE INDEX IF NOT EXISTS idx_client_payments_deal ON public.client_payments(deal_id);
CREATE INDEX IF NOT EXISTS idx_client_payments_client ON public.client_payments(client_id);
CREATE INDEX IF NOT EXISTS idx_chamber_expenses_deal ON public.chamber_expenses(deal_id);
CREATE INDEX IF NOT EXISTS idx_chamber_expenses_firm ON public.chamber_expenses(firm_id);

-- 1.4 SQL View: v_client_deals_summary
CREATE OR REPLACE VIEW public.v_client_deals_summary AS
SELECT
  d.id AS deal_id,
  d.firm_id,
  d.client_id,
  d.case_id,
  d.title,
  d.agreed_amount,
  d.currency,
  d.notes,
  d.status,
  d.created_by,
  d.created_at,
  d.updated_at,
  COALESCE(p.total_received, 0) AS total_received,
  COALESCE(e.total_expenses, 0) AS total_expenses,
  (d.agreed_amount - COALESCE(p.total_received, 0)) AS balance
FROM public.client_deals d
LEFT JOIN (
  SELECT deal_id, SUM(amount) AS total_received
  FROM public.client_payments
  GROUP BY deal_id
) p ON p.deal_id = d.id
LEFT JOIN (
  SELECT deal_id, SUM(amount) AS total_expenses
  FROM public.chamber_expenses
  WHERE deal_id IS NOT NULL
  GROUP BY deal_id
) e ON e.deal_id = d.id;

-- 1.5 RPC: get_firm_ledger_summary
CREATE OR REPLACE FUNCTION public.get_firm_ledger_summary()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_firm_id UUID := public.current_firm_id();
  v_total_agreed NUMERIC := 0;
  v_total_received NUMERIC := 0;
  v_total_outstanding NUMERIC := 0;
  v_debtors JSONB := '[]'::jsonb;
BEGIN
  IF v_firm_id IS NULL THEN
    RETURN jsonb_build_object(
      'total_agreed', 0,
      'total_received', 0,
      'total_outstanding', 0,
      'debtors', '[]'::jsonb
    );
  END IF;

  -- Only lawyers and admins can read fee summary
  IF public.current_role() NOT IN ('super_admin', 'admin', 'lawyer') THEN
    RETURN jsonb_build_object(
      'total_agreed', 0,
      'total_received', 0,
      'total_outstanding', 0,
      'debtors', '[]'::jsonb
    );
  END IF;

  SELECT
    COALESCE(SUM(agreed_amount), 0),
    COALESCE(SUM(total_received), 0),
    COALESCE(SUM(balance), 0)
  INTO v_total_agreed, v_total_received, v_total_outstanding
  FROM public.v_client_deals_summary
  WHERE firm_id = v_firm_id AND status = 'active';

  -- Top clients with highest balance
  SELECT COALESCE(jsonb_agg(sub), '[]'::jsonb) INTO v_debtors
  FROM (
    SELECT
      c.id AS client_id,
      c.full_name AS client_name,
      c.phone AS client_phone,
      SUM(s.balance) AS total_balance,
      COUNT(s.deal_id) AS active_deals_count
    FROM public.v_client_deals_summary s
    JOIN public.clients c ON c.id = s.client_id
    WHERE s.firm_id = v_firm_id AND s.status = 'active' AND s.balance > 0
    GROUP BY c.id, c.full_name, c.phone
    ORDER BY total_balance DESC
    LIMIT 5
  ) sub;

  RETURN jsonb_build_object(
    'total_agreed', v_total_agreed,
    'total_received', v_total_received,
    'total_outstanding', v_total_outstanding,
    'debtors', v_debtors
  );
END;
$$;

-- 1.6 Row Level Security (RLS) on Ledger Tables
ALTER TABLE public.client_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chamber_expenses ENABLE ROW LEVEL SECURITY;

-- client_deals RLS: Only admin and lawyer (Clerk has NO access)
DROP POLICY IF EXISTS "lawyer+ reads deals" ON public.client_deals;
CREATE POLICY "lawyer+ reads deals"
  ON public.client_deals FOR SELECT TO authenticated
  USING (
    firm_id = public.current_firm_id()
    AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
  );

DROP POLICY IF EXISTS "lawyer+ writes deals" ON public.client_deals;
CREATE POLICY "lawyer+ writes deals"
  ON public.client_deals FOR INSERT TO authenticated
  WITH CHECK (
    firm_id = public.current_firm_id()
    AND public.write_access(firm_id)
    AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
  );

DROP POLICY IF EXISTS "lawyer+ updates deals" ON public.client_deals;
CREATE POLICY "lawyer+ updates deals"
  ON public.client_deals FOR UPDATE TO authenticated
  USING (
    firm_id = public.current_firm_id()
    AND public.write_access(firm_id)
    AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
  )
  WITH CHECK (
    firm_id = public.current_firm_id()
    AND public.write_access(firm_id)
    AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
  );

DROP POLICY IF EXISTS "admin deletes deals" ON public.client_deals;
CREATE POLICY "admin deletes deals"
  ON public.client_deals FOR DELETE TO authenticated
  USING (
    firm_id = public.current_firm_id()
    AND public.write_access(firm_id)
    AND public.is_admin_or_above()
  );

-- client_payments RLS: Only admin and lawyer (Clerk has NO access)
DROP POLICY IF EXISTS "lawyer+ reads payments" ON public.client_payments;
CREATE POLICY "lawyer+ reads payments"
  ON public.client_payments FOR SELECT TO authenticated
  USING (
    firm_id = public.current_firm_id()
    AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
  );

DROP POLICY IF EXISTS "lawyer+ writes payments" ON public.client_payments;
CREATE POLICY "lawyer+ writes payments"
  ON public.client_payments FOR INSERT TO authenticated
  WITH CHECK (
    firm_id = public.current_firm_id()
    AND public.write_access(firm_id)
    AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
  );

DROP POLICY IF EXISTS "lawyer+ updates payments" ON public.client_payments;
CREATE POLICY "lawyer+ updates payments"
  ON public.client_payments FOR UPDATE TO authenticated
  USING (
    firm_id = public.current_firm_id()
    AND public.write_access(firm_id)
    AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
  )
  WITH CHECK (
    firm_id = public.current_firm_id()
    AND public.write_access(firm_id)
    AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
  );

DROP POLICY IF EXISTS "admin deletes payments" ON public.client_payments;
CREATE POLICY "admin deletes payments"
  ON public.client_payments FOR DELETE TO authenticated
  USING (
    firm_id = public.current_firm_id()
    AND public.write_access(firm_id)
    AND public.is_admin_or_above()
  );

-- chamber_expenses RLS: Only admin and lawyer (Clerk has NO access)
DROP POLICY IF EXISTS "lawyer+ reads expenses" ON public.chamber_expenses;
CREATE POLICY "lawyer+ reads expenses"
  ON public.chamber_expenses FOR SELECT TO authenticated
  USING (
    firm_id = public.current_firm_id()
    AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
  );

DROP POLICY IF EXISTS "lawyer+ writes expenses" ON public.chamber_expenses;
CREATE POLICY "lawyer+ writes expenses"
  ON public.chamber_expenses FOR INSERT TO authenticated
  WITH CHECK (
    firm_id = public.current_firm_id()
    AND public.write_access(firm_id)
    AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
  );

DROP POLICY IF EXISTS "lawyer+ updates expenses" ON public.chamber_expenses;
CREATE POLICY "lawyer+ updates expenses"
  ON public.chamber_expenses FOR UPDATE TO authenticated
  USING (
    firm_id = public.current_firm_id()
    AND public.write_access(firm_id)
    AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
  )
  WITH CHECK (
    firm_id = public.current_firm_id()
    AND public.write_access(firm_id)
    AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
  );

DROP POLICY IF EXISTS "admin deletes expenses" ON public.chamber_expenses;
CREATE POLICY "admin deletes expenses"
  ON public.chamber_expenses FOR DELETE TO authenticated
  USING (
    firm_id = public.current_firm_id()
    AND public.write_access(firm_id)
    AND public.is_admin_or_above()
  );


-- =============================================================================
-- PART 2: MAXIMUM 3 ACTIVE DEVICES PER ACCOUNT & SESSION SECURITY
-- =============================================================================

-- 2.1 Ensure user_devices table schema matches the required specification
CREATE TABLE IF NOT EXISTS public.user_devices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id    TEXT,
  device_name   TEXT NOT NULL DEFAULT 'Web Browser',
  device_type   TEXT NOT NULL DEFAULT 'web' CHECK (device_type IN ('web', 'android', 'ios')),
  last_seen_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at    TIMESTAMPTZ
);

-- Ensure columns exist if user_devices was created in earlier prototype
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_devices') THEN
    ALTER TABLE public.user_devices ADD COLUMN IF NOT EXISTS session_id TEXT;
    ALTER TABLE public.user_devices ADD COLUMN IF NOT EXISTS device_name TEXT DEFAULT 'Web Browser';
    ALTER TABLE public.user_devices ADD COLUMN IF NOT EXISTS device_type TEXT DEFAULT 'web';
    ALTER TABLE public.user_devices ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMPTZ;
    ALTER TABLE public.user_devices ALTER COLUMN firm_id DROP NOT NULL;
    ALTER TABLE public.user_devices ALTER COLUMN device_id DROP NOT NULL;
  END IF;
END $$;

-- Indexes for lightning-fast STABLE RLS session lookup
CREATE INDEX IF NOT EXISTS idx_user_devices_user_session
  ON public.user_devices (user_id, session_id)
  WHERE revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_user_devices_active_recency
  ON public.user_devices (user_id, last_seen_at)
  WHERE revoked_at IS NULL;

-- 2.2 Helper Function: is_session_active()
-- STABLE function used by RLS policies to verify session validity
CREATE OR REPLACE FUNCTION public.is_session_active()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    auth.uid() IS NOT NULL AND (
      public.is_super_admin()
      OR (auth.jwt()->>'session_id') IS NULL
      OR EXISTS (
        SELECT 1
        FROM public.user_devices
        WHERE user_id = auth.uid()
          AND session_id = (auth.jwt()->>'session_id')
          AND revoked_at IS NULL
      )
    );
$$;

-- 2.3 RPC: register_device(device_name, device_type, client_session_id)
CREATE OR REPLACE FUNCTION public.register_device(
  p_device_name TEXT,
  p_device_type TEXT DEFAULT 'web',
  p_client_session_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_session_id TEXT;
  v_active_count INT;
  v_device_id UUID;
  v_existing_id UUID;
  v_devices JSONB;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Read session_id from JWT claims, fallback to client-supplied session ID
  v_session_id := COALESCE(auth.jwt()->>'session_id', p_client_session_id);
  IF v_session_id IS NULL OR btrim(v_session_id) = '' THEN
    v_session_id := 'legacy-session-' || v_user_id::text;
  END IF;

  -- Check if this exact session is already registered
  SELECT id INTO v_existing_id
  FROM public.user_devices
  WHERE user_id = v_user_id
    AND session_id = v_session_id
    AND revoked_at IS NULL
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    -- Update last_seen_at and return ok
    UPDATE public.user_devices
    SET last_seen_at = NOW(),
        device_name = COALESCE(NULLIF(p_device_name, ''), device_name),
        device_type = COALESCE(NULLIF(p_device_type, ''), device_type)
    WHERE id = v_existing_id;

    RETURN jsonb_build_object(
      'status', 'ok',
      'device_id', v_existing_id,
      'session_id', v_session_id
    );
  END IF;

  -- Otherwise, count active devices in the last 30 days
  SELECT COUNT(*) INTO v_active_count
  FROM public.user_devices
  WHERE user_id = v_user_id
    AND revoked_at IS NULL
    AND last_seen_at >= (NOW() - INTERVAL '30 days');

  IF v_active_count >= 3 THEN
    -- Return limit_reached with the list of active devices
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', id,
        'device_name', device_name,
        'device_type', device_type,
        'last_seen_at', last_seen_at,
        'created_at', created_at
      ) ORDER BY last_seen_at DESC
    ) INTO v_devices
    FROM public.user_devices
    WHERE user_id = v_user_id
      AND revoked_at IS NULL
      AND last_seen_at >= (NOW() - INTERVAL '30 days');

    RETURN jsonb_build_object(
      'status', 'limit_reached',
      'message', 'Maximum 3 active devices limit reached for this account',
      'devices', COALESCE(v_devices, '[]'::jsonb)
    );
  END IF;

  -- Count < 3: Register new device
  INSERT INTO public.user_devices (
    user_id, session_id, device_name, device_type, last_seen_at, created_at
  ) VALUES (
    v_user_id, v_session_id,
    COALESCE(NULLIF(p_device_name, ''), 'Web Browser'),
    COALESCE(NULLIF(p_device_type, ''), 'web'),
    NOW(), NOW()
  )
  RETURNING id INTO v_device_id;

  RETURN jsonb_build_object(
    'status', 'ok',
    'device_id', v_device_id,
    'session_id', v_session_id
  );
END;
$$;

-- 2.4 RPC: revoke_device(device_id)
CREATE OR REPLACE FUNCTION public.revoke_device(p_device_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF public.is_super_admin() THEN
    UPDATE public.user_devices
    SET revoked_at = NOW()
    WHERE id = p_device_id;
  ELSE
    UPDATE public.user_devices
    SET revoked_at = NOW()
    WHERE id = p_device_id AND user_id = v_user_id;
  END IF;

  RETURN jsonb_build_object('status', 'ok', 'revoked_id', p_device_id);
END;
$$;

-- 2.5 RPC: admin_reset_user_devices(user_id) for Super Admin
CREATE OR REPLACE FUNCTION public.admin_reset_user_devices(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Only super admin can reset user devices';
  END IF;

  UPDATE public.user_devices
  SET revoked_at = NOW()
  WHERE user_id = p_user_id AND revoked_at IS NULL;

  RETURN jsonb_build_object('status', 'ok', 'user_id', p_user_id);
END;
$$;

-- 2.6 RPC: heartbeat_device(device_id) throttled ping
CREATE OR REPLACE FUNCTION public.heartbeat_device(p_device_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_revoked TIMESTAMPTZ;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('valid', FALSE, 'reason', 'unauthenticated');
  END IF;

  SELECT revoked_at INTO v_revoked
  FROM public.user_devices
  WHERE id = p_device_id AND user_id = v_user_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', FALSE, 'reason', 'not_found');
  END IF;

  IF v_revoked IS NOT NULL THEN
    RETURN jsonb_build_object('valid', FALSE, 'reason', 'revoked');
  END IF;

  UPDATE public.user_devices
  SET last_seen_at = NOW()
  WHERE id = p_device_id;

  RETURN jsonb_build_object('valid', TRUE);
END;
$$;

-- 2.7 RLS Policies on user_devices
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users read own devices" ON public.user_devices;
CREATE POLICY "users read own devices"
  ON public.user_devices FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_super_admin());

DROP POLICY IF EXISTS "users update own devices" ON public.user_devices;
CREATE POLICY "users update own devices"
  ON public.user_devices FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_super_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_super_admin());

DROP POLICY IF EXISTS "super admin manages devices" ON public.user_devices;
CREATE POLICY "super admin manages devices"
  ON public.user_devices FOR ALL TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- 2.8 Safe Session Guard Integration on Core Tables
-- By attaching public.is_session_active() as a restrictive guard, revoked sessions
-- cannot read cases, clients, hearings, documents, or reminders.
DROP POLICY IF EXISTS "session_active_cases_guard" ON public.cases;
CREATE POLICY "session_active_cases_guard"
  ON public.cases AS RESTRICTIVE FOR SELECT TO authenticated
  USING (public.is_session_active());

DROP POLICY IF EXISTS "session_active_clients_guard" ON public.clients;
CREATE POLICY "session_active_clients_guard"
  ON public.clients AS RESTRICTIVE FOR SELECT TO authenticated
  USING (public.is_session_active());

DROP POLICY IF EXISTS "session_active_hearings_guard" ON public.hearings;
CREATE POLICY "session_active_hearings_guard"
  ON public.hearings AS RESTRICTIVE FOR SELECT TO authenticated
  USING (public.is_session_active());

DROP POLICY IF EXISTS "session_active_documents_guard" ON public.documents;
CREATE POLICY "session_active_documents_guard"
  ON public.documents AS RESTRICTIVE FOR SELECT TO authenticated
  USING (public.is_session_active());

DROP POLICY IF EXISTS "session_active_reminders_guard" ON public.reminders;
CREATE POLICY "session_active_reminders_guard"
  ON public.reminders AS RESTRICTIVE FOR SELECT TO authenticated
  USING (public.is_session_active());
