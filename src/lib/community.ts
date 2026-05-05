import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Place } from "@/data/places";

export type CommunityRestaurant = {
  id: string;
  slug: string;
  avg_rating: number;
  rating_count: number;
  positive_comment_count: number;
  recommendation_score: number;
};

export type CommunityComment = {
  id: string;
  body: string;
  created_at: string;
};

export async function getCommunityRestaurant(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("restaurants")
    .select("id, slug, avg_rating, rating_count, positive_comment_count, recommendation_score")
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();

  return data as CommunityRestaurant | null;
}

export async function getCommunityComments(restaurantId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("restaurant_comments")
    .select("id, body, created_at")
    .eq("restaurant_id", restaurantId)
    .eq("status", "visible")
    .order("created_at", { ascending: false })
    .limit(12);

  return (data ?? []) as CommunityComment[];
}

export function dbRowToPlace(restaurant: Record<string, any>): Place {
  if (!restaurant) return {} as Place;
  
  const category = restaurant.category || restaurant.cuisine_type || restaurant.cuisine || "Community Pick";
  return {
    address: restaurant.address || "",
    area: restaurant.area || restaurant.city || "",
    category: String(category),
    description: restaurant.description || "The food speaks for itself.",
    features: [],
    hours: [],
    image: restaurant.image_url || "https://whenwihungry.vercel.app/logo.png",
    lat: restaurant.latitude || restaurant.lat || 0,
    lng: restaurant.longitude || restaurant.lng || 0,
    name: restaurant.name || "Unknown Spot",
    parish: restaurant.parish || "Jamaica",
    phone: restaurant.phone || "",
    priceRange: "$".repeat(Math.max(1, Math.min(4, Number(restaurant.price_level || 2)))),
    rating: restaurant.avg_rating || Number(restaurant.admin_score || restaurant.rating || 0) / 20 || 0,
    reviewCount: restaurant.rating_count || restaurant.review_count || restaurant.reviewCount || 0,
    reviews: [],
    slug: restaurant.slug || String(Math.random()),
    type: restaurant.cuisine_type || restaurant.cuisine || "Restaurant",
    website: ""
  };
}

export async function getUserRole(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return data?.role ?? null;
}

export type PlaceV2 = Place & {
  verdict?: string;
  admin_score?: number;
  community_score?: number;
  match_reason?: string;
  is_verified?: boolean;
  final_score?: number;
  has_critic_review?: boolean;
  public_listing_summary?: string | null;
  public_rating?: number | null;
  public_review_count?: number | null;
  review_status?: string | null;
  source_status?: string | null;
};

function normalizeQuery(q: string): string {
  return q
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove punctuation
    .replace(/-/g, " "); // handle hyphens
}

async function logSearch(query: string, normalized: string, count: number) {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.from("search_logs").insert({
      query,
      normalized_query: normalized,
      result_count: count
    });
  } catch (err) {
    console.error("Failed to log search:", err);
  }
}

// Synonyms to try when primary search returns few results.
// Values are additional terms to search, not replacements.
const SEARCH_SYNONYMS: Record<string, string[]> = {
  "curry":       ["curry goat", "curried goat", "curry chicken"],
  "fry chicken": ["fried chicken", "chicken"],
  "fried chicken": ["fry chicken", "chicken"],
  "icecream":    ["ice cream", "dessert"],
  "i scream":    ["ice cream", "dessert"],
  "patty":       ["patties", "beef patty"],
  "patties":     ["patty", "beef patty", "juici", "tastee"],
  "oxtail":      ["ox tail", "stew", "local food"],
  "ox tail":     ["oxtail", "stew"],
  "jerk centre": ["jerk"],
  "jerk center": ["jerk"],
  "seafood":     ["fish", "lobster", "shrimp", "conch"],
  "fish":        ["seafood", "steam fish", "fried fish"],
  "steam fish":  ["steamed fish", "seafood"],
  "burger":      ["burgers", "beef burger"],
  "pizza":       ["italian"],
  "date night":  ["fine dining", "romantic", "upscale"],
  "cheap food":  ["budget", "cook shop"],
  "cheap eats":  ["budget", "cook shop"],
  "ital":        ["vegan", "vegetarian"],
  "box food":    ["lunch", "cook shop"],
};

function rpcRowToPlaceV2(row: any): PlaceV2 {
  return {
    ...dbRowToPlace(row),
    verdict: row.verdict ?? undefined,
    admin_score: row.admin_score,
    community_score: row.community_score,
    reviewCount: Number(row.review_count || 0),
    match_reason: row.match_reason,
    is_verified: row.is_verified,
    final_score: row.final_score,
    has_critic_review: Boolean(row.verdict)
  };
}

export async function searchRestaurants(query: string): Promise<PlaceV2[]> {
  const supabase = await createSupabaseServerClient();
  const normalized = normalizeQuery(query);

  // Layer 1: RPC search on the normalized query
  const { data: primaryData, error } = await supabase.rpc("search_restaurants", {
    search_query: normalized
  });
  if (error) console.error("RPC Search Error:", error.message);

  const seen = new Set<string>();
  let finalResults: PlaceV2[] = [];

  for (const row of primaryData || []) {
    seen.add(row.slug || row.id);
    finalResults.push(rpcRowToPlaceV2(row));
  }

  // Layer 2: Synonym expansion — run if primary returned fewer than 5 results
  if (finalResults.length < 5 && SEARCH_SYNONYMS[normalized]) {
    for (const synonym of SEARCH_SYNONYMS[normalized]) {
      const { data: synData } = await supabase.rpc("search_restaurants", { search_query: synonym });
      for (const row of synData || []) {
        const key = row.slug || row.id;
        if (!seen.has(key)) {
          seen.add(key);
          finalResults.push({ ...rpcRowToPlaceV2(row), match_reason: row.match_reason || `Related: ${synonym}` });
        }
      }
    }
  }

  // Layer 3: Client-side word fallback — only if still empty
  if (finalResults.length === 0) {
    const all = await getAllApprovedPlaces();
    const words = normalized.split(/\s+/).filter(w => w.length > 2);
    for (const place of all) {
      const text = [place.name, place.description, place.category, place.type, place.parish, place.area]
        .filter(Boolean).join(" ").toLowerCase();
      if (words.some(w => text.includes(w))) {
        finalResults.push({ ...place, match_reason: place.match_reason || "Closest match" });
      }
    }
  }

  logSearch(query, normalized, finalResults.length);
  return finalResults;
}

export async function getAllApprovedPlaces(): Promise<PlaceV2[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("restaurants")
    .select(`
      *,
      admin_reviews(verdict, admin_score, honest_take, headline),
      user_reviews(rating)
    `)
    .eq("status", "approved")
    .neq("data_quality_status", "rejected")
    .neq("business_type", "not_food")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch Error:", error);
    return [];
  }

  return (data ?? []).map((row: any) => {
    const adminRev = Array.isArray(row.admin_reviews) ? row.admin_reviews[0] : row.admin_reviews;
    const userReviews = row.user_reviews || [];
    const avgCommunity = userReviews.length > 0 
      ? userReviews.reduce((acc: number, cur: any) => acc + (cur.rating || 0), 0) / userReviews.length 
      : 0;

    return {
      ...dbRowToPlace(row),
      verdict: adminRev?.verdict ?? undefined,
      admin_score: adminRev?.admin_score || row.admin_score,
      community_score: (row.avg_rating || avgCommunity) * 20,
      reviewCount: row.rating_count || userReviews.length,
      is_verified: row.is_verified || row.verified,
      has_critic_review: Boolean(adminRev?.verdict && (adminRev?.honest_take?.trim() || adminRev?.headline?.trim()))
    };
  });
}

export async function getApprovedCommunityPlaces(existingSlugs: string[]) {
  const all = await getAllApprovedPlaces();
  const existing = new Set(existingSlugs);
  return all.filter((place) => !existing.has(place.slug));
}

export async function getApprovedCommunityPlaceBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("restaurants")
    .select(
      "slug, name, description, parish, area, address, phone, website, price_range, category, image_url, avg_rating, rating_count, positive_comment_count, cuisine_type, latitude, longitude, data_quality_status, business_type"
    )
    .eq("slug", slug)
    .eq("status", "approved")
    .neq("data_quality_status", "rejected")
    .neq("business_type", "not_food")
    .maybeSingle();

  return data ? dbRowToPlace(data as Record<string, unknown>) : null;
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}
