-- Private snapshot before the Westmoreland data pass. Not exposed via the API.
create table backups.restaurants_20261008_westmoreland_batch_1 as
  select now() as backed_up_at, r.* from public.restaurants r
  where r.parish = 'Westmoreland' and r.status = 'approved';
revoke all on all tables in schema backups from public, anon, authenticated;
