# Public Route Audit Report

**Generated**: 2026-05-05T00:00:00.000Z  
**Audited by**: Phase 15 data quality audit (code review)

## Summary

| Route | Status | Issues |
|-------|--------|--------|
| `/` (home) | ✅ PASS | None |
| `/browse` | ⚠️ WARN | No status=approved filter until getAllApprovedPlaces (see note) |
| `/reviews` | ✅ PASS | Correctly uses isReviewed() |
| `/restaurants/[location]` | ✅ PASS | Uses isPlaceSafeForParishPage() correctly |
| `/places/[slug]` | ✅ PASS | Labels correct |
| `/get-reviewed` | ✅ PASS | Form only, no listings |

---

## Route Detail

### `/` (Home) — PASS

- `foodSpotCountLabel` is fetched via `getPublicFoodSpotCountLabel()` which queries `status=approved`
- Hero copy: `"{foodSpotCountLabel} Jamaican food spots mapped. 10+ viral TikTok reviews."` — correct
- No hardcoded counts
- OG image: `/og/whenwihungry-og.png` (1200×630 static PNG) — correct

### `/browse` — WARN (acceptable)

**Data source**: `getAllApprovedPlaces()` → filters `status=approved`

**Known issue**: `data_quality_status` and `business_type` columns do not yet exist in the Supabase `restaurants` table schema. Once added:
- Add `.neq("data_quality_status", "rejected")` to `getAllApprovedPlaces()`
- Add `.neq("business_type", "not_food")` to `getAllApprovedPlaces()`
- Run `scripts/fix-place-data-quality.ts --apply` to tag known non-food records

**Filter chain** (verified correct):
1. Text query → `searchRestaurants(q)` via Supabase RPC
2. No query → `getAllApprovedPlaces()` (approved only)
3. Client-side `getFilteredPlaces()` ANDs parish, category, price, rating filters on top
4. Parish filter is NOT overridden by text search — correctly ANDed

**Status labels** (verified correct):
- `getPlaceStatusLabel()` → "Critic Reviewed" / "TikTok Reviewed" / "Listed — Review Pending"
- `getPlaceCta()` → "Read Verdict →" / "Watch Review →" / "View Listing →"
- No stale labels ("NOT YET REVIEWED", "THE HONEST TAKE", "LISTING INFO", "READ TRUTH")

**Public signal labelling** (verified correct):
- Displayed as "★ Public signal: X.X · N ratings"
- Not labelled as WhenWiHungry reviews

### `/reviews` — PASS

**Data source**: `getAllApprovedPlaces()` → `.filter(isReviewed)`

`isReviewed()` is from `place-status.ts` and returns true only when:
- `has_critic_review === true`, OR
- `verdict` exists and is not "No Verdict Yet" / "Verdict Pending", OR
- `tiktok_url` / `tiktokUrl` / `review_video_url` exists

No listed-only records are shown. Empty state gracefully redirects to TikTok.

### `/restaurants/[location]` — PASS

**Data source**: Direct `supabase.from("restaurants").in("parish", variants)` + client-side `isPlaceSafeForParishPage()`

`isPlaceSafeForParishPage()` correctly:
- Excludes `data_quality_status === "rejected"` (passes when column missing — safe)
- Excludes `data_quality_status === "needs_review"` unless `manually_verified` (passes when missing — safe)
- Normalizes parish slugs with `normalizeParish()`
- Runs `validatePlaceParish()` to detect cross-parish name/area/address conflicts

**SEO intro copy**: Present for `kingston` and `portland` location slugs.

**JSON-LD**: ItemList schema present with correct fields.

### `/places/[slug]` — PASS

- Labels updated: "NOT YET REVIEWED" → "Listed — Review Pending" (previous session)
- Status uses `getPlaceStatus()` / `getPlaceStatusLabel()` from `place-status.ts`
- JSON-LD: Restaurant schema present; Review schema present only when critic verdict exists
- OG image: falls back to static `/og/whenwihungry-og.png` if no place image

---

## Key Schema Gap

The `data_quality_status` and `business_type` columns are referenced in code but **do not exist** in the current Supabase schema:

```sql
-- Add these columns to enable full data quality filtering:
ALTER TABLE restaurants
  ADD COLUMN IF NOT EXISTS data_quality_status TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS business_type TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS manually_verified BOOLEAN DEFAULT FALSE;
```

Once added, run:
1. `npx tsx scripts/fix-place-data-quality.ts` (dry run)
2. `npx tsx scripts/fix-place-data-quality.ts --apply` (write to DB)
3. Update `getAllApprovedPlaces()` and `getPublicFoodSpotCount()` to add `.neq("data_quality_status", "rejected").neq("business_type", "not_food")`

---

## Known Data Issues (requires Supabase updates)

| Issue | Count | Action |
|-------|-------|--------|
| Kingston records with "portland" in description | 10 | Sanitize descriptions in Supabase |
| Non-food businesses in directory | 2 confirmed | Tag as not_food after schema update |
| Missing area/city field | 366 | Low priority — address is present |
| Duplicate names across parishes | 2 | Manual review |
| Suspicious cross-parish (location audit) | 10 | Match description audit — same records |
