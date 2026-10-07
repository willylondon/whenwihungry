# Launch runbook: explicit release gates

This change is a reviewed-source candidate, not production approval. Do not merge/deploy, apply SQL, change DNS/account settings, or send real customer inquiries merely to complete this checklist.

Read [the current verification and deployed schema findings](launch-verification-2026-10-07.md) first. Production catalog inspection found mutable profile roles, five tables without RLS, and a missing critic visit-date column. The additional draft baseline migration must pass hosted staging checks before release. The owner has selected sign-in for enquiries; intake remains disabled.

## 1. Environment and schema prerequisites

- Use Node 24 and the committed lockfile. Set explicit project-specific Supabase URL/publishable key and `NEXT_PUBLIC_SITE_URL`; preview/staging and CI must not share production write access.
- Obtain a credential-free current schema/RLS/grants export through approved read-only access. `scripts/audit-database-permissions.sql` contains read-only catalog queries; it does not dump table contents, auth users or secrets.
- Reconcile the out-of-band migrations listed by `supabase/README.md`. Historic SQL files are not a replayable baseline. Do not blindly apply them.
- Review new migrations against the actual schema. Test them on a disposable staging copy, including forward/rollback/restore behavior. Keep production application pending explicit approval.
- New durable review-request intake is an optional feature, disabled by default until its schema/policies and monitoring are verified. Its new sign-in requirement is a proposed UX choice to provide identity, ownership and moderation boundaries, not an owner-selected product requirement. Review that tradeoff before enabling it; the disabled flow must provide the existing contact route rather than fake success.

## 2. Authentication and permission tests

Use synthetic accounts on staging, never real customer data. Verify signup with confirmation on and off, confirmation link, expired/reused link, sign-in failure/success, safe local return path, sign-out, forgotten-password email, password reset, session expiry and cookie refresh. Configure the verified site origin, Supabase redirect allowlist and working SMTP/email templates; do not test by sending real customer messages.

Test every public API and Server Action as anonymous, ordinary user and admin. Repeat directly against Supabase tables/RPCs, not only UI:

- Anonymous reads only intended approved public data; no private/pending requests, reviews, profiles or logs and no editorial writes.
- Users cannot assign their own role, spoof user/restaurant IDs, publish or moderate their own content, change another user's record, or set verified/featured/rank flags.
- Every admin mutation independently verifies role, rejects bad input and detects zero-row/partial writes.
- Any request-intake migration permits only intended owner/admin access. Prove that anonymous and unrelated users cannot read contact details. A successful application unit test does not prove deployed RLS.
- Review bounds, eligible targets, uniqueness, request idempotency and rate/abuse limits remain enforced when the UI is bypassed.

## 3. Durable workflows and content integrity

- A request must persist before success appears, remain visible after refresh and reach the monitored queue. Network/DB/migration errors must produce a retryable failure, never “received.” Test repeat clicks/retries and acknowledge who monitors the queue.
- Ordinary listing edits must not create a verdict or change critic publication date. Explicit publication requires genuine author-entered headline/body/verdict/date; no invented critic text or default MID review.
- Test listing-only, TikTok-only, draft, published and withdrawn states. Visible review content and JSON-LD must agree.
- Round-trip listing submission -> moderation -> browse/detail; community review -> approval -> approved-only aggregate. Test rejected/duplicate submissions and correction routes.
- Validate country, address and coordinates together before publishing imported records. The audit found Sunset Grille at Secret Harbour (USVI) mislabelled as Jamaican St. Thomas. Flag/quarantine obvious foreign records conservatively, retain originals and obtain owner confirmation before database corrections. Do not treat the 461 recovered entries as independently verified restaurants or invent replacement business data.

## 4. Discovery, accessibility and SEO

Use fixtures for all 14 parishes and aliases, prices $ through $$$$ and unknown, public/community/critic ratings separately, missing coordinates, null quality fields, pending/rejected/inactive/non-food and clearly foreign listings.

- Query plus each explicit sort gives expected IDs/order; ties are stable. Combined filters, URLs, chips, back/forward and map/list modes retain correct state.
- Browse, detail, parish, search, counts and sitemap share the same intended publication rules. Pagination retrieves/results consistently without silently relying on provider row limits.
- Search markers retain coordinates; unknown price/rating/location remains unknown.
- Simulate a backend outage and restore. UI must distinguish unavailable from empty, avoid fabricated counts and false success, and preserve valid SEO output or fail explicitly.
- Verify readable contrast/focus/labels, keyboard operation, status announcements and reduced motion. Test real 320/375/390/768px devices, iOS Safari/Android Chrome and screen reader; unit render tests are not a mobile pass.
- Inspect page-specific canonical, robots/noindex policy, sitemap, Open Graph and HTML-safe JSON-LD. Harmless closing-script regression inputs must not execute.

## 5. Quality and operational gate

Run a clean install, lint with zero warnings, full TypeScript, tests and production build against the final commit. Require those checks before promotion. Re-run dependency audits and document any remaining advisory's scope/reachability rather than silently suppressing it.

Measure populated-app LCP/INP/CLS, query/payload sizes, image/map loading and growth beyond 1,000 records. The audit's ~2.41 MB decoded browse HTML was not compressed wire size or a Core Web Vitals benchmark. Verify anonymous caching separately from session-bound content.

Assign release, incident, moderation and inquiry owners. Verify managed-provider error/latency/zero-inventory alerts, quotas, analytics receipt, backup retention and a real restore into a separate environment. Record rollback steps and schema compatibility. Publish accurate privacy/retention/deletion/contact/correction information before collecting real user information; do not claim an unreviewed template is legal compliance.

## 6. Owned domain and rollout (separate authorization)

No new purchase: the owner already owns `whenwihungry.com`. The audit observed Namecheap parking/forwarding. Under explicit approval, attach apex and www to the intended Vercel project, use its exact DNS instructions, then verify HTTPS certificates and preferred-host redirects. Update canonical/auth/analytics origins only after mapping works.

Record release commit, schema revision, tested roles/environments, check URLs, expected/actual results, residual risks and approver. A bounded beta follows completed gates for enabled features; public promotion follows verified beta behavior. No merge or production deployment is authorized by a draft PR.
