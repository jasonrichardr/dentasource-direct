// formations/index.js — the generic arc builder. A page hands in an ordered list of beats
// and gets back the formations the morph chain walks through. Every beat is one of:
//
//   lockup        mark sampled from an image + a canvas-text wordmark seated beneath it
//   image         any PNG sampled into particles (logo, product silhouette, photo cutout)
//   text          words rendered from canvas type
//   heart         the parametric 3D pillow heart
//   sphere        calm fibonacci shell (the quiet backdrop behind a DOM panel)
//   leaf          filled leaf silhouette (also the fallback when an image is missing)
//   constellation node clusters wired by particle threads
//
// Images must be loaded before buildArc runs so sampling stays synchronous: call
// preloadBeatImages(beats) first and pass the result in as `images`.

import { WORLD } from "./util.js";
import { imageToPositions, loadImage } from "./emblem.js";
import { textToPositions } from "./text.js";
import {
  sphereToPositions, constellationToPositions, leafToPositions, heartToPositions,
} from "./shapes.js";

export { WORLD };

// THE LOCKUP IS SAMPLED SHARP, not like the rest of the arc. A logo read as confetti at
// the old settings: the source was resampled to 512px, every dot carried a jitter wider
// than the ring it belonged to, and the budget spread evenly over the ink so the outline
// starved. Here the source is read at 1024, jitter is off, dots are smaller, and half the
// budget goes to the silhouette.
const LOCKUP_SAMPLING = { maxSide: 1024, jitter: 0.0015, edgeShare: 0.7 };
const LOCKUP_DOT_SCALE = 0.65;   // 35 percent smaller than the arc's dots
// The wordmark in the brand's own two colours, sampled per dot like the mark.
const WORD_GREEN = '#12a05f';
// ☠️ THE SECOND WORD CANNOT BE ONE COLOUR IN BOTH REGISTERS. Printed, "Direct" is near
// black, and near black on the night sky is an invisible word: measured on the first
// build, it rendered as a hole where a word should be. So the ink follows the register,
// silver on night and near black on cream. The formation is sampled once at boot, so
// this reads the theme at build time; a visitor who toggles afterwards keeps the ink
// they loaded with until the next navigation, which is the honest cost of baking colour
// into a buffer.
const WORD_INK_LIGHT = '#0d1a14';
const WORD_INK_DARK = '#cfdad4';

const DEFAULT_LOCKUP = {
  wordRatio: 0.34,      // share of the cloud spent on the wordmark
  wordHalfW: 4.30,      // wordmark contain-box half-width
  wordBoxH: 2.85,
  wordCenterY: -1.78,   // seats the words below the mark, clear of it
  markBox: WORLD * 0.72,
  markY: WORLD * 0.44,  // lifts the mark so the DOM copy band breathes below
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontWeight: 700,
};

// A beat names its image either as `src` or as the first image in the content config's
// `media` array, so the JSON the pages consume (key, kind, media[]) drops straight in.
const IMAGE_FILE = /\.(png|jpe?g|webp|avif)(\?|$)/i;
export function beatImageSrc(beat) {
  if (!beat) return null;
  if (beat.src) return beat.src;
  if (Array.isArray(beat.media)) return beat.media.find((m) => typeof m === "string" && IMAGE_FILE.test(m)) || null;
  return null;
}

// The sources every image-backed beat needs, de-duplicated.
export function beatSources(beats) {
  return [...new Set(beats.map(beatImageSrc).filter(Boolean))];
}

// Load them all; a source that fails resolves to null so the arc still builds.
export async function preloadBeatImages(beats) {
  const images = {};
  await Promise.all(beatSources(beats).map(async (src) => {
    try {
      images[src] = await loadImage(src);
    } catch (e) {
      images[src] = null;
    }
  }));
  return images;
}

// One lockup: (1 - wordRatio) of the cloud sculpts the mark (lifted), the rest forms the
// wordmark, rendered crisp from canvas type and seated beneath via wordCenterY. The source
// PNG's own hairline lettering samples muddy at particle density, which is why the words
// are re-rendered rather than sampled.
function lockupPositions(N, img, beat) {
  const cfg = { ...DEFAULT_LOCKUP, ...(beat.lockup || {}) };
  const Kword = beat.text ? Math.floor(N * cfg.wordRatio) : 0;
  const Kmark = N - Kword;

  const mark = imageToPositions(Kmark, img, {
    ...LOCKUP_SAMPLING,
    ...sampleOpts(beat),
    boxW: cfg.markBox, boxH: cfg.markBox, yOffset: cfg.markY,
  });
  const out = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  out.set(mark.positions, 0);
  col.set(mark.colors, 0);
  if (!Kword) return { positions: out, colors: col };

  // The wordmark is drawn in the brand's two colours and then sampled, so the dots carry
  // them rather than being tinted afterwards. Splitting on the capital keeps the split
  // where the printed lockup puts it.
  const runs = beat.textRuns || splitWordmark(beat.text, beat.isDark);
  const word = textToPositions(Kword, runs, {
    fontWeight: cfg.fontWeight,
    fontFamily: cfg.fontFamily,
    boxW: cfg.wordHalfW, boxH: cfg.wordBoxH, threshold: 100, jitter: 0.0015,
  });
  for (let i = 0; i < Kword; i++) {
    const o = (Kmark + i) * 3;
    out[o] = word.positions[i * 3];
    out[o + 1] = word.positions[i * 3 + 1] + cfg.wordCenterY;
    out[o + 2] = word.positions[i * 3 + 2];
    col[o] = word.colors[i * 3];
    col[o + 1] = word.colors[i * 3 + 1];
    col[o + 2] = word.colors[i * 3 + 2];
  }
  return { positions: out, colors: col };
}

// "DentaSource Direct" carries green up to the last word and near black after it, which
// is how the printed mark reads. A name that does not split simply comes out green.
function splitWordmark(text, isDark) {
  const s = String(text || '');
  const ink = isDark ? WORD_INK_DARK : WORD_INK_LIGHT;
  const cut = s.lastIndexOf(' ');
  if (cut <= 0) return [{ text: s, color: WORD_GREEN }];
  return [
    { text: s.slice(0, cut + 1), color: WORD_GREEN },
    { text: s.slice(cut + 1), color: ink },
  ];
}

// Every sampler knob a beat may hand to imageToPositions, for image AND lockup beats
// alike. Unset keys are left off so the sampler's own defaults apply, which is what makes
// {mode:'dark'} and {mode:'dark', inkMax:0.8} both do the right thing.
const SAMPLE_KEYS = ["threshold", "inkMax", "inkMin", "maxSide", "jitter"];
function sampleOpts(beat) {
  const out = { crop: beat.crop || null, mode: beat.mode || "alpha" };
  for (const k of SAMPLE_KEYS) if (beat[k] !== undefined) out[k] = beat[k];
  return out;
}

// Every sampler is normalised to the same shape here: positions, optional per dot
// colours, and the point size scale this formation wants. `colors` being null is what
// tells the engine to use the uniform brand colour for that beat.
function sampleBeat(N, beat, images) {
  const r = positionsFor(N, beat, images);
  const kind = beat.kind || 'sphere';
  const scale = beat.dotScale ?? (kind === 'lockup' && r.colors ? LOCKUP_DOT_SCALE : 1);
  return ArrayBuffer.isView(r)
    ? { positions: r, colors: null, sizeScale: scale }
    : { positions: r.positions, colors: r.colors || null, sizeScale: scale };
}

function positionsFor(N, beat, images) {
  const src = beatImageSrc(beat);
  const img = src ? images[src] : null;
  switch (beat.kind) {
    case "lockup":
      return img
        ? lockupPositions(N, img, beat)
        : leafToPositions(N, { halfHeight: WORLD * 0.52, bow: 0.7, yOffset: WORLD * 0.42 });
    case "image":
      return img
        ? imageToPositions(N, img, {
            ...sampleOpts(beat),
            boxW: beat.boxW ?? WORLD * 0.84,
            boxH: beat.boxH ?? WORLD * 0.84,
            yOffset: beat.yOffset ?? 0,
            zBow: beat.zBow ?? 0,
          })
        : leafToPositions(N, { halfHeight: WORLD * 0.6, bow: 0.7, yOffset: beat.yOffset ?? 0 });
    case "text":
      return textToPositions(N, beat.text || "", beat.textOpts || {});
    case "heart":
      return heartToPositions(N, {
        size: beat.size ?? WORLD * 0.92,
        depth: beat.depth ?? WORLD * 0.34,
        yOffset: beat.yOffset ?? WORLD * 0.2,
      });
    case "leaf":
      return leafToPositions(N, {
        halfHeight: beat.halfHeight ?? WORLD * 0.66,
        bow: beat.bow ?? 0.9,
        yOffset: beat.yOffset ?? 0,
      });
    case "constellation":
      return constellationToPositions(N, {
        nodes: beat.nodes, edges: beat.edges,
      });
    case "sphere":
    default:
      return sphereToPositions(N, {
        radius: beat.radius ?? WORLD * 0.72,
        ripple: beat.ripple ?? 0.17,
      });
  }
}

export function buildArc(N, beats, { images = {} } = {}) {
  return beats.map((beat, i) => ({
    key: beat.key || `beat-${i}`,
    kind: beat.kind || "sphere",
    isText: beat.kind === "text",
    ...sampleBeat(N, beat, images),
  }));
}

// ── one beat at a time ──────────────────────────────────────────────────────
// buildArc above builds the whole arc in one go, which is what the engine used to do at
// boot and what put two seconds of scripting on the main thread before the first frame.
// A job builds ONE beat, and can be asked to do it in slices so no single task runs long
// enough to be a blocking task. Cheap kinds finish in one call; the heart, the only
// sampler that costs more than a frame, fills a slice per call.
const HEART_SLICE = 12000;

export function createBeatJob(N, beat, images = {}) {
  const kind = beat.kind || 'sphere';
  if (kind !== 'heart') {
    // measured at N=92000: sphere 4ms, constellation 8ms, and the image and text samplers
    // are bounded by their source pixels rather than by N. All finish inside one slice.
    return {
      isText: kind === 'text',
      done: false,
      colors: null,
      sizeScale: 1,
      work() {
        const r = sampleBeat(N, beat, images);
        this.positions = r.positions;
        this.colors = r.colors;
        this.sizeScale = r.sizeScale;
        this.done = true;
        return true;
      },
    };
  }
  const out = new Float32Array(N * 3);
  let cursor = 0;
  return {
    isText: false,
    done: false,
    positions: out,
    colors: null,          // the heart wears the uniform red, not a sampled colour
    sizeScale: 1,
    work() {
      const to = Math.min(N, cursor + HEART_SLICE);
      heartToPositions(N, {
        size: beat.size ?? WORLD * 0.92,
        depth: beat.depth ?? WORLD * 0.34,
        yOffset: beat.yOffset ?? WORLD * 0.2,
        out, from: cursor, to,
      });
      cursor = to;
      this.done = cursor >= N;
      return this.done;
    },
  };
}
