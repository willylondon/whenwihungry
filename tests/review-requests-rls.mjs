/** Isolated Postgres/RLS contract test. Never connects to Supabase or a network DB.
 * Uses the dev-only @electric-sql/pglite dependency. PGLITE_MODULE can optionally
 * point at an isolated installation. See docs/REVIEW_REQUESTS_ROLLOUT.md. This does NOT certify live RLS.
 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const { PGlite } = await import(process.env.PGLITE_MODULE ? pathToFileURL(process.env.PGLITE_MODULE).href : "@electric-sql/pglite");
const db = await PGlite.create();
let checks = 0;
const check = (condition, label) => { assert.ok(condition, label); checks++; console.log(`PASS ${label}`); };
const ids = { a: "11111111-1111-1111-1111-111111111111", b: "22222222-2222-2222-2222-222222222222", admin: "33333333-3333-3333-3333-333333333333", anon: "44444444-4444-4444-4444-444444444444" };
const request = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const request2 = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
async function as(role, user, anonymous = false) {
  await db.exec("RESET ROLE");
  await db.query("SELECT set_config('request.jwt.claims', $1, false)", [JSON.stringify({ sub: user ?? "", is_anonymous: anonymous })]);
  await db.exec(`SET ROLE ${role}`);
}
async function denied(sql, params, code, label) {
  let caught; try { await db.query(sql, params); } catch (error) { caught = error; }
  check(caught?.code === code, `${label} (${code})`);
}
const insert = "INSERT INTO public.review_requests(id,owner_id,contact_name,restaurant_name,location,contact_email,message) VALUES ($1,$2,'Test operator','Test kitchen','Kingston','operator@example.test',$3) RETURNING id,status";
const message = "Synthetic test request, not a real restaurant inquiry.";
try {
  await db.exec(`
    CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN;
    CREATE SCHEMA auth;
    CREATE TABLE auth.users(id uuid PRIMARY KEY);
    CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$ SELECT COALESCE(NULLIF(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT NULLIF(auth.jwt()->>'sub', '')::uuid $$;
    GRANT USAGE ON SCHEMA public, auth TO anon, authenticated;
    GRANT EXECUTE ON FUNCTION auth.jwt(), auth.uid() TO anon, authenticated;
    CREATE TABLE public.profiles(id uuid PRIMARY KEY REFERENCES auth.users(id), role text NOT NULL);
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    GRANT SELECT ON public.profiles TO authenticated;
    CREATE POLICY profile_self_read ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
  `);
  for (const [kind, id] of Object.entries(ids)) {
    await db.query("INSERT INTO auth.users VALUES ($1)", [id]);
    await db.query("INSERT INTO public.profiles VALUES ($1,$2)", [id, kind === "admin" ? "admin" : "user"]);
  }
  const migration = await readFile(new URL("../supabase/migrations/20261007093055_private_review_requests.sql", import.meta.url), "utf8");
  await db.exec(migration);
  check((await db.query("SELECT relrowsecurity FROM pg_class WHERE oid='public.review_requests'::regclass")).rows[0].relrowsecurity, "RLS enabled");
  await as("anon");
  await denied("SELECT * FROM public.review_requests", [], "42501", "public cannot read contacts");
  await denied(insert, [request, ids.a, message], "42501", "public cannot submit");
  await denied("UPDATE public.review_requests SET status='closed'", [], "42501", "public cannot triage");
  await as("authenticated", ids.anon, true);
  await denied(insert, [request, ids.anon, message], "42501", "anonymous-auth account cannot submit");
  await as("authenticated", ids.a);
  await denied(insert, [request, ids.b, message], "42501", "owner cannot forge another owner");
  await denied("INSERT INTO public.review_requests(id,owner_id,contact_name,restaurant_name,location,contact_email,message,status) VALUES($1,$2,'Test','Test','Kingston','test@example.test',$3,'closed')", [request, ids.a, message], "42501", "owner cannot choose initial status");
  const saved = await db.query(insert, [request, ids.a, message]);
  check(saved.rows[0].id === request && saved.rows[0].status === "pending", "owner insert returns durable ID and pending status");
  check((await db.query("SELECT id FROM public.review_requests")).rows.length === 1, "owner can read own row");
  await denied(insert, [request, ids.a, message], "23505", "same-ID retry is constrained by primary key");
  await denied(insert, [request2, ids.a, message], "23505", "one open request per owner");
  check((await db.query("UPDATE public.review_requests SET status='closed' WHERE id=$1 RETURNING id", [request])).rows.length === 0, "owner cannot close request to bypass limit");
  await denied("UPDATE public.review_requests SET owner_id=$1 WHERE id=$2", [ids.b, request], "42501", "owner cannot transfer ownership");
  await denied("UPDATE public.review_requests SET message='Changed details' WHERE id=$1", [request], "42501", "owner cannot rewrite submitted details");
  await denied("DELETE FROM public.review_requests WHERE id=$1", [request], "42501", "owner cannot delete queue record");
  await denied("UPDATE public.profiles SET role='admin' WHERE id=$1", [ids.a], "42501", "test profile baseline prevents self-promotion (production must verify independently)");
  await as("authenticated", ids.b);
  check((await db.query("SELECT * FROM public.review_requests")).rows.length === 0, "another owner cannot read contact details");
  check((await db.query("UPDATE public.review_requests SET status='closed' WHERE id=$1 RETURNING id", [request])).rows.length === 0, "another owner cannot triage");
  await denied(insert, [request2, ids.b, "x".repeat(3001)], "23514", "database rejects oversized message through direct API path");
  await as("authenticated", ids.admin);
  check((await db.query("SELECT * FROM public.review_requests")).rows.length === 1, "admin can read inquiry queue");
  check((await db.query("UPDATE public.review_requests SET status='in_review' WHERE id=$1 RETURNING status", [request])).rows[0]?.status === "in_review", "admin can mark under consideration");
  await denied("UPDATE public.review_requests SET status='published' WHERE id=$1", [request], "23514", "database restricts triage statuses");
  await denied("UPDATE public.review_requests SET contact_email='other@example.test' WHERE id=$1", [request], "42501", "admin workflow cannot rewrite contact details");
  check((await db.query("UPDATE public.review_requests SET status='closed' WHERE id=$1 RETURNING status", [request])).rows[0]?.status === "closed", "admin can close request");
  await as("authenticated", ids.a);
  check((await db.query(insert, [request2, ids.a, message])).rows[0]?.status === "pending", "owner can submit again after administrative closure");
  await db.exec("RESET ROLE");
  await db.exec(`
    CREATE TABLE public.restaurants(id uuid PRIMARY KEY, review_status text);
    CREATE TABLE public.admin_reviews(id uuid PRIMARY KEY, restaurant_id uuid REFERENCES public.restaurants(id), verdict text, admin_score integer, headline text, honest_take text, visit_date date, created_at timestamptz DEFAULT now());
    ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.admin_reviews ENABLE ROW LEVEL SECURITY;
    GRANT SELECT, UPDATE ON public.restaurants TO authenticated;
    GRANT SELECT, INSERT, UPDATE ON public.admin_reviews TO authenticated;
    CREATE POLICY restaurant_read ON public.restaurants FOR SELECT TO authenticated USING (true);
    CREATE POLICY restaurant_admin_update ON public.restaurants FOR UPDATE TO authenticated USING (EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND role='admin')) WITH CHECK (EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND role='admin'));
    CREATE POLICY review_read ON public.admin_reviews FOR SELECT TO authenticated USING (true);
    CREATE POLICY review_admin_insert ON public.admin_reviews FOR INSERT TO authenticated WITH CHECK (EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND role='admin'));
    CREATE POLICY review_admin_update ON public.admin_reviews FOR UPDATE TO authenticated USING (EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND role='admin')) WITH CHECK (EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND role='admin'));
  `);
  const restaurantId = "dddddddd-dddd-dddd-dddd-dddddddddddd";
  const failingId = "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee";
  await db.query("INSERT INTO public.restaurants VALUES ($1,NULL),($2,NULL)", [restaurantId, failingId]);
  await db.exec(await readFile(new URL("../supabase/migrations/20261007093722_atomic_critic_publication.sql", import.meta.url), "utf8"));
  const publish = "SELECT * FROM public.publish_critic_review($1,'WORTH_IT',0,'A real review',$2,'2026-01-01')";
  const body = "A real critic review with enough detailed text for the test.";
  await as("anon");
  await denied(publish, [restaurantId, body], "42501", "public cannot invoke critic publication");
  await as("authenticated", ids.a);
  await denied(publish, [restaurantId, body], "42501", "regular user cannot publish directly through RPC");
  await as("authenticated", ids.admin, true);
  await denied(publish, [restaurantId, body], "42501", "anonymous-auth identity cannot publish even with admin fixture role");
  await as("authenticated", ids.admin);
  await denied(publish, [restaurantId, "tiny"], "22023", "RPC independently validates substantive review content");
  const published = await db.query(publish, [restaurantId, body]);
  check(published.rows[0]?.review_id === restaurantId && published.rows[0]?.changed === true, "atomic critic publication returns confirmed review ID");
  check((await db.query("SELECT review_status FROM public.restaurants WHERE id=$1", [restaurantId])).rows[0]?.review_status === "reviewed", "atomic publication changes public status");
  const firstDate = (await db.query("SELECT created_at FROM public.admin_reviews WHERE id=$1", [restaurantId])).rows[0]?.created_at;
  check((await db.query(publish, [restaurantId, body])).rows[0]?.changed === false, "unchanged critic publication is idempotent");
  check((await db.query("SELECT created_at FROM public.admin_reviews WHERE id=$1", [restaurantId])).rows[0]?.created_at.getTime() === firstDate.getTime(), "unchanged review preserves publication date");
  check((await db.query(publish, [restaurantId, body + " An edited conclusion."])).rows[0]?.changed === true, "edited critic body saves through same atomic path");
  check((await db.query("SELECT created_at FROM public.admin_reviews WHERE id=$1", [restaurantId])).rows[0]?.created_at.getTime() === firstDate.getTime(), "edited review preserves original publication date");
  await db.exec("RESET ROLE");
  await db.exec(`
    CREATE FUNCTION public.test_block_status() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Forced publication status failure' USING ERRCODE='42501'; END $$;
    CREATE TRIGGER test_status_failure BEFORE UPDATE OF review_status ON public.restaurants FOR EACH ROW EXECUTE FUNCTION public.test_block_status();
  `);
  await as("authenticated", ids.admin);
  await denied(publish, [failingId, body], "42501", "status failure aborts entire critic publication transaction");
  check((await db.query("SELECT id FROM public.admin_reviews WHERE restaurant_id=$1", [failingId])).rows.length === 0, "failed publication leaves no critic row even with legacy NULL status");
  check((await db.query("SELECT review_status FROM public.restaurants WHERE id=$1", [failingId])).rows[0]?.review_status === null, "failed publication preserves original restaurant state");
  await as("authenticated", ids.a);
  check((await db.query("SELECT id FROM public.admin_reviews WHERE restaurant_id=$1", [failingId])).rows.length === 0, "public-readable critic query cannot see partially published content");
  console.log(`\n${checks} isolated inquiry/editorial Postgres/RLS checks passed. No production or staging database accessed.`);
} finally { await db.close(); }
