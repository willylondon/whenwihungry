# Restaurant inquiries and editorial publishing: draft rollout

Status: **code prepared and isolated tests passed; not deployed; no production migration applied**.

Update: the owner confirmed sign-in-required intake on 7 October. Production read-only inspection found unprotected profile roles and unrelated public write/RLS gaps; neither original migration is applied. See [current verification](launch-verification-2026-10-07.md) and the additional draft `20261007120640_verified_launch_security_baseline.sql`. All three drafts must pass hosted staging verification before production approval or intake enablement.

## Product decision to review

The former `/get-reviewed` form only changed local UI state and discarded every request. This draft replaces it with **signed-in, durable requests**, using the existing Supabase backend and a private admin queue at `/admin/requests`. Requiring sign-in is a new UX tradeoff, not an existing user preference: it gives each request an owner, allows private status lookup, blocks unauthenticated/anonymous-auth submissions, and supports database-enforced one-open-request-per-account backpressure. There is no anonymous mail endpoint. Accounts can still be abused, so this is not a replacement for provider abuse controls.

The form is disabled by default. `REVIEW_REQUESTS_ENABLED=true` is a **server-only** rollout switch, not proof of readiness. Do not enable it merely because this code builds. While disabled, there are no inert data-entry fields and the page links the existing TikTok/Instagram contact channels. Nothing is emailed automatically.

## Files and ownership

- Draft intake migration: `supabase/migrations/20261007093055_private_review_requests.sql`
- Draft atomic publishing migration: `supabase/migrations/20261007093722_atomic_critic_publication.sql`
- New table: `public.review_requests`, private by RLS and grants
- Owner: authenticated permanent account; derives `owner_id` from the verified session
- Intake states: `pending`, `in_review`, `closed`
- Admin queue: `/admin/requests`, default pending, oldest first, 25 per page
- Public owner status: `/get-reviewed`, signed-in view shows their latest request
- Readiness/monitoring owner: **unassigned; the site owner must designate one before enablement**

A success message requires a returned persisted request ID. Retrying uses the same primary key, with owner-scoped readback after a duplicate conflict. A separate partial unique index allows one open request per owner. If a read/write/permission/schema check fails, the form reports that receipt was not confirmed. Controlled fields retain entered details after an action error. An admin status change does not send a notification or promise coverage.

## Exact staging preparation (operator action, not performed by this patch)

1. Select a dedicated disposable staging Supabase project. Verify its project reference and URL; never use production for fixtures. Preserve a read-only export of actual existing tables, constraints, grants, policies, functions and triggers. The repository's old SQL scripts are not a complete trustworthy production baseline. Do not replay them wholesale.
2. Verify `public.profiles(id, role)` exists and `role` is server-controlled. With a regular account, prove that INSERT/UPDATE/UPSERT cannot grant `admin`, whether via a direct Data API request, user metadata, profile update, signup trigger, or a function. Verify admins can read their own role. If any path succeeds, **stop**; this draft's admin policies deliberately depend on a trusted profile role and cannot repair an unknown live access model.
3. Keep `REVIEW_REQUESTS_ENABLED` unset/false. Review the migration with the database owner. It creates only the new table/indexes/policies/grants, with no `SECURITY DEFINER` functions or replacement policies on existing tables. It intentionally fails if the table already exists, so an unknown prior table is never silently accepted.
4. Use the installed Supabase CLI's `--help`, `migration --help`, `migration up --help`, `db --help`, `db push --help` and `migration list --help` to confirm version-specific commands. This file was created with `supabase@2.120.0 migration new private_review_requests`, not a guessed filename. Do not invoke remote push/reset from an unverified project checkout. Apply this reviewed migration to the selected staging project through the owner's normal approved migration process. This document is not approval for applying a production migration.
5. In staging, confirm migration SQL completed and inspect:
   ```sql
   select relrowsecurity from pg_class where oid = 'public.review_requests'::regclass;
   select policyname, cmd, roles, qual, with_check from pg_policies
   where schemaname = 'public' and tablename = 'review_requests';
   select grantee, privilege_type from information_schema.role_table_grants
   where table_schema = 'public' and table_name = 'review_requests';
   select grantee, column_name, privilege_type from information_schema.role_column_grants
   where table_schema = 'public' and table_name = 'review_requests';
   select indexname, indexdef from pg_indexes
   where schemaname = 'public' and tablename = 'review_requests';
   ```
   Required: RLS on; no PUBLIC/anon grants; authenticated SELECT; column-limited INSERT excluding status/created_at; UPDATE only status; owner/admin policies; both primary-key and one-open-per-owner uniqueness.
6. Run Supabase security advisors on staging; inspect any finding affecting the new table, auth or trusted profile roles. Missing Data API grants must be fixed deliberately, never by granting broad access to every table.
7. Execute the direct-API matrix below against staging with separate synthetic test users A, B and a trusted admin. Confirm allowed writes by readback, not just HTTP status. Then enable `REVIEW_REQUESTS_ENABLED=true` in staging and run the browser journey below. Use test-only email values; do not submit a real customer request or send email.
8. Before any production rollout, obtain deployment/migration approval, verify actual production baseline independently, nominate a queue owner and check cadence (for example, once each business day), and agree retention/deletion/support procedures for private contact data. Only after production migration/RLS/advisor checks and authorized deployment should the server-only switch be enabled. No automated monitor, email alerts or ongoing communications were created by this patch.

### Direct API permission matrix

- Signed out/anon key: SELECT, INSERT, UPDATE, DELETE all denied
- Anonymous-auth account: cannot submit or read another person's request
- User A: INSERT with own owner ID works, default status pending, saved ID returned; can read own row
- User A: forged owner B, forged status, forged created_at, invalid email/oversized content rejected
- User B: cannot read A's contacts or message; status update affects zero rows
- User A: cannot update status/content/owner or delete the row; cannot self-promote profile role
- User A: repeat ID fails uniqueness; a second open ID fails open-request uniqueness
- Admin: sees A's queue item, can move pending → in_review → closed; invalid status rejected; cannot overwrite contact details through the app's status-only grant
- User A: sees admin's changed status; can submit another new request only after the existing request closes
- Remove/deny table access temporarily in staging: page/action reports unavailable rather than received or an ordinary empty queue

### Staging browser journey

1. Signed-out `/get-reviewed` visibly asks for sign-in; sign-in returns to the same page.
2. Signed-in synthetic user submits valid fields. Confirm pending disabled button, real saved reference, own status after refresh, and exactly one matching row in `/admin/requests` under a separate admin session.
3. Double-submit/retry a lost acknowledgment with the same request ID. Confirm one row, not two. Reload and verify one-open-request guidance.
4. Submit invalid, overlong and honeypot inputs. Confirm no new row. Simulate network/database failure; success must not appear and entered details should remain available to retry.
5. Triage the synthetic record in the admin queue; verify the user sees updated state after refresh. Non-admin direct action calls must not mutate it.
6. Restore the staging table access and feature switch. No staging private contact data should become available via public restaurant pages, search, public ratings, or anonymous Data API queries.

## Isolated verification already run

- `npx vitest run tests/editorial-workflow.test.ts tests/review-request-ui.test.tsx`: 38 tests passed
- 39 actual isolated Postgres/RLS assertions passed using PGlite 0.5.8, an in-memory PostgreSQL runtime. The harness creates synthetic `auth.uid()`/`auth.jwt()` helpers and a deliberately protected profile baseline, then applies both exact draft migrations. It also injects a status-write failure and proves that a new critic review is rolled back, even when the restaurant starts with a legacy NULL review status. This verifies new-table SQL semantics; it **does not verify Supabase's deployed auth, profiles, Data API, or production policies**.

Reproduce with the pinned dev-only PGlite dependency (no runtime app dependency or remote database):
```sh
npm ci
node tests/review-requests-rls.mjs
```
The harness also accepts `PGLITE_MODULE` pointing at an isolated PGlite `dist/index.js` installation. No database URL or credential is accepted by this harness.

## Editorial/listing behavior and remaining schema gates

- Every admin mutation independently calls the shared `requireAdmin`; the layout is not the authorization boundary. Session-scoped clients still rely on verified database RLS.
- Saving listing details never writes `admin_reviews`. Creating a listing explicitly creates a pending listing, with no critic verdict. Moderation is a separate step.
- Critic publication requires headline, substantive body, a selected valid verdict, an explicit score (including zero), a real nonfuture visit date, and a publish checkbox. Unchanged review fields are not rewritten; `created_at` and any existing publication timestamps are preserved.
- The atomic RPC must be applied and verified on staging before critic publishing can work; there is no assumption that it exists in production. Verify the exact function definition, SECURITY INVOKER, fixed empty search_path, execution grants, admin/anonymous denial, and rollback regression against actual staging RLS. Apply only through the approved migration process after the prerequisite schema/role checks.
- New review IDs equal the restaurant UUID. This makes competing first-publication inserts fail safely on the existing primary key without assuming the absent `restaurant_id` unique constraint. Existing duplicate review rows cause publication to fail visibly; none are deleted automatically.
- The RPC uses existing documented columns `headline`, `honest_take`, `visit_date`, and restaurant `review_status`, and no longer assumes `admin_reviews.reviewed_at` exists. Verify those columns and relevant grants in the actual environment before launch. Canonical listing writes now include both `price_level` and `price_range`; verify both exist, since schema history is incomplete.
- Critic publication calls `public.publish_critic_review`, a new **SECURITY INVOKER transactional RPC**. It independently checks the authenticated admin role, validates the payload, locks the restaurant to serialize competing publications, rejects existing duplicate critic records, and saves review content plus public review status atomically. If either write fails, both roll back. PUBLIC/anon execution is revoked. Existing table RLS remains in force. If the draft RPC is missing or unavailable, publication fails visibly with no application-level multiwrite fallback. A lost network acknowledgment still requires refreshing to check whether the transaction committed.
- Public visibility still requires listing approval/activity and valid content. Admin UI success explains that publication does not approve a listing.
- A deterministic application insert does not replace a database `UNIQUE(restaurant_id)` constraint for all possible writers. Audit duplicates and add such a constraint only after separately reviewing real data and schema; no existing records or constraints were changed here.
- Admin save/action readbacks verify affected rows. Failures are visible instead of silently ignored. Listing/user-review moderation invalidates public pages and counts.

## References checked during implementation

- [Supabase RLS and grants](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [New tables require explicit Data API grants](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically)
- [Supabase JavaScript insert readback](https://supabase.com/docs/reference/javascript/insert)
- [PGlite isolated PostgreSQL API](https://pglite.dev/docs/api)
