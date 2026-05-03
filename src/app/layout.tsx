import type { Metadata } from "next";
import Script from "next/script";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

import "./globals.css";

const siteUrl = "https://whenwihungry.vercel.app";
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "whenwihungry.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "When Wi Hungry | Jamaican Restaurant Reviews",
    template: "%s | When Wi Hungry"
  },
  description:
    "Honest Jamaican food reviews for cook shops, jerk stops, seafood runs, patty counters, and date-night restaurants worth trying.",
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" }
    ],
    apple: [{ url: "/favicon-180.png", sizes: "180x180", type: "image/png" }]
  },
  openGraph: {
    title: "When Wi Hungry | Jamaican Restaurant Reviews",
    description:
      "Food-reviewer-first picks for Jamaican restaurants, cook shops, jerk stops, seafood runs, patties, and plates worth your appetite.",
    url: siteUrl,
    siteName: "When Wi Hungry",
    images: [
      {
        url: "/logos/when-wi-hungry-logo-transparent.png",
        width: 1024,
        height: 1024,
        alt: "When Wi Hungry"
      }
    ],
    locale: "en_JM",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "When Wi Hungry | Jamaican Restaurant Reviews",
    description:
      "Honest Jamaican restaurant reviews from a food reviewer first.",
    images: ["/logos/when-wi-hungry-logo-transparent.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;600;700;800&family=Fraunces:opsz,wght@9..144,400..900&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
