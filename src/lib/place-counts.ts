import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Central helper for public food spot counts.
 * Uses the same source as /browse — all approved, active restaurants.
 */

const FALLBACK_COUNT = 58;

export async function getPublicFoodSpotCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from("restaurants")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved");

  if (error || count == null) {
    console.warn("Failed to fetch food spot count:", error?.message);
    return FALLBACK_COUNT;
  }

  return count;
}

/**
 * Format a count for public marketing display.
 * - 1K+ for >= 1000
 * - rounded-down hundreds + for >= 100
 * - exact for < 100
 */
export function formatFoodSpotCount(count: number): string {
  if (count >= 1000) return `${Math.floor(count / 100) / 10}K+`;
  if (count >= 100) return `${Math.floor(count / 100) * 100}+`;
  return `${count}`;
}

/**
 * Convenience: fetch and format in one call.
 */
export async function getPublicFoodSpotCountLabel(): Promise<string> {
  const count = await getPublicFoodSpotCount();
  return formatFoodSpotCount(count);
}
