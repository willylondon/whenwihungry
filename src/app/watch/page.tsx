import type { Metadata } from "next";
import { getPlacesWithVideos } from "@/lib/community";
import { VideoCard } from "@/components/ui/video-card";
import { SectionHeader } from "@/components/ui/section-header";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Watch | WhenWiHungry",
  description: "Unfiltered food reviews on video. The realest take on Jamaica's food scene."
};

export default async function WatchPage() {
  const videoPlaces = await getPlacesWithVideos();

  return (
    <main style={{ background: "var(--wwh-bg)", minHeight: "100vh", padding: "80px 0" }}>
      <div style={{ width: "min(1200px, calc(100% - 40px))", margin: "0 auto" }}>
        <div style={{ marginBottom: "64px" }}>
          <SectionHeader
            eyebrow="The Full Unfiltered Take"
            heading="Watch Reviews"
            subtext="Real reactions, no corporate filters. See the food before you spend the money."
          />
        </div>

        {videoPlaces.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "24px"
            }}
          >
            {videoPlaces.map((place) => (
              <VideoCard key={place.slug} place={place} />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "80px 40px",
              background: "var(--wwh-card)",
              border: "1px solid var(--wwh-border)",
              borderRadius: "24px",
              textAlign: "center"
            }}
          >
            <h2 style={{ fontFamily: "var(--wwh-font-heading)", color: "#fff", fontSize: "2rem", marginBottom: "16px" }}>
              COMING SOON
            </h2>
            <p style={{ color: "var(--wwh-muted)", fontFamily: "var(--wwh-font-body)", maxWidth: "500px", margin: "0 auto 24px" }}>
              We're currently editing the freshest reviews from the field. Stay tuned for more opinionated takes.
            </p>
            <Link
              href="/browse"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                background: "var(--wwh-accent)",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 700
              }}
            >
              Browse Text Reviews
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
