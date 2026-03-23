'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Equipment', href: '/products' },
  { name: 'Dental Chairs', href: '/dentalchairs' },
  { name: 'Trade-In', href: '/trade-in' },
  { name: 'Showroom', href: '/contact' },
  { name: 'About', href: '/about' },
];

const trustItems = [
  { text: "White Glove Installation" },
  { text: "Hands-On Training Included" },
  { text: "5-Year Motor Warranty", hot: true },
  { text: "Free Ocular Visit + Consultation" },
  { text: "After-Sales Support" },
  { text: "Open Mon–Sun 9AM–8PM" },
  { text: "Philippine-Based Support" },
  { text: "Trade-In Available Now", hot: true },
  { text: "Free Clinic Layout Assessment" },
  { text: "Nationwide Delivery" },
  { text: "ISO 13485 Certified" },
  { text: "Largest Showroom in the Philippines" },
];

// TrustItem rendering is moved inline to the marquee for absolute centering control

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 flex flex-col shadow-sm w-full">
        {/* Marquee Trust Bar */}
        <div className="w-full max-w-[100vw] bg-[#1D1D1F] py-2.5 overflow-hidden flex items-center border-b border-black/10">
          <div className="flex w-max animate-marquee items-center gap-10 sm:gap-14">
              {trustItems.map((item, i) => (
                <div key={`trust-1-${i}`} className="flex items-center gap-2 sm:gap-2.5 text-white/90 text-[11px] sm:text-xs font-semibold whitespace-nowrap tracking-widest uppercase shrink-0">
                  {item.hot ? (
                    <span className="hot-flame">🔥</span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)] animate-pulse shrink-0" />
                  )}
                  <span className="mt-[1px]">{item.text}</span>
                </div>
              ))}
              {trustItems.map((item, i) => (
                <div key={`trust-2-${i}`} className="flex items-center gap-2 sm:gap-2.5 text-white/90 text-[11px] sm:text-xs font-semibold whitespace-nowrap tracking-widest uppercase shrink-0">
                  {item.hot ? (
                    <span className="hot-flame">🔥</span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)] animate-pulse shrink-0" />
                  )}
                  <span className="mt-[1px]">{item.text}</span>
                </div>
              ))}
          </div>
        </div>
        <style dangerouslySetInnerHTML={{
            __html: `
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee {
      animation: marquee 35s linear infinite;
    }
    .hot-flame {
      font-size: 11px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      transform-origin: bottom center;
      animation: flicker 0.25s ease-in-out infinite alternate, float 1.5s ease-in-out infinite alternate;
      filter: drop-shadow(0 2px 4px rgba(249,115,22,0.6));
    }
    @keyframes flicker {
      0% { transform: scaleX(0.95) scaleY(1.05) rotate(-3deg); }
      100% { transform: scaleX(1.05) scaleY(0.95) rotate(3deg); }
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      100% { transform: translateY(-1.5px); }
    }
  `}} />

        {/* Main Navbar */}
        <div className="w-full max-w-[100vw] lg:max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="relative z-50 flex items-center group shrink-0">
            <Image
              src="/images/brand/logo-horizontal.png"
              alt="DentaSource Direct Logo"
              width={216}
              height={48}
              className="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-sm font-medium text-gray-600 hover:text-black transition-colors relative group">
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#0071E3] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/contact" className="text-sm font-medium px-6 py-2.5 rounded-full bg-[#1D1D1F] text-white hover:bg-black transition-colors transform duration-300 hover:scale-105 shadow-md">
              Connect
            </Link>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5">
            <span className={`w-6 h-[2px] bg-black rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
            <span className={`w-6 h-[2px] bg-black rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-[2px] bg-black rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-40 bg-white flex flex-col justify-center px-8 pt-24 pb-8">
            <div className="flex flex-col gap-8 relative z-10">
              {navLinks.map((link, i) => (
                <motion.div key={link.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <Link href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-semibold tracking-tight text-[#1D1D1F] hover:text-[#0071E3] transition-colors inline-block">{link.name}</Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: navLinks.length * 0.1 }} className="mt-8 pt-8 border-t border-gray-100">
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="inline-flex items-center justify-center w-full px-8 py-4 rounded-full bg-[#1D1D1F] text-white text-lg font-medium">Connect</Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
