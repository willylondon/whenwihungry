import type { Place } from "@/data/places";

type PlaceHeaderProps = {
  place: Place;
};

export function PlaceHeader({ place }: PlaceHeaderProps) {
  return (
    <section className="detail-hero card">
      <div>
        <span className="eyebrow">{place.category}</span>
        <h1>{place.name}</h1>
        <p>{place.description}</p>
        <div className="detail-meta">
          <span>{place.rating.toFixed(1)} rating</span>
          <span>{place.reviewCount} reviews</span>
          <span>{place.priceRange}</span>
          <span>{place.parish}</span>
        </div>
      </div>
      <div className="feature-list">
        {place.features.map((feature) => (
          <span className="badge" key={feature}>
            {feature}
          </span>
        ))}
      </div>
    </section>
  );
}
