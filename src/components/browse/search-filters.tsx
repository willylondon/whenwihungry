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

export function SearchFilters({
  activeCategory,
  activeParish,
  activePrice,
  activeQuery,
  activeRating,
  activeSort,
  activeView,
  categories,
  parishes
}: SearchFiltersProps) {
  return (
    <form className="filters card directory-filters">
      <div className="filter-head">
        <span className="eyebrow">Filters</span>
        <div className="view-controls" aria-label="View controls">
          {["grid", "list", "map"].map((view) => (
            <label className={activeView === view || (!activeView && view === "grid") ? "active" : ""} key={view}>
              <input
                defaultChecked={activeView === view || (!activeView && view === "grid")}
                name="view"
                type="radio"
                value={view}
              />
              {view}
            </label>
          ))}
        </div>
      </div>
      <div style={{ position: "relative", gridColumn: "span 2" }}>
        <input
          className="filter-input"
          defaultValue={activeQuery}
          name="q"
          placeholder="What yuh hungry for?"
          type="search"
          style={{
            width: "100%",
            paddingLeft: "44px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--wwh-border)",
            borderRadius: "8px",
            height: "48px",
            fontSize: "1rem",
            color: "#fff"
          }}
        />
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="rgba(255,255,255,0.3)" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <select className="filter-input" defaultValue={activeParish} name="parish">
        <option value="">All parishes</option>
        {parishes.map((parish) => (
          <option key={parish} value={parish}>
            {parish}
          </option>
        ))}
      </select>
      <select className="filter-input" defaultValue={activeCategory} name="category">
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <select className="filter-input" defaultValue={activePrice} name="price">
        <option value="">Any price</option>
        <option value="$">$</option>
        <option value="$$">$$</option>
        <option value="$$$">$$$</option>
      </select>
      <select className="filter-input" defaultValue={activeRating} name="rating">
        <option value="">Any rating</option>
        <option value="4.8">4.8 and up</option>
        <option value="4.6">4.6 and up</option>
        <option value="4.4">4.4 and up</option>
      </select>
      <select className="filter-input" defaultValue={activeSort} name="sort">
        <option value="popular">Popular listings</option>
        <option value="rating">Highest rated</option>
        <option value="az">A to Z</option>
        <option value="price-low">Price low to high</option>
        <option value="price-high">Price high to low</option>
      </select>
      <button className="btn btn-primary" type="submit">
        Apply filters
      </button>
    </form>
  );
}
