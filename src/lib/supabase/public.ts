import { createClient } from "@supabase/supabase-js";

import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

/**
 * Anonymous, cookie-free client for public catalog reads.
 * It never sees a visitor's session, so its results are safe to share in the
 * cache, and reading it does not force a page into per-request rendering.
 */
export function createSupabasePublicClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}
