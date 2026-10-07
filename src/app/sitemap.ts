import type { MetadataRoute } from "next";
import { getAllApprovedPlaces } from "@/lib/community";
import { categories } from "@/lib/places";
import { getAllParishNames } from "@/lib/location-validation";
import { siteUrl } from "@/lib/site-url";

// Runtime generation avoids freezing an outage or a partial catalog into the build.
// Fetch failures intentionally propagate as 5xx rather than publishing an empty sitemap.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const places = await getAllApprovedPlaces();
  return [
    { url: siteUrl(), changeFrequency: "weekly", priority: 1 },
    ...["/browse", "/reviews", "/about"].map(path => ({ url: siteUrl(path), changeFrequency: "weekly" as const, priority: 0.9 })),
    ...categories.map(category => ({ url: siteUrl(`/browse?category=${encodeURIComponent(category.toLowerCase())}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...getAllParishNames().map(parish => ({ url: siteUrl(`/restaurants/${parish.replace(/ /g, "-")}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...places.map(place => ({ url: siteUrl(`/places/${place.slug}`), changeFrequency: "monthly" as const, priority: 0.8 }))
  ];
}
