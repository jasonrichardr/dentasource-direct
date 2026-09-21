// GET /api/studio/marquees — the track ids a per-track override can name.
//
// ☠️ DISCOVERED FROM THE SOURCE, NOT LISTED HERE. Every track carries
// data-marquee="id" and new ones arrive with new beats; a hand-kept list would
// be wrong the first time somebody adds a row. This greps the components for
// the attribute, so the override panel always offers exactly what exists.

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { absolute, studioDisabled } from '@/lib/studio/registry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ROOTS = ['src/components', 'src/cinema', 'src/app'];
const STUDIO = ['src/app/studio', 'src/app/api/studio'];
const isStudioSource = (p) => STUDIO.some((s) => p.includes(path.sep + s.split('/').join(path.sep)) || p.endsWith(s));
const CODE = /\.(jsx?|tsx?)$/;

async function walk(dir, out, depth = 0) {
  if (depth > 6) return;
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    // ☠️ SKIP THE STUDIO'S OWN SOURCE. This file contains the very regex it is
    // searching for, and the preview component sets data-marquee too, so
    // without this the panel offers a track called "id" that does not exist.
    if (isStudioSource(path.join(dir, e.name))) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, out, depth + 1);
    else if (CODE.test(e.name)) out.push(full);
  }
}

export async function GET() {
  if (studioDisabled()) return new Response(null, { status: 404 });

  const files = [];
  for (const r of ROOTS) await walk(absolute(r), files);

  const found = new Map();
  for (const f of files) {
    let text;
    try {
      text = await readFile(f, 'utf8');
    } catch {
      continue;
    }
    // data-marquee="strip" and the template form data-marquee={`parts-${n}`}
    for (const m of text.matchAll(/data-marquee=(?:"([^"]+)"|\{`([^`]+)`\})/g)) {
      const raw = m[1] || m[2];
      if (!raw) continue;
      const id = raw.replace(/\$\{[^}]*\}/g, 'N'); // parts-${r+1} -> parts-N
      if (!found.has(id)) found.set(id, path.relative(absolute('.'), f));
    }
  }

  return Response.json({
    tracks: [...found.entries()]
      .map(([id, file]) => ({ id, file, pattern: id.includes('N') }))
      .sort((a, b) => a.id.localeCompare(b.id)),
  });
}
