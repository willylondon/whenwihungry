import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/config";
import { categories } from "@/lib/places";

export const revalidate = 21600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://whenwihungry.vercel.app";

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: places } = await supabase
    .from("restaurants")
    .select("slug, updated_at")
    .eq("status", "approved")
    .neq("data_quality_status", "rejected")
    .neq("business_type", "not_food")
    .order("created_at", { ascending: false });

  const placeEntries: MetadataRoute.Sitemap = (places ?? []).map((p) => ({
    url: `${baseUrl}/places/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8
  }));

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
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85
    },
    ...categories.map((category) => ({
      url: `${baseUrl}/browse?category=${encodeURIComponent(category)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85
    })),
    ...placeEntries
  ];
}
