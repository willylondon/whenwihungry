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
      title: categoryMeta?.title ?? "Restaurant Directory Jamaica | WhenWiHungry",
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
