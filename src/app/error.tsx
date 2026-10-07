"use client";

import Link from "next/link";

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <section className="section directory-page"><div className="container service-state" role="alert">
    <h1>We couldn’t load this page</h1>
    <p>The directory may be temporarily unavailable. Please try again shortly.</p>
    <div className="service-actions"><button className="btn btn-primary" onClick={retry}>Try again</button><Link className="btn btn-secondary" href="/">Back to home</Link></div>
  </div></section>;
}
