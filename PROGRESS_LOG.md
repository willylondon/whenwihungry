# Progress Log

## [2026-05-04 00:00] - Search & Data Unification Fixes
- **Unified Data Source**: Removed static `places` dependency from `/browse` page. All results now come from Supabase `getAllApprovedPlaces` or `searchRestaurants`.
- **Fixed RPC Schema**: 
    - Added `DROP FUNCTION` to handle return type changes.
    - Renamed `city` to `area` in `search_restaurants` function and table definition to match the live DB.
    - Added `review_count` and `category` to the RPC return table.
    - Improved `base_relevance` logic to include `cuisine_type` and `category` matching.
- **Improved Data Mapping**:
    - Updated `dbRowToPlace` in `community.ts` to map `avg_rating` and `rating_count` from existing DB columns.
    - Fixed `verdict` and `is_verified` mapping to be more resilient (checking both joined and top-level fields).
- **UI Standardization**:
    - **VerdictBadge**: Standardized on result cards; shows "Verdict Pending" if missing.
    - **VERIFIED Badge**: Prominent top-left placement with high-contrast styling.
    - **Search Filters**: Improved visibility of the "What yuh hungry for?" search bar and styled it to pop.
    - **Match Reasons**: Dynamically revealed only during active search queries.
- **Location Normalization**: Fixed `/restaurants/[location]` routes to correctly normalize slugs (e.g. `st-andrew` -> `St. Andrew`).

## [2026-05-03 23:30] - Initial Audit & Implementation Plan
- Performed live audit of V2 build.
- Identified critical issues: category filter 0 results, location page failure, inconsistent rating/reviews.
- Created and approved implementation plan for Search & Filtering fixes.

## [2026-05-04 00:51] - Search Working End-to-End ✅
- Root cause found: RPC `WHERE keyword_relevance > 0` filtered everything out because DB records lacked matching text fields
- Fix: category queries now bypass RPC entirely, use direct Supabase `.or("cuisine_type.ilike.%jerk%,...")` 
- Build errors fixed: duplicate getUserRole removed, dbRowToPlace exported
- Location pages fixed: direct parish query with variant matching (Kingston, Portland, etc.)
- getUserRole() added to community.ts for admin protection
- CONFIRMED LIVE: /browse?q=jerk returns jerk restaurants
