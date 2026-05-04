-- WHENWIHUNGRY: data quality and search fields
-- Run in Supabase SQL Editor. Safe to run multiple times.

-- 1. Review and source status fields
ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS review_status TEXT DEFAULT 'not_reviewed'
    CHECK (review_status IN ('not_reviewed', 'in_progress', 'reviewed', 'needs_update')),
  ADD COLUMN IF NOT EXISTS source_status TEXT DEFAULT 'public_import'
    CHECK (source_status IN ('critic_reviewed', 'community_listed', 'public_import', 'needs_verification', 'verified')),
  ADD COLUMN IF NOT EXISTS critic_reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS public_rating_source TEXT;

-- 2. Tag arrays for search and discovery
ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS search_keywords TEXT[],
  ADD COLUMN IF NOT EXISTS dish_tags TEXT[],
  ADD COLUMN IF NOT EXISTS vibe_tags TEXT[],
  ADD COLUMN IF NOT EXISTS meal_tags TEXT[],
  ADD COLUMN IF NOT EXISTS location_tags TEXT[];

-- 3. Back-fill review_status from admin_reviews
UPDATE public.restaurants r
SET review_status = 'reviewed',
    source_status = 'critic_reviewed',
    critic_reviewed_at = ar.created_at
FROM public.admin_reviews ar
WHERE ar.restaurant_id = r.id
  AND ar.verdict IS NOT NULL;

-- 4. Back-fill search_keywords with basic terms from existing fields
-- (Admin should enrich these per restaurant over time)
UPDATE public.restaurants
SET search_keywords = ARRAY[
  lower(COALESCE(name, '')),
  lower(COALESCE(cuisine_type, '')),
  lower(COALESCE(category, '')),
  lower(COALESCE(parish, '')),
  lower(COALESCE(area, ''))
]::TEXT[]
WHERE search_keywords IS NULL;

-- 5. Index the new tag columns for faster search
CREATE INDEX IF NOT EXISTS idx_restaurants_dish_tags ON public.restaurants USING GIN(dish_tags);
CREATE INDEX IF NOT EXISTS idx_restaurants_vibe_tags ON public.restaurants USING GIN(vibe_tags);
CREATE INDEX IF NOT EXISTS idx_restaurants_search_keywords ON public.restaurants USING GIN(search_keywords);

-- 6. Update search_restaurants() to also search tag arrays
DROP FUNCTION IF EXISTS search_restaurants(TEXT);
CREATE OR REPLACE FUNCTION search_restaurants(search_query TEXT)
RETURNS TABLE (
  id UUID, name TEXT, slug TEXT, description TEXT, parish TEXT, area TEXT,
  cuisine_type TEXT, category TEXT, image_url TEXT, price_level INTEGER,
  is_verified BOOLEAN, verdict TEXT, admin_score INTEGER, community_score FLOAT,
  review_count BIGINT, match_reason TEXT, final_score FLOAT
) AS $$
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
$$ LANGUAGE plpgsql;
