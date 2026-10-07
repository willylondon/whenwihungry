-- DRAFT, UNAPPLIED. Based on read-only production catalog evidence on 2026-10-07.
-- Apply only to an approved synthetic staging baseline first. No customer rows
-- are copied, rewritten or deleted. Keep enquiry intake disabled throughout.
BEGIN;

-- Self-owned row policies alone do not protect role columns.
REVOKE ALL ON public.profiles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT INSERT (id, display_name) ON public.profiles TO authenticated;
GRANT UPDATE (display_name) ON public.profiles TO authenticated;

-- Signup must never promote based on an unverified email or editable metadata.
-- Existing roles are preserved. Only a trusted operator assigns admin roles.
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), 'user')
  ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- The actual table has reviewed_at, not visit_date. Preserve existing dates;
-- unknown historic visit dates stay NULL, never inferred from publication.
ALTER TABLE public.admin_reviews ADD COLUMN visit_date date;

ALTER TABLE public.admin_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.admin_reviews, public.user_reviews, public.dishes,
  public.search_keywords, public.search_logs FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.admin_reviews, public.user_reviews, public.dishes, public.search_keywords TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.admin_reviews, public.dishes, public.search_keywords TO authenticated;
GRANT INSERT (restaurant_id, user_id, rating, comment, status) ON public.user_reviews TO authenticated;
GRANT UPDATE (status) ON public.user_reviews TO authenticated;

CREATE POLICY launch_critic_public_read ON public.admin_reviews FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = restaurant_id AND r.status = 'approved'
  AND r.is_active IS DISTINCT FROM false AND r.review_status = 'reviewed'));
CREATE POLICY launch_critic_admin ON public.admin_reviews FOR ALL TO authenticated
USING (NOT COALESCE((auth.jwt()->>'is_anonymous')::boolean, false)
  AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
WITH CHECK (NOT COALESCE((auth.jwt()->>'is_anonymous')::boolean, false)
  AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY launch_user_review_read ON public.user_reviews FOR SELECT TO anon, authenticated
USING (status = 'approved' AND EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = restaurant_id
  AND r.status = 'approved' AND r.is_active IS DISTINCT FROM false));
CREATE POLICY launch_user_review_owner_read ON public.user_reviews FOR SELECT TO authenticated
USING (user_id = auth.uid() AND NOT COALESCE((auth.jwt()->>'is_anonymous')::boolean, false));
CREATE POLICY launch_user_review_submit ON public.user_reviews FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND status = 'pending'
  AND NOT COALESCE((auth.jwt()->>'is_anonymous')::boolean, false)
  AND rating BETWEEN 1 AND 5 AND char_length(btrim(comment)) BETWEEN 1 AND 500
  AND EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = restaurant_id AND r.status = 'approved'
    AND r.is_active IS DISTINCT FROM false AND r.data_quality_status IS DISTINCT FROM 'rejected'
    AND r.business_type IS DISTINCT FROM 'not_food'
    AND (r.latitude IS NULL OR r.longitude IS NULL OR
      (r.latitude BETWEEN 17.6 AND 18.7 AND r.longitude BETWEEN -78.6 AND -76.1))));
CREATE POLICY launch_user_review_admin ON public.user_reviews FOR ALL TO authenticated
USING (NOT COALESCE((auth.jwt()->>'is_anonymous')::boolean, false)
  AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
WITH CHECK (NOT COALESCE((auth.jwt()->>'is_anonymous')::boolean, false)
  AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY launch_dish_public_read ON public.dishes FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = restaurant_id AND r.status = 'approved' AND r.is_active IS DISTINCT FROM false));
CREATE POLICY launch_dish_admin ON public.dishes FOR ALL TO authenticated
USING (NOT COALESCE((auth.jwt()->>'is_anonymous')::boolean, false)
  AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
WITH CHECK (NOT COALESCE((auth.jwt()->>'is_anonymous')::boolean, false)
  AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
CREATE POLICY launch_keyword_public_read ON public.search_keywords FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = restaurant_id AND r.status = 'approved' AND r.is_active IS DISTINCT FROM false));
CREATE POLICY launch_keyword_admin ON public.search_keywords FOR ALL TO authenticated
USING (NOT COALESCE((auth.jwt()->>'is_anonymous')::boolean, false)
  AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
WITH CHECK (NOT COALESCE((auth.jwt()->>'is_anonymous')::boolean, false)
  AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
-- Search logs have no client grants or policies; only trusted backend roles retain access.

-- The legacy rating/comment pathways are superseded by moderated user_reviews.
-- Retain public reads, close their broad direct write path for this release.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
ON public.restaurant_ratings, public.restaurant_comments FROM PUBLIC, anon, authenticated;
REVOKE TRUNCATE, REFERENCES, TRIGGER ON public.restaurants FROM PUBLIC, anon, authenticated;

-- Preserve owner submission policy while preventing protected-column spoofing.
CREATE FUNCTION public.guard_listing_submission() RETURNS trigger
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  IF current_user IN ('anon', 'authenticated') THEN
    IF auth.uid() IS NULL OR COALESCE((auth.jwt()->>'is_anonymous')::boolean, false) THEN
      RAISE EXCEPTION 'Permanent account required' USING ERRCODE = '42501';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin') THEN
      IF TG_OP = 'UPDATE' THEN
        RAISE EXCEPTION 'Listing edits require moderation' USING ERRCODE = '42501';
      END IF;
      IF NEW.submitted_by IS DISTINCT FROM auth.uid() OR NEW.status IS DISTINCT FROM 'pending'
        OR NEW.review_status IS DISTINCT FROM 'not_reviewed'
        OR COALESCE(NEW.is_verified, false) OR COALESCE(NEW.is_featured, false)
        OR COALESCE(NEW.manually_verified, false) OR COALESCE(NEW.official_recommended, false)
        OR COALESCE(NEW.admin_boost, 0) <> 0 OR COALESCE(NEW.recommendation_score, 0) <> 0
        OR COALESCE(NEW.avg_rating, 0) <> 0 OR COALESCE(NEW.rating_count, 0) <> 0
        OR COALESCE(NEW.positive_comment_count, 0) <> 0 OR COALESCE(NEW.view_count, 0) <> 0
        OR NEW.critic_reviewed_at IS NOT NULL OR NEW.public_rating_source IS NOT NULL THEN
        RAISE EXCEPTION 'Protected listing fields' USING ERRCODE = '42501';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.guard_listing_submission() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER launch_guard_listing BEFORE INSERT OR UPDATE ON public.restaurants
FOR EACH ROW EXECUTE FUNCTION public.guard_listing_submission();
CREATE POLICY launch_admin_listing_insert ON public.restaurants FOR INSERT TO authenticated
WITH CHECK (NOT COALESCE((auth.jwt()->>'is_anonymous')::boolean, false)
  AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
-- Pin legacy invoker search functions without changing their matching behavior.
-- Put pg_temp last so temporary objects cannot shadow the audited public tables.
REVOKE CREATE ON SCHEMA public FROM PUBLIC, anon, authenticated;
ALTER FUNCTION public.generate_restaurant_search_text(uuid) SET search_path = pg_catalog, public, pg_temp;
ALTER FUNCTION public.lower_text_array(text[]) SET search_path = pg_catalog, public, pg_temp;
ALTER FUNCTION public.search_restaurants(text) SET search_path = pg_catalog, public, pg_temp;
ALTER FUNCTION public.trg_refresh_search_text() SET search_path = pg_catalog, public, pg_temp;
-- New hosted projects may install this event-trigger helper. It is never a client RPC.
DO $$ BEGIN
  IF to_regprocedure('public.rls_auto_enable()') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
  END IF;
END $$;
COMMIT;
