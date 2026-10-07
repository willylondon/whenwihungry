import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/site-url";
import { getPublicFoodSpotCountLabel } from "@/lib/place-counts";

export const revalidate = 21600;

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About the Anonymous Food Critic",
  description:
    "The anonymous food critic behind WhenWiHungry. Real visits, honest opinions and clear disclosures about Jamaican food.",
  openGraph: {
    url: siteUrl("/about"),
    title: "About the Anonymous Food Critic | WhenWiHungry",
    description:
      "The anonymous food critic behind WhenWiHungry. Real visits, honest opinions and clear disclosures about Jamaican food.",
    images: [
      {
        url: siteUrl("/og/whenwihungry-og.png"),
        width: 1200,
        height: 630,
        alt: "WhenWiHungry — Jamaica's boldest food critic",
        type: "image/png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    images: [siteUrl("/og/whenwihungry-og.png")]
  }
};

const PRINCIPLES = [
  {
    heading: "Anonymous by design",
    body: "The food takes centre stage. Reviews explain the context of the visit, including when a restaurant knows we're coming or invites us back."
  },
  {
    heading: "The full story, including the bill",
    body: "Complimentary meals, discounts and invitations are disclosed at the top of the review, so you can judge the experience in context."
  },
  {
    heading: "More than a number",
    body: "A score needs a story. When a review includes scores, the visit, the dishes and the service behind them matter just as much."
  },
  {
    heading: "Video first",
    body: "Most reviews start as a short TikTok: the plate, the bite and the reaction, never the face. The written review comes after."
  }
];

export default async function AboutPage() {
  const foodSpotCountLabel = await getPublicFoodSpotCountLabel();
  const stats = [
    { value: "3K+", label: "TikTok followers" },
    { value: "100K+", label: "video views" },
    { value: "10+", label: "viral reviews" },
    ...(foodSpotCountLabel ? [{ value: foodSpotCountLabel, label: "food spots mapped" }] : [])
  ];
  return <>
    <section className="about-hero" aria-labelledby="about-heading">
      <div className="container critic-split">
        <div className="critic-copy">
          <h1 id="about-heading">No face. No bias. No filter.</h1>
          <p>WhenWiHungry is a faceless food critic covering Jamaican food: cook shops, jerk stops, seafood runs, patty spots and everywhere in between.</p>
          <p>The identity stays hidden. The opinions stay honest. That&apos;s the trade.</p>
          <ul className="critic-stats">
            {stats.map(stat => <li key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></li>)}
          </ul>
          <div className="service-actions">
            <a className="btn btn-primary" href="https://www.tiktok.com/@whenwihungry" target="_blank" rel="noopener noreferrer">Follow on TikTok<span className="sr-only"> (opens in a new tab)</span></a>
            <Link className="btn btn-outline" href="/reviews">Read the reviews</Link>
          </div>
        </div>
        <div className="critic-photo">
          <Image src="/critic-avatar.png" alt="The critic in a bucket hat, face hidden, writing notes at a Kingston jerk stand" fill priority sizes="(max-width: 860px) 100vw, 560px" />
        </div>
      </div>
    </section>
    <section className="section band-concrete" aria-labelledby="principles-heading">
      <div className="container">
        <div className="section-heading"><div><h2 id="principles-heading">How the reviews work</h2></div></div>
        <ul className="about-principles">
          {PRINCIPLES.map(item => <li key={item.heading}><h3>{item.heading}</h3><p>{item.body}</p></li>)}
        </ul>
      </div>
    </section>
    <section className="cta-band" aria-labelledby="about-cta-heading">
      <div className="container cta-band-inner">
        <div>
          <h2 id="about-cta-heading">Hungry already?</h2>
          <p>Start with the reviews, or search the directory by craving and parish.</p>
        </div>
        <Link className="btn-board" href="/browse">Find a food spot</Link>
      </div>
    </section>
  </>;
}
