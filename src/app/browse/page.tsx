import type { Metadata } from "next";
import { MapViewWrapper } from "@/components/browse/map-view-wrapper";
import { PlaceListCard } from "@/components/browse/place-list-card";
import { SearchFilters } from "@/components/browse/search-filters";
import { getAllApprovedPlaces, searchRestaurants, type PlaceV2 } from "@/lib/community";
import { categories, getFilteredPlaces, getParishStats } from "@/lib/places";

type BrowsePageProps = {
  searchParams: Promise<{
    query?: string;
    q?: string;
    parish?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    view?: string;
  }>;
};

import { FilterChips } from "@/components/browse/filter-chips";

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  jerk: {
    title: "Best Jerk Spots in Jamaica",
    description:
      "Discover jerk chicken, jerk pork, and pimento-wood cooked food spots across Jamaica."
  },
  seafood: {
    title: "Best Seafood Spots in Jamaica",
    description:
      "Discover seafood restaurants, beach fish spots, lobster, conch, and Jamaican seafood listings."
  }
};

const CATEGORY_INTRO: Record<string, { heading: string; paragraphs: string[] }> = {
  jerk: {
    heading: "Jerk Chicken, Jerk Pork, and Roadside Smoke Across Jamaica",
    paragraphs: [
      "Jerk is one of Jamaica's most searched food categories, but not every smoky grill tells the same story. This page helps map jerk chicken, jerk pork, roadside smoke spots, and pimento-style flavour across Jamaica — from well-known jerk capitals to the side-of-the-road pan spots that locals guard jealously.",
      "Some spots listed here are directory listings — mapped, tagged, and ready for discovery. Others have already been visited by the anonymous WhenWiHungry critic and carry a verdict or a TikTok review. Critic verdicts are added as they go live, and they are clearly separated from public rating signals.",
      "What makes a jerk spot stand out is not always the name or the line outside. It can be the pimento smoke hitting the right way, the jerk pan that runs out by 3 PM, the roadside spot that only serves jerk pork on Saturdays, or the cook shop where they let the chicken rest properly. Use the public signals as a starting point. Look for the critic verdict badges for the honest take."
    ]
  },
  seafood: {
    heading: "Fish, Lobster, Conch, Shrimp, and Beachside Seafood Spots",
    paragraphs: [
      "Seafood in Jamaica is more than a menu category. It can mean fried fish by the beach, lobster by the coast, conch when it is available, shrimp, escoveitch, steamed fish, and those spots people drive out of parish to find. This page maps seafood food spots across Jamaica using public signals, category data, and WhenWiHungry verdicts where available.",
      "Some seafood spots are directory listings — mapped to help you discover what is out there. Others carry a real critic verdict or a TikTok review from the anonymous WhenWiHungry critic. Public rating signals from Google are shown for discovery, but real verdicts are clearly marked so you always know what has been reviewed and what has not.",
      "Jamaican seafood culture is tied to place: the beach shack with a fry pan going, the sit-down spot overlooking the water, the weekend seafood cook-up that draws people from miles away. Some of the best seafood comes from spots that are hard to find but worth the search. Public signals can guide you there. Critic verdicts tell you whether they deliver."
    ]
  }
};

export async function generateMetadata({ searchParams }: BrowsePageProps): Promise<Metadata> {
  const params = await searchParams;
  const category = params.category?.toLowerCase();
  const categoryMeta = category ? CATEGORY_META[category] : null;

  return {
    title: categoryMeta?.title ?? "Restaurant Directory Jamaica",
    description:
      categoryMeta?.description ??
      "Browse Jamaican food spots by craving, parish, category, price, and public signal.",
    openGraph: {
      title: categoryMeta?.title ?? "Restaurant Directory Jamaica",
      description:
        categoryMeta?.description ??
        "Browse Jamaican food spots by craving, parish, category, price, and public signal.",
      images: [
        {
          url: "https://whenwihungry.vercel.app/og/whenwihungry-og.png",
          width: 1200,
          height: 630,
          alt: "WhenWiHungry — Jamaica's boldest food critic",
          type: "image/png"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      images: ["https://whenwihungry.vercel.app/og/whenwihungry-og.png"]
    }
  };
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;
  const q = params.q || params.query || (params as any).search || "";
  
  let allPlaces: PlaceV2[] = [];
  
  if (q) {
    allPlaces = await searchRestaurants(q);
  } else {
    allPlaces = await getAllApprovedPlaces();
  }

  const results = getFilteredPlaces({
    query: q,
    parish: params.parish,
    category: params.category,
    price: params.price,
    rating: params.rating,
    sort: params.sort
  }, allPlaces as any) as PlaceV2[];
  const view = params.view ?? "grid";

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: params.category
      ? `Best ${params.category} spots in Jamaica`
      : params.parish
        ? `Best food spots in ${params.parish}`
        : "Jamaican Food Directory",
    url: "https://whenwihungry.vercel.app/browse",
    numberOfItems: results.length,
    itemListElement: results.slice(0, 20).map((place, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://whenwihungry.vercel.app/places/${place.slug}`,
      name: place.name
    }))
  };

  return (
    <section className="section directory-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <div className="container">
        <div className="section-heading directory-heading">
          <div>
            <span className="eyebrow">Discovery</span>
            <h1>The Honest Shortlist.</h1>
            <p>
              Search by cravings, dishes, or parishes. No hype, just the truth about where to eat.
            </p>
          </div>
          <strong>{results.length} items found</strong>
        </div>
        
        <FilterChips />

        {/* ── Category SEO Intro Copy ── */}
        <CategoryIntro category={params.category} resultCount={results.length} />
        
        <SearchFilters
          activeCategory={params.category}
          activeParish={params.parish}
          activePrice={params.price}
          activeQuery={params.q}
          activeRating={params.rating}
          activeSort={params.sort}
          activeView={view}
          categories={categories}
          parishes={getParishStats(allPlaces).map((item) => item.name)}
        />
        <div className={`results-shell view-${view}`}>
          <div className="results-column directory-results">
            {results.length === 0 ? (
              <div className="card empty-state">
                <h2>No places found yet</h2>
                <p>Try another parish or a broader search term.</p>
              </div>
            ) : (
              results.map((place) => (
                <PlaceListCard 
                  key={place.slug} 
                  place={place} 
                  showMatchReason={Boolean(q)} 
                />
              ))
            )}
          </div>
          {view === "map" ? (
            <MapViewWrapper places={results} />
          ) : (
            <aside className="card map-placeholder">
              <span className="eyebrow">Map view</span>
              <h2>Nearby shortlist</h2>
              <p>
                Switch to the Map View to see interactive markers.
              </p>
              <ul className="hours-list">
                {results.slice(0, 4).map((place) => (
                  <li key={place.slug}>
                    {place.name} · {place.area}
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Category SEO Intro Copy ────────────────────────────────────────

function CategoryIntro({ category, resultCount }: { category?: string; resultCount: number }) {
  const key = category?.toLowerCase() ?? "";
  const intro = CATEGORY_INTRO[key];
  if (!intro) return null;

  return (
    <section
      style={{
        margin: "0 0 32px",
        padding: "28px 32px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid var(--wwh-border)",
        borderRadius: "14px"
      }}
    >
      <h2
        style={{
          margin: "0 0 18px",
          fontFamily: "var(--wwh-font-heading)",
          fontSize: "clamp(1.3rem, 2vw, 1.6rem)",
          color: "#fff",
          textTransform: "uppercase",
          letterSpacing: "0.02em"
        }}
      >
        {intro.heading}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {intro.paragraphs.map((text, i) => (
          <p
            key={i}
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.55)",
              fontFamily: "var(--wwh-font-body)",
              fontSize: "clamp(0.85rem, 1.1vw, 0.95rem)",
              lineHeight: 1.7,
              maxWidth: "760px"
            }}
          >
            {text}
          </p>
        ))}
      </div>
      <p
        style={{
          margin: "16px 0 0",
          color: "rgba(255,255,255,0.3)",
          fontFamily: "var(--wwh-font-body)",
          fontSize: "0.78rem"
        }}
      >
        {resultCount} mapped food spot{resultCount !== 1 ? "s" : ""} · Public signals for discovery · Critic verdicts where available
      </p>
    </section>
  );
}
