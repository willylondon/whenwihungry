import { AboutSection } from "@/components/home/about-section";
import { CategorySection } from "@/components/home/category-section";
import { FeaturedPlaces } from "@/components/home/featured-places";
import { HeroSection } from "@/components/home/hero-section";
import { LatestPosts } from "@/components/home/latest-posts";
import { StatsBar } from "@/components/home/stats-bar";
import { Testimonials } from "@/components/home/testimonials";
import {
  categories,
  getFeaturedPlaces,
  getLatestReviewPosts,
  getSiteStats,
  testimonials
} from "@/lib/places";

export default function HomePage() {
  const stats = getSiteStats();

  return (
    <>
      <HeroSection />
      <StatsBar
        parishCount={stats.parishCount}
        placeCount={stats.placeCount}
        reviewCount={stats.reviewCount}
      />
      <AboutSection />
      <FeaturedPlaces places={getFeaturedPlaces()} />
      <CategorySection categories={categories} />
      <LatestPosts posts={getLatestReviewPosts()} />
      <Testimonials testimonials={testimonials} />
    </>
  );
}
