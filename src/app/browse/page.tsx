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

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;
  const query = params.query || params.q;
  
  let allPlaces: PlaceV2[] = [];
  
  if (query) {
    allPlaces = await searchRestaurants(query);
  } else {
    allPlaces = await getAllApprovedPlaces();
  }

  const results = getFilteredPlaces({
    query: query,
    parish: params.parish,
    category: params.category,
    price: params.price,
    rating: params.rating,
    sort: params.sort
  }, allPlaces as any) as PlaceV2[];
  const view = params.view ?? "grid";


  return (
    <section className="section directory-page">
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
                  showMatchReason={Boolean(query)} 
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
