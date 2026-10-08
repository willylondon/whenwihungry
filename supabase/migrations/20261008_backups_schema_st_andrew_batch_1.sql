-- Private snapshot of rows changed by the St. Andrew data pass (and the 8 duplicate
-- seed copies removed island-wide). Not exposed through the public API.
create schema if not exists backups;
revoke all on schema backups from public, anon, authenticated;
create table backups.restaurants_20261008_st_andrew_batch_1 as
  select now() as backed_up_at, r.* from public.restaurants r
  where r.slug in (
    'sonia-s-homestyle-cooking-kingston','cynthia-s-at-san-san-beach-portland','glistening-waters-restaurant-trelawny','jack-sprat-restaurant-st-elizabeth','lovers-leap-restaurant-st-elizabeth','scotchies-coral-gardens-st-james','scotchies-draxhall-st-ann','soldier-camp-bar-grill-portland',
    'soldier-camp-barand-grill','cafe-dolce','kingston-foods'
  ) or (r.parish = 'St. Andrew' and r.status = 'approved');
revoke all on all tables in schema backups from public, anon, authenticated;
