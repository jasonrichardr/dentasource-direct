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
// ☠️ A FAILED CHUNK NEVER TAKES THE PAGE WITH IT. The hand loading, the boot ring, the
// error boundary and the Esc that works before the chunk arrives live in lazyDialog.js
// (shared with the reach map since 2026-10-07); once the chunk has failed, this button
// falls back to plain Google Maps directions.

import { useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import homeBeats from '@/data/cinema/home-beats.json';
import { visible } from '@/lib/cinema/visible';
import { useLazyDialog } from './lazyDialog';

// The showroom beat carries the whole popup's copy (cities, privacy line, labels). Any other
// beat that opens it (the Training Center, the door) sends only what differs: a title, a
// place name, its own `dest`. Its keys win over the showroom's.
const BASE = visible(homeBeats.beats).find((b) => b.key === 'the-floor')?.howFar || {};

const load = () => import('./HowFarDialog');
const DIRECTIONS = 'https://www.google.com/maps/dir/?api=1&destination=14.5809669%2C121.0867494&travelmode=driving';

/** `className` lets a host restyle the button (the reach map shows it as a quiet glass pill). */
export default function HowFar({ copy: own, className = 'cinema-cta dsd-cta dsd-cta-solid dsd-howfar lg lg-primary' }) {
  const copy = useMemo(() => ({ ...BASE, ...(own || {}) }), [own]);
  const btn = useRef(null);
  const { open, warm, show, render } = useLazyDialog(load, btn, { tag: 'how-far' });

  const onClick = () => show(() => {
    const d = copy.dest;
    const url = d && Number.isFinite(Number(d.lat)) ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${d.lat},${d.lng}`)}&travelmode=driving` : DIRECTIONS;
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  if (!copy?.label) return null;
  return (
    <>
      <button
        type="button"
        ref={btn}
        className={className}
        aria-haspopup="dialog"
        onPointerEnter={warm}
        onFocus={warm}
        onTouchStart={warm}
        onClick={onClick}
      >
        <span className="dsd-howfar-ping" aria-hidden="true" />
        {copy.label}
      </button>
      {open ? createPortal(render({ copy }), document.body) : null}
    </>
  );
}
