"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function createSlug(name: string, area: string) {
  return `${name}-${area}`
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function submitListingAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/add-listing");
  }

  const name = getString(formData, "name");
  const parish = getString(formData, "parish");
  const area = getString(formData, "area");
  const category = getString(formData, "category");
  const priceRange = getString(formData, "priceRange");
  const description = getString(formData, "description");
  const address = getString(formData, "address");
  const phone = getString(formData, "phone");
  const website = getString(formData, "website");
  const instagram = getString(formData, "instagram");
  const tiktok = getString(formData, "tiktok");

  if (!name || !parish || !category || !description) {
    redirect("/add-listing?error=missing");
  }

  const slug = createSlug(name, area || parish);
  const { error } = await supabase.from("restaurants").insert({
    address: address || null,
    area: area || null,
    category,
    description,
    instagram: instagram || null,
    name,
    parish,
    phone: phone || null,
    price_range: priceRange || null,
    slug,
    submitted_by: user.id,
    tiktok: tiktok || null,
    website: website || null
  });

  if (error) {
    redirect(`/add-listing?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/add-listing?submitted=1");
}
