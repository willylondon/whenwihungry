# Kingston data pass: batch 1 (listings with websites)

Status: **applied 2026-10-08** after owner approval. Owner answers: Kamila's Kitchen has two locations (Marketplace and Skyline Drive); The Coppers is $$$; Macau is also a restaurant (kept). Cooksmart was already hidden, so 8 listings were newly hidden. Previous values: `.tools/backups/kingston-batch-1-before-2026-10-08.json`.

Rule used: write only what the listing's own data or the restaurant's website/menu supports. No invented dishes. Dish tags are added only where a website or menu names the dish; they feed search ("oxtail", "curry goat", …).

## A. Hide: not places to eat (9)
Set `business_type = 'not_food'` (hidden from the site, nothing deleted).

| Listing | What it actually is | Evidence |
|---|---|---|
| Cooksmart Equipment & Supplies Ltd. | Commercial kitchen-equipment supplier | Website |
| Chang's Trading Co. Ltd. | Food-service packaging wholesaler | Website |
| C & M Collection | Commercial kitchen-equipment supplier | Website |
| 雄記食品 Fresh Approach Supermarket | Asian grocery store | Website |
| Rainforest Seafoods | Wholesale seafood supplier/processor | Website |
| Consolidated Bakeries Jamaica Ltd (Purity) | Industrial bread manufacturer | Name and website domain |
| National Bakery - Balmoral Wholesale | Wholesale bread depot | Name |
| National Bakery - Half Way Tree Wholesale | Wholesale bread depot | Name |
| Jamaica Liquor Warehouse | Liquor store | Name |

## B. New descriptions, dish tags and fixes (26)

| Listing | Proposed description | Dish tags | Other fixes |
|---|---|---|---|
| **Susie's** | Bakery café at the Shoppes at Southdale on South Avenue, open around the clock (except Monday 10pm to Tuesday 6am). Jamaican plates like oxtail with broad beans, curried goat, escovitch fish and ackee and saltfish, alongside sandwiches, salads and waffles. | oxtail, curry goat, escovitch fish, ackee and saltfish, callaloo, johnny cake, fried chicken, bbq ribs, waffles | |
| **J & B Homestyle Cookshop** | Home-style cookshop in Maverley for pickup and catering: fried, stewed and curried chicken, cow foot and stewed pork, with curried goat and stewed beef on Fridays. | fried chicken, stew chicken, curry chicken, cow foot, stew pork, curry goat, stew beef | Category Jamaican → Cook shop |
| **The Bakery At Spring** | Bake shop on Constant Spring Road with hardough bread, sweet potato pudding, plantain tarts and rum cake, plus patties in beef, chicken, curry goat, shrimp, fish and callaloo. | patty, hardough bread, sweet potato pudding, plantain tart, rum cake | Address → Shop 7, 144 Constant Spring Rd, Kingston 8 |
| **Usain Bolt's Tracks & Records** | Usain Bolt's sports bar and restaurant on Constant Spring Road: jerk wings, jerk shrimp, oxtail-crusted mac and cheese, fried fish and fritters. | jerk chicken wings, jerk shrimp, oxtail, fried fish, mac and cheese | |
| **Uncorked!** | Wine and cheese shop with a dining room at Sovereign North on Barbican Road: steak frites, citrus garlic mussels, fish and chips, lamb chops and a cheese board. | steak, mussels, fish and chips, lamb chops, cheese board | Category → Wine bar |
| **Quick Chick** | Fried-chicken takeaway on Grants Pen Road: strips, wings, sandwiches and buckets up to 21 pieces. Open Mon–Thu 11am–8pm, Fri–Sat 10am–9pm; delivery available. | fried chicken, chicken wings | Category Takeaway → Fried chicken |
| **Devon House Bakery** | The bakery at Devon House on Hope Road, for patties, cakes and desserts. Open daily, 10am–10pm. | patty, cake | |
| **Kamila's Kitchen** | Plant-based kitchen with ready-to-eat meals, snacks and cold-pressed juices, plus delivery and meal subscriptions. This is the Marketplace location on Constant Spring Road; there is a second on Skyline Drive. | vegan, juice | Category → Vegan; name → Kamila's Kitchen - Marketplace |
| **Broken Plate Restaurant** | Smart-casual restaurant in the Progressive Shopping Centre on Barbican Road. Families welcome; dress code applies. Open Mon–Sat 12pm–10pm, Sunday 11am–4pm. | | |
| **Chive Restaurant** | Restaurant in Orchid Village Plaza on Barbican Road for dinner, weekend brunch, wine and cocktails. Open daily; weekend brunch from 10:30am. | brunch | Name → Chive Restaurant |
| **The Coppers** | Restaurant on Haining Road, New Kingston, with two rooms: the Copper Cellar for fine international dining and the Copper Garden, an outdoor bistro. Open Tue–Sat 12pm–11pm, Sunday 12pm–9pm. | | Price $ → $$$ |
| **CRU Bar and Kitchen** | Rooftop bar and kitchen on Lady Musgrave Road. Smart-casual dress code; open daily, until 2am on Fridays and Saturdays. | | |
| **Clubhouse Brewery** | Local craft brewery with a taproom and kitchen on Constant Spring Road, overlooking a golf course. Growlers to go and curbside pickup. | | Category → Brewery |
| **Julie Mango Restaurant** | Restaurant at the Mayfair Hotel off Kings House Close, with breakfast, brunch, main and kids' menus. | brunch | |
| **22 Jerk Plus** | Jerk restaurant on Barbican Road with an event space for private functions and online ordering. | jerk | Category Bar & Grill → Jerk |
| **Maxfield Bakery & Pastries** | Bakery on Central Road in Kencot, selling to families and businesses, with online ordering. | | Address → 14 Central Rd, Kencot, Kingston 10 |
| **Plantation Smokehouse (Kingston)** | Kingston location of Plantation Smokehouse, on Constant Spring Road. | | Name → Plantation Smokehouse Kingston |
| **Dragon Garden** | Chinese restaurant on Constant Spring Road. | | Name → Dragon Garden (website was down when checked) |
| **Kingston Jerk** | Jerk spot on Chelsea Avenue in New Kingston. | jerk | Website is an empty placeholder → remove link |
| **A Di Same Ting, A Nuh Lame Ting Cookshop** | Cookshop on Darby Terrace serving Jamaican home-style plates. | | Category → Cook shop. Website points to a different business (Blacks Cookshop, Clarendon) → remove link |
| **Beachview Restaurant and Bar** | Restaurant and bar on Foreshore Road in Port Royal. | | Website no longer exists → remove link |
| **Whitney's Kitchen** | Restaurant on Ballater Avenue. | | Website is a parked domain → remove link. Name → Whitney's Kitchen |
| **Rosh2Go** | Takeaway on Constant Spring Road. | | Website is empty → remove link |
| **Loaded Jamaica** | Food spot on St Lucia Avenue, New Kingston. | | Website no longer exists → remove link. Name → Loaded Jamaica |
| **Willy's Thatch Roof & Cool Out Spot** | Thatch-roof cool-out spot on Molynes Road serving Jamaican food. | | Name → drop "Ltd" |
| **Macau Gaming Lounge & Bar** | Restaurant, bar and gaming lounge on Lindsay Crescent. | | Kept |

## How it will be applied
One database update per listing (description, dish_tags, category, name, address, website, business_type as listed), followed by **Refresh public site**. Previous values are saved to `.tools/backups/` first, so any row can be restored.
