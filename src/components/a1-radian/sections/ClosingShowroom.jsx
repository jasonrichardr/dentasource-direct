'use client';

/* ─────────────────────────────────────────────────────────────────────
   CLOSING — the Pasig showroom and the ONE call on the page.
   The old A1 Pro hero loop plays under a strong dark scrim (poster first,
   so the first paint is clean). One primary action: Messenger, for this
   month's price. The install article stays as a quiet text link, not a
   second button. The bg parallaxes gently on native scroll (transform
   only); reduced motion → static.
   ───────────────────────────────────────────────────────────────────── */

import { useRef } from 'react';
import Link from 'next/link';
import { m, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { SectionWrap, MonoLabel, Arrow } from '../primitives';
import { closing } from '../content';
import { mediaUrl } from '@/lib/cinema/media';
import { trackContact } from '@/lib/analytics';

const VIDEO = '/videos/a1-pro-hero-loop.mp4';

function ParallaxBg({ y }) {
  return (
    <m.div className="absolute inset-x-0 will-change-transform" style={{ top: '-10%', bottom: '-10%', y }}>
      <video
        className="absolute inset-0 h-full w-full object-cover object-center"
        src={mediaUrl(VIDEO)}
        poster={closing.bg}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="ROSON A1 Pro dental chair, color reveal loop"
      />
    </m.div>
  );
}

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

export default function ClosingShowroom() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <SectionWrap theme="dark" container={false} id="a1-showroom" pad="" className="relative overflow-hidden">
      <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0" />
      <ParallaxBg y={reduce ? undefined : y} />
      <Scrim />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8 md:py-24">
        <div className="max-w-[36rem]">
          <MonoLabel className="text-[12px] text-[var(--signal)]">{closing.coords}</MonoLabel>
          <MonoLabel as="div" className="mt-1.5 text-[var(--muted)]">{closing.coordsLabel}</MonoLabel>

          <h2 className="radian-h mt-5 text-[clamp(2.5rem,6.5vw,5rem)] text-[var(--bone)]">
            {closing.headline.map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h2>

          <p className="mt-5 max-w-[34rem] text-[15px] leading-snug text-[var(--bone)]/80">{closing.body}</p>
          <p className="mt-3 max-w-[34rem] text-[14px] font-medium text-[var(--signal)]">{closing.included}</p>

          <a
            href={closing.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackContact({ channel: 'messenger', content_name: 'a1-pro-month-price' })}
            className="group mt-7 inline-flex min-h-[48px] items-center gap-3 rounded-full bg-[var(--signal)] px-6 py-3 text-[15px] font-medium text-[#04110b] transition-colors duration-300 hover:bg-[#0c9f74]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.12 2 11.2c0 2.86 1.46 5.4 3.74 7.06V22l3.42-1.88c.9.25 1.86.38 2.84.38 5.52 0 10-4.12 10-9.2S17.52 2 12 2zm1 12.4l-2.5-2.66L5.7 14.4l5.3-5.6 2.56 2.66 4.74-2.66-5.3 5.6z" />
            </svg>
            {/* the long label wraps to two lines on a phone, so phones get the short one */}
            <span className="sm:hidden">{closing.cta.short}</span>
            <span className="hidden sm:inline">{closing.cta.label}</span>
            <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>

          <div className="mt-5">
            <Link href={closing.deliver.href} className="text-[14px] text-[var(--bone)]/75 underline decoration-[var(--bone)]/30 underline-offset-4 hover:text-[var(--bone)]">
              {closing.deliver.label}
            </Link>
          </div>

          <MonoLabel as="p" className="mt-10 block text-[10px] text-[var(--muted)]">{closing.disclaimer}</MonoLabel>
        </div>
      </div>
    </SectionWrap>
  );
}
