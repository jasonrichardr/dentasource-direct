'use client';

/* ─────────────────────────────────────────────────────────────────────
   DETAIL ROW — theme LIGHT (bone). One swipeable row instead of five
   stacked sections (the second pinned hero, the manifesto, the moving
   feature strip, the whole panel gallery and the configurations panel).
   Each finished ROSON deck card is shown WHOLE at native ratio with its
   short DSD line underneath. Native horizontal scroll with snap; desktop
   gets two circled arrow buttons. Reduced motion needs no fallback: nothing
   here animates except the button scroll, which honours the user setting.
   ───────────────────────────────────────────────────────────────────── */

import { useRef, useCallback } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import { SectionWrap, Eyebrow, MonoLabel, FadeUp } from '../primitives';
import { details, featurePanels } from '../content';

// Card height on the image: tall enough that the deck panels' own text reads on a
// phone, short enough that card plus caption sits inside one screen.
const CARD_H = 'clamp(360px, 50svh, 470px)';

// The row's first card lines up with the heading above it: the page gutter on a phone,
// the 1200px container's inner edge on a wide screen.
const GUTTER = 'max(var(--gutter), calc((100% - 1200px) / 2 + var(--gutter)))';

function ArrowButton({ dir, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir < 0 ? 'Previous card' : 'Next card'}
      className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line-ink)] text-[var(--ink)] transition-colors duration-300 hover:bg-[var(--ink)] hover:text-[var(--bone)]"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ transform: dir < 0 ? 'scaleX(-1)' : undefined }}>
        <path d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export default function DetailScroller() {
  const rowRef = useRef(null);
  const reduce = useReducedMotion();

  const step = useCallback((dir) => {
    const el = rowRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
  }, [reduce]);

  return (
    <SectionWrap theme="light" id="a1-detail" container={false} pad="py-14 md:py-20">
      <div className="mx-auto flex w-full max-w-[1200px] items-end justify-between gap-6 px-5 sm:px-8">
        <FadeUp className="max-w-[40rem]">
          <Eyebrow signal light>{details.eyebrow}</Eyebrow>
          <h2 className="radian-h mt-4 text-[var(--ink)] text-[clamp(1.75rem,4vw,2.75rem)]">
            {details.headline.map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h2>
          <p className="mt-3 text-[15px] leading-snug text-[var(--ink)]/65">{details.sub}</p>
        </FadeUp>
        <div className="hidden shrink-0 gap-2 md:flex">
          <ArrowButton dir={-1} onClick={() => step(-1)} />
          <ArrowButton dir={1} onClick={() => step(1)} />
        </div>
      </div>

      <div
        ref={rowRef}
        className="mt-8 w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [--gutter:20px] [scrollbar-width:none] sm:[--gutter:32px] md:mt-10 [&::-webkit-scrollbar]:hidden"
        style={{ touchAction: 'pan-x pan-y', scrollPaddingInline: GUTTER }}
      >
        <ul className="flex w-max gap-4 md:gap-6" style={{ paddingInline: GUTTER }}>
          {featurePanels.map((p, i) => {
            // Wide panels cap at the phone's width, so the card stays inside one screen.
            const width = p.ratio > 1
              ? `min(86vw, calc(${CARD_H} * ${p.ratio}))`
              : `calc(${CARD_H} * ${p.ratio})`;
            return (
              <li key={p.src} className="shrink-0 snap-start" style={{ width }}>
                <figure
                  className="relative w-full overflow-hidden rounded-[6px] bg-white ring-1 ring-[var(--line-ink)]"
                  style={{ aspectRatio: String(p.ratio) }}
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes={p.ratio > 1 ? '(max-width: 768px) 86vw, 690px' : '(max-width: 768px) 80vw, 330px'}
                    className="object-cover"
                  />
                </figure>
                <div className="mt-4 flex items-baseline gap-2.5">
                  <MonoLabel className="text-[var(--signal-deep)]">{`0${i + 1}`}</MonoLabel>
                  <h3 className="radian-h text-[var(--ink)] text-[1.25rem]">{p.title}</h3>
                </div>
                <p className="mt-1.5 text-[13.5px] leading-snug text-[var(--ink)]/70">{p.copy}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </SectionWrap>
  );
}
