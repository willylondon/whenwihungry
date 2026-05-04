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
    area TEXT,
    address TEXT,
    phone TEXT,
    price_level INTEGER DEFAULT 2 CHECK (price_level >= 1 AND price_level <= 4),
    cuisine_type TEXT,
    category TEXT,
    image_url TEXT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    is_verified BOOLEAN DEFAULT FALSE,
    admin_boost FLOAT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    avg_rating FLOAT DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patch existing table: safely add any missing V2 columns
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS area TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS cuisine_type TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS avg_rating FLOAT DEFAULT 0;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS admin_boost FLOAT DEFAULT 0;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS price_level INTEGER DEFAULT 2;

-- 3. Dishes
CREATE TABLE IF NOT EXISTS public.dishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    normalized_name TEXT NOT NULL, -- e.g. "oxtail stew" -> "oxtail"
    category TEXT,
    tags TEXT[],
    price DECIMAL(10,2),
    image_url TEXT,
    is_signature BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Search Keywords (Meta)
CREATE TABLE IF NOT EXISTS public.search_keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    relevance_weight FLOAT DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Admin Reviews
CREATE TABLE IF NOT EXISTS public.admin_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    verdict TEXT NOT NULL, -- e.g. "WORTH IT", "MID", "RUN GO GET IT"
    admin_score INTEGER CHECK (admin_score >= 0 AND admin_score <= 100),
    headline TEXT,
    honest_take TEXT,
    pros TEXT[],
    cons TEXT[],
    must_try_dishes UUID[], -- references dishes.id
    visit_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. User Reviews
CREATE TABLE IF NOT EXISTS public.user_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Ranking Logic Helper
CREATE OR REPLACE FUNCTION lower_text_array(t TEXT[]) 
RETURNS TEXT[] AS $$
  SELECT array_agg(lower(x)) FROM unnest(t) x;
$$ LANGUAGE SQL IMMUTABLE;

-- 8. Search Logs
CREATE TABLE IF NOT EXISTS public.search_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query TEXT NOT NULL,
    normalized_query TEXT,
    result_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Advanced Search Function (V2)
DROP FUNCTION IF EXISTS search_restaurants(TEXT);
CREATE OR REPLACE FUNCTION search_restaurants(search_query TEXT)
RETURNS TABLE (
    id UUID,
    name TEXT,
    slug TEXT,
    description TEXT,
    parish TEXT,
    area TEXT,
    cuisine_type TEXT,
    category TEXT,
    image_url TEXT,
    price_level INTEGER,
    is_verified BOOLEAN,
    verdict TEXT,
    admin_score INTEGER,
    community_score FLOAT,
    review_count BIGINT,
    match_reason TEXT,
    final_score FLOAT
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
                WHEN r.cuisine_type ILIKE '%' || normalized_q || '%' OR r.category ILIKE '%' || normalized_q || '%' THEN 80
                WHEN r.description ILIKE '%' || normalized_q || '%' THEN 50
                WHEN r.parish ILIKE '%' || normalized_q || '%' OR r.area ILIKE '%' || normalized_q || '%' THEN 40
                ELSE 0
            END as base_relevance,
            EXISTS (
                SELECT 1 FROM dishes d 
                WHERE d.restaurant_id = r.id 
                AND (
                    d.name ILIKE '%' || normalized_q || '%' 
                    OR d.normalized_name ILIKE '%' || normalized_q || '%'
                    OR EXISTS (SELECT 1 FROM unnest(d.tags) tag WHERE tag ILIKE '%' || normalized_q || '%')
                )
            ) as dish_match,
            EXISTS (SELECT 1 FROM search_keywords sk WHERE sk.restaurant_id = r.id AND sk.keyword ILIKE '%' || normalized_q || '%') as keyword_match,
            EXISTS (SELECT 1 FROM admin_reviews ar WHERE ar.restaurant_id = r.id AND (ar.headline ILIKE '%' || normalized_q || '%' OR ar.honest_take ILIKE '%' || normalized_q || '%')) as admin_match,
            EXISTS (SELECT 1 FROM user_reviews ur WHERE ur.restaurant_id = r.id AND ur.status = 'approved' AND ur.comment ILIKE '%' || normalized_q || '%') as community_match
        FROM restaurants r
    ),
    scores_cte AS (
        SELECT
            r.id,
            COALESCE(ar.admin_score, 40) as admin_score,
            COALESCE((SELECT AVG(rating) FROM user_reviews ur WHERE ur.restaurant_id = r.id AND ur.status = 'approved'), 0) * 20 as community_score,
            (SELECT COUNT(*) FROM user_reviews ur WHERE ur.restaurant_id = r.id AND ur.status = 'approved') as review_count,
            (SELECT 
                GREATEST(
                    rel.base_relevance,
                    CASE WHEN rel.dish_match THEN 100 ELSE 0 END,
                    CASE WHEN rel.keyword_match THEN 80 ELSE 0 END,
                    CASE WHEN rel.admin_match THEN 70 ELSE 0 END,
                    CASE WHEN rel.community_match THEN 50 ELSE 0 END
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
                WHEN r.name ILIKE '%' || normalized_q || '%' THEN 'Name match'
                WHEN EXISTS (SELECT 1 FROM dishes d WHERE d.restaurant_id = r.id AND (d.name ILIKE '%' || normalized_q || '%' OR d.normalized_name ILIKE '%' || normalized_q || '%')) THEN 'Dish match'
                WHEN r.cuisine_type ILIKE '%' || normalized_q || '%' THEN 'Cuisine match'
                WHEN r.category ILIKE '%' || normalized_q || '%' THEN 'Category match'
                WHEN EXISTS (SELECT 1 FROM search_keywords sk WHERE sk.restaurant_id = r.id AND sk.keyword ILIKE '%' || normalized_q || '%') THEN 'Keyword match'
                WHEN EXISTS (SELECT 1 FROM admin_reviews ar WHERE ar.restaurant_id = r.id AND (ar.headline ILIKE '%' || search_query || '%' OR ar.honest_take ILIKE '%' || search_query || '%')) THEN 'Expert review match'
                ELSE 'Community match'
            END as match_reason
        FROM restaurants r
        LEFT JOIN admin_reviews ar ON ar.restaurant_id = r.id
    )
    SELECT 
        r.id, r.name, r.slug, r.description, r.parish, r.area, r.cuisine_type, r.category, r.image_url, r.price_level, r.is_verified,
        s.verdict, s.admin_score, s.community_score, s.review_count, s.match_reason,
        (
            (s.admin_score * 0.60) + 
            (s.community_score * 0.20) + 
            (s.keyword_relevance * 0.15) + 
            (s.freshness_score * 0.05) + 
            s.admin_boost
        ) as final_score
    FROM restaurants r
    JOIN scores_cte s ON s.id = r.id
    WHERE s.keyword_relevance > 0
    ORDER BY final_score DESC;
END;
$$ LANGUAGE plpgsql;
