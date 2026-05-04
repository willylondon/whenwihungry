"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Reviews" },
  { href: "/browse?category=jerk", label: "Jerk" },
  { href: "/browse?category=seafood", label: "Seafood" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(11,11,11,0.88)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)"
        }}
      >
        <div
          style={{
            width: "min(1200px, calc(100% - 40px))",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "88px",
            gap: "24px"
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              flexShrink: 0
            }}
            aria-label="WhenWiHungry Home"
          >
            <img
              src="/logo.png"
              alt="WhenWiHungry"
              style={{ height: "64px", width: "auto", objectFit: "contain" }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Primary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flex: 1,
              justifyContent: "center"
            }}
            className="desktop-nav"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "8px 16px",
                  color: "var(--wwh-muted)",
                  fontFamily: "var(--wwh-font-body)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  borderRadius: "8px",
                  transition: "color 160ms ease, background 160ms ease"
                }}
                className="nav-dark-link"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link
            href="/get-reviewed"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "10px 20px",
              background: "var(--wwh-accent)",
              color: "#fff",
              fontFamily: "var(--wwh-font-body)",
              fontWeight: 700,
              fontSize: "0.88rem",
              borderRadius: "8px",
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "transform 160ms ease, box-shadow 160ms ease",
              flexShrink: 0
            }}
            className="nav-cta-btn"
          >
            Get Reviewed
          </Link>

          {/* Hamburger */}
          <button
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              color: "#fff"
            }}
            className="hamburger-btn"
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            style={{
              background: "var(--wwh-surface)",
              borderTop: "1px solid var(--wwh-border)",
              padding: "16px 20px 24px"
            }}
            className="mobile-menu"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "14px 0",
                  color: "var(--wwh-text)",
                  fontFamily: "var(--wwh-font-body)",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  textDecoration: "none",
                  borderBottom: "1px solid var(--wwh-border)"
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/get-reviewed"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "14px 0",
                color: "var(--wwh-accent)",
                fontFamily: "var(--wwh-font-body)",
                fontWeight: 700,
                fontSize: "1.1rem",
                textDecoration: "none"
              }}
            >
              Get Reviewed
            </Link>
          </div>
        )}
      </header>

      <style>{`
        .nav-dark-link:hover {
          color: #fff !important;
          background: rgba(255,255,255,0.06) !important;
        }
        .nav-cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(255,90,31,0.35);
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .nav-cta-btn { display: none !important; }
          .hamburger-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
