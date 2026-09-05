'use client';

// lib/cinema/marquee.js — one place that decides how fast every marquee on this site moves.
//
// Jarich: "the marquees are too fast please have the same speed as ffcdentalclinic.com for
// all." The numbers below were MEASURED on the live FFC site, not copied from its source
// and not guessed, on 2026-09-06.
//
// ☠️ A DURATION IS NOT A SPEED, AND THAT IS THE WHOLE BUG.
// Every track here is a doubled strip animated to translateX(-50%), so one loop travels
// HALF the track's width. Our CSS gave each family a fixed duration (39s for the strips,
// 52s for the news rows, 40s for the trust line), which means the speed fell out of
// whatever happened to be in the track. Measured on the production build, that produced a
// twelve fold spread across one page:
//
//   training mixed marquee   198 tiles   37,951px / 39s  ->  488 px/s
//   see-us-in-action          60 tiles   20,976px / 39s  ->  270 px/s
//   installs strip            58 tiles   17,284px / 39s  ->  222 px/s
//   news and parts rows    24-36 tiles  4,886-7,670/52s  ->   47-74 px/s
//   trust line                22 items    5,060px / 40s  ->   63 px/s
//
// The training beat was not "a bit fast", it was nearly four times FFC on a desktop and
// over five times on a phone, and it got that way simply by gaining tiles. Any fix written
// as a new duration would drift the same way the moment somebody appends to a manifest.
// So the constant is a SPEED and each track's duration is derived from its own width:
//
//   duration = (scrollWidth / 2) / pxPerSecond
//
// ---- what FFC actually does, measured -------------------------------------------------
// FFC runs two marquee families and they move at different speeds, so "the same speed as
// ffcdentalclinic.com" is two numbers, not one:
//
//   .sm-track  (siena-marquee: images and video)   131.8 px/s at 1440   88.6 px/s at 390
//   .kb-track  (kb-marquee: a line of text)         75.7 px/s at 1440   58.1 px/s at 390
//
// Both were confirmed three ways: the keyframes read straight out of the live stylesheets
// are translateX(-50%) for both, the same as ours; (scrollWidth/2)/duration is identical
// across all seven sm-tracks despite their widths ranging from 10,697 to 232,819px; and a
// real tile was timed across the screen. The sm-tracks are animation-play-state:paused
// until their panel is live, exactly like ours, so one had to be unpaused to time it.
//
// We map like for like: our media strips take the media speed, our one line of running
// text takes the text speed. A text ticker and a wall of photographs are different reading
// tasks and FFC treats them differently; matching a photo strip's speed on a line of words
// would be matching the wrong thing.
//
// ☠️ FFC'S OWN SPEED IS NOT VIEWPORT INDEPENDENT, AND THAT IS WHY THERE ARE TWO NUMBERS
// PER FAMILY. Its durations are fixed per track while its track WIDTH shrinks on a phone,
// so the same element measured 883.5s at both viewports and therefore ran slower on the
// phone as a side effect rather than by design. We reproduce the observed speeds at the
// two widths the brief named and step between them at our existing phone breakpoint.

/** Measured on https://ffcdentalclinic.com, 2026-09-06. See the note above. */
export const FFC_MARQUEE_PX_PER_S = {
  media: { wide: 131.8, narrow: 88.6 },
  text: { wide: 75.7, narrow: 58.1 },
};

/** Matches the phone breakpoint the cinema stylesheets already use. */
export const NARROW_MAX_PX = 700;

/** The speed a marquee of this kind should run at, for the viewport we are on now. */
export function marqueePxPerSecond(kind = 'media') {
  const band = FFC_MARQUEE_PX_PER_S[kind] || FFC_MARQUEE_PX_PER_S.media;
  let narrow = false;
  try { narrow = window.matchMedia(`(max-width: ${NARROW_MAX_PX}px)`).matches; } catch (e) { /* SSR */ }
  return narrow ? band.narrow : band.wide;
}

/**
 * Give one track the duration that makes it run at the right speed.
 *
 * Writes animation-duration inline, which is deliberate: it has to beat the stylesheet's
 * own duration. It does NOT resurrect a stopped marquee, because the rules that stop one
 * (`animation: none` under reduced motion, `animation-play-state: paused` off-beat) work
 * on the name and the play state, not the duration.
 */
// ☠️ THIS MODULE ASSUMES A DOUBLED TRACK ANIMATED TO translateX(-50%), which is what all
// three of our selectors resolve to: dsd-strip-scroll, dsd-trust-sweep and the news rows
// are every one of them `to { transform: translateX(-50%) }`, verified in the stylesheets.
// It is NOT a safe assumption site wide. The Denjoy footer ticker
// (components/denjoy/v2/v2.module.css, .marqueeTrack) uses TWO tracks each going to
// translateX(-100%), so one loop travels the FULL width; handing it to this function would
// run it at half the intended speed. It is a CSS module class, so no selector here reaches
// it, and it is left alone deliberately. Anything new that wants this speed must either be
// a -50% doubled track or teach this function about its own travel distance first.
export function applyMarqueeSpeed(el, kind = 'media') {
  if (!el) return;
  const half = el.scrollWidth / 2;
  if (!half) return;                       // an empty track has no speed to set yet
  const seconds = half / marqueePxPerSecond(kind);
  if (!Number.isFinite(seconds) || seconds <= 0) return;
  el.style.animationDuration = `${seconds.toFixed(2)}s`;
}

/**
 * Keep every track inside `root` at the right speed.
 *
 * ☠️ IT HAS TO RE-APPLY, NOT JUST APPLY ONCE. Our tracks render EMPTY and fill when their
 * beat comes near, so measuring at mount would measure nothing and set nothing. A
 * ResizeObserver on each track is the signal that covers both that and a window resize,
 * because a `width: max-content` track changes size when its tiles arrive and when the
 * viewport changes under them.
 */
export function observeMarquees(root, kind = 'media', selector = '.dsd-strip-track, .dsd-news-track, .dsd-trust-track') {
  if (!root || typeof ResizeObserver === 'undefined') return () => {};
  // ☠️ COALESCED TO ONE PASS PER FRAME. The root is the whole document and the cinema
  // mutates constantly: panels swap, tiles mount, a strip fills thirty images in a burst.
  // Running a querySelectorAll and a scrollWidth read per mutation would be a layout
  // thrash during exactly the moments the page is busiest, so every signal just marks the
  // work as due and one pass runs on the next frame.
  let queued = false;
  const run = () => {
    queued = false;
    for (const el of root.querySelectorAll(selector)) applyMarqueeSpeed(el, kind);
  };
  const apply = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(run);
  };
  const ro = new ResizeObserver(apply);
  const attach = () => { for (const el of root.querySelectorAll(selector)) ro.observe(el); };
  attach();
  apply();
  // A row that mounts later (the parts beat's crew row only renders when it has shots)
  // still needs observing, so watch for tracks appearing under the root.
  const mo = new MutationObserver(() => { attach(); apply(); });
  mo.observe(root, { childList: true, subtree: true });
  let mq = null;
  try {
    mq = window.matchMedia(`(max-width: ${NARROW_MAX_PX}px)`);
    mq.addEventListener('change', apply);
  } catch (e) { /* no matchMedia */ }
  return () => {
    queued = true;            // stop a queued frame from touching a torn down tree
    ro.disconnect();
    mo.disconnect();
    if (mq) mq.removeEventListener('change', apply);
  };
}
