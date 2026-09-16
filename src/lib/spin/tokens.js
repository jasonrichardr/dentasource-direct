import { createHmac, timingSafeEqual } from 'node:crypto';

// Cookie values are HMACs derived from the booth PIN (plus an optional secret),
// so a cookie cannot be forged by typing spin_desk=1 in devtools.
export const DESK_COOKIE = 'spin_desk';
export const REHEARSAL_COOKIE = 'spin_rehearsal';

function key() {
  return `${process.env.SPIN_DESK_PIN || ''}|${process.env.SPIN_COOKIE_SECRET || 'nadti-spin-2026'}`;
}

export function tokenFor(scope) {
  if (!process.env.SPIN_DESK_PIN) return null;
  return createHmac('sha256', key()).update(scope).digest('hex');
}

export function tokenMatches(scope, value) {
  const expected = tokenFor(scope);
  if (!expected || !value || value.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(String(value)));
  } catch {
    return false;
  }
}

export function isDeskCookie(value) { return tokenMatches('desk', value); }
export function isRehearsalCookie(value) { return tokenMatches('rehearsal', value); }

// Very small in-memory failure counter per IP. Serverless instances do not share
// it, so it is a speed bump, not a wall. Pair it with a PIN of 6+ characters.
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 8;

export function pinLocked(ip) {
  const a = attempts.get(ip);
  if (!a) return false;
  if (Date.now() - a.t > WINDOW_MS) { attempts.delete(ip); return false; }
  return a.n >= MAX_FAILS;
}

export function pinFailed(ip) {
  const a = attempts.get(ip);
  if (!a || Date.now() - a.t > WINDOW_MS) attempts.set(ip, { n: 1, t: Date.now() });
  else a.n += 1;
}

export function pinSucceeded(ip) { attempts.delete(ip); }

export function pinMatches(pin) {
  const expected = process.env.SPIN_DESK_PIN || '';
  const given = String(pin || '');
  if (!expected || given.length !== expected.length) return false;
  try { return timingSafeEqual(Buffer.from(expected), Buffer.from(given)); } catch { return false; }
}

// QR payload for the prize card: "<code>.<10 hex of HMAC>". Only the desk (which knows the PIN-derived key) can verify it,
// so a QR typed up by hand or screenshotted from another phone fails the check.
export function qrTokenFor(code) {
  const c = String(code || '').toUpperCase();
  if (!c || !process.env.SPIN_DESK_PIN) return null;
  return `${c}.${createHmac('sha256', key()).update(`qr:${c}`).digest('hex').slice(0, 10)}`;
}

/** Returns the code when the token verifies, else null. */
export function codeFromQrToken(token) {
  const m = /^([A-Z0-9]{4,8})\.([0-9a-f]{10})$/i.exec(String(token || '').trim());
  if (!m) return null;
  const expected = qrTokenFor(m[1].toUpperCase());
  if (!expected) return null;
  try { return timingSafeEqual(Buffer.from(expected), Buffer.from(`${m[1].toUpperCase()}.${m[2].toLowerCase()}`)) ? m[1].toUpperCase() : null; } catch { return null; }
}
