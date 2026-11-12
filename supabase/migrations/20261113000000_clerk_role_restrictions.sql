-- Migration: 20261113000000_clerk_role_restrictions.sql
-- Description: Implement role-based restrictions for clerk (munshi) role
--              and enforce documents bucket file type & size limits (10MB, PDF/DOCX/JPG/PNG).

-- =============================================================================
-- 1. DOCUMENTS STORAGE BUCKET CONFIGURATION & RESTRICTIONS (10MB, PDF/DOCX/JPG/PNG)
-- =============================================================================

-- Ensure documents bucket exists with exact 10MB limit (10485760 bytes)
-- and only PDF, DOCX, JPG, PNG mime types.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  FALSE,
  10485760, -- 10 MB
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
  ]
)
ON CONFLICT (id) DO UPDATE
SET public = FALSE,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY[
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];

-- Storage Policies on storage.objects for 'documents' bucket
-- Documents Delete: Lawyers and Admins only (Clerk CANNOT delete documents)
DROP POLICY IF EXISTS "firm admins delete documents" ON storage.objects;
DROP POLICY IF EXISTS "firm lawyers and admins delete documents" ON storage.objects;
CREATE POLICY "firm lawyers and admins delete documents"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = public.current_firm_id()::TEXT
    AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
  );

DROP POLICY IF EXISTS "stage2 firm documents delete guard" ON storage.objects;
CREATE POLICY "stage2 firm documents delete guard"
  ON storage.objects AS RESTRICTIVE FOR DELETE TO authenticated
  USING (
    bucket_id <> 'documents'
    OR (
      (storage.foldername(name))[1] = public.current_firm_id()::TEXT
      AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
    )
  );

-- Database table public.documents delete policy: Lawyers and Admins only
DROP POLICY IF EXISTS "admin deletes documents" ON public.documents;
DROP POLICY IF EXISTS "lawyers and admins delete documents" ON public.documents;
CREATE POLICY "lawyers and admins delete documents"
  ON public.documents FOR DELETE TO authenticated
  USING (
    firm_id = public.current_firm_id()
    AND public.write_access(firm_id)
    AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
  );

-- =============================================================================
-- 2. HEARINGS PERMISSIONS (Clerk CAN add and edit hearings)
-- =============================================================================

-- Allow all active firm members (including clerk) to insert hearings
DROP POLICY IF EXISTS "all firm members insert hearings" ON public.hearings;
DROP POLICY IF EXISTS "firm members insert hearings" ON public.hearings;
CREATE POLICY "firm members insert hearings"
  ON public.hearings FOR INSERT TO authenticated
  WITH CHECK (
    firm_id = public.current_firm_id()
    AND public.write_access(firm_id)
  );

-- Allow all active firm members (including clerk) to update hearings
DROP POLICY IF EXISTS "lawyer+ updates hearings" ON public.hearings;
DROP POLICY IF EXISTS "firm members update hearings" ON public.hearings;
CREATE POLICY "firm members update hearings"
  ON public.hearings FOR UPDATE TO authenticated
  USING (
    firm_id = public.current_firm_id()
    AND public.write_access(firm_id)
  )
  WITH CHECK (
    firm_id = public.current_firm_id()
    AND public.write_access(firm_id)
  );

-- Clerk CANNOT delete hearings (admin only)
DROP POLICY IF EXISTS "admin deletes hearings" ON public.hearings;
CREATE POLICY "admin deletes hearings"
  ON public.hearings FOR DELETE TO authenticated
  USING (
    firm_id = public.current_firm_id()
    AND public.write_access(firm_id)
    AND public.is_admin_or_above()
  );

-- Update public.update_hearing RPC to permit clerk role
CREATE OR REPLACE FUNCTION public.update_hearing(
  p_hearing_id UUID,
  p_current_proceeding TEXT,
  p_next_date DATE,
  p_next_proceeding TEXT DEFAULT NULL,
  p_judge_name TEXT DEFAULT NULL,
  p_court_no TEXT DEFAULT NULL,
  p_serial_no TEXT DEFAULT NULL
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
  IF auth.uid() IS NULL OR public.current_role() NOT IN ('super_admin', 'admin', 'lawyer', 'clerk') THEN
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

-- =============================================================================
-- 3. CASES & CLIENTS RESTRICTIONS (Clerk CANNOT create or delete cases/clients)
-- =============================================================================

-- Cases Insert: Only lawyer, admin, super_admin (Clerk CANNOT create new cases)
DROP POLICY IF EXISTS "lawyer+ inserts cases" ON public.cases;
CREATE POLICY "lawyer+ inserts cases"
  ON public.cases FOR INSERT TO authenticated
  WITH CHECK (
    firm_id = public.current_firm_id()
    AND public.write_access(firm_id)
    AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
  );

-- Cases Delete: Admin only (Clerk CANNOT delete cases)
DROP POLICY IF EXISTS "admin deletes cases" ON public.cases;
CREATE POLICY "admin deletes cases"
  ON public.cases FOR DELETE TO authenticated
  USING (
    firm_id = public.current_firm_id()
    AND public.write_access(firm_id)
    AND public.is_admin_or_above()
  );

-- Clients Insert: Only lawyer, admin, super_admin (Clerk CANNOT create clients)
DROP POLICY IF EXISTS "lawyer+ inserts clients" ON public.clients;
CREATE POLICY "lawyer+ inserts clients"
  ON public.clients FOR INSERT TO authenticated
  WITH CHECK (
    firm_id = public.current_firm_id()
    AND public.write_access(firm_id)
    AND public.current_role() IN ('super_admin', 'admin', 'lawyer')
  );

-- Clients Delete: Admin only (Clerk CANNOT delete clients)
DROP POLICY IF EXISTS "admin deletes clients" ON public.clients;
CREATE POLICY "admin deletes clients"
  ON public.clients FOR DELETE TO authenticated
  USING (
    firm_id = public.current_firm_id()
    AND public.write_access(firm_id)
    AND public.is_admin_or_above()
  );

-- =============================================================================
-- 4. CASE NOTES (Clerk CAN add case notes, but CANNOT delete other notes)
-- =============================================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='case_notes') THEN
    EXECUTE 'DROP POLICY IF EXISTS "firm members insert case_notes" ON public.case_notes';
    EXECUTE 'CREATE POLICY "firm members insert case_notes" ON public.case_notes FOR INSERT TO authenticated WITH CHECK (firm_id = public.current_firm_id() AND public.write_access(firm_id))';

    EXECUTE 'DROP POLICY IF EXISTS "firm members delete case_notes" ON public.case_notes';
    EXECUTE 'DROP POLICY IF EXISTS "author or admin deletes case_notes" ON public.case_notes';
    EXECUTE 'CREATE POLICY "author or admin deletes case_notes" ON public.case_notes FOR DELETE TO authenticated USING (firm_id = public.current_firm_id() AND public.write_access(firm_id) AND (created_by = auth.uid() OR public.is_admin_or_above()))';
  END IF;
END $$;

-- =============================================================================
-- 5. FEE & PAYMENT DATA RESTRICTIONS (Clerk CANNOT view or edit any fee/payment data)
-- =============================================================================

-- Payments: Only lawyer/admin/super_admin can view; only admin/super_admin can submit
DROP POLICY IF EXISTS "payments_read" ON public.payments;
CREATE POLICY "payments_read"
  ON public.payments FOR SELECT TO authenticated
  USING (
    (firm_id = public.current_firm_id() AND public.current_role() IN ('super_admin', 'admin', 'lawyer'))
    OR public.is_super_admin()
  );

DROP POLICY IF EXISTS "payments_insert" ON public.payments;
CREATE POLICY "payments_insert"
  ON public.payments FOR INSERT TO authenticated
  WITH CHECK (
    firm_id = public.current_firm_id()
    AND public.current_role() IN ('super_admin', 'admin')
  );

-- Subscriptions: Clerk CANNOT view subscriptions
DROP POLICY IF EXISTS "subs_read" ON public.subscriptions;
CREATE POLICY "subs_read"
  ON public.subscriptions FOR SELECT TO authenticated
  USING (
    (firm_id = public.current_firm_id() AND public.current_role() IN ('super_admin', 'admin', 'lawyer'))
    OR public.is_super_admin()
  );

-- Billing Events: Clerk CANNOT view billing events
DROP POLICY IF EXISTS "events_read" ON public.billing_events;
CREATE POLICY "events_read"
  ON public.billing_events FOR SELECT TO authenticated
  USING (
    (firm_id = public.current_firm_id() AND public.current_role() IN ('super_admin', 'admin', 'lawyer'))
    OR public.is_super_admin()
  );

-- Storage bucket 'payment-slips': Clerk CANNOT view or upload payment slips
DROP POLICY IF EXISTS "payment slips read own firm" ON storage.objects;
CREATE POLICY "payment slips read own firm" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'payment-slips'
    AND (
      ((storage.foldername(name))[1] = public.current_firm_id()::TEXT AND public.current_role() IN ('super_admin', 'admin', 'lawyer'))
      OR public.is_super_admin()
    )
  );

DROP POLICY IF EXISTS "payment slips insert own firm" ON storage.objects;
CREATE POLICY "payment slips insert own firm" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'payment-slips'
    AND (storage.foldername(name))[1] = public.current_firm_id()::TEXT
    AND public.current_role() IN ('super_admin', 'admin')
  );

-- Submit payment RPC: enforce admin check
CREATE OR REPLACE FUNCTION public.submit_payment(
  p_plan_id UUID,
  p_method payment_method,
  p_reference_no TEXT,
  p_slip_path TEXT,
  p_amount NUMERIC
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user UUID := auth.uid();
  v_firm UUID;
  v_payment UUID;
BEGIN
  v_firm := public.current_firm_id();
  IF v_firm IS NULL THEN RAISE EXCEPTION 'No firm'; END IF;
  IF public.current_role() NOT IN ('super_admin', 'admin') THEN
    RAISE EXCEPTION 'Only firm administrators can submit payments.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.plans WHERE id = p_plan_id AND is_active) THEN
    RAISE EXCEPTION 'Invalid plan';
  END IF;
  INSERT INTO public.payments (firm_id, plan_id, amount_pkr, method, reference_no, slip_path, submitted_by)
  VALUES (v_firm, p_plan_id, p_amount, p_method, p_reference_no, p_slip_path, v_user)
  RETURNING id INTO v_payment;
  RETURN v_payment;
END;
$$;

-- =============================================================================
-- 6. SETTINGS RESTRICTIONS (Clerk CANNOT change firm, subscription, or user settings)
-- =============================================================================

-- Firms Update: Only admin or super_admin
DROP POLICY IF EXISTS "admin updates firm" ON public.firms;
CREATE POLICY "admin updates firm"
  ON public.firms FOR UPDATE TO authenticated
  USING (id = public.current_firm_id() AND public.is_admin_or_above())
  WITH CHECK (id = public.current_firm_id() AND public.is_admin_or_above());
