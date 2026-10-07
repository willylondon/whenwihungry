import { cache } from "react";
import { unstable_cache } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { CATALOG_CACHE_TAG } from "@/lib/cache-tags";
import { listingImage, listingImageCredit } from "@/lib/image-config";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Place } from "@/data/places";
import { getPublishedCriticReview, getReviewVideoUrl, getTikTokContactUrl, safeWebUrl, validReviewDate } from "@/lib/place-status";
import { getPublicExclusionReasons } from "@/lib/place-visibility";
import { buildRestaurantSearchDocument, rankPlacesForQuery, type RestaurantSearchDocument } from "@/lib/search/engine";
import { normalizeSearchQuery } from "@/lib/search/helpers";

type Row = Record<string, any>;
type Supabase = SupabaseClient<any, any, any>;

export type PlaceV2 = Place & {
  id?: string;
  verdict?: string;
  critic_verdict?: string;
  headline?: string;
  honest_take?: string;
  critic_review_body?: string;
  reviewed_at?: string;
  published_at?: string;
  visited_at?: string;
  visit_date?: string;
  created_at?: string;
  admin_score?: number;
  community_score?: number;
  community_rating: number | null;
  community_review_count: number;
  rating_source: "community" | "public" | null;
  match_reason?: string;
  is_verified?: boolean;
  final_score?: number;
  has_critic_review?: boolean;
  public_listing_summary?: string | null;
  public_rating?: number | null;
  public_review_count?: number | null;
  public_rating_source?: string | null;
  review_status?: string | null;
  source_status?: string | null;
  tiktok_profile_url?: string;
  price_needs_confirmation?: boolean;
  tiktok_url?: string;
  review_video_url?: string;
  status?: string | null;
  is_active?: boolean | null;
  data_quality_status?: string | null;
  business_type?: string | null;
  manually_verified?: boolean | null;
  country?: string | null;
  country_code?: string | null;
  search_document?: RestaurantSearchDocument;
  /** Third-party source of the listing photo, shown as "Photo: …". */
  image_credit?: string | null;
  /** Google Maps place id, used only to build links to Google Maps. */
  google_place_id?: string | null;
};

/** A catalog outage is different from a successful empty result or a missing slug. */
export class CatalogUnavailableError extends Error {
  readonly operation: string;
  constructor(operation: string, cause?: unknown) {
    super("Restaurant information is temporarily unavailable.", { cause });
    this.name = "CatalogUnavailableError";
    this.operation = operation;
  }
}

const PAGE_SIZE = 200;
const MAX_ROWS = 50_000;
const QUERY_TIMEOUT_MS = 8_000;
const PUBLIC_SELECT = "*, admin_reviews(*)";
/** Editorial writes expire the tag immediately; this is only the fallback refresh. */
const CATALOG_REVALIDATE_SECONDS = 3600;

function reportUnavailable(operation: string, cause: unknown): never {
  // Do not log queries, personal data or provider error details to public server logs.
  console.error("catalog_unavailable", { operation });
  throw cause instanceof CatalogUnavailableError ? cause : new CatalogUnavailableError(operation, cause);
}

/** Public catalog reads are anonymous so they can be shared and cached across visitors. */
function getClient(operation: string): Supabase {
  try { return createSupabasePublicClient(); }
  catch (cause) { return reportUnavailable(operation, cause); }
}

/** Exact counts let pagination detect a lower-than-requested PostgREST row cap. */
async function readAllPages(makeQuery: (from: number, to: number) => any, operation: string): Promise<Row[]> {
  const rows: Row[] = [];
  const started = Date.now();
  for (let page = 0; page < MAX_ROWS; page++) {
    if (Date.now() - started > 20_000) return reportUnavailable(operation, new Error("Catalog read exceeded time budget"));
    let response;
    try { response = await makeQuery(rows.length, rows.length + PAGE_SIZE - 1).abortSignal(AbortSignal.timeout(QUERY_TIMEOUT_MS)); }
    catch (cause) { return reportUnavailable(operation, cause); }
    const { data, error, count } = response;
    if (error || !Array.isArray(data) || !Number.isInteger(count) || count < 0 || count > MAX_ROWS) {
      return reportUnavailable(operation, error ?? new Error("Incomplete catalog response"));
    }
    const identities = new Set(rows.map((row) => row.id ?? row.slug).filter(Boolean));
    for (const row of data) {
      const identity = row.id ?? row.slug;
      if (identity && identities.has(identity)) return reportUnavailable(operation, new Error("Unstable catalog pagination"));
      if (identity) identities.add(identity);
    }
    rows.push(...data);
    if (rows.length === count) return rows;
    if (rows.length > count) return reportUnavailable(operation, new Error("Inconsistent catalog count"));
    if (data.length === 0 || rows.length >= MAX_ROWS) return reportUnavailable(operation, new Error("Truncated catalog response"));
  }
  return reportUnavailable(operation, new Error("Catalog page limit exceeded"));
}

function publicQuery(supabase: Supabase) {
  return supabase.from("restaurants").select(PUBLIC_SELECT, { count: "exact" })
    .eq("status", "approved")
    .or("is_active.is.null,is_active.eq.true")
    .or("data_quality_status.is.null,data_quality_status.neq.rejected")
    .or("business_type.is.null,business_type.neq.not_food")
    .order("id", { ascending: true });
}

function eligibleRows(rows: Row[], operation: string): Row[] {
  const excluded: Record<string, number> = {};
  const result = rows.filter((row) => {
    const reasons = getPublicExclusionReasons(row);
    if (!row.id || !row.slug || typeof row.slug !== "string") reasons.push("missing_identity");
    for (const reason of reasons) excluded[reason] = (excluded[reason] ?? 0) + 1;
    return reasons.length === 0;
  });
  if (Object.keys(excluded).length) console.warn("catalog_exclusions", { operation, reasons: excluded });
  return result;
}

/** Fetch approved ratings separately: a nested relation can itself hit a row limit. */
async function attachApprovedRatings(supabase: Supabase, rows: Row[], operation: string): Promise<Row[]> {
  const grouped = new Map<string, Row[]>();
  const ids = [...new Set(rows.map((row) => String(row.id)))];
  for (let offset = 0; offset < ids.length; offset += 100) {
    const chunk = ids.slice(offset, offset + 100);
    const reviews = await readAllPages((from, to) => supabase.from("user_reviews")
      .select("id, restaurant_id, rating, status", { count: "exact" })
      .in("restaurant_id", chunk).eq("status", "approved")
      .order("id", { ascending: true }).range(from, to), `${operation}:ratings`);
    for (const review of reviews) {
      if (review.status !== "approved") continue;
      const key = String(review.restaurant_id);
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(review);
    }
  }
  return rows.map((row) => ({ ...row, user_reviews: grouped.get(String(row.id)) ?? [] }));
}

function finiteNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || (typeof value === "string" && value.trim() === "") || typeof value === "boolean") return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}
function stringValue(value: unknown): string { return typeof value === "string" ? value.trim() : ""; }
function strings(value: unknown): string[] { return Array.isArray(value) ? value.map(stringValue).filter(Boolean) : []; }
function stars(value: unknown): number | null {
  const number = finiteNumber(value);
  return number !== undefined && number > 0 && number <= 5 ? number : null;
}
function countValue(value: unknown): number | null {
  const number = finiteNumber(value);
  return number !== undefined && Number.isInteger(number) && number >= 0 ? number : null;
}

function priceParts(row: { price_range?: unknown; price_level?: unknown }) {
  const range = stringValue(row.price_range);
  const level = finiteNumber(row.price_level);
  return { range: /^\${1,4}$/.test(range) ? range : "",
    levelRange: level !== undefined && Number.isInteger(level) && level >= 1 && level <= 4 ? "$".repeat(level) : "" };
}

export function hasPriceConflict(row: { price_range?: unknown; price_level?: unknown }): boolean {
  const { range, levelRange } = priceParts(row);
  return Boolean(range && levelRange && range !== levelRange);
}

/** Historical writers updated different fields. Conflicting valid prices need confirmation. */
export function normalizePriceRange(row: { price_range?: unknown; price_level?: unknown }): string {
  if (hasPriceConflict(row)) return "";
  const { range, levelRange } = priceParts(row);
  return range || levelRange;
}

/** All public reads use this mapper; ranking payloads never act as restaurant records. */
export function dbRowToPlace(restaurant: Row): PlaceV2 {
  const approvedReviews = (Array.isArray(restaurant.user_reviews) ? restaurant.user_reviews : [])
    .filter((review: Row) => review.status === "approved" && Number.isInteger(finiteNumber(review.rating)) && Number(review.rating) >= 1 && Number(review.rating) <= 5);
  const communityCount = approvedReviews.length;
  const communityRating = communityCount
    ? approvedReviews.reduce((total: number, review: Row) => total + Number(review.rating), 0) / communityCount : null;
  const publicRating = stars(restaurant.public_rating);
  const publicCount = countValue(restaurant.public_review_count);
  const critic = getPublishedCriticReview(restaurant);
  const publicationDate = critic && (critic.published_at || critic.reviewed_at || restaurant.critic_reviewed_at || critic.created_at);
  const rawScore = finiteNumber(critic?.admin_score);
  const videoUrl = getReviewVideoUrl(restaurant);
  const lat = finiteNumber(restaurant.latitude ?? restaurant.lat);
  const lng = finiteNumber(restaurant.longitude ?? restaurant.lng);
  const validCoordinates = lat !== undefined && lng !== undefined && (lat !== 0 || lng !== 0) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  const ratingSource = communityRating !== null ? "community" : (publicRating !== null && (publicCount ?? 0) > 0 ? "public" : null);
  const place: PlaceV2 = {
    id: stringValue(restaurant.id) || undefined,
    slug: stringValue(restaurant.slug),
    name: stringValue(restaurant.name) || "Unnamed Food Spot",
    address: stringValue(restaurant.address),
    area: stringValue(restaurant.area || restaurant.city),
    category: stringValue(restaurant.category || restaurant.cuisine_type || restaurant.cuisine) || "Restaurant",
    description: stringValue(restaurant.description),
    features: strings(restaurant.features),
    hours: strings(restaurant.hours),
    image: listingImage(restaurant, process.env.NEXT_PUBLIC_SUPABASE_URL),
    image_credit: listingImageCredit(restaurant, process.env.NEXT_PUBLIC_SUPABASE_URL),
    google_place_id: /^[A-Za-z0-9_-]{10,300}$/.test(stringValue(restaurant.google_place_id)) ? stringValue(restaurant.google_place_id) : null,
    lat: validCoordinates ? lat : undefined,
    lng: validCoordinates ? lng : undefined,
    parish: stringValue(restaurant.parish),
    phone: stringValue(restaurant.phone),
    priceRange: normalizePriceRange(restaurant),
    price_needs_confirmation: hasPriceConflict(restaurant),
    website: safeWebUrl(restaurant.website) || "",
    type: stringValue(restaurant.cuisine_type || restaurant.cuisine) || "Restaurant",
    rating: ratingSource === "community" ? communityRating! : ratingSource === "public" ? publicRating! : 0,
    reviewCount: ratingSource === "community" ? communityCount : ratingSource === "public" ? publicCount! : 0,
    rating_source: ratingSource,
    community_rating: communityRating,
    community_review_count: communityCount,
    community_score: communityRating === null ? undefined : communityRating * 20,
    public_rating: publicRating,
    public_review_count: publicCount,
    public_rating_source: stringValue(restaurant.public_rating_source) || null,
    reviews: [],
    featured: restaurant.is_featured === true || restaurant.featured === true,
    is_verified: restaurant.is_verified === true || restaurant.verified === true,
    has_critic_review: Boolean(critic),
    verdict: critic ? stringValue(critic.critic_verdict || critic.verdict) : undefined,
    critic_verdict: critic ? stringValue(critic.critic_verdict || critic.verdict) : undefined,
    headline: critic ? stringValue(critic.headline) : undefined,
    honest_take: critic ? stringValue(critic.honest_take || critic.critic_review_body) : undefined,
    critic_review_body: critic ? stringValue(critic.critic_review_body || critic.honest_take) : undefined,
    reviewed_at: validReviewDate(publicationDate),
    published_at: validReviewDate(publicationDate),
    visited_at: validReviewDate(critic?.visited_at || critic?.visit_date),
    visit_date: validReviewDate(critic?.visit_date || critic?.visited_at),
    created_at: validReviewDate(restaurant.created_at),
    admin_score: rawScore !== undefined && rawScore >= 0 && rawScore <= 100 ? rawScore : undefined,
    tiktok_profile_url: getTikTokContactUrl(restaurant.tiktok),
    tiktok_url: videoUrl,
    tiktokUrl: videoUrl,
    review_video_url: videoUrl,
    public_listing_summary: stringValue(restaurant.public_listing_summary) || null,
    review_status: stringValue(restaurant.review_status) || null,
    source_status: stringValue(restaurant.source_status) || null,
    status: restaurant.status ?? null,
    is_active: restaurant.is_active ?? null,
    data_quality_status: restaurant.data_quality_status ?? null,
    business_type: restaurant.business_type ?? null,
    manually_verified: restaurant.manually_verified ?? null,
    country: stringValue(restaurant.country) || null,
    country_code: stringValue(restaurant.country_code) || null
  };
  // Only published review text enters the fallback search index; stale import search_text is not authoritative.
  place.search_document = buildRestaurantSearchDocument({ ...restaurant, search_text: "", admin_reviews: critic ? [critic] : [] });
  return place;
}

/**
 * Raw eligible rows are cached rather than mapped places: they are about half the
 * size (the data cache has a per-entry limit) and mapping is cheap. Failures throw
 * and are never cached, so an outage cannot be stored as an empty catalog.
 */
const loadCatalogRows = unstable_cache(async (): Promise<Row[]> => {
  const supabase = getClient("browse");
  const rows = await readAllPages((from, to) => publicQuery(supabase).range(from, to), "browse");
  return attachApprovedRatings(supabase, eligibleRows(rows, "browse"), "browse");
}, ["public-catalog-rows-v2"], { revalidate: CATALOG_REVALIDATE_SECONDS, tags: [CATALOG_CACHE_TAG] });

const loadPlaceRow = unstable_cache(async (slug: string): Promise<Row | null> => {
  const supabase = getClient("detail");
  const rows = await readAllPages((from, to) => publicQuery(supabase).eq("slug", slug).range(from, to), "detail");
  const eligible = eligibleRows(rows, "detail");
  if (!eligible.length) return null;
  if (eligible.length !== 1) return reportUnavailable("detail", new Error("Duplicate restaurant slug"));
  return (await attachApprovedRatings(supabase, eligible, "detail"))[0];
}, ["public-catalog-detail-v2"], { revalidate: CATALOG_REVALIDATE_SECONDS, tags: [CATALOG_CACHE_TAG] });

export const getAllApprovedPlaces = cache(async (): Promise<PlaceV2[]> => (await loadCatalogRows()).map(dbRowToPlace));

export const getApprovedCommunityPlaceBySlug = cache(async (slug: string): Promise<PlaceV2 | null> => {
  const row = await loadPlaceRow(slug);
  return row ? dbRowToPlace(row) : null;
});

export type ApprovedPlaceReview = { id: string; rating: number; comment: string; created_at?: string };

/** Approved community reviews for one place, shared across visitors and expired with the catalog. */
export const getApprovedPlaceReviews = cache(unstable_cache(async (restaurantId: string): Promise<ApprovedPlaceReview[]> => {
  const supabase = getClient("place-reviews");
  try {
    const { data, error } = await supabase.from("user_reviews").select("id, rating, comment, created_at")
      .eq("restaurant_id", restaurantId).eq("status", "approved").order("created_at", { ascending: false }).limit(50)
      .abortSignal(AbortSignal.timeout(QUERY_TIMEOUT_MS));
    if (error) return reportUnavailable("place-reviews", error);
    return (data ?? []) as ApprovedPlaceReview[];
  } catch (cause) { return reportUnavailable("place-reviews", cause); }
}, ["public-place-reviews-v1"], { revalidate: CATALOG_REVALIDATE_SECONDS, tags: [CATALOG_CACHE_TAG] }));

export async function getApprovedCommunityPlaces(existingSlugs: string[]): Promise<PlaceV2[]> {
  const existing = new Set(existingSlugs);
  return (await getAllApprovedPlaces()).filter((place) => !existing.has(place.slug));
}

async function hydrateSearchRows(supabase: Supabase, ranked: Row[]): Promise<PlaceV2[]> {
  const ids = [...new Set(ranked.map((row) => stringValue(row.id)).filter(Boolean))];
  const slugs = [...new Set(ranked.filter((row) => !row.id).map((row) => stringValue(row.slug)).filter(Boolean))];
  const hydrated = new Map<string, Row>();
  for (const [column, values] of [["id", ids], ["slug", slugs]] as const) {
    for (let offset = 0; offset < values.length; offset += 100) {
      const chunk = values.slice(offset, offset + 100);
      const rows = await readAllPages((from, to) => publicQuery(supabase).in(column, chunk).range(from, to), "search:hydrate");
      for (const row of eligibleRows(rows, "search:hydrate")) hydrated.set(String(row.id), row);
    }
  }
  const mapped = (await attachApprovedRatings(supabase, [...hydrated.values()], "search")).map(dbRowToPlace);
  const byId = new Map(mapped.map((place) => [place.id, place]));
  const bySlug = new Map(mapped.map((place) => [place.slug, place]));
  const seen = new Set<string>();
  return ranked.flatMap((row) => {
    const place = row.id ? byId.get(String(row.id)) : bySlug.get(String(row.slug));
    if (!place || seen.has(place.slug)) return [];
    seen.add(place.slug);
    return [{ ...place, final_score: finiteNumber(row.final_score), match_reason: stringValue(row.match_reason) || "Search match" }];
  });
}

export async function searchRestaurants(query: string): Promise<PlaceV2[]> {
  const normalized = normalizeSearchQuery(query).slice(0, 200);
  if (!normalized) return getAllApprovedPlaces();
  const supabase = getClient("search");
  let ranked: Row[] = [];
  try {
    ranked = await readAllPages((from, to) => supabase.rpc("search_restaurants", { search_query: normalized }, { count: "exact" })
      .order("final_score", { ascending: false }).order("id", { ascending: true }).range(from, to), "search:ranking");
  } catch (cause) {
    if (!(cause instanceof CatalogUnavailableError)) throw cause;
    // An old/missing RPC can degrade to full-row search, never to a false empty catalog.
  }
  if (ranked.length) {
    const results = await hydrateSearchRows(supabase, ranked);
    if (results.length) return results;
  }
  const all = await getAllApprovedPlaces();
  const candidates = all.filter((place): place is PlaceV2 & { search_document: RestaurantSearchDocument } => Boolean(place.search_document));
  return rankPlacesForQuery(normalized, candidates);
}

export type CommunityRestaurant = { id: string; slug: string; avg_rating: number; rating_count: number; positive_comment_count?: number; recommendation_score?: number };
export type CommunityComment = { id: string; body: string; created_at: string };

export async function getCommunityRestaurant(slug: string): Promise<CommunityRestaurant | null> {
  const place = await getApprovedCommunityPlaceBySlug(slug);
  return place?.id ? { id: place.id, slug: place.slug, avg_rating: place.community_rating ?? 0, rating_count: place.community_review_count } : null;
}

export async function getCommunityComments(restaurantId: string): Promise<CommunityComment[]> {
  const supabase = getClient("comments");
  try {
    const { data, error } = await supabase.from("restaurant_comments").select("id, body, created_at")
      .eq("restaurant_id", restaurantId).eq("status", "visible").order("created_at", { ascending: false }).limit(12)
      .abortSignal(AbortSignal.timeout(QUERY_TIMEOUT_MS));
    if (error) return reportUnavailable("comments", error);
    return (data ?? []) as CommunityComment[];
  } catch (cause) { return reportUnavailable("comments", cause); }
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


export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}
