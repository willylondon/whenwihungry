# Place Description Audit Report

**Generated**: 2026-05-05T22:30:35.908Z

## Summary

| Metric | Count |
|--------|-------|
| Total records | 463 |
| Records with description | 463 |
| Records with parish/description conflict | 30 |

## Conflicted Records

These records have a `description` that mentions location terms belonging to a different parish than the stored `parish` field. This is the signature of import contamination — the description was written for a different location than where the restaurant actually is.

**Fix**: Update descriptions to be parish-neutral or reflect the correct stored parish. Never change `parish` based on the description — `parish` is source of truth.

### Andy's | Restaurant, Jerk & Pastry (`andys-restaurant-jerk-and-pastry`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"st. ann"` → suggests parish `st ann`
- **Current description**:

  > Authentic jerk cooked over pimento wood in St. Ann. If you want real Jamaican jerk, this is where you go.

### Andy's Jerk spot (`andys-jerk-spot`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"st. ann"` → suggests parish `st ann`
- **Current description**:

  > Authentic jerk cooked over pimento wood in St. Ann. If you want real Jamaican jerk, this is where you go.

### Beachview restaurant and bar (`beachview-restaurant-and-bar`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"westmoreland"` → suggests parish `westmoreland`
- **Current description**:

  > Local dining spot in Westmoreland. A place worth knowing about.

### Breadfruit Hut (`breadfruit-hut`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"st. mary"` → suggests parish `st mary`
- **Current description**:

  > Cold drinks, hot food, good vibes in St. Mary. The kind of spot where locals hang out.

### CHEF KISS Ja (`chef-kiss-ja`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"st. mary"` → suggests parish `st mary`
- **Current description**:

  > Local dining spot in St. Mary. A place worth knowing about.

### Clubhouse Brewery (`clubhouse-brewery`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"st. mary"` → suggests parish `st mary`
- **Current description**:

  > Cold drinks, hot food, good vibes in St. Mary. The kind of spot where locals hang out.

### Coded Frolic E-Sport Bar & Jerk Lounge (`coded-frolic-e-sport-bar-and-jerk-lounge`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"st. ann"` → suggests parish `st ann`
- **Current description**:

  > Authentic jerk cooked over pimento wood in St. Ann. If you want real Jamaican jerk, this is where you go.

### Dragon Garden Restaurant | Chinese (`dragon-garden-restaurant-chinese`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"st. thomas"` → suggests parish `st thomas`
- **Current description**:

  > Chinese and Jamaican-Chinese fusion in St. Thomas. Quick, flavourful, and filling.

### Ena Jamaica Restaurant (`ena-jamaica-restaurant`)

- **Stored parish**: St. James (normalized: `st james`)
- **Conflicting keywords**:
  - `"hanover"` → suggests parish `hanover`
- **Current description**:

  > Local dining spot in Hanover. A place worth knowing about.

### Far Out Fish Hut Ltd (`far-out-fish-hut-ltd`)

- **Stored parish**: St. James (normalized: `st james`)
- **Conflicting keywords**:
  - `"trelawny"` → suggests parish `trelawny`
- **Current description**:

  > Cold drinks, hot food, good vibes in Trelawny. The kind of spot where locals hang out.

### Hamilton Restaurant & Jerk Centre (`hamilton-restaurant-and-jerk-centre`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"st. ann"` → suggests parish `st ann`
- **Current description**:

  > Authentic jerk cooked over pimento wood in St. Ann. If you want real Jamaican jerk, this is where you go.

### House Boat Grill Restaurant (`house-boat-grill-restaurant`)

- **Stored parish**: St. James (normalized: `st james`)
- **Conflicting keywords**:
  - `"hanover"` → suggests parish `hanover`
- **Current description**:

  > Cold drinks, hot food, good vibes in Hanover. The kind of spot where locals hang out.

### LEE'S POTS MONTEGO BAY (`lees-pots-montego-bay`)

- **Stored parish**: St. James (normalized: `st james`)
- **Conflicting keywords**:
  - `"hanover"` → suggests parish `hanover`
- **Current description**:

  > Local dining spot in Hanover. A place worth knowing about.

### Macau Gaming Lounge & Bar (`macau-gaming-lounge-and-bar`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"st. mary"` → suggests parish `st mary`
- **Current description**:

  > Cold drinks, hot food, good vibes in St. Mary. The kind of spot where locals hang out.

### Ming Cuisine | Chinese 青花莊 (`ming-cuisine-chinese`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"hanover"` → suggests parish `hanover`
- **Current description**:

  > Chinese and Jamaican-Chinese fusion in Hanover. Quick, flavourful, and filling.

### Molynes Road Jerk centre (`molynes-road-jerk-centre`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"st. ann"` → suggests parish `st ann`
- **Current description**:

  > Authentic jerk cooked over pimento wood in St. Ann. If you want real Jamaican jerk, this is where you go.

### Office of Nature (`office-of-nature`)

- **Stored parish**: Westmoreland (normalized: `westmoreland`)
- **Conflicting keywords**:
  - `"hanover"` → suggests parish `hanover`
- **Current description**:

  > Local dining spot in Hanover. A place worth knowing about.

### Pepper's Jerk Center (`peppers-jerk-center`)

- **Stored parish**: Trelawny (normalized: `trelawny`)
- **Conflicting keywords**:
  - `"st. james"` → suggests parish `st james`
- **Current description**:

  > Authentic jerk cooked over pimento wood in St. James. If you want real Jamaican jerk, this is where you go.

### Quick Chick (`quick-chick`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"hanover"` → suggests parish `hanover`
- **Current description**:

  > Quick takeaway meals in Hanover. Good food to go when you're on the move.

### Rainforest Seafoods (`rainforest-seafoods`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"st. elizabeth"` → suggests parish `st elizabeth`
- **Current description**:

  > Fresh seafood served right in St. Elizabeth. A must-stop for fish, lobster, and everything from the sea.

### Shaggy Jerk Chicken (`shaggy-jerk-chicken`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"st. ann"` → suggests parish `st ann`
- **Current description**:

  > Authentic jerk cooked over pimento wood in St. Ann. If you want real Jamaican jerk, this is where you go.

### Stylz Jerk Chicken (`stylz-jerk-chicken`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"st. ann"` → suggests parish `st ann`
- **Current description**:

  > Authentic jerk cooked over pimento wood in St. Ann. If you want real Jamaican jerk, this is where you go.

### Sweetwood Jerk Joint (`sweetwood-jerk-joint`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"st. ann"` → suggests parish `st ann`
- **Current description**:

  > Authentic jerk cooked over pimento wood in St. Ann. If you want real Jamaican jerk, this is where you go.

### Tony’s Seafood Bar & Grill (`tony-s-seafood-bar-and-grill`)

- **Stored parish**: St. Catherine (normalized: `st catherine`)
- **Conflicting keywords**:
  - `"westmoreland"` → suggests parish `westmoreland`
- **Current description**:

  > Fresh seafood served right in Westmoreland. A must-stop for fish, lobster, and everything from the sea.

### Tummy Quest (`tummy-quest`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"st. mary"` → suggests parish `st mary`
- **Current description**:

  > Local dining spot in St. Mary. A place worth knowing about.

### Usain Bolt's Tracks & Records (`usain-bolts-tracks-and-records`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"st. catherine"` → suggests parish `st catherine`
- **Current description**:

  > Local dining spot in St. Catherine. A place worth knowing about.

### Whitney's kitchen Limited (`whitneys-kitchen-limited`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"st. mary"` → suggests parish `st mary`
- **Current description**:

  > Local dining spot in St. Mary. A place worth knowing about.

### Willy's Thatch Roof & Cool Out Spot Ltd (`willys-thatch-roof-and-cool-out-spot-ltd`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"st. catherine"` → suggests parish `st catherine`
- **Current description**:

  > Real Jamaican cooking in St. Catherine. No frills, just good food the way it should be.

### World Famous Jerk Food Company (`world-famous-jerk-food-company`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"st. ann"` → suggests parish `st ann`
- **Current description**:

  > Authentic jerk cooked over pimento wood in St. Ann. If you want real Jamaican jerk, this is where you go.

### Yard Jerk Shop (`yard-jerk-shop`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"st. ann"` → suggests parish `st ann`
- **Current description**:

  > Authentic jerk cooked over pimento wood in St. Ann. If you want real Jamaican jerk, this is where you go.

