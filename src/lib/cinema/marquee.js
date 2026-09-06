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

// ---- the live settings contract, mirroring the lockup dials -------------------------
//
//   defaults  src/data/cinema/settings.json  (the shipped, measured values)
//   storage   localStorage['dsd:settings'] = JSON of a PARTIAL settings object
//   event     window 'dsd:settings', detail = { settings, source }
//
// Jarich: "make me able set the speed in localhost let me see marquee there so i can see
// and sense the speed". A speed is not a number you can pick on paper, you pick it by
// watching it, so the studio has to be able to re-time every track under his eye with no
// reload. A partial is always merged over the defaults, so a stored set written by an
// older studio can never break when a new family or override is added.

import SETTINGS from '@/data/cinema/settings.json';

export const SETTINGS_STORAGE_KEY = 'dsd:settings';
export const SETTINGS_EVENT = 'dsd:settings';

/**
 * The shipped defaults, which ARE the FFC measurements: settings.json carries them and
 * this is that object.
 *
 * ☠️ BOTH NAMES ARE EXPORTED ON PURPOSE. The studio (src/app/studio/MarqueeSpeed.jsx)
 * imports FFC_MARQUEE_PX_PER_S in eight places, and renaming it out from under a sibling
 * in a shared tree broke their build, not mine. The name is also the more precise of the
 * two, since these numbers are exactly what was measured on FFC. MARQUEE_DEFAULTS is the
 * alias for code that cares that they are the DEFAULTS rather than where they came from.
 */
export const FFC_MARQUEE_PX_PER_S = SETTINGS.marquee;
export const MARQUEE_DEFAULTS = SETTINGS.marquee;

/** Matches the phone breakpoint the cinema stylesheets already use. */
export const NARROW_MAX_PX = 700;

const clone = (o) => JSON.parse(JSON.stringify(o));

/** A partial merged over the defaults, two levels deep, which is all this shape needs. */
function mergeMarquee(partial) {
  const out = clone(MARQUEE_DEFAULTS);
  const m = partial && partial.marquee;
  if (!m) return out;
  for (const family of ['media', 'text']) {
    if (m[family]) {
      for (const band of ['wide', 'narrow']) {
        const v = Number(m[family][band]);
        // ☠️ A SPEED OF ZERO IS A STOPPED MARQUEE AND AN INFINITE DURATION. The studio is
        // a slider, so it WILL pass through small numbers on the way somewhere; anything
        // not finite and positive is ignored rather than divided by.
        if (Number.isFinite(v) && v > 0) out[family][band] = v;
      }
    }
  }
  if (m.overrides && typeof m.overrides === 'object') {
    out.overrides = { ...out.overrides };
    for (const [id, band] of Object.entries(m.overrides)) {
      if (band && typeof band === 'object') out.overrides[id] = { ...band };
    }
  }
  return out;
}

function readStored() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || 'null'); } catch (e) { return null; }
}

let live = mergeMarquee(readStored());

/** What the page is running right now: defaults, with any stored or live partial over it. */
export function marqueeSettings() { return live; }

/**
 * Apply a partial. The studio calls this, or dispatches the event; either works, and both
 * end up here so there is one path.
 */
export function setMarqueeSettings(partial) {
  live = mergeMarquee(partial);
  return live;
}

const listeners = new Set();
/** Called whenever the live settings change, so observers can re-derive every duration. */
export function onSettingsChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
if (typeof window !== 'undefined') {
  window.addEventListener(SETTINGS_EVENT, (e) => {
    setMarqueeSettings((e.detail && e.detail.settings) || readStored());
    for (const fn of listeners) fn();
  });
  // A second tab or the studio writing storage directly still reaches the page.
  window.addEventListener('storage', (e) => {
    if (e.key !== SETTINGS_STORAGE_KEY) return;
    setMarqueeSettings(readStored());
    for (const fn of listeners) fn();
  });
}

/** The speed a marquee should run at now: a per-track override wins over its family. */
export function marqueePxPerSecond(kind = 'media', id = null) {
  let narrow = false;
  try { narrow = window.matchMedia(`(max-width: ${NARROW_MAX_PX}px)`).matches; } catch (e) { /* SSR */ }
  const band = narrow ? 'narrow' : 'wide';
  const override = id && live.overrides && live.overrides[id];
  const v = override && Number(override[band]);
  if (Number.isFinite(v) && v > 0) return v;
  const family = live[kind] || live.media;
  return family[band];
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
  const seconds = half / marqueePxPerSecond(kind, el.dataset ? el.dataset.marquee : null);
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
  // The studio moving a slider re-times every track on the next frame, no reload.
  const offSettings = onSettingsChange(apply);
  return () => {
    queued = true;            // stop a queued frame from touching a torn down tree
    ro.disconnect();
    mo.disconnect();
    offSettings();
    if (mq) mq.removeEventListener('change', apply);
  };
}
