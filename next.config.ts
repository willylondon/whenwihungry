import type { NextConfig } from "next";
import { imageHosts } from "./src/lib/image-config";

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
    remotePatterns: imageHosts(process.env.NEXT_PUBLIC_SUPABASE_URL).map((hostname) => ({ protocol: "https" as const, hostname }))
  }
};

export default nextConfig;
