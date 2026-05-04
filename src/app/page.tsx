import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCritique } from "@/components/home/featured-critique";
import { LatestReviews } from "@/components/home/latest-reviews";
import { AboutSection } from "@/components/home/about-section";
import { RatingExplainer } from "@/components/home/rating-explainer";
import { GetReviewedCta } from "@/components/home/get-reviewed-cta";
import { getAllApprovedPlaces } from "@/lib/community";

export default async function HomePage() {
  const allPlaces = await getAllApprovedPlaces();

  const reviewed = allPlaces
    .filter(p => p.has_critic_review)
    .sort((a, b) => (b.admin_score || 0) - (a.admin_score || 0));

  const newListings = allPlaces
    .filter(p => !p.has_critic_review)
    .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));

  const featuredReview = reviewed.length > 0 ? reviewed[0] : null;
  const latestReviews = reviewed.slice(0, 6);
  const recentListings = newListings.slice(0, 6);

  return (
    <div style={{ background: "var(--wwh-bg)" }}>
      <HeroSection />
      {featuredReview && <FeaturedCritique place={featuredReview} />}
      {latestReviews.length > 0 && <LatestReviews places={latestReviews} variant="reviews" />}
      {recentListings.length > 0 && <LatestReviews places={recentListings} variant="listings" />}
      <AboutSection />
      <RatingExplainer />
      <GetReviewedCta />
    </div>
  );
}
