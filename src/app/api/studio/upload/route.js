// POST /api/studio/upload — multipart: file, alt, optional slug.
// Images are re-encoded down to 1800 px on the long edge (the house limit),
// videos are stored as they arrive with a warning past 8 MB. Everything lands
// in public/cinema/uploads/<yyyy-mm>/<slug>.<ext>, which is inside the write
// fence and nowhere near the tracked media. Dev only.

import { mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

import { logLine } from '@/lib/studio/log';
import { absolute, isImagePath, isVideoPath, studioDisabled } from '@/lib/studio/registry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_EDGE = 1800;
const VIDEO_WARN_BYTES = 8 * 1024 * 1024;
const MAX_BYTES = 200 * 1024 * 1024;

const bad = (msg) => Response.json({ error: msg }, { status: 400 });

/** A filename somebody can read in a diff a year from now. */
function slugify(name) {
  return (
    name
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/i, '')
      .normalize('NFKD')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 60) || 'upload'
  );
}

export async function POST(request) {
  if (studioDisabled()) return new Response(null, { status: 404 });

  let form;
  try {
    form = await request.formData();
  } catch {
    return bad('expected multipart form data');
  }
  const file = form.get('file');
  const alt = (form.get('alt') || '').toString().trim();
  const wanted = (form.get('slug') || '').toString().trim();

  if (!file || typeof file.arrayBuffer !== 'function') return bad('no file');
  // ☠️ ALT TEXT IS NOT OPTIONAL. Every tile in these manifests carries one, and
  // a picture that arrives without a description never gets one later.
  if (!alt) return bad('alt text is required. Describe the picture in a few words.');

  const original = file.name || 'upload';
  const ext = (path.extname(original) || '').toLowerCase();
  if (!isImagePath(original) && !isVideoPath(original)) return bad(`unsupported file type: ${ext || 'none'}`);

  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > MAX_BYTES) return bad('file is over 200 MB');

  const month = new Date().toISOString().slice(0, 7); // yyyy-mm
  const dirRel = `public/cinema/uploads/${month}`;
  await mkdir(absolute(dirRel), { recursive: true });

  const base = slugify(wanted || original);
  let out = buf;
  let outExt = ext;
  const warnings = [];
  let dimensions = null;

  if (isImagePath(original) && ext !== '.svg') {
    // sharp ships with the image pipeline. It is imported lazily and its absence
    // is survivable: the file is still saved, just at its original size, and the
    // caller is told. Better a saved photo with a warning than a failed upload.
    try {
      const sharp = (await import('sharp')).default;
      const img = sharp(buf, { failOn: 'none' });
      const meta = await img.metadata();
      const longEdge = Math.max(meta.width || 0, meta.height || 0);
      const pipeline = longEdge > MAX_EDGE ? img.resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true }) : img;
      out = await pipeline.toBuffer();
      const after = await sharp(out).metadata();
      dimensions = { width: after.width, height: after.height };
      if (longEdge > MAX_EDGE) warnings.push(`resized from ${longEdge}px to ${MAX_EDGE}px on the long edge`);
    } catch (e) {
      warnings.push(`stored at original size: the image pipeline was unavailable (${e.message})`);
    }
  } else if (isVideoPath(original)) {
    if (buf.length > VIDEO_WARN_BYTES) {
      warnings.push(
        `this video is ${(buf.length / 1024 / 1024).toFixed(1)} MB. Over 8 MB it will cost a phone visitor real data. Consider a shorter cut or a lower bitrate.`,
      );
    }
  }

  // Never silently overwrite: a name that is taken gets a numeric suffix.
  let name = `${base}${outExt}`;
  for (let i = 2; i < 500; i++) {
    try {
      await stat(absolute(`${dirRel}/${name}`));
      name = `${base}-${i}${outExt}`;
    } catch {
      break;
    }
  }

  await writeFile(absolute(`${dirRel}/${name}`), out);
  const src = `/cinema/uploads/${month}/${name}`;
  // never blocks the upload; a failed line is reported rather than swallowed
  const logged = await logLine(`upload ${src} (${out.length} bytes) alt="${alt.replace(/"/g, "'")}"`);

  return Response.json({
    ok: true,
    src,
    alt,
    kind: isVideoPath(src) ? 'video' : 'image',
    bytes: out.length,
    dimensions,
    warnings,
    logged,
  });
}
