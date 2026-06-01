'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Equipment', href: '/products' },
  { name: 'Dental Chairs', href: '/dentalchairs' },
  { name: 'Denjoy', href: '/denjoy' },
  { name: 'News', href: '/news' },
  { name: 'Trade-In', href: '/trade-in' },
  { name: 'Showroom', href: '/contact' },
  { name: 'About', href: '/about' },
];

const trustItems = [
  "White Glove Installation",
  "Hands-On Training Included",
  "Up to 5-Year Motor Warranty",
  "Free Ocular Visit + Consultation",
  "After-Sales Support",
  "Open Mon–Sun 9AM–8PM",
  "Philippine-Based Support",
  "Trade-In Available Now",
  "Free Clinic Layout Assessment",
  "Nationwide Delivery",
  "ISO 13485 Certified",
  "Largest Showroom in the Philippines",
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 z-50 w-full max-w-[100vw] overflow-hidden flex flex-col">
        {/* Marquee Trust Bar */}
        <div className="w-full bg-[#1a3c34] py-1.5 overflow-hidden">
          <div className="flex w-max items-center gap-8" style={{ animation: 'marquee 40s linear infinite' }}>
            {[...trustItems, ...trustItems].map((text, i) => (
              <div key={i} className="flex items-center gap-2 text-white/75 text-[10px] font-medium whitespace-nowrap tracking-[0.15em] uppercase shrink-0">
                <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Logo + Hamburger Bar */}
        <div className="w-full bg-white border-b border-gray-200/60 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
            <Link href="/" onClick={() => setOpen(false)} className="relative z-50 shrink-0">
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
                  className="text-xs font-semibold text-gray-500 hover:text-[#1a3c34] transition-colors tracking-[0.12em] uppercase"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/login"
                className="text-xs font-semibold text-gray-500 hover:text-[#1a3c34] transition-colors tracking-[0.12em] uppercase"
              >
                Sign In
              </Link>
              <Link
                href="/contact"
                className="text-xs font-semibold px-5 py-2 rounded-full bg-[#1a3c34] text-white hover:bg-[#234e44] transition-colors tracking-wide"
              >
                Contact
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-[5px]"
              aria-label="Menu"
            >
              <span className={`w-5 h-[1.5px] bg-[#1a3c34] rounded-full transition-all duration-300 ${open ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`w-5 h-[1.5px] bg-[#1a3c34] rounded-full transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`w-5 h-[1.5px] bg-[#1a3c34] rounded-full transition-all duration-300 ${open ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
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
            className="fixed inset-0 z-40 bg-white flex flex-col pt-24 px-6 pb-8"
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
                    className="block py-4 text-2xl font-semibold text-[#1a3c34] border-b border-gray-100"
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
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="block w-full text-center py-4 rounded-2xl bg-[#1a3c34] text-white font-semibold text-base"
              >
                Visit Our Showroom
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-3 block w-full text-center py-4 rounded-2xl border-2 border-[#1a3c34] text-[#1a3c34] font-semibold text-base"
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
