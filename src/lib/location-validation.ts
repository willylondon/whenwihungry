/** Canonical parish keys keep Jamaica's 14 parishes distinct. */
const PARISH_ALIASES: Record<string, string[]> = {
  kingston: ["kingston", "downtown kingston", "port royal", "kingston and st andrew", "kingston & st andrew"],
  "st andrew": ["st andrew", "st andrews", "new kingston", "half way tree", "halfway tree", "liguanea", "barbican", "constant spring", "mona", "papine"],
  portland: ["portland", "port antonio", "boston bay", "fairy hill", "buff bay", "hope bay", "manchioneal"],
  "st james": ["st james", "montego bay", "mobay", "ironshore", "rose hall"],
  "st ann": ["st ann", "st anns", "ocho rios", "runaway bay", "discovery bay", "st anns bay", "priory", "mammee bay"],
  westmoreland: ["westmoreland", "negril", "savanna la mar", "sav la mar", "whitehouse"],
  "st elizabeth": ["st elizabeth", "black river", "treasure beach", "santa cruz", "junction", "malvern"],
  manchester: ["manchester", "mandeville", "christiana", "spur tree"],
  "st catherine": ["st catherine", "spanish town", "portmore", "old harbour", "linstead", "bog walk"],
  clarendon: ["clarendon", "may pen", "lionel town", "chapelton"],
  "st mary": ["st mary", "port maria", "oracabessa", "annotto bay", "highgate"],
  hanover: ["hanover", "lucea", "green island", "sandy bay"],
  trelawny: ["trelawny", "falmouth", "duncans", "rio bueno"],
  "st thomas": ["st thomas", "morant bay", "yallahs", "lyssons", "seaforth"]
};

function normalizeLocationText(value: string): string {
  return value.toLowerCase().trim().replace(/\bsaint\b/g, "st").replace(/[.’']/g, "").replace(/[-_]/g, " ").replace(/\s+/g, " ");
}

export function normalizeParish(input: string | null | undefined): string {
  const raw = normalizeLocationText(input || "").replace(/(?:,?\s+jamaica)?$/, "").replace(/\s+parish$/, "").trim();
  if (!raw) return "";
  return Object.entries(PARISH_ALIASES).find(([, aliases]) => aliases.includes(raw))?.[0] ?? "";
}

export function getAllParishNames(): string[] { return Object.keys(PARISH_ALIASES); }

export function getParishDisplayName(parish: string): string {
  const key = normalizeParish(parish);
  return key ? key.split(" ").map((word) => word === "st" ? "St." : word[0].toUpperCase() + word.slice(1)).join(" ") : parish;
}

/** The Kingston route is a deliberately labelled metro page, not a parish alias. */
export function matchesParish(placeParish: string | null | undefined, requested: string, kingstonMetro = false): boolean {
  const key = normalizeParish(requested);
  const actual = normalizeParish(placeParish);
  return Boolean(key && actual && (actual === key || (kingstonMetro && key === "kingston" && actual === "st andrew")));
}

export type GeographicPlace = {
  country?: string | null;
  country_code?: string | null;
  address?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  lat?: number | null;
  lng?: number | null;
};

/** Exclude only explicit foreign evidence. Missing geography is never invented. */
export function getForeignLocationReasons(place: GeographicPlace): string[] {
  const reasons: string[] = [];
  const country = String(place.country_code || place.country || "").trim().toLowerCase();
  if (country && !["jm", "jam", "jamaica", "unknown", "n/a", "unspecified"].includes(country)) reasons.push("explicit_foreign_country");
  const rawLat = place.latitude ?? place.lat;
  const rawLng = place.longitude ?? place.lng;
  const lat = rawLat == null || String(rawLat).trim() === "" ? NaN : Number(rawLat);
  const lng = rawLng == null || String(rawLng).trim() === "" ? NaN : Number(rawLng);
  // (0,0) is a common missing-coordinate sentinel, not evidence of a foreign listing.
  if (Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0) &&
    (lat < 16.5 || lat > 19 || lng < -79 || lng > -75)) reasons.push("coordinates_outside_jamaica");
  const address = place.address || "";
  if (/\b(?:united states(?: of america)?|united kingdom|canada|england|scotland|wales|ireland|australia|new zealand|trinidad(?: and tobago)?|barbados|(?:U\.?S\.?\s*)?virgin\s*islands|USVI|USA|U\.S\.A\.|UK)\s*(?:\d{5}(?:-\d{4})?)?\s*$/i.test(address) ||
    /,\s*(?:AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC)\s+\d{5}(?:-\d{4})?\b/.test(address) ||
    /,\s*(?:ON|QC|BC|AB|MB|NB|NL|NS|NT|NU|PE|SK|YT)\s+[A-Z]\d[A-Z]\s?\d[A-Z]\d\b/i.test(address)) reasons.push("explicit_foreign_address");
  return reasons;
}

export type ValidationResult = { valid: boolean; confidence: "high" | "medium" | "low"; reasons: string[]; suspectedParish?: string };

type ParishPlace = GeographicPlace & {
  parish?: string | null;
  area?: string | null;
  name?: string | null;
  status?: string | null;
  is_active?: boolean | null;
  manuallyVerified?: boolean | null;
  manually_verified?: boolean | null;
  dataQualityStatus?: string | null;
  data_quality_status?: string | null;
  businessType?: string | null;
  business_type?: string | null;
};

export function validatePlaceParish(place: ParishPlace): ValidationResult {
  const parish = normalizeParish(place.parish);
  if (!parish) return { valid: false, confidence: "low", reasons: ["Missing or unknown parish"] };
  const foreign = getForeignLocationReasons(place);
  if (foreign.length) return { valid: false, confidence: "high", reasons: foreign };
  const areaParish = normalizeParish(place.area);
  // Kingston and St. Andrew share metropolitan addresses. Restaurant names are not location evidence.
  if (areaParish && areaParish !== parish && !(["kingston", "st andrew"].includes(areaParish) && ["kingston", "st andrew"].includes(parish))) {
    return { valid: false, confidence: "medium", reasons: ["Area suggests a different parish"], suspectedParish: areaParish };
  }
  return { valid: true, confidence: areaParish === parish ? "high" : (place.area || place.address ? "medium" : "low"), reasons: [areaParish === parish ? "Area confirms parish" : "Parish set; address not independently verified"] };
}

export function isPlaceSafeForParishPage(place: ParishPlace, requestedParish: string): boolean {
  if (!matchesParish(place.parish, requestedParish, true)) return false;
  if (place.status != null && place.status !== "approved") return false;
  if (place.is_active === false) return false;
  const quality = place.data_quality_status ?? place.dataQualityStatus;
  if (quality === "rejected" || (quality === "needs_review" && !(place.manually_verified ?? place.manuallyVerified))) return false;
  if ((place.business_type ?? place.businessType) === "not_food") return false;
  return validatePlaceParish(place).valid;
}
