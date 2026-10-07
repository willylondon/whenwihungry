type SearchFiltersProps = {
  parishes: string[];
  categories: string[];
  activeQuery?: string;
  activeParish?: string;
  activeCategory?: string;
  activePrice?: string;
  activeRating?: string;
  activeSort?: string;
  activeView?: string;
};

export function SearchFilters({ activeCategory, activeParish, activePrice, activeQuery,
  activeRating, activeSort, activeView = "grid", categories, parishes }: SearchFiltersProps) {
  return (
    <form action="/browse" method="get" className="filters card directory-filters" key={[activeQuery, activeCategory, activeParish, activePrice, activeRating, activeSort, activeView].join("|")}>
      <div className="filter-head">
        <span className="eyebrow">Filters</span>
        <fieldset className="view-controls">
          <legend className="sr-only">Results view</legend>
          {["grid", "list", "map"].map((view) => (
            <label key={view}>
              <input defaultChecked={activeView === view} name="view" type="radio" value={view} />
              <span>{view}</span>
            </label>
          ))}
        </fieldset>
      </div>
      <label className="filter-field filter-search">
        <span>Search food spots</span>
        <input className="filter-input" defaultValue={activeQuery} name="q" placeholder="What yuh hungry for?" type="search" />
      </label>
      <label className="filter-field"><span>Parish</span>
        <select className="filter-input" defaultValue={activeParish ?? ""} name="parish">
          <option value="">All parishes</option>
          {Array.from(new Set([...parishes, ...(activeParish ? [activeParish] : [])])).map(parish => <option key={parish} value={parish}>{parish}</option>)}
        </select>
      </label>
      <label className="filter-field"><span>Category</span>
        <select className="filter-input" defaultValue={activeCategory?.toLowerCase() ?? ""} name="category">
          <option value="">All categories</option>
          {Array.from(new Set([...categories.map(category => category.toLowerCase()), ...(activeCategory ? [activeCategory.toLowerCase()] : [])])).map(category => <option key={category} value={category.toLowerCase()}>{category}</option>)}
        </select>
      </label>
      <label className="filter-field"><span>Price</span>
        <select className="filter-input" defaultValue={activePrice ?? ""} name="price">
          <option value="">Any price</option>
          {["$", "$$", "$$$", "$$$$"].map(price => <option key={price} value={price}>{price}</option>)}
        </select>
      </label>
      <label className="filter-field"><span>Minimum rating (out of 5)</span>
        <select className="filter-input" defaultValue={activeRating ?? ""} name="rating">
          <option value="">Any rating</option>
          {["4.8", "4.6", "4.4"].map(rating => <option key={rating} value={rating}>{rating} and up</option>)}
        </select>
      </label>
      <label className="filter-field"><span>Sort by</span>
        <select className="filter-input" defaultValue={activeSort ?? ""} name="sort">
          <option value="">Recommended / relevance</option>
          <option value="popular">Most ratings</option><option value="rating">Highest rated</option>
          <option value="az">A to Z</option><option value="price-low">Price low to high</option><option value="price-high">Price high to low</option>
        </select>
      </label>
      <button className="btn btn-primary" type="submit">Apply filters</button>
    </form>
  );
}
