# Deployment notes

## Release safety

A successful Vercel build is not evidence that database permissions, data, auth, or customer-facing submissions work. Main is configured for automatic deployment according to the existing project notes. Review and approve the full staging evidence before merging or promoting any release.

- Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` explicitly per environment. Never let preview or test deployments share unintended production write access.
- Set `NEXT_PUBLIC_SITE_URL` to the verified production origin; do not switch to the owned `.com` while it remains parked.
- Configure and verify auth return URLs and email delivery before enabling recovery/confirmation workflows.
- Review any new migration against the actual schema and apply it to a disposable staging project first. Applying SQL to production requires separate approval.
- Run the checks and acceptance cases in `docs/launch-runbook.md` against the exact release commit.

## Existing database history is incomplete

The files in `supabase/` include legacy schema, upgrades, ranking replacements and data cleanup. They are **not** an ordered, verified reproduction of the deployed database. Several independently replace `search_restaurants`; replaying them indiscriminately can overwrite newer behavior. The original foundation/RLS migrations named in `supabase/README.md` are not present.

Recover the current schema/policies through an approved read-only export, reconcile a safe migration baseline, and test restore/rollback compatibility. Do not apply `v2_upgrade.sql` merely to resolve an application error.

## Domain and data

The owned `whenwihungry.com` and `www.whenwihungry.com` were still configured for Namecheap forwarding/parking on 7 October 2026. Add the hostnames to the correct Vercel project, use that project's prescribed DNS values, and verify redirects/certificates only under separate authorization. No new domain purchase is required.

The catalog recovered to 461 listings after the owner resumed its paused database during the audit. That count is not a count of verified Jamaican restaurants. Review foreign-location, duplicate and stale imported records before launch; corrections require approved data changes and must not be fabricated from names alone.
