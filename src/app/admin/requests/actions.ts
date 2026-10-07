"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getFormString, isUuid } from "@/lib/validation";

export async function updateRequestStatusAction(form: FormData) {
  const supabase = await requireAdmin("/admin/requests");
  const id = getFormString(form, "id");
  const status = getFormString(form, "status");
  if (process.env.REVIEW_REQUESTS_ENABLED !== "true") redirect("/admin/requests?error=unavailable");
  if (!isUuid(id) || !["pending", "in_review", "closed"].includes(status)) redirect("/admin/requests?error=invalid");
  const { data, error } = await supabase.from("review_requests").update({ status }).eq("id", id).select("id,status").maybeSingle();
  if (error || data?.id !== id || data.status !== status) redirect("/admin/requests?error=save_failed");
  revalidatePath("/admin/requests");
  revalidatePath("/get-reviewed");
  redirect("/admin/requests?updated=1");
}
