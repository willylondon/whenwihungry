import Link from "next/link";
import type { PlaceV2 } from "@/lib/community";
import { getAllParishNames, getParishDisplayName, isPlaceSafeForParishPage } from "@/lib/location-validation";

export function ParishLinks({ places }: { places: PlaceV2[] }) {
  const parishes = getAllParishNames().map(parish => ({
    parish,
    name: parish === "kingston" ? "Greater Kingston" : getParishDisplayName(parish),
    count: places.filter(place => isPlaceSafeForParishPage(place, parish)).length
  })).filter(parish => parish.count > 0).sort((a, b) => b.count - a.count);
  if (!parishes.length) return null;
  return <section className="section container dark-section" aria-labelledby="parish-heading">
    <div className="section-heading"><div>
      <span className="eyebrow">Explore Jamaica</span>
      <h2 id="parish-heading">Find food spots by parish</h2>
      <p>Choose a parish to browse its listings. Greater Kingston covers the whole metro area, including its St. Andrew neighbourhoods.</p>
    </div></div>
    <nav aria-label="Restaurants by parish" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
      {parishes.map(({ parish, name, count }) => <Link className="card" key={parish} href={`/restaurants/${parish.replace(/ /g, "-")}`} style={{ padding: "20px", display: "block" }}>
        <strong>{name}</strong><span style={{ display: "block", marginTop: "6px", color: "var(--wwh-muted)" }}>{count} food {count === 1 ? "spot" : "spots"}</span>
      </Link>)}
    </nav>
  </section>;
}
