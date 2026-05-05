# Live Verification Checklist

After deploying this branch to Vercel, verify the following URLs.

## Cache-busted test URLs

Add `?v=dq1` to force fresh rendering for ISR routes.

### Browse
- https://whenwihungry.vercel.app/browse?v=dq1  
  - Confirm no "NOT YET REVIEWED", "THE HONEST TAKE", "LISTING INFO", "READ TRUTH" labels visible
  - Confirm all cards show "Listed — Review Pending" / "TikTok Reviewed" / "Critic Reviewed"
  - Confirm "Public signal: X.X · N ratings" format (not "WhenWiHungry reviews")

### Parish pages
- https://whenwihungry.vercel.app/restaurants/kingston?v=dq1  
  - Confirm no Portland businesses appear
  - Confirm "Lenny's Cooking Gas" is absent (non-food)
- https://whenwihungry.vercel.app/restaurants/portland?v=dq1  
  - Confirm only Portland businesses appear
  - Confirm no Kingston businesses appear

### Reviews
- https://whenwihungry.vercel.app/reviews?v=dq1  
  - Confirm only TikTok-reviewed or critic-reviewed places appear
  - If empty, confirm graceful empty state with TikTok link

### Home
- https://whenwihungry.vercel.app/?v=dq1  
  - Confirm count label: "400+" or similar dynamic number (not "58+")
  - Confirm hero: "{count} Jamaican food spots mapped. 10+ viral TikTok reviews."

### OG image
- Open Sharing Debugger: https://developers.facebook.com/tools/debug/?q=https%3A%2F%2Fwhenwihungry.vercel.app%2F
  - Confirm dark 1200×630 OG card loads (not white square)

## Pending Supabase schema work

Before running `scripts/fix-place-data-quality.ts --apply`, add these columns in Supabase:

```sql
ALTER TABLE restaurants
  ADD COLUMN IF NOT EXISTS data_quality_status TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS business_type TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS manually_verified BOOLEAN DEFAULT FALSE;
```

Then:
1. `npx tsx scripts/fix-place-data-quality.ts` — dry run, review output
2. `npx tsx scripts/fix-place-data-quality.ts --apply` — apply
3. Update `getAllApprovedPlaces()` and `getPublicFoodSpotCount()` to add the rejected/not_food filters

## Pending description fixes (10 records)

These 10 Kingston records have "portland" in their description (import contamination).
Descriptions need to be updated in Supabase to remove Portland references:

- `22-jerk-plus`
- `cafe-dolce`
- `idcove-catering`
- `jamaica-liquor-warehouse`
- `jerk-box`
- `king-janga-seafood-lounge`
- `kingston-jerk`
- `market-place`
- `susies`
- `triple-tz-eatery`

Use `getSafePlaceDescription()` from `src/lib/place-description.ts` to serve neutral
fallback descriptions in the UI until the DB descriptions are corrected.
