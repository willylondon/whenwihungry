-- DRAFT FOR PRODUCTION: verified on disposable staging ctmzxgkccxkgeuzntltc only.
-- Enable the app only after verifying profiles.role is protected from self-escalation,
-- this migration's direct-API permission matrix, and a named queue monitoring owner.
-- Only the NEW inquiry table is changed; no existing-table policies are replaced.
BEGIN;

CREATE TABLE public.review_requests (
  id uuid PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_name text NOT NULL CHECK (char_length(btrim(contact_name)) BETWEEN 2 AND 120),
  restaurant_name text NOT NULL CHECK (char_length(btrim(restaurant_name)) BETWEEN 2 AND 160),
  location text NOT NULL CHECK (char_length(btrim(location)) BETWEEN 2 AND 240),
  contact_email text NOT NULL CHECK (char_length(contact_email) <= 254 AND contact_email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  contact_phone text CHECK (contact_phone IS NULL OR char_length(contact_phone) <= 40),
  message text NOT NULL CHECK (char_length(btrim(message)) BETWEEN 10 AND 3000),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Database-enforced backpressure and idempotency; owners cannot close their own row.
CREATE UNIQUE INDEX review_requests_one_open_per_owner
  ON public.review_requests(owner_id) WHERE status IN ('pending', 'in_review');
CREATE INDEX review_requests_queue_order ON public.review_requests(status, created_at);
CREATE INDEX review_requests_owner_history ON public.review_requests(owner_id, created_at DESC);

ALTER TABLE public.review_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.review_requests FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.review_requests TO authenticated;
GRANT INSERT (id, owner_id, contact_name, restaurant_name, location, contact_email, contact_phone, message)
  ON public.review_requests TO authenticated;
GRANT UPDATE (status) ON public.review_requests TO authenticated;

CREATE POLICY review_requests_owner_read ON public.review_requests
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = owner_id AND NOT COALESCE((SELECT auth.jwt()->>'is_anonymous')::boolean, false));
CREATE POLICY review_requests_owner_insert ON public.review_requests
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = owner_id AND NOT COALESCE((SELECT auth.jwt()->>'is_anonymous')::boolean, false));

-- Invoker lookup: this intentionally depends on verified profiles SELECT/role protection.
-- No SECURITY DEFINER, no user_metadata claims, no public or anonymous read policy.
CREATE POLICY review_requests_admin_read ON public.review_requests
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'));
CREATE POLICY review_requests_admin_status_update ON public.review_requests
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'));

COMMENT ON TABLE public.review_requests IS 'Private restaurant review inquiries. Owners read their own rows; trusted admins triage status. No promise of review coverage or response. See docs/REVIEW_REQUESTS_ROLLOUT.md.';
COMMIT;
