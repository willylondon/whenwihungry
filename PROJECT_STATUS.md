# Project Status

## Status: WORKING ✅

## Last Updated
2026-05-04 00:51 AM

## What Is Working
- /browse default loads all restaurants with real ratings and verdicts
- /browse?q=jerk returns jerk restaurants ✅ (CONFIRMED LIVE)
- /browse?category=jerk still works
- /browse?q=curry, ?q=oxtail, ?q=ice+cream all use direct ILIKE search
- Homepage search routes to /browse?q= correctly
- /restaurants/kingston and /restaurants/portland query by parish directly
- Admin forms expose all V2 fields (verdict, score, cuisine, image, etc.)
- Admin routes protected by getUserRole() server-side check
- VerdictBadge shows real verdicts from admin_reviews join
- Match reason badge displays on search results

## Architecture (Final)
- Category queries (jerk, seafood, etc.) → direct Supabase ILIKE on cuisine_type/category/name
- Free-text queries (Scotchies, best curry) → search_restaurants RPC
- Default browse → getAllApprovedPlaces with admin_reviews + user_reviews join
- Location pages → direct .in("parish", variants) query

## Deployed
- GitHub: main @ c534d53
- Vercel: Live ✅
