// Glass feedback for the whole site: the haptic, the marbles' clink, and the buttons' tick.
// One AudioContext for the page, created inside a gesture (iOS will not start one otherwise).
// Every export is a no-op where the device cannot do it, and none of them ever throws.
//
// Ported from ffcdentalclinic.com (builds/ffc-signin-cinematic/src/ui/marbleCluster.js,
// 2026-10-03), whose haptic had itself been lifted from the DSD marble cluster on 10-02.

/**
 * One haptic tick, or nothing.
 * ☠️ IPHONE SAFARI HAS NO navigator.vibrate. iOS 18 fires the system haptic when an
 * <input type="checkbox" switch> toggles from a user gesture, and clicking its <label> from
 * inside a pointerup handler counts as that gesture. So: vibrate where it exists (Android
 * Chrome), the switch trick on a coarse pointer without it, nothing on a desktop. The label is
 * created, clicked and removed each time, display:none in <head>, so it never takes focus,
 * scrolls or shows. Its click is untrusted, so the music room (which waits for a real first
 * gesture) never mistakes it.
 * 18 ms, not 8: Jarich 2026-10-03 "add a haptic they can feel"; 8 ms is under what most
 * Android motors can spin up to.
 */
export function hapticTick(ms = 18) {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(ms);
      return;
    }
    if (!window.matchMedia || !window.matchMedia('(pointer: coarse)').matches) return;
    const label = document.createElement('label');
    label.setAttribute('aria-hidden', 'true');
    label.style.display = 'none';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('switch', '');
    input.tabIndex = -1;
    label.appendChild(input);
    document.head.appendChild(label);
    label.click();
    label.remove();
  } catch (e) { /* no haptics here, and that is fine */ }
}

/** The impact thud: a second, heavier pulse when a launched marble strikes (Android only;
 *  iPhone's only haptic is the switch trick, which needs the tap's own gesture). */
export function hapticThud() {
  try { if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') navigator.vibrate(26); } catch (e) { /* none */ }
}

let ctx = null;
function audio() {
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx.state === 'closed' ? null : ctx;
  } catch (e) { return null; }
}

/** A struck glass bar: three INHARMONIC sine partials (1 · 2.76 · 5.40), 4 ms attack, the high
 *  partials dying first. Synthesized, so nothing is downloaded. */
function strike(f, level, decayK) {
  const ac = audio();
  if (!ac) return;
  try {
    const now = ac.currentTime;
    const out = ac.createGain();
    out.gain.value = level;
    out.connect(ac.destination);
    for (const [ratio, amp, dec] of [[1, 1, 0.42], [2.76, 0.36, 0.17], [5.4, 0.15, 0.07]]) {
      const hz = f * ratio;
      if (hz > ac.sampleRate * 0.45) continue; // never alias a partial past Nyquist
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine';
      o.frequency.value = hz;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(amp, now + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dec * decayK);
      o.connect(g); g.connect(out);
      o.start(now); o.stop(now + dec * decayK + 0.05);
    }
  } catch (e) { /* a silent tap is fine */ }
}

// The marbles' clink. A quick run of taps climbs a major-pentatonic scale (every note sounds
// right after every other, so a run is always a melody); a pause over 1.4 s starts it again.
// The strike when a marble hits is a lower, softer knock.
const SCALE = [0, 2, 4, 7, 9, 12, 14, 16]; // C6 major pentatonic, up past the octave
let runIdx = 0, runLast = 0;
export function clink(kind = 'tap') {
  if (kind === 'tap') {
    const t = performance.now();
    runIdx = t - runLast > 1400 ? 0 : Math.min(runIdx + 1, SCALE.length - 1);
    runLast = t;
    strike(1046.5 * Math.pow(2, SCALE[runIdx] / 12), 0.16, 1);
  } else {
    strike(523.25 * Math.pow(2, SCALE[(runIdx + 2) % 5] / 12), 0.085, 0.55);
  }
}

/** The buttons' tick: the same glass, much quieter and shorter, one fixed note, so a page of
 *  taps never turns into a tune. */
export function tick() {
  strike(1567.98, 0.05, 0.35); // G6
}
