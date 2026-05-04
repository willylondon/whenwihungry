# Blockers

## Current Blockers
- **Supabase Permissions/CLI**: I do not have direct access to execute SQL on the remote Supabase instance. This requires the user to manually copy/paste the `v2_upgrade.sql` content to the Supabase dashboard.

## Resolved Blockers
- **Missing 'city' Column**: The RPC was failing because it referenced `r.city` instead of `r.area`. Resolved in the latest `search_restaurants` function definition.
- **Return Type Mismatch**: Fixed by adding `DROP FUNCTION` to the SQL upgrade script.
- **Inconsistent Data Sources**: Resolved by unifying the `/browse` page to use Supabase instead of static file imports.
