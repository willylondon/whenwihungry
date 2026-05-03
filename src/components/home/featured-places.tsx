import Image from "next/image";
import Link from "next/link";

import type { Place } from "@/data/places";

type FeaturedPlacesProps = {
  places: Place[];
};

export function FeaturedPlaces({ places }: FeaturedPlacesProps) {
  return (
    <section className="section" id="reviews">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Reviewed places</span>
            <h2>Start with the restaurants already on my list.</h2>
          </div>
          <Link className="btn btn-outline" href="/browse">
            View all places
          </Link>
        </div>
        <div className="card-grid">
          {places.map((place) => (
            <Link className="place-card card" href={`/places/${place.slug}`} key={place.slug}>
              <div className="card-image-wrap">
                <Image
                  alt={place.name}
                  className="card-image"
                  height={320}
                  loading="lazy"
                  src={place.image}
                  width={480}
                />
              </div>
              <div className="card-body">
                <div className="post-date">Reviewed by When Wi Hungry</div>
                <h3>{place.name}</h3>
                <div className="card-topline">
                  <span className="badge">{place.category}</span>
                  <span className="rating">★ {place.rating.toFixed(1)}</span>
                </div>
                <p>{place.description}</p>
                <div className="card-meta">
                  <span>{place.parish}</span>
                  <span>{place.reviewCount} reviews</span>
                  <span>{place.priceRange}</span>
                </div>
                <strong className="read-more">Read more &rarr;</strong>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
