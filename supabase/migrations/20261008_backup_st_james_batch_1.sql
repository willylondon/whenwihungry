-- Private snapshot before the St. James data pass and island-wide clean-up
-- (foreign listings, invented Google IDs on seed entries). Not exposed via the API.
create table backups.restaurants_20261008_st_james_batch_1 as
  select now() as backed_up_at, r.* from public.restaurants r
  where (r.parish = 'St. James' and r.status = 'approved')
     or r.google_place_id like '%xXo4R%'
     or r.slug in ('jamaican-jerk-pit','island-view-steakhouse','sandbar-x-isla-blue','smoke-up-fusion-bbq','sol-at-mafolie-hotel','sun-and-sea-bar-and-grill','sunset-grille-at-secret-harbour','the-greenhouse-restaurant-and-bar','the-shack-at-hull-bay','omars-jerk-centre');
revoke all on all tables in schema backups from public, anon, authenticated;
