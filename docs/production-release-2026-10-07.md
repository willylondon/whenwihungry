# Production release — 7 October 2026

The owner requested completion and a production launch today, including the existing `whenwihungry.com` domain and Resend authentication email. Enquiry intake remains disabled while its separate operational gates are unfinished.

## Verified before release

- Production: Supabase `dnlzaduonznhhlmyxrgh`; staging: `ctmzxgkccxkgeuzntltc`; Vercel project `prj_T9dGNOMClh5GmmX4W8A5TbX6g4Cz`.
- Fresh public schema export exactly matches the tested baseline: nine tables, nine functions, 17 policies, eight triggers, 35 constraints and 11 non-constraint indexes. Production has five missing-RLS errors and four mutable-search-path warnings pending the release migration. Leaked-password protection also remains disabled.
- One production admin exists, has a confirmed email, and matches the owner's `whenwihungry@gmail.com` account. No roles were changed.
- A private application-data backup and schema export are in the ignored, mode-700 `.tools/release-backup-2026-10-07/` directory (files mode 600). They contain 463 restaurants, one profile and 33 search logs; the other six public tables are empty. Never commit these files.
- `scripts/verify-release-restore.mjs` restored the public application snapshot into isolated PGlite, then applied the exact three migrations. Typed row hashes matched for every table before and after migration. It also passed for the combined atomic release SQL. This is public-schema/application-data recovery evidence, not a full managed Supabase recovery: Auth credentials and Storage files are excluded and are not changed by this release.
- Full Node 24 local checks pass: lint, TypeScript, 262 tests, 39 + 45 isolated SQL assertions and production build. CI runs `37633837733` and `37634491748` passed for the Account and admin-index changes respectively. Later source changes require their own final CI check.
- Hosted staging: admin and ordinary Account identities, reload persistence, admin sign-out, protected routes after sign-out, ordinary-user admin denial, and the fixed `/admin` denial path passed. Recovery email reached the owner inbox and opened the correct password-reset form; owner password entry is pending.

## Prepared changes

- Atomic SQL consists only of the three committed migrations in their tested order: `20261007093055_private_review_requests.sql`, `20261007093722_atomic_critic_publication.sql`, `20261007120640_verified_launch_security_baseline.sql`. Combined SQL SHA-256: `349bf180da05c715afd4699758da44bf20683cda90edffd6938538d9d5e32b33`. It changes grants/policies, prevents signup self-promotion, adds nullable critic visit dates and the private request/publishing objects; it does not rewrite or delete existing data. Apply as one migration and record its actual history, not three fictitious CLI applications.
- Production-only Vercel variables now explicitly point to the production Supabase project with its public anon key. The canonical origin remains `https://whenwihungry.vercel.app` until domain TLS is verified. `REVIEW_REQUESTS_ENABLED=false`.
- Apex and www are attached to Vercel; www redirects to apex with HTTP 308. Namecheap's old apex URL forward and www parking record must be replaced with Vercel's recommended records: apex A `216.198.79.1` (also recommended `64.29.17.1`), www CNAME `1c12d66b3146da53.vercel-dns-017.com.`. Existing mail forwarding/SPF records must be preserved.
- Privacy/contact information describes actual account storage, moderation, external map/image services, lack of automatic expiry, and owner contact for correction/removal. It is an operational disclosure, not legal certification.

## Rollback and remaining release actions

Before public traffic, verify the exact release commit's CI, production migration/readback/advisors, public image/catalog behavior, custom-domain TLS/canonicals/redirects, and Resend verification/SMTP/auth return URLs. Keep preview bound only to staging. Keep enquiries off.

If the new app fails, roll back to the recorded previous production deployment only after checking schema compatibility, and restrict affected write flows. Keep the security hardening: never restore mutable roles, public writes, or exposed logs. The migration is additive for stored data and permission-restricting for old writes. Retain the private backup and record any incident separately.
