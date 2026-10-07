-- STAGING ONLY: structural export of public catalog, 2026-10-07. No customer rows.
-- NEVER apply this reconstruction to production. Existing table names deliberately fail.
-- Original unsafe grants/policies are preserved here for regression testing.
-- Apply all launch migrations before exposing a staging API or adding fixtures.
SET search_path = public, extensions, pg_catalog;

CREATE TABLE public."profiles" (
  "id" uuid NOT NULL,
  "display_name" text,
  "role" text DEFAULT 'user'::text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public."restaurant_ratings" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "restaurant_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "rating" integer NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public."restaurant_comments" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "restaurant_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "body" text NOT NULL,
  "status" text DEFAULT 'visible'::text NOT NULL,
  "is_positive" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public."restaurants" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "parish" text NOT NULL,
  "area" text,
  "address" text,
  "phone" text,
  "website" text,
  "instagram" text,
  "tiktok" text,
  "price_range" text,
  "category" text,
  "image_url" text,
  "status" text DEFAULT 'pending'::text NOT NULL,
  "submitted_by" uuid,
  "official_recommended" boolean DEFAULT false NOT NULL,
  "avg_rating" numeric(3,2) DEFAULT 0 NOT NULL,
  "rating_count" integer DEFAULT 0 NOT NULL,
  "positive_comment_count" integer DEFAULT 0 NOT NULL,
  "view_count" integer DEFAULT 0 NOT NULL,
  "recommendation_score" numeric(8,2) DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "latitude" numeric,
  "longitude" numeric,
  "google_place_id" text,
  "google_maps_url" text,
  "scrape_source" text,
  "source_url" text,
  "confidence_score" numeric DEFAULT 0,
  "needs_review" boolean DEFAULT false,
  "cuisine_type" text,
  "scrape_categories" jsonb DEFAULT '[]'::jsonb,
  "opening_hours" jsonb DEFAULT '{}'::jsonb,
  "image_source" text,
  "image_attribution" text,
  "image_license" text,
  "is_active" boolean DEFAULT true,
  "admin_boost" double precision DEFAULT 0,
  "is_featured" boolean DEFAULT false,
  "is_verified" boolean DEFAULT false,
  "price_level" integer DEFAULT 2,
  "search_text" text,
  "review_status" text DEFAULT 'not_reviewed'::text,
  "source_status" text DEFAULT 'public_import'::text,
  "critic_reviewed_at" timestamp with time zone,
  "public_rating_source" text,
  "search_keywords" text[],
  "dish_tags" text[],
  "vibe_tags" text[],
  "meal_tags" text[],
  "location_tags" text[],
  "data_quality_status" text DEFAULT 'verified'::text,
  "business_type" text DEFAULT 'food_spot'::text,
  "manually_verified" boolean DEFAULT false,
  "location_notes" text,
  "description_status" text DEFAULT 'verified'::text
);

CREATE TABLE public."dishes" (
  "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
  "restaurant_id" uuid,
  "name" text NOT NULL,
  "normalized_name" text NOT NULL,
  "category" text,
  "tags" text[],
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE public."admin_reviews" (
  "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
  "restaurant_id" uuid,
  "verdict" text NOT NULL,
  "admin_score" integer DEFAULT 50,
  "headline" text,
  "honest_take" text,
  "video_url" text,
  "reviewed_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE public."user_reviews" (
  "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
  "restaurant_id" uuid,
  "user_id" uuid,
  "rating" integer NOT NULL,
  "comment" text,
  "tags" text[],
  "status" text DEFAULT 'pending'::text,
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE public."search_keywords" (
  "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
  "restaurant_id" uuid,
  "keyword" text NOT NULL,
  "weight" double precision DEFAULT 1.0,
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE public."search_logs" (
  "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
  "query" text NOT NULL,
  "normalized_query" text,
  "result_count" integer DEFAULT 0,
  "created_at" timestamp with time zone DEFAULT now()
);

ALTER TABLE public."admin_reviews" ADD CONSTRAINT "admin_reviews_admin_score_check" CHECK (((admin_score >= 0) AND (admin_score <= 100)));

ALTER TABLE public."admin_reviews" ADD CONSTRAINT "admin_reviews_pkey" PRIMARY KEY (id);

ALTER TABLE public."admin_reviews" ADD CONSTRAINT "admin_reviews_restaurant_id_key" UNIQUE (restaurant_id);

ALTER TABLE public."admin_reviews" ADD CONSTRAINT "admin_reviews_verdict_check" CHECK ((verdict = ANY (ARRAY['RUN_GO_GET_IT'::text, 'WORTH_IT'::text, 'MID'::text, 'SAVE_YOUR_MONEY'::text])));

ALTER TABLE public."dishes" ADD CONSTRAINT "dishes_pkey" PRIMARY KEY (id);

ALTER TABLE public."profiles" ADD CONSTRAINT "profiles_pkey" PRIMARY KEY (id);

ALTER TABLE public."profiles" ADD CONSTRAINT "profiles_role_check" CHECK ((role = ANY (ARRAY['user'::text, 'admin'::text])));

ALTER TABLE public."restaurant_comments" ADD CONSTRAINT "restaurant_comments_body_check" CHECK (((char_length(body) >= 3) AND (char_length(body) <= 800)));

ALTER TABLE public."restaurant_comments" ADD CONSTRAINT "restaurant_comments_pkey" PRIMARY KEY (id);

ALTER TABLE public."restaurant_comments" ADD CONSTRAINT "restaurant_comments_status_check" CHECK ((status = ANY (ARRAY['visible'::text, 'hidden'::text])));

ALTER TABLE public."restaurant_ratings" ADD CONSTRAINT "restaurant_ratings_pkey" PRIMARY KEY (id);

ALTER TABLE public."restaurant_ratings" ADD CONSTRAINT "restaurant_ratings_rating_check" CHECK (((rating >= 1) AND (rating <= 5)));

ALTER TABLE public."restaurant_ratings" ADD CONSTRAINT "restaurant_ratings_restaurant_id_user_id_key" UNIQUE (restaurant_id, user_id);

ALTER TABLE public."restaurants" ADD CONSTRAINT "restaurants_pkey" PRIMARY KEY (id);

ALTER TABLE public."restaurants" ADD CONSTRAINT "restaurants_review_status_check" CHECK ((review_status = ANY (ARRAY['not_reviewed'::text, 'in_progress'::text, 'reviewed'::text, 'needs_update'::text])));

ALTER TABLE public."restaurants" ADD CONSTRAINT "restaurants_slug_key" UNIQUE (slug);

ALTER TABLE public."restaurants" ADD CONSTRAINT "restaurants_source_status_check" CHECK ((source_status = ANY (ARRAY['critic_reviewed'::text, 'community_listed'::text, 'public_import'::text, 'needs_verification'::text, 'verified'::text])));

ALTER TABLE public."restaurants" ADD CONSTRAINT "restaurants_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])));

ALTER TABLE public."search_keywords" ADD CONSTRAINT "search_keywords_pkey" PRIMARY KEY (id);

ALTER TABLE public."search_logs" ADD CONSTRAINT "search_logs_pkey" PRIMARY KEY (id);

ALTER TABLE public."user_reviews" ADD CONSTRAINT "user_reviews_pkey" PRIMARY KEY (id);

ALTER TABLE public."user_reviews" ADD CONSTRAINT "user_reviews_rating_check" CHECK (((rating >= 1) AND (rating <= 5)));

ALTER TABLE public."user_reviews" ADD CONSTRAINT "user_reviews_restaurant_id_user_id_key" UNIQUE (restaurant_id, user_id);

ALTER TABLE public."user_reviews" ADD CONSTRAINT "user_reviews_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])));

ALTER TABLE public."admin_reviews" ADD CONSTRAINT "admin_reviews_restaurant_id_fkey" FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE;

ALTER TABLE public."dishes" ADD CONSTRAINT "dishes_restaurant_id_fkey" FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE;

ALTER TABLE public."profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public."restaurant_comments" ADD CONSTRAINT "restaurant_comments_restaurant_id_fkey" FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE;

ALTER TABLE public."restaurant_comments" ADD CONSTRAINT "restaurant_comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public."restaurant_ratings" ADD CONSTRAINT "restaurant_ratings_restaurant_id_fkey" FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE;

ALTER TABLE public."restaurant_ratings" ADD CONSTRAINT "restaurant_ratings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public."restaurants" ADD CONSTRAINT "restaurants_submitted_by_fkey" FOREIGN KEY (submitted_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public."search_keywords" ADD CONSTRAINT "search_keywords_restaurant_id_fkey" FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE;

ALTER TABLE public."user_reviews" ADD CONSTRAINT "user_reviews_restaurant_id_fkey" FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE;

ALTER TABLE public."user_reviews" ADD CONSTRAINT "user_reviews_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX idx_restaurants_dish_tags ON public.restaurants USING gin (dish_tags);

CREATE INDEX idx_restaurants_vibe_tags ON public.restaurants USING gin (vibe_tags);

CREATE INDEX idx_restaurants_search_keywords ON public.restaurants USING gin (search_keywords);

CREATE INDEX idx_restaurants_status_score ON public.restaurants USING btree (status, recommendation_score DESC);

CREATE INDEX idx_restaurants_submitted_by ON public.restaurants USING btree (submitted_by);

CREATE INDEX idx_restaurant_comments_restaurant ON public.restaurant_comments USING btree (restaurant_id, created_at DESC);

CREATE INDEX idx_restaurant_ratings_restaurant ON public.restaurant_ratings USING btree (restaurant_id);

CREATE INDEX idx_restaurants_google_place_id ON public.restaurants USING btree (google_place_id);

CREATE INDEX idx_restaurants_location ON public.restaurants USING btree (latitude, longitude);

CREATE INDEX idx_restaurants_cuisine_type ON public.restaurants USING btree (cuisine_type);

CREATE INDEX idx_restaurants_needs_review ON public.restaurants USING btree (needs_review);

CREATE OR REPLACE FUNCTION public.generate_restaurant_search_text(r_id uuid)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
  result TEXT;
BEGIN
  SELECT lower(concat_ws(' ',
    r.name,
    r.description,
    r.cuisine_type,
    r.category,
    r.parish,
    r.area,
    r.address,
    (SELECT string_agg(d.name || ' ' || COALESCE(d.normalized_name, '') || ' ' || COALESCE(array_to_string(d.tags, ' '), ''), ' ')
     FROM dishes d WHERE d.restaurant_id = r.id),
    (SELECT string_agg(sk.keyword, ' ')
     FROM search_keywords sk WHERE sk.restaurant_id = r.id),
    (SELECT ar.headline || ' ' || COALESCE(ar.honest_take, '')
     FROM admin_reviews ar WHERE ar.restaurant_id = r.id LIMIT 1)
  ))
  INTO result
  FROM restaurants r
  WHERE r.id = r_id;
  RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    case when lower(new.email) = 'whenwihungry@gmail.com' then 'admin' else 'user' end
  )
  on conflict (id) do update set
    display_name = excluded.display_name,
    role = case when lower(new.email) = 'whenwihungry@gmail.com' then 'admin' else public.profiles.role end;
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.lower_text_array(t text[])
 RETURNS text[]
 LANGUAGE sql
 IMMUTABLE
AS $function$
  SELECT array_agg(lower(x)) FROM unnest(t) x;
$function$;

CREATE OR REPLACE FUNCTION public.refresh_restaurant_score(target_restaurant_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  rating_average numeric(3,2);
  rating_total integer;
  positive_total integer;
begin
  select coalesce(round(avg(rating)::numeric, 2), 0), count(*)
  into rating_average, rating_total
  from public.restaurant_ratings
  where restaurant_id = target_restaurant_id;

  select count(*)
  into positive_total
  from public.restaurant_comments
  where restaurant_id = target_restaurant_id
    and status = 'visible'
    and is_positive = true;

  update public.restaurants
  set avg_rating = rating_average,
      rating_count = rating_total,
      positive_comment_count = positive_total,
      recommendation_score = round(
        ((rating_average * 20) + least(rating_total, 50) + (positive_total * 2) + case when official_recommended then 25 else 0 end)::numeric,
        2
      ),
      updated_at = now()
  where id = target_restaurant_id;
end;
$function$;

CREATE OR REPLACE FUNCTION public.refresh_restaurant_score_from_comment()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  perform public.refresh_restaurant_score(coalesce(new.restaurant_id, old.restaurant_id));
  return coalesce(new, old);
end;
$function$;

CREATE OR REPLACE FUNCTION public.refresh_restaurant_score_from_rating()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  perform public.refresh_restaurant_score(coalesce(new.restaurant_id, old.restaurant_id));
  return coalesce(new, old);
end;
$function$;

CREATE OR REPLACE FUNCTION public.search_restaurants(search_query text)
 RETURNS TABLE(id uuid, name text, slug text, description text, parish text, area text, cuisine_type text, category text, image_url text, price_level integer, is_verified boolean, verdict text, admin_score integer, community_score double precision, review_count bigint, match_reason text, final_score double precision)
 LANGUAGE plpgsql
AS $function$
DECLARE
  normalized_q TEXT;
BEGIN
  normalized_q := lower(trim(search_query));

  RETURN QUERY
  WITH relevance_cte AS (
    SELECT
      r.id,
      CASE
        WHEN r.name ILIKE '%' || normalized_q || '%' THEN 100
        WHEN r.cuisine_type ILIKE '%' || normalized_q || '%'
          OR r.category ILIKE '%' || normalized_q || '%' THEN 80
        WHEN EXISTS (SELECT 1 FROM unnest(r.search_keywords) k WHERE k ILIKE '%' || normalized_q || '%') THEN 75
        WHEN EXISTS (SELECT 1 FROM unnest(r.dish_tags) t WHERE t ILIKE '%' || normalized_q || '%') THEN 75
        WHEN EXISTS (SELECT 1 FROM unnest(r.vibe_tags) t WHERE t ILIKE '%' || normalized_q || '%') THEN 70
        WHEN r.search_text ILIKE '%' || normalized_q || '%' THEN 70
        WHEN r.description ILIKE '%' || normalized_q || '%' THEN 60
        WHEN r.parish ILIKE '%' || normalized_q || '%'
          OR r.area ILIKE '%' || normalized_q || '%' THEN 40
        WHEN EXISTS (SELECT 1 FROM unnest(r.location_tags) t WHERE t ILIKE '%' || normalized_q || '%') THEN 40
        ELSE 0
      END AS base_relevance,
      EXISTS (
        SELECT 1 FROM dishes d
        WHERE d.restaurant_id = r.id
        AND (d.name ILIKE '%' || normalized_q || '%'
          OR d.normalized_name ILIKE '%' || normalized_q || '%'
          OR EXISTS (SELECT 1 FROM unnest(d.tags) tag WHERE tag ILIKE '%' || normalized_q || '%'))
      ) AS dish_match,
      EXISTS (
        SELECT 1 FROM search_keywords sk
        WHERE sk.restaurant_id = r.id AND sk.keyword ILIKE '%' || normalized_q || '%'
      ) AS keyword_match,
      EXISTS (
        SELECT 1 FROM admin_reviews ar
        WHERE ar.restaurant_id = r.id
        AND (ar.headline ILIKE '%' || normalized_q || '%' OR ar.honest_take ILIKE '%' || normalized_q || '%')
      ) AS admin_match,
      EXISTS (
        SELECT 1 FROM user_reviews ur
        WHERE ur.restaurant_id = r.id AND ur.status = 'approved'
        AND ur.comment ILIKE '%' || normalized_q || '%'
      ) AS community_match
    FROM restaurants r
  ),
  scores_cte AS (
    SELECT
      r.id,
      COALESCE(ar.admin_score, 40) AS admin_score,
      COALESCE((SELECT AVG(rating) FROM user_reviews ur WHERE ur.restaurant_id = r.id AND ur.status = 'approved'), 0) * 20 AS community_score,
      (SELECT COUNT(*) FROM user_reviews ur WHERE ur.restaurant_id = r.id AND ur.status = 'approved') AS review_count,
      (SELECT GREATEST(
        rel.base_relevance,
        CASE WHEN rel.dish_match THEN 100 ELSE 0 END,
        CASE WHEN rel.keyword_match THEN 80 ELSE 0 END,
        CASE WHEN rel.admin_match THEN 70 ELSE 0 END,
        CASE WHEN rel.community_match THEN 50 ELSE 0 END
      ) FROM relevance_cte rel WHERE rel.id = r.id) AS keyword_relevance,
      CASE
        WHEN r.created_at > NOW() - INTERVAL '30 days' THEN 100
        WHEN r.created_at > NOW() - INTERVAL '90 days' THEN 50
        ELSE 0
      END AS freshness_score,
      r.admin_boost,
      ar.verdict,
      CASE
        WHEN r.name ILIKE '%' || normalized_q || '%' THEN 'Name match'
        WHEN EXISTS (SELECT 1 FROM dishes d WHERE d.restaurant_id = r.id AND (d.name ILIKE '%' || normalized_q || '%' OR d.normalized_name ILIKE '%' || normalized_q || '%')) THEN 'Dish match'
        WHEN EXISTS (SELECT 1 FROM unnest(r.dish_tags) t WHERE t ILIKE '%' || normalized_q || '%') THEN 'Dish tag match'
        WHEN r.cuisine_type ILIKE '%' || normalized_q || '%' THEN 'Cuisine match'
        WHEN r.category ILIKE '%' || normalized_q || '%' THEN 'Category match'
        WHEN r.search_text ILIKE '%' || normalized_q || '%' THEN 'Content match'
        WHEN EXISTS (SELECT 1 FROM search_keywords sk WHERE sk.restaurant_id = r.id AND sk.keyword ILIKE '%' || normalized_q || '%') THEN 'Keyword match'
        WHEN EXISTS (SELECT 1 FROM admin_reviews ar WHERE ar.restaurant_id = r.id AND (ar.headline ILIKE '%' || normalized_q || '%' OR ar.honest_take ILIKE '%' || normalized_q || '%')) THEN 'Expert review match'
        WHEN EXISTS (SELECT 1 FROM unnest(r.vibe_tags) t WHERE t ILIKE '%' || normalized_q || '%') THEN 'Vibe match'
        ELSE 'Community match'
      END AS match_reason
    FROM restaurants r
    LEFT JOIN admin_reviews ar ON ar.restaurant_id = r.id
  )
  SELECT
    r.id, r.name, r.slug, r.description, r.parish, r.area,
    r.cuisine_type, r.category, r.image_url, r.price_level, r.is_verified,
    s.verdict, s.admin_score, s.community_score, s.review_count,
    s.match_reason,
    (
      (s.admin_score * 0.60) +
      (s.community_score * 0.20) +
      (s.keyword_relevance * 0.15) +
      (s.freshness_score * 0.05) +
      s.admin_boost
    ) AS final_score
  FROM restaurants r
  JOIN scores_cte s ON s.id = r.id
  WHERE s.keyword_relevance > 0
  ORDER BY final_score DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.trg_refresh_search_text()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.search_text := generate_restaurant_search_text(NEW.id);
  RETURN NEW;
END;
$function$;

ALTER TABLE public."profiles" ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public."profiles" TO anon, authenticated, service_role;

ALTER TABLE public."restaurant_ratings" ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public."restaurant_ratings" TO anon, authenticated, service_role;

ALTER TABLE public."restaurant_comments" ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public."restaurant_comments" TO anon, authenticated, service_role;

ALTER TABLE public."restaurants" ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public."restaurants" TO anon, authenticated, service_role;

GRANT ALL ON public."dishes" TO anon, authenticated, service_role;

GRANT ALL ON public."admin_reviews" TO anon, authenticated, service_role;

GRANT ALL ON public."user_reviews" TO anon, authenticated, service_role;

GRANT ALL ON public."search_keywords" TO anon, authenticated, service_role;

GRANT ALL ON public."search_logs" TO anon, authenticated, service_role;

CREATE POLICY "Users can read own profile" ON public."profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((auth.uid() = id));

CREATE POLICY "Users can update own profile" ON public."profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));

CREATE POLICY "Users can insert own profile" ON public."profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((auth.uid() = id));

CREATE POLICY "Anyone can read approved restaurants" ON public."restaurants" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING ((status = 'approved'::text));

CREATE POLICY "Users can read own restaurant submissions" ON public."restaurants" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((submitted_by = auth.uid()));

CREATE POLICY "Users can submit restaurants" ON public."restaurants" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((submitted_by = auth.uid()) AND (status = 'pending'::text)));

CREATE POLICY "Users can update own pending restaurants" ON public."restaurants" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((submitted_by = auth.uid()) AND (status = 'pending'::text))) WITH CHECK (((submitted_by = auth.uid()) AND (status = 'pending'::text)));

CREATE POLICY "Anyone can read ratings for approved restaurants" ON public."restaurant_ratings" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING ((EXISTS ( SELECT 1
   FROM restaurants r
  WHERE ((r.id = restaurant_ratings.restaurant_id) AND (r.status = 'approved'::text)))));

CREATE POLICY "Users can rate approved restaurants" ON public."restaurant_ratings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((user_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM restaurants r
  WHERE ((r.id = restaurant_ratings.restaurant_id) AND (r.status = 'approved'::text))))));

CREATE POLICY "Users can update own ratings" ON public."restaurant_ratings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));

CREATE POLICY "Anyone can read visible comments for approved restaurants" ON public."restaurant_comments" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (((status = 'visible'::text) AND (EXISTS ( SELECT 1
   FROM restaurants r
  WHERE ((r.id = restaurant_comments.restaurant_id) AND (r.status = 'approved'::text))))));

CREATE POLICY "Users can comment on approved restaurants" ON public."restaurant_comments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((user_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM restaurants r
  WHERE ((r.id = restaurant_comments.restaurant_id) AND (r.status = 'approved'::text))))));

CREATE POLICY "Users can update own comments" ON public."restaurant_comments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));

CREATE POLICY "Admins can read all restaurant submissions" ON public."restaurants" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::text)))));

CREATE POLICY "Admins can moderate restaurants" ON public."restaurants" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::text))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::text)))));

CREATE POLICY "Admins can read all comments" ON public."restaurant_comments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::text)))));

CREATE POLICY "Admins can moderate comments" ON public."restaurant_comments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::text))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::text)))));

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_restaurants_updated_at BEFORE UPDATE ON public.restaurants FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_restaurant_ratings_updated_at BEFORE UPDATE ON public.restaurant_ratings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_restaurant_comments_updated_at BEFORE UPDATE ON public.restaurant_comments FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER refresh_restaurant_score_after_rating AFTER INSERT OR DELETE OR UPDATE ON public.restaurant_ratings FOR EACH ROW EXECUTE FUNCTION refresh_restaurant_score_from_rating();

CREATE TRIGGER refresh_restaurant_score_after_comment AFTER INSERT OR DELETE OR UPDATE ON public.restaurant_comments FOR EACH ROW EXECUTE FUNCTION refresh_restaurant_score_from_comment();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER trg_update_search_text BEFORE INSERT OR UPDATE OF name, description, cuisine_type, category, parish, area, address ON public.restaurants FOR EACH ROW EXECUTE FUNCTION trg_refresh_search_text();

REVOKE ALL ON FUNCTION public.generate_restaurant_search_text(r_id uuid) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.generate_restaurant_search_text(r_id uuid) TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

REVOKE ALL ON FUNCTION public.lower_text_array(t text[]) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.lower_text_array(t text[]) TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION public.refresh_restaurant_score(target_restaurant_id uuid) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.refresh_restaurant_score(target_restaurant_id uuid) TO service_role;

REVOKE ALL ON FUNCTION public.refresh_restaurant_score_from_comment() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.refresh_restaurant_score_from_comment() TO service_role;

REVOKE ALL ON FUNCTION public.refresh_restaurant_score_from_rating() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.refresh_restaurant_score_from_rating() TO service_role;

REVOKE ALL ON FUNCTION public.search_restaurants(search_query text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.search_restaurants(search_query text) TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.set_updated_at() TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION public.trg_refresh_search_text() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.trg_refresh_search_text() TO anon, authenticated, service_role;
