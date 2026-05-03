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

export async function getApprovedCommunityPlaces(existingSlugs: string[]) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("restaurants")
    .select(
      "slug, name, description, parish, area, address, phone, website, price_range, category, image_url, avg_rating, rating_count, positive_comment_count"
    )
    .eq("status", "approved")
    .order("recommendation_score", { ascending: false });

  const existing = new Set(existingSlugs);

  return (data ?? [])
    .filter((restaurant) => !existing.has(restaurant.slug))
    .map((restaurant) => {
      const category = restaurant.category ?? "Community Pick";
      const place: Place = {
        address: restaurant.address ?? "",
        area: restaurant.area ?? "",
        category,
        description: restaurant.description ?? "A community-submitted restaurant awaiting a full WWH review.",
        features: [category, "Community submitted"],
        hours: [],
        image:
          restaurant.image_url ??
          "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
        name: restaurant.name,
        parish: restaurant.parish,
        phone: restaurant.phone ?? "",
        priceRange: restaurant.price_range ?? "$$",
        rating: Number(restaurant.avg_rating),
        reviewCount:
          Number(restaurant.rating_count) + Number(restaurant.positive_comment_count),
        reviews: [],
        slug: restaurant.slug,
        type: "Community Pick",
        website: restaurant.website ?? ""
      };

      return place;
    });
}

export async function getApprovedCommunityPlaceBySlug(slug: string) {
  const places = await getApprovedCommunityPlaces([]);
  return places.find((place) => place.slug === slug) ?? null;
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}
