import { AboutSection } from "@/components/home/about-section";
import { CategorySection } from "@/components/home/category-section";
import { FeaturedPlaces } from "@/components/home/featured-places";
import { HeroSection } from "@/components/home/hero-section";
import { LatestPosts } from "@/components/home/latest-posts";
import { StatsBar } from "@/components/home/stats-bar";
import { Testimonials } from "@/components/home/testimonials";
import { FeaturedCritique } from "@/components/home/featured-critique";
import { getAllApprovedPlaces } from "@/lib/community";
import {
  categories,
  getLatestReviewPosts,
  testimonials
} from "@/lib/places";

export default async function HomePage() {
  const allPlaces = await getAllApprovedPlaces();
  const featured = [...allPlaces]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  const stats = {
    placeCount: allPlaces.length,
    reviewCount: allPlaces.reduce((t, p) => t + p.reviewCount, 0),
    parishCount: new Set(allPlaces.map((p) => p.parish)).size
  };

  return (
    <>
      <HeroSection />
      <StatsBar
        parishCount={stats.parishCount}
        placeCount={stats.placeCount}
        reviewCount={stats.reviewCount}
      />
      <AboutSection />
      <FeaturedCritique />
      <FeaturedPlaces places={featured} />
      <CategorySection categories={categories} />
      <LatestPosts posts={getLatestReviewPosts()} />
      <Testimonials testimonials={testimonials} />
    </>
  );
}
