"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { CATALOG_CACHE_TAG } from "@/lib/cache-tags";

/** For edits made outside the admin screens (e.g. the Supabase dashboard). */
export async function refreshPublicSiteAction(formData: FormData) {
  await requireAdmin("/admin/restaurants");
  updateTag(CATALOG_CACHE_TAG);
  revalidatePath("/", "layout");
  const back = formData.get("back");
  redirect(typeof back === "string" && back.startsWith("/admin/") ? `${back.split("?")[0]}?refreshed=1` : "/admin/restaurants?refreshed=1");
}
