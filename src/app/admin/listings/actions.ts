"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/admin/listings");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return supabase;
}

export async function moderateListingAction(formData: FormData) {
  const id = getString(formData, "id");
  const status = getString(formData, "status");

  if (!id || !["approved", "rejected", "pending"].includes(status)) {
    redirect("/admin/listings?error=invalid");
  }

  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("restaurants")
    .update({ status })
    .eq("id", id);

  if (error) {
    redirect(`/admin/listings?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/browse");
  revalidatePath("/admin/listings");
  redirect("/admin/listings?updated=1");
}
