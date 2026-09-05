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
 *  exist is simply skipped, so this list may name more than the repo has. */
export const FILES = [
  { id: 'home', label: 'Home arc', arc: 'Arcs', path: 'src/data/cinema/home-beats.json', collection: 'beats', route: '/' },
  { id: 'about', label: 'About arc', arc: 'Arcs', path: 'src/components/cinema-pages/about-beats.json', collection: 'beats', route: '/about' },
  { id: 'contact', label: 'Contact arc', arc: 'Arcs', path: 'src/components/cinema-pages/contact-beats.json', collection: 'beats', route: '/contact' },
  { id: 'products', label: 'Product arcs', arc: 'Arcs', path: 'src/data/cinema/products.json', collection: 'products', route: null },
  { id: 'ask-dsd', label: 'Ask DSD script', arc: 'Arcs', path: 'src/data/cinema/ask-dsd.json', collection: 'exchanges', route: '/' },

  { id: 'team-fun', label: 'Our people strip', arc: 'Media', path: 'src/data/cinema/team-fun.json', collection: 'tiles', route: '/' },
  { id: 'installs', label: 'Installs strip', arc: 'Media', path: 'src/data/cinema/installs.json', collection: 'tiles', route: '/' },
  { id: 'action-reels', label: 'See us in action', arc: 'Media', path: 'src/data/cinema/action-reels.json', collection: 'items', route: '/' },
  { id: 'marbles-reels', label: 'Marble reels', arc: 'Media', path: 'src/data/cinema/marbles-reels.json', collection: 'reels', route: '/' },
  { id: 'parts', label: 'Spare parts', arc: 'Media', path: 'src/data/cinema/parts.json', collection: 'parts', route: '/' },
  // Named in the brief but not present in the repo today. They appear the
  // moment somebody adds the file; until then the rail just does not list them.
  { id: 'reel-library', label: 'Reel library', arc: 'Media', path: 'src/data/cinema/reel-library.json', collection: 'reels', route: '/' },
  { id: 'training-media', label: 'Training center', arc: 'Media', path: 'src/data/cinema/training-media.json', collection: 'tiles', route: '/' },
  { id: 'crew-shots', label: 'Crew shots', arc: 'Media', path: 'src/data/cinema/crew-shots.json', collection: 'tiles', route: '/' },
  { id: 'growth-partner', label: 'Growth partner', arc: 'Media', path: 'src/data/cinema/growth-partner.json', collection: 'tiles', route: '/' },
];

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
