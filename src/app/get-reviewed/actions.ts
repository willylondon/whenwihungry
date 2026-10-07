"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseReviewRequest } from "./validation";

export type ReviewRequestState = { status: "idle" | "error" | "success"; message: string; requestId?: string };
const unavailable: ReviewRequestState = { status: "error", message: "We couldn't confirm receipt. Your request has not been confirmed. Please keep your details and retry later; a retry will not duplicate a confirmed request." };

export async function submitReviewRequestAction(_previous: ReviewRequestState, form: FormData): Promise<ReviewRequestState> {
  if (process.env.REVIEW_REQUESTS_ENABLED !== "true") return { status: "error", message: "Review requests are temporarily unavailable. Nothing was submitted. Please check back later." };
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.is_anonymous) return { status: "error", message: "Please sign in with a permanent account before submitting. Your details have not been sent." };
  let request: ReturnType<typeof parseReviewRequest>;
  try { request = parseReviewRequest(form); }
  catch { return { status: "error", message: "Check your name, restaurant, location, email, and message (10–3,000 characters), then try again." }; }
  try {
    // The client keeps the same ID across retries. The primary key is the final race-safe boundary.
    const { data: existing, error: existingError } = await supabase.from("review_requests").select("id").eq("id", request.id).eq("owner_id", user.id).maybeSingle();
    if (existingError) return unavailable;
    if (existing?.id === request.id) return { status: "success", message: "Your request is saved in the restaurant inquiry queue.", requestId: existing.id };
    const { data, error } = await supabase.from("review_requests").insert({ ...request, owner_id: user.id }).select("id").single();
    if (error?.code === "23505") {
      const { data: confirmed, error: confirmError } = await supabase.from("review_requests").select("id").eq("id", request.id).eq("owner_id", user.id).maybeSingle();
      if (!confirmError && confirmed?.id === request.id) return { status: "success", message: "Your request is already saved in the restaurant inquiry queue.", requestId: confirmed.id };
      return { status: "error", message: "You already have an open request. Refresh this page to see its status before sending another." };
    }
    if (error || data?.id !== request.id) return unavailable;
    revalidatePath("/admin/requests");
    revalidatePath("/get-reviewed");
    return { status: "success", message: "Your request is saved in the restaurant inquiry queue.", requestId: data.id };
  } catch { return unavailable; }
}
