-- Fix public visibility and description contamination
-- Run in Supabase Studio SQL editor
-- Generated: 2026-05-05

-- ── 1. Tag confirmed non-food businesses ──────────────────────────────
-- lennys-cooking-gas and cooksmart are currently tagged as food_spot/verified — wrong.

UPDATE restaurants SET
  business_type       = 'not_food',
  data_quality_status = 'rejected'
WHERE slug IN ('lennys-cooking-gas', 'cooksmart-equipment-and-supplies-ltd');

-- ── 2. Fix Macau Gaming Lounge & Bar description ──────────────────────
-- parish = Kingston, description incorrectly says "St. Mary"

UPDATE restaurants SET
  description         = 'Mapped bar and gaming lounge in Lindsay Crescent, Kingston. Public signals are shown where available, and WhenWiHungry verdicts are added as reviews go live.',
  data_quality_status = 'corrected',
  description_status  = 'conflict_fixed',
  location_notes      = 'Description previously mentioned St. Mary but parish/address indicates Kingston. Corrected by data cleanup script.'
WHERE slug = 'macau-gaming-lounge-and-bar';

-- ── 3. Fix Usain Bolt's Tracks & Records description ─────────────────
-- parish = Kingston, description incorrectly says "St. Catherine"

UPDATE restaurants SET
  description         = 'Mapped sports bar and restaurant in Constant Spring, Kingston. Public signals are shown where available, and WhenWiHungry verdicts are added as reviews go live.',
  data_quality_status = 'corrected',
  description_status  = 'conflict_fixed',
  location_notes      = 'Description previously mentioned St. Catherine but parish/address indicates Kingston. Corrected by data cleanup script.'
WHERE slug = 'usain-bolts-tracks-and-records';

-- ── Verify ────────────────────────────────────────────────────────────
-- All four queries below should return 0 rows after a successful run.

-- 1. Non-food should be rejected
SELECT slug, name, business_type, data_quality_status
FROM restaurants
WHERE slug IN ('lennys-cooking-gas', 'cooksmart-equipment-and-supplies-ltd')
  AND (business_type != 'not_food' OR data_quality_status != 'rejected');

-- 2. No Kingston records mentioning St. Mary
SELECT slug, name, description
FROM restaurants
WHERE parish = 'Kingston' AND description ILIKE '%st. mary%';

-- 3. No Kingston records mentioning St. Catherine
SELECT slug, name, description
FROM restaurants
WHERE parish = 'Kingston' AND description ILIKE '%st. catherine%';

-- 4. No Kingston records mentioning Portland (should already be 0)
SELECT slug, name, description
FROM restaurants
WHERE parish = 'Kingston' AND description ILIKE '%portland%';
