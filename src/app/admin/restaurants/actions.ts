"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveRestaurantAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const id = formData.get("id") as string;
  
  const updates = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    parish: formData.get("parish") as string,
    area: formData.get("area") as string,
    description: formData.get("description") as string,
    cuisine_type: formData.get("cuisine_type") as string,
    category: formData.get("category") as string,
    phone: formData.get("phone") as string,
    image_url: formData.get("image_url") as string,
    price_level: parseInt(formData.get("price_level") as string || "2"),
    is_verified: formData.get("is_verified") === "on",
    is_featured: formData.get("is_featured") === "on",
    is_active: formData.get("is_active") === "on",
    admin_boost: parseFloat(formData.get("admin_boost") as string || "0")
  };

  const { error: rError } = await supabase
    .from("restaurants")
    .update(updates)
    .eq("id", id);

  if (rError) throw rError;

  const verdict = formData.get("verdict") as string;
  const admin_score = parseInt(formData.get("admin_score") as string || "50");

  const { error: arError } = await supabase
    .from("admin_reviews")
    .upsert({
      restaurant_id: id,
      verdict,
      admin_score,
      reviewed_at: new Date().toISOString()
    }, { onConflict: "restaurant_id" });

  if (arError) throw arError;

  revalidatePath(`/admin/restaurants/${id}`);
  revalidatePath("/browse");
  revalidatePath("/");
}

export async function addDishAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const restaurant_id = formData.get("restaurant_id") as string;
  const name = formData.get("dish_name") as string;

  if (!name) return;

  const { error } = await supabase
    .from("dishes")
    .insert({
      restaurant_id,
      name,
      normalized_name: name.toLowerCase().trim()
    });

  if (!error) {
    revalidatePath(`/admin/restaurants/${restaurant_id}`);
  }
}

export async function addKeywordAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const restaurant_id = formData.get("restaurant_id") as string;
  const keyword = formData.get("keyword") as string;

  if (!keyword) return;

  const { error } = await supabase
    .from("search_keywords")
    .insert({
      restaurant_id,
      keyword: keyword.toLowerCase().trim()
    });

  if (!error) {
    revalidatePath(`/admin/restaurants/${restaurant_id}`);
  }
}

export async function createRestaurantAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("restaurants")
    .insert({
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      parish: formData.get("parish") as string,
      area: formData.get("area") as string,
      description: formData.get("description") as string,
      cuisine_type: formData.get("cuisine_type") as string,
      category: formData.get("category") as string,
      image_url: formData.get("image_url") as string,
      price_level: parseInt(formData.get("price_level") as string || "2"),
      is_verified: formData.get("is_verified") === "on"
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/admin/restaurants");
  redirect(`/admin/restaurants/${data.id}`);
}
