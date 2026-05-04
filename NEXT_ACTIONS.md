# Next Actions

## High Priority
- [ ] **Manual SQL Apply**: Copy and run the contents of `supabase/v2_upgrade.sql` in the Supabase SQL Editor to activate the new search ranking engine.
- [ ] **Final Verification**: After SQL application, search for "jerk" and "Moby Dick" to verify match reasons and ranking logic.
- [ ] **Verify Verified Status**: Confirm that restaurants marked as `is_verified` or `verified` in the DB are displaying the new badge correctly.

## Medium Priority
- [ ] **Parish Stats Unification**: Update `getParishStats` in `places.ts` to derive stats from Supabase data instead of static fallback.
- [ ] **Category Chips**: Ensure the filter chips at the top of the browse page use the same normalized lowercase logic as the main search.

## Low Priority
- [ ] **SEO Review**: Check metadata for location pages to ensure "Best Restaurants in [Location]" titles are being indexed correctly.
