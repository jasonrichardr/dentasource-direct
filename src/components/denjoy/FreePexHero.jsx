'use client';

import { m as motion } from 'framer-motion';

export default function FreePexHero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-black text-white min-h-[100svh] md:h-screen md:min-h-[640px]"
      aria-labelledby="freepex-hero-title"
    >
      <video
        className="absolute inset-0 w-full h-full object-cover object-center"
        src="/videos/freepex-hero-loop.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="Denjoy FREE PEX benchtop apex locator — Bauhaus close-up product reveal"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl min-h-[100svh] md:h-full px-6 sm:px-8 lg:px-10 flex flex-col justify-end pb-10 md:pb-14">
        <motion.h1
          id="freepex-hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="text-5xl sm:text-7xl lg:text-[6rem] font-medium tracking-tight text-white leading-none"
        >
          Apex locator
        </motion.h1>
      </div>
    </section>
  );
}
