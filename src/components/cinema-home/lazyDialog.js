'use client';

// lazyDialog.js: the plumbing every map popup button shares: "How far am I?" (HowFar.jsx)
// and "See our reach" (ReachMap.jsx). Moved out of HowFar.jsx on 2026-10-07 when the second
// button arrived; the laws below were written there first and still hold for both.
//
// ☠️ A FAILED CHUNK NEVER TAKES THE PAGE WITH IT. On bad mobile data the import can reject,
// and a lazy component that throws in render with no boundary blanks the whole home page.
// So the chunk is loaded by hand (not React.lazy, which caches the rejection), the boot ring
// closes on a tap or Esc, the dialog sits in its own boundary (DialogGuard), and once either
// fails the button falls back to a plain link out (`dead`).
//
// ☠️ ONE POPUP CAN OPEN ANOTHER. The reach map offers "How far am I?", so two of these can be
// open at once, the newer on top. Esc must close only the top one: a button passes `yieldTo`,
// a selector for whatever may sit above it, and its Esc does nothing while that is on screen.

import { Component, createElement, useCallback, useEffect, useRef, useState } from 'react';

export class DialogGuard extends Component {
  constructor(props) {
    super(props);
    this.state = { broken: false };
  }
  static getDerivedStateFromError() {
    return { broken: true };
  }
  componentDidCatch(err) {
    console.warn(`[${this.props.tag || 'dialog'}] dialog crashed`, err);
    this.props.onBreak();
  }
  render() {
    return this.state.broken ? null : this.props.children;
  }
}

/**
 * The state of one hand-loaded popup. `btn` is the opening button's ref, owned by the caller
 * (focus goes back to it on close).
 *   warm()       start the download (hover, focus, touch)
 *   show(onDead) open it; onDead() runs instead once the chunk has failed for good
 *   close()      close it and hand focus back to the button
 *   render(props) the portal's content: the dialog in its guard, or the boot ring
 */
export function useLazyDialog(load, btn, { tag = 'dialog', yieldTo = null, bootClass = 'hf-booting' } = {}) {
  const [open, setOpen] = useState(false);
  const [Dialog, setDialog] = useState(null);
  const [booting, setBooting] = useState(false); // the ring was on screen: the dialog skips its fade
  const [dead, setDead] = useState(false);
  const pending = useRef(null);

  const fetchDialog = useCallback(() => {
    pending.current ??= load()
      .then((m) => { setDialog(() => m.default); return m.default; })
      .catch((err) => { pending.current = null; throw err; });
    return pending.current;
  }, [load]);
  const warm = () => { if (!Dialog && !dead) fetchDialog().catch(() => {}); };

  const close = useCallback(() => {
    setOpen(false);
    setBooting(false);
    btn.current?.focus({ preventScroll: true });
  }, [btn]);

  // Esc closes from the first frame, before the dialog's own code has even arrived.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (yieldTo && document.querySelector(yieldTo)) return; // a popup above this one closes first
      e.stopPropagation();
      close();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, close, yieldTo]);

  const show = (onDead) => {
    if (dead) { onDead(); return; }
    setOpen(true);
    if (!Dialog) {
      setBooting(true);
      fetchDialog().catch(() => { setOpen(false); setBooting(false); setDead(true); });
    }
  };

  const render = (props) => (Dialog
    ? createElement(DialogGuard, { tag, onBreak: () => { setOpen(false); setDead(true); } },
      createElement(Dialog, { ...props, onClose: close, instant: booting }))
    : createElement('div', { className: bootClass, role: 'presentation', onClick: close },
      createElement('span', { className: 'hf-boot-ring' })));

  return { open, warm, show, close, render };
}
