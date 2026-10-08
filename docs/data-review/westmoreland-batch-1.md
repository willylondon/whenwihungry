# Westmoreland data pass: batch 1 (all 32 listings)

Status: **applied 2026-10-08** after owner approval. Owner answer: Zest renamed to The Cliff Restaurant. Duplicate seed copies of Miss Lily's and Office of the Nature deleted. Full pre-change rows: `backups.restaurants_20261008_westmoreland_batch_1` (private schema).

Same rule: only what the restaurant's website or the listing itself supports. Several Negril hotel sites describe the setting and hours but don't publish menus, so those descriptions say where and when, not what's on the plate.

## A. Duplicates: remove the old seed copy (2)
| Remove (seed copy) | Keep |
|---|---|
| Miss Lily's Negril | Miss Lily's at Skylark Negril Beach Resort (gets the misslilys.com link) |
| Office of the Nature | Office of Nature |

## B. One question
**Zest Restaurant at The Cliff Hotel:** The Cliff's own website now only mentions "The Cliff Restaurant", not Zest. Rename the listing to "The Cliff Restaurant", or leave it as Zest?

## C. Descriptions with website evidence (10)

| Listing | Proposed description | Dish tags | Other fixes |
|---|---|---|---|
| **Rick's Café** | Cliffside bar and restaurant on Negril's West End, open since 1974 and known for its sunset views. No cover charge; open daily, noon–10pm. | | Replaces the seed text; name "Rick's Cafe" → "Rick's Café" |
| **Margaritaville Negril** | Beachfront restaurant, bar and nightclub on Seven Mile Beach with cabanas, a tiki bar and a water trampoline: jerk BBQ cheeseburgers, coconut shrimp, fish tacos and jambalaya. | jerk, coconut shrimp, fish tacos, burger | Website → the Negril page |
| **The Lodge at Tensing Pen** | Cliffside restaurant and bar at Tensing Pen on Negril's West End, serving Caribbean food with sea views. Brunch, lunch and dinner daily, 10am–9pm; booking recommended for sunset. | brunch | Name shortened |
| **Ivan's** | Open-air restaurant and bar at Catcha Falling Star on West End Road: Jamaican food, sea views and candlelit sunset dinners. Open to visitors as well as resort guests. | | |
| **Miss Lily's at Skylark** | Miss Lily's restaurant at Skylark Negril Beach Resort on Seven Mile Beach. | | Website → misslilys.com |
| **Rockhouse Restaurant** | Restaurant at the Rockhouse hotel, set on the cliffs of Negril's West End. | | Website → rockhouse.com |
| **Zest / The Cliff Restaurant** | Restaurant at The Cliff Hotel on Negril's West End, perched above the sea. | | Name per B |
| **LTU Cliff Bar and Restaurant** | Bar and restaurant on the cliffs along West End Road. | | |
| **The Blue Mahoe** | Restaurant and bar on One Love Drive in the West End cliffs. | | Website no longer exists → remove link; name: drop the "\|" |
| **Fireman's Lobster Pit** | Lobster pit in Negril. | lobster, seafood | Website returns "not found" → remove link |

## D. Plain descriptions (19)

| Listing | Proposed description | Dish tags | Other fixes |
|---|---|---|---|
| Ackazz Jerk Center | Jerk centre on the Sturie main road near Darliston. | jerk | |
| BBJ Delight Café | Café on the Llandilo main road, Savanna-la-Mar. | | Name tidy |
| Best In The West | Restaurant in Paynes Town. | | |
| Border Jerk | Jerk spot at Mackfield. | jerk | |
| Bridgez Jerk and Rest Stop | Jerk spot and rest stop on the Big Bridge main road outside Savanna-la-Mar. | jerk | Category → Jerk |
| Cosmo's Seafood Restaurant | Seafood restaurant on Norman Manley Boulevard in Negril. | seafood | Replaces unverified seed text |
| Eleven Restaurant and Lounge | Restaurant and lounge on Beckford Street, Savanna-la-Mar. | | |
| Erica's Hideaway | Restaurant and bar on West End Road, Negril. | | Name: drop "\| Restaurant and Bar" |
| Flag City Seafood & Grill | Seafood and grill on Norman Manley Boulevard, Negril. | seafood | |
| Just Natural Veggie & Seafood | Vegetarian and seafood restaurant and bar in the West End. | vegetarian, seafood | |
| Loftycrab | Seafood spot on Beckford Street, Savanna-la-Mar. | crab, seafood | |
| Murphy's West End Restaurant | Restaurant on West End Road. | | Name: drop the "\|" |
| Office of Nature | Seafood spot at Bloody Bay, Negril. | seafood | Category → Seafood |
| Presley's Seafood Bar and Grill | Seafood bar and grill on West End Road. | seafood | |
| Scorpios Chill Spot | Chill spot in the Strathbogie district, Savanna-la-Mar. | | |
| Seafood Meats & More | Seafood and meat spot in Savanna-la-Mar. | seafood | |
| Shark Restaurant | Restaurant in the West End, Negril. | | |
| Street Light Bar & Grill | Bar and grill on Llandilo Road, Savanna-la-Mar. | | |
| Tip Top Surf and Turf | Surf-and-turf restaurant on Norman Manley Boulevard, Negril. | seafood, steak | Name tidy |

(Omar's Jerk Centre was already updated in the St. James batch.)

## How it will be applied
Private backup snapshot, one transaction, cache refresh.
