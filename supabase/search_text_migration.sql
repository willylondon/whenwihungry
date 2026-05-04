-- WHENWIHUNGRY: search_text field + updated search function
-- Run this in the Supabase SQL Editor once.

-- 1. Add search_text column
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS search_text TEXT;

-- 2. Function to generate search_text for one restaurant
CREATE OR REPLACE FUNCTION generate_restaurant_search_text(r_id UUID)
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;

-- 3. Populate search_text for all existing restaurants
UPDATE public.restaurants SET search_text = generate_restaurant_search_text(id);

-- 4. Trigger to keep search_text current on upserts
CREATE OR REPLACE FUNCTION trg_refresh_search_text()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_text := generate_restaurant_search_text(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_search_text ON public.restaurants;
CREATE TRIGGER trg_update_search_text
BEFORE INSERT OR UPDATE OF name, description, cuisine_type, category, parish, area, address
ON public.restaurants
FOR EACH ROW EXECUTE FUNCTION trg_refresh_search_text();

-- 5. Replace search_restaurants function to use search_text
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
        WHEN r.search_text ILIKE '%' || normalized_q || '%' THEN 70
        WHEN r.description ILIKE '%' || normalized_q || '%' THEN 60
        WHEN r.parish ILIKE '%' || normalized_q || '%'
          OR r.area ILIKE '%' || normalized_q || '%' THEN 40
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
        WHEN r.cuisine_type ILIKE '%' || normalized_q || '%' THEN 'Cuisine match'
        WHEN r.category ILIKE '%' || normalized_q || '%' THEN 'Category match'
        WHEN r.search_text ILIKE '%' || normalized_q || '%' THEN 'Content match'
        WHEN EXISTS (SELECT 1 FROM search_keywords sk WHERE sk.restaurant_id = r.id AND sk.keyword ILIKE '%' || normalized_q || '%') THEN 'Keyword match'
        WHEN EXISTS (SELECT 1 FROM admin_reviews ar WHERE ar.restaurant_id = r.id AND (ar.headline ILIKE '%' || normalized_q || '%' OR ar.honest_take ILIKE '%' || normalized_q || '%')) THEN 'Expert review match'
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
