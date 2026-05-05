# Place Description Audit Report

**Generated**: 2026-05-05T21:54:47.043Z

## Summary

| Metric | Count |
|--------|-------|
| Total records | 463 |
| Records with description | 463 |
| Records with parish/description conflict | 10 |

## Conflicted Records

These records have a `description` that mentions location terms belonging to a different parish than the stored `parish` field. This is the signature of import contamination — the description was written for a different location than where the restaurant actually is.

**Fix**: Update descriptions to be parish-neutral or reflect the correct stored parish. Never change `parish` based on the description — `parish` is source of truth.

### 22 Jerk Plus (`22-jerk-plus`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"portland"` → suggests parish `portland`
- **Current description**:

  > Cold drinks, hot food, good vibes in Portland. The kind of spot where locals hang out.

### Cafe Dolce (`cafe-dolce`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"portland"` → suggests parish `portland`
- **Current description**:

  > Quality coffee and light bites in Portland. A solid spot to recharge.

### Id'cove catering (`idcove-catering`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"portland"` → suggests parish `portland`
- **Current description**:

  > Local dining spot in Portland. A place worth knowing about.

### Jamaica Liquor Warehouse (`jamaica-liquor-warehouse`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"portland"` → suggests parish `portland`
- **Current description**:

  > Cold drinks, hot food, good vibes in Portland. The kind of spot where locals hang out.

### Jerk Box (`jerk-box`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"portland"` → suggests parish `portland`
- **Current description**:

  > Authentic jerk cooked over pimento wood in Portland. If you want real Jamaican jerk, this is where you go.

### King Janga Seafood Lounge (`king-janga-seafood-lounge`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"portland"` → suggests parish `portland`
- **Current description**:

  > Fresh seafood served right in Portland. A must-stop for fish, lobster, and everything from the sea.

### Kingston Jerk (`kingston-jerk`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"portland"` → suggests parish `portland`
- **Current description**:

  > Authentic jerk cooked over pimento wood in Portland. If you want real Jamaican jerk, this is where you go.

### Market Place (`market-place`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"portland"` → suggests parish `portland`
- **Current description**:

  > Local dining spot in Portland. A place worth knowing about.

### Susie's (`susies`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"portland"` → suggests parish `portland`
- **Current description**:

  > Quality coffee and light bites in Portland. A solid spot to recharge.

### Triple Tz Eatery (`triple-tz-eatery`)

- **Stored parish**: Kingston (normalized: `kingston`)
- **Conflicting keywords**:
  - `"portland"` → suggests parish `portland`
- **Current description**:

  > Local dining spot in Portland. A place worth knowing about.

