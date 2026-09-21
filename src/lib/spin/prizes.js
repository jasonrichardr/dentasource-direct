// NADTI 2026 booth wheel. Pure module: no Next, no Prisma, unit-tested with node --test.
// Weights are chances out of 100 per spin. Caps are ceilings for the whole event
// (or physical stock). When a prize is exhausted its weight flows to `fallback`.

export const PRIZES = [
  { id: 'credits30k', label: '₱30,000 Training Credits', short: '₱30K CREDITS', weight: 1, cap: 1, fallback: 'off10', kind: 'credits' },
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

// Live booth overrides from the desk: { [id]: { active?: boolean, weight?: number, cap?: number|null } }.
// Merge with the defaults; nothing here touches PRIZES itself.
export function effectivePrizes(overrides = {}) {
  return PRIZES.map((p) => {
    const o = overrides[p.id] || {};
    const weight = typeof o.weight === 'number' && o.weight >= 0 ? o.weight : p.weight;
    const cap = o.cap === null ? null : typeof o.cap === 'number' && o.cap >= 0 ? o.cap : p.cap;
    return { ...p, weight, cap, active: o.active !== false };
  });
}

// Effective weights after on/off, caps/stock, and the spin-again exclusion.
// An inactive prize is treated like an exhausted one: its weight flows to the
// fallback. PRIZES order processes each fallback after its source (credits →
// off10 → off5 → fogfree), and a final pass zeroes anything switched off that
// received inflow later in the list (ecobag/ballpen → fogfree).
export function resolveWeights(counts = {}, { excludeSpinAgain = false, overrides = {} } = {}) {
  const list = effectivePrizes(overrides);
  const w = Object.fromEntries(list.map((p) => [p.id, p.weight]));
  if (excludeSpinAgain) w.spinagain = 0;
  for (const p of list) {
    const exhausted = p.cap != null && (counts[p.id] || 0) >= p.cap;
    if ((!p.active || exhausted) && w[p.id] > 0) {
      if (p.fallback) w[p.fallback] += w[p.id];
      w[p.id] = 0;
    }
  }
  for (const p of list) if (!p.active) w[p.id] = 0;
  // Guard: if everything is off, fall back to Fog Free so the wheel never stalls.
  if (Object.values(w).every((x) => x <= 0)) w.fogfree = 1;
  return w;
}

/** Chance per prize as a percentage of the effective total, for the desk to show what visitors really face. */
export function effectiveChances(counts = {}, overrides = {}) {
  const w = resolveWeights(counts, { overrides });
  const total = Object.values(w).reduce((a, b) => a + b, 0) || 1;
  return Object.fromEntries(Object.entries(w).map(([id, x]) => [id, Math.round((x / total) * 1000) / 10]));
}

export function wedgeIndexFor(id, random = Math.random) {
  const slots = WEDGES.map((w, i) => (w === id ? i : -1)).filter((i) => i >= 0);
  if (!slots.length) throw new Error(`No wedge for prize ${id}`);
  return slots[Math.min(slots.length - 1, Math.floor(random() * slots.length))];
}

export function pickPrize({ counts = {}, random = Math.random, excludeSpinAgain = false, overrides = {} } = {}) {
  const w = resolveWeights(counts, { excludeSpinAgain, overrides });
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
