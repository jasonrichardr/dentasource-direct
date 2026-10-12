// lib/cinema/partsPick.js: WHICH spare parts the home arc shows, as a pure function.
//
// Moved out of PartsPanel (panels.jsx) VERBATIM on 2026-10-07 so the reach map's "Spare parts
// on hand in Pasig" column shows the very parts, images and names the After sales beat shows.
// The input is parts.json's list AFTER visible(); the caller filters at module scope.

/** How many parts the arc carries. The file holds 244; a marquee that long is a
 *  warehouse inventory, not a shelf, and every extra tile is another image to fetch. */
export const PARTS_SHOWN = 28;

export function pickParts(parts, shown = PARTS_SHOWN) {
  // ☠️ A SPREAD, NOT A PREFIX. Taking the first 28 of the file would hand the beat
  // whichever category happens to sort first; going round the categories in turn shows
  // a chair's worth of parts instead: upholstery, then a syringe, then a light, and so
  // on. Anything filed as Other is used last, since those are the least legible names.
  // ☠️ DEDUPE BY NAME FIRST. builder-products warned that several genuinely different
  // parts share a caption: "Supply pipe" appears four times among the labelled ones and
  // "Light arm" three. They are real distinct parts, but a marquee that says Supply pipe
  // four times in one sweep reads as a rendering bug, not as a catalogue. One tile per
  // caption; unnamed parts are never deduped because they carry no caption to repeat.
  const usedNames = new Set();
  const buckets = new Map();
  for (const part of parts) {
    if (part.name) {
      if (usedNames.has(part.name)) continue;
      usedNames.add(part.name);
    }
    const k = part.category && part.category !== 'Other' ? part.category : '~other';
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k).push(part);
  }
  const keys = [...buckets.keys()].sort();
  const picked = [];
  for (let round = 0; picked.length < shown; round += 1) {
    let addedThisRound = false;
    for (const k of keys) {
      const list = buckets.get(k);
      if (round < list.length) { picked.push(list[round]); addedThisRound = true; }
      if (picked.length >= shown) break;
    }
    if (!addedThisRound) break;          // every bucket exhausted
  }
  return picked;
}

/**
 * EVERY PART, for the home's After sales rows (Jarich, 2026-10-12: "we have more spare parts,
 * check what's missing": the rows carried 28 of 244). The reach map keeps pickParts' 28.
 *
 * ☠️ AN EVEN SPREAD, NOT pickParts WITH A BIGGER NUMBER. pickParts files Other last, and 158
 * of the 244 are Other, so the back half of the rows would be one long run of look-alike
 * Other tiles. Here every category is spaced evenly over the whole list (each part sits at
 * its category's (i + 0.5) / n mark), and inside a category every name's first copy comes
 * before any name's second, so the 79 parts that share a caption with another part
 * ("Supply pipe" is four real parts) land as far apart as the list allows.
 */
export function spreadAllParts(parts) {
  const buckets = new Map();
  for (const part of parts) {
    const k = part.category || 'Other';
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k).push(part);
  }
  const placed = [];
  for (const [k, list] of buckets) {
    const seen = new Map();
    const ordered = list
      .map((part, i) => {
        const n = seen.get(part.name) || 0;
        seen.set(part.name, n + 1);
        return { part, copy: n, i };
      })
      .sort((a, b) => a.copy - b.copy || a.i - b.i);
    ordered.forEach(({ part }, i) => placed.push({ part, at: (i + 0.5) / ordered.length, k }));
  }
  placed.sort((a, b) => a.at - b.at || (a.k < b.k ? -1 : a.k > b.k ? 1 : 0));
  const out = placed.map((p) => p.part);
  // Two same-name parts from DIFFERENT categories can still land a tile or two apart. A
  // greedy pass pulls the next part whose name is not in the last GAP tiles forward.
  // At the very end there is nothing left to pull forward, so those swap with an earlier
  // tile instead, provided neither name then sits within GAP of its twin.
  const GAP = 6;
  const clashes = (idx, name, skip) => {
    for (let n = Math.max(0, idx - GAP); n <= Math.min(out.length - 1, idx + GAP); n += 1) {
      if (n !== idx && n !== skip && out[n].name === name) return true;
    }
    return false;
  };
  for (let i = 1; i < out.length; i += 1) {
    const recent = new Set(out.slice(Math.max(0, i - GAP), i).map((x) => x.name));
    if (!recent.has(out[i].name)) continue;
    let j = out.findIndex((x, n) => n > i && !recent.has(x.name));
    if (j < 0) j = out.findIndex((x, n) => n < i - GAP && !clashes(n, out[i].name, i) && !clashes(i, x.name, n));
    if (j >= 0) [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
