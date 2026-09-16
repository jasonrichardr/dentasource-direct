// NADTI 2026 booth wheel. Pure module: no Next, no Prisma, unit-tested with node --test.
// Weights are chances out of 100 per spin. Caps are ceilings for the whole event
// (or physical stock). When a prize is exhausted its weight flows to `fallback`.

export const PRIZES = [
  { id: 'credits30k', label: '₱30,000 Training Credits', short: '₱30K CREDITS', weight: 1, cap: 3, fallback: 'off10', kind: 'credits' },
  { id: 'off10', label: '10% off', short: '10% OFF', weight: 2, cap: 10, fallback: 'off5', kind: 'discount' },
  { id: 'off5', label: '5% off', short: '5% OFF', weight: 3, cap: 15, fallback: 'fogfree', kind: 'discount' },
  { id: 'spinagain', label: 'Spin again', short: 'SPIN AGAIN', weight: 6, cap: null, fallback: null, kind: 'respin' },
  { id: 'fogfree', label: 'Fog Free', short: 'FOG FREE', weight: 18, cap: null, fallback: null, kind: 'gift' },
  { id: 'ecobag', label: 'Ecobag', short: 'ECOBAG', weight: 24, cap: 60, fallback: 'fogfree', kind: 'gift' },
  { id: 'ballpen', label: 'Ballpen', short: 'BALLPEN', weight: 46, cap: 150, fallback: 'fogfree', kind: 'gift' },
];

// Clockwise from the pointer at 12 o'clock. Twelve equal wedges.
export const WEDGES = [
  'off10', 'ecobag', 'fogfree', 'ballpen', 'credits30k', 'ecobag',
  'spinagain', 'ballpen', 'off5', 'fogfree', 'ecobag', 'ballpen',
];

export const PRIZE_BY_ID = Object.fromEntries(PRIZES.map((p) => [p.id, p]));

export function prizeById(id) {
  return PRIZE_BY_ID[id] || null;
}

// Effective weights after caps/stock and the spin-again exclusion.
export function resolveWeights(counts = {}, { excludeSpinAgain = false } = {}) {
  const w = Object.fromEntries(PRIZES.map((p) => [p.id, p.weight]));
  if (excludeSpinAgain) w.spinagain = 0;
  // PRIZES order guarantees every fallback is processed after its source
  // or is never capped (fogfree), so one pass is enough.
  for (const p of PRIZES) {
    if (p.cap == null) continue;
    const used = counts[p.id] || 0;
    if (used >= p.cap && w[p.id] > 0) {
      w[p.fallback] += w[p.id];
      w[p.id] = 0;
    }
  }
  return w;
}

export function wedgeIndexFor(id, random = Math.random) {
  const slots = WEDGES.map((w, i) => (w === id ? i : -1)).filter((i) => i >= 0);
  if (!slots.length) throw new Error(`No wedge for prize ${id}`);
  return slots[Math.min(slots.length - 1, Math.floor(random() * slots.length))];
}

export function pickPrize({ counts = {}, random = Math.random, excludeSpinAgain = false } = {}) {
  const w = resolveWeights(counts, { excludeSpinAgain });
  const total = Object.values(w).reduce((a, b) => a + b, 0);
  let r = random() * total;
  let chosen = PRIZES[PRIZES.length - 1].id;
  for (const p of PRIZES) {
    if (w[p.id] <= 0) continue;
    if (r < w[p.id]) { chosen = p.id; break; }
    r -= w[p.id];
  }
  return { id: chosen, wedgeIndex: wedgeIndexFor(chosen, random) };
}
