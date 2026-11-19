'use client';

// The one piece of scroll motion a chair page has: [data-reveal] rises a few pixels and fades
// in the first time it enters the viewport. That is all. No parallax, no tilt, no canvas, and
// nothing that prevents, smooths or re-times the page's own scrolling.
//
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

    // Whatever is already on screen is marked in BEFORE .ch-fx goes on, so the first paint
    // never blinks out and back; the hero has its own CSS arrival anyway.
    const reveals = Array.from(root.querySelectorAll('[data-reveal]'));
    const h0 = window.innerHeight;
    for (const el of reveals) {
      const r = el.getBoundingClientRect();
      if (r.top < h0 * 0.92 && r.bottom > 0) el.classList.add('is-in');
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
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    );
    for (const el of reveals) if (!el.classList.contains('is-in')) io.observe(el);

    return () => {
      io.disconnect();
      root.classList.remove('ch-fx');
    };
  }, [rootId]);

  return null;
}
