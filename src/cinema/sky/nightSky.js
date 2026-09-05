/**
 * The night sky: a Canvas2D window on the stars, behind everything else.
 *
 * HOW DEPTH IS FAKED, AND WHY IT IS FAKED THIS WAY
 * Real depth comes from PARALLAX: things far away move less. Three layers, each with its
 * own scroll factor AND its own autonomous drift, so the sky keeps breathing even when
 * the page is still:
 *
 *   far  x0.020 scroll, 0.9 px/s    galaxy band, nebula, ~2800 stars
 *   worlds x0.007 / x0.036          the sun and the moon
 *   mid  x0.065 scroll, 2.6 px/s    ~1600 stars + the constellations
 *   near x0.150 scroll, 19.5 px/s   85 twinkling motes
 *
 * PERFORMANCE LAW: 4000 stars can NOT be drawn per frame on a phone. The far and mid
 * layers are BAKED ONCE into offscreen bitmaps and then only translated (two drawImage
 * calls each, for the vertical wrap). Only the near motes, the constellations and the
 * occasional shooting star are drawn per frame.
 *
 * The seed is fixed, so a resize re-bakes the SAME sky rather than shuffling every star,
 * which is the one thing that would betray it as a canvas rather than a window.
 */

import { CFG, SKY_ASSET_BASE } from "./skyConfig.js";

/** Deterministic PRNG (mulberry32): the same sky after every re-bake. */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Real patterns, normalised inside their own box, anchored toward the EDGES on purpose:
 *  the middle of the screen belongs to the particle cloud. Southern Cross and Scorpius
 *  actually hang over the Philippines; Orion and Cassiopeia are the two everybody names. */
const CONSTELLATIONS = [
  {
    name: "Orion", at: [0.04, 0.34], size: 0.23,
    stars: [[0.72, 0.05], [0.28, 0.10], [0.60, 0.44], [0.50, 0.47], [0.40, 0.50], [0.70, 0.90], [0.22, 0.95]],
    mags: [1, 0.8, 0.72, 0.78, 0.72, 0.85, 1],
    lines: [[0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [5, 6]],
  },
  {
    name: "Crux", at: [0.88, 0.72], size: 0.12,
    stars: [[0.5, 0], [0.5, 1], [0.10, 0.55], [0.90, 0.46]],
    mags: [1, 0.9, 0.75, 0.8],
    lines: [[0, 1], [2, 3]],
  },
  {
    name: "Cassiopeia", at: [0.70, 0.02], size: 0.20,
    stars: [[0, 0.20], [0.25, 0.78], [0.5, 0.24], [0.75, 0.82], [1, 0.14]],
    mags: [0.8, 0.85, 0.8, 0.85, 0.8],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    name: "Scorpius", at: [0.03, 0.86], size: 0.21,
    stars: [[0.16, 0.04], [0.30, 0.12], [0.44, 0.21], [0.52, 0.36], [0.54, 0.53], [0.46, 0.69], [0.31, 0.79], [0.19, 0.88], [0.29, 0.97], [0.44, 0.99]],
    mags: [0.8, 0.7, 0.7, 0.95, 0.7, 0.7, 0.7, 0.7, 0.65, 0.65],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]],
  },
];

/** Only the moon and the sun hang here. The moon wears Mercury's real equirectangular
 *  map, which is what makes it look photographed instead of drawn. */
const WORLDS = [{ id: "moon", tex: "mercury", moon: true }];
/** Where the light comes from. Every world obeys it, so the terminators agree. */
const LIGHT = [-0.42, -0.5, 0.76];

export function createNightSky(canvas, { assetBase = SKY_ASSET_BASE } = {}) {
  const ctx = canvas.getContext("2d", { alpha: true });
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W = 0, H = 0, dpr = 1, sheetH = 0;
  let far = null, mid = null;      // baked bitmaps
  let near = [];                   // live twinkling motes
  let shots = [];                  // shooting stars in flight
  let raf = 0, active = false, started = 0, nextShot = 0;
  const worldImg = {};             // tex name -> HTMLImageElement
  const worldSprite = {};          // world id -> baked canvas
  let worldsAsked = false;

  // ---- the bakery ----
  function sheet() {
    const c = document.createElement("canvas");
    c.width = Math.ceil(W * dpr);
    c.height = Math.ceil(sheetH * dpr);
    const x = c.getContext("2d");
    x.scale(dpr, dpr);
    return { c, x };
  }

  function bakeFar() {
    const { c, x } = sheet();
    const r = rng(0x5eed01);

    // nebula — three soft blooms, the colour depth behind everything
    const blooms = [
      [0.22, 0.18, 0.55, "rgba(96,72,170,0.16)"],
      [0.78, 0.44, 0.62, "rgba(38,118,132,0.13)"],
      [0.46, 0.82, 0.50, "rgba(150,70,120,0.10)"],
    ];
    for (const [px, py, pr, col] of blooms) {
      const g = x.createRadialGradient(px * W, py * sheetH, 0, px * W, py * sheetH, pr * W);
      g.addColorStop(0, col.replace(/([\d.]+)\)$/, (m, a) => (parseFloat(a) * CFG.nebula).toFixed(3) + ")"));
      g.addColorStop(1, "rgba(0,0,0,0)");
      x.fillStyle = g;
      x.fillRect(0, 0, W, sheetH);
    }

    // the galaxy band — a milky diagonal, dense with dust
    x.save();
    x.translate(W * 0.5, sheetH * 0.5);
    x.rotate(-0.42);
    const bw = Math.hypot(W, sheetH), bh = Math.min(W, sheetH) * 0.30;
    const bg = x.createLinearGradient(0, -bh / 2, 0, bh / 2);
    bg.addColorStop(0, "rgba(180,190,230,0)");
    bg.addColorStop(0.42, "rgba(190,200,235,0.055)");
    bg.addColorStop(0.5, "rgba(214,222,255,0.085)");
    bg.addColorStop(0.58, "rgba(190,200,235,0.055)");
    bg.addColorStop(1, "rgba(180,190,230,0)");
    x.globalAlpha = CFG.galaxy;
    x.fillStyle = bg;
    x.fillRect(-bw / 2, -bh / 2, bw, bh);
    x.globalAlpha = 1;
    for (let i = 0; i < 1400; i++) {
      const u = (r() - 0.5) * bw;
      const v = (r() + r() + r() - 1.5) * (bh * 0.42);
      x.globalAlpha = 0.10 + r() * 0.35;
      x.fillStyle = r() < 0.12 ? "#ffe6b8" : "#e8eeff";
      x.fillRect(u, v, 1, 1);
    }
    x.globalAlpha = 1;
    x.restore();

    // the far field — the many, tiny and dim
    for (let i = 0; i < CFG.farCount; i++) {
      const px = r() * W, py = r() * sheetH;
      x.globalAlpha = 0.16 + r() * 0.42;
      x.fillStyle = r() < 0.10 ? "#ffdba8" : (r() < 0.2 ? "#cfe0ff" : "#ffffff");
      x.fillRect(px, py, 1, 1);
    }
    x.globalAlpha = 1;

    return c;
  }

  /** BAKE A WORLD. The texture is equirectangular, so every pixel of the disc is
   *  un-projected back to a point on the sphere, sampled, then lit by LIGHT with a soft
   *  terminator and limb darkening. A per-pixel loop, which is exactly why it runs ONCE
   *  per world per resize and is drawn as a sprite forever after. */
  function bakeWorld(img, rad, opts) {
    const R = Math.max(8, Math.round(rad));
    const size = R * 2;
    const src = document.createElement("canvas");
    const TW = 256, TH = 128;
    src.width = TW; src.height = TH;
    const sx = src.getContext("2d", { willReadFrequently: true });
    sx.drawImage(img, 0, 0, TW, TH);
    const tex = sx.getImageData(0, 0, TW, TH).data;

    const out = document.createElement("canvas");
    out.width = size; out.height = size;
    const ox = out.getContext("2d");
    const im = ox.createImageData(size, size);
    const d = im.data;
    const spin = opts.spin || 0;
    for (let py = 0; py < size; py++) {
      for (let px = 0; px < size; px++) {
        const nx = (px - R + 0.5) / R;
        const ny = (py - R + 0.5) / R;
        const q = nx * nx + ny * ny;
        const o = (py * size + px) * 4;
        if (q > 1) { d[o + 3] = 0; continue; }
        const nz = Math.sqrt(1 - q);
        const u = (Math.atan2(nx, nz) / (2 * Math.PI) + 0.5 + spin) % 1;
        const v = Math.acos(Math.max(-1, Math.min(1, ny))) / Math.PI;
        const tx = Math.min(TW - 1, (u * TW) | 0);
        const ty = Math.min(TH - 1, (v * TH) | 0);
        const t = (ty * TW + tx) * 4;
        // lambert + a lifted floor so the night side is not pure black
        let lam = nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2];
        lam = Math.max(0, lam);
        const lit = opts.ambient + (1 - opts.ambient) * Math.pow(lam, 0.85);
        const limb = 0.55 + 0.45 * nz;   // the edge of a lit sphere always falls away
        const k = lit * limb * opts.gain;
        d[o] = Math.min(255, tex[t] * k);
        d[o + 1] = Math.min(255, tex[t + 1] * k);
        d[o + 2] = Math.min(255, tex[t + 2] * k);
        d[o + 3] = Math.max(0, Math.min(1, (1 - q) * R * 0.9)) * 255;
      }
    }
    ox.putImageData(im, 0, 0);
    return out;
  }

  function bakeMid() {
    const { c, x } = sheet();
    const r = rng(0xb0a7);
    for (let i = 0; i < CFG.midCount; i++) {
      const px = r() * W, py = r() * sheetH;
      const s = r() < 0.86 ? 1 : 1.6;
      x.globalAlpha = 0.28 + r() * 0.5;
      x.fillStyle = r() < 0.14 ? "#ffe0b0" : (r() < 0.28 ? "#cfe0ff" : "#ffffff");
      x.fillRect(px, py, s, s);
    }
    x.globalAlpha = 1;
    return c;
  }

  /** Fetch the moon map the first time the sky is lit: a light-mode visitor never
   *  spends a byte on it. */
  function askWorlds() {
    if (worldsAsked) return;
    worldsAsked = true;
    for (const w of WORLDS) {
      if (worldImg[w.tex]) continue;
      const img = new Image();
      img.decoding = "async";
      img.src = assetBase + "planets/" + w.tex + ".jpg";
      img.onload = () => { worldImg[w.tex] = img; delete worldSprite[w.id]; };
      img.onerror = () => {};   // a missing world is a missing world, not a crash
    }
  }

  function drawWorlds(sy, t) {
    for (const w of WORLDS) {
      const img = worldImg[w.tex];
      if (!img) continue;
      const R = Math.max(9, Math.min(W, 620) * CFG.moonSize);
      let sprite = worldSprite[w.id];
      if (!sprite || sprite.__r !== R) {
        sprite = bakeWorld(img, R, {
          ambient: w.moon ? 0.10 : 0.13,
          gain: w.moon ? 1.22 : 0.86,
          spin: w.moon ? 0.12 : 0,
        });
        sprite.__r = R;
        worldSprite[w.id] = sprite;
      }
      const cx = CFG.moonX * W;
      // its own parallax plus the faintest drift, so nothing is ever frozen
      const off = sy * CFG.moonPar * CFG.parallax + t * (0.35 + CFG.moonPar * 8) * CFG.speed * CFG.drift;
      let cy = CFG.moonY * sheetH - (off % sheetH);
      if (cy < -R * 3) cy += sheetH;
      if (cy > H + R * 3 || cy < -R * 3) continue;

      const halo = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * (w.moon ? 5.5 : 3.2));
      halo.addColorStop(0, `rgba(226,232,255,${0.13 * CFG.moonGlow})`);
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(cx, cy, R * (w.moon ? 5.5 : 3.2), 0, Math.PI * 2); ctx.fill();

      ctx.drawImage(sprite, cx - R, cy - R, R * 2, R * 2);
    }
  }

  /** The sun, seen from very far out: a hot point with a corona, not a daytime sun. It is
   *  the slowest thing in the sky because it is the farthest, which is how the eye reads
   *  distance. */
  function sunPos(sy, t) {
    const off = sy * 0.007 * CFG.parallax + t * 0.28 * CFG.speed * CFG.drift;
    let cy = CFG.sunY * sheetH - (off % sheetH);
    if (cy < -sheetH * 0.4) cy += sheetH;
    return { x: CFG.sunX * W, y: cy };
  }

  function drawSun(sy, t) {
    const R = Math.max(2, Math.min(W, 620) * CFG.sunSize);
    const { x: cx, y: cy } = sunPos(sy, t);
    if (cy > H + R * 20 || cy < -R * 20) return;
    const pulse = 0.94 + 0.06 * Math.sin(t * 0.5 * CFG.speed);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 14 * pulse * CFG.sunGlow);
    g.addColorStop(0, "rgba(255,250,232,0.95)");
    g.addColorStop(0.06, "rgba(255,236,180,0.55)");
    g.addColorStop(0.22, "rgba(255,206,120,0.16)");
    g.addColorStop(0.55, "rgba(255,180,90,0.05)");
    g.addColorStop(1, "rgba(255,170,80,0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, R * 14 * pulse * CFG.sunGlow, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,252,244,0.98)";
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
  }

  function seedNear() {
    const r = rng(0x11ce);
    near = [];
    for (let i = 0; i < CFG.moteCount; i++) {
      near.push({
        x: r() * W,
        y: r() * sheetH,
        s: (0.5 + r() * 0.8) * CFG.moteSize,
        a: 0.4 + r() * 0.45,
        ph: r() * Math.PI * 2,
        sp: 0.5 + r() * 1.4,           // its own twinkle rate
        warm: r() < 0.16,
      });
    }
  }

  // ---- the flight ----
  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    sheetH = Math.max(H * 1.6, 900);
    canvas.width = Math.ceil(W * dpr);
    canvas.height = Math.ceil(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    far = bakeFar();
    mid = bakeMid();
    seedNear();
    if (!active) return;
    if (reduced) frame(0);
  }

  function wrapDraw(bitmap, off) {
    let y = -(off % sheetH);
    if (y > 0) y -= sheetH;
    ctx.drawImage(bitmap, 0, y, W, sheetH);
    if (y + sheetH < H) ctx.drawImage(bitmap, 0, y + sheetH, W, sheetH);
  }

  function constellations(off, t) {
    // One slow breath across all of them: never a blink, never static.
    const pulse = 0.5 + 0.5 * Math.sin(t * 0.14 * CFG.speed);
    const lineA = (0.035 + pulse * 0.05) * CFG.consAlpha;
    for (const k of CONSTELLATIONS) {
      const box = k.size * W;
      const bx = k.at[0] * W;
      const by0 = k.at[1] * sheetH;
      for (let rep = -1; rep <= 1; rep++) {
        const y = by0 - (off % sheetH) + rep * sheetH;
        if (y < -box * 1.4 || y > H + box * 0.4) continue;
        ctx.strokeStyle = `rgba(198,216,255,${lineA})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const [a, b] of k.lines) {
          ctx.moveTo(bx + k.stars[a][0] * box, y + k.stars[a][1] * box);
          ctx.lineTo(bx + k.stars[b][0] * box, y + k.stars[b][1] * box);
        }
        ctx.stroke();
        for (let i = 0; i < k.stars.length; i++) {
          const m = k.mags[i];
          const sx = bx + k.stars[i][0] * box, sy = y + k.stars[i][1] * box;
          const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 5 * m);
          g.addColorStop(0, `rgba(255,255,255,${0.55 + pulse * 0.35 * m})`);
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(sx, sy, 5 * m, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = `rgba(255,255,255,${0.75 + pulse * 0.2})`;
          ctx.fillRect(sx - 0.7 * m, sy - 0.7 * m, 1.4 * m, 1.4 * m);
        }
      }
    }
  }

  function shootingStars(t, dt) {
    if (reduced) return;
    if (t > nextShot) {
      // a sky that is alive, never a shower
      nextShot = t + CFG.shootEvery * (0.75 + Math.random() * 0.5);
      const fromLeft = Math.random() < 0.5;
      shots.push({
        x: fromLeft ? -60 : W + 60,
        y: Math.random() * H * 0.55,
        vx: (fromLeft ? 1 : -1) * (520 + Math.random() * 320) * CFG.shootSpeed,
        vy: (150 + Math.random() * 190) * CFG.shootSpeed,
        life: 0,
        span: 0.9 + Math.random() * 0.5,
      });
    }
    for (let i = shots.length - 1; i >= 0; i--) {
      const s = shots[i];
      s.life += dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      const k = s.life / s.span;
      if (k >= 1 || s.x < -160 || s.x > W + 160 || s.y > H + 160) { shots.splice(i, 1); continue; }
      const fade = Math.sin(Math.PI * k);              // born and dies soft
      const tailX = s.x - s.vx * 0.055 * CFG.shootLen, tailY = s.y - s.vy * 0.055 * CFG.shootLen;
      const g = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(1, `rgba(255,247,224,${Math.min(1, 0.85 * fade * CFG.shootGlow)})`);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.7;
      ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(s.x, s.y); ctx.stroke();
      const h = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 7);
      h.addColorStop(0, `rgba(255,252,240,${Math.min(1, 0.9 * fade * CFG.shootGlow)})`);
      h.addColorStop(1, "rgba(255,252,240,0)");
      ctx.fillStyle = h;
      ctx.beginPath(); ctx.arc(s.x, s.y, 7, 0, Math.PI * 2); ctx.fill();
    }
  }

  let last = 0;
  function frame(now) {
    raf = reduced ? 0 : requestAnimationFrame(frame);
    const t = (now - started) / 1000;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;

    const sy = window.scrollY || window.pageYOffset || 0;

    // the ground: a night gradient, deepest overhead
    const bgc = ctx.createLinearGradient(0, 0, 0, H);
    const L = CFG.skyLift;
    const mix = (r, g, b) => `rgb(${Math.round(r * L)},${Math.round(g * L)},${Math.round(b * L)})`;
    bgc.addColorStop(0, mix(4, 6, 13));
    bgc.addColorStop(0.55, mix(7, 11, 22));
    bgc.addColorStop(1, mix(10, 15, 28));
    ctx.fillStyle = bgc;
    ctx.fillRect(0, 0, W, H);

    wrapDraw(far, sy * 0.020 * CFG.parallax + t * 0.9 * CFG.speed * CFG.drift);
    // DEPTH ORDER IS THE WHOLE ILLUSION. Everything is painted BACK to FRONT: the deep
    // sheets, then the constellation lines, then the motes, and the moon LAST of the sky
    // so nothing is ever drawn across its face. A line crossing a solid body is the one
    // thing that says "flat canvas".
    drawSun(sy, t);
    const midOff = sy * 0.065 * CFG.parallax + t * 2.6 * CFG.speed * CFG.drift;
    wrapDraw(mid, midOff);
    constellations(midOff, t);

    // the near field — the only stars that truly twinkle
    const nearOff = sy * 0.150 * CFG.parallax + t * CFG.moteRise * CFG.speed * CFG.drift;
    for (const s of near) {
      let y = s.y - (nearOff % sheetH);
      if (y < -8) y += sheetH;
      if (y > H + 8 || y < -8) continue;
      const tw = 0.62 + 0.38 * Math.sin(t * s.sp * CFG.speed * 2.4 * CFG.moteTwinkle + s.ph);
      const a = s.a * tw;
      const g = ctx.createRadialGradient(s.x, y, 0, s.x, y, s.s * 2.4);
      g.addColorStop(0, s.warm ? `rgba(255,226,170,${a})` : `rgba(226,238,255,${a})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(s.x, y, s.s * 2.4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,${Math.min(1, a * 1.25)})`;
      ctx.fillRect(s.x - s.s / 2, y - s.s / 2, s.s, s.s);
    }

    drawWorlds(sy, t);   // the moon occludes the sky, never the reverse

    shootingStars(t, dt);
  }

  function start() {
    if (active) return;
    active = true;
    askWorlds();
    canvas.style.display = "block";
    started = performance.now();
    last = 0;
    nextShot = 2;
    if (reduced) frame(performance.now());
    else raf = requestAnimationFrame(frame);
  }
  function stop() {
    active = false;
    canvas.style.display = "none";
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    shots = [];
  }

  let rt = 0;
  const onResize = () => { clearTimeout(rt); rt = setTimeout(resize, 180); };
  // A backgrounded tab must not keep a rAF loop warm on someone's data plan.
  const onVisibility = () => {
    if (!active) return;
    if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = 0; }
    else if (!raf && !reduced) { last = 0; raf = requestAnimationFrame(frame); }
  };
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVisibility);

  resize();
  return {
    start,
    stop,
    get active() { return active; },
    /** React unmount: stop the loop and give the listeners back. */
    destroy() {
      stop();
      clearTimeout(rt);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
}
