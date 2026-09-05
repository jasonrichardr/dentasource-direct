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

  const markPos = imageToPositions(Kmark, img, {
    ...sampleOpts(beat),
    boxW: cfg.markBox, boxH: cfg.markBox, yOffset: cfg.markY,
  });
  const out = new Float32Array(N * 3);
  out.set(markPos, 0);
  if (!Kword) return out;

  const wordPos = textToPositions(Kword, beat.text, {
    fontWeight: cfg.fontWeight,
    fontFamily: cfg.fontFamily,
    boxW: cfg.wordHalfW, boxH: cfg.wordBoxH, threshold: 100, jitter: 0.013,
  });
  for (let i = 0; i < Kword; i++) {
    out[(Kmark + i) * 3 + 0] = wordPos[i * 3 + 0];
    out[(Kmark + i) * 3 + 1] = wordPos[i * 3 + 1] + cfg.wordCenterY;
    out[(Kmark + i) * 3 + 2] = wordPos[i * 3 + 2];
  }
  return out;
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
    positions: positionsFor(N, beat, images),
  }));
}
