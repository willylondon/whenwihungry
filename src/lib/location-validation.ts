/**
 * Location / Parish Validation Helpers
 *
 * Used to validate that a place's parish matches the requested location page,
 * and to detect suspicious cross-parish records.
 */

// ── Parish aliases ──────────────────────────────────────────────────

const PARISH_ALIASES: Record<string, string[]> = {
  kingston: [
    "kingston", "st andrew", "st. andrew", "st andrews", "new kingston",
    "half way tree", "halfway tree", "liguanea", "barbican", "constant spring",
    "cross roads", "downtown kingston", "harbour view", "port royal",
    "red hills", "manor park", "papine", "mona", "hope road", "waterloo",
    "spanish town road", "hagley park", "maxfield", "vineyard town",
    "old hope road", "kingston & st. andrew", "kingston and st. andrew"
  ],
  portland: [
    "portland", "port antonio", "boston", "boston bay", "fairy hill",
    "san san", "drapers", "long bay", "manchioneal", "buff bay",
    "hope bay", "winifred beach", "winnifred beach", "frenchman's cove",
    "blue lagoon", "rio grande", "norwich", "st. margaret's bay",
    "st margarets bay"
  ],
  "st james": [
    "st james", "st. james", "montego bay", "mobay", "ironshore",
    "freeport", "hip strip", "gloucester avenue", "rose hall"
  ],
  "st ann": [
    "st ann", "st. ann", "st anns", "ocho rios", "runaway bay",
    "discovery bay", "st ann's bay", "st anns bay", "priory", "mammee bay"
  ],
  westmoreland: [
    "westmoreland", "negril", "savanna-la-mar", "sav-la-mar", "whitehouse"
  ],
  "st elizabeth": [
    "st elizabeth", "st. elizabeth", "black river", "treasure beach",
    "santa cruz", "junction", "malvern"
  ],
  manchester: [
    "manchester", "mandeville", "christiana", "spur tree"
  ],
  "st catherine": [
    "st catherine", "st. catherine", "spanish town", "portmore",
    "old harbour", "linstead", "bog walk"
  ],
  clarendon: [
    "clarendon", "may pen", "lionel town", "chapelton"
  ],
  "st mary": [
    "st mary", "st. mary", "port maria", "oracabessa", "annotto bay", "highgate"
  ],
  hanover: [
    "hanover", "lucea", "green island", "sandy bay"
  ],
  trelawny: [
    "trelawny", "falmouth", "duncans", "rio bueno"
  ],
  "st thomas": [
    "st thomas", "st. thomas", "morant bay", "yallahs", "lyssons", "seaforth"
  ]
};

// ── Normalize ───────────────────────────────────────────────────────

export function normalizeParish(input: string | null | undefined): string {
  const raw = String(input || "").trim().toLowerCase();
  if (!raw) return "";

  for (const [parish, aliases] of Object.entries(PARISH_ALIASES)) {
    if (aliases.includes(raw)) return parish;
  }

  // Fuzzy: check if any alias is contained in the input
  for (const [parish, aliases] of Object.entries(PARISH_ALIASES)) {
    for (const alias of aliases) {
      if (raw.includes(alias)) return parish;
    }
  }

  return raw;
}

// ── Check if area/address belongs to a parish ───────────────────────

function areaMatchesParish(area: string, address: string, parish: string): boolean {
  const combined = `${area} ${address}`.toLowerCase();
  const aliases = PARISH_ALIASES[parish] ?? [];
  return aliases.some((a) => combined.includes(a));
}

// ── Validation result ───────────────────────────────────────────────

export type ValidationResult = {
  valid: boolean;
  confidence: "high" | "medium" | "low";
  reasons: string[];
  suspectedParish?: string;
};

export function validatePlaceParish(place: {
  parish?: string | null;
  area?: string | null;
  address?: string | null;
  name?: string | null;
  manuallyVerified?: boolean | null;
  dataQualityStatus?: string | null;
}): ValidationResult {
  const reasons: string[] = [];
  const parish = normalizeParish(place.parish);
  const area = String(place.area || "").toLowerCase();
  const address = String(place.address || "").toLowerCase();
  const name = String(place.name || "").toLowerCase();

  if (!parish) {
    return { valid: false, confidence: "low", reasons: ["Missing parish"] };
  }

  // Check if area/address confirms the parish
  const areaConfirms = areaMatchesParish(area, address, parish);

  // Check if name/area/address suggests a different parish
  let suspectedParish: string | undefined;
  for (const [otherParish, aliases] of Object.entries(PARISH_ALIASES)) {
    if (otherParish === parish) continue;
    const combined = `${name} ${area} ${address}`;
    for (const alias of aliases) {
      if (alias.length > 4 && combined.includes(alias)) {
        suspectedParish = otherParish;
        reasons.push(`Name/area/address contains "${alias}" which suggests ${otherParish}, not ${parish}`);
        break;
      }
    }
    if (suspectedParish) break;
  }

  if (suspectedParish) {
    return {
      valid: false,
      confidence: "medium",
      reasons,
      suspectedParish
    };
  }

  if (areaConfirms) {
    return { valid: true, confidence: "high", reasons: ["Area/address confirms parish"] };
  }

  return {
    valid: true,
    confidence: area || address ? "medium" : "low",
    reasons: area || address
      ? ["Parish set but area/address does not strongly confirm"]
      : ["Parish set but no area/address for confirmation"]
  };
}

// ── Safe for parish page ────────────────────────────────────────────

export function isPlaceSafeForParishPage(
  place: {
    parish?: string | null;
    area?: string | null;
    address?: string | null;
    name?: string | null;
    manuallyVerified?: boolean | null;
    dataQualityStatus?: string | null;
  },
  requestedParish: string
): boolean {
  const normalized = normalizeParish(requestedParish);
  if (!normalized) return false;

  // Never show rejected records
  if (place.dataQualityStatus === "rejected") return false;

  // Never show needs_review on parish pages unless manually verified
  if (place.dataQualityStatus === "needs_review" && !place.manuallyVerified) return false;

  const placeParish = normalizeParish(place.parish);
  if (!placeParish) return false;

  // Must match the requested parish
  if (placeParish !== normalized) return false;

  // Run validation
  const result = validatePlaceParish(place);
  if (!result.valid) return false;

  return true;
}

// ── Get all known parish names ──────────────────────────────────────

export function getAllParishNames(): string[] {
  return Object.keys(PARISH_ALIASES);
}

// ── Get display name for a parish ───────────────────────────────────

export function getParishDisplayName(parish: string): string {
  const map: Record<string, string> = {
    kingston: "Kingston & St. Andrew",
    portland: "Portland",
    "st james": "St. James",
    "st ann": "St. Ann",
    westmoreland: "Westmoreland",
    "st elizabeth": "St. Elizabeth",
    manchester: "Manchester",
    "st catherine": "St. Catherine",
    clarendon: "Clarendon",
    "st mary": "St. Mary",
    hanover: "Hanover",
    trelawny: "Trelawny",
    "st thomas": "St. Thomas"
  };
  return map[parish] ?? parish;
}
