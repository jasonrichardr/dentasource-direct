// Bridge from the spin page to the DSD Console (Convex). Pure helpers are
// unit-tested; callConvex is the only thing that touches the network.

export const PLATFORMS = ['facebook', 'instagram', 'tiktok', 'google'];

const SEARCH = {
  facebook: (q) => `https://www.facebook.com/search/pages/?q=${encodeURIComponent(q)}`,
  instagram: (q) => `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(q)}`,
  tiktok: (q) => `https://www.tiktok.com/search?q=${encodeURIComponent(q)}`,
  google: (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`,
};

/** The platform's own search page, prefilled with the clinic name. */
export function searchUrl(platform, clinic) {
  const f = SEARCH[platform];
  if (!f) return null;
  return f(`${String(clinic || '').trim()} dental clinic`.trim());
}

const HOST = {
  facebook: /(^|\.)(facebook\.com|fb\.com|fb\.me)$/i,
  instagram: /(^|\.)instagram\.com$/i,
  tiktok: /(^|\.)tiktok\.com$/i,
  google: /(^|\.)(google\.com|goo\.gl|maps\.app\.goo\.gl)$/i,
};
const BASE = { facebook: 'https://facebook.com/', instagram: 'https://instagram.com/', tiktok: 'https://tiktok.com/@' };

/** A pasted link or an @handle -> canonical profile URL for that platform, or null. Mirrors consoleNadti.normalizeSocial. */
export function normalizeSocial(platform, value) {
  const raw = String(value || '').trim();
  if (!raw || !HOST[platform]) return null;
  if (/^https?:\/\//i.test(raw) || /^[a-z0-9.-]+\.[a-z]{2,}\//i.test(raw)) {
    let url;
    try { url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`); } catch { return null; }
    const host = url.hostname.replace(/^www\./, '').replace(/^m\./, '');
    if (!HOST[platform].test(host)) return null;
    return url.toString();
  }
  if (platform === 'google') return null;
  const handle = raw.replace(/^@/, '').replace(/[^A-Za-z0-9._-]/g, '');
  if (handle.length < 2) return null;
  return `${BASE[platform]}${handle}`;
}

/** "Unit 2, 123 Shaw Blvd, Mandaluyong, 1550 Metro Manila, Philippines" -> "Mandaluyong" */
export function cityFromAddress(address) {
  if (!address) return null;
  const parts = String(address).split(',').map((s) => s.trim()).filter(Boolean);
  const drop = (s) => /philippines|metro manila|^\d{4}\b|^ncr$|luzon|rizal$/i.test(s);
  const kept = parts.filter((s) => !drop(s));
  const last = kept[kept.length - 1] || '';
  return last.replace(/\bcity\b/i, '').trim() || null;
}

/**
 * Calls a Convex function over the HTTP API. kind = 'query' | 'mutation' | 'action'.
 * Returns the value, or throws. Callers decide whether a failure matters.
 */
export async function callConvex(kind, path, args, { timeoutMs = 5000, baseUrl = process.env.NADTI_CONVEX_URL, fetchImpl = fetch } = {}) {
  if (!baseUrl) throw new Error('NADTI_CONVEX_URL not set');
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetchImpl(`${baseUrl}/api/${kind}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, args, format: 'json' }),
      signal: ctrl.signal,
      cache: 'no-store',
    });
    const data = await res.json();
    if (!res.ok || data.status !== 'success') throw new Error(data.errorMessage || `Convex ${kind} ${path} failed (${res.status})`);
    return data.value;
  } finally {
    clearTimeout(t);
  }
}
