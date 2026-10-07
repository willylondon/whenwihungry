import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS: { heading: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  { heading: "Eat", links: [
    { href: "/reviews", label: "Reviews" },
    { href: "/browse", label: "All food spots" },
    { href: "/browse?category=jerk", label: "Jerk" },
    { href: "/browse?category=seafood", label: "Seafood" },
    { href: "/browse?category=local-food", label: "Local food" },
    { href: "/browse?category=dessert", label: "Dessert" }
  ] },
  { heading: "WhenWiHungry", links: [
    { href: "/about", label: "About the critic" },
    { href: "/get-reviewed", label: "Get your spot reviewed" },
    { href: "/restaurants/kingston", label: "Restaurants in Kingston" },
    { href: "/restaurants/portland", label: "Restaurants in Portland" },
    { href: "/privacy", label: "Privacy and contact" }
  ] },
  { heading: "Follow", links: [
    { href: "https://tiktok.com/@whenwihungry", label: "TikTok", external: true },
    { href: "https://instagram.com/whenwihungry", label: "Instagram", external: true },
    { href: "https://youtube.com/@whenwihungry", label: "YouTube", external: true }
  ] }
];

export function Footer() {
  return (
    <footer className="board-footer">
      <div className="board-footer-inner">
        <div className="board-footer-brand">
          <Image src="/logo-header.png" alt="WhenWiHungry" width={136} height={80} style={{ marginBottom: 16 }} />
          <p>Jamaican food, reviewed honestly. No paid verdicts, and every hosted meal disclosed.</p>
        </div>
        {FOOTER_LINKS.map(section => <nav key={section.heading} aria-label={section.heading}>
          <h2>{section.heading}</h2>
          <ul>
            {section.links.map(link => <li key={link.href}>
              {link.external
                ? <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<span className="sr-only"> (opens in a new tab)</span></a>
                : <Link href={link.href}>{link.label}</Link>}
            </li>)}
          </ul>
        </nav>)}
      </div>
      <div className="board-footer-base">
        <span>© {new Date().getFullYear()} WhenWiHungry</span>
        <span>Critic reviews are the critic&apos;s own independent opinion. Spots without a verdict are listings only.</span>
      </div>
    </footer>
  );
}
