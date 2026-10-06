'use client';

// The hidden door to the home page's marquee editor.
//
// Jarich, 2026-10-06: "when i press the moon 7 times i can login and simply click the photos
// i want removed, upload a new photo interchange them swap the timing". He chose to edit
// right on the home page rather than in the console.
//
//   DARK MODE  seven taps on the moon in the night sky, within four seconds. The sky canvas
//              is pointer-events none, so taps are heard on the document and tested against
//              the circle the sky last PAINTED (NightSky's skyMoonRect). A tap anywhere else
//              starts the count again.
//   LIGHT MODE there is no moon by day. Seven quick taps on the theme switch's sphere: the
//              first one flips to night as it always does (and the moon rises), taps two to
//              seven are swallowed so the theme does not flip back and forth, and the seventh
//              opens the editor. A streak only STARTS by day, so the switch behaves exactly
//              as before at night, and a tap more than 0.7 s after the last one is a plain
//              toggle again.
//
// ☠️ NO HINT, AND NOTHING NEW FOR A VISITOR. This component renders null, adds two listeners
// and nothing else. The editor (sign-in sheet, strips, upload, styles) is a separate chunk
// fetched by the import() below only when the seventh tap lands, so a visitor's network log
// and the page's markup are what they were before it existed.

import { useEffect, useState } from 'react';
import { skyMoonRect } from '@/cinema/NightSky';

const TAPS = 7;
const WINDOW_MS = 4000;
const SWITCH_GAP_MS = 700;

/** True when the tap is on the moon's painted disc, with a finger's worth of slack. */
function onMoon(x, y) {
  const m = skyMoonRect();
  if (!m) return false;
  const reach = Math.max(m.r * 1.4, 26);
  const dx = x - m.x;
  const dy = y - m.y;
  return dx * dx + dy * dy <= reach * reach;
}

/** True when a click on the theme switch landed on its sphere (the knob), not its label. */
function onSwitchSphere(sw, e) {
  const knob = sw.querySelector('.cinema-switch-knob');
  if (!knob) return false;
  const r = knob.getBoundingClientRect();
  const pad = 6;
  return e.clientX >= r.left - pad && e.clientX <= r.right + pad && e.clientY >= r.top - pad && e.clientY <= r.bottom + pad;
}

export default function MoonGate() {
  const [Editor, setEditor] = useState(null);

  useEffect(() => {
    let moonTaps = [];
    let streak = { n: 0, first: 0, last: 0 };
    let opening = false;

    const open = () => {
      if (opening) return;
      opening = true;
      import('./Editor')
        .then((m) => setEditor(() => m.default))
        .catch(() => { /* offline: the moon simply does nothing */ })
        .finally(() => { opening = false; });
    };

    const onPointer = (e) => {
      if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
      if (!onMoon(e.clientX, e.clientY)) { moonTaps = []; return; }
      const now = performance.now();
      moonTaps = moonTaps.filter((t) => now - t < WINDOW_MS);
      moonTaps.push(now);
      if (moonTaps.length >= TAPS) { moonTaps = []; open(); }
    };

    const onClick = (e) => {
      const sw = e.target && e.target.closest ? e.target.closest('#theme-switch') : null;
      if (!sw) { streak.n = 0; return; }
      // a keyboard press on the switch (detail 0) is never part of a streak
      if (e.detail === 0) return;
      const now = performance.now();
      const going = streak.n > 0 && now - streak.last < SWITCH_GAP_MS && now - streak.first < WINDOW_MS;
      if (going) {
        // taps two to seven: swallowed before React sees them, so the theme stays put. Any
        // tap on the switch counts here, because tap one slid the sphere to the night side.
        e.preventDefault();
        e.stopImmediatePropagation();
        streak.n += 1;
        streak.last = now;
        if (streak.n >= TAPS) { streak = { n: 0, first: 0, last: 0 }; open(); }
        return;
      }
      // tap one toggles as always; a streak only starts by day (no moon) and on the sphere
      const day = document.documentElement.getAttribute('data-theme') === 'light';
      streak = day && onSwitchSphere(sw, e) ? { n: 1, first: now, last: now } : { n: 0, first: 0, last: 0 };
    };

    document.addEventListener('pointerdown', onPointer, true);
    window.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('pointerdown', onPointer, true);
      window.removeEventListener('click', onClick, true);
    };
  }, []);

  return Editor ? <Editor onClose={() => setEditor(null)} /> : null;
}
