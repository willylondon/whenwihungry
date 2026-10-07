"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseListing } from "./validation";

export async function submitListingAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.is_anonymous) redirect("/sign-in?next=/add-listing");
  let listing: ReturnType<typeof parseListing>;
  try { listing = parseListing(formData); }
  catch { redirect("/add-listing?error=invalid"); }
  const slugBase = `${listing.name}-${listing.area || listing.parish}`.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 70);
  const { data, error } = await supabase.from("restaurants").insert({
    ...listing,
    slug: `${slugBase}-${randomUUID().slice(0, 8)}`,
    submitted_by: user.id,
    status: "pending",
    is_active: true
  }).select("id,status").single();
  if (error || !data?.id || data.status !== "pending") redirect("/add-listing?error=unavailable");
  redirect("/add-listing?submitted=1");
}
