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
      ['Sign In', '/admin/login'],
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

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 border-t border-white/10 pt-8 text-white/40 text-xs sm:text-sm font-medium">
          <p>© {new Date().getFullYear()} DentaSource Direct. Exclusive ROSON &amp; Denjoy distributor — Philippines.</p>
          <p>Largest dental equipment showroom in the country.</p>
        </div>
      </div>
    </footer>
  );
}
