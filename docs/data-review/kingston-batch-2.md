# Kingston data pass: batch 2 (listings without their own website)

Status: **applied 2026-10-08** after owner approval. Owner notes: the 7 listings in section A were removed (hidden as `not_food`); Shaggy Jerk Chicken is a street-side jerk man (description and category updated). Crepe House was held back pending confirmation. Previous values: `.tools/backups/kingston-batch-2-before-2026-10-08.json`.

These listings have no website, or only a social page that can't be read without logging in. So the descriptions use only what the listing already shows: the name, the type of place and the street. They're short and plain on purpose. Dish tags are added only where the name itself says what they serve (e.g. "Jerk Chicken", "Crepe House").

**Your local knowledge helps most here.** If you know what any of these places are known for (e.g. "best fried chicken on Red Hills Road", "Friday curry goat"), add a note in the last column and I'll write it in, with dish tags.

## A. May not be places to eat (please decide: keep or hide)

| Listing | Address | Why I'm unsure |
|---|---|---|
| Coronation Market Jamaica | Pechon St, downtown | A public produce market, not a restaurant |
| Market Place | 67 Constant Spring Rd | The plaza that houses Kamila's Kitchen and Shams, not one restaurant |
| HOME INTERNATIONAL LTD | 104 Constant Spring Rd | Name suggests a business, not a food spot |
| EBS Hotel Restaurant & Supplies | 22 Dunrobin Ave | Name suggests a restaurant-supply store |
| Kitchen & Baking | 25 Constant Spring Rd | Name suggests a kitchen/baking supply store |
| Dollar Shop Kitchen & HQ | Old Parochial Rd | Unclear what it is |
| Prestige Bakery Ltd | 159 Orange St | May be a wholesale bakery rather than a shop |

## B. Proposed descriptions (49)

| Listing | Proposed description | Dish tags | Other fixes | Your notes |
|---|---|---|---|---|
| 100 Restaurant | Restaurant on Hope Road. | | Name "100 restaurant" → "100 Restaurant" | |
| 876 Food Cart Ja | Street-food cart on Goodwood Terrace. | | | |
| Addea's Cookshop | Cookshop on Deanery Road serving Jamaican home-style plates. | | Category → Cook shop | |
| Andy's Restaurant, Jerk & Pastry | Restaurant on Chisholm Avenue for jerk and pastries. | jerk, pastry | Name: drop the "\|" | |
| Andy's Jerk Spot | Jerk spot on Mannings Hill Road. | jerk | | |
| Breadfruit Hut | Bar and grill on Goodwood Terrace. | | | |
| Cafe Dolce | Café on Constant Spring Road. | | | |
| Chef Kiss Ja | Restaurant on Constant Spring Road. | | Name "CHEF KISS Ja" → "Chef Kiss Ja" | |
| Coded Frolic E-Sport Bar & Jerk Lounge | E-sports bar and jerk lounge on South Avenue. | jerk | | |
| Cook Shop (Tavern Avenue) | Cookshop on Tavern Avenue. | | Category → Cook shop | |
| Crepe House | *Held: owner described it as street food (jerk man), but the listing places it in Shop 23 at Devon House. Awaiting confirmation.* | | | |
| Cupcakes By Pastry Passions | Cupcake bakery at the Half Way Tree Transport Centre. | cupcakes | | |
| D'Lux Restaurant & Lounge | Restaurant and lounge on Caledonia Avenue. | | Name: drop the "\|" | |
| Di Lot Restaurant & Bar | Restaurant and bar on Constant Spring Road. | | Name: drop the "\|" | |
| Eleni's Bakery | Bakery in Sovereign North Plaza on Barbican Road. | | Name: drop "Jamaica" | |
| George Cook Shop | Cookshop on Headley Avenue. | | Category → Cook shop | |
| Hamilton Restaurant & Jerk Centre | Restaurant and jerk centre on Burlington Avenue. | jerk | | |
| Ibo Spice Portal | Restaurant on Orange Street, downtown Kingston. | | | |
| Id'cove Catering | Caterer on West Kings House Road. | | Category → Catering | |
| Jack's Bakery | Bakery on Red Hills Road. | | | |
| Janet's Cookshop | Cookshop in Kingston. | | Category → Cook shop | |
| Jerk Box | Jerk spot on Hope Road. | jerk | | |
| Lola's Bakery Café | Bakery café and dessert spot at The Waterloo on Upper Waterloo Road. | desserts | | |
| Macs Eatery | Eatery on Glenlock Terrace. | | | |
| Ming Cuisine | Chinese restaurant in Village Plaza on Constant Spring Road. | | Name: drop "\| Chinese 青花莊" | |
| Molynes Road Jerk Centre | Jerk centre on Gilmour Drive, off Molynes Road. | jerk | Name: capitalise "Centre" | |
| Nicky's Cook Shop | Cookshop on Andrews Pen Lane. | | Category → Cook shop | |
| Pastries By Jan | Pastry shop on Half Way Tree Road. | pastry | | |
| Rotty & Cherry Cook Shop | Cookshop on Stony Hill Road. | | Category → Cook shop | |
| Shaggy Jerk Chicken | Street-side jerk man on Red Hills Road: jerk chicken straight off the drum. | jerk chicken, street food | Category → Street food | Owner: street food (jerk man) |
| Shams Bakery & Mediterranean Cuisine | Bakery and Mediterranean kitchen at the Marketplace on Constant Spring Road. | mediterranean | Address tidy-up | |
| Shand's Cookshop | Cookshop in Kingston. | | Category → Cook shop | |
| Shenequa's Cookshop | Cookshop on Red Hills Road. | | Category → Cook shop | |
| Street Mixovibes | Food spot on Spanish Town Road. | | | |
| Street Swagg Dinner | Dinner spot on Birdsucker Lane. | | | |
| Stylz Jerk Chicken | Jerk chicken spot on White Hall Avenue. | jerk chicken | | |
| Sugar and Spice (Barbican) | Sugar and Spice bakery on Barbican Road. | | Name: drop "Ltd." | |
| Sugar and Spice (Liguanea) | Sugar and Spice bakery on Old Hope Road in Liguanea. | | Name: drop "Ltd." | |
| Sugar and Spice (Red Hills) | Sugar and Spice bakery on Red Hills Road. | | Name: drop "Ltd." | |
| Sweet Mischief | Bakery on Hacienda Way. | | Name: drop "Ja Ltd" | |
| Sweetwood Jerk Joint | Jerk joint on Knutsford Boulevard in New Kingston. | jerk | | |
| The Steak House on the Verandah | Steakhouse at Devon House on Hope Road. | steak | Category → Steakhouse | |
| Totally Delicious Bakery | Bakery on Mannings Hill Road. | | | |
| Trevor's Cook Shop | Cookshop in Kingston. | | Category → Cook shop | |
| Triple Tz Eatery | Eatery on Annette Crescent. | | | |
| Tummy Quest | Restaurant on Grants Pen Road. | | | |
| Uncorked Too | Second Uncorked wine shop and dining room, on Constant Spring Road in Kingston 8. | | Category → Wine bar (Uncorked's own website lists this branch) | |
| World Famous Jerk Food Company | Jerk spot on Graham Heights. | jerk | | |
| Yard Jerk Shop | Jerk shop on Red Hills Road. | jerk | | |

## How it will be applied
Same as batch 1: back up current values, one database transaction, then a cache refresh so the changes show straight away.
