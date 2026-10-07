import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllApprovedPlaces } from "@/lib/community";
import { PlaceListCard } from "@/components/browse/place-list-card";
import { Pagination } from "@/components/browse/pagination";
import { SectionHeader } from "@/components/ui/section-header";
import { normalizeParish, getAllParishNames, getParishDisplayName, isPlaceSafeForParishPage } from "@/lib/location-validation";
import { paginate, normalizeBrowseParams } from "@/lib/browse-pagination";
import { serializeJsonLd } from "@/lib/security/json-ld";
import { siteUrl } from "@/lib/site-url";

type Props = { params: Promise<{ location: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

function parishForSlug(location: string) {
  const parish = normalizeParish(location.replace(/-/g, " "));
  if (!getAllParishNames().includes(parish)) notFound();
  return parish;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { location } = await params;
  const parish = parishForSlug(location);
  const displayName = parish === "kingston" ? "Kingston & St. Andrew" : getParishDisplayName(parish);
  const collection = `/restaurants/${parish.replace(/ /g, "-")}`;
  const query = normalizeBrowseParams(await searchParams);
  const results = (await getAllApprovedPlaces()).filter(place => isPlaceSafeForParishPage(place, parish));
  const pagination = paginate(results, query.page);
  const canonical = `${collection}${pagination.page > 1 ? `?page=${pagination.page}` : ""}`;
  const invalidPage = Boolean(query.page && Number(query.page) !== pagination.page);
  return {
    title: `Restaurants in ${displayName}`,
    description: `Explore food spots in ${displayName}, with listing information and critic verdicts where available.`,
    alternates: { canonical },
    ...(invalidPage || results.length === 0 ? { robots: { index: false, follow: true } } : {}),
    openGraph: { title: `Restaurants in ${displayName}`, url: siteUrl(canonical), images: [siteUrl("/og/whenwihungry-og.png")] }
  };
}

export default async function LocationPage({ params, searchParams }: Props) {
  const { location } = await params;
  const query = normalizeBrowseParams(await searchParams);
  const parish = parishForSlug(location);
  const displayName = parish === "kingston" ? "Kingston & St. Andrew" : getParishDisplayName(parish);
  const results = (await getAllApprovedPlaces()).filter(place => isPlaceSafeForParishPage(place, parish));
  const pagination = paginate(results, query.page);
  const itemListSchema = {
    "@context": "https://schema.org", "@type": "ItemList",
    name: `Restaurants in ${displayName}`, url: siteUrl(`/restaurants/${location}`), numberOfItems: results.length,
    itemListElement: pagination.items.map((place, index) => ({
      "@type": "ListItem", position: pagination.offset + index + 1, url: siteUrl(`/places/${place.slug}`), name: place.name
    }))
  };
  return <section className="directory-page section">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(itemListSchema) }} />
    <div className="container">
      <SectionHeader headingLevel={1} heading={`Food spots in ${displayName}`} subtext="Directory listings, with our verdicts marked wherever we've reviewed." />
      <LocationIntro location={location} displayName={displayName} resultCount={results.length} />
      <p className="result-summary">{results.length === 0 ? `No restaurants found in ${displayName} yet.` : `Showing ${pagination.offset + 1}–${pagination.offset + pagination.items.length} of ${results.length} food spots`}</p>
      <div className="location-results">{pagination.items.map(place => <PlaceListCard key={place.slug} place={place} />)}</div>
      <Pagination path={`/restaurants/${location}`} params={query} page={pagination.page} totalPages={pagination.totalPages} />
    </div>
  </section>;
}

// ── SEO Intro Copy ──────────────────────────────────────────────────

const LOCATION_INTRO: Record<string, string[]> = {
  kingston: [
    "Kingston is one of Jamaica's most active food zones, where roadside jerk and curry goat lunch stops sit alongside rooftop date-night spots, late-night food searches, and everything in between. This page maps food spots across Kingston using public signals, location data, category tags, and WhenWiHungry verdicts where available.",
    "Not every spot listed here has been reviewed yet. Some are directory listings — mapped and tagged so you know what is out there. Others have already been visited, tasted, and given a critic verdict or a TikTok review. WhenWiHungry verdicts are added as they go live.",
    "You will find jerk stops, seafood runs, curry goat lunch lines, dessert pulls, and a few unpolished local spots that might not look like much but get the flavours right. Public rating signals from Google are shown for discovery, but real verdicts are clearly separated — so you always know what has been reviewed and what has not."
  ],
  portland: [
    "Portland food is different. You have beachside seafood, jerk smoke near the road, riverside stops, small local favourites, and tourist-heavy spots that people still want honest guidance on. This page helps you discover what Portland offers, from casual beach fry to sit-down jerk on the coast.",
    "Listed spots are mapped using public signals, parish data, and community input. Critic verdicts and TikTok reviews are added as the anonymous critic visits. Where a spot has been reviewed, you will see the verdict clearly marked — not mixed in with directory listings.",
    "Seafood, jerk, and local riverside cooking dominate the Portland food map, but the real draws are the settings: eating by the water, stopping mid-road-trip for a plate, or discovering a small spot that does one thing really well. Use public ratings as a starting signal, but look for the critic verdict badges for the honest take."
  ]
};

function LocationIntro({ location, displayName }: { location: string; displayName: string; resultCount?: number }) {
  const locationKey = location.toLowerCase().replace(/-/g, "");
  const paragraphs = Object.hasOwn(LOCATION_INTRO, locationKey) ? LOCATION_INTRO[locationKey] : null;
  if (!paragraphs) return null;
  const [first, ...rest] = paragraphs;
  return <div className="location-intro">
    <p>{first}</p>
    {rest.length > 0 && <details>
      <summary>More about eating in {displayName}</summary>
      {rest.map(text => <p key={text.slice(0, 32)}>{text}</p>)}
    </details>}
  </div>;
}
