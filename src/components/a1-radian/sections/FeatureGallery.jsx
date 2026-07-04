'use client';

/* ─────────────────────────────────────────────────────────────────────
   FEATURE GALLERY — theme LIGHT (bone). The panels, whole + written.
   Each finished ROSON deck card shown FULL at native ratio (NativeImg,
   never cropped) beside a short DSD-voice benefit line — writing per photo.
   Editorial rows: text stacked above the card on mobile, alternating
   left/right on desktop. The wide four-handed panel spans full width with
   its writing above. FadeUp reveals; reduced-motion → static.
   ───────────────────────────────────────────────────────────────────── */

import { m, useReducedMotion } from 'framer-motion';
import { SectionWrap, Eyebrow, NativeImg, MonoLabel } from '../primitives';
import { featurePanels } from '../content';

const idx = (n) => `0${n}`;

export default function FeatureGallery() {
  const reduce = useReducedMotion();
  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.6, ease: [0.625, 0.05, 0, 1], delay },
        };

  return (
    <SectionWrap theme="light" id="a1-detail">
      <m.div {...reveal()} className="max-w-[46rem]">
        <Eyebrow signal light>Up close</Eyebrow>
        <h2 className="radian-h mt-5 text-[var(--ink)] text-[clamp(2rem,4.5vw,3rem)]">
          <span className="block">Every detail,</span>
          <span className="block">read it whole.</span>
        </h2>
      </m.div>

      <div className="mt-14 md:mt-20">
        {featurePanels.map((p, i) => {
          const wide = p.ratio > 1;
          const flip = i % 2 === 1;
          return (
            <div
              key={p.src}
              className={`grid grid-cols-1 gap-6 border-t border-[var(--line-ink)] pt-10 md:gap-12 md:pt-14 ${i > 0 ? 'mt-12 md:mt-16' : ''} ${wide ? '' : 'md:grid-cols-2 md:items-center'}`}
            >
              {/* writing */}
              <m.div {...reveal()} className={!wide && flip ? 'md:order-2' : ''}>
                <div className="flex items-baseline gap-3">
                  <MonoLabel className="text-[var(--signal-deep)]">{idx(i + 1)}</MonoLabel>
                  <h3 className="radian-h text-[var(--ink)] text-[clamp(1.5rem,3.4vw,2.1rem)]">{p.title}</h3>
                </div>
                <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-[var(--ink)]/70">{p.copy}</p>
              </m.div>

              {/* the panel, whole */}
              <m.div
                {...reveal(0.05)}
                className={`${!wide && flip ? 'md:order-1' : ''} ${wide ? '' : 'mx-auto w-full max-w-[440px] md:max-w-none'}`}
              >
                <NativeImg
                  src={p.src}
                  alt={p.alt}
                  ratio={p.ratio}
                  sizes={wide ? '(max-width: 768px) 100vw, 1136px' : '(max-width: 768px) 90vw, 50vw'}
                  className="ring-1 ring-[var(--line-ink)]"
                />
              </m.div>
            </div>
          );
        })}
      </div>
    </SectionWrap>
  );
}
