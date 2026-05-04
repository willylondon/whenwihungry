import { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { dbRowToPlace, type PlaceV2 } from "@/lib/community";
import { PlaceListCard } from "@/components/browse/place-list-card";
import { SectionHeader } from "@/components/ui/section-header";

type Props = {
  params: Promise<{ location: string }>;
};

// Convert slug to all possible parish name variants to match the DB
function slugToParishVariants(slug: string): string[] {
  const base = slug
    .split("-")
    .map(word => word === "st" ? "St." : word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  
  // e.g. "Kingston" -> ["Kingston", "Kingston Parish", "Kingston & St. Andrew"]
  const extras: Record<string, string[]> = {
    "Kingston": ["Kingston", "Kingston Parish", "Kingston & St. Andrew", "Kingston and St. Andrew"],
    "Portland": ["Portland", "Portland Parish"],
    "St. Andrew": ["St. Andrew", "St Andrew", "Kingston & St. Andrew"],
    "St. Ann": ["St. Ann", "Saint Ann", "St Ann"],
    "St. James": ["St. James", "Saint James", "St James"],
  };

  return extras[base] ?? [base];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location } = await params;
  const variants = slugToParishVariants(location);
  const displayName = variants[0];
  
  return {
    title: `Best Restaurants in ${displayName} | When Wi Hungry`,
    description: `Discover the most honest food reviews for restaurants in ${displayName}, Jamaica. No hype, just the truth.`,
    openGraph: {
      title: `Best Restaurants in ${displayName}`,
      description: `Unfiltered reviews for the top food spots in ${displayName}.`,
    }
  };
}

export default async function LocationPage({ params }: Props) {
  const { location } = await params;
  const supabase = await createSupabaseServerClient();
  const variants = slugToParishVariants(location);
  const displayName = variants[0];

  // Direct DB query by parish variants — bypasses the RPC relevance filter
  const { data, error } = await supabase
    .from("restaurants")
    .select(`*, admin_reviews(verdict, admin_score), user_reviews(rating)`)
    .in("parish", variants)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  const results: PlaceV2[] = (error || !data) ? [] : data.map((row: any) => {
    const adminRev = Array.isArray(row.admin_reviews) ? row.admin_reviews[0] : row.admin_reviews;
    const userReviews = row.user_reviews || [];
    const avgCommunity = userReviews.length > 0
      ? userReviews.reduce((acc: number, cur: any) => acc + (cur.rating || 0), 0) / userReviews.length
      : 0;
    return {
      ...dbRowToPlace(row),
      verdict: adminRev?.verdict || row.verdict,
      admin_score: adminRev?.admin_score || row.admin_score,
      community_score: (row.avg_rating || avgCommunity) * 20,
      reviewCount: row.rating_count || userReviews.length,
      is_verified: row.is_verified || row.verified
    };
  });

  return (
    <main style={{ background: "var(--wwh-bg)", minHeight: "100vh", padding: "100px 0" }}>
      <div className="container">
        <SectionHeader 
          eyebrow="Local Discovery"
          heading={`Best in ${displayName}`}
          subtext={`Showing the highest ranked food spots in ${displayName} based on critic and community scores.`}
        />
        
        <div style={{ display: "grid", gap: "24px", marginTop: "48px" }}>
          {results.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.4)" }}>No restaurants found in {displayName} yet.</p>
          ) : (
            results.map((place) => <PlaceListCard key={place.slug} place={place} />)
          )}
        </div>
      </div>
    </main>
  );
}
