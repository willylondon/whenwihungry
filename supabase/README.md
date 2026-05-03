# Supabase Notes

Project: `dnlzaduonznhhlmyxrgh`

Applied migrations:

- `platform_foundation`
- `tighten_score_function_security`
- `profile_creation_and_seed_restaurants`
- `revoke_public_function_execute`
- `admin_listing_moderation`

Current behavior:

- New users get a profile automatically.
- `whenwihungry@gmail.com` is assigned the `admin` role on signup.
- Public users can only read approved restaurants and visible comments.
- Signed-in users can submit restaurants, ratings, and comments.
- New restaurant submissions start as `pending`.
- Admin users can approve/reject listings from `/admin/listings`.
- Supabase security advisors were clean after the latest migration.

Do not commit database passwords or service-role keys.
