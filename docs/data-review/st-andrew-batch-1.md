# St. Andrew data pass: batch 1 (all 23 listings), plus duplicates island-wide

Status: **applied 2026-10-08** after owner approval. Owner answers: hide Kingston Foods; move Sharon's Cook Shop to Kingston; Cafe Marigold kept with the plain description (dead website link removed). The 8 duplicate seed copies were deleted. Full pre-change rows: `backups.restaurants_20261008_st_andrew_batch_1` (private schema, not readable by the public API).

Same rule as Kingston: only what the restaurant's website/menu or the listing itself supports. Dish tags come from named menu items, or from the name where it says what they serve.

## A. Duplicates found island-wide (8): remove the older seed copy
Each pair is the same place. The older copy (created 3 May) has a made-up Google ID and rounded coordinates; the 5 May import is kept. Nothing (reviews, ratings, comments) refers to the old copies.

| Remove (seed copy) | Keep | Parish |
|---|---|---|
| Sonia's Homestyle Cooking (Kingston) | Sonia's Homestyle Cooking & Natural Juices | St. Andrew (same 17 Central Ave) |
| Cynthia's at San San Beach | Cynthia's \| Winifred Beach | Portland |
| Glistening Waters Restaurant | Glistening Waters Restaurant and Marina | Trelawny |
| Jack Sprat Restaurant | Jack Sprat Restaurant & Bar | St. Elizabeth |
| Lovers Leap Restaurant | Lovers Leap | St. Elizabeth |
| Scotchies (Coral Gardens) | Scotchies | St. James |
| Scotchies (Draxhall) | Scotchies Drax Hall | St. Ann |
| Soldier Camp Bar & Grill | Soldier Camp Bar& Grill (name tidied to "Soldier Camp Bar & Grill") | Portland |

## B. Please decide
| Listing | Question |
|---|---|
| Kingston Foods (59 Mannings Hill Rd) | Its website is only a contact form, with no sign of a restaurant. Keep or hide? |
| Cafe Marigold (8 Lady Musgrave Rd) | An old seed entry; its website no longer exists. Is it still open? |
| Sharon's Cook Shop (64 Hanover St) | Hanover Street is downtown Kingston, but it's filed under St. Andrew. OK to move it to Kingston? |

## C. Descriptions with menu evidence (9)

| Listing | Proposed description | Dish tags | Other fixes |
|---|---|---|---|
| **Sonia's Homestyle Cooking & Natural Juices** | Jamaican home-style restaurant on Central Avenue, opened by Sonia Thomas in 1985: curry goat, fried chicken, oxtail and butter beans, homemade pudding and natural juices. Breakfast daily; open 7am–5pm Mon–Thu and until 9pm Fri–Sun. | oxtail, curry goat, fried chicken, natural juice, breakfast | Name: drop the "\|" |
| **PeppaThyme** | Jamaican restaurant and bar on Constant Spring Road: curry goat, jerk pork, jerk chicken and rum ribs, plus takeout, catering and events. Closed Mondays; open Tue–Thu 11am–10pm, Fri–Sat to 11pm, Sunday to 9pm. | curry goat, jerk pork, jerk chicken, ribs | |
| **The Bless Table** | Caribbean restaurant on Red Hills Road for dine-in, takeout and catering: curry chicken, escovitch fish, honey jerk chicken, pepper shrimp, roast snapper and an ital veggie stew. Closed Mondays; open from 8am the rest of the week. | curry chicken, escovitch fish, jerk chicken, pepper shrimp, fried chicken, stew pork, ital, bread pudding | |
| **The Cheffing Don** | Vegan and ital kitchen on Constant Spring Road: gourmet burgers, a BBQ jackfruit burger, curried chickpeas, jerked tofu and turned cornmeal with gungo peas, plus natural juices. Mon–Fri 11am–5pm, Saturday 12–7pm. | vegan, ital, natural juice | Category → Vegan; fix website link (stray full stop) |
| **South Avenue Grill** | Upscale-casual grill on South Avenue with Jamaican and international plates: Thai coconut curry snapper, garlic Scotch bonnet salmon, baby back ribs, Red Stripe-battered shrimp and burgers. | ribs, salmon, shrimp, snapper, burger | Category → Grill |
| **Strawberry Hill Restaurant** | Hotel restaurant at Strawberry Hill in Irish Town, with a wraparound veranda and Blue Mountain views. New Jamaican cooking: lamb curry, fish stew, ackee and saltfish, callaloo and bread pudding, plus Sunday brunch. Breakfast, lunch and dinner daily. | ackee and saltfish, curry, callaloo, bread pudding, brunch | Replaces the seed text "Stunning views from the Blue Mountains." |
| **Cafe Blue** | Cafe Blue coffee shop in Irish Town, serving Jamaica Blue Mountain coffee with cakes like carrot cake and Baileys cheesecake. | coffee, cake | Replaces the seed text |
| **Fromage Bistro** | Bistro on Hillcrest Avenue from the Fromage group, which also runs Fromage Brasserie and Café Dolce. | | Replaces the seed text "Upscale bistro dining with excellent dessert…" |
| **Café Dolce** *(Kingston)* | Café on Constant Spring Road from the team behind Fromage. | | Adds the Fromage connection |

## D. Plain descriptions, no website (14)

| Listing | Proposed description | Dish tags | Other fixes |
|---|---|---|---|
| Ahmeraki Cafe | Café on Constant Spring Road for coffee and light bites. | coffee | |
| D&L Cook Shop | Cookshop in Stony Hill. | | Category → Cook shop; name capitalised |
| East Japanese HQ | Japanese restaurant on Constant Spring Road. | japanese | Removes the unverified "sushi, ramen" wording |
| Food Paradise Restaurant | Restaurant on Grants Pen Road. | | |
| House of Flamez | Bar and grill on Jacks Hill Road. | | |
| New Palm Restaurant | Restaurant on Oxford Terrace. | | |
| Nikky's Cook Shop | Cookshop on Tom Redcam Drive. | | Category → Cook shop |
| Sea Krave | Seafood spot on Grosvenor Terrace. | seafood | |
| Sharon's Cook Shop | Cookshop on Hanover Street, downtown Kingston. | | Category → Cook shop; name "Sharons cook shop" → "Sharon's Cook Shop" (see B) |
| Street Food Saturdays River Dining Experience | Saturday street food by the river in the Mount James district. | street food | |
| Taizhou Dao Restaurant | Restaurant on Constant Spring Road. | | Name capitalised |
| The Rib Kage Grill | Grill on Barbican Road. | ribs | |
| TRIO | Bar and grill on Hope Road. | | (Menu page was empty when checked) |
| Cafe Marigold | Café on Lady Musgrave Road. | | Website no longer exists → remove link (see B) |
| Kingston Foods | *(depends on B)* | | |

## How it will be applied
Back up current values, delete the 8 duplicate seed copies (backed up first), apply the edits in one transaction, then refresh the site cache.
