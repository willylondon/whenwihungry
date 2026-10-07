"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/reviews", label: "Reviews" },
  { href: "/browse", label: "Food spots" },
  { href: "/browse?category=jerk", label: "Jerk" },
  { href: "/browse?category=seafood", label: "Seafood" },
  { href: "/about", label: "About" }
];

/** Dark signboard bar: the logo lives on the same board it was drawn for. */
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const current = (href: string) => (!href.includes("?") && (pathname === href || (href !== "/" && pathname?.startsWith(`${href}/`))) ? "page" : undefined);

  return (
    <header className="board-header" onKeyDown={event => { if (event.key === "Escape" && menuOpen) { setMenuOpen(false); menuButton.current?.focus(); } }}>
      <div className="board-inner">
        <Link href="/" className="board-logo" aria-label="WhenWiHungry home">
          <Image src="/logo-header.png" alt="WhenWiHungry" width={102} height={60} priority />
        </Link>
        <nav aria-label="Primary" className="board-nav">
          {NAV_LINKS.map(link => <Link key={link.href} href={link.href} aria-current={current(link.href)}>{link.label}</Link>)}
        </nav>
        <div className="board-actions">
          <Link href="/account" className="board-account">Account</Link>
          <Link href="/get-reviewed" className="board-cta">Get reviewed</Link>
        </div>
        <button ref={menuButton} type="button" className="board-menu-btn" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-controls="mobile-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>
      {menuOpen && <nav id="mobile-navigation" aria-label="Mobile primary" className="board-mobile">
        {NAV_LINKS.map(link => <Link key={link.href} href={link.href} aria-current={current(link.href)} onClick={() => setMenuOpen(false)}>{link.label}</Link>)}
        <Link href="/account" onClick={() => setMenuOpen(false)}>Account</Link>
        <Link href="/get-reviewed" className="board-cta" onClick={() => setMenuOpen(false)}>Get reviewed</Link>
      </nav>}
    </header>
  );
}
