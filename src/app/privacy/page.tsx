import Link from "next/link";
import { siteUrl } from "@/lib/site-url";

export const metadata = {
  title: "Privacy and contact",
  description: "How WhenWiHungry uses account and contribution data, and how to request a correction or removal.",
  alternates: { canonical: siteUrl("/privacy") }
};

export default function PrivacyPage() {
  return <section className="section"><div className="container" style={{ maxWidth: 800 }}>
    <span className="eyebrow">WhenWiHungry</span>
    <h1>Privacy and contact</h1>
    <p>Last updated: 7 October 2026.</p>
    <h2>Browsing and accounts</h2>
    <p>You can browse the directory without an account. Account features use your email address, display name and sign-in information to identify you and manage your contributions. Supabase provides authentication and database storage; Resend delivers account emails; Vercel hosts the website. Sign-in uses cookies to maintain your session.</p>
    <h2>Contributions and public information</h2>
    <p>Restaurant suggestions and community reviews are stored for moderation. Approved listings and reviews may be shown publicly. Do not include private information about yourself or other people in a public review. A directory listing is not an endorsement or evidence of a critic visit.</p>
    <h2>Maps and external services</h2>
    <p>Opening the map loads tiles from OpenStreetMap. Images and links may connect to external services, including restaurant image storage and social platforms. Those services receive the network information needed to serve their content and apply their own privacy practices.</p>
    <h2>Retention and requests</h2>
    <p>Account and contribution records remain stored until removed; this release does not provide automatic account expiry. To request access, a correction, or removal of your account or contribution, contact <a href="mailto:whenwihungry@gmail.com">whenwihungry@gmail.com</a>. Include enough information to identify the record, but never send your password. We may need to verify that the request is yours.</p>
    <h2>Restaurant corrections</h2>
    <p>For an incorrect address, closed business, disputed listing, or review concern, send the page link and the correction to <a href="mailto:whenwihungry@gmail.com">whenwihungry@gmail.com</a>. Imported directory information can be incomplete or out of date; check details with the restaurant before travelling.</p>
    <Link className="btn btn-outline" href="/browse">Back to food spots</Link>
  </div></section>;
}
