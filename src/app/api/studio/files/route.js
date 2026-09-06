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
  // ☠️ THE UNION, AND WHAT DECLARING THE KEY ACTUALLY MEANS.
  //
  //     stripUnsafe means "a media list whose tiles render large enough for
  //     source resolution to matter", NOT "any strip".
  //
  // Ruled 2026-09-06 with builder-home and builder-products. The reason a file
  // is barred is that it reads soft at TILE SIZE, which is a property of the
  // photograph and of how big the tile is, not of the manifest that noticed.
  // installs bars five, crew-shots bars two; read per manifest, the three
  // crew-shots does not name could be added there, where they would be exactly
  // as soft. So every declaring list is judged against every declaring list.
  //
  // The measurement that draws the line: a strip tile renders up to 384 css px,
  // 768 device px at DPR 2, where a 360 wide source is visibly soft. A parts
  // tile renders 56 css px, 112 device px, where the same photograph is fine.
  // So parts.json is a strip and deliberately does NOT declare, and a beat's own
  // media list is left alone for the same reason: those render large, which is
  // where 360 wide still works and where the articles keep using them.
  //
  // ☠️ TWO WAYS THIS GOES WRONG, so the next person adds the key for the right
  // reason rather than because the list looks like a strip:
  //   a SMALL-TILE list that declares    over-bars, banning photographs from a
  //                                      place they still work;
  //   a LARGE-TILE list that forgets     under-bars, silently, which is worse
  //                                      because nothing announces it.
  // The studio cannot measure a tile, so it shows every media set whether it
  // has a guard, and an empty {} is a real declaration: it marks the list as
  // one where resolution matters and pulls in the whole union.
  const unsafeUnion = {};
  for (const f of FILES) {
    try {
      const [raw, s] = await Promise.all([readFile(absolute(f.path), 'utf8'), stat(absolute(f.path))]);
      const data = JSON.parse(raw);
      if (data && typeof data.stripUnsafe === 'object' && data.stripUnsafe) {
        for (const [name, why] of Object.entries(data.stripUnsafe)) {
          if (!unsafeUnion[name]) unsafeUnion[name] = why;
        }
      }
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
        stripUnsafe: data?.stripUnsafe && typeof data.stripUnsafe === 'object' ? data.stripUnsafe : null,
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
  return Response.json({ files: out, unsafeUnion });
}
