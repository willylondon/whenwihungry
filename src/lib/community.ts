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

export async function searchRestaurants(query: string): Promise<PlaceV2[]> {
  const supabase = await createSupabaseServerClient();
  const normalized = normalizeQuery(query);

  // 1. Alias Mapping (for language differences)
  const aliasMap: Record<string, string> = {
    "fry chicken": "fried chicken",
    "icecream": "ice cream",
    "curried goat": "curry goat",
    "curry": "curry goat",
    "patty": "patties",
    "jerk centre": "jerk center",
    "ital": "vegan",
    "cook shop": "local food",
    "box food": "lunch",
    "jamaican": "local food",
  };

  const searchQuery = aliasMap[normalized] || normalized;

  // 2. Initial RPC search
  let { data, error } = await supabase.rpc("search_restaurants", {
    search_query: searchQuery
  });

  if (error) {
    console.error("RPC Search Error:", error.message);
  }

  let finalResults: PlaceV2[] = [];

  if (data && data.length > 0) {
    finalResults = data.map((row: any) => ({
      ...dbRowToPlace(row),
      verdict: row.verdict,
      admin_score: row.admin_score,
      community_score: row.community_score,
      reviewCount: Number(row.review_count || 0),
      match_reason: row.match_reason,
      is_verified: row.is_verified,
      final_score: row.final_score
    }));
  }

  // 3. Fallback: If 0 results, expand or broaden
  if (finalResults.length === 0) {
    const categoryMap: Record<string, string> = {
      "jerk": "jerk",
      "seafood": "seafood",
      "curry": "local-food",
      "oxtail": "local-food",
      "jamaican": "local-food",
      "dessert": "dessert",
      "ice cream": "dessert",
    };

    const fallbackCategory = categoryMap[normalized] || categoryMap[searchQuery];
    
    if (fallbackCategory) {
      console.log(`Broadening search for "${normalized}" to category "${fallbackCategory}"`);
      const all = await getAllApprovedPlaces();
      const { getFilteredPlaces } = await import("@/lib/places");
      finalResults = getFilteredPlaces({ category: fallbackCategory }, all as any) as PlaceV2[];
      
      // Update match reason for fallback results
      finalResults = finalResults.map(r => ({
        ...r,
        match_reason: r.match_reason || `Category fallback: ${fallbackCategory}`
      }));
    }
  }

  // 4. Log search attempt (async)
  logSearch(query, normalized, finalResults.length);

  return finalResults;
}

export async function getAllApprovedPlaces(): Promise<PlaceV2[]> {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("restaurants")
    .select(`
      *,
      admin_reviews(verdict, admin_score),
      user_reviews(rating)
    `)
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
      verdict: adminRev?.verdict || row.verdict,
      admin_score: adminRev?.admin_score || row.admin_score,
      community_score: (row.avg_rating || avgCommunity) * 20,
      reviewCount: row.rating_count || userReviews.length,
      is_verified: row.is_verified || row.verified
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
      "slug, name, description, parish, area, address, phone, website, price_range, category, image_url, avg_rating, rating_count, positive_comment_count, cuisine_type, latitude, longitude"
    )
    .eq("slug", slug)
    .eq("status", "approved")
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
