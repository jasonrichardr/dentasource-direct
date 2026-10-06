// lib/cinema/wwwManifest.js — the home page's read of the console's WWW strips.
//
// Jarich, 2026-10-01: "give us access all to our website in our console.dentasourcedirect.com.
// name it WWW". Every staff seat arranges the home-page strips (six since 2026-10-06) from the console; they live
// in the console's Convex (energized-puma-161) and are published as a tiny public manifest.
// This file is the ONLY place the site reads it, ON THE SERVER, once per page rebuild (ISR 60 s),
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

import http from 'node:http';
import https from 'node:https';

const DEFAULT_URL = 'https://energized-puma-161.convex.site/www/manifest';
export const WWW_STORAGE_ORIGIN = 'https://energized-puma-161.convex.cloud/api/storage/';
// `heart` (Chairs in service) joined on 2026-10-06 with the moon editor. A manifest from a
// console that has not got it yet simply has no heart deck, and the beat plays its baked list.
const DECKS = ['people', 'showroom', 'training', 'nationwide', 'crew', 'heart'];

// A strip's timing: a multiplier on the measured marquee speed (src/lib/cinema/marquee.js),
// clamped to the same 0.5 to 2 the console enforces. Anything else is "the default".
const SPEED_MIN = 0.5;
const SPEED_MAX = 2;
const TIMEOUT_MS = 4000;
const MAX_BYTES = 2 * 1024 * 1024;

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

/**
 * The per-strip speeds, sanitised: only known decks, only finite numbers, clamped, and only
 * the ones that differ from 1 (absent means the measured default, so the page's markup for
 * a strip at the default is exactly what it was before speeds existed).
 */
export function sanitizeWwwSpeeds(speeds) {
  const out = {};
  if (!speeds || typeof speeds !== 'object') return out;
  for (const deck of DECKS) {
    const v = speeds[deck];
    if (typeof v !== 'number' || !Number.isFinite(v)) continue;
    const c = Math.min(SPEED_MAX, Math.max(SPEED_MIN, v));
    if (c !== 1) out[deck] = c;
  }
  return out;
}

/**
 * GET a small JSON body WITHOUT Next's fetch cache.
 *
 * ☠️ WHY NOT fetch(). Two ways were tried and both were wrong (2026-10-01 review):
 *   fetch(url, { next: { revalidate: 60 } })  a data cache of its own, served STALE while
 *       it refreshes, stacked on the page's own 60 s: a console change could take two
 *       cycles, up to two minutes, to reach the page.
 *   fetch(url, { cache: 'no-store' })  measured: it turns `/` from ISR (○, Revalidate 1m)
 *       into ƒ Dynamic, so EVERY page view is server-rendered and calls Convex.
 * Node's own https client is not patched by Next, so it is read like a database call:
 * fresh on every page rebuild and never on a visitor's request. page.js's `revalidate = 60`
 * is then the only clock, and a change is live within one cycle.
 */
function getJson(url, timeoutMs, maxBytes) {
  return new Promise((resolveOnce) => {
    // one answer, and a hard deadline on the WHOLE read (the socket timeout is only idle time)
    let req;
    const timer = setTimeout(() => { if (req) req.destroy(); resolveOnce(null); }, timeoutMs);
    const resolve = (v) => { clearTimeout(timer); resolveOnce(v); };
    let lib;
    try { lib = new URL(url).protocol === 'http:' ? http : https; } catch { resolve(null); return; }
    req = lib.get(url, { timeout: timeoutMs, headers: { accept: 'application/json' } }, (res) => {
      // no redirects, no other status: anything but a straight 200 is "no WWW decks"
      if (res.statusCode !== 200) { res.resume(); resolve(null); return; }
      let size = 0;
      const chunks = [];
      res.on('data', (c) => {
        size += c.length;
        if (size > maxBytes) { req.destroy(); resolve(null); return; }
        chunks.push(c);
      });
      res.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); } catch { resolve(null); }
      });
      res.on('error', () => resolve(null));
    });
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.on('error', () => resolve(null));
  });
}

/**
 * Fetch the console's WWW decks and their timings. Never throws; empty objects mean "every
 * strip plays its baked list at the measured speed".
 */
export async function readWww() {
  const url = process.env.WWW_MANIFEST_URL || DEFAULT_URL;
  if (url === 'off') return { decks: {}, speeds: {} };
  const body = await getJson(url, TIMEOUT_MS, MAX_BYTES);
  return { decks: sanitizeWwwDecks(body && body.decks), speeds: sanitizeWwwSpeeds(body && body.speeds) };
}

/** The decks alone (the shape page.js read before timings existed). */
export async function readWwwDecks() {
  return (await readWww()).decks;
}
