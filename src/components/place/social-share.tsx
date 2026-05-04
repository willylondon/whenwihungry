"use client";
import React, { useState } from "react";

export function SocialShare({ url, name }: { url: string; name: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedName = encodeURIComponent(name);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Share:</span>
      <a
        href={`https://wa.me/?text=${encodedName}%20-%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-outline"
        style={{ padding: "8px 14px", fontSize: "0.88rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
      >
        WhatsApp
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-outline"
        style={{ padding: "8px 14px", fontSize: "0.88rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
      >
        Facebook
      </a>
      <button
        onClick={copyToClipboard}
        className="btn btn-outline"
        style={{ padding: "8px 14px", fontSize: "0.88rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
