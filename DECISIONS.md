# Decisions

## Unified Data Source (2026-05-04)
**Decision**: Completely remove the import of static `places` from `src/lib/places.ts` in the `/browse` page logic.
**Rationale**: Avoid data inconsistency where one render shows 0.0 ratings (static fallback) and another shows real data (Supabase). This ensures all V2 data flows through the Supabase ranking engine.

## Schema Normalization (2026-05-04)
**Decision**: Standardize on `area` instead of `city` and `cuisine_type` instead of `cuisine` in the SQL RPC.
**Rationale**: Discovered that the live database schema used `area` and `cuisine_type`, which caused runtime errors when the RPC referenced `city` or `cuisine`.

## Verdict UI (2026-05-04)
**Decision**: Display "Verdict Pending" explicitly when a restaurant lacks an admin review.
**Rationale**: Adhere to the "Honest Jamaican Food Reviews" brand. A missing verdict shouldn't be hidden; it should be clear that the restaurant is still being audited.
