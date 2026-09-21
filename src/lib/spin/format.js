// Pure helpers for the NADTI Spin lead rows. No Next, no Prisma.

export const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const INTEREST_REAL = 'NADTI 2026 booth';
export const INTEREST_TEST = 'NADTI 2026 booth (TEST)';
// Pre-registration before the event: a reserved spin, no prize yet. Same code carries over to the spin.
export const INTEREST_PRE = 'NADTI 2026 pre-registered';
export const INTEREST_PRE_TEST = 'NADTI 2026 pre-registered (TEST)';

// Event window in Asia/Manila (+08:00, no DST): the BOOTH HOURS, not the calendar
// days. Sept 22 09:00 → Sept 24 17:00, the last minute a prize can still be
// claimed at Booth 034 and 035 (Jarich's ruling, 2026-09-21). The end is
// inclusive: 17:00:00.000 is still open, 17:00:01 is closed.
export const WINDOW_START_MS = Date.UTC(2026, 8, 22, 1, 0, 0, 0);
export const WINDOW_END_MS = Date.UTC(2026, 8, 24, 9, 0, 0, 0);

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

export function reservedMessage(code) {
  return `Reserved spin · Code: ${code} · Spun: no`;
}

export function parseReserved(msg) {
  const m = /^Reserved spin · Code: ([A-Z0-9]{4,8}) · Spun: (.+)$/.exec(String(msg || ''));
  return m ? { code: m[1] } : null;
}

/** Whole days/hours/minutes/seconds until targetMs. done=true at or after the target. */
export function countdownParts(targetMs, nowMs = Date.now()) {
  const left = Math.max(0, Math.floor((targetMs - nowMs) / 1000));
  return {
    done: nowMs >= targetMs,
    days: Math.floor(left / 86400),
    hours: Math.floor((left % 86400) / 3600),
    minutes: Math.floor((left % 3600) / 60),
    seconds: left % 60,
  };
}

// ───────────── CSV export (pure; the desk builds the Blob) ─────────────

export const CSV_COLUMNS = ['name', 'clinic', 'phone', 'email', 'code', 'prize', 'claimed', 'reserved', 'created'];

/**
 * Cells a spreadsheet would run as a formula. Visitors type their own name and
 * clinic into the public spin form, so those strings are untrusted by the time
 * the desk opens the export in Excel.
 *
 * A leading + or - in front of a plain phone or number is left alone (every
 * phone here starts +63); a real payload always carries letters or a bracket.
 */
export function needsFormulaGuard(s) {
  if (!s) return false;
  if (/^[=@\t\r]/.test(s)) return true;
  return /^[+-]/.test(s) && !/^[+-][0-9 ()./-]*$/.test(s);
}

/**
 * RFC 4180 cell: quote when it holds a comma, a quote, CR or LF; double the
 * inner quotes. A formula-looking cell is first neutered with a leading
 * apostrophe, which spreadsheets read as "this is text".
 */
export function csvCell(v) {
  let s = v == null ? '' : String(v);
  if (needsFormulaGuard(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Rows of plain objects → CSV text with a header row. CRLF line endings, as Excel expects. */
export function toCsv(rows, columns = CSV_COLUMNS) {
  const head = columns.map(csvCell).join(',');
  const body = (rows || []).map((r) => columns.map((c) => csvCell(r ? r[c] : '')).join(','));
  return [head, ...body].join('\r\n');
}

/** Desk visitor chips. Shared by the desk UI and the server where-clause builder. */
export const DESK_FILTERS = ['all', 'unclaimed', 'claimed', 'reserved', 'winners'];
