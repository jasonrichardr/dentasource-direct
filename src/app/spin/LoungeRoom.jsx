'use client';

// 🎧 THE ROOM on /spin: the FFC growth-partner mp3 player + breath room, 1:1 (public/lounge/*).
// Markup is the FFC block with DSD's mark; sky.js paints the stars once <html data-theme="dark">.
import { useEffect } from 'react';

const MARKUP = '\n    <div id="tx-dock" class="idle" role="button" tabindex="0" aria-label="Play the music and open the room">\n      <span class="tx-eq" aria-hidden="true"><i></i><i></i><i></i></span>\n      <span class="tx-note" aria-hidden="true">♪</span>\n      <span class="tx-dt">Thank you.</span>\n      <span class="tx-hint" aria-hidden="true">TAP TO PLAY</span>\n      <span class="tx-dp" aria-hidden="true">❙❙</span>\n    </div>\n\n    <!-- ☠️ the ✕ and 🌗 live OUTSIDE the room ON PURPOSE: a backdrop-filter\n         ancestor demotes fixed children to absolute on mobile Chromium, and\n         they scrolled away with the content. Out here they are truly fixed —\n         ✕ at the thumb (lower-LEFT, the room\'s original law), 🌗 lower-right.\n         .tx-open (documentElement) is what shows them with the room. -->\n    <button id="tx-x" type="button" aria-label="Close this room. The music keeps playing.">✕</button>\n    <button id="tx-theme" type="button" aria-label="Switch between light and dark mode">☾</button>\n\n    <div id="tx-room" role="dialog" aria-modal="true" aria-label="Thank you" aria-hidden="true">\n      <div class="tx-in">\n        <h2 class="tx-h">Thank you.</h2>\n        <p class="tx-sub">A little music while you look around. It keeps playing when you leave this room.</p>\n        <div id="tx-logo" aria-hidden="true"><img src="/images/brand/dsd-mark.png" alt="" width="74" height="74" decoding="async"></div>\n        <div class="tx-specwrap"><canvas id="tx-spec" aria-hidden="true"></canvas></div>\n        <div id="tx-bands" aria-hidden="true"></div>\n        <div id="tx-ch">\n          <div class="tx-chh">\n            <button id="tx-play" type="button" aria-label="Pause the music">❙❙</button>\n            <span id="tx-chn">0:00 / 0:00</span>\n            <span id="tx-cht">—</span>\n          </div>\n          <div id="tx-chb" role="slider" tabindex="0" aria-label="Chapters — seek within the music"\n               aria-valuemin="0" aria-valuemax="3896" aria-valuenow="0" aria-valuetext="Start">\n            <div class="tx-cwrap" id="tx-cwrap"></div>\n          </div>\n        </div>\n        <div class="tx-chip"><span class="tx-chip-master">🎧&nbsp; High-Res Master &nbsp;·&nbsp;</span><span class="tx-chip-phone">🎧&nbsp; Phone mix &nbsp;·&nbsp;</span> Best with headphones</div>\n        <details class="tx-au">\n          <summary>🔬 FOR AUDIOPHILES ▾</summary>\n          <div id="tx-stats"></div>\n          <p>The bars are spaced logarithmically, because your ears are. The faint glow underneath is a reflection, not a bug — consider the floor freshly polished.</p>\n          <p>The white dashes are peak caps. They fall slower than the music so you can see what just happened.</p>\n        </details>\n        <div class="tx-brh">\n          <canvas id="tx-orb" role="button" tabindex="0" aria-label="Change the breathing pattern"></canvas>\n          <p id="tx-ph" aria-live="polite">Breathe in</p>\n          <p id="tx-cd" aria-hidden="true"></p>\n          <p id="tx-cap"><b>Coherent</b> · tap to change</p>\n          <button id="tx-min" type="button" aria-label="Breathe with the orb for one quiet minute">◷&nbsp; one quiet minute</button>\n          <div id="tx-after" hidden role="button" tabindex="0" aria-label="Close this note and keep breathing"></div>\n          <div id="tx-th" aria-live="off"><span></span><span></span></div>\n        </div>\n      </div>\n\n      <!-- The pattern picker. Nothing permanent eats the stage: the orb is the\n           whole control, and this only exists while it is being asked for. -->\n      <div id="tx-scrim" hidden></div>\n      <div id="tx-sheet" role="dialog" aria-modal="true" aria-label="Breathing patterns" hidden>\n        <div class="tx-sh-top">\n          <span class="tx-sh-t">Meditate</span>\n          <button id="tx-sh-x" type="button" aria-label="Close without changing the pattern">✕</button>\n        </div>\n        <div id="tx-sh-list" role="listbox" aria-label="Breathing patterns"></div>\n      </div>\n    </div>\n\n';

export default function LoungeRoom() {
  // ☠️ Round 6 (2026-09-17): the room's DOM lives OUTSIDE React, appended to <body> once. A React re-render or
  // remount (Next.js re-renders the page on every popstate, including the sheets' own history entries) used to
  // recreate the markup from dangerouslySetInnerHTML and leave room.js's listeners on dead nodes: the dock looked
  // fine but nothing happened on tap. Now the nodes are created once and never touched by React again.
  useEffect(() => {
    if (typeof window === 'undefined' || window.__dsdLounge) return;
    window.__dsdLounge = true;
    const html = document.documentElement;
    if (!html.getAttribute('data-theme')) {
      let saved = null;
      try { saved = localStorage.getItem('dsd:lounge-theme'); } catch { /* ignore */ }
      html.setAttribute('data-theme', saved === 'light' ? 'light' : 'dark');
    }
    if (!document.getElementById('dsd-lounge')) {
      const host = document.createElement('div');
      host.id = 'dsd-lounge';
      host.innerHTML = MARKUP;
      document.body.appendChild(host);
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = '/lounge/room.css';
    document.head.appendChild(link);
    const load = (src) => new Promise((res) => { const s = document.createElement('script'); s.src = src; s.async = false; s.onload = res; s.onerror = res; document.body.appendChild(s); });
    load('/lounge/sky.js').then(() => load('/lounge/room.js'));
  }, []);

  // ☠️ THE DOCK MUST NEVER SIT ON THE CONVERSION PATH. It is position:fixed in the
  // lower-right at z-index 10000, so whatever it covers is both unreadable AND
  // untappable: a tap on the covered pixels starts the music instead of doing what
  // the visitor meant. Two yields, both driven from here and both expressed in
  // spin.css with a class-qualified selector, because /lounge/room.css is injected
  // into <head> at RUNTIME and so beats spin.css on source order at equal weight.
  //   html.input-focus  → a form field holds the keyboard, the dock fades out
  //   --spin-dock-dodge → the gift tiles are under the dock, lift just past them
  //   html.dock-yield   → the lift needed is so large the dock would wander into
  //                       the podium, so it steps aside entirely for that stretch
  useEffect(() => {
    const html = document.documentElement;
    const FORMS = '.gate-form, .pre-form, .phone-row';
    const isField = (el) => !!(el && el.tagName && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) && el.closest && el.closest(FORMS));

    const onFocusIn = (e) => { if (isField(e.target)) html.classList.add('input-focus'); };
    // focusout lands before the next focusin, so settle on the next frame or
    // tabbing between two fields would flash the dock back in between them.
    const onFocusOut = () => { requestAnimationFrame(() => { if (!isField(document.activeElement)) html.classList.remove('input-focus'); }); };

    // Left is geometrically impossible: the gift tiles span 39px to 351px of a
    // 390px viewport and the dock is at least 145px wide against the right edge,
    // so no horizontal offset clears them. Up is the only axis. 200px covers the
    // deepest crossing of this layout (measured max lift 180px), so the dock
    // always nudges here; the fade is the guard for a viewport too short for that.
    const MAX_DODGE = 200;
    let frame = 0;
    let safeBottom = 0, safeRight = 0;
    const readSafe = () => {
      try {
        const probe = document.createElement('div');
        probe.style.cssText = 'position:fixed;left:0;top:0;opacity:0;pointer-events:none;width:env(safe-area-inset-right,0px);height:env(safe-area-inset-bottom,0px)';
        document.body.appendChild(probe);
        safeRight = probe.offsetWidth; safeBottom = probe.offsetHeight;
        probe.remove();
      } catch { safeBottom = 0; safeRight = 0; }
    };
    const setVar = (v) => { if (html.style.getPropertyValue('--spin-dock-dodge') !== v) html.style.setProperty('--spin-dock-dodge', v); };
    const setYield = (on) => { if (html.classList.contains('dock-yield') !== on) html.classList.toggle('dock-yield', on); };

    const hits = (b, r) => r && r.width > 0 && r.height > 0 && b.right > r.left && r.right > b.left && b.bottom > r.top && r.bottom > b.top;

    const measure = () => {
      frame = 0;
      const dock = document.getElementById('tx-dock');
      if (!dock) { setVar('0px'); setYield(false); return; }
      // ☠️ THE DOCK'S BOX IS COMPUTED, NOT MEASURED. getBoundingClientRect reports
      // the INTERPOLATED position while `bottom` is animating, and feeding that
      // back into the lift makes the dodge chase its own tail: measured live, it
      // oscillated 90px → 50px → 0px across three scroll steps and let the tiles
      // through twice. offsetWidth/offsetHeight are layout values, untouched by a
      // `bottom` transition, so the resting box is derived from them instead.
      const barH = html.classList.contains('has-spin-bar') ? (parseFloat(html.style.getPropertyValue('--spin-bar-h')) || 0) : 0;
      const rest = 14 + safeBottom + barH;
      const w = dock.offsetWidth, h = dock.offsetHeight;
      const right = window.innerWidth - 14 - safeRight;
      const boxAt = (lift) => ({ right, left: right - w, bottom: window.innerHeight - rest - lift, top: window.innerHeight - rest - lift - h });

      // Pass 1: the gift tiles. Lift just past them, as far as MAX_DODGE allows.
      let lift = 0;
      const gifts = document.querySelector('.gifts');
      const g = gifts && gifts.getBoundingClientRect();
      if (hits(boxAt(0), g)) {
        const needed = Math.ceil(boxAt(0).bottom - g.top) + 8;
        if (needed > MAX_DODGE) { setVar('0px'); setYield(true); return; }
        lift = needed;
      }

      // Pass 2: form fields, checked against the box the dodge actually leaves.
      // ☠️ A FIELD UNDER THE DOCK CANNOT BE TAPPED AT ALL. The dock is z-index
      // 10000 with pointer-events:auto, so it takes the tap and starts the music.
      // The focus rule above cannot save this one, because you have to tap the
      // field to focus it: measured on the open-phase fold, 12 of 50 sample points
      // across the Mobile number input landed on the dock instead. Nudging is no
      // use either, since clearing the field here would push the dock back onto
      // the tiles, so the dock steps aside entirely while a field is under it.
      for (const f of document.querySelectorAll('.gate-form input, .pre-form input, .phone-row input')) {
        if (f.type === 'hidden') continue;
        if (hits(boxAt(lift), f.getBoundingClientRect())) { setVar('0px'); setYield(true); return; }
      }

      setYield(false);
      setVar(`${lift}px`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    readSafe();

    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    window.addEventListener('scroll', schedule, { passive: true });
    const onResize = () => { readSafe(); schedule(); };
    window.addEventListener('resize', onResize);
    // The sticky bar changes the dock's resting height by toggling a class on
    // <html>; watch for that rather than guessing when React has committed.
    const mo = new MutationObserver(schedule);
    mo.observe(html, { attributes: true, attributeFilter: ['class', 'style'] });
    schedule();

    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      mo.disconnect();
      if (frame) cancelAnimationFrame(frame);
      html.classList.remove('input-focus', 'dock-yield');
      html.style.removeProperty('--spin-dock-dodge');
    };
  }, []);

  return null;
}
