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

function dbRowToPlace(restaurant: Record<string, any>): Place {
  const category = restaurant.cuisine || restaurant.category || "Community Pick";
  return {
    address: restaurant.address || "",
    area: restaurant.city || restaurant.area || "",
    category,
    description: restaurant.description || "The food speaks for itself.",
    features: [],
    hours: [],
    image: restaurant.image_url || "https://whenwihungry.vercel.app/logo.png",
    lat: restaurant.latitude || restaurant.lat,
    lng: restaurant.longitude || restaurant.lng,
    name: restaurant.name,
    parish: restaurant.parish,
    phone: restaurant.phone || "",
    priceRange: "$".repeat(restaurant.price_level || 2),
    rating: Number(restaurant.admin_score) / 20 || 0, // Mock rating from score
    reviewCount: 0,
    reviews: [],
    slug: restaurant.slug,
    type: restaurant.cuisine || "Restaurant",
    website: ""
  };
}

export type PlaceV2 = Place & {
  verdict?: string;
  admin_score?: number;
  community_score?: number;
  match_reason?: string;
  is_verified?: boolean;
};

export async function searchRestaurants(query: string): Promise<PlaceV2[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("search_restaurants", {
    search_query: query
  });

  if (error) {
    console.error("Search error:", error);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    ...dbRowToPlace(row),
    verdict: row.verdict,
    admin_score: row.admin_score,
    community_score: row.community_score,
    match_reason: row.match_reason,
    is_verified: row.is_verified
  }));
}

export async function getAllApprovedPlaces(): Promise<PlaceV2[]> {
  const supabase = await createSupabaseServerClient();
  
  // Fetch everything needed for V2 display
  const { data } = await supabase
    .from("restaurants")
    .select(`
      *,
      admin_reviews(verdict, admin_score),
      user_reviews(rating)
    `)
    .order("created_at", { ascending: false });

  return (data ?? []).map((row: any) => {
    const adminRev = row.admin_reviews?.[0];
    const userReviews = row.user_reviews || [];
    const avgCommunity = userReviews.length > 0 
      ? userReviews.reduce((acc: number, cur: any) => acc + cur.rating, 0) / userReviews.length 
      : 0;

    return {
      ...dbRowToPlace(row),
      verdict: adminRev?.verdict,
      admin_score: adminRev?.admin_score,
      community_score: avgCommunity * 20, // Normalize to 100
      reviewCount: userReviews.length,
      is_verified: row.is_verified
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

export async function getUserRole() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return data?.role ?? null;
}
