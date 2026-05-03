import Link from "next/link";

type CategorySectionProps = {
  categories: string[];
};

export function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="section alt">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Browse like a local</span>
            <h2>Pick the mission, then find the food.</h2>
          </div>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <Link
              className="category-chip card"
              href={`/browse?category=${encodeURIComponent(category)}`}
              key={category}
            >
              <span className="category-number">{String(index + 1).padStart(2, "0")}</span>
              <strong>{category}</strong>
              <span>{getCategoryLine(category)}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function getCategoryLine(category: string) {
  const lines: Record<string, string> = {
    Jerk: "Smoke, spice, festival, and no dry chicken business.",
    "Cook Shop": "Rice, peas, gravy, queue moving, cash ready.",
    "Lunch Run": "Fast plates for people with 30 minutes and standards.",
    Seafood: "Fry fish, bammy, pepper sauce, and sea breeze.",
    Patties: "Flaky crust, cocoa bread, and quick decisions.",
    "Date Night": "Pretty enough for plans, still serious about flavor.",
    "Cheap Eats": "Big value without the sad plate energy.",
    "Late Night": "After-hours food when everybody suddenly hungry."
  };

  return lines[category] ?? "See the places worth checking first.";
}
