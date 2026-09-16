import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRIZES, WEDGES, pickPrize, resolveWeights, wedgeIndexFor } from './prizes.js';

const seq = (...vals) => { let i = 0; return () => vals[Math.min(i++, vals.length - 1)]; };

test('weights sum to 100', () => {
  assert.equal(PRIZES.reduce((a, p) => a + p.weight, 0), 100);
});

test('twelve wedges and every prize has at least one', () => {
  assert.equal(WEDGES.length, 12);
  for (const p of PRIZES) assert.ok(WEDGES.includes(p.id), p.id);
});

test('wedge multiplicity matches the spec', () => {
  const n = (id) => WEDGES.filter((w) => w === id).length;
  assert.deepEqual(
    { credits30k: n('credits30k'), off10: n('off10'), off5: n('off5'), spinagain: n('spinagain'), fogfree: n('fogfree'), ecobag: n('ecobag'), ballpen: n('ballpen') },
    { credits30k: 1, off10: 1, off5: 1, spinagain: 1, fogfree: 2, ecobag: 3, ballpen: 3 },
  );
});

test('random 0 with no counts lands on credits30k and its only wedge', () => {
  const r = pickPrize({ counts: {}, random: seq(0, 0) });
  assert.equal(r.id, 'credits30k');
  assert.equal(WEDGES[r.wedgeIndex], 'credits30k');
});

test('credits30k at cap falls to off10', () => {
  const r = pickPrize({ counts: { credits30k: 3 }, random: seq(0, 0) });
  assert.equal(r.id, 'off10');
});

test('credits30k and off10 at cap fall through to off5', () => {
  const r = pickPrize({ counts: { credits30k: 3, off10: 10 }, random: seq(0, 0) });
  assert.equal(r.id, 'off5');
});

test('ecobag stock exhausted flows to fogfree', () => {
  const w = resolveWeights({ ecobag: 60 });
  assert.equal(w.ecobag, 0);
  assert.equal(w.fogfree, 18 + 24);
});

test('spin again excluded on re-draw', () => {
  for (let k = 0; k < 200; k++) {
    const r = pickPrize({ counts: {}, random: Math.random, excludeSpinAgain: true });
    assert.notEqual(r.id, 'spinagain');
  }
});

test('draw walks the weight table in PRIZES order', () => {
  // total 100; r = 0.999*100 → last prize (ballpen)
  assert.equal(pickPrize({ counts: {}, random: seq(0.999, 0) }).id, 'ballpen');
  // r just past credits(1)+off10(2) = 3 → off5
  assert.equal(pickPrize({ counts: {}, random: seq(0.031, 0) }).id, 'off5');
});

test('wedgeIndexFor picks among that prize wedges', () => {
  assert.equal(WEDGES[wedgeIndexFor('ballpen', () => 0)], 'ballpen');
  assert.equal(WEDGES[wedgeIndexFor('ballpen', () => 0.99)], 'ballpen');
  assert.throws(() => wedgeIndexFor('nope'));
});

test('distribution over 20k draws is close to the weights', () => {
  const n = 20000; const tally = {};
  for (let i = 0; i < n; i++) { const { id } = pickPrize({}); tally[id] = (tally[id] || 0) + 1; }
  for (const p of PRIZES) {
    const pct = (tally[p.id] || 0) / n * 100;
    assert.ok(Math.abs(pct - p.weight) < 1.2, `${p.id}: ${pct.toFixed(2)} vs ${p.weight}`);
  }
});
