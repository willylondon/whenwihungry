import Image from "next/image";
import Link from "next/link";
import type { PlaceV2 } from "@/lib/community";
import { hasListingPhoto } from "@/lib/image-config";
import { getAllParishNames, getParishDisplayName, isPlaceSafeForParishPage } from "@/lib/location-validation";
import { getFilteredPlaces } from "@/lib/places";

export function ParishLinks({ places }: { places: PlaceV2[] }) {
  // Recommendation order, so each parish's cover is one of its best-presented spots.
  const ranked = getFilteredPlaces({}, places) as PlaceV2[];
  const parishes = getAllParishNames().map(parish => {
    const inParish = places.filter(place => isPlaceSafeForParishPage(place, parish));
    return {
      parish,
      name: parish === "kingston" ? "Greater Kingston" : getParishDisplayName(parish),
      count: inParish.length,
      cover: ranked.find(place => hasListingPhoto(place.image) && inParish.includes(place))
    };
  }).filter(parish => parish.count > 0).sort((a, b) => b.count - a.count);
  if (!parishes.length) return null;
  return <section className="section container" aria-labelledby="parish-heading">
    <div className="section-heading"><div>
      <h2 id="parish-heading">Eat your way around the island</h2>
      <p>Pick a parish. Greater Kingston covers the whole metro area, including its St. Andrew neighbourhoods.</p>
    </div></div>
    <nav aria-label="Restaurants by parish" className="parish-grid">
      {parishes.map(({ parish, name, count, cover }) => <Link className="parish-card" key={parish} href={`/restaurants/${parish.replace(/ /g, "-")}`}>
        {cover && <Image src={cover.image} alt="" fill sizes="(max-width: 640px) 50vw, 240px" />}
        <span className="parish-card-text"><strong>{name}</strong><span>{count} food {count === 1 ? "spot" : "spots"}</span></span>
      </Link>)}
    </nav>
  </section>;
}
