// Render and motion verification for the cinema pages.
//
// Two passes the browser-automation MCPs cannot do, because both need launch arguments:
// software rendering, and a context that genuinely reports prefers-reduced-motion.
//
//   node scripts/phase-c.mjs --gl=swiftshader --pages=/,/a3 --shots
//   node scripts/phase-c.mjs --gl=hardware --reduced --pages=/,/a3 --shots
//
// Flags: --base (default http://localhost:3132) · --pages (comma separated) · --out
// (screenshot directory) · --w / --h (viewport, default 390x844) · --shots · --reduced
// · --gl=hardware|swiftshader. Point it at a built site: `next build && next start`.
//
// Needs playwright-core and a real Chrome; it drives the installed browser rather than a
// downloaded one, so nothing is added to the repo's dependencies:
//   npm i --no-save playwright-core
//
// WHY THE ASSERTS ARE THE POINT. The WebGL floor in CinemaPage redirects to /classic when
// no context can be created, so a screenshot of the wrong page photographs as a pass. And
// a canvas that exists is not a canvas that drew anything. So this script checks the
// pathname it actually landed on, reads the GL renderer string back, and counts lit
// pixels off the canvas with readPixels. A gate that cannot fail is not a gate.

import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : fallback;
};
const flag = (name) => process.argv.includes(`--${name}`);

const BASE = arg('base', 'http://localhost:3132');
const GL = arg('gl', 'hardware');
const PAGES = arg('pages', '/,/a3').split(',');
const OUT = arg('out', '/Users/jarich/second-brain/builds/dsd-site-overhaul/proof');
const REDUCED = flag('reduced');
const SHOTS = flag('shots');
const VIEWPORT = { width: Number(arg('w', 390)), height: Number(arg('h', 844)) };

// SwiftShader is Chrome's software rasteriser. --enable-unsafe-swiftshader is required
// from Chrome 127 on, which is what actually lets WebGL fall back to it rather than
// failing the context outright.
const SOFTWARE_ARGS = [
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--enable-unsafe-swiftshader',
  '--disable-gpu',
];

const label = `${GL}${REDUCED ? '+reduced' : ''}`;
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  channel: 'chrome',
  args: GL === 'swiftshader' ? SOFTWARE_ARGS : [],
});
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 1,
  reducedMotion: REDUCED ? 'reduce' : 'no-preference',
});

const results = [];
for (const path of PAGES) {
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto(BASE + path, { waitUntil: 'load' });
  await page.waitForTimeout(4000);

  const probe = await page.evaluate(() => {
    const canvas = document.getElementById('gl');
    let renderer = 'no canvas';
    let painted = null;
    if (canvas) {
      try {
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        const dbg = gl.getExtension('WEBGL_debug_renderer_info');
        renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
        // a blank canvas is the failure this whole pass exists to catch, so count lit pixels
        const px = new Uint8Array(canvas.width * canvas.height * 4);
        gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, px);
        let lit = 0;
        for (let i = 0; i < px.length; i += 4 * 97) if (px[i] + px[i + 1] + px[i + 2] > 12) lit++;
        painted = lit;
      } catch (e) {
        renderer = 'ERR ' + e.message;
      }
    }
    return {
      pathname: location.pathname,
      theme: document.documentElement.getAttribute('data-theme'),
      beats: document.querySelectorAll('.cinema-beat').length,
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
      dpr: devicePixelRatio,
      renderer,
      painted,
    };
  });

  // THE FLOOR MUST NOT HAVE FIRED. It redirects to /classic when no GL context can be
  // made, so a wrong pathname here is the finding, not a detail.
  probe.floorFired = probe.pathname !== path && probe.pathname.startsWith('/classic');
  probe.pathOk = probe.pathname === path;
  probe.requested = path;
  probe.errors = errors;

  if (SHOTS) {
    const name = `${path === '/' ? 'home' : path.replace(/\//g, '')}-${label}.png`;
    await page.screenshot({ path: `${OUT}/${name}`, scale: 'css' });
    probe.shot = name;
  }

  results.push(probe);
  await page.close();
}

await context.close();
await browser.close();
console.log(JSON.stringify({ label, viewport: VIEWPORT, base: BASE, results }, null, 2));
