'use client';

/* ─────────────────────────────────────────────────────────────────────
   TECH SPECS — the mono definition list (theme: dark ink).
   Everything the A1 Pro ships with, stated plainly: a two-column grid of
   hairline-topped rows, each a mono label paired with its bone value.
   No hero moment here — this is the credibility ledger that mirrors the
   JSON-LD schema. FadeUp reveal (transform + opacity); reduced-motion
   drops the reveal and renders static. Say less, bigger.
   ───────────────────────────────────────────────────────────────────── */

import { useReducedMotion } from 'framer-motion';
import { SectionWrap, Eyebrow, MonoLabel, FadeUp } from '../primitives';
import { techSpecs } from '../content';

// Static reveal for reduced-motion — hoisted so it is a stable component
// reference (never created during render). Ignores `delay`.
function StaticReveal({ children, className }) {
  return <div className={className}>{children}</div>;
}

export default function TechSpecs() {
  const reduce = useReducedMotion();

  // Reduced motion → no reveal, static block on the same grid.
  const Reveal = reduce ? StaticReveal : FadeUp;

  return (
    <SectionWrap theme="dark" id="a1-specs">
      <Reveal className="max-w-[46rem]">
        <Eyebrow signal>Technical specification</Eyebrow>
        <h2 className="radian-h mt-5 text-[clamp(2rem,4.5vw,3rem)]">
          Everything, as standard.
        </h2>
      </Reveal>

      <Reveal delay={0.08} className="mt-12">
        <dl className="grid gap-x-12 md:grid-cols-2">
          {techSpecs.map(([label, value]) => (
            <div
              key={label}
              className="flex flex-col gap-1 border-t border-[var(--line)] py-3 sm:flex-row sm:items-baseline sm:gap-4"
            >
              <dt className="sm:w-[40%] sm:shrink-0">
                <MonoLabel className="text-[var(--muted)]">{label}</MonoLabel>
              </dt>
              <dd className="m-0 min-w-0 flex-1 text-[13.5px] leading-snug text-[var(--bone)]/90">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal delay={0.12} className="mt-9">
        <p className="radian-mono text-[10.5px] leading-[1.5] text-[var(--muted)]">
          Specifications confirmed at showroom demo and quote.
        </p>
      </Reveal>
    </SectionWrap>
  );
}
