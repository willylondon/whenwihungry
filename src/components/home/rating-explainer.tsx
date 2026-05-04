import { SectionHeader } from "@/components/ui/section-header";

const VERDICTS = [
  {
    emoji: "🔥",
    label: "Run Go Get It",
    color: "#ff4d2d",
    bg: "rgba(255,77,45,0.1)",
    border: "rgba(255,77,45,0.25)",
    description:
      "This one hit different. The food was exceptional, the experience was right, and you need to move quickly. No second chances — this is the one."
  },
  {
    emoji: "👍",
    label: "Worth It",
    color: "#ffc857",
    bg: "rgba(255,200,87,0.1)",
    border: "rgba(255,200,87,0.25)",
    description:
      "Solid food. No major complaints. Not life-changing but it delivered on what it promised. Go when you're ready — it'll be there."
  },
  {
    emoji: "😐",
    label: "Mid",
    color: "#9ca3af",
    bg: "rgba(156,163,175,0.08)",
    border: "rgba(156,163,175,0.2)",
    description:
      "Could've been better, could've been worse. The potential is there but something is missing. If it's convenient, fine. If you're making a trip? Skip it."
  },
  {
    emoji: "🚫",
    label: "Save Your Money",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
    description:
      "I'm telling you now. Put your wallet back. This one didn't earn it and your hard-earned money deserves better."
  }
];

export function RatingExplainer() {
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
        <SectionHeader
          eyebrow="The System"
          heading="No Stars. Just Truth."
          subtext="We don't do star ratings here. Stars are vague. These verdicts say exactly what needs to be said."
          align="center"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
            maxWidth: "900px",
            margin: "0 auto"
          }}
          className="verdict-explainer-grid"
        >
          {VERDICTS.map((verdict) => (
            <div
              key={verdict.label}
              style={{
                padding: "28px 32px",
                background: verdict.bg,
                border: `1px solid ${verdict.border}`,
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "2rem" }}>{verdict.emoji}</span>
                <span
                  style={{
                    fontFamily: "var(--wwh-font-heading)",
                    fontSize: "1.5rem",
                    color: verdict.color,
                    textTransform: "uppercase",
                    letterSpacing: "0.02em"
                  }}
                >
                  {verdict.label}
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.65)",
                  fontFamily: "var(--wwh-font-body)",
                  fontSize: "0.92rem",
                  lineHeight: 1.7
                }}
              >
                {verdict.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .verdict-explainer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
