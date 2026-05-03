import type { MetadataRoute } from "next";

import {
  getReviewCategories,
  getReviewCategorySlug,
  reviewPosts
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
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },
    ...getReviewCategories().map((category) => ({
      url: `${baseUrl}/reviews/category/${getReviewCategorySlug(category)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85
    })),
    ...reviewPosts.map((post) => ({
      url: `${baseUrl}/reviews/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}
