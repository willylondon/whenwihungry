"use server";

import { revalidatePath, updateTag } from "next/cache";
import { CATALOG_CACHE_TAG } from "@/lib/cache-tags";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { isUuid, getFormString } from "@/lib/validation";
import { textField } from "@/app/add-listing/validation";
import { parseRestaurant, parseCriticReview } from "./validation";

function refreshPublic(id: string) {
  revalidatePath(`/admin/restaurants/${id}`);
  updateTag(CATALOG_CACHE_TAG);
  for (const path of ["/", "/browse", "/reviews", "/admin/restaurants"]) revalidatePath(path);
  revalidatePath("/places/[slug]", "page");
  revalidatePath("/restaurants/[location]", "page");
}
function target(form: FormData, key = "id") {
  const id = getFormString(form, key);
  if (!isUuid(id)) redirect("/admin/restaurants?error=invalid");
  return id;
}
function feedback(id: string, key: "error" | "updated", value: string): never {
  redirect(`/admin/restaurants/${id}?${key}=${value}`);
}

export async function saveRestaurantAction(formData: FormData) {
  const supabase = await requireAdmin("/admin/restaurants");
  const id = target(formData);
  let updates;
  try {
    const boostValue = textField(formData, "admin_boost", 8);
    const boost = boostValue ? Number(boostValue) : 0;
    if (!Number.isFinite(boost) || boost < -100 || boost > 100) throw new Error("Invalid boost");
    updates = { ...parseRestaurant(formData), admin_boost: boost, is_featured: formData.get("is_featured") === "on", is_active: formData.get("is_active") === "on" };
  } catch { feedback(id, "error", "invalid"); }
  const { data, error } = await supabase.from("restaurants").update(updates).eq("id", id).select("id").maybeSingle();
  if (error || data?.id !== id) feedback(id, "error", "save_failed");
  refreshPublic(id);
  feedback(id, "updated", "listing");
}

export async function publishCriticReviewAction(formData: FormData) {
  const supabase = await requireAdmin("/admin/restaurants");
  const id = target(formData);
  let review: ReturnType<typeof parseCriticReview>;
  try { review = parseCriticReview(formData); }
  catch { feedback(id, "error", "review_invalid"); }
  // One SECURITY INVOKER database transaction performs authorization, row locking,
  // review persistence and public status change. A missing/unverified RPC fails closed.
  const { data, error } = await supabase.rpc("publish_critic_review", {
    p_restaurant_id: id,
    p_verdict: review.verdict,
    p_admin_score: review.admin_score,
    p_headline: review.headline,
    p_honest_take: review.honest_take,
    p_visit_date: review.visit_date
  }).single();
  if (error || !data || typeof data !== "object" || !("review_id" in data) || !isUuid(data.review_id)) feedback(id, "error", "review_failed");
  const changed = "changed" in data && data.changed === true;
  refreshPublic(id);
  feedback(id, "updated", changed ? "review" : "unchanged");
}

export async function addDishAction(formData: FormData) {
  const supabase = await requireAdmin("/admin/restaurants");
  const id = target(formData, "restaurant_id");
  let name: string;
  try { name = textField(formData, "dish_name", 160, 2); }
  catch { feedback(id, "error", "invalid"); }
  const { data, error } = await supabase.from("dishes").insert({ restaurant_id: id, name, normalized_name: name.toLowerCase() }).select("id").single();
  if (error || !data?.id) feedback(id, "error", "dish_failed");
  refreshPublic(id);
  feedback(id, "updated", "dish");
}

export async function addKeywordAction(formData: FormData) {
  const supabase = await requireAdmin("/admin/restaurants");
  const id = target(formData, "restaurant_id");
  let keyword: string;
  try { keyword = textField(formData, "keyword", 100, 2).toLowerCase(); }
  catch { feedback(id, "error", "invalid"); }
  const { data, error } = await supabase.from("search_keywords").insert({ restaurant_id: id, keyword }).select("id").single();
  if (error || !data?.id) feedback(id, "error", "keyword_failed");
  refreshPublic(id);
  feedback(id, "updated", "keyword");
}

export async function createRestaurantAction(formData: FormData) {
  const supabase = await requireAdmin("/admin/restaurants/new");
  let listing: ReturnType<typeof parseRestaurant>;
  try { listing = parseRestaurant(formData); }
  catch { redirect("/admin/restaurants/new?error=invalid"); }
  const { data, error } = await supabase.from("restaurants").insert({ ...listing, status: "pending", is_active: true }).select("id,status").single();
  if (error || !data?.id || data.status !== "pending") redirect("/admin/restaurants/new?error=create_failed");
  revalidatePath("/admin/restaurants");
  redirect(`/admin/restaurants/${data.id}?updated=created`);
}
