import Image from "next/image";
import Link from "next/link";
import { VERDICT_LABELS, formatReviewDate, type WrittenReview } from "@/data/reviews";
import styles from "./food-story.module.css";

/** Large editorial feature for one written review. */
export function ReviewFeature({ review, kicker, headingLevel = 2 }: { review: WrittenReview; kicker: string; headingLevel?: 2 | 3 }) {
  const Heading = `h${headingLevel}` as const;
  const titleId = `review-feature-${review.slug}`;
  return <section className={styles.feature} aria-labelledby={titleId}>
    <Link href={review.path} className={styles.featureImage} tabIndex={-1} aria-hidden="true">
      <Image src={review.hero} alt="" fill sizes="(max-width: 760px) 100vw, 590px" />
    </Link>
    <div className={styles.featureCopy}>
      <p className={styles.kicker}>{kicker}</p>
      <Heading id={titleId}><Link href={review.path} className={styles.featureTitleLink}>{review.title}</Link></Heading>
      <p>{review.teaser}</p>
      <p className={styles.scorecardVerdict}><span aria-hidden="true">{VERDICT_LABELS[review.verdict].emoji}</span> {VERDICT_LABELS[review.verdict].label}</p>
      <ReviewScores review={review} />
      <p className={styles.featureDisclosure}>{review.restaurant} · Visited {formatReviewDate(review.visited)}{review.hosted && review.disclosureShort ? ` · ${review.disclosureShort}` : ""}</p>
      <Link href={review.path} className={styles.readLink}>Read the full review <span aria-hidden="true">→</span></Link>
    </div>
  </section>;
}

/** Compact card for review grids. */
export function ReviewCard({ review }: { review: WrittenReview }) {
  return <article className={styles.card}>
    <Link href={review.path} className={styles.cardLink}>
      <div className={styles.cardImage}><Image src={review.hero} alt={review.heroAlt} fill sizes="(max-width: 760px) 100vw, 380px" /></div>
      <div className={styles.cardBody}>
        <p className={styles.kicker}>No. {String(review.number).padStart(3, "0")} · {review.area}</p>
        <h3>{review.title}</h3>
        <p className={styles.scorecardVerdict}><span aria-hidden="true">{VERDICT_LABELS[review.verdict].emoji}</span> {VERDICT_LABELS[review.verdict].label}</p>
        <p>{review.restaurant}{review.hosted ? " · Hosted visit" : ""}</p>
      </div>
    </Link>
  </article>;
}

function ReviewScores({ review }: { review: WrittenReview }) {
  if (!review.scores.length) return null;
  return <dl className={styles.featureScores}>
    {review.scores.map(score => <div key={score.label}><dt>{score.label}</dt><dd>{score.value}</dd></div>)}
  </dl>;
}
