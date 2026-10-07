import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { rokReview as review } from "@/data/reviews/rok-hotel";
import { siteUrl } from "@/lib/site-url";
import { serializeJsonLd } from "@/lib/security/json-ld";
import styles from "@/components/reviews/food-story.module.css";

export const metadata: Metadata = {
  title: "ROK Hotel Kingston Review: A Remarkable Comeback",
  description: review.description,
  alternates: { canonical: review.path },
  openGraph: { type: "article", title: `ROK Hotel Kingston: ${review.title}`, description: review.description, url: siteUrl(review.path), publishedTime: review.published, images: [{ url: siteUrl(review.hero), alt: "Salmon, mashed potatoes and peri-peri sauce at ROK Hotel Kingston" }] },
  twitter: { card: "summary_large_image", title: `ROK Hotel Kingston: ${review.title}`, description: review.description, images: [siteUrl(review.hero)] }
};

function Photo({ name, alt, caption, wide = false }: { name: string; alt: string; caption: string; wide?: boolean }) {
  return <figure className={`${styles.photo} ${wide ? styles.wide : ""}`}><Image src={`/images/reviews/rok-hotel/${name}.jpg`} alt={alt} width={900} height={1200} sizes="(max-width: 760px) 90vw, 740px" /><figcaption className={styles.caption}>{caption}</figcaption></figure>;
}

export default function RokReviewPage() {
  const schema = {
    "@context": "https://schema.org", "@type": "Article", headline: review.title,
    description: review.description, image: siteUrl(review.hero), datePublished: review.published,
    author: { "@type": "Organization", name: "WhenWiHungry", url: siteUrl("/about") },
    publisher: { "@type": "Organization", name: "WhenWiHungry", url: siteUrl() },
    mainEntityOfPage: siteUrl(review.path), about: { "@type": "Restaurant", name: review.restaurant, address: { "@type": "PostalAddress", streetAddress: "2–4 King Street", addressLocality: "Kingston", addressCountry: "JM" } }
  };
  return <article className={styles.story}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
    <div className={styles.shell}>
      <header className={styles.header}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/reviews">Reviews</Link><span aria-hidden="true">/</span><span>ROK Hotel Kingston</span></nav>
        <p className={styles.kicker}>At the table · ROK Hotel Kingston · Review No. 001</p>
        <h1>{review.title}</h1>
        <p className={styles.dek}>A birthday lunch that went wrong. An invitation to return. And a Sunday meal that reminded me why a second chance can be worth taking.</p>
        <p className={styles.byline}>Words &amp; photographs by WhenWiHungry<br />Visited <time dateTime={review.visited}>October 4, 2026</time> · Published <time dateTime={review.published}>October 7, 2026</time> · 4 minute read</p>
      </header>
      <figure className={styles.hero}><Image src={review.hero} alt="A browned salmon fillet over mashed potatoes and orange peri-peri sauce, with broccoli and vegetables" fill preload sizes="(max-width: 1180px) 100vw, 1180px" /></figure>
      <p className={styles.caption}>The main event: salmon, mashed potatoes and peri-peri sauce. All photographs are from our visit.</p>
      <div className={styles.introGrid}>
        <div className={styles.prose}>
          <aside className={styles.note} aria-label="Review disclosure"><strong>Before we dig in.</strong> {review.disclosure}</aside>
          <p className={styles.lead}>Would you go back to a restaurant after waiting three hours for your food? I did. But before we get to the golden bread, the crab cakes and that beautifully plated salmon, the first part of this story deserves its place at the table.</p>
          <p>A week earlier, we had gone to ROK Hotel Kingston to celebrate a birthday. We arrived at noon. After three o’clock, we still hadn’t been properly served. The service was rough, and the birthday guest never even received his meal. That is a hard way to remember a celebration.</p>
          <p>We raised the issue. ROK acknowledged that they had dropped the ball, gave us a substantial discount on that visit and invited us back. On Sunday, October 4, we returned. This time, they came correct.</p>
          <h2>A fresh start, straight from the kitchen</h2>
          <p>Executive Chef Oji Jaja personally treated us to a four-course experience. More than a chance to try another plate, this was an opportunity for the team to show what the visit could have been. From the supervisor to our waitress and the kitchen, the difference was enough for me to give the service a full 10 out of 10.</p>
          <p>The opening was milk garlic cheese bread: golden spirals with browned edges, piled together in a shallow bowl. Beside it came pumpkin bisque, a brilliant orange pool in a wide white bowl, finished with a small cluster of greens. The table was already making a very good argument for coming back.</p>
          <div className={styles.pair}>
            <Photo name="bread" alt="Golden spirals of milk garlic cheese bread in a shallow bowl" caption="A golden beginning: milk garlic cheese bread." />
            <Photo name="pumpkin-bisque" alt="Orange pumpkin bisque with a small garnish in a white bowl" caption="Pumpkin bisque, simply and elegantly presented." />
          </div>
          <h2>WhenWiHungry became WhenWiFull</h2>
          <p>Then came the crab cakes with spinach and tomato aioli. Their browned crusts, the glossy greens and that blue bowl made this one of the most inviting plates to photograph. There was colour, there was care in the presentation, and by this point there was considerably less room left for the next course.</p>
          <Photo name="crab-cakes" alt="Crab cakes with spinach, tomato aioli, microgreens and lime in a blue bowl" caption="Crab cakes, spinach and tomato aioli — a plate that deserved its close-up." wide />
          <blockquote className={styles.quote}>“By this point, WhenWiHungry was WhenWiFull.”</blockquote>
          <p>The salmon arrived with mashed potatoes and peri-peri sauce: a deeply browned fillet against pale mash, green broccoli and a generous sweep of orange sauce. It looked ready for its moment. We, however, had reached our limit. We were so full that we had to box the main course.</p>
          <p>This was a generous meal. Even with the main course packed to go, my verdict on the experience was clear: 10 out of 10.</p>
          <h2>A passion-fruit finish</h2>
          <p>Dessert was a deconstructed passion-fruit pie with passion curd, cinnamon crumble, white-rum whipped cream, fresh blueberries and pavlova. Golden curd, small clouds of cream and dark berries gave the final plate a lovely contrast of colour. It was another reason to pause with the camera before reaching for a spoon.</p>
          <Photo name="passion-fruit" alt="Deconstructed passion-fruit dessert with crossed pavlova pieces, cream, blueberries and crumble" caption="The finale: deconstructed passion-fruit pie." wide />
          <h2>Credit where it is due</h2>
          <p>My first two experiences at ROK were not the best. This visit does not erase them. It does show what happened when the team acknowledged a problem and made a deliberate effort to put it right.</p>
          <p>If I am going to speak about a disappointing experience, I should be just as willing to speak when the same team gets it right. To the supervisor, our lovely waitress, Chef Oji and everyone involved: you turned a bad experience into an amazing one. Third time really was a charm.</p>
          <div className={styles.closing}><p className={styles.kicker}>The WhenWiHungry verdict</p><h2>A comeback worth talking about.</h2><p><strong>Food: 10/10. Service: 10/10.</strong> Those are my scores for the October 4 return. The earlier disappointments were real, and so was the turnaround. This team earned its credit that Sunday.</p><p>If a restaurant let you down, then invited you back to make it right, would you give it another chance?</p></div>
        </div>
        <aside className={styles.scorecard} aria-labelledby="visit-details"><p className={styles.kicker}>The visit, at a glance</p><h2 id="visit-details">ROK Hotel Kingston</h2><dl><div><dt>Food</dt><dd>10/10</dd></div><div><dt>Service</dt><dd>10/10</dd></div></dl><p>October 4, 2026<br />Kingston, Jamaica<br />Complimentary return meal</p><p>2–4 King Street, Kingston. This review describes our meal at the hotel; it is not a review of an overnight stay.</p><a href="https://www.hilton.com/en/hotels/kinocup-rok-hotel-kingston/dining/" target="_blank" rel="noopener noreferrer">Official dining information ↗</a><p>Menu and availability may change. No current menu prices are quoted in this review.</p><Link href="/restaurants/kingston">Explore more Kingston food spots →</Link></aside>
      </div>
    </div>
  </article>;
}
