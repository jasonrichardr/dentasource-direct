// GET  /api/studio/file?path=…   read one JSON file
// PUT  /api/studio/file          write it back, after a .bak of what was there
//
// ☠️ DEV ONLY. Both verbs answer 404 in production before they look at anything,
// because this handler writes to the source tree and there is no version of
// production where that is acceptable.
//
// ☠️ THE PATH IS CHECKED BY RESOLUTION, NOT BY STRING. isWritable() resolves the
// real absolute path and requires it inside one of three roots, so "../",
// an absolute path and a path that merely starts with the right prefix all
// fail. The only thing that passes is a file actually under the fence.

import { readFile, writeFile, copyFile, appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

import { LOG_FILE, absolute, isWritable, studioDisabled } from '@/lib/studio/registry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const gone = () => new Response(null, { status: 404 });
const bad = (msg) => Response.json({ error: msg }, { status: 400 });

/** One line per write, so the day's edits can be read back without git. */
async function log(line) {
  try {
    await appendFile(absolute(LOG_FILE), `${new Date().toISOString()}  ${line}\n`, 'utf8');
  } catch {
    /* the log is a convenience; never fail a save because of it */
  }
}

export async function GET(request) {
  if (studioDisabled()) return gone();
  const rel = new URL(request.url).searchParams.get('path');
  if (!isWritable(rel)) return bad('path is outside the studio fence');
  try {
    const raw = await readFile(absolute(rel), 'utf8');
    return Response.json({ path: rel, data: JSON.parse(raw), bytes: raw.length });
  } catch (e) {
    if (e.code === 'ENOENT') return Response.json({ error: 'not found', path: rel }, { status: 404 });
    return bad(`could not read: ${e.message}`);
  }
}

export async function PUT(request) {
  if (studioDisabled()) return gone();
  let body;
  try {
    body = await request.json();
  } catch {
    return bad('body must be JSON');
  }
  const { path: rel, data, note } = body || {};
  if (!isWritable(rel)) return bad('path is outside the studio fence');
  if (!rel.endsWith('.json')) return bad('only .json files are editable');
  if (data === undefined || data === null || typeof data !== 'object') {
    return bad('data must be an object or array');
  }

  const abs = absolute(rel);
  // Pretty, two-space, trailing newline: these files are read by people and
  // reviewed in diffs, so the formatting is part of the product.
  const text = `${JSON.stringify(data, null, 2)}\n`;

  try {
    // The .bak is the undo. It is written BEFORE the save and only when there
    // is something to back up, so a first write does not leave an empty one.
    try {
      await copyFile(abs, `${abs}.bak`);
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
    await mkdir(path.dirname(abs), { recursive: true });
    await writeFile(abs, text, 'utf8');
  } catch (e) {
    return bad(`could not write: ${e.message}`);
  }

  await log(`save ${rel} (${text.length} bytes)${note ? ` — ${note}` : ''}`);
  return Response.json({ ok: true, path: rel, bytes: text.length, backup: `${rel}.bak` });
}
