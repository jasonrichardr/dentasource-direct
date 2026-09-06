'use client';
import { m as motion } from 'framer-motion';
import { mediaUrl } from '@/lib/cinema/media';

export default function A1ProAutoplayHero() {
  return (
    <section className="relative isolate overflow-hidden bg-black text-white min-h-[100svh] md:h-screen md:min-h-[640px]">
      <video
        className="absolute inset-0 w-full h-full object-cover object-center"
        src={mediaUrl('/videos/a1-pro-hero-loop.mp4')}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="ROSON A1 Pro dental chair — color hero reveal"
      />

      {/* Subtle bottom darkening for legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Single-line product name — halo-style minimal */}
      <div className="relative z-10 mx-auto max-w-7xl min-h-[100svh] md:h-full px-6 sm:px-8 lg:px-10 flex flex-col justify-end pb-10 md:pb-14">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="text-4xl sm:text-6xl lg:text-[6rem] font-medium tracking-tight text-white leading-none whitespace-nowrap"
        >
          A1 Pro
        </motion.h1>
      </div>
    </section>
  );
}
