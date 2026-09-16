import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSocial, cityFromAddress, searchUrl, callConvex } from './console.js';

test('normalizeSocial handles and links', () => {
  assert.equal(normalizeSocial('facebook', '@smileclinic'), 'https://facebook.com/smileclinic');
  assert.equal(normalizeSocial('tiktok', 'smile.clinic'), 'https://tiktok.com/@smile.clinic');
  assert.equal(normalizeSocial('instagram', 'https://www.instagram.com/smileclinic/'), 'https://www.instagram.com/smileclinic/');
  assert.equal(normalizeSocial('facebook', 'm.facebook.com/smileclinic'), 'https://m.facebook.com/smileclinic');
});

test('normalizeSocial rejects wrong hosts, junk, and handles for google', () => {
  assert.equal(normalizeSocial('tiktok', 'https://facebook.com/x'), null);
  assert.equal(normalizeSocial('facebook', '@'), null);
  assert.equal(normalizeSocial('google', '@clinic'), null);
  assert.equal(normalizeSocial('google', 'https://maps.app.goo.gl/abc123'), 'https://maps.app.goo.gl/abc123');
  assert.equal(normalizeSocial('nope', 'x'), null);
});

test('cityFromAddress', () => {
  assert.equal(cityFromAddress('Unit 2, 123 Shaw Blvd, Mandaluyong, 1550 Metro Manila, Philippines'), 'Mandaluyong');
  assert.equal(cityFromAddress('Blk 4 Lot 21 & 23 Sandoval Ave, Pasig, Metro Manila'), 'Pasig');
  assert.equal(cityFromAddress('2NF FLOOR, Lexar Building, M.L. Quezon St, Angono, Rizal'), 'Angono');
  assert.equal(cityFromAddress(''), null);
});

test('searchUrl prefills the clinic name per platform', () => {
  assert.ok(searchUrl('tiktok', 'Smile Clinic').includes('Smile%20Clinic%20dental%20clinic'));
  assert.ok(searchUrl('facebook', 'Smile Clinic').startsWith('https://www.facebook.com/search/pages/?q='));
  assert.ok(searchUrl('google', 'Smile Clinic').includes('maps/search/?api=1&query='));
  assert.equal(searchUrl('x', 'y'), null);
});

test('callConvex posts the envelope and unwraps success', async () => {
  let seen;
  const fetchImpl = async (url, init) => { seen = { url, body: JSON.parse(init.body) }; return { ok: true, json: async () => ({ status: 'success', value: { ok: 1 } }) }; };
  const v = await callConvex('mutation', 'consoleNadti:intake', { key: 'k', a: 1 }, { baseUrl: 'https://x.convex.cloud', fetchImpl });
  assert.deepEqual(v, { ok: 1 });
  assert.equal(seen.url, 'https://x.convex.cloud/api/mutation');
  assert.deepEqual(seen.body, { path: 'consoleNadti:intake', args: { key: 'k', a: 1 }, format: 'json' });
});

test('callConvex throws on a Convex error envelope', async () => {
  const fetchImpl = async () => ({ ok: true, json: async () => ({ status: 'error', errorMessage: 'Unauthorized' }) });
  await assert.rejects(() => callConvex('mutation', 'x:y', {}, { baseUrl: 'https://x.convex.cloud', fetchImpl }), /Unauthorized/);
});
