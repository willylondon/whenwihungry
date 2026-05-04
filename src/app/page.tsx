import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCritique } from "@/components/home/featured-critique";
import { VideoGrid } from "@/components/home/video-grid";
import { LatestReviews } from "@/components/home/latest-reviews";
import { AboutSection } from "@/components/home/about-section";
import { RatingExplainer } from "@/components/home/rating-explainer";
import { GetReviewedCta } from "@/components/home/get-reviewed-cta";
import { getAllApprovedPlaces, VIDEO_MAP } from "@/lib/community";

export default async function HomePage() {
  const allPlaces = await getAllApprovedPlaces();
  
  // Highest rated becomes the featured critique
  const featured = [...allPlaces].sort((a, b) => b.rating - a.rating);
  const featuredReview = featured.length > 0 ? featured[0] : null;
  
  // Only show places that have a linked video review
  const videoReviews = allPlaces.filter(place => VIDEO_MAP[place.slug]).slice(0, 6);
  
  // If we don't have enough video reviews, fall back to popular ones for the grid
  const videoGridPlaces = videoReviews.length > 0 
    ? videoReviews 
    : [...allPlaces].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 6);
  
  // Most recent or popular for Latest Reviews
  const latestReviews = [...allPlaces].slice(0, 6);

  return (
    <div style={{ background: "var(--wwh-bg)" }}>
      <HeroSection />
      {featuredReview && <FeaturedCritique place={featuredReview} />}
      {videoReviews.length > 0 && <VideoGrid places={videoGridPlaces} />}
      {latestReviews.length > 0 && <LatestReviews places={latestReviews} />}
      <AboutSection />
      <RatingExplainer />
      <GetReviewedCta />
    </div>
  );
}
