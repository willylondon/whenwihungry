import Link from "next/link";

import { SearchBar } from "@/components/layout/search-bar";

export function Navbar() {
  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link className="brand" href="/">
          <img
            alt="When Wi Hungry"
            className="brand-logo"
            src="/logos/when-wi-hungry-logo-transparent.png"
          />
        </Link>
        <nav className="nav-links" aria-label="Primary">
          <Link href="/">Home</Link>
          <Link href="/browse">Restaurants</Link>
          <Link href="/reviews">Reviews</Link>
          <Link href="/add-listing">Add Listing</Link>
        </nav>
        <div className="nav-actions">
          <div className="nav-search">
            <SearchBar action="/browse" />
          </div>
          <Link className="nav-link-soft" href="/sign-in">
            Sign In
          </Link>
          <Link className="btn btn-primary" href="/sign-up">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
