import Link from "next/link";
import type { ReviewPost } from "@/data/reviews";
import { VerdictBadge } from "@/components/ui/verdict-badge";

type VideoCardProps = {
  post: ReviewPost;
};

export function VideoCard({ post }: VideoCardProps) {
  return (
    <Link
      href={`/reviews/${post.slug}`}
      style={{
        display: "block",
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        background: "var(--wwh-card)",
        border: "1px solid var(--wwh-border)",
        transition: "transform 280ms cubic-bezier(0.16,1,0.3,1), box-shadow 280ms ease",
        aspectRatio: "9/16",
        maxHeight: "480px",
        textDecoration: "none"
      }}
      className="video-card-link"
    >
      {/* Thumbnail */}
      <img
        src={post.image}
        alt={post.title}
        loading="lazy"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 400ms ease"
        }}
        className="video-card-img"
      />

      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)"
        }}
      />

      {/* Play button */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "54px",
          height: "54px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(8px)",
          border: "2px solid rgba(255,255,255,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 200ms ease, background 200ms ease"
        }}
        className="play-btn"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>

      {/* Bottom info */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px"
        }}
      >
        <div style={{ marginBottom: "8px" }}>
          <VerdictBadge verdict={post.verdict} size="sm" />
        </div>
        <p
          style={{
            margin: 0,
            color: "#fff",
            fontFamily: "var(--wwh-font-body)",
            fontWeight: 700,
            fontSize: "0.9rem",
            lineHeight: 1.3
          }}
        >
          {post.restaurant}
        </p>
        <p
          style={{
            margin: "2px 0 0",
            color: "rgba(255,255,255,0.6)",
            fontFamily: "var(--wwh-font-body)",
            fontSize: "0.8rem"
          }}
        >
          {post.area}, {post.parish}
        </p>
      </div>

      <style>{`
        .video-card-link:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .video-card-link:hover .video-card-img {
          transform: scale(1.06);
        }
        .video-card-link:hover .play-btn {
          transform: translate(-50%,-50%) scale(1.12);
          background: rgba(255,77,45,0.4);
        }
      `}</style>
    </Link>
  );
}
