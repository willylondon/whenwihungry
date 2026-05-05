import type { Metadata } from "next";
import { GetReviewedClient } from "./get-reviewed-client";
import { getPublicFoodSpotCountLabel } from "@/lib/place-counts";

export const revalidate = 21600;

export const metadata: Metadata = {
  title: "Get Your Restaurant Reviewed",
  description:
    "Submit your Jamaican restaurant for possible listing or anonymous review by WhenWiHungry.",
  openGraph: {
    title: "Get Your Restaurant Reviewed",
    description:
      "Submit your Jamaican restaurant for possible listing or anonymous review by WhenWiHungry.",
    images: [
      {
        url: "https://whenwihungry.vercel.app/og/whenwihungry-og.png",
        width: 1200,
        height: 630,
        alt: "WhenWiHungry — Jamaica's boldest food critic",
        type: "image/png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://whenwihungry.vercel.app/og/whenwihungry-og.png"]
  }
};

export default async function GetReviewedPage() {
  const foodSpotCountLabel = await getPublicFoodSpotCountLabel();
  return <GetReviewedClient foodSpotCountLabel={foodSpotCountLabel} />;
}
