import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
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
import { CommunityFeedback } from "@/components/place/community-feedback";
import { SocialShare } from "@/components/place/social-share";
import { getPlaceStatus, getPlaceStatusLabel, getPlaceCta, getPlaceDetailHeading, isCriticReviewed } from "@/lib/place-status";

type PlacePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PlacePageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = getPlaceBySlug(slug) ?? (await getApprovedCommunityPlaceBySlug(slug));
  if (!place) return {};

  const title = place.name;
  const description = place.description || `${place.name} — ${place.category || "Jamaican pick"} in ${place.parish}.`;
  const imageUrl = place.image || "https://whenwihungry.vercel.app/og/whenwihungry-og.png";
  const canonicalUrl = `https://whenwihungry.vercel.app/places/${place.slug}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | WhenWiHungry`,
      description,
      url: canonicalUrl,
      siteName: "WhenWiHungry",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: place.name,
          type: "image/png"
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

import { ReviewSection } from "@/components/place/review-section";

export default async function PlacePage({ params }: PlacePageProps) {
  const { slug } = await params;
  const place = getPlaceBySlug(slug) ?? (await getApprovedCommunityPlaceBySlug(slug));

  if (!place) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();
  const [user, { data: restaurant }] = await Promise.all([
    getCurrentUser(),
    supabase.from("restaurants").select("*, admin_reviews(verdict, admin_score, honest_take, headline)").eq("slug", place.slug).single()
  ]);

  if (!restaurant) {
     notFound();
  }

  const [{ data: reviews }, { data: existingReview }] = await Promise.all([
    supabase
      .from("user_reviews")
      .select("id, rating, comment, created_at")
      .eq("restaurant_id", restaurant?.id)
      .eq("status", "approved")
      .order("created_at", { ascending: false }),
    user ? supabase
      .from("user_reviews")
      .select("id")
      .eq("restaurant_id", restaurant?.id)
      .eq("user_id", user.id)
      .maybeSingle() : Promise.resolve({ data: null })
  ]);

  const related = getRelatedPlaces(place.slug);
  
  const adminRev = restaurant.admin_reviews?.[0] ?? null;
  const rawVerdict = adminRev?.verdict ?? null;
  const verdictKey = rawVerdict ? (rawVerdict.toLowerCase().replace(/_/g, "-") as any) : null;
  const hasCriticReview = Boolean(verdictKey && (adminRev?.honest_take?.trim() || adminRev?.headline?.trim()));

  const restaurantSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: place.name,
    description: place.description || undefined,
    url: `https://whenwihungry.vercel.app/places/${place.slug}`,
    image: place.image || undefined,
    servesCuisine: place.category || undefined,
    priceRange: place.priceRange || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: place.address || undefined,
      addressRegion: place.parish || undefined,
      addressCountry: "JM"
    }
  };

  const reviewSchema: Record<string, unknown> | null =
    hasCriticReview && adminRev
      ? {
          "@context": "https://schema.org",
          "@type": "Review",
          name: adminRev.headline || place.name,
          reviewBody: adminRev.honest_take || undefined,
          author: { "@type": "Person", name: "WhenWiHungry" },
          itemReviewed: { "@type": "Restaurant", name: place.name },
          ...(adminRev.admin_score
            ? {
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: (adminRev.admin_score / 20).toFixed(1),
                  bestRating: "5"
                }
              }
            : {})
        }
      : null;

  return (
    <article style={{ background: "var(--wwh-bg)", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            reviewSchema ? [restaurantSchema, reviewSchema] : restaurantSchema
          )
        }}
      />
      {/* ... previous content ... */}
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
          <div style={{ marginBottom: "20px", display: "flex", gap: "12px", alignItems: "center" }}>
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
            {restaurant.is_verified && (
               <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", background: "rgba(46,196,182,0.1)", padding: "4px 10px", borderRadius: "6px", border: "1px solid rgba(46,196,182,0.3)" }}>
                  <span style={{ color: "#2EC4B6", fontSize: "0.65rem", fontWeight: 800 }}>WWH VERIFIED</span>
               </div>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            {hasCriticReview ? (
              <VerdictBadge verdict={verdictKey} size="lg" />
            ) : (
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 18px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "999px",
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.82rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                fontFamily: "var(--wwh-font-body)"
              }}>
                {getPlaceStatusLabel(restaurant)}
              </span>
            )}
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

      {/* ... main content ... */}
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
            {/* Critic Verdict / Listing Info */}
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
                  color: hasCriticReview ? "var(--wwh-accent)" : "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em"
                }}
              >
                {getPlaceDetailHeading(restaurant)}
              </h2>
              {!hasCriticReview && (
                <p
                  style={{
                    margin: "0 0 16px",
                    padding: "10px 14px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    color: "rgba(255,255,255,0.35)",
                    fontFamily: "var(--wwh-font-body)",
                    fontSize: "0.82rem",
                    lineHeight: 1.6,
                    fontStyle: "italic"
                  }}
                >
                  This is a listing, not a critic review yet. Public rating signals are shown for discovery only.
                </p>
              )}
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
            
            {/* User Review Section */}
            <ReviewSection 
              restaurantId={restaurant?.id}
              reviews={reviews ?? []}
              isSignedIn={Boolean(user)}
              userReview={existingReview}
            />
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

            {/* Verdict / status */}
            <div style={{ marginTop: "4px" }}>
              {hasCriticReview ? (
                <VerdictBadge verdict={verdictKey} size="md" />
              ) : (
                <span style={{
                  display: "inline-block",
                  padding: "5px 14px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "999px",
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  fontFamily: "var(--wwh-font-body)"
                }}>
                  Listed — Review Pending
                </span>
              )}
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
