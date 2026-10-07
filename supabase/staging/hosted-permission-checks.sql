-- STAGING ONLY ctmzxgkccxkgeuzntltc. All synthetic users/records roll back.
BEGIN;
CREATE FUNCTION pg_temp.assert_true(ok boolean, label text) RETURNS void LANGUAGE plpgsql AS $$ BEGIN IF ok IS DISTINCT FROM true THEN RAISE EXCEPTION 'FAIL %',label; END IF; END $$;
CREATE FUNCTION pg_temp.denied(statement text, expected text DEFAULT '42501') RETURNS void LANGUAGE plpgsql AS $$ BEGIN BEGIN EXECUTE statement; EXCEPTION WHEN OTHERS THEN IF SQLSTATE=expected THEN RETURN; ELSE RAISE; END IF; END; RAISE EXCEPTION 'Unexpected authorization: %',statement; END $$;
INSERT INTO auth.users(id,email,raw_user_meta_data) VALUES
('11111111-1111-4111-8111-111111111111','ordinary-a@example.test','{}'),
('22222222-2222-4222-8222-222222222222','ordinary-b@example.test','{}'),
('33333333-3333-4333-8333-333333333333','operator@example.test','{}'),
('44444444-4444-4444-8444-444444444444','whenwihungry@gmail.com','{"role":"admin"}');
SELECT pg_temp.assert_true((SELECT role='user' FROM public.profiles WHERE id='44444444-4444-4444-8444-444444444444'),'signup cannot grant admin');
UPDATE public.profiles SET role='admin' WHERE id='33333333-3333-4333-8333-333333333333';
INSERT INTO public.restaurants(id,name,slug,parish,status,latitude,longitude) VALUES('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','Synthetic rollback kitchen','synthetic-rollback-kitchen','Kingston','approved',18,-77);
SELECT set_config('request.jwt.claims','{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated","is_anonymous":false}',true);
SET LOCAL ROLE authenticated;
SELECT pg_temp.denied($q$UPDATE public.profiles SET role='admin' WHERE id=auth.uid()$q$);
SELECT pg_temp.denied($q$TRUNCATE public.restaurants$q$);
SELECT pg_temp.denied($q$SELECT * FROM public.search_logs$q$);
INSERT INTO public.review_requests(id,owner_id,contact_name,restaurant_name,location,contact_email,message) VALUES('dddddddd-dddd-4ddd-8ddd-dddddddddddd',auth.uid(),'Synthetic owner','Synthetic kitchen','Kingston','owner@example.test','Synthetic enquiry for rollback testing only.');
SELECT pg_temp.assert_true((SELECT count(*)=1 FROM public.review_requests),'owner reads persisted request');
SELECT pg_temp.denied($q$INSERT INTO public.review_requests(id,owner_id,contact_name,restaurant_name,location,contact_email,message) VALUES('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',auth.uid(),'Synthetic owner','Synthetic kitchen','Kingston','owner@example.test','Synthetic duplicate enquiry for rollback testing only.')$q$,'23505');
SELECT pg_temp.denied($q$UPDATE public.review_requests SET contact_email='changed@example.test'$q$);
WITH changed AS (UPDATE public.review_requests SET status='closed' RETURNING id) SELECT pg_temp.assert_true(count(*)=0,'owner cannot close request') FROM changed;
SELECT pg_temp.denied($q$SELECT * FROM public.publish_critic_review('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','WORTH_IT',75,'Synthetic headline','A sufficiently long synthetic critic review for testing only.','2026-01-01')$q$);
RESET ROLE;
SELECT set_config('request.jwt.claims','{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated","is_anonymous":false}',true);
SET LOCAL ROLE authenticated;
SELECT pg_temp.assert_true((SELECT count(*)=0 FROM public.review_requests),'unrelated account cannot read enquiry');
RESET ROLE;
SELECT set_config('request.jwt.claims','{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated","is_anonymous":false}',true);
SET LOCAL ROLE authenticated;
SELECT pg_temp.assert_true((SELECT count(*)=1 FROM public.review_requests),'protected admin sees queue');
UPDATE public.review_requests SET status='in_review';
SELECT pg_temp.assert_true((SELECT status='in_review' FROM public.review_requests),'admin triages queue');
SELECT pg_temp.assert_true((SELECT changed FROM public.publish_critic_review('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','WORTH_IT',75,'Synthetic headline','A sufficiently long synthetic critic review for testing only.','2026-01-01')),'atomic publication succeeds');
SELECT pg_temp.assert_true((SELECT NOT changed FROM public.publish_critic_review('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','WORTH_IT',75,'Synthetic headline','A sufficiently long synthetic critic review for testing only.','2026-01-01')),'publication retry is idempotent');
RESET ROLE;
SELECT set_config('request.jwt.claims','{"role":"anon"}',true);
SET LOCAL ROLE anon;
SELECT pg_temp.denied('SELECT * FROM public.review_requests');
SELECT pg_temp.denied('TRUNCATE public.admin_reviews');
SELECT pg_temp.denied('DELETE FROM public.admin_reviews');
SELECT pg_temp.assert_true((SELECT count(*)=1 FROM public.admin_reviews),'published critic publicly visible');
RESET ROLE;
SELECT set_config('request.jwt.claims','{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated","is_anonymous":true}',true);
SET LOCAL ROLE authenticated;
SELECT pg_temp.denied($q$INSERT INTO public.review_requests(id,owner_id,contact_name,restaurant_name,location,contact_email,message) VALUES('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',auth.uid(),'Synthetic owner','Synthetic kitchen','Kingston','owner@example.test','Synthetic anonymous enquiry for rollback testing only.')$q$);
RESET ROLE;
ROLLBACK;
SELECT 'hosted_staging_20_authorization_checks_passed_all_records_rolled_back' AS result;
