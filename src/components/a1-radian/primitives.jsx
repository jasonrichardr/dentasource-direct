'use client';

/* ─────────────────────────────────────────────────────────────────────
   ROSON A1 Pro — rideradian-DNA shared primitives.
   Every section imports from here so the whole page reads as one system:
   two radii (full pill + 6px media), zero shadows, one signal colour,
   mono micro-labels, Instrument-Sans headings at weight 500 / −2.5% track.
   Motion uses framer-motion `m` (the app ships LazyMotion) — transform +
   opacity only, native scroll, no hijack. Honours reduced-motion.
   ───────────────────────────────────────────────────────────────────── */

import { m } from 'framer-motion';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/* Circled arrow — the button signature (right side of every pill). */
export function Arrow({ className = '' }) {
  return (
    <span
      className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border border-current ${className}`}
      aria-hidden="true"
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/* Plus glyph variant (nav-style pill). */
export function Plus({ className = '' }) {
  return (
    <span className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border border-current ${className}`} aria-hidden="true">
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
        <path d="M4.5 1V8M1 4.5H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/*
 * Pill — the one control shape. Full radius, circled-arrow icon.
 *   variant: 'primary' (emerald), 'ghost' (outline of current colour),
 *            'solid'   (ink on bone, used on light canvases).
 */
export function Pill({ href, children, variant = 'primary', icon = 'arrow', className = '', onClick }) {
  const base =
    'group inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[13px] font-medium transition-colors duration-300 [transition-timing-function:var(--ease)] whitespace-nowrap';
  const variants = {
    primary: 'bg-[var(--signal)] text-[#04110b] hover:bg-[#0c9f74]',
    ghost: 'border border-current/70 text-current hover:bg-white/10',
    solid: 'bg-[var(--ink)] text-[var(--bone)] hover:bg-black',
  };
  const Glyph = icon === 'plus' ? Plus : Arrow;
  const inner = (
    <>
      <span>{children}</span>
      <Glyph className="transition-transform duration-300 [transition-timing-function:var(--ease)] group-hover:translate-x-0.5" />
    </>
  );
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      {inner}
    </button>
  );
}

/* Mono micro-label — eyebrows, captions, coordinates, counters. */
export function MonoLabel({ children, className = '', as: Tag = 'span' }) {
  return (
    <Tag className={`radian-mono text-[11px] leading-[1.4] ${className}`}>
      {children}
    </Tag>
  );
}

/* Section eyebrow: mono label with a leading tick, on-signal by default.
   On LIGHT (bone) canvases pass `light` — the emerald label drops to
   --signal-deep (~7:1 on bone, WCAG AA) while the tick keeps the bright
   --signal identity. On dark, --signal already clears AA. */
export function Eyebrow({ children, className = '', signal = false, light = false }) {
  const textColor = signal
    ? light ? 'text-[var(--signal-deep)]' : 'text-[var(--signal)]'
    : light ? 'text-[var(--muted-ink)]' : 'text-[var(--muted)]';
  return (
    <MonoLabel className={`inline-flex items-center gap-2 ${textColor} ${className}`}>
      <span className={`inline-block h-px w-6 ${signal ? 'bg-[var(--signal)]' : 'bg-current'}`} aria-hidden="true" />
      {children}
    </MonoLabel>
  );
}

/*
 * MediaCard — 6px radius image with an optional mono caption chip pinned
 * to the bottom edge. The only elevation on the page is photography.
 */
export function MediaCard({ src, alt, caption, priority = false, className = '', sizes = '(max-width: 768px) 100vw, 50vw', imgClassName = 'object-cover' }) {
  return (
    <figure className={`relative overflow-hidden rounded-[6px] ${className}`}>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={imgClassName} />
      {caption ? (
        <figcaption className="absolute inset-x-0 bottom-0 p-3">
          <span className="radian-mono inline-block rounded-[6px] bg-black/45 px-3 py-1 text-[10.5px] leading-[1.5] text-white/90 backdrop-blur-sm">
            {caption}
          </span>
        </figcaption>
      ) : null}
    </figure>
  );
}

/*
 * NativeImg — renders an image at its OWN native ratio. No fixed box, no crop.
 * Pass `ratio` (natural width/height). The figure takes 100% of its parent's
 * width and derives its height from the ratio via CSS aspect-ratio, so
 * object-cover fills it pixel-perfect and the image is NEVER cut — the
 * container bends to the image, not the reverse. The PARENT decides width
 * (by orientation); NativeImg decides height. 6px radius, optional caption chip.
 * (This is the rideradian mobile grammar: content images at native ratio.)
 */
export function NativeImg({ src, alt, ratio, caption, priority = false, sizes = '100vw', className = '', imgClassName = 'object-cover' }) {
  return (
    <figure
      className={`relative w-full overflow-hidden rounded-[6px] ${className}`}
      style={{ aspectRatio: String(ratio) }}
    >
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={imgClassName} />
      {caption ? (
        <figcaption className="absolute inset-x-0 bottom-0 p-3">
          <span className="radian-mono inline-block rounded-[6px] bg-black/45 px-3 py-1 text-[10.5px] leading-[1.5] text-white/90 backdrop-blur-sm">
            {caption}
          </span>
        </figcaption>
      ) : null}
    </figure>
  );
}

/*
 * AutoStrip — the rideradian moving image strip (the one Jarich loves).
 * A horizontal row of finished cards that drifts on its own, seamlessly: the
 * set is duplicated, and scrollLeft wraps at the halfway mark so the copy lands
 * exactly on the original. Cards are FIXED-HEIGHT with the image's native
 * aspect-ratio → width derives, object-cover fills with zero crop.
 *
 * It drives native scrollLeft (not a CSS transform) so the user can SWIPE the
 * strip to inspect a card at any time. Touching, dragging, or wheeling pauses
 * the drift; it resumes on its own IDLE_MS after the last interaction. Desktop
 * hover pauses too. Reduced-motion → a plain scrollable row, no drift.
 *
 * `speed` = seconds per full loop. Slow it for text-bearing cards.
 */
const IDLE_MS = 1000; // resume the drift this long after the user stops

export function AutoStrip({ items, speed = 60, height = 'clamp(300px,56vh,540px)', theme = 'dark', reduce = false }) {
  const scrollerRef = useRef(null);
  const cardBg = theme === 'light' ? 'bg-white ring-1 ring-[var(--line-ink)]' : 'bg-[#0d1a14]';
  const cardCls = `relative mr-4 shrink-0 overflow-hidden rounded-[6px] md:mr-6 ${cardBg}`;
  const Card = ({ it, decorative }) => (
    <div className={cardCls} style={{ height, aspectRatio: String(it.ratio) }}>
      <Image src={it.src} alt={decorative ? '' : it.alt || ''} fill sizes="80vw" className="object-cover" />
    </div>
  );

  useEffect(() => {
    if (reduce) return;
    const el = scrollerRef.current;
    if (!el) return;

    let raf = 0;
    let last = 0;
    let held = false;    // pointer/touch is down — drift stays off until release
    let touched = 0;     // timestamp of the last interaction; drift waits IDLE_MS past it

    const half = () => el.scrollWidth / 2;

    // Timestamp-based rather than a timer, so the resume delay is exactly
    // IDLE_MS after the LAST interaction regardless of event ordering.
    const wake = () => { touched = performance.now(); };
    const grab = () => { held = true; wake(); };
    const release = () => { held = false; wake(); };

    // scrollLeft rounds to whole pixels, so a sub-pixel per-frame delta would
    // truncate to zero and never advance. Carry the position as a float here
    // and assign it; resync from the DOM whenever the user is driving.
    let pos = el.scrollLeft;
    let written = el.scrollLeft; // the last value WE wrote

    const tick = (t) => {
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0; // clamp tab-switch jumps
      last = t;
      const h = half();
      if (h > 0) {
        // Chromium fires pointercancel and claims the gesture the moment a drag
        // begins, so no release event arrives while the user is still panning.
        // Instead: if scrollLeft moved somewhere WE didn't put it, the user (or
        // touch momentum) is driving — keep the drift out of their way.
        if (Math.abs(el.scrollLeft - written) > 2) {
          wake();
          pos = el.scrollLeft;
        }

        const resting = !held && performance.now() - touched >= IDLE_MS;
        if (resting) {
          pos += (h / speed) * dt;
        } else {
          pos = el.scrollLeft; // user is driving — follow them
        }
        if (pos >= h) pos -= h;        // seamless wrap onto the duplicate set
        else if (pos < 0) pos += h;
        el.scrollLeft = pos;
        written = el.scrollLeft;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const DOWN = ['pointerdown', 'mousedown', 'touchstart'];
    const UP = ['pointerup', 'mouseup', 'pointercancel', 'touchend', 'touchcancel'];
    const IDLE = ['wheel', 'mouseenter', 'mousemove'];
    DOWN.forEach((e) => el.addEventListener(e, grab, { passive: true }));
    UP.forEach((e) => el.addEventListener(e, release, { passive: true }));
    IDLE.forEach((e) => el.addEventListener(e, wake, { passive: true }));
    // a release can land outside the strip if the finger/cursor drifts off it
    window.addEventListener('mouseup', release, { passive: true });
    window.addEventListener('touchend', release, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      DOWN.forEach((e) => el.removeEventListener(e, grab));
      UP.forEach((e) => el.removeEventListener(e, release));
      IDLE.forEach((e) => el.removeEventListener(e, wake));
      window.removeEventListener('mouseup', release);
      window.removeEventListener('touchend', release);
    };
  }, [reduce, speed, items]);

  if (reduce) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="flex w-max px-5 sm:px-8">
          {items.map((it, i) => <Card key={i} it={it} />)}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollerRef}
      className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      style={{ scrollBehavior: 'auto', touchAction: 'pan-x', overscrollBehaviorX: 'contain' }}
    >
      <div className="flex w-max">
        {items.map((it, i) => <Card key={i} it={it} />)}
        {items.map((it, i) => <Card key={`dup-${i}`} it={it} decorative />)}
      </div>
    </div>
  );
}

/* SpecTick — a mono spec line for the demoted features (label · value). */
export function SpecTick({ label, value, className = '' }) {
  return (
    <div className={`flex items-baseline gap-3 border-t border-[var(--line)] py-3 ${className}`}>
      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--signal)]" aria-hidden="true" />
      <div className="flex-1">
        <div className="radian-mono text-[10.5px] text-[var(--muted)]">{label}</div>
        {value ? <div className="mt-1 text-[13.5px] text-[var(--bone)]/90">{value}</div> : null}
      </div>
    </div>
  );
}

/*
 * SectionWrap — the section shell. Sets the theme (dark ink / light bone),
 * vertical rhythm (144–180px scale), and the max container. Keeps every
 * section on the same grid.
 */
export function SectionWrap({ children, theme = 'dark', className = '', pad = 'py-[104px] md:py-[144px]', container = true, id }) {
  const themeCls = theme === 'light' ? 'bg-[var(--bone)] text-[var(--ink)]' : 'bg-[var(--ink)] text-[var(--bone)]';
  return (
    <section id={id} className={`relative ${themeCls} ${pad} ${className}`}>
      {container ? <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">{children}</div> : children}
    </section>
  );
}

/* Fade-up on scroll into view — the base reveal (transform + opacity only). */
export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: [0.625, 0.05, 0, 1] },
};

export function FadeUp({ children, delay = 0, className = '', as = 'div' }) {
  const MTag = m[as] || m.div;
  return (
    <MTag
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.625, 0.05, 0, 1], delay }}
    >
      {children}
    </MTag>
  );
}
