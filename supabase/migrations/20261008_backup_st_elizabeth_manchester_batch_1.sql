-- Private snapshot before the St. Elizabeth & Manchester data pass. Not exposed via the API.
create table backups.restaurants_20261008_st_elizabeth_manchester_batch_1 as
  select now() as backed_up_at, r.* from public.restaurants r
  where r.parish in ('St. Elizabeth','Manchester') and r.status = 'approved';
revoke all on all tables in schema backups from public, anon, authenticated;
