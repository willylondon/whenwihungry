import { PlaceListCard } from "@/components/browse/place-list-card";
import { SearchFilters } from "@/components/browse/search-filters";
import { categories, getFilteredPlaces, getParishStats } from "@/lib/places";

type BrowsePageProps = {
  searchParams: Promise<{
    q?: string;
    parish?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    view?: string;
  }>;
};

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;
  const results = getFilteredPlaces({
    query: params.q,
    parish: params.parish,
    category: params.category,
    price: params.price,
    rating: params.rating,
    sort: params.sort
  });
  const view = params.view ?? "grid";

  return (
    <section className="section directory-page">
      <div className="container">
        <div className="section-heading directory-heading">
          <div>
            <span className="eyebrow">Restaurants</span>
            <h1>Browse the places already worth a closer look.</h1>
            <p>
              A practical index for the reviews, cravings, and local food stops
              that make the When Wi Hungry shortlist.
            </p>
          </div>
          <strong>{results.length} items found</strong>
        </div>
        <SearchFilters
          activeCategory={params.category}
          activeParish={params.parish}
          activePrice={params.price}
          activeQuery={params.q}
          activeRating={params.rating}
          activeSort={params.sort}
          activeView={view}
          categories={categories}
          parishes={getParishStats().map((item) => item.name)}
        />
        <div className={`results-shell view-${view}`}>
          <div className="results-column directory-results">
            {results.length === 0 ? (
              <div className="card empty-state">
                <h2>No places found yet</h2>
                <p>Try another parish or a broader search term.</p>
              </div>
            ) : (
              results.map((place) => <PlaceListCard key={place.slug} place={place} />)
            )}
          </div>
          <aside className="card map-placeholder">
            <span className="eyebrow">Map view</span>
            <h2>Nearby shortlist</h2>
            <p>
              Map markers can live here later. For now, use the shortlist to
              compare areas quickly.
            </p>
            <ul className="hours-list">
              {results.slice(0, 4).map((place) => (
                <li key={place.slug}>
                  {place.name} · {place.area}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
