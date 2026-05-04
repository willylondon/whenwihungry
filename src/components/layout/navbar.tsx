import Link from "next/link";
import { SearchBar } from "@/components/layout/search-bar";
import { getCurrentUser, getUserRole } from "@/lib/community";

export async function Navbar() {
  const [user, role] = await Promise.all([
    getCurrentUser(),
    getUserRole()
  ]);

  const isAdmin = role === "admin";

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
          {isAdmin && <Link href="/admin/listings" style={{ color: "var(--hot)" }}>Admin</Link>}
        </nav>
        <div className="nav-actions">
          <div className="nav-search">
            <SearchBar action="/browse" />
          </div>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "0.88rem", color: "var(--muted)" }}>{user.email}</span>
              <a className="nav-link-soft" href="/sign-in" style={{ cursor: "pointer" }}>Sign Out</a>
            </div>
          ) : (
            <>
              <Link className="nav-link-soft" href="/sign-in">
                Sign In
              </Link>
              <Link className="btn btn-primary" href="/sign-up">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
