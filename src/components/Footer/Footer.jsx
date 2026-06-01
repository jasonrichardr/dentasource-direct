'use client';
import Link from 'next/link';

const PHONE = '+63 962 579 3024';
const PHONE_HREF = 'tel:+639625793024';
const MESSENGER = 'https://m.me/dentasource';

const columns = [
  {
    title: 'Equipment',
    links: [
      ['Dental Chairs', '/dentalchairs'],
      ['All Equipment', '/products'],
      ['Denjoy Endodontics', '/denjoy'],
      ['Trade-In Program', '/trade-in'],
    ],
  },
  {
    title: 'Why DSD',
    links: [
      ['White-Glove Service', '/services'],
      ['Authenticity', '/traceability'],
      ['About Us', '/about'],
      ['News', '/news'],
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
  return (
    <footer className="bg-[#0A1410] pt-24 pb-8 border-t border-white/10 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#10b981]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* CTA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-10 border-b border-white/10 pb-16">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6">
              Ready to see it <br />
              <span className="text-white/50">in person?</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              Walk into our Pasig showroom any day, 9 AM – 8 PM — no appointment needed. Or message us; we usually
              reply the same day.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row shrink-0 gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-[#10b981] px-8 py-4 text-center font-semibold text-[#0A1410] transition-all hover:bg-emerald-400"
            >
              Book a Free Consultation
            </Link>
            <a
              href={MESSENGER}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-8 py-4 text-center font-semibold text-white transition-all hover:bg-white/10"
            >
              Message on Messenger
            </a>
          </div>
        </div>

        {/* Nav columns */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 mb-16">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400 mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-white/60 hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400 mb-4">Visit / Call</h3>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>
                610 C. Maybunga Rd,
                <br />
                Pasig City 1600
              </li>
              <li>Open daily, 9 AM – 8 PM</li>
              <li>
                <a href={PHONE_HREF} className="hover:text-white transition-colors">
                  {PHONE}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-center gap-5 border-t border-white/10 pt-8">
          <span className="text-white/40 text-[11px] uppercase tracking-[0.18em] font-semibold">Follow us</span>
          <a
            href="https://www.facebook.com/dentasource"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="DentaSource Direct on Facebook"
            className="text-white/60 hover:text-emerald-400 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg>
          </a>
          <a
            href="https://www.tiktok.com/@dentasourcedirect"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="DentaSource Direct on TikTok"
            className="text-white/60 hover:text-emerald-400 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .6.045.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 5.66 20.3a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.7-.3z"/></svg>
          </a>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 text-white/40 text-xs sm:text-sm font-medium">
          <p>© {new Date().getFullYear()} DentaSource Direct. Exclusive ROSON &amp; Denjoy distributor — Philippines.</p>
          <p>Largest dental equipment showroom in the country.</p>
        </div>
      </div>
    </footer>
  );
}
