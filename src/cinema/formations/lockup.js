// formations/lockup.js — the DSD lockup, built from the two real assets rather than from
// one badge and a typed approximation of the words.
//
// ☠️ WHY TWO SOURCES. dsd-round.png is 480px and is the only decent disc we have; the
// wordmark inside it is hairline lettering that samples to mud at any density. The stacked
// logo carries the SAME wordmark at 1080px, in its real colours: dark green DENTA, light
// green SOURCE, black DIRECT with its speed lines. So the disc comes from the badge and
// the words come from the stacked asset, and every dot of the wordmark is now a pixel of
// the printed mark instead of canvas text tinted afterwards.
//
// Measured off the assets rather than quoted: in logo-stacked.png the disc occupies rows
// 265 to 486 and columns 429 to 650, so 222 square; the wordmark occupies rows 498 to 695
// and columns 100 to 988, so 889 by 198; and the gap between them is 12px. The disc is
// therefore very close to a quarter of the wordmark's width, which is the proportion this
// file lays out.

import { WORLD } from "./util.js";
import { getLockupDials } from "./lockupConfig.js";

export const DISC_SRC = "/cinema/brand/dsd-round.png";
export const STACK_SRC = "/images/brand/logo-stacked.png";

// crops, in each asset's own pixels
// ☠️ THE DISC CROP IS THE SYMBOL, NOT THE BADGE. dsd-round.png carries its own hairline
// "DentaSource Direct" under the mark, and sampling the whole file renders that tiny
// wordmark inside the disc as well as the real one below it: the same words twice, one of
// them unreadable. Measured ink bounds of the symbol alone.
// ☠️ AND IT IS A SQUARE WITH A MARGIN, OR THE DISC IS CUT (Jarich, 2026-10-02: "it looks
// cut"). The old box {86, 41, 308, 300} stopped at row 340 while the green rim runs to row
// 343 and the disc's shadow to about 346, so the bottom of the ring was sliced flat; the
// box was also 308 by 300 drawn into a square, which stretched the disc 2.7% tall.
// Measured on the asset: the disc's ink spans x 88 to 392 and y 43 to 346, centred on
// (240, 194). This box is that centre with 318 a side, which leaves 21 px of ground on
// three sides and 26 below. The small "DentaSource Direct" under the badge starts at row
// 350 and its top edge falls inside this box, which is why keepCentre() below exists.
const DISC_CROP = { sx: 81, sy: 36, sw: 318, sh: 318 };
// how much of the crop the disc itself fills (977 of 1024 at the sample size), so the
// layout can draw the box a little larger and keep the visible disc at the asset's size
const DISC_FILL = 0.955;
const WORD_CROP = { sx: 100, sy: 498, sw: 889, sh: 198 };
// the asset's own proportions, used to lay the two samplings out as one lockup
const ASSET = { discD: 222, wordW: 889, wordH: 198, gap: 12 };

const NEAR_WHITE = 0.92;
const DISC_SAMPLE = 1024;   // the badge is upscaled to this before sampling
const WORD_SAMPLE = 1024;

function draw(img, crop, side, smooth = true) {
  const scale = side / Math.max(crop.sw, crop.sh);
  const cw = Math.max(1, Math.round(crop.sw * scale));
  const ch = Math.max(1, Math.round(crop.sh * scale));
  const cv = document.createElement("canvas");
  cv.width = cw; cv.height = ch;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  ctx.imageSmoothingEnabled = smooth;            // bicubic-ish upscale of the small badge
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, cw, ch);
  return { data: ctx.getImageData(0, 0, cw, ch).data, cw, ch };
}

const lumOf = (d, i) => (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;

// THE GROUND IS WHAT THE CORNERS CAN REACH. A plain "drop near-white" rule also drops the
// white D inside the disc, because the D is white and the page is white and a threshold
// cannot tell them apart. A flood from the corners can: the D is enclosed by the mark, so
// nothing outside can reach it, and it stays.
function groundMask(d, cw, ch) {
  const ground = new Uint8Array(cw * ch);
  const isPale = (i) => d[i * 4 + 3] <= 36 || lumOf(d, i * 4) > NEAR_WHITE;
  const stack = [];
  const push = (i) => { if (!ground[i] && isPale(i)) { ground[i] = 1; stack.push(i); } };
  for (let x = 0; x < cw; x++) { push(x); push((ch - 1) * cw + x); }
  for (let y = 0; y < ch; y++) { push(y * cw); push(y * cw + cw - 1); }
  while (stack.length) {
    const i = stack.pop();
    const x = i % cw, y = (i / cw) | 0;
    if (x > 0) push(i - 1);
    if (x < cw - 1) push(i + 1);
    if (y > 0) push(i - cw);
    if (y < ch - 1) push(i + cw);
  }
  return ground;
}

// Peel `n` pixels off the outside of the mask. The rim of the badge is anti-aliased
// against the white ground, and those in-between pixels are what became a bright halo of
// dots around the disc; they are not part of the logo.
function erode(mask, cw, ch, n) {
  let cur = mask;
  for (let pass = 0; pass < n; pass++) {
    const next = new Uint8Array(cur.length);
    for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
      const i = y * cw + x;
      if (!cur[i]) continue;
      const edge = x === 0 || y === 0 || x === cw - 1 || y === ch - 1
        || !cur[i - 1] || !cur[i + 1] || !cur[i - cw] || !cur[i + cw];
      if (!edge) next[i] = 1;
    }
    cur = next;
  }
  return cur;
}

// THE MARK IS ONE PIECE. Keep only the ink connected to the centre of the box. A square
// crop around the disc also catches two slivers of the badge's own grey outline in its top
// corners and the top edge of the small wordmark under it; neither can be reached by the
// corner flood (they touch the border and are not pale), and both rendered as stray dots.
// Nothing that belongs to the disc is disconnected from it: face, D and rim are one shape.
function keepCentre(mask, cw, ch) {
  const start = ((ch >> 1) * cw) + (cw >> 1);
  if (!mask[start]) return mask;
  const keep = new Uint8Array(mask.length);
  const stack = [start];
  keep[start] = 1;
  while (stack.length) {
    const i = stack.pop();
    const x = i % cw, y = (i / cw) | 0;
    const next = [x > 0 ? i - 1 : -1, x < cw - 1 ? i + 1 : -1, y > 0 ? i - cw : -1, y < ch - 1 ? i + cw : -1];
    for (const j of next) if (j >= 0 && mask[j] && !keep[j]) { keep[j] = 1; stack.push(j); }
  }
  return keep;
}

// ONE PARTICLE PER CELL, no jitter. Sampling random ink pixels leaves holes and clumps
// because random points collide; a grid tiles the shape exactly once, which is what makes
// it read as a mark instead of a spray.
function gridCells(ink, d, cw, ch, pitch) {
  const cells = [];
  for (let y = (pitch >> 1); y < ch; y += pitch) {
    for (let x = (pitch >> 1); x < cw; x += pitch) {
      if (!ink[y * cw + x]) continue;
      const i = (y * cw + x) * 4;
      cells.push([x, y, d[i] / 255, d[i + 1] / 255, d[i + 2] / 255]);
    }
  }
  return cells;
}

// pitch that lands closest to a target cell count, found by bisection on the real mask
function pitchFor(ink, d, cw, ch, target) {
  let lo = 1, hi = 24, best = 2, bestCells = null;
  for (let k = 0; k < 8; k++) {
    const mid = Math.max(1, Math.round((lo + hi) / 2));
    const cells = gridCells(ink, d, cw, ch, mid);
    if (cells.length >= target) { best = mid; bestCells = cells; lo = mid + 1; }
    else hi = mid - 1;
    if (lo > hi) break;
  }
  if (!bestCells) { best = 1; bestCells = gridCells(ink, d, cw, ch, 1); }
  return { pitch: best, cells: bestCells };
}

// DARK REGISTER. Black DIRECT and its speed lines are invisible on the night sky, so
// anything under this luminance is lifted onto the silver ladder, keeping a trace of its
// own hue so the lift does not read as flat grey. Greens and greys are already legible
// and are left exactly as the asset has them.
// (defaults live in lockupConfig.js; these names are kept only as prose anchors)
// LIGHT REGISTER: a silver-white disc on cream paper is nearly invisible, which is what
// made the mark disappear in Jarich's light screenshot. The disc's own samples are taken
// down toward the ink end so the mark has a ground to sit on; the wordmark is already
// dark green and black and is left exactly as printed.
// ☠️ ONLY THE COLOURLESS DARKS ARE LIFTED, NEVER THE GREEN (Jarich, 2026-10-02: the dot
// logo "looks cut"). DENTA's green is a gradient in the asset, rgb(0,103,1) at the edges of
// each letter and rgb(0,112,1) through the middle. After grade() those land at luma 0.311
// and 0.356, either side of darkLiftBelow 0.35, so the edges of every DENTA letter were
// lifted to silver and the middles stayed green: the big D read as a green band with its
// top and its lower curve cut off in grey. The rule above always meant black DIRECT and
// its speed lines; a dot with real colour in it is left as the asset has it.
function liftForDark(r, g, b, dials) {
  const l = 0.299 * r + 0.587 * g + 0.114 * b;
  const chroma = Math.max(r, g, b) - Math.min(r, g, b);
  if (l >= dials.darkLiftBelow || chroma > dials.darkLiftMaxChroma) return [r, g, b];
  const k = dials.darkLiftTo / Math.max(l, 0.04);
  const hue = dials.darkLiftHue;          // how much of the original colour survives
  return [
    Math.min(1, r * k * hue + dials.darkLiftTo * (1 - hue)),
    Math.min(1, g * k * hue + dials.darkLiftTo * (1 - hue) * 1.02),
    Math.min(1, b * k * hue + dials.darkLiftTo * (1 - hue)),
  ];
}

// GRADE. The asset is a print file, and print greens are deliberately restrained: the
// badge's rim measures rgb(171,206,142), a chroma of 0.31, where the brand green is
// rgb(156,196,73) at 0.63. Saturation opens that gap around the pixel's OWN luma, so the
// mark keeps its tonal drawing and only its colour gets its voice back; brightness and
// contrast then put the metal back into the silver.
function grade(r, g, b, dials) {
  const l = 0.299 * r + 0.587 * g + 0.114 * b;
  let o = [
    l + (r - l) * dials.saturation,
    l + (g - l) * dials.saturation,
    l + (b - l) * dials.saturation,
  ];
  o = o.map((c) => (c - 0.5) * dials.contrast + 0.5);
  o = o.map((c) => c * dials.brightness);
  return o.map((c) => Math.min(1, Math.max(0, c)));
}

/**
 * Build the lockup. `images` holds the two decoded sources. Returns positions and colours
 * plus the pitch that was used, so the engine can size the dots to it.
 */
export function buildLockup(N, { discImg, wordImg, isDark = false, markBox, markY, wordCenterY, wordHalfW, dials: dialsIn }) {
  // The live dials, unless a caller pinned a set (the studio will want to render a preview
  // without disturbing what the page is currently showing).
  const dials = { ...getLockupDials(), ...(dialsIn || {}) };
  const disc = draw(discImg, DISC_CROP, DISC_SAMPLE);
  const word = draw(wordImg, WORD_CROP, WORD_SAMPLE, false);

  // ☠️ THE DISC KEEPS EVERYTHING THE FLOOD CANNOT REACH, PLATE INCLUDED.
  // An earlier pass also dropped near-white here, on the theory that the plate was the
  // badge's background rather than the mark. MEASURED, that theory was wrong twice over:
  // 41.9% of the pixels inside the rim are above the near-white threshold, and they are
  // not a background, they are the silver face of the badge and the D standing on it. So
  // the rule removed the D and left a hole, which is exactly what read as a broken disc.
  // The flood alone is the correct rule: it starts at the border, cannot cross the rim,
  // and so drops the page and nothing else. What survives is the printed badge, silver
  // face, white D, green rim, which is what a reader recognises as the logo.
  const discGround = groundMask(disc.data, disc.cw, disc.ch);
  let discInk = new Uint8Array(disc.cw * disc.ch);
  for (let i = 0; i < discInk.length; i++) {
    discInk[i] = discGround[i] ? 0 : 1;
  }
  discInk = keepCentre(erode(discInk, disc.cw, disc.ch, dials.erosion), disc.cw, disc.ch);

  // the wordmark sits on the page, and its counters are open to it, so a plain threshold
  // is the right rule here and a flood would be the wrong one
  const wordInk = new Uint8Array(word.cw * word.ch);
  for (let i = 0; i < wordInk.length; i++) {
    wordInk[i] = word.data[i * 4 + 3] > 36 && lumOf(word.data, i * 4) <= NEAR_WHITE ? 1 : 0;
  }

  // split the budget the way the asset splits its own area
  const discShare = 0.42;
  // SHARPNESS. pitchFor lands the grid on the budget; pitchBias then re-samples at a
  // finer or coarser pitch. Below 1 the grid samples MORE cells than there are slots, and
  // place() strides through them, so the mark is drawn from more of the asset's detail.
  const biased = (res, ink, d, cw, ch) => {
    if (dials.pitchBias === 1) return res;
    const pitch = Math.max(1, Math.round(res.pitch * dials.pitchBias));
    return pitch === res.pitch ? res : { pitch, cells: gridCells(ink, d, cw, ch, pitch) };
  };
  const dRes = biased(pitchFor(discInk, disc.data, disc.cw, disc.ch, Math.round(N * discShare)),
    discInk, disc.data, disc.cw, disc.ch);
  const wRes = biased(pitchFor(wordInk, word.data, word.cw, word.ch, Math.round(N * (1 - discShare))),
    wordInk, word.data, word.cw, word.ch);

  // LAYOUT, in the asset's proportions. The wordmark's width sets the scale; the disc is
  // a quarter of it and sits centred above, with the asset's own gap.
  const wordW = (wordHalfW ?? 4.3) * 2;
  const unit = wordW / ASSET.wordW;
  const wordH = ASSET.wordH * unit;
  const discD = ASSET.discD * unit;
  const gap = ASSET.gap * unit;
  const blockH = discD + gap + wordH;
  const centreY = (markY ?? 0) - (markBox ? 0 : 0);
  const topY = centreY + blockH / 2;
  const discCY = topY - discD / 2;
  const wordCY = topY - discD - gap - wordH / 2;

  const out = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  // ☠️ STRIDE, DO NOT TAKE A PREFIX. Cells come out of the mask in scan order, so filling
  // the slots with cells[k % length] hands every slot to the TOP of the shape and stops.
  // Measured: the wordmark had 88,931 cells and 53,360 slots, and DIRECT, which lives in
  // the last third of the scan, was never placed at all. Striding covers the whole shape
  // whichever way the budget falls.
  const place = (cells, cw, ch, cx, cy, w, h, from, to, darken = 0) => {
    if (!cells.length) return;
    const slots = to - from;
    const stride = cells.length / Math.max(1, slots);
    for (let i = from; i < to; i++) {
      const c = cells[Math.min(cells.length - 1, Math.floor((i - from) * stride))];
      out[i * 3 + 0] = cx + (c[0] / cw - 0.5) * w;
      out[i * 3 + 1] = cy - (c[1] / ch - 0.5) * h;
      out[i * 3 + 2] = 0;
      const [gr, gg, gb] = grade(c[2], c[3], c[4], dials);
      const rgb = isDark
        ? liftForDark(gr, gg, gb, dials)
        : (darken ? [gr * darken, gg * darken, gb * darken] : [gr, gg, gb]);
      col[i * 3 + 0] = rgb[0];
      col[i * 3 + 1] = rgb[1];
      col[i * 3 + 2] = rgb[2];
    }
  };
  const nDisc = Math.min(N, Math.round(N * discShare));
  // the box is drawn DISC_FILL larger than the disc so the disc inside it lands at discD
  const discBox = discD / DISC_FILL;
  place(dRes.cells, disc.cw, disc.ch, 0, discCY, discBox, discBox, 0, nDisc, isDark ? 0 : dials.lightDiscDarken);
  place(wRes.cells, word.cw, word.ch, 0, wordCY, wordW, wordH, nDisc, N);

  // The dot is sized to the spacing the particles ACTUALLY land at, which is the grid
  // pitch stretched by however far the budget had to be spread: stride cells per slot
  // means sqrt(stride) times the pitch in each direction.
  const spread = (cells, slots) => Math.sqrt(Math.max(1, cells / Math.max(1, slots)));
  const discEff = dRes.pitch * spread(dRes.cells.length, nDisc);
  const wordEff = wRes.pitch * spread(wRes.cells.length, N - nDisc);
  return {
    positions: out,
    colors: col,
    discPitchWorld: (discEff / disc.cw) * discBox * dials.dotSize,
    wordPitchWorld: (wordEff / word.cw) * wordW * dials.dotSize,
    counts: {
      discCells: dRes.cells.length, wordCells: wRes.cells.length,
      discPitch: dRes.pitch, wordPitch: wRes.pitch,
      discSlots: nDisc, wordSlots: N - nDisc,
    },
    dials,
  };
}
