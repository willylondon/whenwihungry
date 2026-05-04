import type { Metadata } from "next";
import { Bebas_Neue, Inter, Bricolage_Grotesque, Fraunces } from "next/font/google";
import Script from "next/script";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

import "./globals.css";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas"
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

const siteUrl = "https://whenwihungry.vercel.app";
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "whenwihungry.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "WhenWiHungry | Honest Jamaican Food Reviews",
    template: "%s | WhenWiHungry"
  },
  description:
    "The boldest food critic in Jamaica. If the food bad, me a go tell you straight. Honest reviews, no fake ratings, no corporate sponsorship.",
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
    title: "WhenWiHungry | Jamaican Food Critic",
    description:
      "Honest, bold, video-first food reviews for Jamaica. Run go get it or save your money — we tell you straight.",
    url: siteUrl,
    siteName: "WhenWiHungry",
    images: [
      {
        url: "/logos/when-wi-hungry-logo-transparent.png",
        width: 1024,
        height: 1024,
        alt: "WhenWiHungry"
      }
    ],
    locale: "en_JM",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "WhenWiHungry | Honest Jamaican Food Reviews",
    description:
      "If the food bad… me a go tell you straight. Bold food critic reviews from Jamaica.",
    images: ["/logos/when-wi-hungry-logo-transparent.png"]
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
