import Link from "next/link";
import type { PlaceV2 } from "@/lib/community";
import { PlaceListCard } from "@/components/browse/place-list-card";

/** Directory spots with a critic verdict in the database. */
export function LatestReviews({ places }: { places: PlaceV2[]; variant?: "reviews" | "listings" }) {
  const limited = places.slice(0, 6);
  if (!limited.length) return null;
  return <section className="section container" aria-labelledby="latest-verdicts-heading">
    <div className="section-heading">
      <div><h2 id="latest-verdicts-heading">Fresh verdicts</h2><p>The most recent critic calls in the directory.</p></div>
      <Link className="spots-rail-all" href="/reviews">All reviews</Link>
    </div>
    <div className="location-results">{limited.map(place => <PlaceListCard key={place.slug} place={place} />)}</div>
  </section>;
}
