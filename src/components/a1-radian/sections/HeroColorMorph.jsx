'use client';

/* ─────────────────────────────────────────────────────────────────────
   HERO — color-morph pinned scrub (the signature moment).
   One studio render of the A1 Pro; as you scroll the pinned hero its
   upholstery crossfades ROSON Blue → Ballet Pink → Mint Green. The
   product thesis ("your color") lands wordlessly. Native scroll, a
   sticky pin, transform+opacity only. Reduced-motion → one static frame.
   ───────────────────────────────────────────────────────────────────── */

import { useRef } from 'react';
import { m, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { Pill, MonoLabel } from '../primitives';
import { heroFrames, hero } from '../content';

/* The render is the COMPLETE unit (chair + delivery + light + assistant
   tray + base) on a studio-grey field. object-contain guarantees the whole
   unit is always visible — the grey letterbox blends into STUDIO_BG below.
   Mobile: anchored top (unit up, copy on the grey beneath). Desktop:
   anchored right (unit right, copy on the grey left). */
function Frame({ frame, opacity, priority }) {
  return (
    // On mobile the fixed site navbar (~100px) overlays the top of the hero,
    // so the image area is inset flush below it (top-[100px]) — clears the nav
    // with no grey strip between them, and keeps the whole unit (light arm,
    // headrest) visible. Desktop anchors the unit right, so no inset (md:top-0).
    <m.div className="absolute inset-x-0 bottom-0 top-[100px] md:top-0" style={{ opacity }} aria-hidden={!priority}>
      <Image
        src={frame.src}
        alt={priority ? `ROSON A1 Pro dental chair in ${frame.name}` : ''}
        fill
        priority={priority}
        sizes="100vw"
        className="object-contain object-top md:object-right"
      />
    </m.div>
  );
}

/* Matches the render's studio field so the object-contain letterbox reads
   as one continuous background instead of a visible frame edge. */
const STUDIO_BG = 'linear-gradient(180deg, #dfe2e4 0%, #e9ebed 46%, #f2f3f4 100%)';

export default function HeroColorMorph() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Continuous crossfade — overlaps keep exactly one frame dominant.
  const blue = useTransform(scrollYProgress, [0, 0.30, 0.42], [1, 1, 0]);
  const pink = useTransform(scrollYProgress, [0.30, 0.42, 0.62, 0.74], [0, 1, 1, 0]);
  const mint = useTransform(scrollYProgress, [0.62, 0.74, 1], [0, 1, 1]);
  const opacities = [blue, pink, mint];

  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  // Static fallback: no pin, single frame, natural height.
  if (reduce) {
    return (
      <section className="relative h-[86vh] min-h-[560px] overflow-hidden" style={{ background: STUDIO_BG }}>
        <div className="absolute inset-x-0 bottom-0 top-[100px] md:top-0">
          <Image src={heroFrames[1].src} alt={`ROSON A1 Pro dental chair in ${heroFrames[1].name}`} fill priority sizes="100vw" className="object-contain object-top md:object-right" />
        </div>
        <HeroScrim />
        <HeroCopy />
      </section>
    );
  }

  return (
    <section ref={ref} data-scrub className="relative h-[300vh]" style={{ background: STUDIO_BG }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {heroFrames.map((f, i) => (
          <Frame key={f.key} frame={f} opacity={opacities[i]} priority={i === 0} />
        ))}
        <HeroScrim />
        <HeroCopy activeOpacities={opacities} />

        {/* scroll hint — centered bottom, fades on first scroll */}
        <m.div style={{ opacity: hintOpacity }} className="pointer-events-none absolute inset-x-0 bottom-6 hidden flex-col items-center gap-1.5 text-[#0A1410]/60 md:flex">
          <MonoLabel className="text-[10px]">{hero.scrollHint}</MonoLabel>
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none" className="animate-[gentleBob_1.8s_ease-in-out_infinite]">
            <path d="M7 1V17M7 17L1 11M7 17L13 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </m.div>
      </div>
    </section>
  );
}

/* Subtle depth wash — a faint left column (desktop copy) + a bottom lift
   (mobile copy sits on the grey beneath the unit). Ink text over light grey
   is already high-contrast, so this is atmosphere, not a legibility crutch. */
function HeroScrim() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          'linear-gradient(90deg, rgba(226,229,231,0.55) 0%, rgba(226,229,231,0) 40%),' +
          'linear-gradient(0deg, rgba(243,244,245,0.9) 0%, rgba(243,244,245,0) 24%)',
      }}
    />
  );
}

function HeroCopy({ activeOpacities }) {
  return (
    <div className="absolute inset-x-0 bottom-0 md:inset-y-0 md:right-auto">
      <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col justify-end px-5 pb-[max(1rem,2.5vh)] sm:px-8 md:justify-center md:pb-0">
        <div className="max-w-[34rem]">
          {/* color-name mono label — three stacked, synced to the morph */}
          <div className="relative mb-4 h-4">
            {activeOpacities
              ? heroFrames.map((f, i) => (
                  <m.div key={f.key} style={{ opacity: activeOpacities[i] }} className="absolute inset-0 flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: f.swatch }} />
                    <MonoLabel className="text-[11px] text-[#0A1410]/70">
                      {hero.eyebrow} · {f.name} {f.code}
                    </MonoLabel>
                  </m.div>
                ))
              : (
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: heroFrames[1].swatch }} />
                  <MonoLabel className="text-[11px] text-[#0A1410]/70">{hero.eyebrow}</MonoLabel>
                </div>
              )}
          </div>

          <h1 className="radian-h text-[#0A1410] text-[clamp(2.75rem,8vw,5rem)]">
            {hero.headline.map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>

          <p className="mt-4 max-w-[26rem] text-[15px] leading-snug text-[#0A1410]/70">
            {hero.sub}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Pill href={hero.primary.href} variant="primary">{hero.primary.label}</Pill>
            <Pill href={hero.secondary.href} variant="solid">{hero.secondary.label}</Pill>
          </div>
        </div>
      </div>
    </div>
  );
}
