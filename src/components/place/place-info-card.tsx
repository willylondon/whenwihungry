import type { Place } from "@/data/places";

type PlaceInfoCardProps = {
  place: Place;
};

export function PlaceInfoCard({ place }: PlaceInfoCardProps) {
  const hasPublicPhone = place.phone && !place.phone.includes("555");
  const hasPublicWebsite = place.website && !place.website.includes("example.com");

  return (
    <section className="card info-card">
      <h2>Plan your stop</h2>
      <div className="info-grid">
        <div>
          <strong>Address</strong>
          <p>{place.address}</p>
        </div>
        {hasPublicPhone && (
          <div>
            <strong>Phone</strong>
            <p>{place.phone}</p>
          </div>
        )}
        {hasPublicWebsite && (
          <div>
            <strong>Website</strong>
            <p>{place.website}</p>
          </div>
        )}
        <div>
          <strong>Hours</strong>
          <ul className="hours-list">
            {place.hours.map((hour) => (
              <li key={hour}>{hour}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
