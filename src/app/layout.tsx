import type { Metadata } from "next";
import { Bebas_Neue, Inter, Bricolage_Grotesque, Fraunces } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

import { getSiteUrl } from "@/lib/site-url";
import { serializeJsonLd } from "@/lib/security/json-ld";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas"
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

const siteUrl = getSiteUrl();
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "WhenWiHungry | Honest Jamaican Food Reviews",
    template: "%s | WhenWiHungry"
  },
  description:
    "Jamaica's boldest food critic. Real visits, honest verdicts and clear disclosures — Jamaican food reviews with the full story.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" }
    ],
    apple: [{ url: "/favicon-180.png", sizes: "180x180", type: "image/png" }]
  },
  openGraph: {
    title: "WhenWiHungry | Jamaica's Boldest Food Critic",
    description:
      "Real visits. Honest verdicts. Clearly disclosed hosted meals.",
    url: siteUrl,
    siteName: "WhenWiHungry",
    images: [
      {
        url: "/og/whenwihungry-og.png",
        width: 1200,
        height: 630,
        alt: "WhenWiHungry — Jamaica's boldest food critic",
        type: "image/png"
      }
    ],
    locale: "en_JM",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "WhenWiHungry | Jamaica's Boldest Food Critic",
    description:
      "Real visits. Honest verdicts. Clearly disclosed hosted meals.",
    images: ["/og/whenwihungry-og.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${inter.variable} ${bricolage.variable} ${fraunces.variable}`}
    >
      <head />
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "WhenWiHungry",
                url: siteUrl,
                description:
                  "Jamaica's boldest food critic. Real visits and honest Jamaican food reviews, with hosted meals clearly disclosed.",
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${siteUrl}/browse?q={search_term_string}`
                  },
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "WhenWiHungry",
                url: siteUrl,
                logo: `${siteUrl}/logo.png`,
                description:
                  "Jamaica's boldest food critic. Honest, independent reviews of Jamaican food spots.",
                sameAs: ["https://www.tiktok.com/@whenwihungry"]
              }
            ])
          }}
        />
        {plausibleDomain && <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />}
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Navbar />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <Footer />
        {/* Cookieless, aggregate visit counts and real-visitor page speed (Vercel). */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
