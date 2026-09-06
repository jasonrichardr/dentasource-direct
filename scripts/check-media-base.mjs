// check-media-base.mjs — a production build without a media origin is an outage.
//
// The video left the repo on 2026-09-06 (07befe9). Every reel, every hero loop and every
// theatre copy is now served from NEXT_PUBLIC_MEDIA_BASE. If that variable is missing from
// a production build, nothing throws and nothing looks wrong in the log: the site builds,
// deploys, and then serves every video from a path that has not existed since that commit.
// The failure is invisible until somebody opens the page and finds a black marble wall.
//
// So the build refuses instead.
//
// ☠️ IT CANNOT JUST READ process.env, AND THAT IS THE WHOLE DIFFICULTY.
// npm runs this script; Next runs the build. Next loads .env.local, .env.production and
// .env itself, and an npm lifecycle script inherits NONE of that. A guard written as a
// bare process.env check would therefore fail every correctly configured local build and
// be ripped out within the hour. This resolves the value the way Next does, and then
// checks the thing that actually matters: that the base reached the BUNDLE. An env that is
// set but did not get inlined is the same outage as an env that was never set.

import fs from 'node:fs';
import path from 'node:path';

const KEY = 'NEXT_PUBLIC_MEDIA_BASE';
const ROOT = process.cwd();

/** The files Next reads, in the order it prefers them. */
const ENV_FILES = ['.env.local', `.env.${process.env.NODE_ENV || 'production'}`, '.env.production', '.env'];

function fromEnvFiles() {
  for (const f of ENV_FILES) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) continue;
    for (const raw of fs.readFileSync(p, 'utf8').split('\n')) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq < 0) continue;
      if (line.slice(0, eq).trim() !== KEY) continue;
      const v = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (v) return { value: v, source: f };
    }
  }
  return null;
}

const fromProcess = process.env[KEY] ? { value: process.env[KEY], source: 'the environment' } : null;
const found = fromProcess || fromEnvFiles();

function fail(lines) {
  console.error('\n  media base guard: FAILED\n');
  for (const l of lines) console.error(`    ${l}`);
  console.error('');
  process.exit(1);
}

if (!found) {
  fail([
    `${KEY} is not set, and this build would ship with no media origin.`,
    '',
    'Every video moved out of the repo in 07befe9, so a build without this serves',
    'them all from paths that no longer exist: a black marble wall and dead hero',
    'loops on /, /classic, /denjoy, /a1-pro, /roray-xray and /n2-pro.',
    '',
    'Locally:  add to .env.local',
    `            ${KEY}=https://srv1376990.hstgr.cloud/dsd-media`,
    'On Vercel: the variable is already set on Preview and Production. If this fired',
    '           there, it was removed or the build ran before it was added.',
  ]);
}

// ☠️ SET IS NOT THE SAME AS SHIPPED. NEXT_PUBLIC_ values are inlined at build time, so the
// only proof that the running page will have one is finding it in the built client bundle.
const chunkDir = path.join(ROOT, '.next', 'static', 'chunks');
if (fs.existsSync(chunkDir)) {
  const stack = [chunkDir];
  let hit = false;
  while (stack.length && !hit) {
    const dir = stack.pop();
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { stack.push(p); continue; }
      if (!e.name.endsWith('.js')) continue;
      if (fs.readFileSync(p, 'utf8').includes(found.value)) { hit = true; break; }
    }
  }
  if (!hit) {
    fail([
      `${KEY} is set (from ${found.source}) but did NOT reach the client bundle.`,
      `  value: ${found.value}`,
      '',
      'NEXT_PUBLIC_ values are inlined at build time. If the value is not in',
      '.next/static/chunks, the pages that ship will still ask the app origin for',
      'video that is no longer there. Check the variable was present BEFORE the build',
      'started rather than exported afterwards.',
    ]);
  }
  console.log(`  media base guard: ${found.value} (from ${found.source}), inlined in the client bundle`);
} else {
  console.log(`  media base guard: ${found.value} (from ${found.source}); no chunk dir to verify against`);
}
