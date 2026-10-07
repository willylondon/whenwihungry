import { redirect } from "next/navigation";

import { safeLocalRedirect } from "@/lib/security/redirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Every administrative mutation must invoke this guard, independently of UI. */
export async function requireAdmin(next = "/admin") {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user || data.user.is_anonymous) {
    redirect(`/sign-in?next=${encodeURIComponent(safeLocalRedirect(next, "/admin"))}`);
  }

  // Never authorize from user_metadata: users can edit that value themselves.
  // Profiles must also be protected by the database's role-assignment policies.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError || profile?.role !== "admin") redirect("/");
  return supabase;
}
