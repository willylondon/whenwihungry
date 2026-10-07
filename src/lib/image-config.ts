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
  return "/logo.png";
}
