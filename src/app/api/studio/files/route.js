// GET /api/studio/files — what the left rail lists.
// Reports which registry entries actually exist, how many items each holds and
// when it last changed, so the rail can be built in one round trip. Dev only.

import { readFile, stat } from 'node:fs/promises';

import { FILES, absolute, detectCollection, studioDisabled } from '@/lib/studio/registry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (studioDisabled()) return new Response(null, { status: 404 });

  const out = [];
  for (const f of FILES) {
    try {
      const [raw, s] = await Promise.all([readFile(absolute(f.path), 'utf8'), stat(absolute(f.path))]);
      const data = JSON.parse(raw);
      // the file decides which key holds the items, not this list
      const collection = detectCollection(data, f.collection);
      const coll = data?.[collection];
      out.push({
        ...f,
        collection,
        exists: true,
        count: Array.isArray(coll) ? coll.length : coll && typeof coll === 'object' ? Object.keys(coll).length : 0,
        modified: s.mtime.toISOString(),
        notes: typeof data?.notes === 'string' ? data.notes : '',
      });
    } catch (e) {
      // ☠️ AN ABSENT MANIFEST IS NOT AN ERROR AND MUST NOT BE HIDDEN. These files
      // are being reshaped upstream while the studio is in use: one was deleted
      // and folded into another, one is mid-replacement. Showing it greyed out
      // with a reason tells the editor "this is coming" rather than leaving a
      // hole they cannot ask about. A malformed file reports its parse error
      // for the same reason.
      out.push({
        ...f,
        exists: false,
        count: 0,
        modified: null,
        notes: '',
        why: e.code === 'ENOENT' ? 'not present' : `unreadable: ${e.message}`,
      });
    }
  }
  return Response.json({ files: out });
}
