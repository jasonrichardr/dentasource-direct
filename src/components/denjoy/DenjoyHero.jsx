'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function DenjoyHero() {
  return (
    <section
      className="relative snap-start h-screen min-h-[600px] w-full overflow-hidden bg-black flex items-center justify-center"
      aria-labelledby="denjoy-hero-title"
    >
      <Image
        src="/images/denjoy/ensemble-hero-2.jpg"
        alt="The five Denjoy launch products arranged together"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-60"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white"
      >
        <p className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-emerald-300 mb-4">
          Exclusive in the Philippines
        </p>
        <h1
          id="denjoy-hero-title"
          className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-tight mb-6"
        >
          Denjoy Endodontics,<br />now in Philippine operatories.
        </h1>
        <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
          Five world-class endodontic instruments, distributed exclusively by DentaSource Direct —
          anchored by the Meet Endo All-in-One system.
        </p>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 text-xs font-semibold tracking-[0.2em] uppercase flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span>Scroll</span>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </motion.div>
    </section>
  );
}
