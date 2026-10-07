/** Keep catalog mapping and Next Image's remote allowlist in agreement. */
export function imageHosts(supabaseUrl?: string) {
  const hosts = ["images.unsplash.com", "images.pexels.com"];
  if (supabaseUrl) {
    try {
      const url = new URL(supabaseUrl);
      if (url.protocol === "https:" && /^[a-z0-9]{20}\.supabase\.co$/.test(url.hostname)) hosts.push(url.hostname);
    } catch { /* Invalid database configuration is rejected by supabase/config. */ }
  }
  return hosts;
}

/** Shown wherever a listing has no photo we're entitled to use. */
export const PLACEHOLDER_IMAGE = "/logo.png";

/**
 * Sources we hold rights to. Photos copied from Google Maps/Places belong to their
 * uploaders and may not be re-hosted, so they stay in the database but aren't shown.
 * To show a listing photo, set image_source to one of these (any case).
 */
const CLEARED_IMAGE_SOURCES = new Set(["whenwihungry", "restaurant supplied", "owner supplied"]);
/** Free-licence stock libraries whose terms allow reuse. */
const LICENSED_STOCK_HOSTS = new Set(["images.unsplash.com", "images.pexels.com"]);

export function hasImageRights(source: unknown, url: unknown): boolean {
  if (typeof source === "string" && CLEARED_IMAGE_SOURCES.has(source.trim().toLowerCase())) return true;
  if (typeof url !== "string") return false;
  try { return LICENSED_STOCK_HOSTS.has(new URL(url).hostname); } catch { return false; }
}

/** The image a public listing may display: rights-cleared and from an allowed location. */
export function listingImage(row: { image_url?: unknown; image?: unknown; image_source?: unknown }, supabaseUrl?: string) {
  const url = row.image_url || row.image;
  return hasImageRights(row.image_source, url) ? catalogImage(url, supabaseUrl) : PLACEHOLDER_IMAGE;
}

export function hasListingPhoto(image: string | null | undefined): boolean {
  return Boolean(image) && image !== PLACEHOLDER_IMAGE;
}

/** Our own review photography, shipped with the site under public/images/reviews. */
const EDITORIAL_PHOTO = /^\/images\/reviews\/[a-z0-9-]+\/[a-z0-9-]+\.(?:jpe?g|png|webp)$/;

export function catalogImage(value: unknown, supabaseUrl?: string) {
  if (typeof value === "string" && EDITORIAL_PHOTO.test(value)) return value;
  if (typeof value === "string") {
    try {
      const url = new URL(value);
      if (url.protocol === "https:" && !url.username && !url.password && !url.port && imageHosts(supabaseUrl).includes(url.hostname)) return url.href;
    } catch { /* Missing and unsupported images use the local brand fallback. */ }
  }
  return PLACEHOLDER_IMAGE;
}
