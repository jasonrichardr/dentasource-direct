'use client';

// The life of a chair page, in one listener set per page:
//   [data-reveal]    rises and fades in the first time it enters the viewport
//   [data-parallax]  drifts a few pixels against the scroll (the value is the rate)
//   [data-tilt]      leans toward a fine pointer (index cards)
//
// Native scroll only: nothing here prevents, smooths or re-times the page's own scrolling.
// Transform and opacity only. Under prefers-reduced-motion nothing is wired and the page is
// already in its finished state, because the hidden starting pose lives behind .ch-fx, which
// is only added here. Without JavaScript the page is simply all there.

import { useEffect } from 'react';

export default function ScrollFx({ rootId }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (!('IntersectionObserver' in window)) return undefined;

    // 1. Reveals. Whatever is already on screen is marked in BEFORE .ch-fx goes on, so the
    // first paint never blinks out and back; the hero has its own CSS arrival anyway.
    const reveals = Array.from(root.querySelectorAll('[data-reveal]'));
    const h0 = window.innerHeight;
    for (const el of reveals) {
      const r = el.getBoundingClientRect();
      if (r.top < h0 * 0.9 && r.bottom > 0) el.classList.add('is-in');
    }
    root.classList.add('ch-fx');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    for (const el of reveals) if (!el.classList.contains('is-in')) io.observe(el);

    // 2. Parallax, only for the layers near the viewport. The frame (the parent) is measured,
    // never the moving layer itself, so the motion cannot feed back into its own input.
    const plx = Array.from(root.querySelectorAll('[data-parallax]'));
    const live = new Set();
    let raf = 0;
    const paint = () => {
      raf = 0;
      const h = window.innerHeight;
      for (const el of live) {
        const frame = el.parentElement;
        if (!frame) continue;
        const r = frame.getBoundingClientRect();
        const rate = parseFloat(el.dataset.parallax) || 0.05;
        const d = (r.top + r.height / 2 - h / 2) * -rate;
        el.style.setProperty('--plx', `${Math.max(-26, Math.min(26, d)).toFixed(1)}px`);
      }
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(paint); };
    const pio = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) live.add(e.target);
          else live.delete(e.target);
        }
        schedule();
      },
      { rootMargin: '160px 0px' },
    );
    for (const el of plx) pio.observe(el);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    // 3. Tilt, for a mouse or a trackpad only. A finger dragging a card would just be scrolling.
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let tiltRaf = 0;
    let tiltLast = null;
    const tiltPaint = () => {
      tiltRaf = 0;
      if (!tiltLast) return;
      const [el, x, y] = tiltLast;
      const r = el.getBoundingClientRect();
      const px = (x - r.left) / r.width - 0.5;
      const py = (y - r.top) / r.height - 0.5;
      el.style.setProperty('--ry', `${(px * 7).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${(py * -5).toFixed(2)}deg`);
    };
    const onMove = (e) => {
      const el = e.target instanceof Element ? e.target.closest('[data-tilt]') : null;
      if (!el || !root.contains(el)) return;
      el.classList.add('is-tilting');
      tiltLast = [el, e.clientX, e.clientY];
      if (!tiltRaf) tiltRaf = requestAnimationFrame(tiltPaint);
    };
    const onOut = (e) => {
      const el = e.target instanceof Element ? e.target.closest('[data-tilt]') : null;
      if (!el || el.contains(e.relatedTarget)) return;
      tiltLast = null;
      el.classList.remove('is-tilting');
      el.style.removeProperty('--rx');
      el.style.removeProperty('--ry');
    };
    if (fine) {
      root.addEventListener('pointermove', onMove, { passive: true });
      root.addEventListener('pointerout', onOut, { passive: true });
    }

    return () => {
      io.disconnect();
      pio.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(tiltRaf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerout', onOut);
      root.classList.remove('ch-fx');
    };
  }, [rootId]);

  return null;
}
