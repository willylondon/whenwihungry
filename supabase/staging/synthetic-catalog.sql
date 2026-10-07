-- Disposable staging ctmzxgkccxkgeuzntltc only. No production or customer records.
-- Idempotent synthetic catalog; no reviews/ratings/contacts are invented.
BEGIN;
INSERT INTO public.restaurants(id,name,slug,description,parish,area,address,category,cuisine_type,status,is_active,latitude,longitude,price_range,price_level,review_status)
SELECT ('10000000-0000-4000-8000-' || lpad(i::text,12,'0'))::uuid,
 'Synthetic Kitchen ' || lpad(i::text,2,'0'), 'synthetic-kitchen-' || i,
 'Synthetic Jamaican food fixture for staging testing only.',
 (ARRAY['Kingston','St. Andrew','St. Thomas','Portland','St. Mary','St. Ann','Trelawny','St. James','Hanover','Westmoreland','St. Elizabeth','Manchester','Clarendon','St. Catherine'])[((i-1)%14)+1],
 'Synthetic town','Jamaica','Jamaican','Jamaican','approved',true,18,-77,
 repeat('$',((i-1)%4)+1),((i-1)%4)+1,'not_reviewed'
FROM generate_series(1,55) AS n(i)
ON CONFLICT(id) DO NOTHING;
INSERT INTO public.restaurants(id,name,slug,description,parish,address,status,is_active,latitude,longitude,review_status)
VALUES('10000000-0000-4000-8000-000000000999','Synthetic Overseas Fixture','synthetic-overseas-fixture','Synthetic overseas exclusion fixture.','St. Thomas','Secret Harbour, St Thomas, US Virgin Islands','approved',true,18.32,-64.85,'not_reviewed')
ON CONFLICT(id) DO NOTHING;
COMMIT;
SELECT count(*) AS synthetic_records FROM public.restaurants;
