"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitPlaceFeedbackAction(formData: FormData) {
  const slug = getString(formData, "slug");
  const restaurantId = getString(formData, "restaurantId");
  const comment = getString(formData, "comment");
  const rating = Number(getString(formData, "rating"));

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/sign-in?next=/places/${slug}`);
  }

  if (!restaurantId || !slug || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    redirect(`/places/${slug}?feedback=invalid`);
  }

  const { error: ratingError } = await supabase.from("restaurant_ratings").upsert(
    {
      rating,
      restaurant_id: restaurantId,
      user_id: user.id
    },
    { onConflict: "restaurant_id,user_id" }
  );

  if (ratingError) {
    redirect(`/places/${slug}?feedback=${encodeURIComponent(ratingError.message)}`);
  }

  if (comment.length >= 3) {
    const { error: commentError } = await supabase.from("restaurant_comments").insert({
      body: comment,
      is_positive: rating >= 4,
      restaurant_id: restaurantId,
      user_id: user.id
    });

    if (commentError) {
      redirect(`/places/${slug}?feedback=${encodeURIComponent(commentError.message)}`);
    }
  }

  revalidatePath(`/places/${slug}`);
  redirect(`/places/${slug}?feedback=thanks`);
}
