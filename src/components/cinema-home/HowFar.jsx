'use client';

// The showroom beat's "How far am I?" button. The popup (and maplibre-gl with it) is a split
// chunk: it starts downloading on the first hover, focus or touch, so by the tap the map is
// usually there, and a visitor who never reaches the beat never pays for it.
//
// ☠️ THE BUTTON MUST CARRY .cinema-cta. The cinema's touch law sets every panel to
// pointer-events:none and lets only `.cinema-panel.live .cinema-cta` be tapped.
//
// ☠️ THE POPUP IS PORTALED TO <body>. Each beat panel is a fixed overlay inside the cinema
// stage; a dialog rendered in place would inherit its pointer-events and its stacking.
//
// ☠️ A FAILED CHUNK NEVER TAKES THE PAGE WITH IT. On bad mobile data the import can reject,
// and a lazy component that throws in render with no boundary blanks the whole home page.
// So the chunk is loaded by hand (not React.lazy, which caches the rejection), the boot ring
// closes on a tap or Esc, the dialog sits in its own boundary, and once either fails the
// button falls back to plain Google Maps directions.

import { Component, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const load = () => import('./HowFarDialog');
const DIRECTIONS = 'https://www.google.com/maps/dir/?api=1&destination=14.5809669%2C121.0867494&travelmode=driving';

class Guard extends Component {
  constructor(props) {
    super(props);
    this.state = { broken: false };
  }
  static getDerivedStateFromError() {
    return { broken: true };
  }
  componentDidCatch(err) {
    console.warn('[how-far] dialog crashed', err);
    this.props.onBreak();
  }
  render() {
    return this.state.broken ? null : this.props.children;
  }
}

export default function HowFar({ copy }) {
  const [open, setOpen] = useState(false);
  const [Dialog, setDialog] = useState(null);
  const [booting, setBooting] = useState(false); // the ring was on screen: the dialog skips its fade
  const [dead, setDead] = useState(false);
  const btn = useRef(null);
  const pending = useRef(null);

  const fetchDialog = useCallback(() => {
    pending.current ??= load()
      .then((m) => { setDialog(() => m.default); return m.default; })
      .catch((err) => { pending.current = null; throw err; });
    return pending.current;
  }, []);
  const warm = () => { if (!Dialog && !dead) fetchDialog().catch(() => {}); };

  const close = useCallback(() => {
    setOpen(false);
    setBooting(false);
    btn.current?.focus({ preventScroll: true });
  }, []);

  // Esc closes from the first frame, before the dialog's own code has even arrived.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, close]);

  const onClick = () => {
    if (dead) { window.open(DIRECTIONS, '_blank', 'noopener,noreferrer'); return; }
    setOpen(true);
    if (!Dialog) {
      setBooting(true);
      fetchDialog().catch(() => { setOpen(false); setBooting(false); setDead(true); });
    }
  };

  if (!copy?.label) return null;
  return (
    <>
      <button
        type="button"
        ref={btn}
        className="cinema-cta dsd-cta dsd-cta-solid dsd-howfar"
        aria-haspopup="dialog"
        onPointerEnter={warm}
        onFocus={warm}
        onTouchStart={warm}
        onClick={onClick}
      >
        <span className="dsd-howfar-ping" aria-hidden="true" />
        {copy.label}
      </button>
      {open ? createPortal(
        Dialog ? (
          <Guard onBreak={() => { setOpen(false); setDead(true); }}>
            <Dialog copy={copy} onClose={close} instant={booting} />
          </Guard>
        ) : (
          <div className="hf-booting" role="presentation" onClick={close}>
            <span className="hf-boot-ring" />
          </div>
        ),
        document.body,
      ) : null}
    </>
  );
}
