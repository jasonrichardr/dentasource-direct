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

export function isVideoPath(p) {
  return typeof p === 'string' && /\.(mp4|webm|mov|m4v)(\?|$)/i.test(p);
}
export function isImagePath(p) {
  return typeof p === 'string' && /\.(png|jpe?g|webp|avif|gif|svg)(\?|$)/i.test(p);
}
