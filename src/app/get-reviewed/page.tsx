"use client";

import type { Metadata } from "next";
import { useState } from "react";

const STATS = [
  { value: "3K+", label: "TikTok Followers" },
  { value: "100K+", label: "Video Views" },
  { value: "50+", label: "Places Reviewed" },
  { value: "100%", label: "Honest Opinions" }
];

const VALUE_PROPS = [
  {
    icon: "🎭",
    heading: "Real Experience",
    body: "I arrive unannounced and pay my own bill. Your customers' experience is exactly what I get."
  },
  {
    icon: "📱",
    heading: "Video-First",
    body: "Reviews go on TikTok first. That's where the audience is. That's where the reach is."
  },
  {
    icon: "🔥",
    heading: "Honest Verdict",
    body: "If the food is good, I say it loudly. If it needs work, I say that too. No sugarcoating — that's the brand."
  },
  {
    icon: "📍",
    heading: "Jamaican Audience",
    body: "A local audience that actually wants to spend money on good food. That's who I reach."
  }
];

export default function GetReviewedPage() {
  const [formState, setFormState] = useState({
    name: "",
    restaurant: "",
    location: "",
    email: "",
    phone: "",
    message: "",
    submitted: false
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production, wire to a form backend (Formspree, Resend, etc.)
    setFormState((s) => ({ ...s, submitted: true }));
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 18px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    color: "#fff",
    fontFamily: "var(--wwh-font-body)",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 160ms ease"
  };

  return (
    <div style={{ background: "var(--wwh-bg)", minHeight: "100vh" }}>
      {/* Hero */}
      <section
        style={{
          padding: "80px 0 72px",
          background: "var(--wwh-surface)",
          borderBottom: "1px solid var(--wwh-border)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,90,31,0.07) 0%, transparent 70%)",
            pointerEvents: "none"
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "min(1000px, calc(100% - 40px))",
            margin: "0 auto"
          }}
        >
          <span
            style={{
              display: "inline-block",
              marginBottom: "20px",
              padding: "6px 14px",
              background: "rgba(255,90,31,0.1)",
              border: "1px solid rgba(255,90,31,0.25)",
              borderRadius: "999px",
              color: "var(--wwh-accent)",
              fontFamily: "var(--wwh-font-body)",
              fontWeight: 700,
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em"
            }}
          >
            For Restaurants
          </span>
          <h1
            style={{
              margin: "0 0 20px",
              fontFamily: "var(--wwh-font-heading)",
              fontSize: "clamp(3rem, 6vw, 5rem)",
              color: "#fff",
              lineHeight: 0.92,
              textTransform: "uppercase"
            }}
          >
            THINK YOUR FOOD
            <br />
            <span style={{ color: "var(--wwh-accent)" }}>CAN HANDLE IT?</span>
          </h1>
          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.6)",
              fontFamily: "var(--wwh-font-body)",
              fontSize: "1.05rem",
              lineHeight: 1.75,
              maxWidth: "600px"
            }}
          >
            Request a review. I come unannounced. I pay my bill. I tell the truth. If the food is right, 3K+ followers will know about it.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <div
        style={{
          background: "#000",
          borderBottom: "1px solid var(--wwh-border)",
          padding: "28px 0"
        }}
      >
        <div
          style={{
            width: "min(1000px, calc(100% - 40px))",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            textAlign: "center"
          }}
          className="get-reviewed-stats"
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <p
                style={{
                  margin: "0 0 2px",
                  fontFamily: "var(--wwh-font-heading)",
                  fontSize: "2.2rem",
                  color: "var(--wwh-accent)",
                  lineHeight: 1
                }}
              >
                {s.value}
              </p>
              <p
                style={{
                  margin: 0,
                  color: "var(--wwh-muted)",
                  fontFamily: "var(--wwh-font-body)",
                  fontSize: "0.78rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em"
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <section style={{ padding: "80px 0" }}>
        <div
          style={{
            width: "min(1000px, calc(100% - 40px))",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 460px",
            gap: "64px",
            alignItems: "start"
          }}
          className="get-reviewed-grid"
        >
          {/* Value props */}
          <div>
            <h2
              style={{
                margin: "0 0 36px",
                fontFamily: "var(--wwh-font-heading)",
                fontSize: "2.4rem",
                color: "#fff",
                textTransform: "uppercase",
                lineHeight: 0.95
              }}
            >
              WHY GET REVIEWED?
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {VALUE_PROPS.map((prop) => (
                <div
                  key={prop.heading}
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                    padding: "20px",
                    background: "var(--wwh-card)",
                    border: "1px solid var(--wwh-border)",
                    borderRadius: "12px"
                  }}
                >
                  <span style={{ fontSize: "1.6rem", flexShrink: 0 }}>{prop.icon}</span>
                  <div>
                    <h3
                      style={{
                        margin: "0 0 6px",
                        fontFamily: "var(--wwh-font-heading)",
                        fontSize: "1.2rem",
                        color: "var(--wwh-text)",
                        textTransform: "uppercase"
                      }}
                    >
                      {prop.heading}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        color: "rgba(255,255,255,0.55)",
                        fontFamily: "var(--wwh-font-body)",
                        fontSize: "0.9rem",
                        lineHeight: 1.65
                      }}
                    >
                      {prop.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Warning */}
            <div
              style={{
                marginTop: "28px",
                padding: "20px 24px",
                background: "rgba(255,200,87,0.06)",
                border: "1px solid rgba(255,200,87,0.2)",
                borderRadius: "12px"
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "var(--wwh-accent2)",
                  fontFamily: "var(--wwh-font-body)",
                  fontSize: "0.9rem",
                  lineHeight: 1.65
                }}
              >
                ⚠️ <strong>Read this first:</strong> Submitting a request doesn't guarantee a review, doesn't guarantee a positive review, and doesn't mean I'll announce when I'm coming. If the food is good, the review will reflect that. If it's not — it will reflect that too.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div
            style={{
              background: "var(--wwh-card)",
              border: "1px solid var(--wwh-border)",
              borderRadius: "20px",
              padding: "36px",
              position: "sticky",
              top: "88px"
            }}
            className="get-reviewed-form-wrap"
          >
            {formState.submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p style={{ fontSize: "3rem", margin: "0 0 16px" }}>🔥</p>
                <h3
                  style={{
                    margin: "0 0 12px",
                    fontFamily: "var(--wwh-font-heading)",
                    fontSize: "1.8rem",
                    color: "var(--wwh-accent)",
                    textTransform: "uppercase"
                  }}
                >
                  Request Received
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: "var(--wwh-muted)",
                    fontFamily: "var(--wwh-font-body)",
                    fontSize: "0.95rem",
                    lineHeight: 1.65
                  }}
                >
                  Got it. I'll be in touch if your spot makes the list. Keep the food consistent — you won't know when I'm coming.
                </p>
              </div>
            ) : (
              <>
                <h2
                  style={{
                    margin: "0 0 28px",
                    fontFamily: "var(--wwh-font-heading)",
                    fontSize: "1.8rem",
                    color: "#fff",
                    textTransform: "uppercase"
                  }}
                >
                  Request a Review
                </h2>
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        color: "var(--wwh-muted)",
                        fontFamily: "var(--wwh-font-body)",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em"
                      }}
                    >
                      Your Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Name"
                      value={formState.name}
                      onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        color: "var(--wwh-muted)",
                        fontFamily: "var(--wwh-font-body)",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em"
                      }}
                    >
                      Restaurant Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Scotchies Mobay"
                      value={formState.restaurant}
                      onChange={(e) => setFormState((s) => ({ ...s, restaurant: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        color: "var(--wwh-muted)",
                        fontFamily: "var(--wwh-font-body)",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em"
                      }}
                    >
                      Location
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Parish, Area"
                      value={formState.location}
                      onChange={(e) => setFormState((s) => ({ ...s, location: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        color: "var(--wwh-muted)",
                        fontFamily: "var(--wwh-font-body)",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em"
                      }}
                    >
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="your@email.com"
                      value={formState.email}
                      onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        color: "var(--wwh-muted)",
                        fontFamily: "var(--wwh-font-body)",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em"
                      }}
                    >
                      Why Should I Come?
                    </label>
                    <textarea
                      placeholder="Tell me about your spot. What makes it worth the visit?"
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                      style={{ ...inputStyle, resize: "vertical", minHeight: "100px" }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "16px",
                      background: "var(--wwh-accent)",
                      color: "#fff",
                      fontFamily: "var(--wwh-font-body)",
                      fontWeight: 700,
                      fontSize: "1rem",
                      borderRadius: "10px",
                      border: "none",
                      cursor: "pointer",
                      transition: "transform 160ms ease, box-shadow 160ms ease",
                      marginTop: "4px"
                    }}
                    className="submit-btn"
                  >
                    Submit Request 🔥
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <style>{`
        input::placeholder, textarea::placeholder {
          color: rgba(255,255,255,0.25);
        }
        input:focus, textarea:focus {
          border-color: rgba(255,90,31,0.5) !important;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(255,90,31,0.4);
        }
        @media (max-width: 768px) {
          .get-reviewed-grid { grid-template-columns: 1fr !important; }
          .get-reviewed-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .get-reviewed-form-wrap { position: static !important; }
        }
      `}</style>
    </div>
  );
}
