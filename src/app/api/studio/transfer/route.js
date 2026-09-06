// GET  /api/studio/transfer — every media list a tile can be sent to
// POST /api/studio/transfer — move or copy tiles between two of them
//
// ☠️ WHY THIS IS A SERVER OPERATION AND NOT TWO UI EDITS. A transfer touches
// TWO files. Doing it in the browser would mean the target is written now and
// the source waits for a Save the editor might never press, which leaves the
// same picture in two places and no way to tell which was intended. So both
// writes happen here, in order, each with its own .bak, and the caller reloads.
// The UI refuses to start one while the open file has unsaved edits, because
// this reads the version on DISK and would otherwise silently discard them.

import { readFile, writeFile, copyFile, appendFile } from 'node:fs/promises';

import { FILES, LOG_FILE, absolute, basename, detectCollection, isVideoPath, isWritable, studioDisabled, tileState } from '@/lib/studio/registry';
import { dimsFor, refusalFor, tileGuards } from '@/lib/studio/unsafe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const bad = (msg) => Response.json({ error: msg }, { status: 400 });

const getIn = (obj, keys) => keys.reduce((o, k) => (o == null ? o : o[k]), obj);
function setIn(obj, keys, value) {
  if (!keys.length) return value;
  const [k, ...rest] = keys;
  if (Array.isArray(obj)) {
    const next = obj.slice();
    next[k] = setIn(obj[k], rest, value);
    return next;
  }
  return { ...obj, [k]: setIn(obj?.[k], rest, value) };
}

const srcOf = (row) => (typeof row === 'string' ? row : row?.src || '');

/** A list is a media list if it holds paths, or objects carrying one. */
function isMediaList(v) {
  if (!Array.isArray(v) || !v.length) return false;
  return v.every((x) => typeof x === 'string') || v.every((x) => x && typeof x === 'object' && typeof x.src === 'string');
}

/** ☠️ VIDEO COMPATIBILITY IS READ FROM THE DATA, NOT FROM A HARDCODED LIST.
 *  A target takes video if it already holds one, or if its entries carry a
 *  poster (which only a video entry does here). That way a manifest invented
 *  next week is judged on what it contains rather than on whether somebody
 *  remembered to add its name to this file. */
function acceptsVideo(list) {
  if (!Array.isArray(list) || !list.length) return true; // empty: nothing to contradict
  return list.some((x) => isVideoPath(srcOf(x)) || (x && typeof x === 'object' && 'poster' in x));
}

/** Every media list in every registry file, as {path, pointer, label}. */
async function collectTargets() {
  const out = [];
  for (const f of FILES) {
    let data;
    try {
      data = JSON.parse(await readFile(absolute(f.path), 'utf8'));
    } catch {
      continue; // absent or unreadable: not a target
    }
    const collection = detectCollection(data, f.collection);
    const coll = data?.[collection];

    if (isMediaList(coll)) {
      out.push({
        id: `${f.id}:${collection}`,
        file: f.id,
        label: `${f.label}`,
        sub: collection,
        path: f.path,
        pointer: [collection],
        count: coll.length,
        acceptsVideo: acceptsVideo(coll),
        objectMode: typeof coll[0] === 'object',
      });
    }

    // a beat's own media lists, so a picture can go straight into a beat
    if (Array.isArray(coll)) {
      coll.forEach((row, i) => {
        if (!row || typeof row !== 'object') return;
        for (const key of ['media', 'tiles', 'reels', 'items']) {
          if (isMediaList(row[key])) {
            out.push({
              id: `${f.id}:${i}:${key}`,
              file: f.id,
              label: `${f.label} — ${row.headline || row.key || row.name || `#${i + 1}`}`,
              sub: key,
              path: f.path,
              pointer: [collection, i, key],
              count: row[key].length,
              acceptsVideo: acceptsVideo(row[key]),
              objectMode: typeof row[key][0] === 'object',
            });
          }
        }
      });
    }
  }
  return out;
}

export async function GET() {
  if (studioDisabled()) return new Response(null, { status: 404 });
  return Response.json({ targets: await collectTargets() });
}

/** Reshape an entry for the list it is going into, keeping what survives. */
function adapt(entry, targetList) {
  const wantsObject = targetList.length ? typeof targetList[0] === 'object' : typeof entry === 'object';
  const src = srcOf(entry);
  if (!wantsObject) return src;
  if (typeof entry === 'string') return { src, alt: '' };
  // keep alt, poster and caption if the target's own entries use them; an
  // unknown extra field is dropped rather than smuggled into a foreign shape
  const sample = targetList.find((x) => x && typeof x === 'object') || {};
  const keep = new Set(['src', ...Object.keys(sample)]);
  const next = {};
  for (const k of Object.keys(entry)) if (keep.has(k)) next[k] = entry[k];
  next.src = src;
  if ('alt' in sample && !next.alt) next.alt = entry.alt || '';
  return next;
}

async function loadDoc(path) {
  if (!isWritable(path)) throw new Error('path is outside the studio fence');
  return JSON.parse(await readFile(absolute(path), 'utf8'));
}

async function saveDoc(path, data, note) {
  const abs = absolute(path);
  try {
    await copyFile(abs, `${abs}.bak`);
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
  await writeFile(abs, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  try {
    await appendFile(absolute(LOG_FILE), `${new Date().toISOString()}  ${note}\n`, 'utf8');
  } catch {
    /* the log never blocks a write */
  }
}

export async function POST(request) {
  if (studioDisabled()) return new Response(null, { status: 404 });

  let body;
  try {
    body = await request.json();
  } catch {
    return bad('body must be JSON');
  }
  const { from, to, mode } = body || {};
  if (!from?.path || !Array.isArray(from.pointer) || !Array.isArray(from.indexes)) return bad('bad source');
  if (!to?.path || !Array.isArray(to.pointer)) return bad('bad target');
  if (mode !== 'move' && mode !== 'copy') return bad('mode must be move or copy');
  if (!isWritable(from.path) || !isWritable(to.path)) return bad('path is outside the studio fence');

  const sameList = from.path === to.path && JSON.stringify(from.pointer) === JSON.stringify(to.pointer);
  if (sameList && mode === 'move') return bad('that is where they already are');

  let sourceDoc;
  let targetDoc;
  try {
    sourceDoc = await loadDoc(from.path);
    targetDoc = sameList ? sourceDoc : await loadDoc(to.path);
  } catch (e) {
    return bad(`could not read: ${e.message}`);
  }

  const sourceList = getIn(sourceDoc, from.pointer);
  const targetList = getIn(targetDoc, to.pointer);
  if (!Array.isArray(sourceList)) return bad('source is not a list');
  if (!Array.isArray(targetList)) return bad('target is not a list');

  const picked = from.indexes
    .map((i) => sourceList[i])
    .filter((x) => x !== undefined);
  if (!picked.length) return bad('nothing selected');

  // ☠️ THE SAME BAR THE PICKER SHOWS, ON THE OTHER DOOR. Greying a file out of
  // the picker stops it being ADDED to a list whose tiles are too big for it,
  // and does nothing about it being SENT there from a list where it was fine.
  // Several of these manifests are hand maintained with no build step to catch
  // a re-add, so both doors refuse or neither does.
  //
  // The target's own budget decides, by size: a list that renders small tiles
  // takes a photograph a large-tile strip cannot. See src/lib/studio/unsafe.js.
  const { byPath } = await tileGuards();
  const tile = byPath[to.path] || null;

  // ☠️ AND WHAT THE TEST COULD NOT JUDGE IS COUNTED, NOT ASSUMED FINE. A file
  // that is not in the repo and whose row carries no width — 25 of the reel
  // library's rows are exactly that — cannot be measured, so it goes in
  // unexamined. That is the right policy and the wrong silence: admitted
  // unjudged and admitted because it passed look identical unless one says so.
  const unmeasured = [];
  if (tile) {
    for (const entry of picked) {
      const src = srcOf(entry);
      const declared = entry && typeof entry === 'object' ? { width: Number(entry.width), height: Number(entry.height) } : null;
      const why = await refusalFor(tile, src, declared);
      // the reason reads as a sentence about the file, so it needs no preamble
      if (why) return bad(`${basename(src)}: ${why}.`);
      const kind = isVideoPath(src) ? 'video' : 'image';
      if (tileState(tile, kind) === 'measured' && !(await dimsFor(src, declared))) unmeasured.push(basename(src));
    }
  }

  // ☠️ THE INFERRED VIDEO RULE RUNS LAST, AFTER THE DECLARED ONE. A manifest
  // that says "tileVideoPx": null has stated it takes no video and gets to say
  // so in its own words; this is the fallback for a list that has declared
  // nothing, where the only evidence is what the list already holds.
  if (!acceptsVideo(targetList) && picked.some((x) => isVideoPath(srcOf(x)))) {
    return bad('that list does not carry video. Pick a target that already holds one.');
  }

  const adapted = picked.map((e) => adapt(e, targetList));

  if (sameList) {
    const next = [...sourceList, ...adapted];
    await saveDoc(from.path, setIn(sourceDoc, from.pointer, next), `duplicate ${adapted.length} in ${from.path} ${from.pointer.join('.')}`);
    return Response.json({ ok: true, moved: 0, copied: adapted.length, target: to.path, unmeasured });
  }

  targetDoc = setIn(targetDoc, to.pointer, [...targetList, ...adapted]);
  await saveDoc(to.path, targetDoc, `${mode} in ${adapted.length} -> ${to.path} ${to.pointer.join('.')} (from ${from.path})`);

  if (mode === 'move') {
    const drop = new Set(from.indexes);
    const kept = sourceList.filter((_, i) => !drop.has(i));
    sourceDoc = setIn(sourceDoc, from.pointer, kept);
    await saveDoc(from.path, sourceDoc, `${mode} out ${adapted.length} from ${from.path} ${from.pointer.join('.')}`);
  }

  return Response.json({
    ok: true,
    moved: mode === 'move' ? adapted.length : 0,
    copied: mode === 'copy' ? adapted.length : 0,
    target: to.path,
    unmeasured,
  });
}
