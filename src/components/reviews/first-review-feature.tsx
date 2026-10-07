import Image from "next/image";
import Link from "next/link";
import { rokReview } from "@/data/reviews/rok-hotel";
import styles from "./food-story.module.css";

export function FirstReviewFeature() {
  return <section className={styles.feature} aria-labelledby="first-review-title">
    <Link href={rokReview.path} className={styles.featureImage} aria-label="Read our ROK Hotel Kingston review">
      <Image src={rokReview.hero} alt="Salmon with mashed potatoes, vegetables and peri-peri sauce at ROK Hotel Kingston" fill sizes="(max-width: 760px) 100vw, 50vw" />
    </Link>
    <div className={styles.featureCopy}>
      <p className={styles.kicker}>The first written review · Kingston</p>
      <h2 id="first-review-title">{rokReview.title}</h2>
      <p>A birthday lunch that went wrong. An invitation to return. And a table that gave us something very different to talk about.</p>
      <p className={styles.featureDisclosure}>Visited October 4, 2026 · Complimentary return visit</p>
      <Link href={rokReview.path} className={styles.readLink}>Read the full story <span aria-hidden="true">↗</span></Link>
    </div>
  </section>;
}
