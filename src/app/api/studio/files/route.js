// GET /api/studio/files — what the left rail lists.
// Reports which registry entries actually exist, how many items each holds and
// when it last changed, so the rail can be built in one round trip. Dev only.

import { readFile, stat } from 'node:fs/promises';

import { FILES, absolute, studioDisabled } from '@/lib/studio/registry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (studioDisabled()) return new Response(null, { status: 404 });

  const out = [];
  for (const f of FILES) {
    try {
      const [raw, s] = await Promise.all([readFile(absolute(f.path), 'utf8'), stat(absolute(f.path))]);
      const data = JSON.parse(raw);
      const coll = data?.[f.collection];
      out.push({
        ...f,
        exists: true,
        count: Array.isArray(coll) ? coll.length : coll && typeof coll === 'object' ? Object.keys(coll).length : 0,
        modified: s.mtime.toISOString(),
        notes: typeof data?.notes === 'string' ? data.notes : '',
      });
    } catch {
      // A registry entry with no file on disk is not an error: the brief names
      // manifests this repo does not have yet. They appear when somebody adds
      // them, and until then the rail simply does not show them.
      out.push({ ...f, exists: false, count: 0, modified: null, notes: '' });
    }
  }
  return Response.json({ files: out });
}
