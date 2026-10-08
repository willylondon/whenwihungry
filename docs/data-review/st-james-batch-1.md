# St. James data pass: batch 1 (all 42 listings), plus island-wide clean-up

Status: **applied 2026-10-08** after owner approval. Owner answers: hide Secrets St. James and Sunrise Beach Jerk Hut (set `is_active = false`); Omar's Jerk Centre moved to Westmoreland. Foreign listings marked `data_quality_status = rejected`; invented Google IDs cleared on all seed entries; Pier 1 and HouseBoat Grill seed copies deleted. Full pre-change rows: `backups.restaurants_20261008_st_james_batch_1` (private schema).

Same rule as before: only what the restaurant's website/menu or the listing itself supports.

## A. Island-wide clean-up

**1. Ten listings that aren't in Jamaica:** mark as rejected (hidden, not deleted). The site's location check already keeps them off public pages; this cleans the data.

| Listing | Filed under | Actually in |
|---|---|---|
| Real Jamaican Jerk Food Restaurant | St. James | Saint James, **Barbados** |
| Jamaican Jerk Pit | St. Ann | **Ann Arbor, Michigan, USA** |
| Island View Steakhouse, SandBar x Isla Blue, Smoke Up Fusion BBQ, Sol at Mafolie Hotel, Sun & Sea Bar & Grill, Sunset Grille at Secret Harbour, The Greenhouse Restaurant & Bar, The Shack at Hull Bay | St. Thomas | St. Thomas, **US Virgin Islands** |

**2. Invented Google IDs on all 44 old seed entries:** clear them. Every seed entry (created 3 May) has a made-up ID containing the same fragment; no genuine ID does. Directions then use the listing's coordinates. 39 of these the site already ignores; this also catches the 5 variants it misses (e.g. Pier 1, Rick's Café, Little Ochie, The Lobster Trapp, Strawberry Hill).

**3. Two more duplicates in St. James:** remove the old seed copy.

| Remove (seed copy) | Keep |
|---|---|
| Pier 1 | Pier 1 on the Waterfront |
| The HouseBoat Grill | House Boat Grill Restaurant (renamed "The Houseboat Grill", website fixed) |

## B. Please decide
| Listing | Question |
|---|---|
| Secrets St. James Montego Bay | An adults-only all-inclusive resort, not a restaurant the public can walk into. Keep or hide? |
| Sunrise Beach Jerk Hut | Its listed website is the Hilton Rose Hall resort's dining page, so it looks like a guests-only resort outlet. Keep or hide? |

Also: **Omar's Jerk Centre** is in Bluefields, which is Westmoreland. I'll move it there unless you say otherwise.

## C. Descriptions with menu evidence (9)

| Listing | Proposed description | Dish tags | Other fixes |
|---|---|---|---|
| **Pier 1 on the Waterfront** | Open-air waterfront restaurant, bar and party venue on Howard Cooke Boulevard, running since 1986: braised oxtail, whole red snapper, coconut-crusted shrimp and a seafood mega pot. Late parties on Wednesdays and Fridays. | oxtail, snapper, shrimp, seafood, jerk chicken | Category → Seafood |
| **Delmare** | Seafood restaurant with Italian influences at Half Moon in Rose Hall, overlooking Eclipse beach: grilled octopus, fritto misto, squid-ink spaghetti, branzino and tiramisu. Dinner only; reservations required. | seafood, octopus, pasta, tiramisu | Category → Seafood |
| **Sugar Mill Restaurant** | Grill restaurant on the Half Moon golf course in Rose Hall: beef, lamb and pork grilled over charcoal with Jamaican flavours, and a rum-flamed mixed-grill skewer. Dinner Friday to Monday; reservations required; smart casual. | steak, grill | Category → Grill |
| **The Houseboat Grill** | International restaurant on a houseboat moored in the Montego Bay Marine Park, with seats downstairs, on the upper deck or by the water. Live lobster in season (July–March). Lunch and dinner daily. | lobster, seafood | Name fix; website → thehouseboatgrill.com |
| **Lucca** | Italian restaurant in The Annex Plaza, Fairview: stone-oven pizza and pasta, à la carte or tasting menus. Open daily, 12–9:30pm. | pizza, pasta | Name: drop "\| Italian Restaurant" |
| **Mystic Thai Montego Bay** | Thai and Indian restaurant in Fairview Towne Centre: Thai curries, butter chicken, samosas and tandoori platters. Open daily for lunch and dinner. | thai curry, butter chicken, samosa, indian | Category → Thai & Indian |
| **The Posh Table** | Indian and pan-Asian restaurant upstairs at Whitter Village Mall in Ironshore: chicken tikka biryani, malai tikka, pork bao and chicken lollipops. Open daily from 11:30am. | biryani, indian, bao | Category → Indian |
| **Margaritaville Montego Bay** | Restaurant, bar and water park on the Hip Strip with sea access, a sunset patio and the Clubville nightclub: jerk BBQ chicken, coconut shrimp, fish tacos and burgers. | jerk chicken, coconut shrimp, fish tacos, burger | |
| **Uncorked West** | Montego Bay branch of Uncorked, the wine and cheese shop with a dining room, at Fairview Shopping Centre. | | Category → Wine bar |

## D. Plain descriptions (29)

| Listing | Proposed description | Dish tags | Other fixes |
|---|---|---|---|
| A Vegan's Utopia | Vegan takeaway on Thompson Street. | vegan | Category → Vegan |
| AL's Soup and Jerk Spot | Soup and jerk spot on Codac Street. | jerk, soup | |
| Aydens Tropical Jerk | Jerk spot on Church Street, downtown Montego Bay. | jerk | |
| Chill Out Hut | Restaurant on Greenwood Avenue. | | |
| Coconut Jerk | Jerk spot on the A1 near Montego Bay. | jerk | |
| Ena Jamaica Restaurant | Restaurant on De Lisser Drive. | | (website says "coming soon") |
| Fairfield Restaurant & Bar | Restaurant and bar on Riverside Drive in Fairfield. | | Name: drop the "\|" |
| Far Out Fish Hut | Fish hut on the A1 at Greenwood, on the St. James–Trelawny border. | fish, seafood | Category → Seafood; drop "Ltd" |
| Father Bull Restaurant | Restaurant on the Greenwood main road. | | |
| Grand Supreme Food & Cocktail Lounge | Food and cocktail lounge on Pitfour Drive. | | |
| Irie House Restaurant and Bar | Restaurant and bar on the Hip Strip. | | Website not available → remove link; name tidy |
| Jerk Endz | Jerk spot on the Retirement main road. | jerk | |
| Jerk Shack | Jerk spot on Kent Avenue. | jerk | |
| Juicy Jerk Diner | Jerk diner on Catherine Hall Drive. | jerk | |
| Lee's Pots Montego Bay | Restaurant in Ramble Hill. | | Name: not all caps |
| Lilliput Jerk Centre | Jerk centre on the A1 at Lilliput, east of Montego Bay. | jerk | |
| MVP Smokehouse | Smokehouse on Bogue Road. | | |
| Omar's Jerk Centre | Jerk centre in Bluefields. | jerk | Parish → Westmoreland |
| Outta Road Jerk Centre & Seafood Bar and Grill | Jerk centre, restaurant and seafood bar and grill on the A1. | jerk, seafood | Category Cafe → Jerk; name tidy |
| Peppa's Cool Spot Montego Bay | Bar and grill on Rampart Close. | | Name capitalised |
| Pop Up Jerk Station | Pop-up jerk station on Quebec Avenue. | jerk | Name capitalised |
| Scotchies | Scotchies' Montego Bay jerk centre, at Coral Gardens between Montego Bay and Rose Hall. | jerk | Category → Jerk |
| Solace Restaurant & Lounge | Restaurant and lounge on Queens Drive. | | Website now redirects to an unrelated site → remove link |
| Sun and Fun Jerk | Jerk spot near Rose Hall. | jerk | |
| The Deck by the Riverside | Bar and grill by the river in the Over River district. | | |
| The Jerk Hut & Jus Kiddin | Jerk hut on Half Moon Street in Rose Hall. | jerk | |
| The Pelican Grill | Restaurant on the Hip Strip. | | Seed text replaced; website domain is for sale → remove link |
| Secrets St. James Montego Bay | *(depends on B)* | | |
| Sunrise Beach Jerk Hut | *(depends on B)* | | |

## How it will be applied
Full snapshot of every affected row into the private `backups` schema first, then one transaction, then a cache refresh.
