'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createPoints } from './engine/points';
import { MorphChain, dampf } from './engine/morph';
import { buildArc, preloadBeatImages } from './formations/index';
import { cameraKeys, cameraTarget } from './director/camera';
import { CFG } from './sky/skyConfig';
import { useTheme } from './ThemeProvider';
import './cinema.css';

// DSD green on cream by day; on night the same particles lift to a bright register and
// the cloud switches to additive, because glow only reads on a dark void.
const ACCENT_DAY = '#0e7c5a', DEEP_DAY = '#065f46';
const ACCENT_NIGHT = '#69e3b0', DEEP_NIGHT = '#b9ffe0';
// The heart is the one beat that is never green.
const RED_DAY = '#b42a3a', RED_HI_DAY = '#d3495b';
const RED_NIGHT = '#e84a60', RED_HI_NIGHT = '#ff97a8';

/**
 * The scroll cinema: one WebGL canvas, one particle cloud, one formation per beat, and a
 * DOM panel per beat that carries the copy (crawlable, and the only thing a screen reader
 * is offered). `beats` is the arc config; `panels` are the React nodes, one per beat.
 */
export default function CinemaPage({ beats, panels = [], classicHref = '/classic' }) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const beatsRef = useRef(beats);
  const paintRef = useRef(null);
  const { dark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return undefined;

    // ---- WebGL floor ----
    // A visitor must always be able to reach the site. If WebGL cannot create a context
    // the cinema would render BLANK, so bail to the plain page instead. We probe on a
    // throwaway canvas so the renderer below still gets a clean context of its own. This
    // fires ONLY on a true context-creation failure, never on reduced motion or a slow GPU.
    let probeGl = null;
    try {
      const probe = document.createElement('canvas');
      probeGl = probe.getContext('webgl2') || probe.getContext('webgl');
    } catch (e) {
      probeGl = null;
    }
    if (!probeGl) {
      window.location.assign(classicHref);
      return undefined;
    }

    let disposed = false;
    let cleanup = () => {};
    boot();
    return () => {
      disposed = true;
      cleanup();
    };

    async function boot() {
      const arc = beatsRef.current;
      const S = arc.length;
      const IS_MOBILE = window.innerWidth < 820 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      const N = IS_MOBILE ? 92000 : 150000;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

      const images = await preloadBeatImages(arc);
      if (disposed) return;

      const formations = buildArc(N, arc, { images });
      const { points, geometry, material } = createPoints(N, formations);

      // preserveDrawingBuffer keeps the rendered frame after the swap so a phone
      // screenshot captures the particles instead of a blank canvas. alpha + a transparent
      // clear means the canvas composites over the page's CSS paper rather than painting
      // its own, which is what lets the sky show through behind it.
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
      // shader emits a non-premultiplied colour while the renderer premultiplies, so
      // additive resolves to (ONE, ONE) and the FULL colour is added no matter what uAlpha
      // says. At night the exposure therefore lives in the COLOUR. A phone packs the same
      // formation into a smaller area, so overlapping dots sum sooner and it needs the
      // darker exposure. The heart can afford to burn: green clips to white, but crimson
      // clips to red, which still looks like a heart.
      const NIGHT_EXP = IS_MOBILE ? 0.40 : 0.62;
      const NIGHT_EXP_RED = IS_MOBILE ? 0.86 : 1.0;
      const NIGHT_ALPHA = IS_MOBILE ? 0.55 : 0.66;
      const DAY_ALPHA = 0.9;
      let nightOn = false;

      function paintForTheme(isDark) {
        nightOn = isDark;
        COL_ACCENT.set(isDark ? ACCENT_NIGHT : ACCENT_DAY);
        COL_DEEP.set(isDark ? DEEP_NIGHT : DEEP_DAY);
        COL_RED.set(isDark ? RED_NIGHT : RED_DAY);
        COL_RED_HI.set(isDark ? RED_HI_NIGHT : RED_HI_DAY);
        if (isDark) {
          COL_ACCENT.multiplyScalar(NIGHT_EXP);
          COL_DEEP.multiplyScalar(NIGHT_EXP);
          COL_RED.multiplyScalar(NIGHT_EXP_RED);
          COL_RED_HI.multiplyScalar(NIGHT_EXP_RED);
        }
        material.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
        material.uniforms.uColorA.value.copy(COL_ACCENT);
        material.uniforms.uColorB.value.copy(COL_DEEP);
        material.needsUpdate = true;
      }
      paintForTheme(document.documentElement.getAttribute('data-theme') === 'dark');
      paintRef.current = paintForTheme;
      material.uniforms.uMaxSize.value = IS_MOBILE ? 22 : 42;

      // the engine declares a photo sampler; give it a 1x1 dummy so WebGL never samples a
      // null texture on an arc that has no photo beat
      const dummy = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1, THREE.RGBAFormat);
      dummy.needsUpdate = true;
      material.uniforms.uVideo.value = dummy;

      const chain = new MorphChain(geometry, material, formations, { smoothing: reduced ? 30 : 5.5 });
      const keys = cameraKeys(arc);

      // which beats deepen to rich green, which turn red, which hand the frame to their
      // DOM panel and so dim the cloud hard behind it
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
          // a photo beat's DOM panel owns the frame, so the cloud drops well back
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

        if (!reduced) raf = requestAnimationFrame(frame);
        else if (settle > 0) { settle -= 1; raf = requestAnimationFrame(frame); }
        else raf = 0;
      }

      // REDUCED MOTION: no standing rAF loop. The cinema still answers the scroll (that
      // movement is the reader's own), but it settles in a short burst and then stops, so
      // nothing animates on its own.
      const kick = () => {
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
      window.addEventListener('resize', onResize);
      window.addEventListener('scroll', onScroll, { passive: true });

      if (reduced) kick();
      else raf = requestAnimationFrame(frame);

      cleanup = () => {
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('scroll', onScroll);
        paintRef.current = null;
        scene.remove(points);
        geometry.dispose();
        material.dispose();
        dummy.dispose();
        renderer.dispose();
      };
    }
    // The arc is fixed for the life of the route, so the engine boots once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classicHref]);

  // a theme tap repaints the cloud in place; it never rebuilds the scene
  useEffect(() => {
    paintRef.current?.(dark);
  }, [dark]);

  return (
    <div className="cinema-root" ref={rootRef}>
      {/* the id is the room's contract: it hides #gl while it holds the screen */}
      <canvas id="gl" ref={canvasRef} className="cinema-gl" />
      <div className="cinema-vignette" />
      <nav className="cinema-rail" aria-hidden="true">
        {beats.map((b, i) => <span key={b.key || i} className="cinema-tick" />)}
      </nav>
      <div className="cinema-scroll">
        {beats.map((b, i) => <section key={b.key || i} className="cinema-beat" />)}
      </div>
      {beats.map((b, i) => (
        <div
          key={b.key || i}
          className={`cinema-panel${(b.copyLow ?? b.kind === 'lockup') ? ' copy-low' : ''}`}
          aria-hidden={i !== 0}
        >
          {panels[i]}
        </div>
      ))}
    </div>
  );
}
