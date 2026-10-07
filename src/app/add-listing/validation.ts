import { getFormString } from "@/lib/validation";

export const PARISHES = ["Kingston", "St. Andrew", "St. Catherine", "St. James", "St. Ann", "Portland", "Manchester", "Clarendon", "Westmoreland", "St. Elizabeth", "Hanover", "Trelawny", "St. Mary", "St. Thomas"] as const;
export const LISTING_CATEGORIES = ["Jerk", "Cook Shop", "Lunch Run", "Seafood", "Patties", "Date Night", "Cheap Eats", "Late Night"] as const;

export function textField(form: FormData, key: string, max: number, min = 0) {
  const raw = form.get(key);
  if (raw !== null && typeof raw !== "string") throw new Error(`Invalid ${key}`);
  const value = getFormString(form, key);
  if (value.length < min || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) throw new Error(`Invalid ${key}`);
  return value;
}

export function optionalHttpUrl(value: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error();
    return url.href;
  } catch { throw new Error("Use a valid http or https URL"); }
}

export function priceFromRange(value: string) {
  if (!value) return { price_range: null, price_level: null };
  if (!/^\${1,4}$/.test(value)) throw new Error("Invalid price");
  return { price_range: value, price_level: value.length };
}

export function parseListing(form: FormData) {
  const name = textField(form, "name", 160, 2);
  const parish = textField(form, "parish", 50, 1);
  const category = textField(form, "category", 80, 1);
  if (!(PARISHES as readonly string[]).includes(parish) || !(LISTING_CATEGORIES as readonly string[]).includes(category)) throw new Error("Invalid parish or category");
  const social = (key: string) => {
    const value = textField(form, key, 300);
    if (!value) return null;
    if (/^@?[\w.]{1,80}$/.test(value)) return value;
    const url = optionalHttpUrl(value)!;
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    if (key === "instagram" ? host !== "instagram.com" : !["tiktok.com", "vm.tiktok.com", "vt.tiktok.com"].includes(host)) throw new Error("Invalid social link");
    return url;
  };
  return {
    name, parish, category,
    area: textField(form, "area", 160) || null,
    description: textField(form, "description", 500, 10),
    address: textField(form, "address", 300) || null,
    phone: textField(form, "phone", 40) || null,
    website: optionalHttpUrl(textField(form, "website", 2048)),
    instagram: social("instagram"), tiktok: social("tiktok"),
    ...priceFromRange(textField(form, "priceRange", 4))
  };
}
