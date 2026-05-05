-- ============================================================================
-- Fix 44 cross-parish records flagged by the location audit
-- Run this in the Supabase SQL Editor
-- ============================================================================

-- ── Kingston addresses → Kingston ──
UPDATE restaurants SET parish = 'Kingston', area = 'Barbican' WHERE slug = '22-jerk-plus';
UPDATE restaurants SET parish = 'Kingston', area = 'Chisholm Ave' WHERE slug = 'andys-restaurant-jerk-and-pastry';
UPDATE restaurants SET parish = 'Kingston', area = 'Mannings Hill' WHERE slug = 'andys-jerk-spot';
UPDATE restaurants SET parish = 'Kingston', area = 'Port Royal' WHERE slug = 'beachview-restaurant-and-bar';
UPDATE restaurants SET parish = 'Kingston', area = 'Goodwood Terrace' WHERE slug = 'breadfruit-hut';
UPDATE restaurants SET parish = 'Kingston', area = 'Constant Spring' WHERE slug = 'cafe-dolce';
UPDATE restaurants SET parish = 'Kingston', area = 'Constant Spring' WHERE slug = 'chef-kiss-ja';
UPDATE restaurants SET parish = 'Kingston', area = 'Constant Spring' WHERE slug = 'clubhouse-brewery';
UPDATE restaurants SET parish = 'Kingston', area = 'South Ave' WHERE slug = 'coded-frolic-e-sport-bar-and-jerk-lounge';
UPDATE restaurants SET parish = 'Kingston', area = 'Constant Spring' WHERE slug = 'dragon-garden-restaurant-chinese';
UPDATE restaurants SET parish = 'Kingston', area = 'Burlington Ave' WHERE slug = 'hamilton-restaurant-and-jerk-centre';
UPDATE restaurants SET parish = 'Kingston', area = 'Kings House Rd' WHERE slug = 'idcove-catering';
UPDATE restaurants SET parish = 'Kingston', area = 'Lindsay Crescent' WHERE slug = 'jamaica-liquor-warehouse';
UPDATE restaurants SET parish = 'Kingston', area = 'Hope Rd' WHERE slug = 'jerk-box';
UPDATE restaurants SET parish = 'Kingston', area = 'Waterloo Rd' WHERE slug = 'jojos-jerk-pit';
UPDATE restaurants SET parish = 'Kingston', area = 'Lindsay Crescent' WHERE slug = 'king-janga-seafood-lounge';
UPDATE restaurants SET parish = 'Kingston', area = 'Chelsea Ave' WHERE slug = 'kingston-jerk';
UPDATE restaurants SET parish = 'Kingston', area = 'Lindsay Crescent' WHERE slug = 'macau-gaming-lounge-and-bar';
UPDATE restaurants SET parish = 'Kingston', area = 'Constant Spring' WHERE slug = 'market-place';
UPDATE restaurants SET parish = 'Kingston', area = 'Constant Spring' WHERE slug = 'ming-cuisine-chinese';
UPDATE restaurants SET parish = 'Kingston', area = 'Gilmour Dr' WHERE slug = 'molynes-road-jerk-centre';
UPDATE restaurants SET parish = 'Kingston', area = 'Grants Pen' WHERE slug = 'quick-chick';
UPDATE restaurants SET parish = 'Kingston', area = 'Kingston' WHERE slug = 'rainforest-seafoods';
UPDATE restaurants SET parish = 'Kingston', area = 'Red Hills' WHERE slug = 'shaggy-jerk-chicken';
UPDATE restaurants SET parish = 'Kingston', area = 'White Hall Ave' WHERE slug = 'stylz-jerk-chicken';
UPDATE restaurants SET parish = 'Kingston', area = 'South Ave' WHERE slug = 'susies';
UPDATE restaurants SET parish = 'Kingston', area = 'Knutsford Blvd' WHERE slug = 'sweetwood-jerk-joint';
UPDATE restaurants SET parish = 'Kingston', area = 'Annette Cres' WHERE slug = 'triple-tz-eatery';
UPDATE restaurants SET parish = 'Kingston', area = 'Grants Pen' WHERE slug = 'tummy-quest';
UPDATE restaurants SET parish = 'Kingston', area = 'Constant Spring' WHERE slug = 'usain-bolts-tracks-and-records';
UPDATE restaurants SET parish = 'Kingston', area = 'Ballater Ave' WHERE slug = 'whitneys-kitchen-limited';
UPDATE restaurants SET parish = 'Kingston', area = 'Molynes Rd' WHERE slug = 'willys-thatch-roof-and-cool-out-spot-ltd';
UPDATE restaurants SET parish = 'Kingston', area = 'Graham Heights' WHERE slug = 'world-famous-jerk-food-company';
UPDATE restaurants SET parish = 'Kingston', area = 'Red Hills' WHERE slug = 'yard-jerk-shop';

-- ── Montego Bay → St. James ──
UPDATE restaurants SET parish = 'St. James', area = 'De Lisser Dr' WHERE slug = 'ena-jamaica-restaurant';
UPDATE restaurants SET parish = 'St. James', area = 'Alice Eldemire Dr' WHERE slug = 'house-boat-grill-restaurant';
UPDATE restaurants SET parish = 'St. James', area = 'Ramble Hill' WHERE slug = 'lees-pots-montego-bay';

-- ── Negril → Westmoreland ──
UPDATE restaurants SET parish = 'Westmoreland', area = 'Negril' WHERE slug = 'margaritaville-negril-hanover';
UPDATE restaurants SET parish = 'Westmoreland', area = 'Negril' WHERE slug = 'office-of-nature';
UPDATE restaurants SET parish = 'Westmoreland', area = 'Negril' WHERE slug = 'office-of-the-nature-hanover';

-- ── Other ──
UPDATE restaurants SET parish = 'St. James', area = 'Montego Bay' WHERE slug = 'far-out-fish-hut-ltd';
UPDATE restaurants SET parish = 'Clarendon', area = 'Clarendon Park' WHERE slug = 'murray-s-fish-and-jerk-hut-manchester';
UPDATE restaurants SET parish = 'Trelawny', area = 'Falmouth' WHERE slug = 'peppers-jerk-center';
UPDATE restaurants SET parish = 'St. Catherine', area = 'Portmore' WHERE slug = 'tony-s-seafood-bar-and-grill';

-- Verify
SELECT 'Corrections complete. Check: ' || COUNT(*) || ' records still have Portland parish with Kingston addresses'
FROM restaurants 
WHERE parish = 'Portland' AND (address ILIKE '%Kingston%' OR address ILIKE '%kingston%');
