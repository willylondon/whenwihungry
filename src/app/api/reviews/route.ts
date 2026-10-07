import { NextResponse } from "next/server";

import { isPublicFoodSpot } from "@/lib/place-visibility";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { readBoundedJson, RequestBodyError, REVIEW_BODY_MAX_BYTES, validateReviewInput } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.is_anonymous) {
      return NextResponse.json({ message: "Sign in required" }, { status: 401 });
    }

    const input = validateReviewInput(await readBoundedJson(req, REVIEW_BODY_MAX_BYTES));
    if (!input) {
      return NextResponse.json({ message: "Choose a rating from 1 to 5 and write a comment of 1–500 characters for a valid place" }, { status: 400 });
    }

    const { data: restaurant, error: targetError } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", input.restaurantId)
      .eq("status", "approved")
      .maybeSingle();

    if (targetError) {
      return NextResponse.json({ message: "Could not check this place. Please try again later" }, { status: 503 });
    }
    if (!restaurant || !isPublicFoodSpot(restaurant)) {
      return NextResponse.json({ message: "This place is not available for reviews" }, { status: 404 });
    }

    const { error } = await supabase.from("user_reviews").insert({
      restaurant_id: input.restaurantId,
      user_id: user.id,
      rating: input.rating,
      comment: input.comment,
      status: "pending"
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ message: "You already reviewed this place" }, { status: 409 });
      }
      return NextResponse.json({ message: "Could not submit your review. Please try again later" }, { status: 500 });
    }
    return NextResponse.json({ message: "Review submitted for moderation" }, { status: 201 });
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Could not submit your review. Please try again later" }, { status: 500 });
  }
}
