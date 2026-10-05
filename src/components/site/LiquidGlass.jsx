'use client';

// The live half of the liquid glass buttons (the look is src/styles/liquid-glass.css).
// One set of document listeners for the whole site, delegated, so a button rendered later
// (a popup, a new route) needs nothing but the `lg` class:
//   - the highlight follows the finger or cursor (--lg-x / --lg-y, once per frame)
//   - press squishes it (lg-press; CSS springs it back past its size)
//   - release gives the glass tick and a haptic
//
// ☠️ THE TICK AND THE HAPTIC FIRE ON POINTERUP FOR TOUCH, POINTERDOWN FOR A MOUSE. Browsers
// only grant the user activation that AudioContext and iOS's switch haptic need to an
// activation-triggering event: pointerdown counts for a mouse, but for touch only pointerup
// (and touchend) do. A touch tick on pointerdown would be silent on every phone.

import { useEffect } from 'react';
import { hapticTick, tick } from '@/lib/glassFx';

const SEL = '.lg';

export default function LiquidGlass() {
  useEffect(() => {
    let raf = 0, last = null;
    const paint = () => {
      raf = 0;
      if (!last) return;
      const [el, x, y] = last;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      el.style.setProperty('--lg-x', `${(((x - r.left) / r.width) * 100).toFixed(1)}%`);
      el.style.setProperty('--lg-y', `${(((y - r.top) / r.height) * 100).toFixed(1)}%`);
    };
    const onMove = (e) => {
      const el = e.target instanceof Element ? e.target.closest(SEL) : null;
      if (!el) return;
      last = [el, e.clientX, e.clientY];
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const release = () => {
      for (const n of document.querySelectorAll('.lg-press')) n.classList.remove('lg-press');
    };
    const onDown = (e) => {
      const el = e.target instanceof Element ? e.target.closest(SEL) : null;
      if (!el) return;
      el.classList.add('lg-press');
      onMove(e);
      if (e.pointerType === 'mouse' && e.button === 0) tick();
    };
    const onUp = (e) => {
      const el = e.target instanceof Element ? e.target.closest(SEL) : null;
      release();
      if (!el || e.pointerType === 'mouse') return;
      hapticTick(14);
      tick();
    };
    const onLeave = (e) => {
      // the light drifts back to the top when the pointer leaves, so a resting button is calm
      const el = e.target instanceof Element ? e.target.closest(SEL) : null;
      if (el && !el.contains(e.relatedTarget)) {
        el.style.removeProperty('--lg-x');
        el.style.removeProperty('--lg-y');
      }
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('pointercancel', release, { passive: true });
    document.addEventListener('pointerout', onLeave, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', release);
      document.removeEventListener('pointerout', onLeave);
    };
  }, []);
  return null;
}
