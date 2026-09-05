'use client';

// ☠️ THE NAVBAR IS GONE (Jarich, 2026-09-05, on the preview). What is left at the top of
// every page is this one line: the trust marquee, same items, same sweep, on the cinema
// tokens. Navigation lives in the footer and in the door beat's CTAs, and on a phone
// there is no hamburger to open because there is no menu behind it.
//
// The theme switch is NOT here. It is the cinema's own corner control, mounted once in
// SiteShell, so it keeps the id the room's 🌗 proxy reaches for.

import { usePathname } from 'next/navigation';
import './trust-marquee.css';

// Routes with their own immersive chrome (design-DNA pages) — the marquee stays out,
// exactly as the navbar used to.
const CHROME_FREE_ROUTES = ['/denjoy'];

// ☠️ NO WARRANTY TERMS IN PUBLIC COPY, and no dashes: coverage travels with the quote,
// never with a page.
const trustItems = [
  'White Glove Installation',
  'Hands-On Training Included',
  'Free Ocular Visit + Consultation',
  'After-Sales Support',
  'Open Mon to Sun, 9AM to 8PM',
  'Philippine-Based Support',
  'Trade-In Available Now',
  'Free Clinic Layout Assessment',
  'Nationwide Delivery',
  'ISO 13485 Certified',
  'Largest Showroom in the Philippines',
];

export default function TrustMarquee() {
  const pathname = usePathname();
  if (CHROME_FREE_ROUTES.includes(pathname)) return null;

  return (
    <div className="dsd-trust" role="presentation">
      {/* doubled, so the -50% sweep wraps with no seam */}
      <div className="dsd-trust-track">
        {[...trustItems, ...trustItems].map((text, i) => (
          <span className="dsd-trust-item" key={i} aria-hidden={i >= trustItems.length ? 'true' : undefined}>
            <span className="dsd-trust-dot" />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
