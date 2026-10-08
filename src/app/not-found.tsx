import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container not-found">
        <h1>This page isn&apos;t on the menu</h1>
        <p>The link may be old, or the spot may have closed. Search for what you&apos;re hungry for instead.</p>
        <form action="/browse" method="get" role="search" className="hero-search">
          <label htmlFor="not-found-search" className="sr-only">Search food spots</label>
          <input id="not-found-search" type="search" name="q" placeholder="What yuh hungry for?" />
          <button type="submit">Search</button>
        </form>
        <p className="not-found-links"><Link className="text-link" href="/reviews">Read the reviews</Link> or <Link className="text-link" href="/browse">browse all food spots</Link>.</p>
      </div>
    </section>
  );
}
