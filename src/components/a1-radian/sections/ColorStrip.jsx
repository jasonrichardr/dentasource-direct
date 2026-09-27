'use client';

/* ─────────────────────────────────────────────────────────────────────
   COLOR LIBRARY — theme DARK (ink). The auto moving strip (Jarich's ask).
   The color cards drift past on their own; the three signature colorways
   are named beneath as one compact row of swatches. Anchored #a1-color.
   Reduced motion → a plain scrollable row.
   ───────────────────────────────────────────────────────────────────── */

import { useReducedMotion } from 'framer-motion';
import { SectionWrap, Eyebrow, AutoStrip, MonoLabel, FadeUp } from '../primitives';
import { colorPanels, colorCopy, signatureColors } from '../content';

export default function ColorStrip() {
  const reduce = useReducedMotion();
  return (
    <SectionWrap theme="dark" id="a1-color" container={false} pad="py-14 md:py-20">
      <div className="mx-auto grid w-full max-w-[1200px] gap-4 px-5 sm:px-8 md:grid-cols-2 md:items-end md:gap-12">
        <FadeUp>
          <Eyebrow signal>{colorCopy.eyebrow}</Eyebrow>
          <h2 className="radian-h mt-4 text-[var(--bone)] text-[clamp(1.75rem,4vw,2.75rem)]">
            {colorCopy.headline.map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h2>
        </FadeUp>
        <FadeUp>
          <p className="max-w-[34rem] text-[15px] leading-snug text-[var(--muted)]">{colorCopy.body}</p>
        </FadeUp>
      </div>

      <div className="mt-8 md:mt-10">
        <AutoStrip items={colorPanels} speed={56} theme="dark" reduce={reduce} height="clamp(300px,44svh,440px)" />
      </div>

      <ul className="mx-auto mt-8 flex w-full max-w-[1200px] flex-wrap gap-x-6 gap-y-3 px-5 sm:px-8 md:mt-10">
        {signatureColors.map((c) => (
          <li key={c.code} className="flex items-center gap-2.5">
            <span className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-white/15" style={{ background: c.hex }} aria-hidden="true" />
            <span className="text-[15px] text-[var(--bone)]">{c.name}</span>
            <MonoLabel className="text-[var(--muted)]">{c.code}</MonoLabel>
          </li>
        ))}
      </ul>
    </SectionWrap>
  );
}
