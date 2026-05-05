"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ReviewSectionProps = {
  restaurantId: string;
  reviews: any[];
  isSignedIn: boolean;
  userReview?: any;
};

export function ReviewSection({ restaurantId, reviews, isSignedIn, userReview }: ReviewSectionProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) return;
    
    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, rating, comment })
      });
      
      if (res.ok) {
        setMessage("Review submitted for moderation. Respect!");
        setRating(0);
        setComment("");
        router.refresh();
      } else {
        const err = await res.json();
        setMessage(err.message || "Something went wrong.");
      }
    } catch (err) {
      setMessage("Failed to submit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
      {/* Review Feed */}
      <div>
        <h2 style={{ fontFamily: "var(--wwh-font-heading)", fontSize: "1.8rem", color: "#fff", marginBottom: "24px", textTransform: "uppercase" }}>
          Community Notes
        </h2>
        
        <div style={{ display: "grid", gap: "20px" }}>
          {reviews.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.4)" }}>No approved reviews yet. Be the first to tell the truth.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "12px", border: "1px solid var(--wwh-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                   <div style={{ color: "#FFD700" }}>{"★".repeat(r.rating)}</div>
                   <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>Approved Community Member</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Submission Form */}
      <div style={{ background: "var(--wwh-card)", padding: "32px", borderRadius: "16px", border: "1px solid var(--wwh-border)" }}>
        <h3 style={{ fontFamily: "var(--wwh-font-heading)", fontSize: "1.4rem", color: "#fff", marginBottom: "12px", textTransform: "uppercase" }}>
          Leave your truth
        </h3>
        
        {!isSignedIn ? (
          <p style={{ color: "rgba(255,255,255,0.4)" }}>
            Please <Link href="/sign-in" style={{ color: "var(--wwh-accent)" }}>sign in</Link> to leave a review.
          </p>
        ) : userReview ? (
          <div style={{ color: "rgba(46,196,182,0.8)" }}>You've already submitted your verdict for this spot. Respect!</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", marginBottom: "8px" }}>Rating</label>
              <div style={{ display: "flex", gap: "10px" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      background: rating >= s ? "var(--wwh-accent)" : "rgba(255,255,255,0.05)",
                      border: "none",
                      color: "#fff",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", marginBottom: "8px" }}>Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Be honest. Was it worth it?"
                required
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "16px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                  fontFamily: "var(--wwh-font-body)",
                  outline: "none"
                }}
              />
            </div>
            
            <button
              disabled={isSubmitting || rating === 0}
              style={{
                width: "100%",
                padding: "14px",
                background: "var(--wwh-accent)",
                color: "#fff",
                fontWeight: 700,
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                opacity: (isSubmitting || rating === 0) ? 0.5 : 1
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit Verdict"}
            </button>
            
            {message && (
              <p style={{ marginTop: "16px", color: message.includes("Respect") ? "#2EC4B6" : "#EF476F", fontSize: "0.9rem" }}>
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
