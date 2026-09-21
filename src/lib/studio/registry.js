// ── THE STUDIO'S MAP AND ITS FENCE ──────────────────────────────────────────
// Shared by the API routes and the UI, so the list of what is editable and the
// list of what is writable can never drift apart.
//
// ☠️ THIS FILE IS THE ONLY PLACE A PATH BECOMES LEGAL. Every write goes through
// isWritable(), which resolves the real path and checks it is inside one of
// three roots. A relative path, a symlink, a ../ climb or a a stray absolute
// path all fail the same way: 400, nothing written.

import path from 'node:path';

/** Repo root, derived from this file rather than from cwd, which a dev server
 *  and a route handler do not always agree about. */
export const REPO_ROOT = path.resolve(process.cwd());

/** The three roots the studio may write inside. Nothing else, ever. */
export const WRITE_ROOTS = [
  'src/data/cinema',
  'src/components/cinema-pages',
  'public/cinema/uploads',
];

/** Where the picker looks for existing media. Read-only. */
export const ASSET_ROOTS = [
  'public/cinema',
  'public/images/news',
  'public/images/products',
  'public/videos',
];

export const LOG_FILE = 'src/data/cinema/.studio-log';

/** Files that carry beats or media, in the order the rail shows them. `arc` is
 *  the tab; `collection` names the array (or object) the editor walks; `route`
 *  is where the beat can be previewed on the running site. A file that does not
 *  exist is listed anyway, greyed out with a reason: these manifests are being
 *  reshaped upstream while the studio is in use, and a silent omission would
 *  read as "the studio cannot do that" rather than "that file is not here yet". */
export const FILES = [
  { id: 'home', label: 'Home arc', arc: 'Arcs', path: 'src/data/cinema/home-beats.json', collection: 'beats', route: '/' },
  { id: 'about', label: 'About arc', arc: 'Arcs', path: 'src/components/cinema-pages/about-beats.json', collection: 'beats', route: '/about' },
  { id: 'contact', label: 'Contact arc', arc: 'Arcs', path: 'src/components/cinema-pages/contact-beats.json', collection: 'beats', route: '/contact' },
  { id: 'products', label: 'Product arcs', arc: 'Arcs', path: 'src/data/cinema/products.json', collection: 'products', route: null },
  { id: 'ask-dsd', label: 'Ask DSD script', arc: 'Arcs', path: 'src/data/cinema/ask-dsd.json', collection: 'exchanges', route: '/' },

  // ☠️ THESE NAMES MOVE. team-fun.json was deleted and its tiles folded into
  // action-reels.json (b116455); marbles-reels.json was replaced by reel-library.json and
  // its row removed with the file. So the rail SHOWS an absent manifest greyed out rather
  // than hiding it, and the collection below is a PREFERENCE rather than a
  // requirement: the files route falls back to detecting the array itself. A
  // manifest that changes its collection key, or arrives before this list is
  // updated, still opens.
  { id: 'action-reels', label: 'See us in action', arc: 'Media', path: 'src/data/cinema/action-reels.json', collection: 'items', route: '/' },
  { id: 'installs', label: 'Installs strip', arc: 'Media', path: 'src/data/cinema/installs.json', collection: 'tiles', route: '/' },
  { id: 'crew-shots', label: 'Crew shots', arc: 'Media', path: 'src/data/cinema/crew-shots.json', collection: 'items', route: '/' },
  { id: 'growth-partner', label: 'Growth partner', arc: 'Media', path: 'src/data/cinema/growth-partner.json', collection: 'items', route: '/' },
  { id: 'reel-library', label: 'Reel library', arc: 'Media', path: 'src/data/cinema/reel-library.json', collection: 'items', route: '/' },
  { id: 'training-media', label: 'Training center', arc: 'Media', path: 'src/data/cinema/training-media.json', collection: 'items', route: '/' },
  { id: 'parts', label: 'Spare parts', arc: 'Media', path: 'src/data/cinema/parts.json', collection: 'parts', route: '/' },
];

/** Keys that may hold an array of items, most specific first. Used when a
 *  registry entry's named collection is not in the file, which happens every
 *  time a manifest is reshaped upstream. */
export const COLLECTION_CANDIDATES = ['items', 'tiles', 'reels', 'beats', 'products', 'parts', 'exchanges'];

/** The collection this document actually carries. */
export function detectCollection(data, preferred) {
  if (data && Array.isArray(data[preferred])) return preferred;
  if (data && data[preferred] && typeof data[preferred] === 'object') return preferred;
  if (!data || typeof data !== 'object') return preferred;
  for (const k of COLLECTION_CANDIDATES) if (Array.isArray(data[k])) return k;
  const any = Object.keys(data).find((k) => Array.isArray(data[k]) && data[k].length && typeof data[k][0] === 'object');
  return any || preferred;
}

/** ☠️ NEVER EDITABLE AS COPY. meta_caption is generated alongside a reel and is
 *  not a sentence anybody should retype; width, height and the source URL are
 *  measurements. They are shown, so the editor can see them, and locked. */
export const READ_ONLY_FIELDS = new Set([
  'meta_caption', 'width', 'height', 'source_url', 'duration', 'date', 'id', 'type', 'category',
]);


/** True only for a path that resolves inside one of the write roots. */
export function isWritable(relPath) {
  if (typeof relPath !== 'string' || !relPath.length) return false;
  if (relPath.includes('\0')) return false;
  const abs = path.resolve(REPO_ROOT, relPath);
  return WRITE_ROOTS.some((root) => {
    const rootAbs = path.resolve(REPO_ROOT, root);
    return abs === rootAbs || abs.startsWith(rootAbs + path.sep);
  });
}

/** True for a path the picker may read. */
export function isReadableAsset(relPath) {
  if (typeof relPath !== 'string' || !relPath.length) return false;
  const abs = path.resolve(REPO_ROOT, relPath);
  return ASSET_ROOTS.some((root) => {
    const rootAbs = path.resolve(REPO_ROOT, root);
    return abs === rootAbs || abs.startsWith(rootAbs + path.sep);
  });
}

export function absolute(relPath) {
  return path.resolve(REPO_ROOT, relPath);
}

/** The studio is a development tool and must not exist in production. Every
 *  route handler and the page itself ask this first. */
export function studioDisabled() {
  return process.env.NODE_ENV === 'production';
}

// ── ✍️ THE EDITORIAL RED LINES ──────────────────────────────────────────────
// House rules for public copy on this domain, flagged as you type rather than
// caught on the preview. They WARN, they never block: the writer is the editor,
// and a rule that refuses to save is a rule people work around.
const RED_LINES = [
  { id: 'dash', label: 'a dash', test: /[—–]|(?:^|\s)-(?:\s|$)/, why: 'House rule: periods and commas, never dashes.' },
  { id: 'bang', label: 'an exclamation mark', test: /!/, why: 'The voice is calm. Let the sentence carry it.' },
  { id: 'factory', label: '"factory"', test: /\bfactor(?:y|ies)\b/i, why: 'We are the distributor, not the factory.' },
  { id: 'number-one', label: '"#1"', test: /#\s?1\b/, why: 'No superlative claims we cannot evidence.' },
  { id: 'price', label: 'a price', test: /[₱$]\s?\d|\bpeso\b/i, why: 'Price travels with the quote, never with a page.' },
];

/** Every red line a string trips, as {id,label,why}. Empty means clean. */
export function redLines(text) {
  if (typeof text !== 'string' || !text) return [];
  return RED_LINES.filter((r) => r.test.test(text)).map(({ id, label, why }) => ({ id, label, why }));
}

/** Media-ish keys, so the UI knows a string is a file rather than a sentence. */
export const MEDIA_KEYS = new Set(['src', 'poster', 'heroImage', 'image', 'video', 'thumb']);
export const MEDIA_ARRAY_KEYS = new Set(['media', 'tiles', 'reels', 'items', 'images']);

/** The filename, which is what a stripUnsafe map is keyed by: the same photo
 *  lives under several article folders, so a full path would miss it. */
export function basename(p) {
  return typeof p === 'string' ? p.split('?')[0].split('/').pop() : '';
}

/** ☠️ THE COVER FLOOR, ONE NAMED NUMBER. Ruled down from a hard 2.0 on
 *  2026-09-06 and kept in a constant on purpose: Jarich can push it back.
 *
 *  2.0 was the retina ideal and it banned most of the site's own footage. What
 *  Facebook and FFC serve natively is 720 wide, which on the 384x288 mixed tile
 *  is 1.875 — a six percent shortfall nobody can see — while the 360 wide crest
 *  frames, the ones that genuinely look soft, sit at 0.94 and still fail. */
export const COVER_MIN = 1.75;

/** ☠️ AND A LIST CAN SET ITS OWN FLOOR. `"coverMin": 1.0` on the manifest, for a
 *  surface where the default is the wrong bar rather than a lenient one: the
 *  marbles render inside glass, which forgives a 1.5x source that a flat strip
 *  shows up, and Facebook's ceiling is 720 on the short side so 1.75 would empty
 *  the library. Absent means the house floor above. */
export function floorFor(tile) {
  const own = Number(tile?.coverMin);
  return Number.isFinite(own) && own > 0 ? own : COVER_MIN;
}

/** A floor as people write it: 1 is a ratio, "1x" reads like a typo next to
 *  "1.75x", so an integer floor keeps its decimal. */
export function floorText(floor) {
  return Number.isInteger(floor) ? floor.toFixed(1) : String(floor);
}

/** ☠️ A LIST RENDERS A TILE PER KIND, and judging by the wrong one is the same
 *  failure as the crew row. In the mixed track a clip gets `aspect-ratio: 9/16`
 *  and a still `4/3` at a shared height, so the boxes are 162x288 and 384x288
 *  (builder-home, measured off the rendered element at ed8160c, not read out of
 *  the stylesheet). A 404x720 reel fills its own tile at 2.49 and the picture
 *  tile at 1.05, so one tile size cannot describe a mixed list.
 *
 *  ☠️ AND null IS NOT THE SAME AS ABSENT. Ruled 2026-09-06, because absence of a
 *  key cannot tell "not applicable" from "not measured" and the studio was about
 *  to read both as the same permission:
 *
 *      "tileVideoPx": null   the list carries no video. Refuse every clip.
 *      key absent            nobody has measured it. Bar nothing, say so.
 *
 *  The same for the picture keys. This is the stripUnsafe proxy again in
 *  miniature: a missing key is not a statement, and the fix is for the data to
 *  make one.
 *
 *  ☠️ AND NOT EVERY TILE CROPS. `.dsd-part-img` is `object-fit: contain`
 *  (home-cinema.css:547): the file is fitted INSIDE the box, scaled by
 *  min(tileW/w, tileH/h), so the pixels it has per rendered css px are
 *  max(w/tileW, h/tileH) — the opposite extreme from cover. A manifest whose
 *  tiles contain says `"tileFit": "contain"`; the default is cover.
 *
 *  @returns {{w, h, square}} a box | {excluded: true} | null when unmeasured
 */
function boxFor(tile, kind) {
  const wKey = kind === 'video' ? 'tileVideoPx' : 'tilePx';
  const hKey = kind === 'video' ? 'tileVideoHeightPx' : 'tileHeightPx';
  if (!tile || !(wKey in tile)) return null; // not measured: no opinion
  if (tile[wKey] === null) return { excluded: true }; // declared: carries none of this kind
  const w = Number(tile[wKey]);
  if (!Number.isFinite(w) || w <= 0) return null;
  const h = Number(tile[hKey]);
  const known = Number.isFinite(h) && h > 0;
  return { w, h: known ? h : w, square: !known };
}

/** How many of the file's own pixels land on each css pixel of that tile once
 *  the browser has fitted it. Cover crops, so the smaller ratio decides; contain
 *  letterboxes, so the larger one does. A tile with a width and no height is
 *  judged square, which under cover makes this min(w,h)/tileW — the short side
 *  form, conservative for a wide landscape source. */
export function coverRatio(tile, dims, kind = 'image') {
  const box = boxFor(tile, kind);
  if (!box || box.excluded) return null;
  if (!dims?.width || !dims?.height) return null; // unmeasurable: no opinion
  const byWidth = dims.width / box.w;
  const byHeight = dims.height / box.h;
  return tile?.tileFit === 'contain' ? Math.max(byWidth, byHeight) : Math.min(byWidth, byHeight);
}

/** ☠️ THE ONE TEST, SHARED BY THE SERVER, THE BROWSER AND THE GENERATORS.
 *  builder-products ships the identical arithmetic in the media pipelines
 *  (5ccf5af): the ratio above, barred below COVER_MIN. A file the studio bars
 *  has to be the file the generator bars, or the code and the data disagree
 *  about the same photograph.
 *
 *  This lives in registry.js rather than unsafe.js because unsafe.js reaches the
 *  filesystem and the picker runs in the browser.
 *
 *  @param tile  what the list renders: tilePx, tileHeightPx, tileVideoPx,
 *               tileVideoHeightPx, tileFit. A null value is a declaration; a
 *               missing key is not.
 *  @param dims  {{width: number, height: number}|null} the file, measured
 *  @param kind  'video' or 'image'
 *  @returns a reason string when the file cannot go in this list, else null
 */
export function softnessReason(tile, dims, kind = 'image') {
  const box = boxFor(tile, kind);
  if (!box) return null; // unmeasured: never bar on an absence
  if (box.excluded) {
    return kind === 'video'
      ? 'this list takes images only, it renders no video tile'
      : 'this list takes video only, it renders no picture tile';
  }
  const floor = floorFor(tile);
  const ratio = coverRatio(tile, dims, kind);
  if (ratio === null || ratio >= floor) return null;
  const named = box.square ? `${box.w} px wide` : `${box.w}x${box.h}`;
  const what = kind === 'video' ? 'clip' : 'picture';
  const fits = tile?.tileFit === 'contain' ? 'fits inside' : 'fills';
  return `a ${what} of ${dims.width}x${dims.height} ${fits} a ${named} tile at ${ratio.toFixed(2)}x, under this list's ${floorText(floor)}x floor`;
}

/** What this list says about a kind, for a label: 'measured', 'none' when the
 *  key is an explicit null, or 'unmeasured' when it is simply not there. */
export function tileState(tile, kind = 'image') {
  const box = boxFor(tile, kind);
  if (!box) return 'unmeasured';
  return box.excluded ? 'none' : 'measured';
}

/** ☠️ FILES A GENERATOR FOUND TOO SMALL FOR SOMEWHERE, AND WHY.
 *  A manifest may carry `stripUnsafe`: { "<filename>": "<reason>" }. These are
 *  photographs removed from that strip on purpose: 360px sources that read soft
 *  at tile size. They are not swapped and not upscaled, because each one's alt
 *  text describes that exact scene and repointing the file would caption one
 *  event with a picture of another. They stay in their articles, where 360 wide
 *  is right.
 *
 *  ☠️ THIS MAP IS DOCUMENTATION AND DECIDES NOTHING (ruled 2026-09-06, after it
 *  decided things twice and was wrong both times). What a list may carry is
 *  arithmetic, in ./unsafe.js, on the `tilePx` it declares and the width of the
 *  file in hand:
 *
 *      a list bars a file when   fileWidth  <  tilePx * 2
 *
 *  measured off the file rather than trusted from the data. So a photograph
 *  nobody flagged is still refused where it would be soft, a flagged one is
 *  offered where it is fine, and a list that declares no tilePx bars nothing
 *  and says so on screen. */
export function stripUnsafeOf(doc) {
  const m = doc && typeof doc === 'object' ? doc.stripUnsafe : null;
  return m && typeof m === 'object' ? m : null;
}

export function isVideoPath(p) {
  return typeof p === 'string' && /\.(mp4|webm|mov|m4v)(\?|$)/i.test(p);
}
export function isImagePath(p) {
  return typeof p === 'string' && /\.(png|jpe?g|webp|avif|gif|svg)(\?|$)/i.test(p);
}
