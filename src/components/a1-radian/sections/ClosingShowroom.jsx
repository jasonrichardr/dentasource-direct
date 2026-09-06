'use client';

/* ─────────────────────────────────────────────────────────────────────
   CLOSING — the Pasig showroom finale.
   Full-bleed clinical photograph under a strong dark scrim, a vertical
   "instrument" ruler ticking the 44-colour library on the far-left edge,
   and the ONE display headline of the page. The bg parallaxes gently on
   native scroll (transform + opacity only). Reduced-motion → static, no
   parallax. Dark theme; emerald is the only signal colour, the rest is
   carried by the photograph.
   ───────────────────────────────────────────────────────────────────── */

import { useRef } from 'react';
import { m, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { SectionWrap, Pill, MonoLabel } from '../primitives';
import { closing } from '../content';
import { mediaUrl } from '@/lib/cinema/media';

/* Full-bleed background, over-sized so the parallax translate never
   reveals an edge (wrapper runs 10% past each side of the section).
   The old A1 Pro hero loop plays here as a living backdrop — muted +
   playsInline so it autoplays on mobile; the still frame is the poster
   so the first paint is clean before the film streams in. */
function ParallaxBg({ y }) {
  return (
    <m.div className="absolute inset-x-0 will-change-transform" style={{ top: '-10%', bottom: '-10%', y }}>
      <video
        className="absolute inset-0 h-full w-full object-cover object-center"
        src={mediaUrl(closing.video)}
        poster={closing.bg}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="ROSON A1 Pro dental chair — color-reveal loop"
      />
    </m.div>
  );
}

/* Strong dark scrim — left-weighted for the copy, top/bottom for the
   coords + disclaimer. Keeps bone text readable over the photograph. */
function Scrim() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          'linear-gradient(90deg, rgba(10,20,16,0.94) 0%, rgba(10,20,16,0.80) 38%, rgba(10,20,16,0.44) 72%, rgba(10,20,16,0.30) 100%),' +
          'linear-gradient(180deg, rgba(10,20,16,0.55) 0%, rgba(10,20,16,0) 26%, rgba(10,20,16,0) 66%, rgba(10,20,16,0.82) 100%)',
      }}
    />
  );
}

/* Decorative instrument ruler — 24 emerald ticks (major/minor widths),
   colour-library counters top + bottom. Hidden when the viewport is
   cramped. Optional scaleX reveal when motion is allowed. */
function Ruler({ animate }) {
  const ticks = Array.from({ length: 24 });
  return (
    <div className="pointer-events-none absolute inset-y-0 left-5 z-10 hidden flex-col items-start justify-between py-14 md:flex">
      <MonoLabel className="text-[10px] text-[var(--signal)]">{closing.rulerStart}</MonoLabel>

      <div className="flex flex-1 flex-col justify-between py-8">
        {ticks.map((_, i) => {
          const major = i % 4 === 0;
          const cls = `h-px origin-left bg-[var(--signal)] ${major ? 'w-7' : 'w-3'}`;
          return animate ? (
            <m.span
              key={i}
              className={cls}
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: major ? 0.7 : 0.4 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: i * 0.02, ease: [0.625, 0.05, 0, 1] }}
            />
          ) : (
            <span key={i} className={`${cls} ${major ? 'opacity-70' : 'opacity-40'}`} />
          );
        })}
      </div>

      <MonoLabel className="text-[10px] text-[var(--muted)]">{closing.rulerEnd}</MonoLabel>
    </div>
  );
}

export default function ClosingShowroom() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const motion = !reduce;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // Subtle vertical parallax; range stays well inside the 10% over-scan.
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <SectionWrap
      theme="dark"
      container={false}
      id="a1-showroom"
      pad=""
      className="relative overflow-hidden"
    >
      {/* scroll tracker — matches the section box exactly (parallax target) */}
      <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0" />

      <ParallaxBg y={motion ? y : undefined} />
      <Scrim />
      <Ruler animate={motion} />

      {/* copy column */}
      <div className="relative z-10 mx-auto flex min-h-[92vh] w-full max-w-[1200px] flex-col justify-center px-5 pt-28 pb-32 sm:px-8 md:pl-28">
        <div className="max-w-[36rem]">
          <MonoLabel className="text-[12px] text-[var(--signal)]">{closing.coords}</MonoLabel>
          <MonoLabel as="div" className="mt-1.5 text-[var(--muted)]">{closing.coordsLabel}</MonoLabel>

          <h2 className="radian-h mt-6 text-[clamp(3rem,7vw,5.5rem)] text-[var(--bone)]">
            {closing.headline.map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h2>

          <p className="mt-6 max-w-[34rem] text-[15px] leading-snug text-[var(--bone)]/80">
            {closing.body}
          </p>

          <p className="mt-5 max-w-[34rem] text-[14px] font-medium text-[var(--signal)]">
            {closing.priceLine}
          </p>

          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Pill variant="primary" href={closing.primary.href}>{closing.primary.label}</Pill>
            <Pill variant="ghost" href={closing.secondary.href}>{closing.secondary.label}</Pill>
            <Pill variant="ghost" href={closing.tertiary.href}>{closing.tertiary.label}</Pill>
          </div>
        </div>
      </div>

      {/* disclaimer footnote — pinned to the very bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto w-full max-w-[1200px] px-5 pb-6 sm:px-8 md:pl-28">
          <MonoLabel className="text-[10px] text-[var(--muted)]">{closing.disclaimer}</MonoLabel>
        </div>
      </div>
    </SectionWrap>
  );
}
