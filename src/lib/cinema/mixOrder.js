// lib/cinema/mixOrder.js — the mixed marquee's order rule. Pure, no React, no imports, so
// the home arc (panels.jsx re-exports it) and scripts/www-seed.mjs read the SAME function.

/**
 * The mixed marquee's order rule, and it lives HERE (moved out of panels.jsx
 * verbatim on 2026-10-01, so the WWW seed script can apply the same rule outside React)
 * rather than baked into a manifest.
 *
 * It used to be action-reels.json's own decision: the file shipped its items already
 * interleaved and this component rendered them in file order. That worked while one file
 * fed one beat. The training beat's strip is merged in code from two manifests, so no
 * single file can decide the interleave for it, and two different ordering rules for the
 * same marquee is how they drift apart.
 *
 * ☠️ SPACED EVENLY, NOT ALTERNATED. Strict image, video, image alternation is right at a
 * dozen items and wrong at thirty: it spends every clip in the first third and leaves a
 * long silent tail. Opening on a video and spreading the rest across the whole run keeps
 * something moving from the first tile to the last, whatever the ratio happens to be.
 */
export function mixOrder(items) {
  const vids = items.filter((i) => i.type === 'video');
  const rest = items.filter((i) => i.type !== 'video');
  if (!vids.length) return rest;
  const n = vids.length + rest.length;
  const out = new Array(n).fill(null);
  vids.forEach((v, k) => { out[Math.round((k * n) / vids.length)] = v; });
  let r = 0;
  for (let i = 0; i < n; i += 1) if (!out[i]) { out[i] = rest[r]; r += 1; }
  return out.filter(Boolean);
}
