// ── THE WALL ────────────────────────────────────────────────────────────────
// A verbatim port of the FFC room's spectrum canvas (fork-thanks-cinema.ts):
// log-spaced bars across the band that actually carries signal, a gamma curve,
// a rolling AGC ceiling with fast attack and slow release, the red to violet
// hue law, white peak caps, the mirrored reflection under the gold baseline,
// the tall hue-matched rays standing on the HELD peaks, one ambient wash tinted
// by the spectral centroid, and the edge dissolve that keeps the instrument
// from reading as a box.
//
// The hue law is the MUSIC's, not the brand's: it is the same red to violet
// sweep the band strips and the breathing orb use, so no palette ruling ever
// touches it. The only brand ink on this canvas is the baseline hairline, and
// that one is FFC gold, rgba(184,147,46,.34), exactly as the source has it.

export const BARS = 96;
export const MIN_HZ = 24;
export const MAX_HZ = 18000;
export const CEIL = 0.7;
export const AGC_T = 0.92;
export const AGC_F = 0.22;

/** The eight bands a mixing desk actually splits on, each carrying its hue
 *  from the SAME red to violet law as the wall above it. The zero-width spaces
 *  in the long names are deliberate: they let PRESENCE and BRILLIANCE wrap
 *  inside a 41px column on a 390px phone instead of colliding. */
export const BANDS = [
  ['SUB', '20–60', 20, 60],
  ['BASS', '60–160', 60, 160],
  ['LOW-MID', '160–500', 160, 500],
  ['MID', '0.5–1k', 500, 1000],
  ['UPPER', '1–2.5k', 1000, 2500],
  ['PRES​ENCE', '2.5–5k', 2500, 5000],
  ['BRILLI​ANCE', '5–10k', 5000, 10000],
  ['AIR', '10–18k', 10000, 18000],
];

/** The hue a band strip wears, so the JSX and the drawing agree. */
export function bandHue(i) {
  return (i / BANDS.length) * 290;
}

/**
 * One frame of the wall.
 *
 * @param {CanvasRenderingContext2D} c2
 * @param {HTMLCanvasElement} cv
 * @param {object} s
 *   lit        — is there real, moving, un-muted sound to draw
 *   reduce     — prefers-reduced-motion
 *   peaks      — Float/Array(BARS), MUTATED in place (the held peaks)
 *   agc        — the rolling ceiling
 *   bins       — Uint8Array of the analyser's frequency data, or null
 *   sampleRate — the live context's rate, or 44100
 *   energy     — (lo, hi) => 0..1 peak magnitude in that Hz window
 *   level      — () => 0..1 flat loudness this frame
 *   centroid   — () => Hz, the centre of mass of the sound right now
 * @returns {number} the next agc value
 */
export function drawSpectrum(c2, cv, s) {
  const { lit, reduce, peaks, bins, sampleRate, energy, level, centroid } = s;
  let agc = s.agc;

  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = cv.clientWidth;
  const h = cv.clientHeight;
  if (cv.width !== ((w * dpr) | 0)) {
    cv.width = (w * dpr) | 0;
    cv.height = (h * dpr) | 0;
  }
  c2.setTransform(dpr, 0, 0, dpr, 0, 0);
  c2.clearRect(0, 0, w, h);

  // THE HEADROOM TERM. The canvas is taller than the box it sits in; the extra
  // height is pure sky ABOVE the instrument, for the shafts to climb into.
  // Everything that positions the instrument is measured from the BOX, so the
  // baseline, the bar ceiling and the reflection are pixel-for-pixel what they
  // were before the canvas grew. Derived from the wrapper, so the CSS stays the
  // single source.
  const head = Math.max(0, h - (cv.parentNode ? cv.parentNode.clientHeight : h));
  const ih = h - head;
  const baseline = head + ih * 0.86;
  const maxBar = (baseline - head - 6) * CEIL;
  const mirrorMax = h - baseline - 2;
  const nyq = sampleRate / 2;
  const per = bins ? nyq / bins.length : 21.5;
  const norm = AGC_T / Math.max(AGC_F, agc);
  let frameMax = 0;
  const bass = lit ? energy(30, 140) : 0.22;
  const bw = w / BARS;
  const gap = Math.min(2, bw * 0.28);

  const f = (t) => MIN_HZ * Math.pow(MAX_HZ / MIN_HZ, t);

  for (let i = 0; i < BARS; i++) {
    let v = 0;
    if (lit && bins) {
      const lo = Math.max(0, Math.floor(f(i / BARS) / per));
      const hi = Math.max(lo + 1, Math.floor(f((i + 1) / BARS) / per));
      for (let k = lo; k < hi && k < bins.length; k++) if (bins[k] > v) v = bins[k];
      v /= 255;
      v = Math.pow(v, 0.72);
      // THE TILT — music puts its energy in the low mids, so an untilted
      // display draws a mountain on the left and a plain on the right.
      v *= 1 + (i / BARS) * 1.15;
      if (v > frameMax) frameMax = v;
      v = Math.min(1, v * norm);
    } else {
      // Reduced motion (or silence): a pleasant, still skyline.
      v = 0.16 + 0.34 * Math.pow(Math.sin((i / BARS) * Math.PI), 1.4);
    }

    peaks[i] = v > peaks[i] ? v : Math.max(0, peaks[i] - (reduce ? 0 : 0.012));
    const hue = ((i / BARS) * 290 + bass * 10) % 360;
    const light = 46 + v * 26;
    const bleed = v * 22;
    const x = i * bw;
    const bwid = Math.max(1, bw - gap);
    const top = baseline - v * maxBar;

    const g = c2.createLinearGradient(0, top, 0, baseline);
    g.addColorStop(0, 'hsla(' + (hue + bleed) + ',100%,' + Math.min(92, light + 30) + '%,1)');
    g.addColorStop(0.35, 'hsla(' + (hue + bleed * 0.5) + ',98%,' + (light + 12) + '%,.98)');
    g.addColorStop(1, 'hsla(' + (hue - 12) + ',88%,' + Math.max(24, light - 18) + '%,.9)');
    c2.shadowBlur = 6 + bass * 26;
    c2.shadowColor = 'hsla(' + hue + ',100%,' + (62 + v * 20) + '%,' + (0.3 + bass * 0.4) + ')';
    c2.fillStyle = g;
    c2.fillRect(x, top, bwid, baseline - top);
    c2.shadowBlur = 0;

    // the reflection — scaled to ITS OWN ceiling, so the ratio is exact
    const mh = v * mirrorMax;
    if (mh > 0.5) {
      const mg = c2.createLinearGradient(0, baseline, 0, baseline + mh);
      mg.addColorStop(0, 'hsla(' + (hue + bleed) + ',96%,' + (light + 8) + '%,' + (0.3 + bass * 0.26) + ')');
      mg.addColorStop(1, 'hsla(' + (hue + bleed) + ',96%,' + light + '%,0)');
      c2.fillStyle = mg;
      c2.fillRect(x, baseline, bwid, mh);
    }

    // the cap — a transient stays visible after the bar has fallen back
    const cy = baseline - peaks[i] * maxBar;
    c2.fillStyle = 'hsla(' + (hue + bleed) + ',100%,88%,.92)';
    c2.fillRect(x + bw * 0.16, cy - 1.5, bw * 0.68, 1.5);
  }

  // THE RAYS — the tall hue-matched shafts standing above every peak. They ride
  // the HELD peak, not the live value, which is why a shaft lingers and towers
  // after the bar under it has already dropped. Drawn additive and much WIDER
  // than the bar, so where bars crowd the light POOLS instead of stacking into a
  // stripe. Alpha stays deliberately low: the room's text sits on this wall.
  c2.globalCompositeOperation = 'lighter';
  for (let r2 = 0; r2 < BARS; r2++) {
    const pv = peaks[r2];
    if (pv < 0.06) continue;
    const rhue = ((r2 / BARS) * 290 + bass * 10) % 360;
    const rtop = baseline - pv * maxBar;
    const reach = Math.min(rtop, pv * maxBar * 2.4);
    if (reach <= 0) continue;
    const ray = c2.createLinearGradient(0, rtop, 0, rtop - reach);
    ray.addColorStop(0, 'hsla(' + (rhue + 46 * pv) + ',100%,66%,' + (0.05 + pv * 0.09) + ')');
    ray.addColorStop(1, 'hsla(' + (rhue + 60) + ',100%,70%,0)');
    c2.fillStyle = ray;
    c2.fillRect(r2 * bw - bw * 0.7, rtop - reach, bw * 2.4, reach);
  }

  // …and one ambient wash for the room itself, tinted by where the energy
  // actually IS this frame (the spectral centroid), never by a flat average.
  const cHue = lit
    ? ((Math.log(Math.max(24, centroid()) / 24) / Math.log(MAX_HZ / 24)) * 290) % 360
    : 200;
  const wash = c2.createRadialGradient(w / 2, baseline, 0, w / 2, baseline, Math.max(w, h) * 0.9);
  wash.addColorStop(0, 'hsla(' + cHue + ',100%,60%,' + (0.03 + level() * 0.09) + ')');
  wash.addColorStop(1, 'hsla(' + cHue + ',100%,50%,0)');
  c2.fillStyle = wash;
  c2.fillRect(0, 0, w, h);
  c2.globalCompositeOperation = 'source-over';

  // the gold baseline the whole instrument stands on
  c2.fillStyle = 'rgba(184,147,46,.34)';
  c2.fillRect(0, baseline, w, 1);

  // UNBOX IT. Nothing here is framed in CSS; what reads as a box is the canvas
  // RECT itself, because the wash tints out to all four edges and a tinted
  // rectangle on a black page has visible sides. So the edges are erased back to
  // transparency and the instrument dissolves into the stage.
  const fadeH = head > 0 ? head * 0.62 : h * 0.26;
  c2.globalCompositeOperation = 'destination-out';
  const fadeT = c2.createLinearGradient(0, 0, 0, fadeH);
  fadeT.addColorStop(0, 'rgba(0,0,0,1)');
  fadeT.addColorStop(1, 'rgba(0,0,0,0)');
  c2.fillStyle = fadeT;
  c2.fillRect(0, 0, w, fadeH);
  const fadeL = c2.createLinearGradient(0, 0, w * 0.06, 0);
  fadeL.addColorStop(0, 'rgba(0,0,0,1)');
  fadeL.addColorStop(1, 'rgba(0,0,0,0)');
  c2.fillStyle = fadeL;
  c2.fillRect(0, 0, w * 0.06, h);
  const fadeR = c2.createLinearGradient(w, 0, w - w * 0.06, 0);
  fadeR.addColorStop(0, 'rgba(0,0,0,1)');
  fadeR.addColorStop(1, 'rgba(0,0,0,0)');
  c2.fillStyle = fadeR;
  c2.fillRect(w - w * 0.06, 0, w * 0.06, h);
  const fadeB = c2.createLinearGradient(0, h, 0, h - h * 0.05);
  fadeB.addColorStop(0, 'rgba(0,0,0,1)');
  fadeB.addColorStop(1, 'rgba(0,0,0,0)');
  c2.fillStyle = fadeB;
  c2.fillRect(0, h - h * 0.05, w, h * 0.05);
  c2.globalCompositeOperation = 'source-over';

  // fast attack, slow release — a hit can never clip, a quiet passage
  // re-expands within a few seconds instead of pumping between beats
  agc = frameMax > agc ? frameMax : agc * 0.9965;
  return agc;
}

/** The eight band strips, driven every frame by the same analyser. */
export function paintBands(els, lit, energy) {
  for (let i = 0; i < els.length; i++) {
    const el = els[i];
    if (!el) continue;
    const v = lit ? energy(BANDS[i][2], BANDS[i][3]) : 0.24 + (i % 3) * 0.08;
    const hue = bandHue(i);
    el.style.height = Math.min(100, v * 118) + '%';
    el.parentNode.style.boxShadow =
      v > 0.04
        ? '0 0 ' + (6 + v * 16) + 'px hsla(' + hue + ',100%,60%,' + (0.18 + v * 0.45) + ')'
        : 'none';
  }
}
