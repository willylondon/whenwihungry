# Trelawny & Hanover data pass: batch 1 (all 43 listings)

Status: **applied 2026-10-08** after owner approval. The 7 resort-only restaurants are hidden (`is_active = false`). Full pre-change rows: `backups.restaurants_20261008_trelawny_hanover_batch_1` (private schema).

Same rule: only what the restaurant's website or the listing itself supports.

## A. Please decide: resort-only restaurants (7)
These are restaurants inside all-inclusive resorts, normally for resort guests only. Hide them, as with Secrets and the Hilton jerk hut?

| Listing | Resort | Parish |
|---|---|---|
| Bhogali Restaurant, Portofino Restaurant, Poseidon Restaurant | Grand Palladium, Point Lucea | Hanover |
| Caribbean Grove, Magna, The Lobster House, Zenith Club Restaurant | Excellence Oyster Bay, Falmouth | Trelawny |

## B. Link fixes
| Listing | Problem |
|---|---|
| The Lobster Bowl | Domain has expired → remove link |
| Arawak's Rest Stop | Link points to an unrelated site (jamaica-star.com) → remove link |

No duplicates found.

## C. Descriptions with website evidence (4)

| Listing | Proposed description | Dish tags | Other fixes |
|---|---|---|---|
| **Pepper's Jerk Center** | Jamaican restaurant, sports bar and grill in Falmouth: jerk chicken and pork, barbecued chicken, curried chicken, curried shrimp and escovitch fish. Open Mon–Sat from 9am (8am on cruise-ship days) to 10pm. | jerk chicken, jerk pork, curry chicken, curry shrimp, escovitch fish | |
| **Glistening Waters Restaurant and Marina** | Jamaican and seafood restaurant with an indoor dining room and outdoor patio bar overlooking the Luminous Lagoon near Falmouth. Open daily, 7am–9pm. | seafood | |
| **Bamboo Beach Club** | Oceanfront beach club near Falmouth with a restaurant, shady palms and reggae; jerk chicken and fish on the lunch menu. Entry fee applies. | jerk chicken, fish | Category → Beach club |
| **Tipsy Tuna Seafood & Grill** | Seafood and grill restaurant on Seaboard Street, Falmouth. | seafood | Name: not all caps |

## D. Plain descriptions (32)

| Listing | Proposed description | Dish tags | Other fixes |
|---|---|---|---|
| **Hanover** | | | |
| Arawak's Rest Stop | Rest stop and restaurant at Ramble. | | See B |
| Badmachine Seafood & Jerk Hut | Seafood and jerk hut in Green Island. | jerk, seafood | Name capitalised |
| Bull Grill | Grill on the main road in Hanover. | | Replaces unverified seed text |
| Chef Odane | Restaurant on Hanover Street, Lucea. | | |
| Good Times Bar Seafood n Jerk | Bar with seafood and jerk on the main road in Hopewell. | jerk, seafood | |
| Pachie | Restaurant on the A1 at Sandy Bay. | | |
| Peppe Monte Café and Grill | Café and grill on the Esher main road near Lucea. | | Name tidy |
| Seaside Retreat | Seaside bar and grill on Seafield Lane. | | |
| Sky Beach | Beach restaurant in Hopewell. | | |
| The Lobster Trapp | Seafood spot on the main road in Hopewell. | lobster, seafood | Replaces unverified seed text |
| Valerie's Seafood | Seafood spot at Sandy Bay. | seafood | |
| Waterfront Restaurant & Bar | Waterfront restaurant and bar at Mosquito Cove, Sandy Bay. | | Name: drop the "\|" |
| Wayne's Place, Lobster | Lobster and seafood spot at Orange Bay. | lobster, seafood | |
| Xaymaica Restaurant | Restaurant in Lucea. | | |
| **Trelawny** | | | |
| Donna's Restaurant | Restaurant on Market Street, Falmouth. | | Replaces unverified seed text |
| Exotic Flamezz | Restaurant on Falmouth Street, Falmouth. | | |
| Falmouth Mystic Bar & Restaurant | Bar and restaurant in Florence Hall Village. | | |
| Fisherman's Inn | Seafood restaurant in Falmouth. | seafood | Replaces unverified seed text |
| Flavaville Restaurant | Bar and grill on Falmouth Street, Falmouth. | | |
| Ganja Bar by Pablo | Bar and restaurant on Rodney Street, Falmouth. | | |
| Julet's Restaurant & Bar | Restaurant and bar on Silver Sands Drive, Duncans. | | |
| Lindsay's Seafood Bar and Joints | Seafood bar on Simpson Street, Duncans. | seafood | Name capitalised |
| Lisa's H&A Restaurant Bar & Grill | Restaurant, bar and grill at Coopers Pen, Falmouth. | | |
| Martha's Market | Restaurant at Mountain Spring Bay, Duncans. | | |
| Muk Bang Trelawny | Restaurant at Rock, near Falmouth. | | |
| Out A Road Crabby | Crab and seafood spot on the A1 near Falmouth. | crab, seafood | |
| Rock Wharf Luminous Lagoon | Restaurant at Rock Wharf on the Luminous Lagoon, Florence Hall. | | |
| The Lobster Bowl | Seafood bar and grill on Main Street, Rio Bueno. | lobster, seafood | See B |
| Thali Indian Restaurant | Indian restaurant at Mountain Spring Bay, Duncans. | indian, curry | Name spelling fixed |
| Time 'N' Place | Beach restaurant and bar on Falmouth Beach. | | Replaces unverified seed text |
| Toykyia's Restaurant & Catering | Restaurant and caterer on the Rock main road, Falmouth. | | Name capitalised |
| Willis Dining Experience | Restaurant at Coopers Pen, Falmouth. | | |

## How it will be applied
Private backup snapshot, one transaction, cache refresh.
