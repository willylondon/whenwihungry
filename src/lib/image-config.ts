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

/** Shown wherever a listing has no usable photo. */
export const PLACEHOLDER_IMAGE = "/logo.png";

/** Our own or restaurant-supplied photos: shown without a third-party credit. */
const OWN_IMAGE_SOURCES = new Set(["whenwihungry", "restaurant supplied", "owner supplied"]);

type ImageRow = { image_url?: unknown; image?: unknown; image_source?: unknown };

/** The image a public listing displays, from an allowed location (otherwise the placeholder). */
export function listingImage(row: ImageRow, supabaseUrl?: string) {
  return catalogImage(row.image_url || row.image, supabaseUrl);
}

/**
 * Who a displayed third-party photo comes from, e.g. "Google". Our own photos need no credit.
 * Imported photos were collected from Google Places; the credit makes that visible to visitors.
 */
export function listingImageCredit(row: ImageRow, supabaseUrl?: string): string | null {
  const image = listingImage(row, supabaseUrl);
  if (!hasListingPhoto(image)) return null;
  const source = typeof row.image_source === "string" ? row.image_source.trim() : "";
  if (OWN_IMAGE_SOURCES.has(source.toLowerCase())) return null;
  try {
    const host = new URL(image).hostname;
    if (host === "images.unsplash.com") return "Unsplash";
    if (host === "images.pexels.com") return "Pexels";
  } catch { /* Local images are ours. */ }
  if (/google/i.test(source)) return "Google";
  return source ? source.slice(0, 40) : "Google";
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
