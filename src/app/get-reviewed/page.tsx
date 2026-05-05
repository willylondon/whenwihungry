import type { Metadata } from "next";
import { GetReviewedClient } from "./get-reviewed-client";

export const metadata: Metadata = {
  title: "Get Your Restaurant Reviewed",
  description:
    "Submit your Jamaican restaurant for possible listing or anonymous review by WhenWiHungry."
};

export default function GetReviewedPage() {
  return <GetReviewedClient />;
}
