import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCritique } from "@/components/home/featured-critique";
import { VideoGrid } from "@/components/home/video-grid";
import { LatestReviews } from "@/components/home/latest-reviews";
import { HiddenGems } from "@/components/home/hidden-gems";
import { AboutSection } from "@/components/home/about-section";
import { RatingExplainer } from "@/components/home/rating-explainer";
import { GetReviewedCta } from "@/components/home/get-reviewed-cta";
import {
  getFeaturedReview,
  getHiddenGems,
  getLatestReviewPosts,
  getVideoReviews
} from "@/lib/places";

export default function HomePage() {
  const featuredReview = getFeaturedReview();
  const videoReviews = getVideoReviews();
  const latestReviews = getLatestReviewPosts();
  const hiddenGems = getHiddenGems();

  return (
    <div style={{ background: "var(--wwh-bg)" }}>
      <HeroSection />
      <FeaturedCritique post={featuredReview} />
      <VideoGrid posts={videoReviews} />
      <LatestReviews posts={latestReviews} />
      {hiddenGems.length > 0 && <HiddenGems posts={hiddenGems} />}
      <AboutSection />
      <RatingExplainer />
      <GetReviewedCta />
    </div>
  );
}
