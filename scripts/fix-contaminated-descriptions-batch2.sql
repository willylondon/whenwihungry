-- Fix remaining 22 description conflicts (batch 2)
-- All are import contamination — description template written for wrong parish.
-- Run in Supabase Studio SQL editor.
-- Generated: 2026-05-05

-- ── Kingston jerk spots with "St. Ann" template ───────────────────────
-- 10 records imported via a "St. Ann jerk restaurants" query.

UPDATE restaurants SET
  description         = 'Jerk spot in Kingston. Public signals are shown where available, with critic verdicts added as they go live.',
  data_quality_status = 'corrected',
  description_status  = 'conflict_fixed',
  location_notes      = 'Description previously mentioned St. Ann but parish/address indicates Kingston. Corrected by data cleanup script.'
WHERE slug IN (
  'andys-restaurant-jerk-and-pastry',
  'andys-jerk-spot',
  'coded-frolic-e-sport-bar-and-jerk-lounge',
  'hamilton-restaurant-and-jerk-centre',
  'molynes-road-jerk-centre',
  'shaggy-jerk-chicken',
  'stylz-jerk-chicken',
  'sweetwood-jerk-joint',
  'world-famous-jerk-food-company',
  'yard-jerk-shop'
);

-- ── Kingston records with other wrong-parish templates ────────────────

UPDATE restaurants SET
  description         = 'Mapped food spot in Kingston. Public signals are shown where available, with critic verdicts added as they go live.',
  data_quality_status = 'corrected',
  description_status  = 'conflict_fixed',
  location_notes      = 'Description previously mentioned Westmoreland but parish/address indicates Kingston. Corrected by data cleanup script.'
WHERE slug = 'beachview-restaurant-and-bar';

UPDATE restaurants SET
  description         = 'Chinese restaurant in Kingston. Public signals are shown where available, with critic verdicts added as they go live.',
  data_quality_status = 'corrected',
  description_status  = 'conflict_fixed',
  location_notes      = 'Description previously mentioned St. Thomas but parish/address indicates Kingston. Corrected by data cleanup script.'
WHERE slug = 'dragon-garden-restaurant-chinese';

UPDATE restaurants SET
  description         = 'Chinese restaurant in Kingston. Public signals are shown where available, with critic verdicts added as they go live.',
  data_quality_status = 'corrected',
  description_status  = 'conflict_fixed',
  location_notes      = 'Description previously mentioned Hanover but parish/address indicates Kingston. Corrected by data cleanup script.'
WHERE slug = 'ming-cuisine-chinese';

UPDATE restaurants SET
  description         = 'Quick takeaway in Kingston. Public signals are shown where available, with critic verdicts added as they go live.',
  data_quality_status = 'corrected',
  description_status  = 'conflict_fixed',
  location_notes      = 'Description previously mentioned Hanover but parish/address indicates Kingston. Corrected by data cleanup script.'
WHERE slug = 'quick-chick';

UPDATE restaurants SET
  description         = 'Seafood spot in Kingston. Public signals are shown where available, with critic verdicts added as they go live.',
  data_quality_status = 'corrected',
  description_status  = 'conflict_fixed',
  location_notes      = 'Description previously mentioned St. Elizabeth but parish/address indicates Kingston. Corrected by data cleanup script.'
WHERE slug = 'rainforest-seafoods';

-- ── St. James records with wrong-parish templates ─────────────────────

UPDATE restaurants SET
  description         = 'Mapped food spot in St. James. Public signals are shown where available, with critic verdicts added as they go live.',
  data_quality_status = 'corrected',
  description_status  = 'conflict_fixed',
  location_notes      = 'Description previously mentioned Hanover but parish/address indicates St. James. Corrected by data cleanup script.'
WHERE slug IN (
  'ena-jamaica-restaurant',
  'house-boat-grill-restaurant',
  'lees-pots-montego-bay'
);

UPDATE restaurants SET
  description         = 'Seafood spot in St. James. Public signals are shown where available, with critic verdicts added as they go live.',
  data_quality_status = 'corrected',
  description_status  = 'conflict_fixed',
  location_notes      = 'Description previously mentioned Trelawny but parish/address indicates St. James. Corrected by data cleanup script.'
WHERE slug = 'far-out-fish-hut-ltd';

-- ── Other parish mismatches ───────────────────────────────────────────

UPDATE restaurants SET
  description         = 'Mapped food spot in Westmoreland. Public signals are shown where available, with critic verdicts added as they go live.',
  data_quality_status = 'corrected',
  description_status  = 'conflict_fixed',
  location_notes      = 'Description previously mentioned Hanover but parish/address indicates Westmoreland. Corrected by data cleanup script.'
WHERE slug = 'office-of-nature';

UPDATE restaurants SET
  description         = 'Jerk spot in Trelawny. Public signals are shown where available, with critic verdicts added as they go live.',
  data_quality_status = 'corrected',
  description_status  = 'conflict_fixed',
  location_notes      = 'Description previously mentioned St. James but parish/address indicates Trelawny. Corrected by data cleanup script.'
WHERE slug = 'peppers-jerk-center';

UPDATE restaurants SET
  description         = 'Seafood bar and grill in St. Catherine. Public signals are shown where available, with critic verdicts added as they go live.',
  data_quality_status = 'corrected',
  description_status  = 'conflict_fixed',
  location_notes      = 'Description previously mentioned Westmoreland but parish/address indicates St. Catherine. Corrected by data cleanup script.'
WHERE slug = 'tony-s-seafood-bar-and-grill';

-- ── Verify ────────────────────────────────────────────────────────────
-- Should return 0 rows after a successful run.

SELECT slug, name, description
FROM restaurants
WHERE slug IN (
  'andys-restaurant-jerk-and-pastry', 'andys-jerk-spot', 'coded-frolic-e-sport-bar-and-jerk-lounge',
  'hamilton-restaurant-and-jerk-centre', 'molynes-road-jerk-centre', 'shaggy-jerk-chicken',
  'stylz-jerk-chicken', 'sweetwood-jerk-joint', 'world-famous-jerk-food-company', 'yard-jerk-shop',
  'beachview-restaurant-and-bar', 'dragon-garden-restaurant-chinese', 'ming-cuisine-chinese',
  'quick-chick', 'rainforest-seafoods', 'ena-jamaica-restaurant', 'house-boat-grill-restaurant',
  'lees-pots-montego-bay', 'far-out-fish-hut-ltd', 'office-of-nature', 'peppers-jerk-center',
  'tony-s-seafood-bar-and-grill'
)
  AND description_status != 'conflict_fixed';
