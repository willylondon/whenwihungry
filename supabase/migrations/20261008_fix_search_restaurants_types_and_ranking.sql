-- search_restaurants() failed on every call: community_score was numeric
-- (AVG(...) * 20) but the function returns double precision. The app silently
-- fell back to a weaker in-memory search.
-- Also rank by how well a spot matches the query first: relevance used to be
-- only 15% of the score, so a default critic score of 40 made most results tie.
CREATE OR REPLACE FUNCTION public.search_restaurants(search_query text)
 RETURNS TABLE(id uuid, name text, slug text, description text, parish text, area text, cuisine_type text, category text, image_url text, price_level integer, is_verified boolean, verdict text, admin_score integer, community_score double precision, review_count bigint, match_reason text, final_score double precision)
 LANGUAGE plpgsql
 SET search_path TO 'pg_catalog', 'public', 'pg_temp'
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
      (COALESCE((SELECT AVG(rating) FROM user_reviews ur WHERE ur.restaurant_id = r.id AND ur.status = 'approved'), 0) * 20)::double precision AS community_score,
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
      COALESCE(r.admin_boost, 0) AS admin_boost,
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
      (s.keyword_relevance * 0.60) +
      (s.admin_score * 0.20) +
      (s.community_score * 0.15) +
      (s.freshness_score * 0.05) +
      s.admin_boost
    )::double precision AS final_score
  FROM restaurants r
  JOIN scores_cte s ON s.id = r.id
  WHERE s.keyword_relevance > 0
  ORDER BY final_score DESC;
END;
$function$;
