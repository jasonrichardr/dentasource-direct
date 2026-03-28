'use client';
import { motion } from 'framer-motion';

export default function ShowroomInfo() {
  return (
    <div className="w-full h-full bg-[#0A1410] p-10 lg:p-20 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#10b981]/10 blur-[120px] rounded-full pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 max-w-lg mt-12 lg:mt-0">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-6">Hands-on experience.<br /><span className="text-white/50">before you buy.</span></h1>
        <div className="space-y-8 mt-12">
          <div>
            <h4 className="text-white font-medium mb-2 uppercase tracking-wider text-sm">Headquarters & Showroom</h4>
            <p className="text-white/60 leading-relaxed">610 C. Maybunga Rd, Pasig City <br />Metro Manila, Philippines</p>
          </div>
          <a
            href="https://m.me/dentasource"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 mt-8 px-6 py-3.5 bg-[#0084FF] hover:bg-[#006acc] text-white rounded-full font-medium transition-colors text-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.42 3.15 7.18V22l2.97-1.63c.84.23 1.74.36 2.66.36h.22c5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.04 13.04l-2.55-2.73L5.6 15.04l5.35-5.68 2.62 2.73 4.82-2.73-5.35 5.68z"/></svg>
            Message Us on Facebook
          </a>
        </div>
      </motion.div>
    </div>
  );
}
