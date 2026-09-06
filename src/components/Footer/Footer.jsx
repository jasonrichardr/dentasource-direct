'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import './footer.css';

// Routes with their own immersive chrome (design-DNA pages) — global footer stays out.
const CHROME_FREE_ROUTES = ['/denjoy'];

const PHONE = '+63 962 579 3024';
const PHONE_HREF = 'tel:+639625793024';
const MESSENGER = 'https://m.me/dentasource';

// ☠️ NOTHING IN THE FOOTER PREFETCHES ANY MORE.
// It used to be the two heavy routes only (/news carries the whole article corpus,
// /login carries Supabase). With the navbar gone the footer is the site's ONLY nav, so
// every one of its links is a route the visitor has not asked for, and the load graph was
// still carrying dentalchairs?_rsc= and its neighbours. A prefetch on hover still fires,
// which is the moment intent actually appears; what stops is the speculative fetch of
// every destination on a page nobody has finished reading.

const columns = [
  {
    title: 'Equipment',
    links: [
      ['Dental Chairs', '/dentalchairs', true],
      ['All Equipment', '/products'],
      ['Denjoy Endodontics', '/denjoy', true],
      ['Trade-In Program', '/trade-in'],
    ],
  },
  {
    title: 'Why DSD',
    links: [
      ['White-Glove Service', '/services'],
      ['Authenticity', '/traceability'],
      ['About Us', '/about'],
      ['News', '/news', true],
    ],
  },
  {
    title: 'Account',
    links: [
      ['Visit the Showroom', '/contact'],
      ['Sign In', '/login'],
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();
  if (CHROME_FREE_ROUTES.includes(pathname)) return null;
  return (
    <footer className="dsd-footer pt-24 pb-8 relative overflow-hidden">
      <div className="dsd-footer-glow absolute top-0 right-1/4 w-[500px] h-[500px] blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ☠️ THE CLOSING CARD IS GONE. Jarich, 2026-09-07: after the arc a card came up
            saying "Ready to see it in person?" with two buttons, and he asked for it to be
            removed. The arc's own door beat already makes that invitation. The footer is
            now the site's navigation and its address, nothing more. The trade-in program
            he wanted kept from this end of the page lives in the after-sales beat. */}
        {/* Nav columns */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 mb-16">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="dsd-footer-label text-[11px] font-semibold uppercase tracking-[0.18em] mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map(([label, href, hot]) =>
                  hot ? (
                    <li key={label} className="my-0.5">
                      <Link
                        href={href}
                        prefetch={false}
                        className="dsd-footer-chip inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-px sm:gap-2 sm:px-3.5 sm:py-1.5"
                      >
                        <span className="text-xs font-medium sm:text-sm">{label}</span>
                        <span
                          aria-hidden="true"
                          className="rounded-full bg-[#F26522] px-1 py-0.5 text-[9px] font-bold uppercase leading-none tracking-wider text-white shadow-[0_0_12px_rgba(242,101,34,0.45)] motion-safe:animate-pulse sm:px-1.5 sm:text-[10px]"
                        >
                          Hot
                        </span>
                      </Link>
                    </li>
                  ) : (
                    <li key={label}>
                      <Link href={href} prefetch={false} className="dsd-footer-link text-sm">
                        {label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="dsd-footer-label text-[11px] font-semibold uppercase tracking-[0.18em] mb-4">Visit / Call</h3>
            <ul className="dsd-footer-muted space-y-2.5 text-sm">
              <li>
                610 C. Raymundo Avenue,
                <br />
                Maybunga, Pasig City
              </li>
              <li>Open daily, 9 AM to 8 PM</li>
              <li>
                <a href={PHONE_HREF} className="dsd-footer-link">
                  {PHONE}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="dsd-footer-rule flex flex-col items-center gap-5 border-t pt-8">
          {/* The round mark, never the banner: the banner asset ships an opaque white
              ground, and this one is transparent outside its circle. */}
          <Image
            src="/cinema/brand/dsd-round.png"
            alt="DentaSource Direct"
            width={112}
            height={112}
            className="h-14 w-14 object-contain opacity-90"
          />
          <div className="flex items-center justify-center gap-5">
          <span className="dsd-footer-faint text-[11px] uppercase tracking-[0.18em] font-semibold">Follow us</span>
          <a
            href="https://www.facebook.com/dentasource"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="DentaSource Direct on Facebook"
            className="dsd-footer-link"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg>
          </a>
          <a
            href="https://www.tiktok.com/@dentasourcedirect"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="DentaSource Direct on TikTok"
            className="dsd-footer-link"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .6.045.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 5.66 20.3a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.7-.3z"/></svg>
          </a>
          </div>
        </div>

        <div className="dsd-footer-faint flex flex-col md:flex-row items-center justify-between gap-3 pt-6 text-xs sm:text-sm font-medium">
          <p>© {new Date().getFullYear()} DentaSource Direct. Exclusive ROSON and Denjoy distributor, Philippines.</p>
          <p>Largest dental equipment showroom in the country.</p>
        </div>
      </div>
    </footer>
  );
}
