// formations/emblem.js — sample an image into particle positions. Draw it to a
// TRANSPARENT canvas, keep the ink pixels (alpha > threshold), shuffle, and contain-fit
// to a world box: the text.js technique but for an image. Swap the PNG and it works, so
// any logo or product silhouette can form from the cloud.

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

// img: a loaded HTMLImageElement. crop: {sx,sy,sw,sh} in source px (omit -> full image).
export function imageToPositions(N, img, opts = {}) {
  const {
    crop = null,
    threshold = 36,        // alpha cutoff (transparent bg -> only ink survives)
    inkMax = 0.985,        // also drop near-white (robust if a logo has a white bg)
    boxW = WORLD * 0.84,
    boxH = WORLD * 0.84,
    jitter = 0.02,
    z = 0,
    zBow = 0,              // optional parabolic bow toward the camera (depth on orbit)
    yOffset = 0,           // lift/lower the whole mark in world units
  } = opts;

  const sw0 = img.naturalWidth || img.width;
  const sh0 = img.naturalHeight || img.height;
  const sx = crop ? crop.sx : 0;
  const sy = crop ? crop.sy : 0;
  const sw = crop ? crop.sw : sw0;
  const sh = crop ? crop.sh : sh0;
  const cw = Math.max(1, Math.round(sw));
  const ch = Math.max(1, Math.round(sh));

  const cv = document.createElement("canvas");
  cv.width = cw;
  cv.height = ch;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  ctx.clearRect(0, 0, cw, ch);                 // TRANSPARENT — never fill a background
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);

  const { data } = ctx.getImageData(0, 0, cw, ch);
  const pts = [];
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const idx = (y * cw + x) * 4;
      if (data[idx + 3] <= threshold) continue;
      const lum = (0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]) / 255;
      if (lum > inkMax) continue;              // drop pure white
      pts.push([x, y]);
    }
  }

  const out = new Float32Array(N * 3);
  if (pts.length === 0) return out;
  shuffle(pts);

  // CONTAIN-FIT to the world box, preserving aspect (so crops of any shape center cleanly).
  const halfW = cw / 2;
  const halfH = ch / 2;
  const s = Math.min(boxW / halfW, boxH / halfH);
  for (let i = 0; i < N; i++) {
    const p = pts[i % pts.length];
    const nx = halfW > 0 ? (p[0] - halfW) / halfW : 0; // -1..1 across width (for the bow)
    out[i * 3 + 0] = (p[0] - halfW) * s + (Math.random() - 0.5) * jitter;
    out[i * 3 + 1] = -(p[1] - halfH) * s + yOffset + (Math.random() - 0.5) * jitter;
    out[i * 3 + 2] = z + zBow * (1 - nx * nx) + (Math.random() - 0.5) * jitter;
  }
  return out;
}
