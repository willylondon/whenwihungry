import Image from "next/image";
import Link from "next/link";

import type { Place } from "@/data/places";

type PlaceListCardProps = {
  place: Place;
};

export function PlaceListCard({ place }: PlaceListCardProps) {
  const hasPublicPhone = place.phone && !place.phone.includes("555");

  function isPlaceOpen(hours: string[]): boolean | null {
    if (!hours || hours.length === 0) return null;
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const jamTime = new Date(utc + 3600000 * -5);
    
    const currentHour = jamTime.getHours();
    const currentMinute = jamTime.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;

    for (const h of hours) {
      const match = h.match(/(\d{1,2})[:.](\d{2})\s*-\s*(\d{1,2})[:.](\d{2})/);
      if (match) {
        const startMinutes = parseInt(match[1]) * 60 + parseInt(match[2]);
        const endMinutes = parseInt(match[3]) * 60 + parseInt(match[4]);
        if (currentTotalMinutes >= startMinutes && currentTotalMinutes <= endMinutes) {
          return true;
        }
      } else if (h.toLowerCase().includes("24 hours") || h.toLowerCase().includes("all day")) {
        return true;
      }
    }
    return false;
  }

  const isOpen = isPlaceOpen(place.hours);

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
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span className="badge">{place.type}</span>
            {isOpen !== null && (
              <span
                className="badge"
                style={{
                  background: isOpen ? "rgba(46, 196, 182, 0.12)" : "rgba(239, 71, 111, 0.12)",
                  color: isOpen ? "var(--leaf)" : "var(--hot)",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  textTransform: "capitalize"
                }}
              >
                {isOpen ? "Open now" : "Closed"}
              </span>
            )}
          </div>
          {place.rating >= 4.5 ? (
            <span className="badge" style={{ background: "rgba(46, 196, 182, 0.12)", color: "var(--leaf)", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem" }}>WWH Approved</span>
          ) : place.rating >= 4.0 ? (
            <span className="badge" style={{ background: "rgba(255, 159, 28, 0.12)", color: "var(--accent)", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem" }}>Go Hungry</span>
          ) : place.rating >= 3.0 ? (
            <span className="badge" style={{ background: "rgba(154, 165, 177, 0.12)", color: "var(--muted)", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem" }}>Lunch Safe</span>
          ) : (
            <span className="badge" style={{ background: "rgba(239, 71, 111, 0.12)", color: "var(--hot)", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem" }}>Skip It</span>
          )}
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
