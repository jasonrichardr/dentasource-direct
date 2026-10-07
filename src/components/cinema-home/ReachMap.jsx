'use client';

// The nationwide beat's "See our reach" button (Jarich, 2026-10-07: "the arrange a delivery
// button change it to a button where they will see the philippine map and make like stars on
// our clients so they know how far is our reach"). It replaced "Arrange a delivery".
//
// The sibling of HowFar.jsx and built the same way (lazyDialog.js): the popup, maplibre-gl,
// the client points and the parts column are ONE split chunk that starts downloading on the
// first hover, focus or touch. A visitor who never reaches the beat never pays for any of it.
//
// ☠️ THE BUTTON MUST CARRY .cinema-cta (the panel touch law), and the popup is portaled to
// <body> (a fixed beat panel would hand it its pointer-events and its stacking).
//
// ☠️ THE BOOT RING IS .rm-booting, NOT .hf-booting. The reach popup offers "How far am I?",
// and while that one is open the reach Esc stands aside for it (yieldTo). If both rings had
// the same class, the reach map's own ring would count as "a popup above" and Esc could not
// close it.

import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLazyDialog } from './lazyDialog';

const load = () => import('./ReachDialog');

export default function ReachMap({ copy }) {
  const btn = useRef(null);
  const { open, warm, show, render } = useLazyDialog(load, btn, { tag: 'reach', yieldTo: '.hf-backdrop, .hf-booting', bootClass: 'rm-booting' });

  // the chunk failed for good: the door still opens, onto Messenger
  const onClick = () => show(() => {
    if (copy?.messenger?.href) window.open(copy.messenger.href, '_blank', 'noopener,noreferrer');
  });

  if (!copy?.label) return null;
  return (
    <>
      <button
        type="button"
        ref={btn}
        className="cinema-cta dsd-cta dsd-cta-solid dsd-howfar dsd-reach lg lg-primary"
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
