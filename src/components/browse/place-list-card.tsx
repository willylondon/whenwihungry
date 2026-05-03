import Image from "next/image";
import Link from "next/link";

import type { Place } from "@/data/places";

type PlaceListCardProps = {
  place: Place;
};

export function PlaceListCard({ place }: PlaceListCardProps) {
  const hasPublicPhone = place.phone && !place.phone.includes("555");

  return (
    <Link className="browse-card card" href={`/places/${place.slug}`}>
      <div className="browse-image-wrap">
        <Image
          alt={place.name}
          className="browse-image"
          height={220}
          loading="lazy"
          src={place.image}
          width={320}
        />
      </div>
      <div className="browse-body">
        <div className="post-date">Reviewed by When Wi Hungry</div>
        <h3>{place.name}</h3>
        <div className="card-topline">
          <span className="badge">{place.type}</span>
          <span className="rating">★ {place.rating.toFixed(1)}</span>
        </div>
        <p>{place.description}</p>
        <div className="listing-details">
          <span>{place.category}</span>
          <span>{place.priceRange}</span>
          <span>{hasPublicPhone ? place.phone : "Contact on profile"}</span>
        </div>
        <div className="card-meta">
          <span>{place.parish}</span>
          <span>{place.area}</span>
          <span>{place.reviewCount} reviews</span>
        </div>
        <strong className="read-more">Open review &rarr;</strong>
      </div>
    </Link>
  );
}
