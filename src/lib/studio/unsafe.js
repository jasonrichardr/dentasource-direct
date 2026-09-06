// ── WHICH FILES A LIST CANNOT CARRY, MEASURED RATHER THAN GUESSED ───────────
//
// ☠️ THIS REPLACES A PROXY THAT BIT. The first version treated "declares a
// stripUnsafe map" as meaning "tiles here are big", and barred every declaring
// list from every barred file. builder-home applied the rule back across the
// surfaces they render and found the exception (2026-09-06):
//
//   action-reels, installs, training-media, growth-partner   384 css px tiles
//   crew-shots        the parts beat's THIRD row, .dsd-crew-shot   126 css px
//   parts             the parts beat's first two rows                56 css px
//
// crew-shots was under the union and should not have been. Its row needs 252
// device px at DPR 2; the five barred photographs are 360x640, so 360 against
// 252 is comfortably sufficient. Two documentary photographs had been taken out
// of a row where they were never soft, and the union then refused the other
// three. The old comment justifying the union even said the three "would be
// exactly as soft" in crew-shots, which was true of the four 384px strips and
// false of the only manifest it named.
//
// So the rule is now arithmetic on two numbers, with no exceptions to remember:
//
//     a list bars a file when   tilePx * 2  >  the file's short side
//
// tilePx is what the manifest declares it renders at. The short side is
// MEASURED off the file on disk, not copied into the data, because a number
// copied into JSON is a claim about a file and this is the file itself. DPR 2
// is the retina case; a 1x screen is covered by the same bar.
//
// The short side rather than the long one, because a tile crops to fill: a
// 360x640 portrait in a 126x84 landscape tile is limited by its 360, not its
// 640. Being wrong in this direction bans a photograph from somewhere it works,
// which is the failure this file exists to stop.

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { ASSET_ROOTS, FILES, absolute, basename, stripUnsafeOf } from './registry';

/** DPR the tile budget is computed against. */
export const TARGET_DPR = 2;

const dimsCache = new Map(); // basename -> short side in px, or null
let indexed = null; // basename -> absolute path

async function walk(dir, out, depth = 0) {
  if (depth > 6) return;
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, out, depth + 1);
    else if (!out.has(e.name)) out.set(e.name, full);
  }
}

/** basename -> a path on disk. The same photograph lives under several article
 *  folders; any copy of it has the same pixels, so the first is enough. */
async function assetIndex() {
  if (indexed) return indexed;
  const found = new Map();
  for (const r of ASSET_ROOTS) await walk(absolute(r), found);
  indexed = found;
  return found;
}

/** The file's short side, measured. null when it cannot be determined, which is
 *  treated as "cannot prove it is big enough" and therefore barred. */
export async function shortSideOf(name) {
  const key = basename(name);
  if (dimsCache.has(key)) return dimsCache.get(key);
  let value = null;
  try {
    const idx = await assetIndex();
    const file = idx.get(key);
    if (file) {
      const sharp = (await import('sharp')).default;
      const m = await sharp(file).metadata();
      if (m.width && m.height) value = Math.min(m.width, m.height);
    }
  } catch {
    value = null; // no sharp, or an unreadable file: stay conservative
  }
  dimsCache.set(key, value);
  return value;
}

/**
 * Read every manifest once and work out what each may not carry.
 *
 * @returns {{ union: object, byPath: object }}
 *   union   basename -> { reason, shortSide, declaredBy }
 *   byPath  manifest path -> { declares, tilePx, needPx, blocked: {name: reason} }
 */
export async function computeUnsafe() {
  const union = {};
  const docs = [];

  for (const f of FILES) {
    let data;
    try {
      data = JSON.parse(await readFile(absolute(f.path), 'utf8'));
    } catch {
      continue;
    }
    docs.push({ f, data });
    const map = stripUnsafeOf(data);
    if (!map) continue;
    for (const [name, reason] of Object.entries(map)) {
      if (!union[name]) union[name] = { reason, declaredBy: f.id };
    }
  }

  for (const name of Object.keys(union)) {
    union[name].shortSide = await shortSideOf(name);
  }

  const byPath = {};
  for (const { f, data } of docs) {
    const declares = !!stripUnsafeOf(data);
    const tilePx = Number(data?.tilePx);
    const hasTile = Number.isFinite(tilePx) && tilePx > 0;
    const needPx = hasTile ? tilePx * TARGET_DPR : null;
    const blocked = {};

    if (declares) {
      for (const [name, info] of Object.entries(union)) {
        // ☠️ AN UNDECLARED TILE SIZE STAYS CONSERVATIVE. Without a number there
        // is no way to know the tiles are small, and under-barring is the
        // failure that ships a soft photograph. The studio says which lists are
        // in this state so it is a visible gap rather than a silent default.
        if (!hasTile) {
          blocked[name] = info.reason;
          continue;
        }
        // unknown dimensions: cannot prove the file is big enough, so bar it
        if (info.shortSide == null || needPx > info.shortSide) blocked[name] = info.reason;
      }
    }
    byPath[f.path] = { declares, tilePx: hasTile ? tilePx : null, needPx, blocked };
  }

  return { union, byPath };
}
