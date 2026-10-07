import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCritique } from "@/components/home/featured-critique";
import { LatestReviews } from "@/components/home/latest-reviews";
import { AboutSection } from "@/components/home/about-section";
import { RatingExplainer } from "@/components/home/rating-explainer";
import { GetReviewedCta } from "@/components/home/get-reviewed-cta";
import type { Metadata } from "next";
import Link from "next/link";
import { isCriticReviewed } from "@/lib/place-status";
import { getAllApprovedPlaces, CatalogUnavailableError, type PlaceV2 } from "@/lib/community";
import { getPublicFoodSpotCountLabel } from "@/lib/place-counts";

export const revalidate = 21600;
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
  let allPlaces: PlaceV2[] = [];
  let unavailable = false;
  try { allPlaces = await getAllApprovedPlaces(); } catch (error) {
    if (!(error instanceof CatalogUnavailableError)) throw error;
    unavailable = true;
  }
  const foodSpotCountLabel = unavailable ? null : await getPublicFoodSpotCountLabel();

  const reviewed = allPlaces
    .filter(isCriticReviewed)
    .sort((a, b) => (b.admin_score || 0) - (a.admin_score || 0));

  const newListings = allPlaces
    .filter(p => !isCriticReviewed(p))
    .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));

  const featuredReview = reviewed.length > 0 ? reviewed[0] : null;
  const latestReviews = [...reviewed].sort((a, b) => Date.parse(b.published_at || b.reviewed_at || "1970-01-01") - Date.parse(a.published_at || a.reviewed_at || "1970-01-01")).slice(0, 6);
  const recentListings = newListings.slice(0, 6);

  return (
    <div style={{ background: "var(--wwh-bg)" }}>
      <HeroSection foodSpotCountLabel={foodSpotCountLabel} />
      {unavailable && <section className="container service-state" role="status"><h2>Directory temporarily unavailable</h2><p>We couldn’t load the food spots. Please try again shortly.</p><Link className="btn btn-secondary" href="/browse">Try the directory</Link></section>}
      {featuredReview && <FeaturedCritique place={featuredReview} />}
      {latestReviews.length > 0 && <LatestReviews places={latestReviews} variant="reviews" />}
      {recentListings.length > 0 && <LatestReviews places={recentListings} variant="listings" />}
      <AboutSection />
      <RatingExplainer />
      <GetReviewedCta />
    </div>
  );
}
