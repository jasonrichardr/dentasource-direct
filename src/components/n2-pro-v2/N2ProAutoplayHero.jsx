'use client';
import { m as motion } from 'framer-motion';

export default function N2ProAutoplayHero() {
  return (
    <section className="relative isolate overflow-hidden bg-white text-[#1D1D1F] min-h-[100svh] md:h-screen md:min-h-[640px]">
      <video
        className="absolute inset-0 w-full h-full object-cover object-center"
        src="/videos/n2pro-hero-loop.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="ROSON N2 Pro dental chair — cinematic close-up product reveal"
      />

      {/* Subtle bottom darkening for legibility — light pearl gradient on white BG */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0) 60%, rgba(0,0,0,0.18) 100%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl min-h-[100svh] md:h-full px-6 sm:px-8 lg:px-10 flex flex-col justify-end pb-10 md:pb-14">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="text-4xl sm:text-6xl lg:text-[6rem] font-medium tracking-tight text-[#1D1D1F] leading-none whitespace-nowrap"
        >
          ROSON N2 Pro
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: 'easeOut' }}
          className="mt-3 max-w-xl text-[14px] sm:text-[15px] text-[#52525B]"
        >
          Flagship of the N-series. Widest dentist tray. Independent disinfectant water.
        </motion.p>
      </div>
    </section>
  );
}
