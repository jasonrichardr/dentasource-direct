'use client';

import Link from 'next/link';

const MESSENGER_HREF =
  'https://m.me/dentasource?ref=denjoy_2026_landing';

export default function DenjoyCTA() {
  return (
    <section
      aria-labelledby="denjoy-cta-heading"
      className="relative snap-start h-[70vh] min-h-[480px] w-full overflow-hidden bg-black flex items-center justify-center"
    >
      {/* Joining Forces brand-bookend video */}
      <video
        src="/videos/denjoy/joining-forces.mp4"
        poster="/videos/denjoy/joining-forces-poster.jpg"
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80"
        aria-hidden="true"
      />

      {/* Eyebrow */}
      <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between text-white text-[11px] font-bold uppercase tracking-[0.35em]">
        <span>JOINING FORCES · DSD × DENJOY</span>
        <span className="opacity-50">PASIG</span>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center text-white">
        <h2
          id="denjoy-cta-heading"
          className="font-serif italic text-3xl md:text-5xl leading-[1.1] tracking-tight mb-4"
        >
          Demo any of these in our{' '}
          <strong className="not-italic font-semibold">Pasig showroom.</strong>
        </h2>
        <p className="text-white/80 text-sm md:text-base mb-2">
          DentaSource Direct · 610 C. Raymundo Ave, Pasig City 1600
        </p>
        <p className="text-white/55 text-[11px] uppercase tracking-[0.2em] mb-8">
          Exclusive Denjoy Distributor · Philippines
        </p>

        <Link
          href={MESSENGER_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded bg-amber-200 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-amber-900 transition-colors hover:bg-amber-100"
        >
          Chat about Denjoy →
        </Link>
      </div>
    </section>
  );
}
