import Link from "next/link";
import type { ReviewPost } from "@/data/reviews";
import { SectionHeader } from "@/components/ui/section-header";
import { VideoCard } from "@/components/ui/video-card";

type VideoGridProps = {
  posts: ReviewPost[];
};

export function VideoGrid({ posts }: VideoGridProps) {
  return (
    <section
      style={{
        background: "var(--wwh-surface)",
        padding: "96px 0"
      }}
    >
      <div
        style={{
          width: "min(1200px, calc(100% - 40px))",
          margin: "0 auto"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "48px",
            flexWrap: "wrap",
            gap: "16px"
          }}
        >
          <SectionHeader
            eyebrow="Watch"
            heading="Reviews On Video"
            subtext="The full unfiltered take. Watch before you spend."
          />
          <Link
            href="/watch"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--wwh-accent)",
              fontFamily: "var(--wwh-font-body)",
              fontWeight: 700,
              fontSize: "0.9rem",
              textDecoration: "none",
              paddingBottom: "48px",
              whiteSpace: "nowrap"
            }}
            className="see-all-link"
          >
            See all videos →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px"
          }}
          className="video-grid"
        >
          {posts.slice(0, 6).map((post) => (
            <VideoCard key={post.slug} post={post} />
          ))}
        </div>
      </div>

      <style>{`
        .see-all-link:hover {
          opacity: 0.75;
        }
        @media (max-width: 900px) {
          .video-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 540px) {
          .video-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
