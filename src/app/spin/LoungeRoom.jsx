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
  return null;
}
