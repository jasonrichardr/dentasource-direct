// lib/cinema/wwwManifest.js — the home page's read of the console's WWW strips.
//
// Jarich, 2026-10-01: "give us access all to our website in our console.dentasourcedirect.com.
// name it WWW". Every staff seat arranges five home-page strips from the console; they live
// in the console's Convex (energized-puma-161) and are published as a tiny public manifest.
// This file is the ONLY place the site reads it, ON THE SERVER, cached for 60 seconds (ISR),
// so a change in the console is on the page in about a minute and no visitor's browser
// ever talks to Convex.
//
// ☠️ IT CAN NEVER BREAK THE PAGE. A timeout, a 500, a body that is not JSON, a deck that is
// not an array, a tile from a host next/image does not know: each one degrades to "no WWW
// deck" for that strip, and HomeCinema then plays its baked list exactly as before.
//
// ☠️ THE HOST ALLOWLIST IS NOT OPTIONAL. next/image THROWS on a remote host missing from
// images.remotePatterns, and a throw inside a client panel takes the whole arc down with it.
// So a still must be a site path or a file in the console's Convex storage (which is in
// next.config.mjs), and a video or a poster must be a site path. Anything else is dropped
// here, before it can reach a component.
//
//   WWW_MANIFEST_URL   server-only override (a local mock for proofs, or 'off'); unset in
//                      production, where the default below is the live manifest.

const DEFAULT_URL = 'https://energized-puma-161.convex.site/www/manifest';
export const WWW_STORAGE_ORIGIN = 'https://energized-puma-161.convex.cloud/api/storage/';
const DECKS = ['people', 'showroom', 'training', 'nationwide', 'crew'];
const TIMEOUT_MS = 4000;

const sitePath = (s) => typeof s === 'string' && s.startsWith('/') && !s.startsWith('//');
const num = (n) => (typeof n === 'number' && Number.isFinite(n) && n > 0 ? n : undefined);

/** One tile, kept only if every field a panel reads is safe; otherwise null. */
function cleanTile(t, deck) {
  if (!t || typeof t !== 'object') return null;
  const type = t.type === 'video' ? 'video' : t.type === 'image' ? 'image' : null;
  if (!type) return null;
  if (deck === 'crew' && type !== 'image') return null;
  const src = typeof t.src === 'string' ? t.src : '';
  if (type === 'video' ? !sitePath(src) : !(sitePath(src) || src.startsWith(WWW_STORAGE_ORIGIN))) return null;
  const out = {
    id: String(t.id || src),
    type,
    src,
    alt: typeof t.alt === 'string' ? t.alt.slice(0, 200) : '',
    w: num(t.w) || (type === 'video' ? 9 : 4),
    h: num(t.h) || (type === 'video' ? 16 : 3),
  };
  if (sitePath(t.poster)) out.poster = t.poster;
  if (num(t.playTo)) out.playTo = t.playTo;
  return out;
}

/** The decks object, sanitised: only known decks, only safe tiles, only non-empty decks. */
export function sanitizeWwwDecks(decks) {
  const out = {};
  if (!decks || typeof decks !== 'object') return out;
  for (const deck of DECKS) {
    if (!Array.isArray(decks[deck])) continue;
    const tiles = decks[deck].map((t) => cleanTile(t, deck)).filter(Boolean);
    if (tiles.length) out[deck] = tiles;
  }
  return out;
}

/** Fetch the console's WWW decks. Never throws; `{}` means "every strip plays its baked list". */
export async function readWwwDecks() {
  const url = process.env.WWW_MANIFEST_URL || DEFAULT_URL;
  if (url === 'off') return {};
  try {
    const res = await fetch(url, { next: { revalidate: 60 }, signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) return {};
    const body = await res.json();
    return sanitizeWwwDecks(body && body.decks);
  } catch {
    return {};
  }
}
