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
    title: `Best Restaurants in ${displayName}`,
    description: `Explore top food spots in ${displayName}: local favourites, jerk, grill, seafood, and Jamaican restaurants — honest and unfiltered.`,
    openGraph: {
      title: `Best Restaurants in ${displayName}`,
      description: `Unfiltered reviews for the top food spots in ${displayName}.`,
      images: [
        {
          url: "https://whenwihungry.vercel.app/og/whenwihungry-og.png",
          width: 1200,
          height: 630,
          alt: `WhenWiHungry — Best restaurants in ${displayName}`,
          type: "image/png"
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: ["https://whenwihungry.vercel.app/og/whenwihungry-og.png"]
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

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best Restaurants in ${displayName}`,
    url: `https://whenwihungry.vercel.app/restaurants/${location}`,
    numberOfItems: results.length,
    itemListElement: results.slice(0, 20).map((place, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://whenwihungry.vercel.app/places/${place.slug}`,
      name: place.name
    }))
  };

  return (
    <main style={{ background: "var(--wwh-bg)", minHeight: "100vh", padding: "100px 0" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <div style={{ width: "min(1200px, calc(100% - 40px))", margin: "0 auto" }} className="container">
        <SectionHeader 
          eyebrow="Local Discovery"
          heading={`Best in ${displayName}`}
          subtext={`Showing mapped food spots in ${displayName} ranked by public signals, community activity, and critic verdicts where available.`}
        />

        {/* ── SEO Intro Copy ── */}
        <LocationIntro location={location} displayName={displayName} resultCount={results.length} />
        
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

// ── SEO Intro Copy ──────────────────────────────────────────────────

const LOCATION_INTRO: Record<string, string[]> = {
  kingston: [
    "Kingston is one of Jamaica's most active food zones, where roadside jerk and curry goat lunch stops sit alongside rooftop date-night spots, late-night food searches, and everything in between. This page maps food spots across Kingston using public signals, location data, category tags, and WhenWiHungry verdicts where available.",
    "Not every spot listed here has been reviewed yet. Some are directory listings — mapped and tagged so you know what is out there. Others have already been visited, tasted, and given a critic verdict or a TikTok review. WhenWiHungry verdicts are added as they go live.",
    "You will find jerk stops, seafood runs, curry goat lunch lines, dessert pulls, and a few unpolished local spots that might not look like much but get the flavours right. Public rating signals from Google are shown for discovery, but real verdicts are clearly separated — so you always know what has been reviewed and what has not."
  ],
  portland: [
    "Portland food is different. You have beachside seafood, jerk smoke near the road, riverside stops, small local favourites, and tourist-heavy spots that people still want honest guidance on. This page helps you discover what Portland offers, from casual beach fry to sit-down jerk on the coast.",
    "Listed spots are mapped using public signals, parish data, and community input. Critic verdicts and TikTok reviews are added as the anonymous critic visits. Where a spot has been reviewed, you will see the verdict clearly marked — not mixed in with directory listings.",
    "Seafood, jerk, and local riverside cooking dominate the Portland food map, but the real draws are the settings: eating by the water, stopping mid-road-trip for a plate, or discovering a small spot that does one thing really well. Use public ratings as a starting signal, but look for the critic verdict badges for the honest take."
  ]
};

function LocationIntro({ location, displayName, resultCount }: { location: string; displayName: string; resultCount: number }) {
  const locationKey = location.toLowerCase().replace(/-/g, "");
  const paragraphs = LOCATION_INTRO[locationKey];
  if (!paragraphs) return null;

  return (
    <section
      style={{
        marginTop: "40px",
        padding: "32px 36px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid var(--wwh-border)",
        borderRadius: "16px"
      }}
    >
      <h2
        style={{
          margin: "0 0 20px",
          fontFamily: "var(--wwh-font-heading)",
          fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
          color: "#fff",
          textTransform: "uppercase",
          letterSpacing: "0.02em"
        }}
      >
        {displayName} Food Spots Worth Mapping
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {paragraphs.map((text, i) => (
          <p
            key={i}
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.55)",
              fontFamily: "var(--wwh-font-body)",
              fontSize: "clamp(0.88rem, 1.2vw, 0.98rem)",
              lineHeight: 1.75,
              maxWidth: "780px"
            }}
          >
            {text}
          </p>
        ))}
      </div>
      <p
        style={{
          margin: "18px 0 0",
          color: "rgba(255,255,255,0.3)",
          fontFamily: "var(--wwh-font-body)",
          fontSize: "0.8rem"
        }}
      >
        {resultCount} food spot{resultCount !== 1 ? "s" : ""} mapped · Critic verdicts where available · NYAAM RATING
      </p>
    </section>
  );
}
