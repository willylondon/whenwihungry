"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function moderateReviewAction(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("user_reviews")
    .update({ status })
    .eq("id", id);
    
  if (!error) {
    revalidatePath("/admin/reviews");
  }
}
