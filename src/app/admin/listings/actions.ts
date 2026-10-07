"use server";

import { revalidatePath, updateTag } from "next/cache";
import { CATALOG_CACHE_TAG } from "@/lib/cache-tags";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getFormString, isUuid } from "@/lib/validation";

export async function moderateListingAction(formData: FormData) {
  const supabase = await requireAdmin("/admin/listings");
  const id = getFormString(formData, "id");
  const status = getFormString(formData, "status");
  if (!isUuid(id) || !["approved", "rejected", "pending"].includes(status)) redirect("/admin/listings?error=invalid");
  const { data, error } = await supabase.from("restaurants").update({ status }).eq("id", id).select("id,status").maybeSingle();
  if (error || data?.id !== id || data.status !== status) redirect("/admin/listings?error=save_failed");
  updateTag(CATALOG_CACHE_TAG);
  for (const path of ["/", "/browse", "/reviews", "/admin/listings"]) revalidatePath(path);
  revalidatePath("/places/[slug]", "page");
  revalidatePath("/restaurants/[location]", "page");
  redirect("/admin/listings?updated=1");
}
