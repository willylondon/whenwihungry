# Where Were We: Project Snapshot

**Last updated**: 2026-05-05  
**Live site**: https://whenwihungry.vercel.app/  
**Repo**: github.com/willylondon/whenwihungry  
**Stack**: Next.js 16 (Turbopack) + Supabase + Vercel  
**Data**: 463 approved restaurants across 13 parishes

---

## Current Status
✅ Build passes clean. Deployed to Vercel production. All work pushed to `main`.

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
- Created `scripts/audit-place-locations.ts` — loads all 465 records, flags cross-parish issues
- Created `supabase/fix_parish_errors.sql` — 44 parish corrections (Portland→Kingston, etc.)
- Updated `/restaurants/[location]` to filter through `isPlaceSafeForParishPage()`
- Removed both JoJo's Jerk Pit records (closed down)
- Audit: 58 flagged → 13 flagged after corrections
- 6 false positives identified (street names, not parish names)
- 2 records marked for manual review (border areas)
- Added `npm run data:audit` script
- `npm run build` passes clean

### 12. Dynamic Food Spot Count
- Created `src/lib/place-counts.ts`
  - `getPublicFoodSpotCount()` — counts approved restaurants from Supabase
  - `formatFoodSpotCount()` — 400+ / 500+ / 1K+ / etc.
  - `getPublicFoodSpotCountLabel()` — fetch + format in one call
- Exact count: 463 → label: "400+"
- Updated homepage, about page, get-reviewed page
- ISR revalidation: 6 hours (`revalidate = 21600`)
- Fallback: 400+ (updated from stale 58+)
- No hardcoded "58+" anywhere in src

## Key Files
| File | Purpose |
|------|---------|
| `src/lib/place-status.ts` | Centralized 3-type review status system |
| `src/lib/place-counts.ts` | Dynamic food spot count from Supabase |
| `src/lib/location-validation.ts` | Parish validation with 14-parish alias maps |
| `src/lib/place-card.ts` | Card state helper using new status system |
| `src/components/browse/place-list-card.tsx` | Browse card with visible names + dark theme |
| `src/components/home/hero-section.tsx` | Homepage hero with dynamic count |
| `src/app/reviews/page.tsx` | Viral Reviews archive page |
| `src/app/about/page.tsx` | About page with Proof So Far block |
| `public/og/whenwihungry-og.png` | Social preview image (1200×630) |
| `scripts/audit-place-locations.ts` | Data quality audit script |
| `supabase/fix_parish_errors.sql` | SQL migration for 44 parish corrections |
| `reports/place-location-audit.md` | Latest audit report |

## npm Scripts
| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Vitest tests |
| `npm run data:audit` | Run location audit report |

## Next Actions
- Populate TikTok review URLs in Supabase for `/reviews` page content
- Add SEO intro copy for more categories (curry-goat, ice-cream, etc.)
- Mark 2 ambiguous records manually (border areas)
- Run Facebook Sharing Debugger / Twitter Card Validator after each deploy

