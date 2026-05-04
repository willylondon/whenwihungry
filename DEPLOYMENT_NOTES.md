# Deployment Notes

## Vercel Deployment
- Deployment is automatic on push to main.
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correctly set in Vercel environment variables.

## Supabase Deployment
- **CRITICAL**: Anytime `search_restaurants` is modified in `supabase/v2_upgrade.sql`, it MUST be manually redeployed via the Supabase SQL Editor.
- Existing functions with different return types must be dropped first (handled by the script).
- Ensure the `admin_reviews` and `user_reviews` tables are populated to see meaningful browse results.
