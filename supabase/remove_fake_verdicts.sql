-- Remove stale verdict values set directly on restaurants
-- where no admin_reviews record exists for that restaurant.
-- This prevents auto-imported listings from showing fake critic verdicts.
-- Safe to run multiple times.

UPDATE public.restaurants
SET verdict = NULL
WHERE verdict IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.admin_reviews ar
    WHERE ar.restaurant_id = restaurants.id
  );
