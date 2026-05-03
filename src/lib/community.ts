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

function dbRowToPlace(restaurant: Record<string, unknown>): Place {
  const category = (restaurant.category as string) ?? "Community Pick";
  return {
    address: (restaurant.address as string) ?? "",
    area: (restaurant.area as string) ?? "",
    category,
    description:
      (restaurant.description as string) ??
      "A great spot worth checking out.",
    features: [category],
    hours: [],
    image:
      (restaurant.image_url as string) ??
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
    lat: restaurant.latitude as number | undefined,
    lng: restaurant.longitude as number | undefined,
    name: restaurant.name as string,
    parish: restaurant.parish as string,
    phone: (restaurant.phone as string) ?? "",
    priceRange: (restaurant.price_range as string) ?? "$$",
    rating: Number(restaurant.avg_rating) || 0,
    reviewCount:
      Number(restaurant.rating_count) +
      Number(restaurant.positive_comment_count ?? 0),
    reviews: [],
    slug: restaurant.slug as string,
    type: (restaurant.cuisine_type as string) ?? "Restaurant",
    website: (restaurant.website as string) ?? ""
  };
}

export async function getAllApprovedPlaces(): Promise<Place[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("restaurants")
    .select(
      "slug, name, description, parish, area, address, phone, website, price_range, category, image_url, avg_rating, rating_count, positive_comment_count, cuisine_type, latitude, longitude"
    )
    .eq("status", "approved")
    .order("recommendation_score", { ascending: false, nullsFirst: false });

  return (data ?? []).map(dbRowToPlace);
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
