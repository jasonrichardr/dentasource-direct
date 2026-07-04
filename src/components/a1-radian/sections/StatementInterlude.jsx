'use client';

/* ─────────────────────────────────────────────────────────────────────
   STATEMENT INTERLUDE — the young-generation manifesto (dark, full-bleed).
   One atmospheric render fills the frame; a dark scrim buys legibility.
   Copy composes diagonally — the manifesto anchored top-left, the argument
   + a ghost CTA anchored bottom-left (the rideradian signature). The photo
   parallaxes a hair as the section passes (transform only, native scroll).
   Reduced-motion → static image, no parallax, no reveal.
   ───────────────────────────────────────────────────────────────────── */

import { useRef } from 'react';
import { m, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { SectionWrap, Eyebrow, Pill } from '../primitives';
import { manifesto } from '../content';

/* Dark scrim: darkest at the left edge (where both copy blocks live),
   thinning to the right so the product photography stays visible. */
// Layered scrim: left-dark for the copy column + bottom-dark for the body/CTA.
// Bone text over the high-key pastel render needs both, especially on mobile
// where the copy spans nearly the full width.
const SCRIM = 'linear-gradient(90deg, rgba(10,20,16,0.84) 0%, rgba(10,20,16,0.5) 48%, rgba(10,20,16,0.14) 78%), linear-gradient(0deg, rgba(10,20,16,0.55) 0%, rgba(10,20,16,0) 46%)';

export default function StatementInterlude() {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // Slight vertical parallax across the section's pass through the viewport.
  const yShift = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const y = reduce ? 0 : yShift;

  // Scroll reveals — transform + opacity, gated off under reduced motion.
  const reveal = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 22 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.4 },
        transition: { duration: 0.6, ease: [0.625, 0.05, 0, 1] },
      };
  const revealLate = reduce
    ? {}
    : { ...reveal, transition: { ...reveal.transition, delay: 0.12 } };

  return (
    <SectionWrap theme="dark" container={false} pad="" id="a1-manifesto">
      <div ref={ref} className="relative overflow-hidden">
        {/* Full-bleed photo — overhangs top + bottom so parallax reveals no edge. */}
        <m.div style={{ y }} className="absolute inset-x-0 -top-[8%] h-[116%] will-change-transform">
          <Image
            src={manifesto.bg}
            alt="ROSON A1 Pro dental unit in Ballet Pink amid soft studio curtains"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </m.div>

        {/* Legibility scrim. */}
        <div className="pointer-events-none absolute inset-0" style={{ background: SCRIM }} aria-hidden="true" />

        {/* Diagonal copy: manifesto top-left, argument + CTA bottom-left. */}
        <div className="relative z-10 mx-auto flex min-h-[85vh] w-full max-w-[1200px] flex-col justify-between px-5 py-16 sm:px-8 md:py-24">
          <m.div {...reveal} className="max-w-[42rem]">
            <Eyebrow>For the new generation</Eyebrow>
            <h2 className="radian-h mt-5 text-[var(--bone)] text-[clamp(2rem,5vw,3.5rem)]">
              {manifesto.headline.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h2>
          </m.div>

          <m.div {...revealLate} className="mt-16 max-w-[32rem]">
            <p className="text-[15px] leading-snug text-[var(--bone)]/80">
              {manifesto.body}
            </p>
            <div className="mt-7">
              <Pill href={manifesto.cta.href} variant="ghost">
                {manifesto.cta.label}
              </Pill>
            </div>
          </m.div>
        </div>
      </div>
    </SectionWrap>
  );
}
