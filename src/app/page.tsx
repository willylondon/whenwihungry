import { ReviewCard } from "@/components/reviews/review-feature";
import { getWrittenReviewForPlace, latestWrittenReview, writtenReviews } from "@/data/reviews";
import { ParishLinks } from "@/components/browse/parish-links";
import { SpotsRail } from "@/components/home/spots-rail";
import { pickSpotsWorthALook } from "@/lib/places";
import { HeroSection } from "@/components/home/hero-section";
import { LatestReviews } from "@/components/home/latest-reviews";
import { AboutSection } from "@/components/home/about-section";
import { RatingExplainer } from "@/components/home/rating-explainer";
import { GetReviewedCta } from "@/components/home/get-reviewed-cta";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { isCriticReviewed } from "@/lib/place-status";
import { getAllApprovedPlaces, CatalogUnavailableError, type PlaceV2 } from "@/lib/community";
import { getPublicFoodSpotCountLabel } from "@/lib/place-counts";

export const revalidate = 21600;
export const metadata: Metadata = {
  title: { absolute: "Jamaican Restaurants & Food Reviews | WhenWiHungry" },
  description: "Find restaurants and food spots across Jamaica. Browse by parish, craving and price, with independent critic verdicts clearly marked where available.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Jamaican Restaurants & Food Reviews | WhenWiHungry",
    description: "Discover food spots across Jamaica by parish, craving and price.",
    url: "/", images: ["/og/whenwihungry-og.png"]
  }
};

export default async function HomePage() {
  let allPlaces: PlaceV2[] = [];
  let unavailable = false;
  try { allPlaces = await getAllApprovedPlaces(); } catch (error) {
    if (!(error instanceof CatalogUnavailableError)) throw error;
    unavailable = true;
    // Never bake an outage notice into the cached homepage.
    await connection();
  }
  const foodSpotCountLabel = unavailable ? null : await getPublicFoodSpotCountLabel();

  const reviewed = allPlaces
    .filter(isCriticReviewed)
    .sort((a, b) => (b.admin_score || 0) - (a.admin_score || 0));

  const latestReviews = [...reviewed].sort((a, b) => Date.parse(b.published_at || b.reviewed_at || "1970-01-01") - Date.parse(a.published_at || a.reviewed_at || "1970-01-01")).slice(0, 6);

  return (
    <div>
      <HeroSection foodSpotCountLabel={foodSpotCountLabel} latestReview={latestWrittenReview} />
      {unavailable && <section className="container service-state" role="status"><h2>Directory temporarily unavailable</h2><p>We couldn’t load the food spots. Please try again shortly.</p><Link className="btn btn-secondary" href="/browse">Try the directory</Link></section>}
      {writtenReviews.length > 1 && <section className="section" aria-labelledby="more-reviews-heading">
        <div className="container">
          <div className="section-heading"><div><h2 id="more-reviews-heading">More reviews</h2></div><Link className="spots-rail-all" href="/reviews">All reviews</Link></div>
          <div className="reviews-hub-grid">{writtenReviews.slice(1, 4).map(review => <ReviewCard key={review.slug} review={review} />)}</div>
        </div>
      </section>}
      {latestReviews.length > 0 && <LatestReviews places={latestReviews} variant="reviews" />}
      {!unavailable && <SpotsRail places={pickSpotsWorthALook(allPlaces.filter(place => !isCriticReviewed(place) && !getWrittenReviewForPlace(place.slug)))} />}
      {!unavailable && <ParishLinks places={allPlaces} />}
      <AboutSection />
      <RatingExplainer />
      <GetReviewedCta />
    </div>
  );
}
