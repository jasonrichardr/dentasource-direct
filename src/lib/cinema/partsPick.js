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
