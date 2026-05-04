-- REFINED RANKING ENGINE (V2.1)
-- Run this in your Supabase SQL editor to improve discovery ranking.

CREATE OR REPLACE FUNCTION search_restaurants(search_query TEXT)
RETURNS TABLE (
    id UUID,
    name TEXT,
    slug TEXT,
    description TEXT,
    parish TEXT,
    city TEXT,
    cuisine TEXT,
    image_url TEXT,
    price_level INTEGER,
    is_verified BOOLEAN,
    verdict TEXT,
    admin_score INTEGER,
    community_score FLOAT,
    match_reason TEXT,
    final_score FLOAT
) AS $$
DECLARE
    query_ts tsquery;
BEGIN
    query_ts := plainto_tsquery('english', search_query);

    RETURN QUERY
    WITH relevance_cte AS (
        SELECT 
            r.id,
            CASE 
                WHEN r.name ILIKE '%' || search_query || '%' THEN 100
                WHEN r.cuisine ILIKE '%' || search_query || '%' THEN 80
                WHEN r.parish ILIKE '%' || search_query || '%' OR r.city ILIKE '%' || search_query || '%' THEN 50
                ELSE 0
            END as base_relevance,
            EXISTS (SELECT 1 FROM dishes d WHERE d.restaurant_id = r.id AND d.name ILIKE '%' || search_query || '%') as dish_match,
            EXISTS (SELECT 1 FROM search_keywords sk WHERE sk.restaurant_id = r.id AND sk.keyword ILIKE '%' || search_query || '%') as keyword_match
        FROM restaurants r
    ),
    scores_cte AS (
        SELECT
            r.id,
            -- If no admin score, we default to 40 (Mid-low) to prioritize reviewed places
            COALESCE(ar.admin_score, 40) as admin_score,
            -- Community score aggregated from approved reviews
            COALESCE((SELECT AVG(rating) FROM user_reviews ur WHERE ur.restaurant_id = r.id AND ur.status = 'approved'), 0) * 20 as community_score,
            (SELECT 
                GREATEST(
                    rel.base_relevance,
                    CASE WHEN rel.dish_match THEN 100 ELSE 0 END,
                    CASE WHEN rel.keyword_match THEN 85 ELSE 0 END
                )
             FROM relevance_cte rel WHERE rel.id = r.id
            ) as keyword_relevance,
            CASE 
                WHEN r.created_at > NOW() - INTERVAL '30 days' THEN 100
                WHEN r.created_at > NOW() - INTERVAL '90 days' THEN 50
                ELSE 0
            END as freshness_score,
            r.admin_boost,
            ar.verdict,
            CASE 
                WHEN r.name ILIKE '%' || search_query || '%' THEN 'Name match'
                WHEN EXISTS (SELECT 1 FROM dishes d WHERE d.restaurant_id = r.id AND d.name ILIKE '%' || search_query || '%') THEN 'Dish match'
                WHEN r.cuisine ILIKE '%' || search_query || '%' THEN 'Cuisine match'
                ELSE 'Keyword match'
            END as match_reason
        FROM restaurants r
        LEFT JOIN admin_reviews ar ON ar.restaurant_id = r.id
    )
    SELECT 
        r.id, r.name, r.slug, r.description, r.parish, r.city, r.cuisine, r.image_url, r.price_level, r.is_verified,
        s.verdict, s.admin_score, s.community_score, s.match_reason,
        (
            -- ADMIN AUTHORITY is the primary driver (60%)
            (s.admin_score * 0.60) + 
            -- COMMUNITY FEEDBACK (20%)
            (s.community_score * 0.20) + 
            -- SEARCH RELEVANCE (15%)
            (s.keyword_relevance * 0.15) + 
            -- FRESHNESS (5%)
            (s.freshness_score * 0.05) + 
            -- MANUAL OVERRIDE (BOOST)
            s.admin_boost
        ) as final_score
    FROM restaurants r
    JOIN scores_cte s ON s.id = r.id
    ORDER BY final_score DESC;
END;
$$ LANGUAGE plpgsql;
