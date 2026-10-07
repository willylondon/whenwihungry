"use server";

import { revalidatePath, updateTag } from "next/cache";
import { CATALOG_CACHE_TAG } from "@/lib/cache-tags";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getFormString, isUuid } from "@/lib/validation";

export async function moderateReviewAction(formData: FormData) {
  const supabase = await requireAdmin("/admin/reviews");
  const id = getFormString(formData, "id");
  const status = getFormString(formData, "status");
  if (!isUuid(id) || !["pending", "approved", "rejected"].includes(status)) redirect("/admin/reviews?error=invalid");
  const { data, error } = await supabase.from("user_reviews").update({ status }).eq("id", id).select("id,status").maybeSingle();
  if (error || data?.id !== id || data.status !== status) redirect("/admin/reviews?error=save_failed");
  updateTag(CATALOG_CACHE_TAG);
  for (const path of ["/", "/browse", "/reviews", "/admin/reviews"]) revalidatePath(path);
  revalidatePath("/places/[slug]", "page");
  revalidatePath("/restaurants/[location]", "page");
  redirect("/admin/reviews?updated=1");
}
