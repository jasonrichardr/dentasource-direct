// formations/emblem.js — sample an image into particle positions. Draw it to a
// TRANSPARENT canvas, keep the pixels that are INK, shuffle, and contain-fit to a world
// box: the text.js technique but for an image. Swap the file and it works, so any logo
// or product photo can form from the cloud.
//
// WHAT COUNTS AS INK depends on the source, which is why there is a mode. A logo exported
// with alpha carries its own cutout, so 'alpha' only has to drop near-white (inkMax
// 0.985) in case the logo sits on a white plate. A studio product shot has NO alpha at
// all and is a dark subject on a pale ground, so 'dark' lowers that same ceiling to 0.85:
// everything brighter than it IS the ground. 'light' inverts the test for a pale subject
// on a dark ground. The knob is inkMax in every mode, so a beat can tune one number:
// Denjoy's hero grounds out at luminance 0.93 and needs 0.85, a chair on white is happy
// at 0.72. `threshold` stays what it always was, the ALPHA cutoff.

import { WORLD, shuffle } from "./util.js";

// Load an image and resolve once it is decoded (so sampling stays synchronous after boot).
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

// img: a loaded HTMLImageElement.
// crop: either {sx,sy,sw,sh} in source pixels or {x,y,w,h} as 0..1 fractions of the source.
// mode: 'alpha' | 'dark' | 'light'; 'dark' just lowers the inkMax default to 0.85, and a
// beat that sets inkMax itself always wins.
// threshold: the alpha cutoff, in every mode. A transparent pixel is never ink.
// maxSide: the sampling canvas is downsampled to this long edge first, so a 3000px photo
// costs the same as a 500px one.
export function imageToPositions(N, img, opts = {}) {
  const {
    crop = null,
    mode = "alpha",
    threshold = 36,        // ALPHA cutoff (transparent bg -> only ink survives)
    inkMax = mode === "dark" ? 0.85 : 0.985,   // luminance ceiling: brighter than this is ground
    inkMin = 0.35,         // 'light' mode floor: darker than this is ground
    maxSide = 512,
    boxW = WORLD * 0.84,
    boxH = WORLD * 0.84,
    jitter = 0.02,
    edgeShare = 0.5,       // share of the budget spent on the silhouette
    z = 0,
    zBow = 0,              // optional parabolic bow toward the camera (depth on orbit)
    yOffset = 0,           // lift/lower the whole mark in world units
  } = opts;

  const sw0 = img.naturalWidth || img.width;
  const sh0 = img.naturalHeight || img.height;
  const frac = crop && crop.w !== undefined;   // {x,y,w,h} in 0..1
  let sx = crop ? (frac ? crop.x * sw0 : crop.sx) : 0;
  let sy = crop ? (frac ? crop.y * sh0 : crop.sy) : 0;
  let sw = crop ? (frac ? crop.w * sw0 : crop.sw) : sw0;
  let sh = crop ? (frac ? crop.h * sh0 : crop.sh) : sh0;
  sx = Math.max(0, Math.min(sw0 - 1, sx));
  sy = Math.max(0, Math.min(sh0 - 1, sy));
  sw = Math.max(1, Math.min(sw0 - sx, sw));
  sh = Math.max(1, Math.min(sh0 - sy, sh));

  const shrink = maxSide > 0 ? Math.min(1, maxSide / Math.max(sw, sh)) : 1;
  const cw = Math.max(1, Math.round(sw * shrink));
  const ch = Math.max(1, Math.round(sh * shrink));

  const cv = document.createElement("canvas");
  cv.width = cw;
  cv.height = ch;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  ctx.clearRect(0, 0, cw, ch);                 // TRANSPARENT — never fill a background
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);

  const { data } = ctx.getImageData(0, 0, cw, ch);
  const keep = (x, y) => {
    if (x < 0 || y < 0 || x >= cw || y >= ch) return false;
    const idx = (y * cw + x) * 4;
    if (data[idx + 3] <= threshold) return false;
    const l = (0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]) / 255;
    return mode === "light" ? l >= inkMin : l <= inkMax;
  };

  // TWO POOLS, EDGES AND FILL. Spreading the budget evenly over the ink gives a cloud of
  // confetti: the interior of a shape eats most of the particles and the outline, which
  // is the only part the eye reads as a logo, gets whatever is left. So a pixel next to
  // a pixel we are NOT keeping is an edge, and edges get their own share of the budget.
  const edge = [];
  const fill = [];
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      if (!keep(x, y)) continue;
      const isEdge = !keep(x - 1, y) || !keep(x + 1, y) || !keep(x, y - 1) || !keep(x, y + 1);
      (isEdge ? edge : fill).push([x, y]);
    }
  }
  const pts = edge.length + fill.length ? [...edge, ...fill] : [];

  const out = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  if (pts.length === 0) return { positions: out, colors: col };
  shuffle(edge);
  shuffle(fill);

  // CONTAIN-FIT to the world box, preserving aspect (so crops of any shape center cleanly).
  const halfW = cw / 2;
  const halfH = ch / 2;
  const s = Math.min(boxW / halfW, boxH / halfH);
  // How much of the budget the outline gets. Edges are a small fraction of the pixels and
  // the whole of the silhouette, so they are worth over-serving.
  const nEdge = edge.length ? Math.min(N, Math.round(N * edgeShare)) : 0;
  for (let i = 0; i < N; i++) {
    const fromEdge = i < nEdge;
    const pool = fromEdge ? edge : (fill.length ? fill : edge);
    const p = pool[(fromEdge ? i : i - nEdge) % pool.length];
    const nx = halfW > 0 ? (p[0] - halfW) / halfW : 0; // -1..1 across width (for the bow)
    out[i * 3 + 0] = (p[0] - halfW) * s + (Math.random() - 0.5) * jitter;
    out[i * 3 + 1] = -(p[1] - halfH) * s + yOffset + (Math.random() - 0.5) * jitter;
    out[i * 3 + 2] = z + zBow * (1 - nx * nx) + (Math.random() - 0.5) * jitter;
    // THE DOT WEARS THE PIXEL IT CAME FROM. The ring is silver, the D is green, the
    // shadow is near black, and a single brand colour throws all three away.
    const idx = (p[1] * cw + p[0]) * 4;
    col[i * 3 + 0] = data[idx] / 255;
    col[i * 3 + 1] = data[idx + 1] / 255;
    col[i * 3 + 2] = data[idx + 2] / 255;
  }
  return { positions: out, colors: col };
}
