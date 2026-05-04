import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getRelatedPlaces,
  getPlaceBySlug,
} from "@/lib/places";
import {
  getApprovedCommunityPlaceBySlug,
  getCommunityComments,
  getCommunityRestaurant,
  getCurrentUser
} from "@/lib/community";
import { VerdictBadge } from "@/components/ui/verdict-badge";
import { ReviewCard } from "@/components/ui/review-card";
import { getVerdictFromRating } from "@/lib/verdict";
import { CommunityFeedback } from "@/components/place/community-feedback";
import { TiktokEmbed } from "@/components/place/tiktok-embed";
import { SocialShare } from "@/components/place/social-share";

type PlacePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PlacePageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = getPlaceBySlug(slug) ?? (await getApprovedCommunityPlaceBySlug(slug));
  if (!place) return {};

  const title = `${place.name} | WhenWiHungry`;
  const description = place.description || `${place.name} — ${place.category || "Jamaican pick"} in ${place.parish}.`;
  const imageUrl = place.image || "https://whenwihungry.vercel.app/logo.png";
  const canonicalUrl = `https://whenwihungry.vercel.app/places/${place.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "WhenWiHungry",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: place.name
        }
      ],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    }
  };
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { slug } = await params;
  const place = getPlaceBySlug(slug) ?? (await getApprovedCommunityPlaceBySlug(slug));

  if (!place) {
    notFound();
  }

  const [community, user] = await Promise.all([
    getCommunityRestaurant(place.slug),
    getCurrentUser()
  ]);
  const communityComments = community
    ? await getCommunityComments(community.id)
    : [];

  const related = getRelatedPlaces(place.slug);
  const verdict = getVerdictFromRating(place.rating);

  const jsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: place.name
  };

  if (place.image) jsonLd.image = place.image;
  if (place.description) jsonLd.description = place.description;
  if (place.category) jsonLd.servesCuisine = place.category;
  if (place.priceRange) jsonLd.priceRange = place.priceRange;
  if (place.phone && !place.phone.includes("555")) jsonLd.telephone = place.phone;

  return (
    <article style={{ background: "var(--wwh-bg)", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          minHeight: "60vh",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${place.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.4)"
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(11,11,11,1) 0%, rgba(11,11,11,0.5) 50%, rgba(11,11,11,0.1) 100%)"
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "min(900px, calc(100% - 40px))",
            margin: "0 auto",
            padding: "64px 0 60px"
          }}
        >
          {/* Breadcrumb */}
          <div style={{ marginBottom: "20px", display: "flex", gap: "8px", alignItems: "center" }}>
            <Link
              href="/browse"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "var(--wwh-font-body)",
                fontSize: "0.82rem",
                textDecoration: "none"
              }}
            >
              Browse
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.82rem" }}>/</span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--wwh-font-body)", fontSize: "0.82rem" }}>
              {place.category}
            </span>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <VerdictBadge verdict={verdict} size="lg" />
          </div>

          <h1
            style={{
              margin: "0 0 20px",
              fontFamily: "var(--wwh-font-heading)",
              fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
              color: "#fff",
              lineHeight: 0.95,
              textTransform: "uppercase"
            }}
          >
            {place.name}
          </h1>

          <blockquote
            style={{
              margin: "0 0 24px",
              padding: "0 0 0 16px",
              borderLeft: "3px solid var(--wwh-accent)",
              color: "rgba(255,255,255,0.7)",
              fontFamily: "var(--wwh-font-body)",
              fontSize: "1.1rem",
              fontStyle: "italic",
              lineHeight: 1.65
            }}
          >
            &ldquo;{place.description || "The food speaks for itself."}&rdquo;
          </blockquote>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--wwh-font-body)", fontSize: "0.85rem" }}>
              📍 {place.address || place.parish}
            </span>
            <SocialShare name={place.name} url={`https://whenwihungry.vercel.app/places/${place.slug}`} />
          </div>
        </div>
      </section>

      {/* ── Video embed ── */}
      {(() => {
        const videoMap: Record<string, string> = {
          "usain-bolt-s-tracks-records-kingston": "https://vt.tiktok.com/ZS9Q8mN8F/",
          "devon-house-i-scream-kingston": "https://vt.tiktok.com/ZS9Q8qJs1/",
          "miss-t-s-kitchen-st-ann": "https://vt.tiktok.com/ZS9Q8uQst/",
          "scotchies-coral-gardens-st-james": "https://vt.tiktok.com/ZS9Q8gU2B/",
          "scotchies-draxhall-st-ann": "https://vt.tiktok.com/ZS9Q8gU2B/"
        };
        const videoUrl = videoMap[place.slug];
        if (!videoUrl) return null;

        return (
          <section
            id="video"
            style={{
              background: "#000",
              padding: "48px 0",
              display: "flex",
              justifyContent: "center"
            }}
          >
            <div style={{ width: "min(900px, calc(100% - 40px))" }}>
              <p
                style={{
                  margin: "0 0 20px",
                  fontFamily: "var(--wwh-font-body)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  color: "var(--wwh-accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em"
                }}
              >
                Watch the Review
              </p>
              <div
                style={{
                  position: "relative",
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: "var(--wwh-card)",
                  border: "1px solid var(--wwh-border)",
                  display: "flex",
                  justifyContent: "center",
                  padding: "24px"
                }}
              >
                <blockquote
                  className="tiktok-embed"
                  cite={videoUrl}
                  data-video-id=""
                  style={{
                    maxWidth: "325px",
                    width: "100%",
                    minHeight: "575px",
                    margin: 0
                  }}
                >
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "12px",
                      padding: "12px 24px",
                      background: "var(--wwh-accent)",
                      color: "#fff",
                      fontFamily: "var(--wwh-font-body)",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      borderRadius: "8px",
                      textDecoration: "none"
                    }}
                  >
                    Watch on TikTok →
                  </a>
                </blockquote>
                <script async src="https://www.tiktok.com/embed.js" />
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── Main content ── */}
      <div
        style={{
          width: "min(900px, calc(100% - 40px))",
          margin: "0 auto",
          padding: "64px 0"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: "48px",
            alignItems: "start"
          }}
          className="review-layout-grid"
        >
          {/* ── Left: Content ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
            {/* The Honest Take */}
            <div
              style={{
                padding: "28px 32px",
                background: "rgba(255,90,31,0.06)",
                border: "1px solid rgba(255,90,31,0.2)",
                borderRadius: "16px"
              }}
            >
              <h2
                style={{
                  margin: "0 0 16px",
                  fontFamily: "var(--wwh-font-heading)",
                  fontSize: "1.8rem",
                  color: "var(--wwh-accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em"
                }}
              >
                The Honest Take
              </h2>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "var(--wwh-font-body)",
                  fontSize: "1.05rem",
                  lineHeight: 1.8
                }}
              >
                {place.description}
              </p>
            </div>
            
            {/* Supabase Community Comments */}
            <div>
              <CommunityFeedback
                comments={communityComments}
                community={community}
                isSignedIn={Boolean(user)}
                slug={place.slug}
              />
            </div>
          </div>

          {/* ── Right: Quick Hits sidebar ── */}
          <aside
            style={{
              position: "sticky",
              top: "88px",
              background: "var(--wwh-card)",
              border: "1px solid var(--wwh-border)",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}
            className="review-sidebar"
          >
            <h3
              style={{
                margin: 0,
                fontFamily: "var(--wwh-font-heading)",
                fontSize: "1.3rem",
                color: "var(--wwh-text)",
                textTransform: "uppercase"
              }}
            >
              Quick Hits
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { label: "Cuisine", value: place.category, icon: "🍽" },
                { label: "Price", value: place.priceRange, icon: "💰" },
                { label: "Area", value: place.area, icon: "📍" },
                { label: "Parish", value: place.parish, icon: "🇯🇲" },
                { label: "Phone", value: place.phone || "N/A", icon: "📞" }
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    paddingBottom: "16px",
                    borderBottom: "1px solid var(--wwh-border)"
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "var(--wwh-accent)",
                      fontFamily: "var(--wwh-font-body)",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "4px"
                    }}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontFamily: "var(--wwh-font-body)",
                      fontSize: "0.9rem",
                      lineHeight: 1.45,
                      fontWeight: 500
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Verdict large */}
            <div style={{ marginTop: "4px" }}>
              <VerdictBadge verdict={verdict} size="md" />
            </div>

            {/* Highlights */}
            {place.features && place.features.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {place.features.map((h) => (
                  <span
                    key={h}
                    style={{
                      padding: "4px 12px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--wwh-border)",
                      borderRadius: "999px",
                      color: "rgba(255,255,255,0.6)",
                      fontFamily: "var(--wwh-font-body)",
                      fontSize: "0.78rem"
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>
            )}
          </aside>
        </div>

        {/* ── Related reviews ── */}
        {related.length > 0 && (
          <section style={{ marginTop: "80px" }}>
            <h2
              style={{
                margin: "0 0 32px",
                fontFamily: "var(--wwh-font-heading)",
                fontSize: "2rem",
                color: "var(--wwh-text)",
                textTransform: "uppercase"
              }}
            >
              More Places In {place.parish}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "20px"
              }}
              className="related-grid"
            >
              {related.map((r) => (
                <ReviewCard key={r.slug} place={r} variant="vertical" />
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .review-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .review-sidebar {
            position: static !important;
          }
          .related-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </article>
  );
}
