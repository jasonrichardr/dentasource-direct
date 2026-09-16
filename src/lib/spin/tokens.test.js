import { test } from 'node:test';
import assert from 'node:assert/strict';
process.env.SPIN_DESK_PIN = '123456';
const { qrTokenFor, codeFromQrToken, tokenFor, isDeskCookie } = await import('./tokens.js');

test('qr token round trip and tamper rejection', () => {
  const t = qrTokenFor('k7m2p9x');
  assert.match(t, /^K7M2P9X\.[0-9a-f]{10}$/);
  assert.equal(codeFromQrToken(t), 'K7M2P9X');
  assert.equal(codeFromQrToken(t.toLowerCase()), 'K7M2P9X');
  assert.equal(codeFromQrToken('K7M2P9X.0000000000'), null);
  assert.equal(codeFromQrToken('K7M2P9Y.' + t.split('.')[1]), null);
  assert.equal(codeFromQrToken('hello'), null);
  assert.equal(codeFromQrToken(''), null);
});

test('desk cookie token depends on the PIN', () => {
  const a = tokenFor('desk');
  assert.ok(isDeskCookie(a));
  assert.ok(!isDeskCookie('1'));
  assert.ok(!isDeskCookie(a.slice(0, -1) + 'x'));
});
