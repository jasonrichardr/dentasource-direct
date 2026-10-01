// scripts/www-seed.mjs — the FIRST copy of each WWW strip, built from the very lists the
// home page bakes today.
//
// WWW (2026-10-01): five home-arc strips are arranged by the team in the console
// (console.dentasourcedirect.com). Before anyone can arrange a strip, the console needs a
// copy of what the page shows now. This script builds that copy with the SAME code the page
// runs (src/lib/cinema/homeDecks.js, after visible(), in mixOrder's order) and writes it as
// the argument object of the console's seed mutation.
//
//   node scripts/www-seed.mjs --dry                       counts per strip, writes nothing
//   node scripts/www-seed.mjs --out /tmp/www-seed.json    the seed file
//   node scripts/www-seed.mjs --out f.json --deck crew    a subset (comma list)
//
// Then, from the CONSOLE repo root (it has no path to this repo, by its own law):
//   unset CONVEX_DEPLOYMENT CONVEX_DEPLOY_KEY
//   bunx convex run wwwPublic:seedDecks "$(cat /tmp/www-seed.json)"
//
// ☠️ RE-RUNNING IS SAFE AND THAT IS THE POINT. The mutation writes a strip only while no
// person has edited it; a strip the team has touched is reported "kept" and left alone.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { visible } from '../src/lib/cinema/visible.js';
import { buildHomeDecks, bakedDeckLists, seedTileFor } from '../src/lib/cinema/homeDecks.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const J = (name) => JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/cinema', `${name}.json`), 'utf8'));

const args = process.argv.slice(2);
const flag = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const OUT = flag('--out');
const ONLY = flag('--deck') ? flag('--deck').split(',').map((s) => s.trim()).filter(Boolean) : null;
const DRY = args.includes('--dry') || !OUT;

// The same seven visible() reads HomeCinema makes at module scope, under the same names.
const HOME_BEATS = visible(J('home-beats').beats);
const REEL_LIBRARY = visible(J('reel-library').reels);
const TRAINING_ITEMS = visible(J('training-media').items);
const ACTION_ITEMS = visible(J('action-reels').items);
const CREW_SHOTS = visible(J('crew-shots').items);
const INSTALL_TILES = visible(J('installs').tiles);
const GROWTH_ITEMS = visible(J('growth-partner').items);

const MIXED = buildHomeDecks({ HOME_BEATS, REEL_LIBRARY, ACTION_ITEMS, TRAINING_ITEMS, GROWTH_ITEMS, INSTALL_TILES });
const LISTS = bakedDeckLists(MIXED, CREW_SHOTS);

// The console's default caption per strip (convex/lib/wwwDecks.ts), for an item with none.
const FALLBACK = {
  people: 'The DentaSource team',
  showroom: 'The showroom floor in Pasig',
  training: 'Inside the Training Center in Pasig',
  nationwide: 'On the road with a delivery',
  crew: 'The DentaSource after sales crew',
};
const SHOWN = { people: 44, showroom: 44, training: 44, nationwide: 44, crew: 18 };

const decks = {};
let failed = false;
for (const [deck, items] of Object.entries(LISTS)) {
  if (ONLY && !ONLY.includes(deck)) continue;
  const tiles = items.map((it) => seedTileFor(it, FALLBACK[deck]));
  const ids = new Set();
  for (const t of tiles) {
    if (ids.has(t.id)) { console.error(`  ${deck}: tile id ${t.id} appears twice (${t.src})`); failed = true; }
    ids.add(t.id);
    if (deck === 'crew' && t.type !== 'image') { console.error(`  crew: ${t.src} is not a photo`); failed = true; }
    if (!t.src.startsWith('/')) { console.error(`  ${deck}: ${t.src} is not a site path`); failed = true; }
  }
  if (!tiles.length) { console.error(`  ${deck}: EMPTY, refusing (an empty strip means the baked list)`); failed = true; }
  decks[deck] = tiles;
}

const body = JSON.stringify({ decks });
console.log('\n  WWW seed, built from the lists the home page bakes now\n');
console.log('  strip        tiles  photos  videos  plays');
for (const [deck, tiles] of Object.entries(decks)) {
  const v = tiles.filter((t) => t.type === 'video').length;
  console.log(`  ${deck.padEnd(12)} ${String(tiles.length).padStart(5)}  ${String(tiles.length - v).padStart(6)}  ${String(v).padStart(6)}  first ${Math.min(SHOWN[deck], tiles.length)}`);
}
console.log(`\n  ${Object.values(decks).reduce((n, t) => n + t.length, 0)} tiles, ${(body.length / 1024).toFixed(1)} KB of JSON`);

if (failed) { console.error('\n  REFUSING: fix the lines above first.\n'); process.exit(1); }
if (DRY) {
  console.log('\n  dry run: nothing written. Add --out <file> to write the seed.\n');
} else {
  fs.writeFileSync(OUT, body);
  console.log(`\n  wrote ${OUT}\n  then, from the console repo root:\n    unset CONVEX_DEPLOYMENT CONVEX_DEPLOY_KEY\n    bunx convex run wwwPublic:seedDecks "$(cat ${OUT})"\n`);
}
