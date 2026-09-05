// ── THE ORB ─────────────────────────────────────────────────────────────────
// Drawn every frame by the wall's own loop, so the breath and the music are one
// instrument: the orb travels the SAME red to violet hue sweep the bars use,
// across one whole breath, and bass nudges it exactly like the bars.
// Ported verbatim from the FFC room; it reads the clock itself and reports the
// phase back so the caller can ink the words.

/** Smooth, lung-shaped easing. No corners at the turn of the breath. */
export function ease(t) {
  return t * t * (3 - 2 * t);
}

/**
 * @param {CanvasRenderingContext2D} c2
 * @param {HTMLCanvasElement} cv
 * @param {object} o
 *   mode     — one MODES entry [name, in, holdIn, out, holdOut, note, benefit]
 *   cycleT0  — performance.now() at the start of the current cycle
 *   now      — performance.now() for this frame
 *   reduce   — prefers-reduced-motion
 *   bassNow  — 0..1, the live 30–140 Hz energy (or 0.2 when silent)
 * @returns {{phase:number, left:number}} which phase, and seconds left in it
 */
export function drawOrb(c2, cv, o) {
  const { mode: m, cycleT0, now, reduce, bassNow } = o;
  const segs = [m[1], m[2], m[3], m[4]];
  const total = segs[0] + segs[1] + segs[2] + segs[3];
  const t = ((now - cycleT0) / 1000) % total;

  // Which phase, how far through it, and what the lungs are doing.
  let phase = 0;
  let acc = 0;
  let k;
  for (k = 0; k < 4; k++) {
    if (t < acc + segs[k] && segs[k] > 0) {
      phase = k;
      break;
    }
    acc += segs[k];
  }
  if (k === 4) {
    phase = 0;
    acc = 0;
  }
  const into = t - acc;
  const left = Math.max(0, segs[phase] - into);
  const p = segs[phase] > 0 ? into / segs[phase] : 0;
  const amp = phase === 0 ? ease(p) : phase === 1 ? 1 : phase === 2 ? 1 - ease(p) : 0;

  const W = cv.clientWidth;
  const H = cv.clientHeight;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  if (cv.width !== ((W * dpr) | 0)) {
    cv.width = (W * dpr) | 0;
    cv.height = (H * dpr) | 0;
  }
  c2.setTransform(dpr, 0, 0, dpr, 0, 0);
  c2.clearRect(0, 0, W, H);
  const cx = W / 2;
  const cy = H / 2;
  const maxR = Math.min(W, H) / 2 - 6;

  const hue = ((t / total) * 290 + bassNow * 10) % 360;

  if (reduce) {
    // Reduced motion: no growing, just a slow breath of OPACITY.
    c2.globalAlpha = 0.35 + amp * 0.4;
    const flat = c2.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.8);
    flat.addColorStop(0, 'hsla(' + hue + ',90%,70%,.5)');
    flat.addColorStop(1, 'hsla(' + hue + ',90%,55%,0)');
    c2.fillStyle = flat;
    c2.beginPath();
    c2.arc(cx, cy, maxR * 0.8, 0, 6.2832);
    c2.fill();
    c2.globalAlpha = 1;
    return { phase, left };
  }

  const r = maxR * (0.42 + 0.58 * amp);
  // The outer bloom, additive, so it pools into the room rather than sitting on
  // top of it like a sticker.
  c2.globalCompositeOperation = 'lighter';
  const glow = c2.createRadialGradient(cx, cy, r * 0.2, cx, cy, maxR);
  glow.addColorStop(0, 'hsla(' + hue + ',100%,68%,' + (0.16 + amp * 0.2) + ')');
  glow.addColorStop(0.55, 'hsla(' + (hue + 26) + ',100%,62%,' + (0.06 + amp * 0.1) + ')');
  glow.addColorStop(1, 'hsla(' + (hue + 40) + ',100%,60%,0)');
  c2.fillStyle = glow;
  c2.fillRect(0, 0, W, H);

  // The body of the orb.
  const body = c2.createRadialGradient(cx - r * 0.25, cy - r * 0.3, r * 0.08, cx, cy, r);
  body.addColorStop(0, 'hsla(' + (hue + 34) + ',100%,86%,' + (0.5 + amp * 0.3) + ')');
  body.addColorStop(0.6, 'hsla(' + hue + ',96%,62%,' + (0.24 + amp * 0.22) + ')');
  body.addColorStop(1, 'hsla(' + (hue - 14) + ',92%,48%,0)');
  c2.fillStyle = body;
  c2.beginPath();
  c2.arc(cx, cy, r, 0, 6.2832);
  c2.fill();
  c2.globalCompositeOperation = 'source-over';

  // The rim, and one ring travelling outward on the inhale and inward on the
  // exhale. The thing the eye actually follows without being told to.
  c2.strokeStyle = 'hsla(' + (hue + 30) + ',100%,84%,' + (0.3 + amp * 0.45) + ')';
  c2.lineWidth = 1.4;
  c2.beginPath();
  c2.arc(cx, cy, r, 0, 6.2832);
  c2.stroke();
  if (phase === 0 || phase === 2) {
    const rp = phase === 0 ? p : 1 - p;
    c2.strokeStyle = 'hsla(' + (hue + 50) + ',100%,80%,' + 0.3 * (1 - Math.abs(rp * 2 - 1)) + ')';
    c2.lineWidth = 1;
    c2.beginPath();
    c2.arc(cx, cy, maxR * (0.42 + 0.58 * rp), 0, 6.2832);
    c2.stroke();
  }

  return { phase, left };
}
