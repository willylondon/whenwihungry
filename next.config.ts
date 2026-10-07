import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        // This baseline protects embedding/base/object contexts; HTML-safe JSON-LD
        // is still required. A strict nonce-based script CSP needs separate testing.
        { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'" }
      ]
    }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "dnlzaduonznhhlmyxrgh.supabase.co"
      },
      {
        protocol: "https",
        hostname: "images.pexels.com"
      }
    ]
  }
};

export default nextConfig;
