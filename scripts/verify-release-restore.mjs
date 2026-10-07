/** Offline verification of a private public-schema snapshot. Never connects to Supabase. */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';

const backupPath = process.argv[2];
if (!backupPath) throw new Error('Provide a local public-data JSON backup path.');
const backup = JSON.parse(await readFile(backupPath, 'utf8'));
const db = await PGlite.create();
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const digest = rows => createHash('sha256').update(JSON.stringify(rows.map(canonical).sort((a,b)=>String(a.id).localeCompare(String(b.id))))).digest('hex');
try {
  await db.exec(`CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; CREATE ROLE service_role NOLOGIN BYPASSRLS;
    CREATE SCHEMA auth; CREATE SCHEMA extensions;
    CREATE TABLE auth.users(id uuid PRIMARY KEY,email text,raw_user_meta_data jsonb DEFAULT '{}');
    CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$ SELECT COALESCE(NULLIF(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$;
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT NULLIF(auth.jwt()->>'sub','')::uuid $$;
    CREATE FUNCTION extensions.uuid_generate_v4() RETURNS uuid LANGUAGE sql AS $$ SELECT gen_random_uuid() $$;
    GRANT USAGE ON SCHEMA public,auth,extensions TO anon,authenticated;
    GRANT EXECUTE ON FUNCTION auth.jwt(),auth.uid(),extensions.uuid_generate_v4() TO anon,authenticated;`);
  await db.exec(await readFile(new URL('../supabase/staging/observed-baseline.sql', import.meta.url), 'utf8'));
  // Auth credentials are intentionally absent. Local-only identity placeholders satisfy references.
  await db.exec('SET session_replication_role = replica');
  for (const profile of backup.profiles) await db.query('INSERT INTO auth.users(id,email) VALUES($1,$2)', [profile.id,'restore-placeholder@example.test']);
  const expected = ['profiles','restaurants','restaurant_ratings','restaurant_comments','dishes','admin_reviews','user_reviews','search_keywords','search_logs'];
  assert.deepEqual(Object.keys(backup).sort(), [...expected].sort());
  for (const table of expected) {
    await db.query(`INSERT INTO public.${table} SELECT * FROM jsonb_populate_recordset(NULL::public.${table},$1::jsonb)`, [JSON.stringify(backup[table])]);
  }
  await db.exec('SET session_replication_role = origin');
  const verify = async phase => {
    for (const table of expected) {
      const { rows } = await db.query(`SELECT to_jsonb(t) AS row FROM public.${table} t`);
      // Compare typed values; PostgreSQL runtimes can serialize equivalent timezone offsets differently.
      const source = await db.query(`SELECT to_jsonb(t) AS row FROM jsonb_populate_recordset(NULL::public.${table},$1::jsonb) t`, [JSON.stringify(backup[table])]);
      assert.equal(digest(rows.map(r=>r.row)), digest(source.rows.map(r=>r.row)), `${phase}: ${table} must preserve every field`);
      console.log(`PASS ${phase}: ${table}, ${rows.length} rows, matching SHA-256`);
    }
  };
  await verify('restored');
  if (process.argv[3]) await db.exec(await readFile(process.argv[3], 'utf8'));
  else for (const name of ['20261007093055_private_review_requests.sql','20261007093722_atomic_critic_publication.sql','20261007120640_verified_launch_security_baseline.sql']) {
    await db.exec(await readFile(new URL(`../supabase/migrations/${name}`, import.meta.url),'utf8'));
  }
  await verify('migrated');
  assert.equal((await db.query('SELECT count(*)::int AS n FROM public.review_requests')).rows[0].n, 0);
  console.log('PASS: public application data restored locally and preserved by all three release migrations. Auth credentials and storage files were not backed up or restored.');
} finally { await db.close(); }
