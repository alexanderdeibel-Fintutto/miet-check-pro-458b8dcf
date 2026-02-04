-- Fix admin_logs conflicting RLS policies
-- Remove the conflicting permissive policies

DROP POLICY IF EXISTS "Authenticated can insert admin_logs" ON public.admin_logs;
DROP POLICY IF EXISTS "Authenticated can view admin_logs" ON public.admin_logs;

-- Ensure proper restrictive policies exist
-- Only service role should write, only admins can read
DROP POLICY IF EXISTS "No client writes to admin logs" ON public.admin_logs;
DROP POLICY IF EXISTS "Only admins can read admin logs" ON public.admin_logs;

-- Create clean policies
CREATE POLICY "No client writes to admin logs"
  ON public.admin_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "Only admins can read admin logs"
  ON public.admin_logs
  FOR SELECT
  TO authenticated
  USING (public.has_role_by_name(auth.uid(), 'admin'));

-- Fix leads table - restrict SELECT to admins only
DROP POLICY IF EXISTS "Leads select policy" ON public.leads;
DROP POLICY IF EXISTS "Admin read leads" ON public.leads;

CREATE POLICY "Only admins can read leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (public.has_role_by_name(auth.uid(), 'admin'));

-- Fix bank_accounts - add WITH CHECK to prevent user_id manipulation on INSERT
DROP POLICY IF EXISTS "bank_acc_all" ON public.bank_accounts;
DROP POLICY IF EXISTS "Users can manage own bank accounts" ON public.bank_accounts;

CREATE POLICY "Users can view own bank accounts"
  ON public.bank_accounts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bank accounts"
  ON public.bank_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bank accounts"
  ON public.bank_accounts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bank accounts"
  ON public.bank_accounts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);