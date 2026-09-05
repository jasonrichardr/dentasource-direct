// formations/text.js — turn words into particle positions via canvas getImageData.
// The canvas MUST stay transparent so only glyph pixels have alpha>0 (filling a
// background makes every pixel opaque and you sample the whole rectangle).

import { WORLD, shuffle } from "./util.js";

// `text` is a string, or an array of { text, color } runs laid out on one line so the
// wordmark can wear two colours the way the printed lockup does.
export function textToPositions(N, text, opts = {}) {
  const runs = Array.isArray(text) ? text : null;
  const flat = runs ? runs.map((r) => r.text).join("") : String(text);
  const {
    lines = flat.split("\n"),
    fontSize = 150,
    fontWeight = 700,
    fontFamily = 'Inter, system-ui, sans-serif',
    lineHeight = 1.18,
    jitter = 0.018,
    z = 0,
    threshold = 130,
    scale = 1.0,
  } = opts;

  const pad = fontSize * 0.6;
  const measureCv = document.createElement("canvas");
  const mctx = measureCv.getContext("2d");
  mctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  let maxW = 0;
  for (const ln of lines) maxW = Math.max(maxW, mctx.measureText(ln).width);
  const canvasW = Math.ceil(maxW + pad * 2);
  const canvasH = Math.ceil(lines.length * fontSize * lineHeight + pad * 2);

  const cv = document.createElement("canvas");
  cv.width = canvasW;
  cv.height = canvasH;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  ctx.clearRect(0, 0, canvasW, canvasH); // leave the canvas TRANSPARENT
  ctx.fillStyle = "#fff";
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textBaseline = "middle";
  const blockH = lines.length * fontSize * lineHeight;
  const startY = canvasH / 2 - blockH / 2 + (fontSize * lineHeight) / 2;
  if (runs) {
    // draw the runs left to right from a common start, each in its own colour, so the
    // sampler reads the brand colours straight off the pixels
    ctx.textAlign = "left";
    const total = runs.reduce((w, r) => w + ctx.measureText(r.text).width, 0);
    let penX = canvasW / 2 - total / 2;
    for (const r of runs) {
      ctx.fillStyle = r.color || "#fff";
      ctx.fillText(r.text, penX, startY);
      penX += ctx.measureText(r.text).width;
    }
  } else {
    ctx.textAlign = "center";
    lines.forEach((ln, i) => ctx.fillText(ln, canvasW / 2, startY + i * fontSize * lineHeight));
  }

  const { data } = ctx.getImageData(0, 0, canvasW, canvasH);
  const pts = [];
  for (let y = 0; y < canvasH; y++) {
    for (let x = 0; x < canvasW; x++) {
      if (data[(y * canvasW + x) * 4 + 3] > threshold) pts.push([x, y]);
    }
  }

  const out = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  if (pts.length === 0) return { positions: out, colors: col };
  shuffle(pts);

  // CONTAIN-FIT: scale the text to fit a world box, preserving aspect, so wide copy
  // never overflows, it just gets smaller.
  const halfW = canvasW / 2;
  const halfH = canvasH / 2;
  const boxW = (opts.boxW ?? WORLD * 0.94) * scale;
  const boxH = (opts.boxH ?? WORLD * 0.6) * scale;
  const s = Math.min(boxW / halfW, boxH / halfH);
  for (let i = 0; i < N; i++) {
    const p = pts[i % pts.length];
    out[i * 3 + 0] = (p[0] - halfW) * s + (Math.random() - 0.5) * jitter;
    out[i * 3 + 1] = -(p[1] - halfH) * s + (Math.random() - 0.5) * jitter;
    out[i * 3 + 2] = z + (Math.random() - 0.5) * jitter;
    const idx = (p[1] * canvasW + p[0]) * 4;
    col[i * 3 + 0] = data[idx] / 255;
    col[i * 3 + 1] = data[idx + 1] / 255;
    col[i * 3 + 2] = data[idx + 2] / 255;
  }
  return { positions: out, colors: col };
}
