'use client';

/* ─────────────────────────────────────────────────────────────────────
   CONFIGURATIONS — theme LIGHT (bone). The official ROSON A1 story.
   One clean article panel showing all three mounting models (top-mounted ·
   implant · trolley), shown WHOLE at native ratio, then the verbatim
   standard(√)/optional(△) table rebuilt as crisp HTML — Standard two-up,
   the four optional clinical add-ons on the right. The LED X-ray viewer is
   standard, per the ROSON configuration sheet. FadeUp reveals; reduced-motion
   → static.
   ───────────────────────────────────────────────────────────────────── */

import { m, useReducedMotion } from 'framer-motion';
import { SectionWrap, Eyebrow, NativeImg, MonoLabel } from '../primitives';
import { configurations } from '../content';

/* √ check (standard) */
function Check() {
  return (
    <span className="mt-[3px] grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[var(--signal)]/15" aria-hidden="true">
      <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
        <path d="M1.5 5.5L4 8L8.5 2.5" stroke="var(--signal)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/* △ triangle (optional) */
function Tri() {
  return (
    <span className="mt-[3px] grid h-4 w-4 shrink-0 place-items-center" aria-hidden="true">
      <svg width="11" height="10" viewBox="0 0 11 10" fill="none">
        <path d="M5.5 1L10 9H1L5.5 1Z" stroke="var(--ember)" strokeWidth="1.1" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function ConfigurationsSection() {
  const reduce = useReducedMotion();
  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.6, ease: [0.625, 0.05, 0, 1], delay },
        };

  return (
    <SectionWrap theme="light" id="a1-configurations">
      {/* header row */}
      <m.div {...reveal()}>
        <Eyebrow signal light>{configurations.eyebrow}</Eyebrow>
      </m.div>

      <m.div
        {...reveal(0.05)}
        className="mt-6 grid grid-cols-1 gap-8 border-t border-[var(--line-ink)] pt-8 md:grid-cols-2 md:gap-12 md:pt-10"
      >
        <h2 className="radian-h text-[var(--ink)] text-[clamp(2rem,4.5vw,3rem)]">
          {configurations.headline.map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </h2>
        <p className="max-w-[46ch] self-end text-[15px] leading-relaxed text-[var(--ink)]/70">
          {configurations.intro}
        </p>
      </m.div>

      {/* the clean configurations panel — shown whole */}
      <m.div {...reveal()} className="mx-auto mt-14 w-full max-w-[560px] md:mt-20">
        <NativeImg
          src={configurations.panel.src}
          alt={configurations.panel.alt}
          ratio={configurations.panel.ratio}
          sizes="(max-width: 768px) 100vw, 560px"
          className="ring-1 ring-[var(--line-ink)]"
        />
      </m.div>

      {/* standard(√) / optional(△) — the official table, rebuilt crisp */}
      <div className="mt-14 grid grid-cols-1 gap-8 md:mt-20 md:grid-cols-[1.7fr_1fr] md:gap-12">
        <m.div {...reveal()} className="border-t border-[var(--line-ink)] pt-6">
          <MonoLabel className="text-[var(--signal-deep)]">Standard</MonoLabel>
          <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {configurations.standard.map((s) => (
              <li key={s} className="flex items-start gap-3">
                <Check />
                <span className="text-[13.5px] leading-snug text-[var(--ink)]/85">{s}</span>
              </li>
            ))}
          </ul>
        </m.div>

        <m.div {...reveal(0.05)} className="border-t border-[var(--line-ink)] pt-6">
          <MonoLabel className="text-[var(--muted-ink)]">Optional add-ons</MonoLabel>
          <ul className="mt-5 grid grid-cols-1 gap-y-3">
            {configurations.optional.map((o) => (
              <li key={o} className="flex items-start gap-3">
                <Tri />
                <span className="text-[13.5px] leading-snug text-[var(--ink)]/85">{o}</span>
              </li>
            ))}
          </ul>
          <MonoLabel className="mt-6 block text-[var(--muted-ink)]">{configurations.note}</MonoLabel>
        </m.div>
      </div>
    </SectionWrap>
  );
}
