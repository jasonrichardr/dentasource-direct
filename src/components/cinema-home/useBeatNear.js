'use client';

import { useEffect, useState } from 'react';

/**
 * True once this beat is close enough to be worth paying for.
 *
 * The copy panels are FIXED overlays: every one of them intersects the viewport at all
 * times, so an observer on the panel itself would fire for all fifteen beats on load and
 * gate nothing. The scroll TRACK is the thing that really moves, so the observer watches
 * `.cinema-beat` number n instead, with a generous margin so the pictures are decoded
 * before the beat arrives rather than during it.
 *
 * Latching: once near, always near. A tile that has been fetched must not be dropped and
 * re-fetched when the visitor scrolls past and back.
 */
// ☠️ THE MARGIN MUST BE UNDER 100%, AND THAT IS ARITHMETIC, NOT TASTE.
// rootMargin percentages are read against the ROOT, so 150% meant 1.5 viewport heights.
// Beat 2's section starts exactly ONE viewport height below the fold, so a 150% margin
// was satisfied at scroll 0 and the team strip fetched all eighteen tiles before the
// visitor had moved: measured at 346 KB of the 1,424 KB the home page was pulling at
// boot. 45% keeps a comfortable half screen of lead time and cannot reach beat 2 from a
// standing start. Beats further down are many viewports away and unaffected either way.
export default function useBeatNear(beatIndex, { margin = '45%' } = {}) {
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (near) return undefined;
    // No observer (or no track) means we cannot tell — show the pictures rather than
    // leave a beat permanently empty.
    if (typeof IntersectionObserver === 'undefined') { setNear(true); return undefined; }
    const el = document.querySelectorAll('.cinema-scroll .cinema-beat')[beatIndex];
    if (!el) { setNear(true); return undefined; }

    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) setNear(true);
    }, { rootMargin: `${margin} 0px ${margin} 0px` });
    io.observe(el);
    return () => io.disconnect();
  }, [beatIndex, margin, near]);

  return near;
}
