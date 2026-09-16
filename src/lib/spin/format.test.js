import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizePhone, splitName, makeCode, isValidCode, isValidEmail, eventStatus,
  messageFor, parseMessage, claimedMessage, CODE_ALPHABET,
} from './format.js';

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
  assert.equal(c.length, 4);
  assert.ok(isValidCode(c));
  assert.equal(makeCode(() => 0), 'AAAA');
  assert.equal(makeCode(() => 0.999), '9999');
  assert.ok(!isValidCode('AB0I'));
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
  const c = claimedMessage(m, '2026-09-22 14:03');
  assert.equal(c, 'Prize: 10% off · Code: AB7K · Claimed: 2026-09-22 14:03 by desk');
  assert.equal(parseMessage(c).claimed, '2026-09-22 14:03 by desk');
  assert.equal(parseMessage('hello'), null);
});
