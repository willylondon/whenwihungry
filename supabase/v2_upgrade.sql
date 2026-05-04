-- WHENWIHUNGRY V2 SCHEMA UPGRADE
-- This script sets up the relational structure and search engine.

-- 1. Profiles & Roles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Restaurants (V2)
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    parish TEXT NOT NULL,
    city TEXT,
    address TEXT,
    phone TEXT,
    price_level INTEGER DEFAULT 2 CHECK (price_level >= 1 AND price_level <= 4),
    cuisine TEXT,
    image_url TEXT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    is_verified BOOLEAN DEFAULT FALSE,
    admin_boost FLOAT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Dishes
CREATE TABLE IF NOT EXISTS public.dishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    normalized_name TEXT NOT NULL, -- e.g. "oxtail stew" -> "oxtail"
    category TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Admin Reviews (Critic Authority)
CREATE TABLE IF NOT EXISTS public.admin_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE UNIQUE,
    verdict TEXT NOT NULL CHECK (verdict IN ('RUN_GO_GET_IT', 'WORTH_IT', 'MID', 'SAVE_YOUR_MONEY')),
    admin_score INTEGER DEFAULT 50 CHECK (admin_score >= 0 AND admin_score <= 100),
    headline TEXT,
    honest_take TEXT,
    video_url TEXT,
    reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. User Reviews (Community Feedback)
CREATE TABLE IF NOT EXISTS public.user_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    tags TEXT[],
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(restaurant_id, user_id)
);

-- 6. Search Keywords
CREATE TABLE IF NOT EXISTS public.search_keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    weight FLOAT DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Search & Ranking Function
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
                WHEN r.parish ILIKE '%' || search_query || '%' OR r.city ILIKE '%' || search_query || '%' THEN 40
                ELSE 0
            END as base_relevance,
            EXISTS (SELECT 1 FROM dishes d WHERE d.restaurant_id = r.id AND d.name ILIKE '%' || search_query || '%') as dish_match,
            EXISTS (SELECT 1 FROM search_keywords sk WHERE sk.restaurant_id = r.id AND sk.keyword ILIKE '%' || search_query || '%') as keyword_match
        FROM restaurants r
    ),
    scores_cte AS (
        SELECT
            r.id,
            COALESCE(ar.admin_score, 40) as admin_score,
            COALESCE((SELECT AVG(rating) FROM user_reviews ur WHERE ur.restaurant_id = r.id AND ur.status = 'approved'), 0) * 20 as community_score,
            (SELECT 
                GREATEST(
                    rel.base_relevance,
                    CASE WHEN rel.dish_match THEN 100 ELSE 0 END,
                    CASE WHEN rel.keyword_match THEN 70 ELSE 0 END
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
            (s.admin_score * 0.55) + 
            (s.community_score * 0.25) + 
            (s.keyword_relevance * 0.15) + 
            (s.freshness_score * 0.05) + 
            s.admin_boost
        ) as final_score
    FROM restaurants r
    JOIN scores_cte s ON s.id = r.id
    ORDER BY final_score DESC;
END;
$$ LANGUAGE plpgsql;

-- 8. Triggers for updated_at (if needed) and score updates (can be handled by Cron or on-demand)
