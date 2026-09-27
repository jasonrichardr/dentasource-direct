'use client';

/* ─────────────────────────────────────────────────────────────────────
   SPECIFICATIONS — theme LIGHT (bone). The spec sheet and the official
   configuration table, merged into one accordion of native <details>.
   Every row stays in the DOM (crawlable, readable by a screen reader, found
   by the browser's find in page); only the first group opens by default, so
   the full sheet costs one screen instead of four. No JS, no animation.
   ───────────────────────────────────────────────────────────────────── */

import { SectionWrap, Eyebrow, MonoLabel, FadeUp } from '../primitives';
import { specGroups, configurations } from '../content';

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

function Rows({ rows }) {
  return (
    <dl className="grid gap-x-12 md:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[38%_1fr] items-baseline gap-3 border-t border-[var(--line-ink)] py-2.5">
          <dt><MonoLabel className="text-[var(--muted-ink)]">{label}</MonoLabel></dt>
          <dd className="m-0 min-w-0 text-[13.5px] leading-snug text-[var(--ink)]/85">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Kit() {
  return (
    <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-[1.7fr_1fr] md:gap-12">
      <div>
        <MonoLabel className="text-[var(--signal-deep)]">Standard</MonoLabel>
        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 md:gap-x-8">
          {configurations.standard.map((s) => (
            <li key={s} className="flex items-start gap-2">
              <Check />
              <span className="text-[13px] leading-snug text-[var(--ink)]/85">{s}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <MonoLabel className="text-[var(--muted-ink)]">Optional add-ons</MonoLabel>
        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-1">
          {configurations.optional.map((o) => (
            <li key={o} className="flex items-start gap-2">
              <Tri />
              <span className="text-[13px] leading-snug text-[var(--ink)]/85">{o}</span>
            </li>
          ))}
        </ul>
        <MonoLabel as="p" className="mt-4 block text-[var(--muted-ink)]">{configurations.note}</MonoLabel>
      </div>
    </div>
  );
}

export default function SpecsAccordion() {
  return (
    <SectionWrap theme="light" id="a1-specs" pad="py-14 md:py-20">
      <FadeUp className="max-w-[46rem]">
        <Eyebrow signal light>Technical specification</Eyebrow>
        <h2 className="radian-h mt-4 text-[var(--ink)] text-[clamp(1.75rem,4vw,2.75rem)]">
          Everything, as standard.
        </h2>
      </FadeUp>

      <div className="mt-8 border-b border-[var(--line-ink)]">
        {specGroups.map((g, i) => (
          <details key={g.key} open={i === 0} className="group border-t border-[var(--line-ink)]">
            <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 py-3 [&::-webkit-details-marker]:hidden">
              <span className="radian-h text-[1.15rem] text-[var(--ink)] md:text-[1.3rem]">{g.title}</span>
              <span className="flex items-center gap-3">
                <MonoLabel className="text-[var(--muted-ink)]">
                  {g.kit ? `${g.rows.length + configurations.standard.length + configurations.optional.length} items` : `${g.rows.length} ${g.rows.length === 1 ? 'row' : 'rows'}`}
                </MonoLabel>
                <span className="grid h-7 w-7 place-items-center rounded-full border border-[var(--line-ink)] text-[var(--ink)] transition-transform duration-300 group-open:rotate-45" aria-hidden="true">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1V9M1 5H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                </span>
              </span>
            </summary>
            <div className="pb-5">
              <Rows rows={g.rows} />
              {g.kit && <Kit />}
            </div>
          </details>
        ))}
      </div>

      <MonoLabel as="p" className="mt-4 block text-[var(--muted-ink)]">
        Specifications confirmed at showroom demo and quote.
      </MonoLabel>
    </SectionWrap>
  );
}
