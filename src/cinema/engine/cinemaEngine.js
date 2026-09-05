// engine/cinemaEngine.js — everything that touches three.js, in one module that is
// imported dynamically AFTER the page has painted.
//
// ☠️ WHY IT IS NOT IN CinemaPage. A static `import * as THREE` at the top of the page
// component puts three.js in the route's own chunk, so the browser downloads and
// evaluates a 3D engine before it can hydrate a page whose visible content is text. The
// copy is server rendered and already on screen; nothing about it needs three.js. Moving
// the engine behind an await in an effect means the DOM panels paint first and the
// engine arrives while the reader is still reading beat 0.
//
// The visible result once loaded is identical. Nothing here was made cheaper; it was
// moved off the path where somebody is waiting.

import * as THREE from 'three';
import { createPoints } from './points.js';
import { MorphChain, dampf } from './morph.js';
import { buildArcProgressive } from './arcBuilder.js';
import { buildArcOne, preloadBeatImages } from '../formations/index.js';
import { cameraKeys, cameraTarget } from '../director/camera.js';
import { CFG } from '../sky/skyConfig.js';

// DSD green on cream by day; on night the same particles lift to a bright register and
// the cloud switches to additive, because glow only reads on a dark void.
const ACCENT_DAY = '#0e7c5a', DEEP_DAY = '#065f46';
const ACCENT_NIGHT = '#69e3b0', DEEP_NIGHT = '#b9ffe0';
// The heart is the one beat that is never green.
const RED_DAY = '#b42a3a', RED_HI_DAY = '#d3495b';
const RED_NIGHT = '#e84a60', RED_HI_NIGHT = '#ff97a8';

export async function startCinema({ canvas, root, beats: arc, isDark }) {
  const S = arc.length;
  const IS_MOBILE = window.innerWidth < 820 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  const N = IS_MOBILE ? 92000 : 150000;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Every image is waited on before the build starts. Loading only the opening pair's
  // images was tried and reverted: a beat whose image has not arrived falls back to a
  // leaf silhouette without complaining, so a product page would have quietly formed the
  // wrong shape. These fetches are parallel and off the main thread; the cost this file
  // exists to fix is CPU, not network.
  const images = await preloadBeatImages(arc);

  let chain = null;
  let onBeatBuilt = () => {};
  // the wordmark's second word is sampled in the register it will be read in
  const arcForBuild = arc.map((b) => (b.kind === 'lockup' ? { ...b, isDark: !!isDark } : b));
  const builder = buildArcProgressive(N, arcForBuild, images, {
    onFormation: (i, positions, isText, colors, sizeScale) => {
      chain?.setFormation(i, positions, isText, colors, sizeScale);
      onBeatBuilt();
    },
  });
  const formations = builder.formations;
  // createPoints seeds the buffers from the first pair, so a single beat arc lends its
  // one formation to both slots.
  const { points, geometry, material } = createPoints(
    N, formations[1] ? formations : [formations[0], formations[0]],
  );

  // preserveDrawingBuffer keeps the rendered frame after the swap so a phone screenshot
  // captures the particles instead of a blank canvas. alpha + a transparent clear means
  // the canvas composites over the page's CSS paper rather than painting its own, which
  // is what lets the sky show through behind it.
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75)); // DPR clamp = mobile survival
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 21);
  scene.add(points);

  const COL_ACCENT = new THREE.Color(ACCENT_DAY);
  const COL_DEEP = new THREE.Color(DEEP_DAY);
  const COL_RED = new THREE.Color(RED_DAY);
  const COL_RED_HI = new THREE.Color(RED_HI_DAY);

  // ADDITIVE BLENDING CLIPS TO WHITE, and alpha is the wrong knob for it: the fragment
  // shader emits a non-premultiplied colour while the renderer premultiplies, so additive
  // resolves to (ONE, ONE) and the FULL colour is added no matter what uAlpha says. At
  // night the exposure therefore lives in the COLOUR. A phone packs the same formation
  // into a smaller area, so overlapping dots sum sooner and it needs the darker exposure.
  // The heart can afford to burn: green clips to white, but crimson clips to red, which
  // still looks like a heart.
  const NIGHT_EXP = IS_MOBILE ? 0.40 : 0.62;
  const NIGHT_EXP_RED = IS_MOBILE ? 0.86 : 1.0;
  const NIGHT_ALPHA = IS_MOBILE ? 0.55 : 0.66;
  const DAY_ALPHA = 0.9;
  let nightOn = false;

  // ☠️ THE LOCKUP IS BAKED PER REGISTER, so a toggle has to rebuild it. Its colours come
  // out of the source pixels and then get lifted for the night sky or taken down for the
  // cream, and neither can be undone in the shader from the other. Only the lockups are
  // rebuilt, and only when the register actually changed; measured cost is reported in
  // the console under 'cinema: lockup rebuild'.
  let lastPainted = null;
  function rebuildLockups(dark) {
    const jobs = arc
      .map((b, i) => (b.kind === 'lockup' ? i : -1))
      .filter((i) => i >= 0 && formations[i]);
    if (!jobs.length) return;
    const t0 = performance.now();
    for (const i of jobs) {
      const r = buildArcOne(N, { ...arc[i], isDark: !!dark }, images);
      if (r) chain?.setFormation(i, r.positions, false, r.colors, r.sizeScale);
    }
    // eslint-disable-next-line no-console
    console.log(`cinema: lockup rebuild ${jobs.length} formation(s) in ${Math.round(performance.now() - t0)}ms`);
    if (reduced) kick();
  }

  function paint(dark) {
    if (lastPainted !== null && lastPainted !== dark) rebuildLockups(dark);
    lastPainted = dark;
    nightOn = dark;
    COL_ACCENT.set(dark ? ACCENT_NIGHT : ACCENT_DAY);
    COL_DEEP.set(dark ? DEEP_NIGHT : DEEP_DAY);
    COL_RED.set(dark ? RED_NIGHT : RED_DAY);
    COL_RED_HI.set(dark ? RED_HI_NIGHT : RED_HI_DAY);
    if (dark) {
      COL_ACCENT.multiplyScalar(NIGHT_EXP);
      COL_DEEP.multiplyScalar(NIGHT_EXP);
      COL_RED.multiplyScalar(NIGHT_EXP_RED);
      COL_RED_HI.multiplyScalar(NIGHT_EXP_RED);
    }
    // THE SAMPLED COLOURS TAKE THE SAME EXPOSURE AS THE BRAND ONES. Multiplied, never
    // replaced: at night additive blending sums overlapping dots, and a silver ring at
    // full value clips to white exactly the way the gold wordmark once did. In light the
    // gain is 1, so the logo renders true on the cream ground under normal blending.
    material.uniforms.uTintGain.value = dark ? NIGHT_EXP : 1;
    material.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    material.uniforms.uColorA.value.copy(COL_ACCENT);
    material.uniforms.uColorB.value.copy(COL_DEEP);
    material.needsUpdate = true;
  }
  paint(!!isDark);
  material.uniforms.uMaxSize.value = IS_MOBILE ? 22 : 42;

  // the engine declares a photo sampler; give it a 1x1 dummy so WebGL never samples a
  // null texture on an arc that has no photo beat
  const dummy = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1, THREE.RGBAFormat);
  dummy.needsUpdate = true;
  material.uniforms.uVideo.value = dummy;

  chain = new MorphChain(geometry, material, formations, { smoothing: reduced ? 30 : 5.5 });
  const keys = cameraKeys(arc);

  // which beats deepen to rich green, which turn red, which hand the frame to their DOM
  // panel and so dim the cloud hard behind it
  const ACCENT_PEAKS = arc.map((b, i) => ((b.accentPeak ?? b.kind === 'lockup') ? i : -1)).filter((i) => i >= 0);
  const HEART_BEATS = arc.map((b, i) => (b.kind === 'heart' ? i : -1)).filter((i) => i >= 0);
  const DIM_BEATS = new Set(arc.map((b, i) => (b.dim ? i : -1)).filter((i) => i >= 0));

  const beatEls = [...root.querySelectorAll('.cinema-beat')];
  const panelEls = [...root.querySelectorAll('.cinema-panel')];
  const tickEls = [...root.querySelectorAll('.cinema-tick')];

  // measure each beat's scroll extent so g maps correctly across the arc
  let beatTops = [], beatHeights = [];
  const measureBeats = () => {
    const sy = window.scrollY;
    beatTops = beatEls.map((s) => s.getBoundingClientRect().top + sy);
    beatHeights = beatEls.map((s) => s.offsetHeight || 1);
  };
  // SCROLL STABILITY: lock the vh unit at load. Mobile browsers change what 100vh means
  // when the URL bar shows or hides DURING a scroll; if the track reflowed, the same
  // scroll position would map to a different beat and the morph would jump. So freeze
  // --vh now and refresh it only on a real WIDTH change, never a height-only toggle.
  let lockedWidth = window.innerWidth;
  const setVH = () => document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
  setVH();
  measureBeats();

  const currentRawOffset = () => {
    const sy = window.scrollY;
    let k = 0;
    while (k < S - 1 && sy >= beatTops[k + 1]) k++;
    const h = beatHeights[k] || 1;
    const frac = THREE.MathUtils.clamp((sy - beatTops[k]) / h, 0, 1);
    return THREE.MathUtils.clamp((k + frac) / Math.max(1, S - 1), 0, 1);
  };

  // ---- a11y gating ----
  // Screen readers ignore opacity, so without this an AT user would hear every beat at
  // once. The live beat's panel is the ONLY perceivable one; the rest are inert (which
  // also drops their controls from the tab order) and aria-hidden.
  const setBeatA11y = (activeIdx) => {
    panelEls.forEach((el, i) => {
      const off = i !== activeIdx;
      el.inert = off;
      el.setAttribute('aria-hidden', off ? 'true' : 'false');
      el.classList.toggle('live', !off);
    });
  };
  setBeatA11y(0);
  let lastCentered = 0;

  // three 0.185 deprecates THREE.Clock, so the frame delta is measured directly
  let lastFrame = 0;
  const nearState = new Array(S).fill(false);
  let raf = 0, settle = 0;
  // The room covers the screen with an opaque stage and runs its own spectrum, so there
  // is nothing to see behind it and no reason to spend a frame on 150k points.
  let roomOpen = false;

  function frame() {
    const now = performance.now();
    const dt = Math.min(lastFrame ? (now - lastFrame) / 1000 : 0.016, 0.05);
    lastFrame = now;
    const { g, smoothOffset } = chain.update(currentRawOffset(), dt);

    material.uniforms.uColorA.value.copy(COL_ACCENT);
    material.uniforms.uAlpha.value = nightOn ? NIGHT_ALPHA : DAY_ALPHA;
    material.uniforms.uIdle.value = reduced ? 0 : 0.04;
    material.uniforms.uSize.value = CFG.dotSize;
    material.uniforms.uNoiseStrength.value = 1.1;

    // the mark deepens to rich green at its own beats
    let accent = 0;
    for (const peak of ACCENT_PEAKS) accent = Math.max(accent, Math.exp(-((g - peak) ** 2) / (2 * 0.55 ** 2)));
    material.uniforms.uColorA.value.lerp(COL_DEEP, accent * 0.7);

    // THE HEART BEAT TURNS RED — a tight bell, so the rest of the cinema stays green.
    // uColorB is re-seeded each frame so off-heart frames keep the normal accent.
    let red = 0;
    for (const h of HEART_BEATS) red = Math.max(red, Math.exp(-((g - h) ** 2) / (2 * 0.45 ** 2)));
    material.uniforms.uColorA.value.lerp(COL_RED, red);
    material.uniforms.uColorB.value.copy(COL_DEEP).lerp(COL_RED_HI, red);
    // and the dots grow with it: the heart spreads the same budget over the widest
    // silhouette in the arc, so it would read thin at the ordinary size.
    material.uniforms.uSize.value = CFG.dotSize * (1 + red * CFG.heartSwell);

    material.uniforms.uTime.value += dt;

    // ---- per-beat DOM panels (gaussian-gated, so only one ever shows) ----
    const bell = (c, s = 0.5) => Math.exp(-((g - c) ** 2) / (2 * s * s));
    for (let i = 0; i < S; i++) {
      const n = bell(i);
      const el = panelEls[i];
      if (el) el.style.opacity = String(THREE.MathUtils.clamp((n - 0.42) / 0.5, 0, 1));
      const near = n > 0.03;
      if (near !== nearState[i]) { nearState[i] = near; el?.classList.toggle('near', near); }
      // fade the cloud under the copy-heavy beats so the words lead; keep the opening
      // mark at full strength. The dimming is PROPORTIONAL, because at night the whole
      // budget is smaller and a flat subtraction would wipe the cloud off the screen.
      if (i > 0) {
        const scale = (nightOn ? NIGHT_ALPHA : DAY_ALPHA) / DAY_ALPHA;
        material.uniforms.uAlpha.value -= n * (HEART_BEATS.includes(i) ? 0.08 : 0.26) * scale;
      }
      // the heart is dense where the copy sits — soften it a little further
      if (HEART_BEATS.includes(i)) material.uniforms.uAlpha.value -= n * 0.18;
      // A photo beat's DOM panel owns the frame, so the cloud drops well back.
      //
      // ☠️ ON A DIM BEAT IN DARK MODE THIS DOES NOT DIM THE CLOUD, IT SWITCHES IT OFF, AND
      // THAT IS THE INTENDED LOOK. Ruled by Jarich on 2026-09-05, matching FFC, which
      // carries the same arithmetic: behind a photo panel at night there is the night sky
      // and nothing else. Do not read `-= n * 0.5` as a dimming and go looking for the
      // faint cloud that is supposedly still there. It is not there, on purpose.
      //
      // The subtractions sum past zero at the centre of a dim beat, where its own bell is
      // 1.0, before the neighbouring beats' bells are even added:
      //   desktop  0.66 - 0.26 x 0.733 - 0.5 = -0.031
      //   mobile   0.55 - 0.26 x 0.611 - 0.5 = -0.109
      // A negative uAlpha multiplies the dot's coverage to nothing. Measured on the canvas
      // with readPixels: zero lit pixels, max alpha zero, on all twelve dim beats of the
      // home arc. LIGHT mode is the exception and keeps its cloud, because there the sum
      // stays positive (0.9 - 0.26 - 0.5 = +0.14).
      //
      // So this line is load bearing in both directions: raising the 0.5, or flooring the
      // result with something like Math.max(0.06, ...), brings a faint field back behind
      // every photo panel on every cinema page. That was built and shown as
      // proof/dim-floor-beat03-{before,after}.png and it was declined.
      if (DIM_BEATS.has(i)) material.uniforms.uAlpha.value -= n * 0.5;
    }

    // camera director. Portrait phones are narrow, so wide or tall beats would clip:
    // pull the camera back proportionally when the aspect goes below 1.
    const ct = cameraTarget(g, keys);
    const portrait = camera.aspect < 1
      ? THREE.MathUtils.lerp(1, IS_MOBILE ? 2.0 : 1.5, THREE.MathUtils.clamp((1 - camera.aspect) / 0.6, 0, 1))
      : 1;
    const lambda = reduced ? 60 : 4;
    camera.position.x = dampf(camera.position.x, ct.x * portrait, lambda, dt);
    camera.position.y = dampf(camera.position.y, ct.y * portrait, lambda, dt);
    camera.position.z = dampf(camera.position.z, ct.z * portrait, lambda, dt);
    camera.lookAt(0, 0, 0);

    const centered = Math.round(smoothOffset * (S - 1));
    if (centered !== lastCentered) {
      lastCentered = centered;
      setBeatA11y(centered);
    }
    tickEls.forEach((el, i) => el.classList.toggle('on', i === centered));

    renderer.render(scene, camera);

    if (roomOpen) raf = 0;
    else if (!reduced) raf = requestAnimationFrame(frame);
    else if (settle > 0) { settle -= 1; raf = requestAnimationFrame(frame); }
    else raf = 0;
  }

  // REDUCED MOTION: no standing rAF loop. The cinema still answers the scroll (that
  // movement is the reader's own), but it settles in a short burst and then stops, so
  // nothing animates on its own.
  const kick = () => {
    if (roomOpen) return;
    settle = 8;
    if (!raf) raf = requestAnimationFrame(frame);
  };
  const onScroll = () => { if (reduced) kick(); };
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (window.innerWidth !== lockedWidth) {   // height-only (URL bar) keeps the track stable
      lockedWidth = window.innerWidth;
      setVH();
      measureBeats();
    }
    if (reduced) kick();
  };
  // the room announces itself; the cinema stands down while it holds the screen
  const onRoom = (e) => {
    const open = !!(e && e.detail && e.detail.open);
    if (open === roomOpen) return;
    roomOpen = open;
    if (open) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    } else {
      lastFrame = 0;                       // no dt spike on the first frame back
      if (reduced) kick();
      else if (!raf) raf = requestAnimationFrame(frame);
    }
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('dsd:room', onRoom);

  // Under reduced motion the loop sleeps between scrolls, so a formation landing has to
  // ask for the frame that shows it, or the arc would finish building invisibly.
  onBeatBuilt = () => { if (reduced) kick(); };

  if (reduced) kick();
  else raf = requestAnimationFrame(frame);

  return {
    paint,
    destroy() {
      builder.stop();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('dsd:room', onRoom);
      scene.remove(points);
      geometry.dispose();
      material.dispose();
      dummy.dispose();
      renderer.dispose();
    },
  };
}
