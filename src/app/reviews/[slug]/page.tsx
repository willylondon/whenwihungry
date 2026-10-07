import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewStory } from "@/components/reviews/review-story";
import { VERDICT_LABELS, getWrittenReview, writtenReviews } from "@/data/reviews";
import { serializeJsonLd } from "@/lib/security/json-ld";
import { siteUrl } from "@/lib/site-url";

type ReviewPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return writtenReviews.map(review => ({ slug: review.slug }));
}

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const review = getWrittenReview((await params).slug);
  if (!review) return {};
  const title = `${review.restaurant}: ${review.title}`;
  return {
    title: review.seoTitle,
    description: review.description,
    alternates: { canonical: review.path },
    openGraph: { type: "article", title, description: review.description, url: siteUrl(review.path), publishedTime: review.published, images: [{ url: siteUrl(review.hero), alt: review.heroAlt }] },
    twitter: { card: "summary_large_image", title, description: review.description, images: [siteUrl(review.hero)] }
  };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const review = getWrittenReview((await params).slug);
  if (!review) notFound();
  const restaurant = {
    "@type": "Restaurant", name: review.restaurant,
    ...(review.placeSlug ? { url: siteUrl(`/places/${review.placeSlug}`) } : {}),
    ...(review.address ? { address: { "@type": "PostalAddress", streetAddress: review.address.street, addressLocality: review.address.locality, addressCountry: review.address.country } } : {})
  };
  const schema = {
    "@context": "https://schema.org", "@type": "Article", headline: review.title,
    description: review.description, image: siteUrl(review.hero), datePublished: review.published,
    author: { "@type": "Organization", name: "WhenWiHungry", url: siteUrl("/about") },
    publisher: { "@type": "Organization", name: "WhenWiHungry", url: siteUrl() },
    mainEntityOfPage: siteUrl(review.path), about: restaurant,
    // A plain-language verdict rather than an invented numeric rating.
    abstract: `WhenWiHungry verdict: ${VERDICT_LABELS[review.verdict].label}`
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
    <ReviewStory review={review} />
  </>;
}
