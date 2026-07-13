'use client';

/* ─────────────────────────────────────────────────────────────────────
   FEATURE STRIP — theme DARK (ink). The rideradian moving strip.
   The finished ROSON deck panels drift past on their own — the auto-moving
   showcase Jarich loves. Edge-to-edge, GPU-cheap (transform-only), pauses on
   hover, slow enough to read. Reduced-motion → a plain scrollable row.
   The cards are self-captioned, so no overlay text.
   ───────────────────────────────────────────────────────────────────── */

import { useReducedMotion } from 'framer-motion';
import { SectionWrap, Eyebrow, AutoStrip, FadeUp } from '../primitives';
import { showcasePanels } from '../content';

export default function FeatureStrip() {
  const reduce = useReducedMotion();
  return (
    <SectionWrap theme="dark" id="a1-features" container={false} pad="py-[88px] md:py-[128px]">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <FadeUp className="max-w-[46rem]">
          <Eyebrow signal>The A1 Pro</Eyebrow>
          <h2 className="radian-h mt-5 text-[var(--bone)] text-[clamp(2rem,4.5vw,3rem)]">
            <span className="block">Detail by detail,</span>
            <span className="block">built to be seen.</span>
          </h2>
          <p className="mt-5 max-w-[34rem] text-[15px] leading-snug text-[var(--muted)]">
            Every panel of the A1 Pro, drifting past. Swipe to hold one still — it picks back up on its own.
          </p>
        </FadeUp>
      </div>

      <div className="mt-12 md:mt-16">
        <AutoStrip items={showcasePanels} speed={70} theme="dark" reduce={reduce} />
      </div>
    </SectionWrap>
  );
}
