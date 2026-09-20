import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizePhone, splitName, makeCode, isValidCode, isValidEmail, eventStatus,
  messageFor, parseMessage, claimedMessage, CODE_ALPHABET,
} from './format.js';
import { reservedMessage, parseReserved, countdownParts, WINDOW_START_MS } from './format.js';
import { csvCell, toCsv, CSV_COLUMNS } from './format.js';

test('normalizePhone accepts PH mobile formats', () => {
  assert.equal(normalizePhone('0917 123 4567'), '+639171234567');
  assert.equal(normalizePhone('+63 917-123-4567'), '+639171234567');
  assert.equal(normalizePhone('9171234567'), '+639171234567');
  assert.equal(normalizePhone('639171234567'), '+639171234567');
});

test('normalizePhone rejects junk and landlines', () => {
  assert.equal(normalizePhone('12'), null);
  assert.equal(normalizePhone('02 8123 4567'), null);
  assert.equal(normalizePhone(''), null);
  assert.equal(normalizePhone('+1 415 555 0100'), null);
});

test('splitName', () => {
  assert.deepEqual(splitName('Juan Dela Cruz'), { firstName: 'Juan Dela', lastName: 'Cruz' });
  assert.deepEqual(splitName('  Maria   Santos '), { firstName: 'Maria', lastName: 'Santos' });
  assert.deepEqual(splitName('Cher'), { firstName: 'Cher', lastName: '-' });
  assert.deepEqual(splitName(''), { firstName: '', lastName: '' });
});

test('claim codes use the unambiguous alphabet', () => {
  assert.ok(!/[0O1I]/.test(CODE_ALPHABET));
  assert.equal(CODE_ALPHABET.length, 32);
  const c = makeCode();
  assert.equal(c.length, 7);
  assert.ok(isValidCode(c));
  assert.equal(makeCode(() => 0), 'AAAAAAA');
  assert.equal(makeCode(() => 0.999), '9999999');
  assert.equal(makeCode(() => 0, 4), 'AAAA');
  assert.ok(isValidCode('AB7K'));
  assert.ok(!isValidCode('AB0I'));
  assert.ok(!isValidCode('ABCDEFGHJ'));
});

test('email check', () => {
  assert.ok(isValidEmail('doc@clinic.ph'));
  assert.ok(!isValidEmail('doc@clinic'));
  assert.ok(!isValidEmail('nope'));
});

test('eventStatus follows the Manila window in auto', () => {
  assert.equal(eventStatus({ now: new Date('2026-09-23T10:00:00+08:00') }), 'open');
  assert.equal(eventStatus({ now: new Date('2026-09-22T00:00:00+08:00') }), 'open');
  assert.equal(eventStatus({ now: new Date('2026-09-24T23:59:00+08:00') }), 'open');
  assert.equal(eventStatus({ now: new Date('2026-09-21T23:59:00+08:00') }), 'closed');
  assert.equal(eventStatus({ now: new Date('2026-09-25T00:00:01+08:00') }), 'closed');
});

test('eventStatus overrides', () => {
  const before = new Date('2026-09-16T12:00:00+08:00');
  assert.equal(eventStatus({ now: before, override: 'open' }), 'open');
  assert.equal(eventStatus({ now: new Date('2026-09-23T10:00:00+08:00'), override: 'closed' }), 'closed');
  assert.equal(eventStatus({ now: before, rehearsal: true }), 'open');
});

test('message round trip and claim stamp', () => {
  const m = messageFor({ label: '10% off', code: 'AB7K' });
  assert.equal(m, 'Prize: 10% off · Code: AB7K · Claimed: no');
  assert.deepEqual(parseMessage(m), { prizeLabel: '10% off', code: 'AB7K', claimed: null });
  assert.deepEqual(parseMessage(messageFor({ label: 'Ecobag', code: 'K7M2P9X' })), { prizeLabel: 'Ecobag', code: 'K7M2P9X', claimed: null });
  const c = claimedMessage(m, '2026-09-22 14:03');
  assert.equal(c, 'Prize: 10% off · Code: AB7K · Claimed: 2026-09-22 14:03 by desk');
  assert.equal(parseMessage(c).claimed, '2026-09-22 14:03 by desk');
  assert.equal(parseMessage('hello'), null);
});

test('reserved message round trip and never parses as a prize', () => {
  const m = reservedMessage('ABCD234');
  assert.equal(m, 'Reserved spin · Code: ABCD234 · Spun: no');
  assert.deepEqual(parseReserved(m), { code: 'ABCD234' });
  assert.equal(parseMessage(m), null);
  assert.equal(parseReserved('Prize: Ballpen · Code: ABCD234 · Claimed: no'), null);
});

test('countdown parts split the gap and flag done at the target', () => {
  const t = WINDOW_START_MS;
  assert.deepEqual(countdownParts(t, t - (2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000), { done: false, days: 2, hours: 3, minutes: 4, seconds: 5 });
  assert.equal(countdownParts(t, t).done, true);
  assert.equal(countdownParts(t, t + 1000).days, 0);
});

test('csvCell quotes only what needs quoting', () => {
  assert.equal(csvCell('Ecobag'), 'Ecobag');
  assert.equal(csvCell(''), '');
  assert.equal(csvCell(null), '');
  assert.equal(csvCell(undefined), '');
  assert.equal(csvCell('Smile Dental, Inc.'), '"Smile Dental, Inc."');
  assert.equal(csvCell('He said "hi"'), '"He said ""hi"""');
  assert.equal(csvCell('line1\nline2'), '"line1\nline2"');
  assert.equal(csvCell('line1\r\nline2'), '"line1\r\nline2"');
  assert.equal(csvCell('+639171234567'), '+639171234567');
  assert.equal(csvCell('₱30,000 Training Credits'), '"₱30,000 Training Credits"');
});

test('toCsv writes a header and CRLF rows', () => {
  const csv = toCsv([
    { name: 'Juan Cruz', clinic: 'Smile Dental, Inc.', phone: '+639171234567', email: 'juan@clinic.ph', code: 'AB7K2M9', prize: '10% off', claimed: 'no', reserved: 'no', created: '2026-09-22 14:03' },
  ]);
  const lines = csv.split('\r\n');
  assert.equal(lines.length, 2);
  assert.equal(lines[0], 'name,clinic,phone,email,code,prize,claimed,reserved,created');
  assert.equal(lines[1], 'Juan Cruz,"Smile Dental, Inc.",+639171234567,juan@clinic.ph,AB7K2M9,10% off,no,no,2026-09-22 14:03');
});

test('toCsv on no rows is the header alone', () => {
  assert.equal(toCsv([]), 'name,clinic,phone,email,code,prize,claimed,reserved,created');
  assert.equal(toCsv(null), 'name,clinic,phone,email,code,prize,claimed,reserved,created');
});

test('toCsv fills missing fields and survives an embedded newline', () => {
  const csv = toCsv([{ name: 'Cher', created: '2026-09-22 09:00' }, { name: 'A\nB' }]);
  const lines = csv.split('\r\n');
  assert.equal(lines[1], 'Cher,,,,,,,,2026-09-22 09:00');
  assert.ok(lines[2].startsWith('"A\nB",'));
  // the quoted newline must not be mistaken for a record separator
  assert.equal(csv.split('\r\n').length, 3);
});

test('CSV_COLUMNS is the agreed desk export shape', () => {
  assert.deepEqual(CSV_COLUMNS, ['name', 'clinic', 'phone', 'email', 'code', 'prize', 'claimed', 'reserved', 'created']);
});
