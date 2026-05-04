type SectionHeaderProps = {
  eyebrow?: string;
  heading: string;
  subtext?: string;
  align?: "left" | "center";
  accentWord?: string;
};

export function SectionHeader({
  eyebrow,
  heading,
  subtext,
  align = "left",
  accentWord
}: SectionHeaderProps) {
  const textAlign = align === "center" ? "center" : "left";

  const headingParts = accentWord
    ? heading.split(accentWord)
    : null;

  return (
    <div style={{ textAlign, marginBottom: "48px" }}>
      {eyebrow && (
        <span
          style={{
            display: "inline-block",
            marginBottom: "12px",
            fontSize: "0.8rem",
            fontWeight: 700,
            fontFamily: "var(--wwh-font-body)",
            color: "var(--wwh-accent)",
            textTransform: "uppercase",
            letterSpacing: "0.12em"
          }}
        >
          {eyebrow}
        </span>
      )}
      <h2
        style={{
          margin: 0,
          fontFamily: "var(--wwh-font-heading)",
          fontSize: "clamp(2.8rem, 5vw, 4rem)",
          color: "var(--wwh-text)",
          lineHeight: 0.95,
          letterSpacing: "0.01em",
          textTransform: "uppercase"
        }}
      >
        {headingParts && accentWord ? (
          <>
            {headingParts[0]}
            <span style={{ color: "var(--wwh-accent)" }}>{accentWord}</span>
            {headingParts[1]}
          </>
        ) : (
          heading
        )}
      </h2>
      {subtext && (
        <p
          style={{
            marginTop: "16px",
            fontSize: "1rem",
            color: "var(--wwh-muted)",
            fontFamily: "var(--wwh-font-body)",
            maxWidth: align === "center" ? "560px" : "100%",
            margin: align === "center" ? "16px auto 0" : "16px 0 0",
            lineHeight: 1.7
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  );
}
