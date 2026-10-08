import Image from "next/image";
import Link from "next/link";
import { VerdictBadge } from "@/components/ui/verdict-badge";
import type { WrittenReview } from "@/data/reviews";

type Props = { foodSpotCountLabel?: string | null; latestReview?: WrittenReview };

// Searches the directory can answer today; dish names come back once listings carry dish data.
const TRIES = ["jerk chicken", "seafood negril", "patty", "ice cream", "date night"];

/** Opens with the critic's voice and the newest real plate, not a stock photo. */
export function HeroSection({ foodSpotCountLabel = null, latestReview }: Props) {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="container home-hero-grid">
        <div>
          <h1 id="home-hero-title">If the food bad, me a go tell you straight.</h1>
          <p className="home-hero-intro">
            Real visits to Jamaican cook shops, jerk pits and restaurants, with honest verdicts and every hosted meal disclosed.
            {foodSpotCountLabel && <> {foodSpotCountLabel} food spots to explore.</>}
          </p>
          <form action="/browse" method="get" role="search" className="hero-search">
            <label htmlFor="hero-search-input" className="sr-only">Search food spots</label>
            <input id="hero-search-input" type="search" name="q" placeholder="What yuh hungry for?" autoComplete="off" />
            <button type="submit">Search</button>
          </form>
          <p className="hero-tries">Try {TRIES.map((term, index) => <span key={term}>{index > 0 && ", "}<Link href={`/browse?q=${encodeURIComponent(term)}`}>{term}</Link></span>)}</p>
        </div>
        {latestReview && <figure className="home-hero-figure">
          <Link href={latestReview.path} className="home-hero-photo" aria-label={`Read our review of ${latestReview.restaurant}`}>
            <Image src={latestReview.hero} alt={latestReview.heroAlt} fill priority sizes="(max-width: 900px) 100vw, 560px" />
          </Link>
          <VerdictBadge verdict={latestReview.verdict} size="lg" />
          <figcaption>Latest review: <Link href={latestReview.path}>{latestReview.restaurant}</Link>. {latestReview.title}</figcaption>
        </figure>}
      </div>
    </section>
  );
}
