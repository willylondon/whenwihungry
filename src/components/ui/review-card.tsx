import Link from "next/link";
import type { ReviewPost } from "@/data/reviews";
import { VerdictBadge } from "@/components/ui/verdict-badge";

type ReviewCardProps = {
  post: ReviewPost;
  variant?: "horizontal" | "vertical";
};

export function ReviewCard({ post, variant = "vertical" }: ReviewCardProps) {
  if (variant === "horizontal") {
    return (
      <Link
        href={`/reviews/${post.slug}`}
        style={{
          display: "grid",
          gridTemplateColumns: "180px 1fr",
          gap: 0,
          background: "var(--wwh-card)",
          border: "1px solid var(--wwh-border)",
          borderRadius: "16px",
          overflow: "hidden",
          textDecoration: "none",
          transition: "transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease"
        }}
        className="review-card-link"
      >
        <div style={{ overflow: "hidden", position: "relative" }}>
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 400ms ease"
            }}
            className="review-card-img"
          />
        </div>
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div>
            <VerdictBadge verdict={post.verdict} size="sm" />
          </div>
          <h3
            style={{
              margin: 0,
              fontFamily: "var(--wwh-font-body)",
              fontWeight: 700,
              fontSize: "1rem",
              color: "var(--wwh-text)",
              lineHeight: 1.4
            }}
          >
            {post.title}
          </h3>
          <p
            style={{
              margin: 0,
              color: "var(--wwh-muted)",
              fontSize: "0.88rem",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            {post.dek}
          </p>
          <span
            style={{
              fontSize: "0.8rem",
              color: "var(--wwh-muted)",
              fontFamily: "var(--wwh-font-body)"
            }}
          >
            {post.area} · {post.category}
          </span>
        </div>
        <style>{`
          .review-card-link:hover {
            transform: translateY(-3px);
            box-shadow: 0 16px 40px rgba(0,0,0,0.3);
            border-color: rgba(255,90,31,0.2);
          }
          .review-card-link:hover .review-card-img {
            transform: scale(1.06);
          }
        `}</style>
      </Link>
    );
  }

  return (
    <Link
      href={`/reviews/${post.slug}`}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--wwh-card)",
        border: "1px solid var(--wwh-border)",
        borderRadius: "16px",
        overflow: "hidden",
        textDecoration: "none",
        transition: "transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease"
      }}
      className="review-card-vert"
    >
      <div style={{ overflow: "hidden", height: "220px", position: "relative" }}>
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 400ms ease"
          }}
          className="review-card-vert-img"
        />
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px"
          }}
        >
          <VerdictBadge verdict={post.verdict} size="sm" />
        </div>
      </div>
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--wwh-accent)",
            fontFamily: "var(--wwh-font-body)"
          }}
        >
          {post.category}
        </span>
        <h3
          style={{
            margin: 0,
            fontFamily: "var(--wwh-font-body)",
            fontWeight: 700,
            fontSize: "1.05rem",
            color: "var(--wwh-text)",
            lineHeight: 1.4
          }}
        >
          {post.title}
        </h3>
        <p
          style={{
            margin: 0,
            color: "var(--wwh-muted)",
            fontSize: "0.88rem",
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {post.dek}
        </p>
        <div
          style={{
            marginTop: "auto",
            paddingTop: "12px",
            borderTop: "1px solid var(--wwh-border)",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.8rem",
            color: "var(--wwh-muted)"
          }}
        >
          <span>{post.area}</span>
          <span>{post.readTime}</span>
        </div>
      </div>
      <style>{`
        .review-card-vert:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
          border-color: rgba(255,90,31,0.25);
        }
        .review-card-vert:hover .review-card-vert-img {
          transform: scale(1.06);
        }
      `}</style>
    </Link>
  );
}
