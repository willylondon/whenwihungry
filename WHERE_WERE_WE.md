# Where Were We: Project Snapshot

**Last updated**: 2026-05-05  
**Live site**: https://whenwihungry.vercel.app/  
**Repo**: github.com/willylondon/whenwihungry  
**Stack**: Next.js 16 (Turbopack) + Supabase + Vercel  
**Data**: 463 approved restaurants across 13 parishes

---

## Current Status
✅ Build passes clean. Deployed to Vercel production. All work pushed to `main`.  
✅ Description contamination fully resolved — 0 conflicts.  
✅ Non-food filtering live in browse, search, and count queries.

---

## What We Did (2026-05-05 — Full-Day Overhaul)

### 1. Social Preview / OG Image Fix
- Removed `/src/app/og/route.tsx` (WhatsApp doesn't respect dynamic OG routes)
- Created `/public/og/whenwihungry-og.png` — 1200×630 dark branded card
- All `og:image` and `twitter:image` point to the static PNG
- Logo.png is NOT used as social preview image anywhere

### 2. Review Status System (3 Content Types)
- Created `src/lib/place-status.ts` — centralized helper
  - `getPlaceStatus()` → `"listed" | "tiktok-reviewed" | "critic-reviewed"`
  - `getPlaceStatusLabel()` → `"Listed — Review Pending" | "TikTok Reviewed" | "Critic Reviewed"`
  - `getPlaceCta()` → `"View Listing →" | "Watch Review →" | "Read Verdict →"`
  - `getPlaceDetailHeading()` → `"Listing Info" | "TikTok Review" | "Critic Verdict"`
- Purged all old labels: NOT YET REVIEWED, THE HONEST TAKE, READ TRUTH, Verdict Pending
- Rewrote `src/lib/place-card.ts` to use new status system

### 3. Language / Label Cleanup (Global)
- "Food Spots" replaces "Reviews" for directory content
- "Listed — Review Pending" replaces "NOT YET REVIEWED"
- "Critic Verdict" / "Listing Info" replaces "The Honest Take" / "About This Place"
- "Community Notes" replaces "Community Verdicts"
- "View Listing →" replaces "READ TRUTH →"
- Footer: "Critic reviews reflect the critic's honest, independent opinion. Food spots without a verdict are listings only."
- Homepage recently-added: "Directory listings awaiting critic verdicts."
- Homepage hero: "400+ Jamaican food spots mapped. 10+ viral TikTok reviews. More anonymous verdicts loading."
- Critic card stats: 3K+ Followers, 100K+ Views, 10+ Viral Reviews, 400+ Food Spots
- No "50+ Reviews" anywhere

### 4. /reviews Page
- Created new route for TikTok-reviewed + critic-reviewed content only
- Hero: "Real Food Reactions. Viral Jamaican Reviews. No Fake Ratings."
- Empty state: "Connecting Reviewed Spots — follow TikTok for latest"
- Added "Viral Reviews" to navbar and footer

### 5. SEO Intro Copy
- `/restaurants/kingston` — "Kingston Food Spots Worth Mapping" (3 paragraphs)
- `/restaurants/portland` — "Portland Food Spots Worth Mapping" (3 paragraphs)
- `/browse?category=jerk` — "Jerk Chicken, Jerk Pork, and Roadside Smoke Across Jamaica"
- `/browse?category=seafood` — "Fish, Lobster, Conch, Shrimp, and Beachside Seafood Spots"
- Safe language: "mapped food spots," "public signals," "critic verdicts where available"

### 6. Browse Chips
- All, Jerk, Seafood, Kingston, Cheap Eats, Date Night, Curry Goat, Ice Cream

### 7. SEO Title Double-Branding Fix
- Root layout template: `%s | WhenWiHungry`
- All page titles cleaned — no `| WhenWiHungry | WhenWiHungry` duplicates

### 8. About Page
- Added "The Proof So Far" block with dynamic food spot count
- Stats: 3K+ TikTok Followers, 100K+ Total Views, 400+ Food Spots, 0 Free Meals

### 9. Get Reviewed Page
- Updated hero copy: "Submit your spot. If it fits the audience..."
- Added "What Happens After You Submit" section (4 steps)
- Updated success message: "This does not guarantee a review..."
- Contact fallback: "For collabs, tips, or corrections, message WhenWiHungry on TikTok or Instagram."

### 10. Place Card Name Visibility Fix
- **Root cause**: `.card` CSS had white background (`rgba(255,255,255,0.96)`) but text was white (#fff) — invisible names
- Rewrote `PlaceListCard` with explicit dark theme (`var(--wwh-card)` background)
- Added fallback "Unnamed Food Spot" for missing names
- Uses centralized place-status helpers for labels and CTAs
- Shows public signal with proper null safety

### 11. Data Integrity — Location/Parish Validation
- Created `src/lib/location-validation.ts` — 14-parish alias maps, cross-validation
- Created `scripts/audit-place-locations.ts` — loads all 463 records, flags cross-parish issues
- Created `supabase/fix_parish_errors.sql` — parish corrections (Portland→Kingston, etc.)
- Updated `/restaurants/[location]` to filter through `isPlaceSafeForParishPage()`
- Added `npm run data:audit` script

### 12. Dynamic Food Spot Count
- Created `src/lib/place-counts.ts`
  - `getPublicFoodSpotCount()` — counts approved restaurants from Supabase
  - `formatFoodSpotCount()` — 400+ / 500+ / 1K+ / etc.
  - `getPublicFoodSpotCountLabel()` — fetch + format in one call
- Exact count: 463 → label: "400+"
- Updated homepage, about page, get-reviewed page
- ISR revalidation: 6 hours (`revalidate = 21600`)
- No hardcoded "58+" anywhere in src

---

## What We Did (2026-05-05 — 15-Phase Data Quality Audit)

### Phase 1 — Schema Audit
- Mapped full `restaurants` table schema: status, parish, area, address, description, category, cuisine_type, data_quality_status, business_type, manually_verified, tiktok_url, verdict, admin_score, is_featured, is_verified
- Confirmed `getAllApprovedPlaces()` had no `status=approved` filter — fixed

### Phase 2 — Description Audit Script
- `scripts/audit-place-descriptions.ts` — detects description text containing location keywords from the wrong parish
- Found **10 Kingston records** with "portland" in description (import contamination)

### Phase 3 — Safe Description Helper
- `src/lib/place-description.ts`
  - `getSafePlaceDescription(place)` — returns neutral fallback if description has cross-parish keywords
  - `descriptionHasConflict(place)` — boolean for audit/UI use

### Phase 4 — Quality Audit Script
- `scripts/audit-place-quality.ts` — flags non-food businesses by known slug list, name pattern, and category pattern
- Found **2 confirmed non-food records**: `lennys-cooking-gas`, `coronation-market-jamaica`

### Phase 5 — Schema Columns Added (via Supabase Studio)
```sql
ALTER TABLE restaurants
  ADD COLUMN IF NOT EXISTS data_quality_status TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS business_type TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS manually_verified BOOLEAN DEFAULT FALSE;
```
- `description_status TEXT` and `location_notes TEXT` columns also exist (confirmed by fix script)

### Phase 6 — Data Quality Fix Script
- `scripts/fix-place-data-quality.ts` — dry-run default, `--apply` to write
- Applied:
  - `lennys-cooking-gas` → `business_type=not_food, data_quality_status=rejected`
  - `coronation-market-jamaica` → `business_type=food_adjacent, data_quality_status=needs_review`
  - `rainforest-seafoods` → `business_type=food_adjacent`
  - `jamaica-liquor-warehouse` → `business_type=food_adjacent`

### Phase 7 — Visibility Helpers
- `src/lib/place-visibility.ts`
  - `isPublicFoodSpot()` — status=approved + not rejected + not not_food
  - `isSafeForBrowse()` — same as above
  - `isSafeForParishPage()` — stricter: excludes needs_review unless manually_verified
  - `isReviewedPlace()` — has tiktok_url or critic verdict

### Phase 8–11 — Route Audits & Text Checks
- Filters confirmed ANDed (text search does not override parish/category)
- /reviews correctly gates on `isReviewed()` — no listed-only records shown
- `getPublicFoodSpotCount()` now uses identical filters as `getAllApprovedPlaces()`
- No stale strings ("NOT YET REVIEWED", "THE HONEST TAKE", "58+") anywhere in src

### Phase 12 — All 4 Reports Generated
- `reports/place-description-audit.md` — conflicts: **0** (was 10)
- `reports/place-quality-audit.md` — 2 non-food flagged
- `reports/place-location-audit.md` — 463 records, 10 cross-parish (name/area based), 2 duplicates
- `reports/public-route-audit.md` — all routes pass; schema gap documented

### Phase 13–15 — Build, Verify, Commit
- `npm run build` clean — 18 routes, 0 TypeScript errors
- 5 commits on `main` covering descriptions / quality / visibility / reports / schema activation

### Description Contamination Fix
- `scripts/fix-contaminated-descriptions.ts` — dry-run default, `--apply` to write neutral descriptions
- **RLS blocks UPDATE via anon key** — script silently hits 0 rows
- `scripts/fix-contaminated-descriptions.sql` — SQL equivalent, run directly in Supabase Studio
- Ran SQL in Studio → verification SELECT returned **0 rows** ✅
- Re-ran `audit-place-descriptions.ts` → **With conflicts: 0** ✅

---

## Key Files
| File | Purpose |
|------|---------|
| `src/lib/place-status.ts` | Centralized 3-type review status system |
| `src/lib/place-counts.ts` | Dynamic food spot count (filters: approved + not rejected + not not_food) |
| `src/lib/location-validation.ts` | Parish validation, 14-parish alias maps, isPlaceSafeForParishPage() |
| `src/lib/place-description.ts` | getSafePlaceDescription() — neutral fallback for contaminated descriptions |
| `src/lib/place-visibility.ts` | isPublicFoodSpot(), isSafeForBrowse(), isSafeForParishPage(), isReviewedPlace() |
| `src/lib/place-card.ts` | Card state helper using new status system |
| `src/lib/community.ts` | getAllApprovedPlaces() — now filters status=approved + not rejected + not not_food |
| `src/components/browse/place-list-card.tsx` | Browse card with dark theme and status helpers |
| `src/app/reviews/page.tsx` | Viral Reviews archive page |
| `public/og/whenwihungry-og.png` | Social preview image (1200×630) |
| `scripts/audit-place-locations.ts` | Location data quality audit |
| `scripts/audit-place-descriptions.ts` | Description cross-parish contamination audit |
| `scripts/audit-place-quality.ts` | Non-food business detection |
| `scripts/fix-place-data-quality.ts` | Tag business_type / data_quality_status (dry-run default) |
| `scripts/fix-contaminated-descriptions.ts` | Replace contaminated descriptions (dry-run default; use .sql for actual writes) |
| `scripts/fix-contaminated-descriptions.sql` | SQL to run in Supabase Studio — bypasses RLS |
| `reports/place-description-audit.md` | Description audit — 0 conflicts |
| `reports/place-location-audit.md` | Location audit — 10 cross-parish flags (manual review needed) |
| `reports/place-quality-audit.md` | Quality audit — 2 non-food records |
| `reports/public-route-audit.md` | Route audit — all routes pass |
| `reports/live-verification.md` | Cache-busted URLs for post-deploy checks |

## npm Scripts
| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Vitest tests |
| `npm run data:audit` | Run location audit (`scripts/audit-place-locations.ts`) |
| `npm run data:audit:descriptions` | Run description contamination audit |

## Important: RLS Behaviour
The `restaurants` table has Row Level Security enabled. The anon key (used in all scripts) can **SELECT** freely but **UPDATE** is blocked — the SDK returns no error but affects 0 rows. Always run data correction SQL directly in Supabase Studio for writes that need to bypass RLS.

## Next Actions
- 10 suspicious cross-parish records in location audit — name/area-based flags, need manual one-by-one review in Supabase Studio
- 2 duplicate restaurant names across parishes — manual verification
- Populate TikTok review URLs in Supabase for `/reviews` page content
- Add SEO intro copy for more categories (curry-goat, ice-cream)
- Run Facebook Sharing Debugger / Twitter Card Validator after each deploy
