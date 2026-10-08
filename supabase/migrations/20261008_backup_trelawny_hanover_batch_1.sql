-- Private snapshot before the Trelawny & Hanover data pass. Not exposed via the API.
create table backups.restaurants_20261008_trelawny_hanover_batch_1 as
  select now() as backed_up_at, r.* from public.restaurants r
  where r.parish in ('Trelawny','Hanover') and r.status = 'approved';
revoke all on all tables in schema backups from public, anon, authenticated;
