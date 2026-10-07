import Image from "next/image";
import Link from "next/link";

const STATS = [
  { value: "3K+", label: "TikTok followers" },
  { value: "100K+", label: "video views" },
  { value: "10+", label: "viral reviews" }
];

/** The anonymous critic, introduced with the one photo that never shows the face. */
export function AboutSection() {
  return <section className="section" aria-labelledby="critic-heading">
    <div className="container critic-split">
      <div className="critic-photo">
        <Image src="/critic-avatar.png" alt="The critic in a bucket hat, face hidden, writing notes at a Kingston jerk stand" fill sizes="(max-width: 860px) 100vw, 520px" />
      </div>
      <div className="critic-copy">
        <h2 id="critic-heading">You won&apos;t see the face. You&apos;ll taste the truth.</h2>
        <p>The food comes first. Every review tells the story of an actual visit, with invitations, discounts and complimentary meals clearly disclosed.</p>
        <p>The verdict speaks for itself. The face stays in the shadows, right where it belongs.</p>
        <ul className="critic-stats">
          {STATS.map(stat => <li key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></li>)}
        </ul>
        <div className="service-actions">
          <a className="btn btn-primary" href="https://www.tiktok.com/@whenwihungry" target="_blank" rel="noopener noreferrer">Follow on TikTok<span className="sr-only"> (opens in a new tab)</span></a>
          <Link className="btn btn-outline" href="/about">About the critic</Link>
        </div>
      </div>
    </div>
  </section>;
}
