/** Deployment configuration must be explicit. Never fall back to a shared project. */
export function readSupabaseConfig(env: Record<string, string | undefined>) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for this environment.");
  }
  let parsed: URL;
  try { parsed = new URL(url); } catch {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must be a valid HTTP(S) URL.");
  }
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
  if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && local)) {
    throw new Error("Supabase must use HTTPS, except for an explicit local development server.");
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error("Supabase URL must not include credentials, query parameters or a fragment.");
  }
  return { url: parsed.origin, anonKey };
}

const config = readSupabaseConfig({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
});
export const supabaseUrl = config.url;
export const supabaseAnonKey = config.anonKey;
