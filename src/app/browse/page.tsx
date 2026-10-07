import { Pagination } from "@/components/browse/pagination";
import { paginate, normalizeBrowseParams } from "@/lib/browse-pagination";
import { serializeJsonLd } from "@/lib/security/json-ld";
import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import { MapViewWrapper } from "@/components/browse/map-view-wrapper";
import { PlaceListCard } from "@/components/browse/place-list-card";
import { SearchFilters } from "@/components/browse/search-filters";
import { getAllApprovedPlaces, searchRestaurants, type PlaceV2 } from "@/lib/community";
import { categories, getFilteredPlaces, getParishStats } from "@/lib/places";

type BrowsePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

import { FilterChips } from "@/components/browse/filter-chips";

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  jerk: {
    title: "Jerk Restaurants & Food Spots in Jamaica",
    description:
      "Discover jerk chicken, jerk pork, and pimento-wood cooked food spots across Jamaica."
  },
  seafood: {
    title: "Seafood Restaurants in Jamaica",
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
  const params = normalizeBrowseParams(await searchParams);
  const category = params.category?.trim().toLowerCase().replace(/-/g, " ");
  const categoryName = categories.find(item => item.toLowerCase() === category);
  const categoryMeta = category && Object.hasOwn(CATEGORY_META, category) ? CATEGORY_META[category] : categoryName ? {
    title: `${categoryName} Food Spots in Jamaica`,
    description: `Find ${categoryName.toLowerCase()} food spots across Jamaica. Compare parish, location and available listing details, with critic verdicts where published.`
  } : null;

  const knownCategory = category && categories.some(item => item.toLowerCase() === category);
  const isFiltered = Boolean(category && !knownCategory) || Object.entries(params).some(([key, value]) => Boolean(value) && key !== "category" && key !== "page");
  const collection = knownCategory ? `/browse?category=${encodeURIComponent(category)}` : "/browse";
  const results = isFiltered ? [] : getFilteredPlaces({ category }, await getAllApprovedPlaces());
  const pagination = paginate(results, params.page);
  const invalidPage = Boolean(params.page && Number(params.page) !== pagination.page);
  const canonical = !isFiltered && pagination.page > 1 ? `${collection}${knownCategory ? "&" : "?"}page=${pagination.page}` : collection;
  return {
    alternates: { canonical },
    ...(isFiltered || invalidPage || results.length === 0 ? { robots: { index: false, follow: true } } : {}),
    title: categoryMeta?.title ?? "Restaurant Directory Jamaica",
    description:
      categoryMeta?.description ??
      "Browse Jamaican food spots by craving, parish, category, price, and public signal.",
    openGraph: {
      url: siteUrl(canonical),
      title: categoryMeta?.title ?? "Restaurant Directory Jamaica",
      description:
        categoryMeta?.description ??
        "Browse Jamaican food spots by craving, parish, category, price, and public signal.",
      images: [
        {
          url: siteUrl("/og/whenwihungry-og.png"),
          width: 1200,
          height: 630,
          alt: "WhenWiHungry — Jamaica's boldest food critic",
          type: "image/png"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      images: [siteUrl("/og/whenwihungry-og.png")]
    }
  };
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = normalizeBrowseParams(await searchParams);
  const q = params.q || params.query || params.search || "";
  
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
  }, allPlaces) as PlaceV2[];
  const view = ["grid", "list", "map"].includes(params.view ?? "") ? params.view! : "grid";
  const pagination = paginate(results, params.page);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: params.category
      ? `Best ${params.category} spots in Jamaica`
      : params.parish
        ? `Best food spots in ${params.parish}`
        : "Jamaican Food Directory",
    url: siteUrl("/browse"),
    numberOfItems: results.length,
    itemListElement: pagination.items.map((place, index) => ({
      "@type": "ListItem",
      position: pagination.offset + index + 1,
      url: siteUrl(`/places/${place.slug}`),
      name: place.name
    }))
  };

  return (
    <section className="directory-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(itemListSchema) }}
      />
      <div className="container">
        <div className="section-heading directory-heading">
          <div>
            <h1>The honest shortlist</h1>
            <p>Search by craving, dish or parish. No hype, just where to eat.</p>
          </div>
          <strong>{results.length} food spots</strong>
        </div>
        
        <FilterChips />

        {/* ── Category SEO Intro Copy ── */}
        <CategoryIntro category={params.category} resultCount={results.length} />
        
        <SearchFilters
          activeCategory={params.category}
          activeParish={params.parish}
          activePrice={params.price}
          activeQuery={q}
          activeRating={params.rating}
          activeSort={params.sort}
          activeView={view}
          categories={categories}
          parishes={getParishStats(allPlaces).map((item) => item.name)}
        />
        {results.length > 0 && <p className="result-summary" role="status">Showing {pagination.offset + 1}–{pagination.offset + pagination.items.length} of {results.length} food spots</p>}
        <div className={`results-shell view-${view}`}>
          <div className="results-column directory-results">
            {results.length === 0 ? (
              <div className="card empty-state">
                <h2>No places found yet</h2>
                <p>Try another parish or a broader search term.</p>
              </div>
            ) : (
              pagination.items.map((place) => (
                <PlaceListCard 
                  key={place.slug} 
                  place={place} 
                  showMatchReason={Boolean(q)} 
                />
              ))
            )}
          </div>
          {view === "map" ? (
            <div><p className="result-summary">Map shows this page’s results with known coordinates.</p><MapViewWrapper places={pagination.items.map(({ slug, name, area, parish, lat, lng }) => ({ slug, name, area, parish, lat, lng }))} /></div>
          ) : (
            <aside className="card map-placeholder">
              <span className="eyebrow">Map view</span>
              <h2>Nearby shortlist</h2>
              <p>Choose Map and apply filters to see places with known coordinates.</p>
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
        <Pagination path="/browse" params={params} page={pagination.page} totalPages={pagination.totalPages} />
      </div>
    </section>
  );
}

// ── Category SEO Intro Copy ────────────────────────────────────────

function CategoryIntro({ category }: { category?: string; resultCount?: number }) {
  const key = category?.toLowerCase() ?? "";
  const intro = Object.hasOwn(CATEGORY_INTRO, key) ? CATEGORY_INTRO[key] : null;
  if (!intro) return null;
  const [first, ...rest] = intro.paragraphs;
  return <div className="category-intro">
    <h2>{intro.heading}</h2>
    <p>{first}</p>
    {rest.length > 0 && <details>
      <summary>Read more</summary>
      {rest.map(text => <p key={text.slice(0, 32)}>{text}</p>)}
    </details>}
  </div>;
}
