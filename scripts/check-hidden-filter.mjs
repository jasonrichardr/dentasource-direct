// check-hidden-filter.mjs — the studio's hide button has to actually hide.
//
// The studio writes `hidden: true` on any entry of any manifest it edits. That flag is
// worth exactly as much as the number of consumers that read it, and a consumer that
// forgets is invisible: the beat still renders, the studio still shows it greyed out, and
// nobody finds out until Jarich asks why hiding did nothing.
//
// ☠️ THIS IS NOT A HYPOTHETICAL FAILURE MODE. installs.json spent a round being edited by
// a studio that could not change a pixel, because the page was reading a copy of the list
// from inside the beat instead of from the manifest (6be5842). A grep run once proves
// today. This runs on every build.
//
// The rule it enforces: if a module imports a manifest the studio can edit, every read of
// that manifest's array must pass through visible() from src/lib/cinema/visible.js.
//
// Deliberately a source check rather than a runtime one. A runtime assertion could only
// fire on a page somebody happened to load, and the whole point is the beat NOBODY loads.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');

// The manifests the studio can write `hidden` into, from src/lib/studio/registry.js.
// Kept as basenames so a manifest moving directory does not silently drop out of the gate.
const GUARDED = [
  'home-beats.json', 'about-beats.json', 'contact-beats.json', 'products.json',
  'ask-dsd.json', 'action-reels.json', 'installs.json', 'crew-shots.json',
  'growth-partner.json', 'reel-library.json', 'training-media.json', 'parts.json',
];

// The studio owns the raw files: it MUST read them unfiltered, that is its job.
const EXEMPT = ['src/app/studio/', 'src/app/api/studio/', 'src/lib/studio/'];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(js|jsx|ts|tsx|mjs)$/.test(e.name)) out.push(p);
  }
  return out;
}

const problems = [];
const checked = [];

for (const file of walk(SRC)) {
  const rel = path.relative(ROOT, file);
  if (EXEMPT.some((x) => rel.startsWith(x))) continue;
  const src = fs.readFileSync(file, 'utf8');

  // Which guarded manifests does this module import, and under what local name?
  const imports = [...src.matchAll(/import\s+(\w+)\s+from\s+['"]([^'"]+\.json)['"]/g)]
    .filter(([, , spec]) => GUARDED.includes(path.basename(spec)));
  if (!imports.length) continue;

  const filtersVisible = /\bvisible\s*\(/.test(src);
  for (const [, local, spec] of imports) {
    const manifest = path.basename(spec);
    checked.push({ rel, local, manifest });

    if (!filtersVisible) {
      problems.push(`${rel}: imports ${manifest} as \`${local}\` and never calls visible()`);
      continue;
    }
    // Every `local.<array>` read must sit inside a visible( ... ) call. Checked by finding
    // each read and looking back for an unclosed `visible(` on the same expression.
    for (const m of src.matchAll(new RegExp(`\\b${local}\\.([A-Za-z_$][\\w$]*)`, 'g'))) {
      const before = src.slice(Math.max(0, m.index - 60), m.index);
      // ☠️ THE ONLY ESCAPE HATCH IS AN EXPLICIT, REASONED ONE. An earlier version of this
      // check waved through any read near a .some( or .length, which would have let a real
      // miss past on any consumer that happened to count something first. A read that
      // genuinely wants the UNFILTERED list has to say so on its own line and say why.
      const lineText = src.slice(src.lastIndexOf('\n', m.index) + 1,
        (src.indexOf('\n', m.index) + 1 || src.length));
      const wrapped = /visible\(\s*(?:\.\.\.)?$/.test(before)
        || /\/\* unfiltered: .+ \*\//.test(lineText);
      if (!wrapped) {
        const line = src.slice(0, m.index).split('\n').length;
        problems.push(`${rel}:${line}: \`${local}.${m[1]}\` is read without visible()`);
      }
    }
  }
}

if (!checked.length) {
  console.error('  hidden filter guard: FOUND NO CONSUMERS AT ALL, which means this check is broken');
  process.exit(1);
}

if (problems.length) {
  console.error('\n  hidden filter guard: FAILED\n');
  for (const p of problems) console.error(`    ${p}`);
  console.error('\n  Every studio-editable manifest must be filtered through visible()');
  console.error('  from src/lib/cinema/visible.js, at module scope. See that file for why.\n');
  process.exit(1);
}

const byFile = new Map();
for (const c of checked) byFile.set(c.rel, (byFile.get(c.rel) || 0) + 1);
console.log(`  hidden filter guard: ${checked.length} manifest reads across ${byFile.size} consumers, all filtered`);
for (const [f, n] of byFile) console.log(`    ${n}  ${f}`);
