'use client';

/* ─────────────────────────────────────────────────────────────────────
   COLOR LIBRARY — theme DARK (ink). An auto-moving strip (Jarich's ask).
   The color cards — signatures, integrated color, the full upholstery
   palette — drift past on their own; the three signature colorways are named
   beneath. Colors pop on the dark canvas. Anchored #a1-color so the statement's
   "Explore the color library" button lands here. Reduced-motion → scroll row.
   ───────────────────────────────────────────────────────────────────── */

import { useReducedMotion } from 'framer-motion';
import { SectionWrap, Eyebrow, AutoStrip, MonoLabel, FadeUp } from '../primitives';
import { colorPanels, signatureColors } from '../content';

export default function ColorStrip() {
  const reduce = useReducedMotion();
  return (
    <SectionWrap theme="dark" id="a1-color" container={false}>
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <FadeUp className="max-w-[46rem]">
          <Eyebrow signal>The color library</Eyebrow>
          <h2 className="radian-h mt-5 text-[var(--bone)] text-[clamp(2rem,4.5vw,3rem)]">
            <span className="block">Forty-four ways</span>
            <span className="block">to be yours.</span>
          </h2>
          <p className="mt-5 max-w-[34rem] text-[15px] leading-snug text-[var(--muted)]">
            Three signatures pre-styled by ROSON. Beyond them, the full FS silicone and PU leather
            ranges — 44 colorways in all — the same color across the water box, tray, and upholstery.
          </p>
        </FadeUp>
      </div>

      <div className="mt-12 md:mt-16">
        <AutoStrip items={colorPanels} speed={56} theme="dark" reduce={reduce} />
      </div>

      {/* the three named signatures */}
      <div className="mx-auto mt-12 w-full max-w-[1200px] px-5 sm:px-8 md:mt-16">
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-3">
          {signatureColors.map((c) => (
            <FadeUp key={c.code}>
              <div className="flex items-center gap-3">
                <span
                  className="h-4 w-4 shrink-0 rounded-full ring-1 ring-white/15"
                  style={{ background: c.hex }}
                  aria-hidden="true"
                />
                <span className="radian-h text-[var(--bone)] text-[clamp(1.1rem,2.2vw,1.4rem)]">{c.name}</span>
                <MonoLabel className="text-[var(--muted)]">{c.code}</MonoLabel>
              </div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--bone)]/70">{c.poetry}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </SectionWrap>
  );
}
