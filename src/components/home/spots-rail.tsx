import Image from "next/image";
import Link from "next/link";
import type { PlaceV2 } from "@/lib/community";

/** Photo-led strip of food spots for the homepage. Scrolls sideways on phones. */
export function SpotsRail({ places }: { places: PlaceV2[] }) {
  if (!places.length) return null;
  return <section className="section container dark-section spots-rail" aria-labelledby="spots-rail-heading">
    <div className="section-heading spots-rail-heading">
      <div>
        <span className="eyebrow">Around the island</span>
        <h2 id="spots-rail-heading">Spots worth a look</h2>
        <p>A different corner of Jamaica in every card. Not reviewed yet, but on our radar.</p>
      </div>
      <Link className="text-link spots-rail-all" href="/browse">Browse all food spots →</Link>
    </div>
    <ul className="spots-rail-list">
      {places.map(place => <li key={place.slug}>
        <Link className="spots-rail-card" href={`/places/${place.slug}`}>
          <span className="spots-rail-image">
            <Image src={place.image} alt="" fill sizes="(max-width: 720px) 72vw, 280px" />
            {place.image_credit && <span className="photo-credit">Photo: {place.image_credit}</span>}
          </span>
          <span className="spots-rail-body">
            <strong>{place.name}</strong>
            <span>{[place.category, place.parish].filter(Boolean).join(" · ")}</span>
          </span>
        </Link>
      </li>)}
    </ul>
  </section>;
}
