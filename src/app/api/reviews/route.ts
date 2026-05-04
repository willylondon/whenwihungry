import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Sign in required" }, { status: 401 });
  }

  const { restaurantId, rating, comment } = await req.json();

  if (!restaurantId || !rating || !comment) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const { error } = await supabase
    .from("user_reviews")
    .insert({
      restaurant_id: restaurantId,
      user_id: user.id,
      rating,
      comment,
      status: "pending"
    });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ message: "You already reviewed this place" }, { status: 400 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Success" });
}
