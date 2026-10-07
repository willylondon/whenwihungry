/** Schema-only reconstruction of the observed production catalog, grants and policies. No network or credentials.
 * This proves draft migration semantics, not actual hosted Supabase authorization.
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
const db = await PGlite.create();
let checks = 0;
const ids = {a:'11111111-1111-4111-8111-111111111111',b:'22222222-2222-4222-8222-222222222222',admin:'33333333-3333-4333-8333-333333333333',listing:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',pending:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',foreign:'cccccccc-cccc-4ccc-8ccc-cccccccccccc'};
const check=(v,label)=>{assert.ok(v,label);checks++;console.log(`PASS ${label}`);};
async function as(role,user,anonymous=false){await db.exec('RESET ROLE');await db.query("SELECT set_config('request.jwt.claims',$1,false)",[JSON.stringify({sub:user??'',is_anonymous:anonymous})]);await db.exec(`SET ROLE ${role}`);}
async function denied(sql,params=[],code='42501'){let error;try{await db.query(sql,params);}catch(e){error=e;}check(error?.code===code,`${sql.slice(0,75)} denied (${code})`);}
try {
 await db.exec(`
 CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; CREATE ROLE service_role NOLOGIN BYPASSRLS;
 CREATE SCHEMA auth; CREATE SCHEMA extensions;
 CREATE TABLE auth.users(id uuid PRIMARY KEY,email text,raw_user_meta_data jsonb DEFAULT '{}');
 CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$ SELECT COALESCE(NULLIF(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$;
 CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT NULLIF(auth.jwt()->>'sub','')::uuid $$;
 -- PGlite has gen_random_uuid; emulate only uuid-ossp's default-value helper.
 CREATE FUNCTION extensions.uuid_generate_v4() RETURNS uuid LANGUAGE sql AS $$ SELECT gen_random_uuid() $$;
 GRANT USAGE ON SCHEMA public,auth,extensions TO anon,authenticated;
 GRANT EXECUTE ON FUNCTION auth.jwt(),auth.uid(),extensions.uuid_generate_v4() TO anon,authenticated;
 `);
 await db.exec(await readFile(new URL('../supabase/staging/observed-baseline.sql',import.meta.url),'utf8'));
 for (const [kind,id] of Object.entries(ids).slice(0,3)){await db.query('INSERT INTO auth.users(id,email) VALUES($1,$2)',[id,`${kind}@example.test`]);await db.query('UPDATE public.profiles SET role=$2 WHERE id=$1',[id,kind==='admin'?'admin':'user']);}
 await db.query("INSERT INTO public.restaurants(id,name,slug,parish,status,submitted_by,latitude,longitude) VALUES($1,'Synthetic','synthetic','Kingston','approved',$4,18,-77),($2,'Pending','pending','Kingston','pending',$4,18,-77),($3,'Foreign','foreign','St. Thomas','approved',$4,18.32,-64.85)",[ids.listing,ids.pending,ids.foreign,ids.a]);
 await as('authenticated',ids.a);
 check((await db.query("UPDATE public.profiles SET role='admin' WHERE id=$1 RETURNING role",[ids.a])).rows[0]?.role==='admin','observed pre-fix baseline reproduces self-promotion locally');
 await as('postgres');await db.query("UPDATE public.profiles SET role='user' WHERE id=$1",[ids.a]);
 for(const name of ['20261007093055_private_review_requests.sql','20261007093722_atomic_critic_publication.sql','20261007120640_verified_launch_security_baseline.sql'])await db.exec(await readFile(new URL(`../supabase/migrations/${name}`,import.meta.url),'utf8'));
 await db.query("INSERT INTO auth.users(id,email,raw_user_meta_data) VALUES('44444444-4444-4444-8444-444444444444','whenwihungry@gmail.com','{\"role\":\"admin\"}')");
 check((await db.query("SELECT role FROM public.profiles WHERE id='44444444-4444-4444-8444-444444444444'")).rows[0].role==='user','signup email and metadata cannot promote');
 await as('authenticated',ids.a);
 await denied("UPDATE public.profiles SET role='admin' WHERE id=$1",[ids.a]);
 await denied("INSERT INTO public.profiles(id,role) VALUES($1,'admin') ON CONFLICT(id) DO UPDATE SET role='admin'",[ids.a]);
 check((await db.query("UPDATE public.profiles SET display_name='Synthetic operator' WHERE id=$1 RETURNING display_name",[ids.a])).rows.length===1,'display name remains editable');
 // Zero affected rows is the expected RLS denial for a different owner.
 check((await db.query("UPDATE public.profiles SET display_name='Other' WHERE id=$1 RETURNING id",[ids.b])).rows.length===0,'other profile cannot be edited');
 await denied('TRUNCATE public.restaurants');
 await denied("UPDATE public.restaurants SET is_verified=true WHERE id=$1",[ids.pending]);
 await denied("INSERT INTO public.restaurants(name,slug,parish,submitted_by,is_featured) VALUES('Fake','fake','Kingston',$1,true)",[ids.a]);
 check((await db.query("INSERT INTO public.restaurants(name,slug,parish,submitted_by) VALUES('Submitted','submitted','Kingston',$1) RETURNING status",[ids.a])).rows[0].status==='pending','ordinary listing is pending');
 const review="INSERT INTO public.user_reviews(restaurant_id,user_id,rating,comment,status) VALUES($1,$2,4,$3,$4) RETURNING id";
 await denied(review,[ids.listing,ids.b,'Synthetic review','pending']);
 await denied(review,[ids.listing,ids.a,'Synthetic review','approved']);
 await denied(review,[ids.pending,ids.a,'Synthetic review','pending']);
 await denied(review,[ids.foreign,ids.a,'Synthetic review','pending']);
 await denied(review,[ids.listing,ids.a,'x'.repeat(501),'pending']);
 const saved=(await db.query(review,[ids.listing,ids.a,'Synthetic review','pending'])).rows[0].id;
 await denied(review,[ids.listing,ids.a,'Synthetic duplicate','pending'],'23505');
 check((await db.query("UPDATE public.user_reviews SET status='approved' WHERE id=$1 RETURNING id",[saved])).rows.length===0,'owner cannot moderate');
 await as('authenticated',ids.b);
 check((await db.query('SELECT id FROM public.user_reviews')).rows.length===0,'pending review hidden from unrelated user');
 await denied("INSERT INTO public.admin_reviews(restaurant_id,headline,verdict) VALUES($1,'Fabricated','MID')",[ids.listing]);
 await denied("INSERT INTO public.dishes(restaurant_id,name,normalized_name) VALUES($1,'Fake','fake')",[ids.listing]);
 await denied("INSERT INTO public.search_keywords(restaurant_id,keyword) VALUES($1,'Fake')",[ids.listing]);
 await denied('SELECT * FROM public.search_logs');
 await as('authenticated',ids.admin);
 check((await db.query("UPDATE public.user_reviews SET status='approved' WHERE id=$1 RETURNING id",[saved])).rows.length===1,'admin moderates review');
 check((await db.query("INSERT INTO public.restaurants(name,slug,parish) VALUES('Admin draft','admin-draft','Kingston') RETURNING status")).rows[0].status==='pending','admin creates pending listing without spoofing owner');
 const publish="SELECT * FROM public.publish_critic_review($1,'WORTH_IT',75,'Synthetic critic headline','A sufficiently detailed synthetic critic review for testing only.','2026-01-01')";
 const published=(await db.query(publish,[ids.listing])).rows[0];check(Boolean(published.review_id),'critic publication compatible with actual reviewed_at schema plus visit_date');
 check(!(await db.query(publish,[ids.listing])).rows[0].changed,'critic retry is idempotent');
 await as('postgres');
 const failing='eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
 await db.query("INSERT INTO public.restaurants(id,name,slug,parish,status,review_status) VALUES($1,'Rollback fixture','rollback-fixture','Kingston','approved',NULL)",[failing]);
 await db.exec("ALTER POLICY \"Admins can moderate restaurants\" ON public.restaurants USING (true) WITH CHECK (false)");
 await as('authenticated',ids.admin);
 await denied(publish,[failing]);
 await as('postgres');
 check((await db.query('SELECT id FROM public.admin_reviews WHERE restaurant_id=$1',[failing])).rows.length===0,'actual-shaped reviewed_at critic row rolls back on denied status update');
 check((await db.query('SELECT review_status FROM public.restaurants WHERE id=$1',[failing])).rows[0].review_status===null,'failed publication preserves legacy NULL status');
 await as('anon');
 check((await db.query('SELECT id FROM public.user_reviews')).rows.length===1,'public sees only approved review');
 check((await db.query('SELECT id FROM public.admin_reviews')).rows.length===1,'public sees published critic review');
 for(const table of ['admin_reviews','user_reviews','dishes','search_keywords','search_logs']){await denied(`DELETE FROM public.${table}`);await denied(`TRUNCATE public.${table}`);}
 await denied(publish,[ids.listing]);
 await denied('SELECT * FROM public.review_requests');
 await as('authenticated',ids.b,true);await denied(review,[ids.listing,ids.b,'Anonymous-auth review','pending']);await denied(publish,[ids.listing]);
 console.log(`${checks} verified-baseline isolated PostgreSQL checks passed. No hosted database accessed.`);
}finally{await db.close();}
