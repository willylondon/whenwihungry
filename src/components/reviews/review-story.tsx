import Image from "next/image";
import Link from "next/link";
import { VERDICT_LABELS, formatReviewDate, type ReviewBlock, type ReviewPhoto, type WrittenReview } from "@/data/reviews";
import { getParishDisplayName } from "@/lib/location-validation";
import styles from "./food-story.module.css";

/** The shared layout for every written review. */
export function ReviewStory({ review }: { review: WrittenReview }) {
  const verdict = VERDICT_LABELS[review.verdict];
  return <article className={styles.story}>
    <div className={styles.shell}>
      <header className={styles.header}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/reviews">Reviews</Link><span aria-hidden="true">/</span><span>{review.restaurant}</span></nav>
        <p className={styles.kicker}>At the table · {review.restaurant} · Review No. {String(review.number).padStart(3, "0")}</p>
        <h1>{review.title}</h1>
        <p className={styles.dek}>{review.dek}</p>
        <p className={styles.byline}>Words &amp; photographs by WhenWiHungry<br />Visited <time dateTime={review.visited}>{formatReviewDate(review.visited)}</time> · Published <time dateTime={review.published}>{formatReviewDate(review.published)}</time> · {review.readingMinutes} minute read</p>
      </header>
      <figure className={styles.hero}><Image src={review.hero} alt={review.heroAlt} fill preload sizes="(max-width: 1180px) 100vw, 1180px" /></figure>
      <p className={styles.caption}>{review.heroCaption}</p>
      <div className={styles.introGrid}>
        <div className={styles.prose}>
          {review.disclosure && <aside className={styles.note} aria-label="Review disclosure"><strong>Before we dig in.</strong> {review.disclosure}</aside>}
          {review.body.map((block, index) => <Block key={index} block={block} />)}
          <div className={styles.closing}>
            <p className={styles.kicker}>The WhenWiHungry verdict</p>
            <p className={styles.verdict}><span aria-hidden="true">{verdict.emoji}</span> {verdict.label}</p>
            <h2>{review.closing.heading}</h2>
            {review.closing.paragraphs.map((text, index) => <p key={index}>{index === 0 && review.closing.scoresLine && <><strong>{review.closing.scoresLine}</strong> </>}{text}</p>)}
          </div>
        </div>
        <aside className={styles.scorecard} aria-labelledby="visit-details">
          <p className={styles.kicker}>The visit, at a glance</p>
          <h2 id="visit-details">{review.restaurant}</h2>
          <p className={styles.scorecardVerdict}><span aria-hidden="true">{verdict.emoji}</span> {verdict.label}</p>
          <dl>
            {review.scores.map(score => <div key={score.label}><dt>{score.label}</dt><dd>{score.value}</dd></div>)}
          </dl>
          <p>{review.glance.lines.map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</p>
          {review.glance.notes.slice(0, 1).map(note => <p key={note}>{note}</p>)}
          {review.glance.officialLink && <a href={review.glance.officialLink.href} target="_blank" rel="noopener noreferrer">{review.glance.officialLink.label} ↗<span className="sr-only"> (opens in a new tab)</span></a>}
          {review.glance.notes.slice(1).map(note => <p key={note}>{note}</p>)}
          {review.placeSlug && <p><Link href={`/places/${review.placeSlug}`}>See the {review.restaurant} listing →</Link></p>}
          {review.parishSlug && <Link href={`/restaurants/${review.parishSlug}`}>Explore more {getParishDisplayName(review.parishSlug)} food spots →</Link>}
        </aside>
      </div>
    </div>
  </article>;
}

function Block({ block }: { block: ReviewBlock }) {
  switch (block.type) {
    case "lead": return <p className={styles.lead}>{block.text}</p>;
    case "p": return <p>{block.text}</p>;
    case "h2": return <h2>{block.text}</h2>;
    case "quote": return <blockquote className={styles.quote}>{block.text}</blockquote>;
    case "photo": return <Photo photo={block.photo} wide={block.wide} />;
    case "pair": return <div className={styles.pair}>{block.photos.map(photo => <Photo key={photo.src} photo={photo} />)}</div>;
  }
}

function Photo({ photo, wide = false }: { photo: ReviewPhoto; wide?: boolean }) {
  return <figure className={`${styles.photo} ${wide ? styles.wide : ""}`}><Image src={photo.src} alt={photo.alt} width={900} height={1200} sizes="(max-width: 760px) 90vw, 740px" /><figcaption className={styles.caption}>{photo.caption}</figcaption></figure>;
}
