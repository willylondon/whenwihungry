import React from "react";
import Image from "next/image";
import Link from "next/link";

export function FeaturedCritique() {
  return (
    <section className="section" style={{ padding: "88px 0", background: "var(--bg-alt)" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "48px", alignItems: "center" }}>
          <div style={{ overflow: "hidden", borderRadius: "24px", boxShadow: "0 20px 48px rgba(15, 76, 92, 0.12)", border: "1px solid rgba(15, 76, 92, 0.06)" }}>
            <Image
              alt="Devon House I-Scream"
              src="https://images.unsplash.com/photo-1501443762994-82bd5dabb892?auto=format&fit=crop&w=1200&q=80"
              width={600}
              height={450}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
          <div>
            <span style={{ color: "var(--hot)", textTransform: "uppercase", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.15em", display: "block", marginBottom: "12px" }}>
              Editorial Choice
            </span>
            <h2 style={{ fontSize: "2.5rem", lineHeight: "1.1", fontWeight: 800, color: "var(--primary)", fontFamily: "var(--font-heading)", marginBottom: "20px" }}>
              Devon House I-Scream: Is it actually worth the Sunday crowd?
            </h2>
            <p style={{ fontSize: "1.1rem", color: "var(--muted)", lineHeight: "1.7", marginBottom: "28px" }}>
              Some people will tell you it's a tourist trap. They're wrong. Here's why this Kingston staple stays unmatched, and exactly what happens if you skip the rum and raisin for a bold new flavor...
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
              <span className="badge" style={{ background: "rgba(46, 196, 182, 0.12)", color: "var(--leaf)", padding: "6px 14px", borderRadius: "99px", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" }}>WWH Approved</span>
              <span style={{ fontSize: "0.95rem", color: "var(--muted)" }}>Kingston — Dessert & Treats</span>
            </div>
            <Link href="/places/devon-house-i-scream" className="btn btn-primary" style={{ padding: "14px 28px", fontSize: "1rem", borderRadius: "99px", background: "var(--primary)", color: "#fff", fontWeight: 700, display: "inline-block" }}>
              Read the full critique &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
