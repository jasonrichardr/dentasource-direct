// lib/cinema/media.js — the one place a media path becomes a URL.
//
// Jarich ruled on 2026-09-06 that all video moves to DSD-owned storage on the VPS, so the
// site repo goes back to being a code repo. research/vps-as-media-storage-2026-09-06.md
// carries the reasoning; the short version is that git keeps every version of every file
// forever, so two gigabytes of reels would have become four and every clone and every
// deploy would carry them.
//
// The manifests are NOT rewritten. They keep their repo-relative paths, which keeps them
// portable and keeps this the only thing that moves: when the DNS record lands and the
// base changes from the hostname to media.dentasourcedirect.com, that is one env value,
// not a search across components.
//
//   NEXT_PUBLIC_MEDIA_BASE=https://srv1376990.hstgr.cloud/dsd-media   (today)
//   NEXT_PUBLIC_MEDIA_BASE=https://media.dentasourcedirect.com       (once DNS lands)
//
// ☠️ WITH THE VARIABLE UNSET THIS MUST BE A NO-OP. Every path returns exactly itself, so
// an unconfigured build, a local checkout and a preview without the env behave precisely
// as they do today. That is provable rather than assumed: the request list with the env
// unset has to be identical to the request list before this file existed.
//
// ☠️ VIDEO ONLY. Posters and images stay in the repo on purpose. If the VPS is ever
// unreachable a bead shows its poster still rather than a black hole, and the page degrades
// instead of breaking. Audio stays too: FFC's lounge player streams the track from the DSD
// domain, and moving it would silence their page.

/** The four trees that moved to the media origin. Everything else is served by the app. */
const MEDIA_PREFIXES = ['/cinema/reels/', '/cinema/growth/', '/reels/', '/videos/'];

// ☠️ THE PREFIX ALONE IS NOT ENOUGH, BECAUSE POSTERS SHARE THE VIDEOS' FOLDER.
// /cinema/reels/wall-01.mp4 moved; /cinema/reels/wall-01.jpg did NOT, and it sits right
// beside it. A resolver that routes on the directory would send every poster to the media
// origin too, which is exactly the thing that must not happen: the poster is what makes an
// unreachable origin degrade to a still image instead of a black hole. Caught by asserting
// the resolver's own output rather than by reading the call sites, which happen to pass
// only video today and are one careless edit from not doing.
const VIDEO_EXT = /\.(mp4|m4v|webm|mov)(\?|#|$)/i;

/** Trailing slash trimmed so a base written either way behaves the same. */
const BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE || '').replace(/\/+$/, '');

/**
 * Turn a repo-relative media path into a URL on whatever origin serves it.
 *
 * Anything that is not a rooted path under one of the moved trees comes back untouched:
 * an absolute URL, a data: uri, a poster, an empty value. That tolerance is deliberate,
 * because these paths come out of hand-edited JSON and the callers pass whatever the
 * manifest holds.
 */
export function mediaUrl(path) {
  if (!BASE || typeof path !== 'string' || !path.startsWith('/')) return path;
  if (!VIDEO_EXT.test(path)) return path;
  return MEDIA_PREFIXES.some((p) => path.startsWith(p)) ? `${BASE}${path}` : path;
}

/** True when a path is one this resolver would move. Used by the proof harness. */
export function isMediaPath(path) {
  return typeof path === 'string' && VIDEO_EXT.test(path)
    && MEDIA_PREFIXES.some((p) => path.startsWith(p));
}

/** Where media is being served from right now, or '' for same-origin. Diagnostics only. */
export const MEDIA_BASE = BASE;
