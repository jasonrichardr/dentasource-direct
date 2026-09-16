// Pure helpers for the NADTI Spin lead rows. No Next, no Prisma.

export const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const INTEREST_REAL = 'NADTI 2026 booth';
export const INTEREST_TEST = 'NADTI 2026 booth (TEST)';

// Event window in Asia/Manila (+08:00, no DST): Sept 22 00:00 → Sept 24 23:59:59.999
export const WINDOW_START_MS = Date.UTC(2026, 8, 21, 16, 0, 0, 0);
export const WINDOW_END_MS = Date.UTC(2026, 8, 24, 15, 59, 59, 999);

// Philippine mobile → +639XXXXXXXXX, else null.
export function normalizePhone(raw) {
  if (!raw) return null;
  let d = String(raw).replace(/\D/g, '');
  if (d.startsWith('0063')) d = d.slice(2);
  if (d.length === 11 && d.startsWith('09')) d = '63' + d.slice(1);
  else if (d.length === 10 && d.startsWith('9')) d = '63' + d;
  if (d.length !== 12 || !d.startsWith('639')) return null;
  return '+' + d;
}

export function splitName(full) {
  const parts = String(full || '').trim().replace(/\s+/g, ' ').split(' ').filter(Boolean);
  if (!parts.length) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '-' };
  return { firstName: parts.slice(0, -1).join(' '), lastName: parts[parts.length - 1] };
}

export const CODE_LENGTH = 7;
export function makeCode(random = Math.random, length = CODE_LENGTH) {
  let s = '';
  for (let i = 0; i < length; i++) {
    s += CODE_ALPHABET[Math.min(CODE_ALPHABET.length - 1, Math.floor(random() * CODE_ALPHABET.length))];
  }
  return s;
}

export function isValidCode(s) {
  return typeof s === 'string' && /^[A-HJ-NP-Z2-9]{4,8}$/.test(s);
}

export function isValidEmail(s) {
  return typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());
}

// override: 'auto' | 'open' | 'closed' (SPIN_STATUS). rehearsal cookie forces open.
export function eventStatus({ now = new Date(), override = 'auto', rehearsal = false } = {}) {
  if (rehearsal) return 'open';
  if (override === 'open') return 'open';
  if (override === 'closed') return 'closed';
  const t = now.getTime();
  return t >= WINDOW_START_MS && t <= WINDOW_END_MS ? 'open' : 'closed';
}

export function prizePrefix(label) {
  return `Prize: ${label}`;
}

export function messageFor({ label, code }) {
  return `${prizePrefix(label)} · Code: ${code} · Claimed: no`;
}

export function parseMessage(msg) {
  const m = /^Prize: (.+?) · Code: ([A-Z0-9]{4,8}) · Claimed: (.+)$/.exec(String(msg || ''));
  if (!m) return null;
  return { prizeLabel: m[1], code: m[2], claimed: m[3] === 'no' ? null : m[3] };
}

export function claimedMessage(msg, when) {
  return String(msg).replace(/· Claimed: .+$/, `· Claimed: ${when} by desk`);
}

export function manilaStamp(d = new Date()) {
  const p = new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(d);
  const g = (t) => p.find((x) => x.type === t)?.value;
  return `${g('year')}-${g('month')}-${g('day')} ${g('hour')}:${g('minute')}`;
}
