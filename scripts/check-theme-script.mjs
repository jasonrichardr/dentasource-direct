// Build guard for the pre-paint theme script.
//
// WHY THIS EXISTS. The inline <head> script that stamps data-theme before first paint was
// once written as three template literals joined with `+`. Node printed the correct string
// from that source, and every test that read the source passed, but what the bundler
// folded into the built HTML was three spliced fragments:
//     (function(){try{var k='dsd:themedocument.documentElement.setAttribute('data-theme','dark');}})();
// That throws `Unexpected identifier 'data'`, so nothing was stamped and every page
// flashed the wrong theme on load. Nothing in the source could have caught it. So this
// guard reads the SERVED artifact instead, which is the only place the truth lives.
//
// It fails the build if the script in the built HTML is not character for character the
// literal in theme.js, on every prerendered page that uses the root layout.

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, 'src/cinema/theme/theme.js');
const BUILT = path.join(ROOT, '.next/server/app');

const die = (msg) => {
  console.error(`\n  theme script guard FAILED\n\n  ${msg}\n`);
  process.exit(1);
};

const source = await readFile(SOURCE, 'utf8');

// The shape is part of the contract: ONE plain double-quoted literal, nothing to fold.
const literal = source.match(/export const THEME_SCRIPT\s*=\s*"([^"]+)";/);
if (!literal) {
  die(
    `THEME_SCRIPT in src/cinema/theme/theme.js must be ONE plain double-quoted string\n` +
    `  literal on a single statement. A template literal, or two pieces joined with +,\n` +
    `  is what the bundler splices into a syntax error.`
  );
}
const script = literal[1];

// and it must still say what it is for
const key = source.match(/export const THEME_KEY\s*=\s*["']([^"']+)["']/)?.[1];
const fallback = source.match(/export const DEFAULT_THEME\s*=\s*["']([^"']+)["']/)?.[1];
if (!key || !script.includes(`localStorage.getItem('${key}')`)) {
  die(`the literal must read localStorage.getItem('${key ?? '<THEME_KEY>'}'); it does not.`);
}
if (!fallback || !script.includes(`var v='${fallback}'`)) {
  die(`the literal must default to '${fallback ?? '<DEFAULT_THEME>'}'; it does not.`);
}
if (!script.includes("setAttribute('data-theme'")) {
  die('the literal must stamp data-theme; it does not.');
}

if (!existsSync(BUILT)) {
  // Nothing to inspect. Say so rather than passing silently, but do not block a build
  // over a directory layout this guard does not recognise.
  console.warn('  theme script guard: no .next/server/app, skipped');
  process.exit(0);
}

const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith('.html') && !entry.name.startsWith('_')) out.push(full);
  }
  return out;
};

const pages = await walk(BUILT);
if (pages.length === 0) {
  console.warn('  theme script guard: no prerendered pages, skipped');
  process.exit(0);
}

// ☠️ CHECK THE TAG, NOT THE FILE. A first version of this guard asked whether the string
// appeared anywhere in the HTML, and it passed with the historical splice planted in the
// head, because React also serialises the head into the RSC flight payload further down
// the page. That copy is not what the browser runs. So: read the inline <script> tags
// only, and require one of them to BE the script.
const INLINE_SCRIPT = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi;

const missing = [];
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const inline = [...html.matchAll(INLINE_SCRIPT)].map((m) => m[1]);
  const stamped = inline.some((body) => body.includes(script));
  // a stamp that is not THE stamp is the failure this guard was written for
  const impostor = inline.find((body) => body.includes('data-theme') && !body.includes(script));
  if (!stamped || impostor) missing.push(path.relative(ROOT, page));
}

if (missing.length) {
  die(
    `${missing.length} of ${pages.length} prerendered pages do not carry the exact\n` +
    `  pre-paint script, so they will flash the wrong theme:\n\n    ` +
    missing.slice(0, 8).join('\n    ') +
    (missing.length > 8 ? `\n    ... and ${missing.length - 8} more` : '') +
    `\n\n  Expected, character for character:\n\n    ${script}`
  );
}

console.log(`  theme script guard: intact on ${pages.length} pages`);
