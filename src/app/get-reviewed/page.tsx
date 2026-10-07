import { siteUrl } from "@/lib/site-url";
import { randomUUID } from "node:crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { GetReviewedClient } from "./get-reviewed-client";
import { getPublicFoodSpotCountLabel } from "@/lib/place-counts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get Your Restaurant Reviewed",
  alternates: { canonical: "/get-reviewed" },
  description:
    "Submit your Jamaican restaurant for possible listing or anonymous review by WhenWiHungry.",
  openGraph: {
    title: "Get Your Restaurant Reviewed",
    url: siteUrl("/get-reviewed"),
    description:
      "Submit your Jamaican restaurant for possible listing or anonymous review by WhenWiHungry.",
    images: [
      {
        url: siteUrl("/og/whenwihungry-og.png"),
        width: 1200,
        height: 630,
        alt: "WhenWiHungry — Jamaica's boldest food critic",
        type: "image/png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    images: [siteUrl("/og/whenwihungry-og.png")]
  }
};

export default async function GetReviewedPage() {
  const foodSpotCountLabel = await getPublicFoodSpotCountLabel();
  const enabled = process.env.REVIEW_REQUESTS_ENABLED === "true";
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  const signedIn = !authError && !!user && !user.is_anonymous;
  let existingRequest: { id: string; status: string } | null = null;
  let queueUnavailable = false;
  if (enabled && signedIn) {
    const { data, error } = await supabase.from("review_requests").select("id,status").eq("owner_id", user!.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
    existingRequest = data;
    queueUnavailable = !!error;
  }
  return <GetReviewedClient foodSpotCountLabel={foodSpotCountLabel} enabled={enabled} signedIn={signedIn} requestId={randomUUID()} existingRequest={existingRequest} queueUnavailable={queueUnavailable} />;
}
