'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function IPexoHero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-black text-white min-h-[100svh] md:h-screen md:min-h-[640px]"
      aria-labelledby="ipexo-hero-title"
    >
      <Image
        src="/images/denjoy/i-pexo/ipexo-front-hero.jpg"
        alt="Denjoy i-Pexo touchable apex locator — DSD Pasig showroom"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-85"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.78) 100%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl min-h-[100svh] md:h-full px-6 sm:px-8 lg:px-10 flex flex-col justify-end pb-10 md:pb-14">
        <motion.h1
          id="ipexo-hero-title"
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
