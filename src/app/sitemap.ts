import type { MetadataRoute } from "next";

import {
  categories,
  places
} from "@/lib/places";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://whenwihungry.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },
    ...categories.map((category) => ({
      url: `${baseUrl}/browse?category=${encodeURIComponent(category)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85
    })),
    ...places.map((place) => ({
      url: `${baseUrl}/places/${place.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}
