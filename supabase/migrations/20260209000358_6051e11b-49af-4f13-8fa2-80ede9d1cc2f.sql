
-- Enable RLS on all tables that currently lack it

-- 1. ai_advice_cache (shared cache, no user_id - allow authenticated read, service role writes)
ALTER TABLE public.ai_advice_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read advice cache"
  ON public.ai_advice_cache FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert advice cache"
  ON public.ai_advice_cache FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete expired cache"
  ON public.ai_advice_cache FOR DELETE
  TO authenticated
  USING (expires_at < NOW());

-- 2. booking_questions (has user_id - owner-scoped)
ALTER TABLE public.booking_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own booking questions"
  ON public.booking_questions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own booking questions"
  ON public.booking_questions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own booking questions"
  ON public.booking_questions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own booking questions"
  ON public.booking_questions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. email_inboxes (has user_id - owner-scoped)
ALTER TABLE public.email_inboxes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own email inboxes"
  ON public.email_inboxes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email inboxes"
  ON public.email_inboxes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own email inboxes"
  ON public.email_inboxes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own email inboxes"
  ON public.email_inboxes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. inbound_emails (has user_id - owner-scoped)
ALTER TABLE public.inbound_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own inbound emails"
  ON public.inbound_emails FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inbound emails"
  ON public.inbound_emails FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inbound emails"
  ON public.inbound_emails FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own inbound emails"
  ON public.inbound_emails FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 5. email_attachments (linked via email_id to inbound_emails)
ALTER TABLE public.email_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view attachments of own emails"
  ON public.email_attachments FOR SELECT
  TO authenticated
  USING (
    email_id IN (
      SELECT id FROM public.inbound_emails WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert attachments for own emails"
  ON public.email_attachments FOR INSERT
  TO authenticated
  WITH CHECK (
    email_id IN (
      SELECT id FROM public.inbound_emails WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete attachments of own emails"
  ON public.email_attachments FOR DELETE
  TO authenticated
  USING (
    email_id IN (
      SELECT id FROM public.inbound_emails WHERE user_id = auth.uid()
    )
  );

-- 6. verified_senders (has user_id - owner-scoped)
ALTER TABLE public.verified_senders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own verified senders"
  ON public.verified_senders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own verified senders"
  ON public.verified_senders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own verified senders"
  ON public.verified_senders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own verified senders"
  ON public.verified_senders FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
