// ── WHETHER A LIST CAN CARRY A FILE, DECIDED BY SIZE ────────────────────────
//
// ☠️ THIS FILE HAS BEEN WRONG TWICE. Both times the same way: a category
// standing in for a measurement.
//
//   v1  "declares a stripUnsafe map" was read as "tiles here are big", and
//       every declaring list was barred from every flagged file. crew-shots
//       renders 126px tiles and was refusing 360px photographs it displays
//       perfectly well (builder-home, 2026-09-06).
//   v2  the comparison was tilePx * 2 against the file's SHORT side. Right for
//       the portrait sources in hand, wrong in principle: the tiles are 4:3
//       with object-fit cover and the sources are 360x640 portrait, so it is
//       the WIDTH that gets scaled to fill and the width that goes soft.
//
// The rule, ruled by team-lead and measured by builder-home (d74a964):
//
//     a list bars a file when   fileWidth  <  tilePx * 2
//
// tilePx is the largest css width the list renders a tile at, declared by the
// manifest. DPR 2 is the retina case. The width is MEASURED off the file on
// disk, because a number copied into JSON is a claim about a photograph and
// this is the photograph; a width declared in a manifest row is used only when
// the file itself cannot be read.
//
// ☠️ AND stripUnsafe NO LONGER DECIDES ANYTHING. It stays in the manifests as
// generated documentation of what a generator found and why, and both doors —
// the picker and Send to… — evaluate the TARGET list's tilePx against the file
// in hand. That way a photograph nobody ever flagged is still refused where it
// would be soft, and a flagged one is offered where it is fine. A list that
// declares no tilePx bars nothing: there is no budget to judge against, and the
// studio says so on the set rather than guessing in either direction.

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { ASSET_ROOTS, FILES, absolute, basename, isVideoPath, stripUnsafeOf } from './registry';

/** DPR the tile budget is computed against. */
export const TARGET_DPR = 2;

const dimsCache = new Map(); // basename -> {width, height} | null
let indexed = null; // basename -> absolute path
let pipelineBroken = null; // the error message, once, if sharp cannot load

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

/** The file's pixel size, measured. null when it cannot be read: a video, an
 *  SVG, a file that is not there, or a machine without the image pipeline. */
export async function measure(nameOrPath) {
  const key = basename(nameOrPath);
  if (dimsCache.has(key)) return dimsCache.get(key);
  let value = null;
  try {
    const idx = await assetIndex();
    const file = idx.get(key);
    if (file && !isVideoPath(file)) {
      const sharp = (await import('sharp')).default;
      const m = await sharp(file).metadata();
      if (m.width && m.height) value = { width: m.width, height: m.height };
    }
  } catch (e) {
    // ☠️ NO PIPELINE MEANS NO OPINION, NOT A CLOSED DOOR. If sharp cannot load,
    // measuring every file fails, and barring on "unknown" would grey out the
    // entire picker with no explanation. The studio reports the outage on the
    // set instead, so an editor sees why nothing is being judged.
    pipelineBroken = pipelineBroken || e.message;
    value = null;
  }
  dimsCache.set(key, value);
  return value;
}

/** The width to judge a file by: what the file says it is, else what a manifest
 *  row claimed. Videos and unreadable files return null and are never barred by
 *  this rule — it is about photographs, and mp4 dimensions are not sharp's. */
export async function widthOf(nameOrPath, declaredWidth = null) {
  const m = await measure(nameOrPath);
  if (m) return m.width;
  return Number.isFinite(declaredWidth) && declaredWidth > 0 ? declaredWidth : null;
}

/** Is this file too small for a list whose tiles need `needPx` device px? */
export function tooSmall(needPx, width) {
  if (!needPx) return false; // no declared budget: nothing is barred
  if (width == null) return false; // unmeasurable: no opinion, see measure()
  return width < needPx;
}

/**
 * The tile budget of every manifest, plus what its own flagged files do against
 * it — the number the media grid shows.
 *
 * @returns {{ byPath: object, noted: object, pipelineBroken: string|null }}
 *   byPath  manifest path -> { tilePx, needPx, declares, noted, notedBarred }
 *   noted   basename -> { reason, declaredBy, width }   the documentation union
 */
export async function tileGuards() {
  const noted = {};
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
      if (!noted[name]) noted[name] = { reason, declaredBy: f.id };
    }
  }

  for (const name of Object.keys(noted)) noted[name].width = await widthOf(name);

  const byPath = {};
  for (const { f, data } of docs) {
    const tilePx = Number(data?.tilePx);
    const has = Number.isFinite(tilePx) && tilePx > 0;
    const needPx = has ? tilePx * TARGET_DPR : null;
    let notedBarred = 0;
    for (const info of Object.values(noted)) if (tooSmall(needPx, info.width)) notedBarred += 1;
    byPath[f.path] = {
      tilePx: has ? tilePx : null,
      needPx,
      declares: !!stripUnsafeOf(data),
      noted: stripUnsafeOf(data),
      notedBarred,
    };
  }

  return { byPath, noted, pipelineBroken };
}
