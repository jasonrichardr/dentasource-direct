'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const MESSENGER_HREF = 'https://m.me/dentasourcedirect?ref=denjoy_2026_landing';

const CLIPS = [
  { src: '/videos/denjoy/denjoy-hq-720.mp4',   poster: '/videos/denjoy/denjoy-hq-poster.jpg' },
  { src: '/videos/denjoy/denjoy-team-720.mp4', poster: '/videos/denjoy/denjoy-team-poster.jpg' },
];

export default function DenjoyHero() {
  const [index, setIndex] = useState(0);
  const clip = CLIPS[index];

  return (
    <section
      className="relative snap-start h-screen min-h-[600px] w-full overflow-hidden bg-black flex items-center justify-center"
      aria-labelledby="denjoy-hero-title"
    >
      <video
        key={clip.src}
        src={clip.src}
        poster={clip.poster}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => setIndex((i) => (i + 1) % CLIPS.length)}
        className="absolute inset-0 h-full w-full object-cover opacity-90"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/80"
        aria-hidden="true"
      />

      <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between text-white text-[11px] font-bold uppercase tracking-[0.35em]">
        <span>DENJOY · PHILIPPINES</span>
        <span className="opacity-50">2026</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="absolute left-[5%] right-[5%] bottom-[18%] z-10 max-w-4xl"
      >
        <h1
          id="denjoy-hero-title"
          className="font-serif italic text-3xl md:text-5xl lg:text-7xl text-white leading-[1.05] tracking-tight"
        >
          The Denjoy line —
          <br />
          <strong className="font-semibold not-italic">finally, all of it. Locally.</strong>
        </h1>
      </motion.div>

      <Link
        href={MESSENGER_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute left-[5%] bottom-[8%] z-10 inline-block bg-amber-200 text-amber-900 font-semibold text-[11px] tracking-[0.2em] uppercase px-4 py-2 rounded transition-colors hover:bg-amber-100"
      >
        Chat about Denjoy →
      </Link>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-[5%] bottom-[8%] z-10 flex items-center gap-2 text-white/60 text-[10px] font-semibold tracking-[0.3em] uppercase"
        aria-hidden="true"
      >
        <span>See the 12</span>
        <span>↓</span>
      </motion.div>
    </section>
  );
}
