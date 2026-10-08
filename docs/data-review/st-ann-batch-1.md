# St. Ann data pass: batch 1 (all 31 listings)

Status: **applied 2026-10-08** after owner approval. Full pre-change rows: `backups.restaurants_20261008_st_ann_batch_1` (private schema).

Same rule: only what the restaurant's website or the listing itself supports.

## A. Fixes
| Listing | Problem | Proposed fix |
|---|---|---|
| Jerk Chicken of Mie | Filed under St. Ann with the address "Jerk, Chicken, Jamaica", but its map pin is in central Kingston (near Half Way Tree) | Move to Kingston; address → "Kingston, Jamaica" |
| TikiTail Ja | Its website now shows an online-gambling spam page | Remove the link |
| Ultimate Jerk Centre | Website no longer exists | Remove the link |

No duplicates found in St. Ann.

## B. Descriptions with website evidence (11)

| Listing | Proposed description | Dish tags | Other fixes |
|---|---|---|---|
| **Ocho Rios Jerk Center** | Jerk restaurant and cocktail bar on DaCosta Drive: jerk platters of pork, chicken and sausage, whole lobster jerked or garlic-grilled, and wings. Open late every night (to midnight Mon–Thu, 1am Fri–Sun). | jerk pork, jerk chicken, jerk sausage, lobster, wings | Category → Jerk |
| **Plantation Smokehouse** | Restaurant and smokehouse at Richmond, Priory, with Jamaican, American and Asian dishes: BBQ ribs, grilled lobster tails, whole fried snapper, snow crab legs and surf and turf. Live band on Fridays; open daily 10am–11pm. | bbq ribs, lobster, snapper, crab, surf and turf | Category → Smokehouse |
| **Sharkies Seafood Restaurant** | Beachside seafood bar and grill on Main Street, Salem, in Runaway Bay: whole fish, curried, garlic or fried shrimp, crab legs, lobster and seafood platters. Open daily 10am–10:30pm. | fish, shrimp, curry shrimp, crab, lobster, seafood | |
| **Christopher's at Hermosa Cove** | Oceanfront veranda restaurant at Hermosa Cove in Ocho Rios, with Jamaican-inspired breakfast, lunch and dinner: curried conch fritters, shrimp dumplings, curried shrimp, seafood soup and seafood pasta. Visitors welcome when there's space; book by phone. | conch, curry shrimp, seafood soup, seafood pasta, breakfast | |
| **Ciao Bella Art Café & Restaurant** | Multi-level art café and Italian restaurant in Taj Mahal Plaza, Ocho Rios: breakfast waffles, pancakes and croissants by day, then lasagna, carbonara, risotto, prawn pizza and tiramisu. Café Mon–Sat 9am–6pm; restaurant Tue–Sun 12–9pm. | italian, pizza, pasta, lasagna, tiramisu, breakfast | Category → Italian |
| **Margaritaville Ocho Rios** | Beachside restaurant, bar and nightclub in Island Village on Turtle Beach Road, with a pool, swim-up bar, waterslide and private beach: jerk BBQ chicken, coconut shrimp, fish tacos and burgers. | jerk chicken, coconut shrimp, fish tacos, burger | |
| **Papi Chulo Drax Hall** | Jamaican-Mexican fusion restaurant in Drax Hall. Open daily from 11am (Sunday from noon). | mexican | Category → Ja-Mexican |
| **Kamila's Kitchen – Drax Hall** | Ocho Rios location of Kamila's Kitchen, the plant-based kitchen with ready-to-eat meals, snacks and cold-pressed juices. | vegan, juice | Category → Vegan |
| **Miss T's Kitchen** | Restaurant on Main Street, Ocho Rios, taking reservations. | | Replaces the unverified seed text |
| **Evita's Italian Restaurant** | Italian restaurant on Eden Bower Road above Ocho Rios. | italian | Replaces the seed text (website was down when checked) |
| **Oceans on the Ridge** | Seafood restaurant on Shaw Park Road, Ocho Rios. | seafood | (Website has a security error, so it couldn't be read) |

## C. Plain descriptions (20)

| Listing | Proposed description | Dish tags | Other fixes |
|---|---|---|---|
| 12 to 12 Day Lounge | Bar and lounge in the Commercial Complex, St Ann's Bay. | | |
| Asher's Restaurant | Restaurant on Main Street, St Ann's Bay. | | |
| Bamboo Blu | Restaurant on Mammee Bay Road. | | |
| Bettino's Al Mare | Italian restaurant at Drax Hall. | italian | Name shortened |
| Calabash Ital Restaurant | Ital restaurant on Newlin Street, Ocho Rios. | ital, vegan | Category → Ital |
| Flava Fingaz | Restaurant in Ocean View Mall, Ocho Rios. | | |
| Flavours Beach Bar and Restaurant | Beach bar and restaurant on the main road in Runaway Bay. | | |
| Hungry Bucks Jerk Pit | Jerk pit, restaurant and bar on Main Street, St Ann's Bay. | jerk | Name shortened |
| Jerk Chicken of Mie | Jerk chicken spot in Kingston. | jerk chicken | See A |
| Jerk Pork and Bar | Jerk pork spot and bar on Windsor Road, St Ann's Bay. | jerk pork | Category → Jerk; name capitalised |
| Keylargho Beach Restaurant and Bar | Beach restaurant and bar on Jail Lane, St Ann's Bay. | | |
| Mongoose Jamaica Restaurant | Restaurant on Main Street, Ocho Rios. | | Replaces the unverified seed text |
| Pickle Park Jamaica | Bar and grill at Drax Hall. | | |
| Rooftop Bar & Grill | Rooftop bar and grill on Main Street, Salem, Runaway Bay. | | |
| Roxborough Bar and Grill | Bar and grill on the Byfield highway near St Ann's Bay. | | |
| Sakura | Restaurant in St Ann's Bay. | | |
| Scotchies Drax Hall | Scotchies' jerk centre at Drax Hall. | jerk | Category → Jerk |
| Starliner Seafood Wine-Bar and Grill | Seafood, wine bar and grill at Plantation Village, Priory. | seafood | |
| TikiTail Ja | Beach spot at Alterry Beach, Priory. | | See A |
| Ultimate Jerk Centre | Jerk centre on Main Street, Discovery Bay. | jerk | See A |

## How it will be applied
Private backup snapshot, one transaction, cache refresh.
