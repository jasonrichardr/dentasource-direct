// GET /api/studio/assets?q=…&limit=… — what the swap picker offers.
// Walks the read-only asset roots and returns web paths (the "public" prefix
// stripped, which is what the JSON files store). Read only: this handler has no
// write path at all, which is the cheapest way to be sure it cannot have one.

import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

import { ASSET_ROOTS, absolute, isImagePath, isVideoPath, studioDisabled } from '@/lib/studio/registry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_DEPTH = 6;
const HARD_CAP = 4000; // a wall against a runaway walk, not a UI limit

async function walk(dir, depth, acc) {
  if (depth > MAX_DEPTH || acc.length >= HARD_CAP) return;
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return; // a missing root is normal; skip it
  }
  for (const e of entries) {
    if (acc.length >= HARD_CAP) return;
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      await walk(full, depth + 1, acc);
    } else if (isImagePath(e.name) || isVideoPath(e.name)) {
      acc.push(full);
    }
  }
}

export async function GET(request) {
  if (studioDisabled()) return new Response(null, { status: 404 });

  const url = new URL(request.url);
  const q = (url.searchParams.get('q') || '').trim().toLowerCase();
  const limit = Math.min(600, Math.max(1, Number(url.searchParams.get('limit')) || 240));

  const found = [];
  for (const root of ASSET_ROOTS) await walk(absolute(root), 0, found);

  const pub = absolute('public');
  let items = found.map((abs) => {
    const web = `/${path.relative(pub, abs).split(path.sep).join('/')}`;
    return { src: web, name: path.basename(web), kind: isVideoPath(web) ? 'video' : 'image' };
  });

  if (q) {
    const terms = q.split(/\s+/).filter(Boolean);
    items = items.filter((it) => terms.every((t) => it.src.toLowerCase().includes(t)));
  }
  items.sort((a, b) => a.src.localeCompare(b.src));

  const page = items.slice(0, limit);
  // Size is only fetched for what is actually returned: stat-ing four thousand
  // files to render forty of them is how a picker becomes slow.
  await Promise.all(
    page.map(async (it) => {
      try {
        it.bytes = (await stat(absolute(`public${it.src}`))).size;
      } catch {
        it.bytes = null;
      }
    }),
  );

  return Response.json({ items: page, total: items.length, truncated: items.length > page.length });
}
