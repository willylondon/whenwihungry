/**
 * Safe description helper.
 *
 * Returns the record's description if it appears clean, or a neutral
 * fallback constructed from category + parish when the stored description
 * shows signs of import contamination (describes a different location).
 */

import { normalizeParish } from "@/lib/location-validation";

// ── Location keywords that signal cross-parish contamination ─────────
// Keyed by canonical parish name; values are distinctive location terms.

const PARISH_KEYWORDS: Record<string, string[]> = {
  portland: [
    "portland", "port antonio", "boston beach", "boston bay", "fairy hill",
    "san san", "drapers", "long bay", "manchioneal", "buff bay", "hope bay",
    "frenchman's cove", "frenchmans cove", "blue lagoon", "rio grande",
    "winifred beach", "winnifred beach", "st. margaret's bay", "rio grande valley"
  ],
  kingston: [
    "new kingston", "halfway tree", "half way tree", "liguanea", "barbican",
    "constant spring", "downtown kingston", "harbour view", "port royal",
    "red hills", "manor park", "papine", "mona"
  ],
  "st james": [
    "st. james", "st james", "saint james",
    "montego bay", "mobay", "ironshore", "freeport", "hip strip",
    "gloucester avenue", "rose hall"
  ],
  "st ann": [
    "st. ann", "st ann", "saint ann",
    "ocho rios", "runaway bay", "discovery bay", "priory", "mammee bay"
  ],
  westmoreland: [
    "westmoreland",
    "negril", "savanna-la-mar", "sav-la-mar", "whitehouse"
  ],
  "st elizabeth": [
    "st. elizabeth", "st elizabeth", "saint elizabeth",
    "black river", "treasure beach", "santa cruz", "junction", "malvern"
  ],
  manchester: [
    "manchester",
    "mandeville", "christiana", "spur tree"
  ],
  "st catherine": [
    "st. catherine", "st catherine", "saint catherine",
    "spanish town", "portmore", "old harbour", "linstead", "bog walk"
  ],
  clarendon: [
    "clarendon",
    "may pen", "lionel town", "chapelton"
  ],
  "st mary": [
    "st. mary", "st mary", "saint mary",
    "port maria", "oracabessa", "annotto bay", "highgate"
  ],
  hanover: [
    "hanover",
    "lucea", "green island", "sandy bay"
  ],
  trelawny: [
    "trelawny",
    "falmouth", "duncans", "rio bueno"
  ],
  "st thomas": [
    "st. thomas", "st thomas", "saint thomas",
    "morant bay", "yallahs", "lyssons", "seaforth"
  ]
};

function hasDescriptionConflict(description: string, storedParish: string): boolean {
  if (!description) return false;
  const desc = description.toLowerCase();
  const normalStored = normalizeParish(storedParish);

  for (const [parish, keywords] of Object.entries(PARISH_KEYWORDS)) {
    if (parish === normalStored) continue;
    for (const kw of keywords) {
      const re = new RegExp(
        `\\b${kw.replace(/[-']/g, ".?").replace(/\s+/g, "\\s+")}\\b`,
        "i"
      );
      if (re.test(desc)) return true;
    }
  }

  return false;
}

type PlaceForDescription = {
  description?: string | null;
  parish?: string | null;
  area?: string | null;
  category?: string | null;
  name?: string | null;
};

/**
 * Returns a display-safe description for a place.
 *
 * - If the description looks clean (no conflicting location terms), returns it as-is.
 * - If contaminated, returns a neutral fallback built from category + parish.
 * - If description is missing or generic, returns the fallback.
 */
export function getSafePlaceDescription(place: PlaceForDescription): string {
  const description = (place.description || "").trim();
  const parish = place.parish || "";
  const area = place.area || "";
  const category = place.category || "food spot";
  const location = area || parish || "Jamaica";

  const isGeneric =
    !description ||
    description === "The food speaks for itself." ||
    description.length < 20;

  if (!isGeneric && !hasDescriptionConflict(description, parish)) {
    return description;
  }

  // Neutral fallback — no location-specific claims
  return `${category} in ${location}. Listed on WhenWiHungry.`;
}

/**
 * Returns true if the stored description contains cross-parish location terms.
 * Use for audit reporting or conditional UI warnings.
 */
export function descriptionHasConflict(place: PlaceForDescription): boolean {
  const description = (place.description || "").trim();
  if (!description) return false;
  return hasDescriptionConflict(description, place.parish || "");
}
