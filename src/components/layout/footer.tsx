import Link from "next/link";

const FOOTER_LINKS = {
  Reviews: [
    { href: "/reviews", label: "All Reviews" },
    { href: "/reviews/category/jerk", label: "Jerk" },
    { href: "/reviews/category/seafood", label: "Seafood" },
    { href: "/reviews/category/local-food", label: "Local Food" },
    { href: "/reviews/category/dessert", label: "Dessert" }
  ],
  Explore: [
    { href: "/watch", label: "Watch" },
    { href: "/about", label: "About the Critic" },
    { href: "/get-reviewed", label: "Get Reviewed" },
    { href: "/browse", label: "Restaurant Directory" }
  ],
  Social: [
    { href: "https://tiktok.com/@whenwihungry", label: "TikTok" },
    { href: "https://instagram.com/whenwihungry", label: "Instagram" },
    { href: "https://youtube.com/@whenwihungry", label: "YouTube" }
  ]
};

export function Footer() {
  return (
    <footer
      style={{
        background: "var(--wwh-surface)",
        borderTop: "1px solid var(--wwh-border)"
      }}
    >
      <div
        style={{
          width: "min(1200px, calc(100% - 40px))",
          margin: "0 auto",
          padding: "72px 0 40px"
        }}
      >
        {/* Brand statement */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr 1fr 1fr",
            gap: "48px",
            marginBottom: "56px"
          }}
          className="footer-cols"
        >
          <div>
            <p
              style={{
                fontFamily: "var(--wwh-font-heading)",
                fontSize: "2.2rem",
                color: "var(--wwh-text)",
                lineHeight: 0.95,
                textTransform: "uppercase",
                margin: "0 0 16px"
              }}
            >
              <span style={{ color: "var(--wwh-accent)" }}>When</span>Wi
              <span style={{ color: "var(--wwh-accent2)" }}>Hungry</span>
            </p>
            <p
              style={{
                color: "var(--wwh-muted)",
                fontFamily: "var(--wwh-font-body)",
                fontSize: "0.92rem",
                lineHeight: 1.7,
                margin: 0
              }}
            >
              Jamaica's boldest food critic. No fake ratings, no sponsored opinions, no corporate nonsense. Just real talk about real food.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <a
                href="https://tiktok.com/@whenwihungry"
                aria-label="TikTok"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.06)",
                  color: "#fff",
                  transition: "background 160ms ease"
                }}
                className="social-icon"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/whenwihungry"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.06)",
                  color: "#fff",
                  transition: "background 160ms ease"
                }}
                className="social-icon"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3
                style={{
                  margin: "0 0 20px",
                  fontFamily: "var(--wwh-font-body)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  color: "var(--wwh-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em"
                }}
              >
                {section}
              </h3>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      style={{
                        color: "rgba(255,255,255,0.55)",
                        fontFamily: "var(--wwh-font-body)",
                        fontSize: "0.92rem",
                        textDecoration: "none",
                        transition: "color 160ms ease"
                      }}
                      className="footer-nav-link"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: "24px",
            borderTop: "1px solid var(--wwh-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap"
          }}
        >
          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.3)",
              fontFamily: "var(--wwh-font-body)",
              fontSize: "0.82rem"
            }}
          >
            © {new Date().getFullYear()} WhenWiHungry. All reviews reflect the critic's honest opinion.
          </p>
          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.3)",
              fontFamily: "var(--wwh-font-body)",
              fontSize: "0.82rem"
            }}
          >
            No stars. No sponsored reviews. Just the truth.
          </p>
        </div>
      </div>

      <style>{`
        .social-icon:hover {
          background: rgba(255,77,45,0.2) !important;
        }
        .footer-nav-link:hover {
          color: #fff !important;
        }
        @media (max-width: 768px) {
          .footer-cols {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .footer-cols {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
