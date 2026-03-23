'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0A1410] pt-24 pb-8 border-t border-white/10 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#10b981]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-10 border-b border-white/10 pb-16">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6">Step into the future of <br /><span className="text-white/50">your practice.</span></h2>
            <p className="text-white/60 text-lg leading-relaxed">Experience the largest showroom in the Philippines for dental chairs and equipment. Sit, test, and feel the difference before you invest.</p>
          </div>
          <div className="flex shrink-0">
            <Link href="/contact" className="group relative overflow-hidden rounded-full bg-[#F26522] px-8 py-4 text-white font-medium transition-all hover:scale-105">
              <span className="relative z-10 flex items-center gap-2">Schedule a Visit</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 text-white/40 text-xs sm:text-sm font-medium">
          <p>© {new Date().getFullYear()} DentaSource Direct. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
