'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { m as motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/cinema/ThemeToggle';
import './navbar.css';

// Routes with their own immersive chrome (design-DNA pages) — global navbar stays out.
const CHROME_FREE_ROUTES = ['/denjoy'];

// Routes where the header sits OVER the night sky rather than on paper. It only turns to
// glass once the opening beat has been scrolled past.
const CINEMA_ROUTES = ['/', '/cinema-lab'];

const navLinks = [
  { name: 'Equipment', href: '/products' },
  { name: 'Dental Chairs', href: '/dentalchairs' },
  { name: 'Denjoy', href: '/denjoy' },
  { name: 'News', href: '/news' },
  { name: 'Trade-In', href: '/trade-in' },
  { name: 'Showroom', href: '/contact' },
  { name: 'About', href: '/about' },
];

// ☠️ NO WARRANTY TERMS IN PUBLIC COPY. The motor warranty line that used to ride this
// marquee was removed on 2026-09-05: coverage travels with the quote, never with a page.
const trustItems = [
  "White Glove Installation",
  "Hands-On Training Included",
  "Free Ocular Visit + Consultation",
  "After-Sales Support",
  "Open Mon to Sun, 9AM to 8PM",
  "Philippine-Based Support",
  "Trade-In Available Now",
  "Free Clinic Layout Assessment",
  "Nationwide Delivery",
  "ISO 13485 Certified",
  "Largest Showroom in the Philippines",
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const pathname = usePathname();
  const cinema = CINEMA_ROUTES.includes(pathname);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  // Only a cinema route pays for the listener; every other page keeps its solid bar.
  useEffect(() => {
    if (!cinema) { setAtTop(false); return undefined; }
    const onScroll = () => setAtTop(window.scrollY < 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [cinema]);

  if (CHROME_FREE_ROUTES.includes(pathname)) return null;

  return (
    <>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <nav className={`dsd-nav${cinema ? ' is-cinema' : ''}${atTop ? ' at-top' : ''} fixed top-0 left-0 right-0 z-50 w-full max-w-[100vw] overflow-hidden flex flex-col`}>
        {/* Marquee Trust Bar */}
        <div className="dsd-nav-trust w-full py-1.5 overflow-hidden">
          <div className="flex w-max items-center gap-8" style={{ animation: 'marquee 40s linear infinite' }}>
            {[...trustItems, ...trustItems].map((text, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] font-medium whitespace-nowrap tracking-[0.15em] uppercase shrink-0">
                <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Logo + Hamburger Bar */}
        <div className="dsd-nav-bar w-full">
          <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
            <Link href="/" onClick={() => setOpen(false)} className="dsd-nav-logo relative z-50 shrink-0">
              <Image
                src="/images/brand/logo-banner.png"
                alt="DentaSource Direct"
                width={600}
                height={200}
                className="h-12 sm:h-14 md:h-14 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="dsd-nav-link text-xs font-semibold tracking-[0.12em] uppercase"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/login"
                className="dsd-nav-link text-xs font-semibold tracking-[0.12em] uppercase"
              >
                Sign In
              </Link>
              <Link
                href="/contact"
                className="dsd-nav-cta text-xs font-semibold px-5 py-2 rounded-full tracking-wide"
              >
                Contact
              </Link>
              <span className="dsd-nav-switch-slot">
                {/* id="theme-switch" is a contract, not decoration: the room's 🌗 button
                    proxies whatever carries it. Only the desktop toggle claims it, so the
                    proxy can never land on two controls at once. */}
                <ThemeToggle id="theme-switch" />
              </span>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="dsd-nav-burger md:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-[5px]"
              aria-label="Menu"
            >
              <span className={`w-5 h-[1.5px] rounded-full transition-all duration-300 ${open ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`w-5 h-[1.5px] rounded-full transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`w-5 h-[1.5px] rounded-full transition-all duration-300 ${open ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="dsd-nav-menu fixed inset-0 z-40 flex flex-col pt-24 px-6 pb-8"
          >
            <div className="flex flex-col flex-1 justify-center gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="dsd-nav-menu-link block py-4 text-2xl font-semibold"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="flex justify-center pb-5">
                <span className="dsd-nav-switch-slot">
                  <ThemeToggle />
                </span>
              </div>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="dsd-footer-cta block w-full text-center py-4 rounded-2xl font-semibold text-base"
              >
                Visit Our Showroom
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="dsd-footer-ghost mt-3 block w-full text-center py-4 rounded-2xl font-semibold text-base"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
