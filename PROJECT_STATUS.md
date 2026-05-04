# Project Status

## Project Name
whenwihungry

## Project Type
Website / App

## Current Goal
Normalize category and location filtering, unify data sources to Supabase, and ensure UI components (verdict badges, match reasons) are correctly implemented.

## Current State
Implemented comprehensive fixes for search (RPC mapping), data unification (removing static dependency), and UI standardization (prominent verdict and trust badges). Location routing normalization (e.g. St. Andrew) is fixed.

## Latest Known Working Version
Local development (http://localhost:3000/browse) with Supabase integration.

## Main Stack
Next.js, Supabase, Vanilla CSS, TypeScript.

## Important Links
GitHub:
Vercel: https://whenwihungry.vercel.app
Supabase:
Google Drive:
Docs:
Live Site:
Other:

## Active Tools
Browser Subagent, VS Code Terminal.

## Current Problem
The `search_restaurants` RPC requires a manual update in the Supabase SQL Editor to match the latest schema fixes (renaming `city` to `area` and adding `review_count`).

## Next Best Action
Manually apply the updated `supabase/v2_upgrade.sql` to the Supabase SQL Editor and perform a final verification of the "jerk" search.

## Last Updated
2026-05-04 00:02 AM

## Agent Handoff Summary

### Current Project
whenwihungry

### Current Objective
Finalize V2 Search & Filtering logic and UI components.

### Last Completed Step
Renamed `city` to `area` in `search_restaurants` RPC and schema to match live DB; fixed verdict and rating mapping in `community.ts`.

### Current State
Partial / Needs Review (Pending manual SQL application by USER).

### Known Issues
- `search_restaurants` RPC was failing in DB due to missing `city` column (fixed in SQL file, needs manual apply).
- Some results show "Verdict Pending" if no admin review exists in the DB.

### Exact Next Step
Manually apply `supabase/v2_upgrade.sql` to Supabase SQL Editor.

### Files To Open First
- [v2_upgrade.sql](file:///Users/itsupport/Documents/second%20brain/whenwihungry/supabase/v2_upgrade.sql)
- [community.ts](file:///Users/itsupport/Documents/second%20brain/whenwihungry/src/lib/community.ts)
- [place-list-card.tsx](file:///Users/itsupport/Documents/second%20brain/whenwihungry/src/components/browse/place-list-card.tsx)

### Commands To Run First
```bash
npm run dev
```
