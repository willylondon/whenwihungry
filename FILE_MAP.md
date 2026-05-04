# File Map

## Core Logic
- `src/lib/community.ts`: Main Supabase integration layer. Handles `search_restaurants` RPC and mapping DB rows to `PlaceV2` objects.
- `src/lib/places.ts`: Legacy filtering logic. Now updated to normalize category matches and accept external data (Supabase) instead of using static fallbacks.

## UI Components
- `src/components/browse/place-list-card.tsx`: The primary card used in browse/search results. Handles Verdict Badges, Match Reasons, and Verified trust badges.
- `src/components/browse/search-filters.tsx`: Sidebar/Dropdown filters for the browse page. Styled for high visibility in V2.
- `src/components/ui/verdict-badge.tsx`: Centralized component for rendering RUN, GO, GET IT, WORTH IT, MID, and SAVE YOUR MONEY.

## Database
- `supabase/v2_upgrade.sql`: Source of truth for the V2 schema upgrade, triggers, and the `search_restaurants` ranking function.

## Pages
- `src/app/browse/page.tsx`: Unified browse/search entry point.
- `src/app/restaurants/[location]/page.tsx`: Location discovery pages (SEO-optimized).
