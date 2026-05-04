import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h3 className="footer-title">WhenWiHungry</h3>
          <p className="footer-description">
            A clean, search-first guide to Jamaican restaurants, cook shops,
            lunch trucks, and the places people actually recommend.
          </p>
        </div>
        <div>
          <h3 className="footer-title">Explore</h3>
          <ul className="footer-links-list">
            <li><Link href="/browse?parish=Kingston">Kingston</Link></li>
            <li><Link href="/browse?parish=St.+Andrew">St. Andrew</Link></li>
            <li><Link href="/browse?parish=St.+James">Montego Bay</Link></li>
          </ul>
        </div>
        <div className="footer-contact">
          <h3 className="footer-title">Connect With Us</h3>
          <p className="footer-subtitle">For tips, submissions, or media inquiries.</p>
          <div className="social-links-grid">
            <a href="mailto:whenwihungry@gmail.com" className="social-link email" title="Email Us">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <span>Email</span>
            </a>
            <a href="https://www.instagram.com/whenwihungry" target="_blank" rel="noopener noreferrer" className="social-link instagram" title="Follow us on Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              <span>Instagram</span>
            </a>
            <a href="https://www.tiktok.com/@whenwihungry" target="_blank" rel="noopener noreferrer" className="social-link tiktok" title="Follow us on TikTok">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5h-1a1 1 0 0 1-1-1V3a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v12a2 2 0 1 1-2-2Z"/>
              </svg>
              <span>TikTok</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
