import { Metadata } from "next";
import { searchRestaurants } from "@/lib/community";
import { PlaceListCard } from "@/components/browse/place-list-card";
import { SectionHeader } from "@/components/ui/section-header";

type Props = {
  params: Promise<{ location: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location } = await params;
  const formattedLocation = location.charAt(0).toUpperCase() + location.slice(1).replace("-", " ");
  
  return {
    title: `Best Restaurants in ${formattedLocation} | When Wi Hungry`,
    description: `Discover the most honest food reviews for restaurants in ${formattedLocation}, Jamaica. No hype, just the truth.`,
    openGraph: {
      title: `Best Restaurants in ${formattedLocation}`,
      description: `Unfiltered reviews for the top food spots in ${formattedLocation}.`,
    }
  };
}

export default async function LocationPage({ params }: Props) {
  const { location } = await params;
  const formattedLocation = location.charAt(0).toUpperCase() + location.slice(1).replace("-", " ");
  const results = await searchRestaurants(formattedLocation);

  return (
    <main style={{ background: "var(--wwh-bg)", minHeight: "100vh", padding: "100px 0" }}>
      <div className="container">
        <SectionHeader 
          eyebrow="Local Discovery"
          heading={`Best in ${formattedLocation}`}
          subtext={`Showing the highest ranked food spots in ${formattedLocation} based on critic and community scores.`}
        />
        
        <div style={{ display: "grid", gap: "24px", marginTop: "48px" }}>
          {results.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.4)" }}>No restaurants found in this location yet.</p>
          ) : (
            results.map((place) => <PlaceListCard key={place.slug} place={place} />)
          )}
        </div>
      </div>
    </main>
  );
}
