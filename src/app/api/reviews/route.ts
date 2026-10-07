import { NextResponse } from "next/server";

import { isPublicFoodSpot } from "@/lib/place-visibility";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isUuid, readBoundedJson, RequestBodyError, REVIEW_BODY_MAX_BYTES, validateReviewInput } from "@/lib/validation";

const PRIVATE = { "Cache-Control": "private, no-store" };

/** The visitor's own review state, fetched by the (shared, cached) place page. */
export async function GET(req: Request) {
  const restaurantId = new URL(req.url).searchParams.get("restaurantId") ?? "";
  if (!isUuid(restaurantId)) return NextResponse.json({ message: "Invalid place" }, { status: 400, headers: PRIVATE });
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.is_anonymous) return NextResponse.json({ signedIn: false }, { headers: PRIVATE });
    const { data, error } = await supabase.from("user_reviews").select("id")
      .eq("restaurant_id", restaurantId).eq("user_id", user.id).maybeSingle();
    if (error) return NextResponse.json({ signedIn: true, hasReview: null }, { status: 503, headers: PRIVATE });
    return NextResponse.json({ signedIn: true, hasReview: Boolean(data) }, { headers: PRIVATE });
  } catch {
    return NextResponse.json({ signedIn: true, hasReview: null }, { status: 503, headers: PRIVATE });
  }
}

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
