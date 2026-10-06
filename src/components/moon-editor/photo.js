// A photo for the home page, checked and slimmed in the browser before it is sent.
//
// The console's upload door (wwwUpload.storeUpload) sniffs the bytes again and refuses
// anything that is not JPEG, PNG or WebP or is over 3 MB; these checks say so BEFORE a phone
// spends its data on a refusal. Same numbers as the console's own uploader: the long edge is
// slimmed to 1800 px as JPEG at 0.85, which is sharper than any marquee tile needs.

export const MAX_BYTES = 3 * 1024 * 1024;
const RAW_LIMIT = 25 * 1024 * 1024;
const LONG_EDGE = 1800;

/** What a file REALLY is, from its first bytes (never its name or its claimed type). */
export async function sniffType(file) {
  const b = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 && b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a) return 'image/png';
  const ascii = (from, to) => String.fromCharCode(...b.slice(from, to));
  if (b.length >= 12 && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp';
  return null;
}

/**
 * Check, measure and (when needed) slim one photo. Resolves { bytes, w, h }; rejects with the
 * sentence the editor shows.
 */
export async function preparePhoto(file) {
  if (!file) throw new Error('Pick a photo first.');
  const type = await sniffType(file);
  if (!type) throw new Error('That file is not a photo the site can show. Use a JPEG, PNG or WebP.');
  if (file.size > RAW_LIMIT) throw new Error('That file is too big to slim here (25 MB at most). Pick a smaller photo.');
  let bmp;
  try { bmp = await createImageBitmap(file); } catch { throw new Error('That photo could not be opened. Try another one.'); }
  const { width, height } = bmp;
  const long = Math.max(width, height);
  if (long <= LONG_EDGE && file.size <= MAX_BYTES) {
    bmp.close();
    return { bytes: await file.arrayBuffer(), w: width, h: height };
  }
  const k = Math.min(1, LONG_EDGE / long);
  const w = Math.max(1, Math.round(width * k));
  const h = Math.max(1, Math.round(height * k));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';            // a transparent PNG must not turn black as a JPEG
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.85));
  if (!blob) throw new Error('That photo could not be slimmed. Try another one.');
  if (blob.size > MAX_BYTES) throw new Error('That photo is too big even after slimming (3 MB at most).');
  return { bytes: await blob.arrayBuffer(), w, h };
}
