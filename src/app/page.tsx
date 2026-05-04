import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCritique } from "@/components/home/featured-critique";
import { LatestReviews } from "@/components/home/latest-reviews";
import { AboutSection } from "@/components/home/about-section";
import { RatingExplainer } from "@/components/home/rating-explainer";
import { GetReviewedCta } from "@/components/home/get-reviewed-cta";
import { getAllApprovedPlaces } from "@/lib/community";

export default async function HomePage() {
  const allPlaces = await getAllApprovedPlaces();
  
  // Highest rated becomes the featured critique
  const featured = [...allPlaces].sort((a, b) => b.rating - a.rating);
  const featuredReview = featured.length > 0 ? featured[0] : null;
  
  // Most recent or popular for Latest Reviews
  const latestReviews = [...allPlaces].slice(0, 6);

  return (
    <div style={{ background: "var(--wwh-bg)" }}>
      <HeroSection />
      {featuredReview && <FeaturedCritique place={featuredReview} />}
      {latestReviews.length > 0 && <LatestReviews places={latestReviews} />}
      <AboutSection />
      <RatingExplainer />
      <GetReviewedCta />
    </div>
  );
}
