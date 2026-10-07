const DEFAULT_SITE_URL = "https://whenwihungry.vercel.app";

/** One explicit, trusted origin for metadata and authentication redirects. */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  const url = new URL(configured);
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/" ||
      (url.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && local && url.protocol === "http:"))) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTPS origin (HTTP localhost is allowed in development).");
  }
  return url.origin;
}

export function siteUrl(path = "/"): string {
  return new URL(path, `${getSiteUrl()}/`).toString();
}
