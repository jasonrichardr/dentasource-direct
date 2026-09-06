// ── MEASURING A FILE, SO THE STUDIO BARS WHAT THE GENERATORS BAR ────────────
//
// The test itself is softnessReason() in ./registry, because the picker runs in
// the browser and this file reaches the disk. All this does is find a file and
// measure it.
//
// ☠️ THIS RULE HAS BEEN WRONG THREE TIMES, always the same way: something
// standing in for the measurement.
//
//   v1  "declares a stripUnsafe map" read as "tiles here are big". Over-barred
//       crew-shots, whose 126px row displays 360px photographs perfectly well.
//   v2  the file's short side against tilePx * 2. Right for portrait sources.
//   v3  the file's WIDTH against tilePx * 2. Right for portrait sources too, and
//       wrong for a wide short landscape, which it lets through.
//   v4  exact cover against a hard 2.0, from the generators (983be5b).
//   now the same cover ratio against a 1.75 floor (5ccf5af). 2.0 was the retina
//       ideal and banned most of the site's own footage: 720 wide material on a
//       384x288 tile covers at 1.875. The 360 wide crest frames sit at 0.94 and
//       still fail, which is the pile the whole rule exists for.
//
// stripUnsafe decides nothing. It is generated documentation of what a pipeline
// found and why; the studio measures the file in hand against the target list's
// declared tile, which catches files no map ever named.
//
// ☠️ VIDEOS ARE MEASURED TOO, with ffprobe. Eight of growth-partner's seventeen
// barred entries are mp4s, and a studio that silently exempts video would put
// back what the generator just removed. When neither pipeline is installed
// nothing is barred and the studio reports the outage: greying out a whole
// picker with no explanation is the worse failure.

import { execFile } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

import { ASSET_ROOTS, FILES, absolute, basename, isVideoPath, softnessReason, stripUnsafeOf } from './registry';

const run = promisify(execFile);

const dimsCache = new Map(); // basename -> {width, height} | null
let indexed = null; // basename -> absolute path
let pipelineBroken = null; // first failure message, surfaced to the studio

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

async function videoDims(file) {
  const { stdout } = await run('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height',
    '-of', 'json',
    file,
  ]);
  const s = JSON.parse(stdout)?.streams?.[0];
  return s?.width && s?.height ? { width: s.width, height: s.height } : null;
}

async function imageDims(file) {
  const sharp = (await import('sharp')).default;
  const m = await sharp(file).metadata();
  return m.width && m.height ? { width: m.width, height: m.height } : null;
}

/** The file's pixel size, measured and cached. null when it cannot be read: an
 *  SVG, a file that is not there, or a machine without the pipeline. */
export async function measure(nameOrPath) {
  const key = basename(nameOrPath);
  if (dimsCache.has(key)) return dimsCache.get(key);
  let value = null;
  try {
    const idx = await assetIndex();
    const file = idx.get(key);
    if (file) value = isVideoPath(file) ? await videoDims(file) : await imageDims(file);
  } catch (e) {
    pipelineBroken = pipelineBroken || e.message;
    value = null;
  }
  dimsCache.set(key, value);
  return value;
}

/** The reason this file is too small for that list, or null. The measurement is
 *  the file itself; dimensions written into a manifest row are the fallback for
 *  a file that cannot be read. */
export async function refusalFor(tile, nameOrPath, declared = null) {
  if (!tile?.tilePx) return null;
  const dims = (await measure(nameOrPath)) || (declared?.width && declared?.height ? declared : null);
  return softnessReason(tile, dims, isVideoPath(nameOrPath) ? 'video' : 'image');
}

/**
 * What every manifest renders at, and how many of its own flagged files fail
 * that budget — the number the media grid shows.
 *
 * @returns {{ byPath: object, noted: object, pipelineBroken: string|null }}
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

  for (const name of Object.keys(noted)) {
    noted[name].dims = await measure(name);
    noted[name].kind = isVideoPath(name) ? 'video' : 'image';
  }

  const byPath = {};
  for (const { f, data } of docs) {
    // every tile key the manifest declares, passed through as it stands: the
    // shape belongs to the data and the test, not to this loop
    const num = (v) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : null);
    const tile = {
      tilePx: num(data?.tilePx),
      tileHeightPx: num(data?.tileHeightPx),
      tileVideoPx: num(data?.tileVideoPx),
      tileVideoHeightPx: num(data?.tileVideoHeightPx),
      tileFit: data?.tileFit === 'contain' ? 'contain' : null,
    };
    let notedBarred = 0;
    for (const info of Object.values(noted)) if (softnessReason(tile, info.dims, info.kind)) notedBarred += 1;
    byPath[f.path] = { ...tile, declares: !!stripUnsafeOf(data), notedBarred };
  }

  return { byPath, noted, pipelineBroken };
}
