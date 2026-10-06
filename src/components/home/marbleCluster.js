// marbleCluster.js — the Leadership "glass marbles", rebuilt to match elvalabs.ai EXACTLY:
// a dense grape-bunch of refractive glass spheres on a BLACK stage, strong size variation, each
// filled bead showing a video edge-to-edge (fisheye-refracted), driven by REAL rigid-body physics
// (cannon-es) so the cluster collides, bounces, FLINGS from the cursor, and springs home.
//
// Faithful to the elva-video-spheres DNA:
//   • screen-space TRANSMISSION glass — MeshPhysicalMaterial(transmission=1); three's WebGLRenderer
//     shares ONE built-in transmission pass across every sphere (the perf key for a dozen-plus balls).
//   • PMREM(RoomEnvironment) reflections — no HDR/EXR on the wire.
//   • cannon-es: dynamic Sphere bodies + a center spring pulling them home + a KINEMATIC cursor body
//     (raycast→plane) that shoves/flings them; restitution gives the bounce, damping settles them.
//   • each FILLED bead = an inner unlit video plane, center-cropped to fill the bead; CLEAR beads are
//     pure crystal (refract the black + their neighbours — the iridescent bubbles in the reference).
//   • runs in its OWN canvas scoped to the Leadership beat, so the point-cloud morph is untouched.
//
// API:  const c = createMarbleCluster(container, { videos:[url…], count, filled, isMobile })
//       c.setActive(true|false)   c.resize()   c.dispose()

import * as THREE from "three";
import * as CANNON from "cannon-es";
import { mediaUrl } from "@/lib/cinema/media";
import { hapticTick, hapticThud, clink } from '@/lib/glassFx';

// A colourful "studio" environment painted on a canvas (equirect) → PMREM. This is what makes CLEAR
// glass read as vibrant gems on black: the beads reflect/refract these coloured lights even when there's
// no video behind them (a neutral RoomEnvironment leaves them looking like black obsidian).
function makeColorEnv() {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 512;
  const x = c.getContext("2d");
  x.fillStyle = "#06070c"; x.fillRect(0, 0, c.width, c.height);
  const blobs = [
    ["#3f72ff", 0.16, 0.34, 0.52], ["#ff5fa8", 0.82, 0.30, 0.50], ["#ffd27e", 0.52, 0.16, 0.42],
    ["#46f0c8", 0.34, 0.80, 0.46], ["#b98cff", 0.72, 0.80, 0.46], ["#ffffff", 0.50, 0.52, 0.26],
    ["#ff8a3d", 0.95, 0.60, 0.34],
  ];
  for (const [col, px, py, r] of blobs) {
    const g = x.createRadialGradient(px * c.width, py * c.height, 0, px * c.width, py * c.height, r * c.height);
    g.addColorStop(0, col); g.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = g; x.fillRect(0, 0, c.width, c.height);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const PORTRAIT_AR = 9 / 16; // the reels are portrait 720×1280 — center-crop this square into each bead
// soft bubble tints for the CLEAR beads (icy blue, lilac, gold, aqua, rose) — varied like the reference
const CLEAR_TINTS = [0xbfe3ff, 0xd9c2ff, 0xffe6bf, 0xc2fff0, 0xffd0e8].map((h) => new THREE.Color(h));

// ── tuning (cannon units) ──
const K_CENTER = 11.0;   // center-spring accel — pulls the shoal home (mass-normalised → size-independent)
/** The half-extent the shoal settles into under the plain isotropic spring, measured with
 *  bounds() on the 33-reel wall: about 3.0 world units. It is the reference that lets a
 *  caller ask for a spread in WORLD UNITS instead of in stiffness. */
const NATURAL_R = 3.0;
const K_CENTER_Z = 18.0; // stronger pull on Z so the cluster stays a camera-facing shoal, not a deep ball
const LIN_DAMP = 0.72;   // body linear damping — higher = a fling settles sooner (doesn't fly far)
const RESTITUTION = 0.45;// bounce between beads (a touch less bouncy)
const CURSOR_R = 0.9;    // kinematic cursor body radius (the "finger" that shoves beads)
const FLING_SCALE = 0.3; // only a fraction of the finger's speed is imparted — soft nudge, not a launch
const MAX_CURSOR = 4.5;  // cap the finger's effective speed so a quick press can't fling beads off-screen
const MAX_DT = 1 / 30;
// Downward accel applied ONLY to a bead that has been knocked out of the wall. The cannon
// world has zero gravity so the shoal can float; a departing bead borrows some.
const FALL_G = 6.0;
// ☠️ THE NEW SET ARRIVES FROM RANDOM DIRECTIONS AND HITS, IT DOES NOT RAIN.
// Jarich, on the first build: "the marbles doesnt drop from the top or even better from
// random directions ... drop and hit and fling away other marbles naturally using
// physics". So an incoming bead is spawned on a ring just outside the visible stage at a
// random angle and thrown at one live bead at ENTRY_SPEED. The collision is the knock:
// cannon's own impulse sends the struck bead off, and it keeps that velocity once it is
// released from the spring. Nothing scripts the fling.
// ☠️ AN INCOMING BEAD STILL NEEDS A PULL OF ITS OWN, OR A MISS HOVERS FOR EVER. It has
// no spring until it lands, so a near miss would sail past and stop. A fraction of the
// centring spring keeps it coming home without braking it before the hit.
const ENTRY_SPEED = 7.0;
const INCOMING_PULL = 0.3;
const RAIN_EVERY_MS = 300;   // Jarich: "a marble glass one by one ... per 0.3 second"
const RAIN_WAIT_MS = 1000;   // longest we hold a drop back waiting for its texture to decode
const LAND_BY_MS = 2000;     // an incoming bead still not landed by then is declared landed

// ── TAP TO ADD (opt-in, tapToAdd: true) ──
// Jarich, 2026-10-01: "show 7 marble glasses then when they tap once a glass marble will be
// added and remove 1 ... i want it like the glass was from their finger when they tap so the
// glass marble will get hit". A tap births the NEXT reel's bead at the finger, grows it, and
// throws it at a bead in the wall; the struck bead is knocked out, so the count holds.
// ☠️ THE LADDER IS FLATTER THAN THE RAIN WALL'S, AND THAT IS THE VISIBILITY FIX, NOT TASTE.
// The ten bead wall ran from 1.85 (hero) down to 0.62 of baseR, so its smallest bead was a
// third of its biggest: 73 css px on a phone. Here slot 0 is still the hero and still sets
// the resolution gate declared as reel-library.json's tile (see the call site in
// panels.jsx), and the other six are nearly equal. Swept on the live scene: a 1.0 to 1.6
// spread across all seven would not pack into the band under the copy, it flipped between
// one long row off both edges and three rows over the headline. One hero plus six even
// beads settles into two rows, every time, from the same seed.
const TAP_LADDER = [1.6, 1.08, 1.0, 1.15, 1.04, 1.12, 1.0];
const TAP_IN_FLIGHT = 3;     // launches allowed in the air at once; a tap past this is ignored
const TAP_GROW_MS = 150;     // born small at the finger, full size this fast
const TAP_GROW_FROM = 0.22;
const TAP_SPEED = 10.0;      // launch speed, world units per second
const TAP_KNOCK_MS = 700;    // a target the launch never touched is knocked out anyway
const TAP_KNOCK_SPEED = 7.0; // outward speed a struck bead leaves the wall with
const TAP_WARM_AHEAD = 3;    // decoders opened ahead of the next taps
const FALL_MAX_MS = 4000;    // a knocked out bead is retired by then wherever it got to
const VIDEO_FACE_AFTER_S = 0.5; // a poster gives way to its video only this far into playback

// The haptic, the clink and the impact thud live in lib/glassFx (ported back from
// ffcdentalclinic.com 2026-10-06, Jarich: "theres like a tone and haptic i want it the same").

export function createMarbleCluster(container, {
  videos = [], hdVideos = [], count = 18, isMobile = false, faceFocus = {}, faceZoom = {},
  faceZoomDefault = 1, cameraZ = 8, spreadX = NATURAL_R, spreadY = NATURAL_R,
  stage = 'container', centerY = 0, centerPull = 1, beadScale = 1, linDamp = LIN_DAMP,
  // tapToAdd: the ring queue mode. `reels` is the whole library as [{ url, hd, poster }]; the
  // first `count` seed the wall and every tap adds the next one. OFF by default, so every
  // existing caller (ArticleMarbles, /classic) is untouched.
  tapToAdd = false, reels = null, maxPixelRatio = null, hintText = null, zPull = 1,
  ladder = TAP_LADDER,
} = {}) {
  const tapMode = !!tapToAdd && Array.isArray(reels) && reels.length > 0;
  if (tapMode) {
    const seed = reels.slice(0, count);
    videos = seed.map((r) => r.url);
    hdVideos = seed.map((r) => r.hd || null);
  }
  const posters = tapMode ? reels.slice(0, count).map((r) => r.poster || null) : [];
  const damping = Math.min(0.99, Math.max(0.1, linDamp));
  // ☠️ THE WELL'S CENTRE MOVES, THE WALL'S FREEDOM DOES NOT.
  // Jarich: the shoal was sitting across the headline. The fix is NOT a wall or a clamp,
  // both of which would undo the round before this one; it is moving where the centring
  // spring PULLS TO. A bead can still be flung anywhere on or off the screen, it just
  // comes home to a point lower down. Held in a mutable so the caller can re-seat it on
  // resize, which it must: the copy block's height changes with the viewport.
  let centreY = centerY;
  // ☠️ THE INVISIBLE BOX WAS NEVER PHYSICS. There are no cannon planes in this file and
  // never were: a bead flung outward is not stopped, it is simply drawn outside the
  // drawing buffer and disappears. The box IS the canvas, and on the home beat that canvas
  // was a min(98vw,1240px) by 56vh block sitting in the panel's flow, so the wall had hard
  // edges a hand's width from the middle of the screen.
  // stage:'viewport' lifts the canvas out of that block and pins it to the whole screen.
  // The MOUNT stays where it was, in flow, because it is what the caller's
  // IntersectionObserver watches: a mount pinned to the viewport intersects forever and
  // the cluster would never sleep, which on this wall means thirty three video decoders
  // that never stop. Only the canvas moves.
  // DEFAULT 'container' KEEPS EVERY EXISTING CALLER IDENTICAL (/classic, MeetTheTeam).
  const viewportStage = stage === 'viewport';
  // ☠️ THE WELL CAN BE AN ELLIPSE. The centring spring was isotropic, so the shoal always
  // settled into a ball; on a wide stage that reads as a small clump in a lot of empty
  // space. spreadX and spreadY are the semi-axes the caller WANTS, in world units, and
  // they are turned into per-axis stiffness below.
  //
  // Why the square: a bead sits where the collision pressure of its neighbours balances
  // the restoring force, so the extent along an axis goes as 1/sqrt(k). Scaling k by
  // (NATURAL_R / spread)^2 therefore scales the settled extent by spread / NATURAL_R,
  // which makes the option behave the way its name promises.
  //
  // DEFAULTS ARE NATURAL_R ON BOTH AXES, so k comes out exactly K_CENTER and every
  // existing caller settles into the same ball it always did.
  // ☠️ centerPull IS A STIFFNESS, AND IT IS NOT FREE. Jarich asked for the wall to be
  // "middle gravitated", so a flung bead should visibly come home rather than loiter.
  // That is k, and k also decides where the shoal comes to REST: a bead sits where its
  // neighbours' collision pressure balances the restoring force, so the settled extent
  // goes as 1 / sqrt(k). Raising the pull therefore TIGHTENS the wall as a side effect,
  // and the two cannot be separated by scaling spread to compensate, because the spread
  // term and the pull term cancel exactly. So the spread numbers at the call site are
  // re-measured whenever this changes; they are not independent of it.
  const pull = Math.max(0.1, centerPull);
  const kX = K_CENTER * pull * (NATURAL_R / Math.max(0.2, spreadX)) ** 2;
  const kY = K_CENTER * pull * (NATURAL_R / Math.max(0.2, spreadY)) ** 2;
  // ☠️ THE WELL MUST BE STIFFER IN DEPTH THAN ACROSS, OR BEADS HIDE BEHIND EACH OTHER.
  // A flat well (spreadY 1.4 on the laptop) makes kY about 90 while the depth spring was a
  // flat 18, so squeezing the shoal vertically was cheaper to answer by stacking beads in
  // front of and behind each other than by spreading them out. Measured on seven beads:
  // the same settings settled with the smallest bead drawn at 257 px one run and 224 the
  // next, purely from which beads ended up behind, and a bead behind is a bead half hidden.
  // zPull scales the depth spring (default 1, every existing caller unchanged).
  const kZ = K_CENTER_Z * Math.max(0.1, zPull);
  // mobile shows ALL the reels too (they're compressed 480p) — just smaller beads + camera pulled back

  // ── renderer: TRANSPARENT — only the marbles paint; the black comes from the panel's CSS bg (which
  //    fades with the beat). No opaque rectangle = no visible frame + no occluding the next section. ──
  const canvas = document.createElement("canvas");
  // The inline style beats any stylesheet, so the viewport stage has to be declared here
  // rather than in home-cinema.css. z-index 1 puts the glass OVER the beat's copy, which
  // is the point: the beads pass across the headline instead of stopping short of it. The
  // beat's own button is lifted above this in CSS so it stays tappable.
  canvas.style.cssText = (viewportStage
    ? "position:fixed;inset:0;width:100vw;height:100vh;z-index:1;"
    : "width:100%;height:100%;")
    + "display:block;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;";
  container.appendChild(canvas);

  // ── discoverability hint (Jarich 2026-06-27): users don't know the marbles are
  //    pressable. A subtle gold pill fades in with the beat — "press & hold to
  //    watch" — auto-fades after a few seconds, and retires for good the first
  //    time someone opens a reel. pointer-events:none so it never blocks a press. ──
  if (!document.getElementById("cp-marble-hint-css")) {
    const hs = document.createElement("style");
    hs.id = "cp-marble-hint-css";
    hs.textContent =
      ".cp-marble-hint{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%) scale(.82);z-index:60;display:flex;flex-direction:column;align-items:center;gap:12px;pointer-events:none;text-align:center;color:#f3e7c0;background:rgba(16,12,8,.6);border:1.5px solid rgba(216,178,74,.75);border-radius:22px;padding:22px 26px;opacity:0;transition:opacity .55s ease,transform .55s cubic-bezier(.2,1.4,.4,1);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);max-width:78vw;box-shadow:0 0 0 1px rgba(216,178,74,.25),0 0 44px rgba(216,178,74,.28),0 24px 70px rgba(0,0,0,.55);}" +
      ".cp-marble-hint.show{opacity:1;transform:translate(-50%,-50%) scale(1);}.cp-hint-icon{font-size:34px;line-height:1;animation:cpHintPress 1.6s ease-in-out infinite;}@keyframes cpHintPress{0%,100%{transform:scale(1)}50%{transform:scale(.8)}}.cp-hint-title{font:700 14px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;}" +
      ".cp-marble-hint b{font-weight:700;color:#ffe9a8;}" +
      ".cp-marble-hint .cp-hint-dot{width:9px;height:9px;border-radius:50%;background:#d8b24a;box-shadow:0 0 0 0 rgba(216,178,74,.6);animation:cpHintPulse 1.8s ease-out infinite;flex:none;}" +
      "@keyframes cpHintPulse{0%{box-shadow:0 0 0 0 rgba(216,178,74,.55);}70%{box-shadow:0 0 0 10px rgba(216,178,74,0);}100%{box-shadow:0 0 0 0 rgba(216,178,74,0);}}";
    document.head.appendChild(hs);
  }
  const hint = document.createElement("div");
  hint.className = "cp-marble-hint";
  hint.innerHTML = '<span class="cp-hint-icon" aria-hidden="true">\ud83d\udc46</span>';
  const hintTitle = document.createElement("span");
  hintTitle.className = "cp-hint-title";
  if (hintText) hintTitle.textContent = hintText;
  else hintTitle.innerHTML = 'Press &amp; <b>hold</b> a marble<br>to see';
  hint.appendChild(hintTitle);
  document.body.appendChild(hint);
  let hintRetired = false, hintTimer = 0;
  const hideHint = () => { hint.classList.remove("show"); if (hintTimer) { clearTimeout(hintTimer); hintTimer = 0; } };
  const showHint = () => {
    if (hintRetired) return;
    hint.classList.add("show");
    if (hintTimer) clearTimeout(hintTimer);
    hintTimer = setTimeout(() => hint.classList.remove("show"), 1000); // one-second flash (Jarich 2026-07-03) — never nag
  };
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  // ☠️ maxPixelRatio IS THE SHARPNESS. A 3x phone drawn at the old 1.5 cap renders the glass
  // at half its real resolution, which reads as soft beads. A caller showing only a few
  // beads can afford more; the default keeps every existing caller identical.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio || (isMobile ? 1.5 : 1.9)));
  renderer.setClearColor(0x000000, 0); // transparent clear
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  // no scene.background → canvas stays transparent except where the glass renders (env still lights it)
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  // ☠️ THE FOV IS VERTICAL, SO THIS DISTANCE IS THE ONLY FIT CONTROL. The camera shows
  // 2 * z * tan(22.5deg) world units of HEIGHT no matter how the container is shaped: a
  // taller box renders the same shoal larger, a wider one only reveals more sideways. At
  // the original z=8 that is 6.63 units, and a shoal of 33 beads packs slightly taller
  // than that, so the bottom row was being sliced wherever it was mounted.
  // DEFAULT 8 KEEPS EVERY EXISTING CALLER IDENTICAL (/classic through MeetTheTeam); only
  // a caller that asks for more distance gets a wider view.
  camera.position.set(0, 0, cameraZ);

  // colourful studio reflections (no HDR) — PMREM of a painted equirect → vibrant glass on black
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envSrc = makeColorEnv();
  const envRT = pmrem.fromEquirectangular(envSrc);
  scene.environment = envRT.texture;
  pmrem.dispose();
  envSrc.dispose();

  scene.add(new THREE.AmbientLight(0xffffff, 0.32));
  const key = new THREE.DirectionalLight(0xffffff, 0.7); key.position.set(4, 6, 8); scene.add(key);
  const warm = new THREE.DirectionalLight(0xf0c25a, 0.3); warm.position.set(-5, -3, 4); scene.add(warm);
  // colored rim lights — reflect as gem-like speculars in the glass so CLEAR beads read as colourful
  // bubbles on black (not flat obsidian). The env is near-neutral, so these carry the colour.
  const c1 = new THREE.PointLight(0xffc24d, 22, 40); c1.position.set(-5, 4, 4); scene.add(c1); // gold (FFC brand) — upper-left key glint, was blue 0x6ea8ff
  const c2 = new THREE.PointLight(0xff7eb6, 16, 40); c2.position.set(5, -4, 4); scene.add(c2);
  const c3 = new THREE.PointLight(0xffd27e, 14, 40); c3.position.set(0, 5, -5); scene.add(c3);
  const c4 = new THREE.PointLight(0x9affe0, 12, 40); c4.position.set(-3, -5, -3); scene.add(c4);

  // ── shared geometry ──
  const seg = isMobile ? 28 : 44;
  const sphereGeo = new THREE.SphereGeometry(1, seg, seg);
  const planeGeo = new THREE.CircleGeometry(1, 64); // CIRCULAR video disc — no square corners poking past the bead

  // ── cannon world ──
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) });
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.allowSleep = false;
  const mat = new CANNON.Material("marble");
  world.addContactMaterial(new CANNON.ContactMaterial(mat, mat, { restitution: RESTITUTION, friction: 0.0 }));

  // kinematic cursor "finger" — parked far away until the pointer engages
  const cursorBody = new CANNON.Body({ type: CANNON.Body.KINEMATIC, collisionResponse: true });
  cursorBody.addShape(new CANNON.Sphere(CURSOR_R));
  cursorBody.position.set(999, 999, 999);
  cursorBody.material = mat;
  world.addBody(cursorBody);

  // ── shared video texture pool: ONE <video> decoder per unique clip (iOS hard-caps concurrent
  //    decoders), round-robined across the FILLED beads — the elva trick: few clips fill many marbles. ──
  // ☠️ EVERY DECODER THIS CLUSTER OPENS IS COUNTED HERE, BECAUSE NONE OF THEM IS IN THE DOM.
  // The bead videos are never attached to the document, so querySelectorAll('video') sees
  // none of them and a leak would be invisible. An element joins on creation and leaves
  // only through releaseVideo, which is the one place a decoder is actually freed.
  const liveVideos = new Set();
  function releaseVideo(t) {
    if (!t || t.released) return;
    t.released = true;
    try { t.el.pause(); t.el.removeAttribute("src"); t.el.load(); } catch (e) { /* torn down */ }
    liveVideos.delete(t.el);
    // a bead that still exists falls back to its poster rather than to black glass
    if (t.posterTex && t.planeMat.map !== t.posterTex) { t.planeMat.map = t.posterTex; t.planeMat.needsUpdate = true; }
  }
  function disposeTex(t) {
    if (!t) return;
    releaseVideo(t);
    t.vtex?.dispose();
    t.posterTex?.dispose();
    t.planeMat.dispose();
  }

  function makeTex(url, i, poster = null) {
    const el = document.createElement("video");
    el.src = mediaUrl(url);      // repo path in the manifest, media origin at run time
    el.muted = true; el.loop = true; el.playsInline = true; el.crossOrigin = "anonymous";
    el.preload = "none"; el.setAttribute("playsinline", ""); el.setAttribute("muted", "");
    liveVideos.add(el);
    const tex = new THREE.VideoTexture(el);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.center.set(0.5, 0.5);
    const focusY = faceFocus[i] != null ? faceFocus[i] : 0.5;

    // ☠️ THE SQUARE CROP IS COMPUTED FROM THE CLIP'S OWN SHAPE, NOT ASSUMED.
    // This used to be a flat repeat.set(1, 9/16): take the full WIDTH and nine sixteenths
    // of the HEIGHT, which is a square crop only if the clip really is 9:16 portrait.
    // Measured against the library, 24 of 192 bead loops are not: 17 are LANDSCAPE (720x404
    // and the like) and 7 are portrait at some other ratio. On a landscape clip that rule
    // takes the full width and 9/16 of an already-short height, so a wide letterbox strip
    // gets stretched into the bead's circle. Nothing errors; the marble just shows a
    // squashed slice, which is easy to mistake for the clip being framed badly.
    //
    // A square crop is min(w,h) on a side, so repeat is min/w by min/h. That reduces to
    // exactly (1, 9/16) for a true 9:16 portrait, so every correctly shaped clip is
    // untouched. Dimensions are only known once metadata arrives, so the 9:16 guess stands
    // until then and is corrected in place when the real numbers land.
    const frameCrop = () => {
      const w = el.videoWidth, h = el.videoHeight;
      if (!w || !h) return;
      const side = Math.min(w, h);
      const rx = side / w, ry = side / h;
      tex.repeat.set(rx, ry);
      // The focus dial slides the crop along the LONG axis, which is the only one with
      // room to move: vertically on a portrait clip, horizontally on a landscape one.
      if (h >= w) {
        tex.offset.set(0, THREE.MathUtils.clamp((1 - ry / 2) - focusY, 0, 1 - ry));
      } else {
        tex.offset.set(THREE.MathUtils.clamp(focusY - rx / 2, 0, 1 - rx), 0);
      }
      tex.needsUpdate = true;
    };
    tex.repeat.set(1, PORTRAIT_AR);          // the 9:16 guess, until metadata says otherwise
    tex.offset.set(0, THREE.MathUtils.clamp((1 - PORTRAIT_AR / 2) - focusY, 0, 1 - PORTRAIT_AR));
    el.addEventListener("loadedmetadata", frameCrop);
    frameCrop();                              // in case metadata is already there
    const planeMat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, side: THREE.DoubleSide });
    const t = { el, planeMat, vtex: tex, posterTex: null, released: false };
    if (!poster) return t;

    // ☠️ NO BEAD IS EVER BLACK GLASS: IT WEARS ITS POSTER UNTIL THE VIDEO HAS A FRAME.
    // A VideoTexture with nothing decoded samples as black, and on a cold cache or a slow
    // media origin that was most of the wall for the first seconds (measured on the old
    // build: two of the beads in view were solid black after the wall had settled). The
    // poster is a same origin jpg (media.js leaves images on the app), so it lands fast and
    // it still lands when the media origin does not. The crop is the same square-from-the-
    // long-axis rule as the video's, read off the image's own dimensions.
    const pt = new THREE.TextureLoader().load(poster, (loaded) => {
      const img = loaded.image;
      const w = img?.naturalWidth || img?.width, h = img?.naturalHeight || img?.height;
      if (!w || !h) return;
      const side = Math.min(w, h), rx = side / w, ry = side / h;
      loaded.repeat.set(rx, ry);
      if (h >= w) loaded.offset.set(0, THREE.MathUtils.clamp((1 - ry / 2) - focusY, 0, 1 - ry));
      else loaded.offset.set(THREE.MathUtils.clamp(focusY - rx / 2, 0, 1 - rx), 0);
      loaded.needsUpdate = true;
    });
    pt.colorSpace = THREE.SRGBColorSpace;
    pt.center.set(0.5, 0.5);
    t.posterTex = pt;
    planeMat.map = pt;
    // ☠️ "HAS A FRAME" IS NOT "HAS A PICTURE". Swapping on loadeddata was the obvious rule
    // and it put black beads straight back on the wall: measured with ffmpeg, three of the
    // first seven clips (wall-dsd-showcase, -showcase-4, -hero-loop) open on a pure black
    // frame, luma 0.0 at t=0 and 120+ a second later. The face changes only once playback
    // is past that opening, so a clip that is paused at frame 0 (inactive wall, an iPhone in
    // Low Power Mode refusing muted autoplay) keeps showing its poster instead.
    const toVideo = () => {
      if (t.released || planeMat.map === tex) return;
      if (el.readyState < 2 || el.currentTime < VIDEO_FACE_AFTER_S) return;
      planeMat.map = tex;
      planeMat.needsUpdate = true;
      el.removeEventListener("timeupdate", toVideo);
    };
    el.addEventListener("timeupdate", toVideo);
    return t;
  }
  const texPool = videos.map((url, i) => makeTex(url, i, posters[i] || null));
  // ☠️ vids IS NOT A SNAPSHOT ANY MORE. The rain swap adds and removes decoders while the
  // wall is running, so setActive and dispose have to walk the LIVE set rather than a list
  // captured at build time. It is derived from units on demand instead of stored.
  // A bead that was knocked out already gave its decoder back, so it is not played again.
  const vids = () => units.map((u) => u.tex && !u.tex.released && u.tex.el).filter(Boolean);

  // ── marbles ──
  const group = new THREE.Group();
  scene.add(group);
  const ATTEN = new THREE.Color(0xeae3d2);
  const units = [];
  const shells = []; // sphere meshes for press-and-hold raycast picking (carry index/isFilled/url)

  // FILL one bead per UNIQUE clip (NO duplicates). Every other bead stays an EMPTY clear iridescent
  // bubble, waiting for more reels — as `videos` grows, more beads fill (the layout stays put).
  // DETERMINISTIC sizing + positions (seeded hash, NOT Math.random) so the cluster STOPS reshuffling
  // every page load. The order of `videos` maps to size: bead 0 = the big HERO marble, the LAST
  // filled bead = the small one. (Jarich 2026-06-26: fb-11 pinned to the hero, fb-03 to the small.)
  const hash = (n) => { const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };
  const nFilled = Math.min(texPool.length, count);
  const HERO_I = 0, SMALL_I = nFilled - 1;
  // beadScale lets a caller showing FEWER reels draw BIGGER glass, so a short set still
  // reads as a wall rather than as a handful of beads in a lot of empty stage.
  const baseR = (isMobile ? 0.5 : 0.56) * Math.max(0.2, beadScale);
  // EQUAL-FILL zoom: the glass lens strength scales with bead radius (thickness ∝ r), so a SMALLER
  // bead magnifies its video LESS and shows a glass ring. video-fill ∝ r·zoom, so to make EVERY bead
  // fill like the biggest, hold r·zoom constant → zoom = refZoom·rMax/r (capped so the inner disc
  // never pokes past the glass). refZoom = faceZoomDefault = the biggest bead's perfect zoom. (Jarich 2026-06-26)
  const LADDER = Array.isArray(ladder) && ladder.length ? ladder : TAP_LADDER;
  const rMax = baseR * (tapMode ? Math.max(...LADDER) : 1.85);      // the hero bead (biggest)
  const ZOOM_CAP = 0.98;          // keep the inner disc inside the bead (no poke-out)
  /**
   * Build ONE bead: glass, video face, physics body, and the record the loops walk.
   *
   * Extracted from the build loop so the rain swap can make a bead mid-flight. `slot` is
   * the position in the wall, which decides the radius ladder (slot 0 is the hero, the
   * last is the small one), so an incoming bead inherits the size of the bead it replaces
   * and the wall keeps its shape across a swap.
   */
  function makeBead(slot, url, hd, tex, spawn) {
    const isFilled = !!tex;
    const r = tapMode
      ? baseR * LADDER[slot % LADDER.length]
      : isFilled
      ? (slot === HERO_I ? baseR * 1.85
         : slot === SMALL_I ? baseR * 0.62
         : baseR * (0.95 + hash(slot) * 0.55))
      : baseR * (0.5 + Math.pow(hash(slot + 101), 1.4) * 1.35);

    // ☠️ THE TINT WAS EATING THE VIDEO ON BIG BEADS. three's transmission path length is
    // thickness TIMES the mesh scale, and both are r here, so the path grows as r squared.
    // At the desktop hero (r 1.55) that is 2.4 units through a warm attenuation tuned for
    // 1.6: each channel lost a quarter to a half and the reel read dim and yellow. Tap mode
    // draws every bead big, so it lets the light through further; the rain wall keeps its
    // look.
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 0, roughness: isFilled ? 0.05 : 0.04,
      transmission: 1, ior: 1.45, thickness: r * (isFilled ? 1.0 : 1.3),
      attenuationColor: isFilled ? ATTEN : CLEAR_TINTS[slot % CLEAR_TINTS.length],
      attenuationDistance: isFilled ? (tapMode ? 6.0 : 1.6) : 0.85,
      clearcoat: 1, clearcoatRoughness: 0.07,
      iridescence: isFilled ? 0.12 : 0.72,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: isFilled ? [100, 400] : [200, 950],
      envMapIntensity: 1.7,
    });
    if ("dispersion" in glass) glass.dispersion = isFilled ? 0.7 : 1.5;
    const shell = new THREE.Mesh(sphereGeo, glass);
    shell.scale.setScalar(r);
    shell.userData = { index: slot, isFilled, url: isFilled ? url : null, hd: isFilled ? (hd || null) : null };
    shells.push(shell);

    const unit = new THREE.Group();
    unit.add(shell);
    if (isFilled) {
      const plane = new THREE.Mesh(planeGeo, tex.planeMat);
      const zoom = faceZoom[slot] != null ? faceZoom[slot] : Math.min(faceZoomDefault * rMax / r, ZOOM_CAP);
      plane.scale.setScalar(r * 0.98 * zoom);
      unit.add(plane);
      unit.userData.plane = plane;
    }
    group.add(unit);

    const pos = spawn || new CANNON.Vec3(
      (hash(slot + 1) - 0.5) * 3, (hash(slot + 7) - 0.5) * 3, (hash(slot + 13) - 0.5) * 1.2,
    );
    const body = new CANNON.Body({
      mass: r * r * r,
      shape: new CANNON.Sphere(r),
      material: mat,
      linearDamping: damping,
      angularDamping: 0.7,
      position: pos,
    });
    world.addBody(body);
    // state: 'live' feels the centring spring; 'incoming' is still falling in and does not;
    // 'falling' has been knocked out and is on its way off the bottom of the stage.
    const rec = { unit, body, shell, tex, r, slot, state: 'live' };
    units.push(rec);
    return rec;
  }

  for (let i = 0; i < count; i++) {
    makeBead(i, videos[i], hdVideos[i], i < nFilled ? texPool[i] : null, null);
  }

  // ── pointer → NDC relative to THIS canvas → raycast onto local z=0 plane ──
  const raycaster = new THREE.Raycaster();
  const PLANE = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const _ndc = new THREE.Vector2();
  const _hit = new THREE.Vector3();
  const ptr = { x: 0, y: 0, engaged: false };
  // press-and-hold / dive state (defined here so the fling handler can see `focused`)
  let frozen = false, focused = false, currentTheater = null;
  let prevCursor = new THREE.Vector3(999, 999, 999);
  // tap mode: the press in progress on the canvas, { x, y, t, id, drag, pick }
  let press = null;
  const onMove = (e) => {
    if (focused) { ptr.engaged = false; return; } // a marble is open — don't fling underneath it
    const t = e.touches ? e.touches[0] : e;
    if (!t) return;
    // ☠️ IN TAP MODE THE FINGER ONLY SHOVES ONCE IT IS A DRAG. The cursor body used to
    // engage on hover and on the press itself, so it sat at the finger and pushed out of
    // the way the very bead the finger was on: a tap's target and a hold's reel both slid
    // off before the tap or the hold could land on them. Drag to fling is kept: past
    // MOVE_CANCEL the press becomes a drag and the finger shoves exactly as before.
    if (tapMode) {
      if (!press || !press.drag) { ptr.engaged = false; return; }
    }
    const r = canvas.getBoundingClientRect();
    // only engage when the pointer/touch is ON the canvas — so touches above/below (headline, founders,
    // black margins) still scroll the page freely, while drags ON the beads fling them.
    if (t.clientX < r.left || t.clientX > r.right || t.clientY < r.top || t.clientY > r.bottom) { ptr.engaged = false; return; }
    ptr.x = ((t.clientX - r.left) / r.width) * 2 - 1;
    ptr.y = -(((t.clientY - r.top) / r.height) * 2 - 1);
    // a drag that just began has no previous point: do not read the jump from wherever the
    // cursor was parked as a throw
    if (!ptr.engaged && tapMode) ptr.fresh = true;
    ptr.engaged = true;
  };
  const onLeave = () => { ptr.engaged = false; };
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerdown", onMove);
  window.addEventListener("touchstart", onMove, { passive: true });
  window.addEventListener("touchmove", onMove, { passive: true });
  window.addEventListener("pointerup", onLeave);
  window.addEventListener("touchend", onLeave);
  window.addEventListener("pointerleave", onLeave);
  window.addEventListener("pointercancel", onLeave); // browser took the gesture for a vertical scroll — release
  window.addEventListener("touchcancel", onLeave);

  // ════════════════════════════════════════════════════════════════════════════════════════
  // PRESS-AND-HOLD → DIVE INTO a filled marble. Tap/drag still FLINGS (handlers above). A hold
  // of HOLD_MS with movement < MOVE_CANCEL on a FILLED bead opens a DOM "theater": the reel grows
  // out of the bead's exact on-screen spot into a large gold-ringed portrait player over a dark
  // blurred scrim, with a ‹ Back pill (also Esc / tap-scrim). While open the cluster is FROZEN
  // (frame() skips physics+render, decoders pause); closing reverses the grow + revives the cluster.
  // (Jarich 2026-06-26 — "press and hold a marble, animate going inside there and watch it".)
  // ════════════════════════════════════════════════════════════════════════════════════════
  let holdTimer = 0, downX = 0, downY = 0, holdPick = null;
  const HOLD_MS = 380, MOVE_CANCEL = 12;
  const _right = new THREE.Vector3();

  if (!document.getElementById("cp-theater-css")) {
    const st = document.createElement("style");
    st.id = "cp-theater-css";
    st.textContent =
      ".cp-theater{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;}" +
      ".cp-theater-scrim{position:absolute;inset:0;background:radial-gradient(120% 100% at 50% 38%,rgba(12,9,16,.86),rgba(5,4,8,.96));-webkit-backdrop-filter:blur(9px);backdrop-filter:blur(9px);opacity:0;transition:opacity .45s ease;}" +
      ".cp-theater.cp-open .cp-theater-scrim{opacity:1;}" +
      ".cp-theater-video{position:relative;z-index:1;aspect-ratio:9/16;height:min(84vh,calc(88vw*16/9));max-width:92vw;object-fit:cover;background:#000;transform-origin:center center;box-shadow:0 0 0 1.5px rgba(216,178,74,.9),0 0 64px rgba(216,178,74,.22),0 30px 90px rgba(0,0,0,.62);will-change:transform,opacity,border-radius;}" +
      ".cp-theater-back{position:absolute;top:max(16px,env(safe-area-inset-top));left:16px;z-index:2;font:600 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.2em;text-transform:uppercase;color:#f3e7c0;background:rgba(20,16,10,.55);border:1px solid rgba(216,178,74,.5);border-radius:999px;padding:11px 17px 11px 14px;cursor:pointer;opacity:0;transform:translateY(-6px);transition:opacity .4s ease .12s,transform .4s ease .12s,background .2s,border-color .2s,color .2s;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);}" +
      ".cp-theater.cp-open .cp-theater-back{opacity:1;transform:none;}" +
      ".cp-theater-back:hover{background:rgba(216,178,74,.18);border-color:#d8b24a;color:#fff1c2;}" +
      ".cp-theater-sound{position:absolute;top:max(16px,env(safe-area-inset-top));right:16px;z-index:2;width:44px;height:44px;display:flex;align-items:center;justify-content:center;font-size:18px;line-height:1;color:#f3e7c0;background:rgba(20,16,10,.55);border:1px solid rgba(216,178,74,.5);border-radius:999px;cursor:pointer;opacity:0;transform:translateY(-6px);transition:opacity .4s ease .12s,transform .4s ease .12s,background .2s,border-color .2s;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);}" +
      ".cp-theater.cp-open .cp-theater-sound{opacity:1;transform:none;}" +
      ".cp-theater-sound:hover{background:rgba(216,178,74,.18);border-color:#d8b24a;}";
    document.head.appendChild(st);
  }

  // pointer → which FILLED bead is under it (or null)
  function pickAt(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return null;
    _ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -(((clientY - rect.top) / rect.height) * 2 - 1));
    raycaster.setFromCamera(_ndc, camera);
    const hits = raycaster.intersectObjects(shells, false);
    for (const h of hits) if (h.object.userData.isFilled) return h.object.userData;
    return null;
  }

  // bead → viewport rect (center x/y + diameter px) so the player can grow FROM that exact spot
  // ☠️ LOOKED UP BY THE PICKED SHELL, NOT BY units[slot]. The slot is the bead's place on the
  // size ladder, and once any bead has been swapped out units[] is no longer in slot order:
  // units[slot] is then some OTHER bead and the player grew out of the wrong marble.
  function beadScreenRect(pick) {
    const rec = units.find((u) => u.shell.userData === pick) || units[pick.index];
    if (!rec) return { x: window.innerWidth / 2, y: window.innerHeight / 2, d: 120 };
    const u = rec.unit;
    const rad = rec.body.shapes[0].radius;
    const rect = canvas.getBoundingClientRect();
    const c = u.position.clone().project(camera);
    const cx = rect.left + (c.x * 0.5 + 0.5) * rect.width;
    const cy = rect.top + (-c.y * 0.5 + 0.5) * rect.height;
    _right.setFromMatrixColumn(camera.matrixWorld, 0);
    const e = u.position.clone().addScaledVector(_right, rad).project(camera);
    const ex = rect.left + (e.x * 0.5 + 0.5) * rect.width;
    return { x: cx, y: cy, d: Math.max(28, Math.abs(ex - cx) * 2) };
  }

  function enterTheater(pick) {
    if (focused) return;
    focused = true; frozen = true;
    hintRetired = true; hideHint(); // they found it — stop showing the hint for good
    clearTimeout(holdTimer); holdTimer = 0; holdPick = null;
    press = null;                   // the hold that opened this must never also launch a bead
    ptr.engaged = false;
    vids().forEach((el) => el.pause());
    if (navigator.vibrate) try { navigator.vibrate(12); } catch (_) {}

    const o = beadScreenRect(pick);
    const root = document.createElement("div");
    root.className = "cp-theater";
    root.innerHTML =
      '<div class="cp-theater-scrim"></div>' +
      '<button class="cp-theater-back" type="button" aria-label="Back to the marbles">‹ Back</button>' +
      '<button class="cp-theater-sound" type="button" aria-label="Toggle sound">🔊</button>' +
      '<video class="cp-theater-video" playsinline loop preload="auto" crossorigin="anonymous"></video>';
    document.body.appendChild(root);
    document.body.style.overflow = "hidden";

    const vid = root.querySelector(".cp-theater-video");
    const soundBtn = root.querySelector(".cp-theater-sound");
    // "don't play it muted": try sound-ON first — the hold is a recent user gesture, so most browsers
    // allow it; a strict policy (iOS) may block audible autoplay → fall back to muted so it never
    // freezes; the 🔊 toggle then unmutes on a direct tap.
    const tryPlay = () => { vid.muted = false; const p = vid.play(); if (p && p.catch) p.catch(() => { vid.muted = true; vid.play().catch(() => {}); }); };
    // ☠️ THE MANIFEST NAMES THE HD FILE; THE PATH REWRITE IS ONLY THE FALLBACK.
    // The cluster reels are small 480p loops with no sound, and the theatre is the whole
    // point of press and hold, so it must never play one of those when a real high
    // definition copy exists. It used to GUESS the HD path by rewriting the bead's URL
    // into /reels/hd/<name>, which worked only for clips that happened to live under
    // /reels and silently fell back to the 480 loop for every clip that did not, with no
    // error and nothing visibly wrong. reel-library.json now carries `hd` per entry, so
    // the entry is asked first and the rewrite is kept only for the callers that have no
    // manifest behind them.
    const guessed = pick.url.replace(/\/reels\/(?:fb\/)?([^/]+)$/, "/reels/hd/$1");
    const hdMeta = (pick.hd && typeof pick.hd === "object") ? pick.hd : null;
    const hdUrl = mediaUrl((hdMeta ? hdMeta.src : pick.hd) || guessed);
    // ☠️ THE THEATRE IS NOT ALWAYS PORTRAIT ANY MORE, AND THE STYLESHEET SAYS IT IS.
    // .cp-theater-video pins aspect-ratio 9/16 with object-fit cover, which was right
    // while every clip was a phone reel. The HD copies are source resolution and one of
    // the first 86 is 1080x608 landscape: forcing 9/16 on that crops a wide frame down to
    // a vertical sliver and throws away most of the picture, with nothing visibly wrong to
    // say so. When the manifest gives the real dimensions the frame takes them.
    if (hdMeta && hdMeta.w > 0 && hdMeta.h > 0) vid.style.aspectRatio = `${hdMeta.w} / ${hdMeta.h}`;
    let usedFallback = (hdUrl === mediaUrl(pick.url));
    vid.addEventListener("error", () => { if (!usedFallback) { usedFallback = true; vid.src = mediaUrl(pick.url); tryPlay(); } });
    vid.src = usedFallback ? mediaUrl(pick.url) : hdUrl;
    tryPlay();
    const syncSound = () => { soundBtn.textContent = vid.muted ? "🔇" : "🔊"; };
    vid.addEventListener("volumechange", syncSound);
    soundBtn.addEventListener("click", (e) => { e.stopPropagation(); vid.muted = !vid.muted; if (!vid.muted) vid.play().catch(() => {}); syncSound(); });
    syncSound();

    // open-from-bead: CSS aspect-ratio fixes the natural size (no metadata needed) → set the
    // COLLAPSED start (transition:none) → force a reflow → set the final WITH a transition so it
    // animates outward from the marble. Measuring before any transform gives the true rest size.
    const rect = vid.getBoundingClientRect();
    const ncx = rect.left + rect.width / 2, ncy = rect.top + rect.height / 2;
    const s = Math.max(0.04, o.d / Math.max(rect.width, rect.height));
    vid.style.transition = "none";
    vid.style.transform = "translate(" + (o.x - ncx) + "px," + (o.y - ncy) + "px) scale(" + s + ")";
    vid.style.borderRadius = "50%";
    vid.style.opacity = "0.5";
    vid.getBoundingClientRect(); // commit the collapsed start
    vid.style.transition = "transform .52s cubic-bezier(.2,.7,.2,1),border-radius .5s ease,opacity .4s ease";
    vid.style.transform = "none";
    vid.style.borderRadius = "18px";
    vid.style.opacity = "1";
    root.classList.add("cp-open");

    const close = () => exitTheater(root, vid, o);
    root.querySelector(".cp-theater-back").addEventListener("click", close);
    root.querySelector(".cp-theater-scrim").addEventListener("click", close);
    root._onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", root._onKey);
    currentTheater = root;
  }

  function exitTheater(root, vid, o) {
    if (!root || root._closing) return;
    root._closing = true;
    window.removeEventListener("keydown", root._onKey);
    root.classList.remove("cp-open");
    const rect = vid.getBoundingClientRect();
    const ncx = rect.left + rect.width / 2, ncy = rect.top + rect.height / 2;
    const s = Math.max(0.04, o.d / Math.max(rect.width, rect.height));
    vid.style.transition = "transform .4s cubic-bezier(.4,0,.6,1),border-radius .4s ease,opacity .34s ease";
    vid.style.transform = "translate(" + (o.x - ncx) + "px," + (o.y - ncy) + "px) scale(" + s + ")";
    vid.style.borderRadius = "50%";
    vid.style.opacity = "0";
    setTimeout(() => {
      try { vid.pause(); vid.removeAttribute("src"); vid.load(); } catch (_) {}
      root.remove();
      document.body.style.overflow = "";
      frozen = false; focused = false; currentTheater = null;
      if (active) vids().forEach((el, k) => setTimeout(() => { if (active && !focused) el.play().catch(() => {}); }, k * 40));
    }, 430);
  }

  // hard teardown (beat leaves / dispose while open) — no animation, just restore
  function closeTheaterNow() {
    if (!currentTheater) return;
    window.removeEventListener("keydown", currentTheater._onKey);
    currentTheater.remove();
    currentTheater = null;
    document.body.style.overflow = "";
    frozen = false; focused = false;
  }

  const onHoldDown = (e) => {
    if (focused) return;
    const t = e.touches ? e.touches[0] : e;
    if (!t) return;
    holdPick = pickAt(t.clientX, t.clientY);
    if (!holdPick) return;                 // empty bubble or miss → leave it to the fling path
    downX = t.clientX; downY = t.clientY;
    clearTimeout(holdTimer);
    holdTimer = setTimeout(() => { if (holdPick && !focused) enterTheater(holdPick); }, HOLD_MS);
  };
  const onHoldMove = (e) => {
    if (!holdTimer) return;
    const t = e.touches ? e.touches[0] : e;
    if (!t) return;
    if (Math.hypot(t.clientX - downX, t.clientY - downY) > MOVE_CANCEL) { clearTimeout(holdTimer); holdTimer = 0; holdPick = null; }
  };
  const onHoldUp = () => { clearTimeout(holdTimer); holdTimer = 0; holdPick = null; };
  const onCtx = (e) => e.preventDefault();
  canvas.addEventListener("pointerdown", onHoldDown);
  window.addEventListener("pointermove", onHoldMove);
  window.addEventListener("pointerup", onHoldUp);
  window.addEventListener("pointercancel", onHoldUp);
  canvas.addEventListener("contextmenu", onCtx);

  // ── TAP TO ADD: a press shorter than HOLD_MS that moved less than MOVE_CANCEL ──
  // ☠️ THE THREE GESTURES ARE TOLD APART ON RELEASE, NEVER ON PRESS. Down only records
  // where and when. A press that travels past MOVE_CANCEL is a drag (it flings, see onMove)
  // and can no longer be a tap. A press still down at HOLD_MS belongs to the theatre, which
  // clears `press` when it opens. Only what is left at pointerup is a tap, so a hold can
  // never also launch a bead and a fling never launches one either.
  const onTapDown = (e) => {
    if (!tapMode || focused || !active || e.isPrimary === false) return;
    if (e.button != null && e.button > 0) return;    // right or middle mouse is not a tap
    press = {
      x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId, drag: false,
      // what the finger landed on, read BEFORE anything can move it
      pick: shellRecAt(e.clientX, e.clientY),
    };
  };
  const onTapMove = (e) => {
    if (!press || e.pointerId !== press.id || press.drag) return;
    if (Math.hypot(e.clientX - press.x, e.clientY - press.y) > MOVE_CANCEL) press.drag = true;
  };
  const onTapUp = (e) => {
    const p = press;
    press = null;
    if (!p || e.pointerId !== p.id || p.drag || focused || !active) return;
    if (performance.now() - p.t >= HOLD_MS) return;   // a hold, on a bead or on empty glass
    if (Math.hypot(e.clientX - p.x, e.clientY - p.y) > MOVE_CANCEL) return;
    launchAt(e.clientX, e.clientY, p.pick);
  };
  const onTapCancel = () => { press = null; };
  if (tapMode) {
    canvas.addEventListener("pointerdown", onTapDown);
    window.addEventListener("pointermove", onTapMove);
    window.addEventListener("pointerup", onTapUp);
    window.addEventListener("pointercancel", onTapCancel);
  }

  function resize() {
    // On the viewport stage the sentinel's size says nothing about the drawing buffer.
    const w = (viewportStage ? window.innerWidth : container.clientWidth) || 1;
    const h = (viewportStage ? window.innerHeight : container.clientHeight) || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();

  // ── loop, gated to the Leadership beat ──
  const clock = new THREE.Clock();
  const _f = new CANNON.Vec3();
  let active = false, rafId = 0;
  function frame() {
    if (!active) return;
    if (frozen) { rafId = requestAnimationFrame(frame); return; } // a marble is open — hold the cluster still
    let dt = Math.min(clock.getDelta(), MAX_DT);
    if (dt <= 0) dt = 1 / 60;

    // cursor → 3D point on the local z=0 plane; drive the kinematic body there WITH velocity (the fling)
    if (ptr.engaged) {
      _ndc.set(ptr.x, ptr.y);
      raycaster.setFromCamera(_ndc, camera);
      if (raycaster.ray.intersectPlane(PLANE, _hit)) {
        if (ptr.fresh) { prevCursor.copy(_hit); ptr.fresh = false; }
        // soft fling: only a fraction of the finger's speed, capped so a quick press can't launch beads away
        let vx = ((_hit.x - prevCursor.x) / dt) * FLING_SCALE;
        let vy = ((_hit.y - prevCursor.y) / dt) * FLING_SCALE;
        const sp = Math.hypot(vx, vy);
        if (sp > MAX_CURSOR) { const k = MAX_CURSOR / sp; vx *= k; vy *= k; }
        cursorBody.velocity.set(vx, vy, 0);
        cursorBody.position.set(_hit.x, _hit.y, 0);
        prevCursor.copy(_hit);
      }
    } else {
      cursorBody.position.set(999, 999, 999);
      cursorBody.velocity.set(0, 0, 0);
    }

    // ☠️ ONLY LIVE BEADS FEEL THE SPRING. A bead still raining in has not joined the wall
    // yet, and a bead that has been knocked out must be allowed to leave: putting either
    // under the centring force would drag the incoming one sideways on its way down and
    // haul the outgoing one straight back into the shoal it was just displaced from.
    for (const rec of units) {
      const { body, state } = rec;
      const m = body.mass;
      if (state === 'live') {
        _f.set(
          -kX * body.position.x * m,
          -kY * (body.position.y - centreY) * m,   // pulls home to centreY, not to zero
          -kZ * body.position.z * m,
        );
        body.applyForce(_f, body.position);
      } else if (state === 'falling') {
        // gravity for the departing bead only; the world itself stays weightless
        _f.set(0, -FALL_G * m, -kZ * body.position.z * m);
        body.applyForce(_f, body.position);
      } else {
        // incoming: a fraction of the centring spring so a miss still comes home, and the
        // full z spring so it strikes the wall, not the air in front of it
        _f.set(
          -kX * body.position.x * m * INCOMING_PULL,
          -kY * (body.position.y - centreY) * m * INCOMING_PULL,
          -kZ * body.position.z * m,
        );
        body.applyForce(_f, body.position);
      }
    }
    stepSwap();

    world.step(1 / 60, dt, 3);

    // sync meshes; keep each video face billboarded + upright (the bead may roll, the face stays readable)
    for (const { unit, body } of units) {
      unit.position.set(body.position.x, body.position.y, body.position.z);
      const plane = unit.userData.plane;
      if (plane) plane.quaternion.copy(camera.quaternion);
    }
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(frame);
  }

  function setActive(v) {
    if (v === active) return;
    active = v;
    if (active) {
      // stagger the starts so 16 decoders don't all spin up in one frame (helps every reel actually play)
      vids().forEach((el, k) => setTimeout(() => { if (active) el.play().catch(() => {}); }, k * 70));
      clock.getDelta();
      rafId = requestAnimationFrame(frame);
      showHint(); // beat is live — invite the press-and-hold
    } else {
      closeTheaterNow(); // beat left while a marble was open — tear the theater down, unfreeze
      cancelAnimationFrame(rafId);
      vids().forEach((el) => el.pause());
      hideHint();
    }
  }

  window.addEventListener("resize", resize);

  function dispose() {
    setActive(false);
    closeTheaterNow();
    hideHint(); hint.remove();
    canvas.removeEventListener("pointerdown", onHoldDown);
    window.removeEventListener("pointermove", onHoldMove);
    window.removeEventListener("pointerup", onHoldUp);
    window.removeEventListener("pointercancel", onHoldUp);
    canvas.removeEventListener("contextmenu", onCtx);
    canvas.removeEventListener("pointerdown", onTapDown);
    window.removeEventListener("pointermove", onTapMove);
    window.removeEventListener("pointerup", onTapUp);
    window.removeEventListener("pointercancel", onTapCancel);
    tapTimers.forEach(clearTimeout);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onMove);
    window.removeEventListener("touchstart", onMove);
    window.removeEventListener("touchmove", onMove);
    window.removeEventListener("pointerup", onLeave);
    window.removeEventListener("touchend", onLeave);
    window.removeEventListener("pointerleave", onLeave);
    window.removeEventListener("pointercancel", onLeave);
    window.removeEventListener("touchcancel", onLeave);
    window.removeEventListener("resize", resize);
    // ☠️ THE OLD TEARDOWN LEAKED EVERYTHING THAT COSTS MEMORY.
    // It released two geometries, the environment render target and the renderer, and
    // nothing else: not the video elements, not their VideoTextures, not the materials
    // holding those textures, not the glass. That was survivable while the cluster was
    // built once and lived for the visit. It is not survivable now the wall pages through
    // sets, because a switch is a dispose and a rebuild, and every switch would strand
    // another 24 decoders and 24 GPU textures.
    // The video element needs BOTH halves: removing src alone leaves the decoder holding
    // the last buffer, and load() on a src-less element is what actually releases it.
    // ☠️ WALK THE LIVE SET, NOT THE BUILD-TIME POOL. After a rain swap the beads on screen
    // are not the ones texPool was built from: those were retired one at a time and new
    // ones took their place. Disposing texPool would free six decoders nobody is using and
    // strand the ten that are.
    if (swap) { swap.timers.forEach(clearTimeout); swap.beads.forEach(detachCollide); swap = null; }
    queued = null;
    // the decoders warmed for the neighbouring sets are nobody's once the wall is gone
    for (const t of warmed.values()) dropWarm(t);
    warmed.clear();
    for (const rec of units) disposeTex(rec.tex);
    // anything still holding a src is a decoder no bead or warm slot accounted for: free it
    for (const el of liveVideos) {
      try { el.pause(); el.removeAttribute("src"); el.load(); } catch (e) { /* torn down */ }
    }
    liveVideos.clear();
    for (const shell of shells) shell.material.dispose();
    sphereGeo.dispose(); planeGeo.dispose(); envRT.dispose();
    scene.environment = null;   // envSrc is already disposed at build time, line ~161

    renderer.dispose();
    // Contexts are reclaimed lazily, and a browser allows only about sixteen live ones.
    // A visitor clicking through six sets would otherwise be racing the garbage collector
    // for them. forceContextLoss hands this one back on the spot.
    try { renderer.forceContextLoss(); } catch (e) { /* not all backends implement it */ }
    canvas.remove();
  }

  // ────────────────────────────────────────────────────────────────────────────────────
  // THE RAIN SWAP
  //
  // Jarich: "they look heavy when i change sets, it takes too long to wait for them to
  // subside. make it when the user change set a marble glass one by one will hit an
  // existing ball per 0.3 second so we lose marble glass naturally ... make the glass
  // marbles come from up above."
  //
  // ☠️ THE SCENE IS NEVER REBUILT. A set change used to dispose the whole cluster and
  // construct the next one, which is why it read as heavy: the wall vanished, a fresh
  // WebGL context came up, and ten decoders started from nothing while the new shoal
  // converged from a random scatter. Now the wall stays live and the sets cross over
  // inside it, one bead at a time.
  // ────────────────────────────────────────────────────────────────────────────────────
  let swap = null;          // the run in progress
  let queued = null;        // one click banked while a run is going

  const visTop = () => (camera.position.z * Math.tan((45 * Math.PI) / 180 / 2));

  // ☠️ THE RAIN IS ONLY AS FAST AS ITS FIRST FRAMES, SO THE FETCH HAS TO START BEFORE THE
  // CLICK. Every bead clip is a cross-origin fetch from the media origin. A decoder opened
  // at click time needs the better part of a second before it holds a frame, and a bead
  // must never fall in as black glass, so each drop sat out its grace period waiting: the
  // measured swap was seven to thirteen seconds for a run that should take three.
  // The wall is at rest far longer than it is swapping, so the sets either side of the one
  // on screen are fetched during that quiet time and swapTo takes a decoder that already
  // has a frame. Keyed by slot AND url because the slot picks the crop focus.
  const warmed = new Map();
  const WARM_CAP = 24;      // the two neighbouring sets of ten, with room to spare
  const warmKey = (e) => `${e.slot}|${e.url}`;
  function openTex(e) {
    const t = makeTex(e.url, e.slot, e.poster || null);
    t.el.preload = "auto";
    try { t.el.load(); } catch (err) { /* torn down */ }
    return t;
  }
  function dropWarm(t) { disposeTex(t); }
  /**
   * Open decoders for the sets a click could reach next, so a later swapTo on one of them
   * drops at full cadence. `lists` is every set to keep warm; anything warmed earlier that
   * is not in them is dropped, so the pool is exactly the neighbours and never grows.
   * The heap proof depends on that: a pool that only evicts at a cap drifts upward with
   * every page and reads as a leak.
   */
  function prefetch(...lists) {
    const keep = new Set();
    for (const list of lists) for (const e of list || []) keep.add(warmKey(e));
    for (const [key, t] of warmed) {
      if (!keep.has(key)) { dropWarm(t); warmed.delete(key); }
    }
    for (const list of lists) {
      for (const e of list || []) {
        const key = warmKey(e);
        if (warmed.has(key) || warmed.size >= WARM_CAP) continue;
        warmed.set(key, openTex(e));
      }
    }
  }

  /** An incoming bead becomes part of the wall: it feels the spring from here on. */
  function land(rec) {
    if (rec.state !== 'incoming') return;
    rec.state = 'live';
    rec.body.linearDamping = damping;
  }

  function releaseOutgoing(rec) {
    if (!rec || rec.state !== 'live') return;
    rec.state = 'falling';
    rec.fellAt = performance.now();
    tapClaims.delete(rec);
    stats.knocked += 1;
    const v = rec.body.velocity;
    if (tapMode) {
      // ☠️ A STRUCK BEAD GIVES ITS DECODER BACK THE MOMENT IT LEAVES THE WALL, NOT WHEN IT
      // LEAVES THE SCREEN. Under continuous tapping several beads are in the air at once,
      // and each one still holding a playing video would let the decoder count climb with
      // the tap rate. It flies out wearing its poster, which nobody can tell apart at speed.
      releaseVideo(rec.tex);
      // The launch mostly strikes along the view axis (the bead is born in front of the one
      // under the finger), so the impact alone pushes the target BACK, not out. It leaves
      // outward from the well's centre, the shortest way off the stage, plus what the hit gave.
      let dx = rec.body.position.x, dy = rec.body.position.y - centreY;
      const len = Math.hypot(dx, dy);
      if (len < 0.05) { const a = Math.random() * Math.PI * 2; dx = Math.cos(a); dy = Math.sin(a); }
      else { dx /= len; dy /= len; }
      v.set(v.x * 0.4 + dx * TAP_KNOCK_SPEED, v.y * 0.4 + dy * TAP_KNOCK_SPEED, v.z * 0.4);
      rec.body.angularVelocity.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
      rec.body.linearDamping = 0.02;
      return;
    }
    // The impact velocity is the fling: the bead keeps whatever the collision gave it and
    // leaves under a little gravity. Only a bead that was released by the fallback timer
    // (a near miss, so it is barely moving) gets a kick of its own, outward at random.
    if (v.length() < 1.5) {
      const a = Math.random() * Math.PI * 2;
      v.set(Math.cos(a) * 5, Math.sin(a) * 5, 0);
    }
    rec.body.angularVelocity.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
    rec.body.linearDamping = 0.02;   // let it actually fly
  }

  /** Drop a bead's landing listener. Only ever called from stepSwap, never from a handler. */
  function detachCollide(rec) {
    if (!rec.onCollide) return;
    rec.body.removeEventListener('collide', rec.onCollide);
    rec.onCollide = null;
  }

  function retire(rec) {
    detachCollide(rec);
    const i = units.indexOf(rec);
    if (i >= 0) units.splice(i, 1);
    const si = shells.indexOf(rec.shell);
    if (si >= 0) shells.splice(si, 1);
    world.removeBody(rec.body);
    group.remove(rec.unit);
    rec.shell.material.dispose();
    tapClaims.delete(rec);
    // ☠️ THE DECODER GOES WITH THE BEAD. Both halves: removing src alone leaves the
    // decoder holding its last buffer, and load() on a src-less element frees it.
    // disposeTex does both, and also frees the poster and the material holding them.
    if (rec.tex) disposeTex(rec.tex);
    stats.retired += 1;
  }

  /** A random LIVE bead that has not already been claimed by this run. */
  function pickTarget(claimed) {
    const open = units.filter((rec) => rec.state === 'live' && !claimed.has(rec));
    if (!open.length) return null;
    return open[Math.floor(Math.random() * open.length)];
  }

  /** True once a bead is a whole bead outside the visible stage on ANY side. */
  function offStage(rec) {
    const halfH = visTop(), halfW = halfH * camera.aspect;
    const { x, y } = rec.body.position;
    return Math.abs(x) > halfW + rec.r * 2 || Math.abs(y) > halfH + rec.r * 2;
  }

  function stepSwap() {
    // a struck bead is gone once it is a whole bead outside the stage, whichever way it flew
    const tNow = performance.now();
    for (let i = units.length - 1; i >= 0; i -= 1) {
      const rec = units[i];
      // a struck bead that never makes it off (a corner, a pile up) is retired anyway, so
      // the count always comes back to the wall size
      if (rec.state === 'falling' && (offStage(rec) || (rec.fellAt && tNow - rec.fellAt > FALL_MAX_MS))) { retire(rec); continue; }
      // an incoming bead joins the wall on first contact (the collide listener), or once
      // it has plainly arrived: a swap can never be left waiting on a bead already home
      if (rec.state === 'incoming' && tNow - rec.droppedAt > LAND_BY_MS) land(rec);
    }
    if (tapMode) stepTaps(tNow);
    if (!swap) return;
    const now = performance.now();
    // ☠️ DUE TIMES ARE ABSOLUTE, NOT "0.3s AFTER THE LAST ONE ACTUALLY FELL".
    // The first build re-based the clock on each real drop, so a bead that spent its full
    // grace waiting for a frame pushed every later bead back by that second as well: ten
    // cold beads came to 1.3s each, thirteen seconds for a run meant to take three. Slot n
    // is due at t0 + n*0.3s whatever happened before it, so a slow clip costs its own delay
    // and nothing more, and a run that starts warm lands on an exact 0.3s cadence.
    const dueAt = swap.t0 + swap.done * RAIN_EVERY_MS;
    if (swap.done < swap.list.length && now >= dueAt) {
      // ☠️ NEVER DROP A BEAD AS BLACK GLASS, AND NEVER LET ONE SLOW CLIP STALL THE RAIN.
      // Order is a PREFERENCE, not a queue: take the next undropped bead whose first frame
      // has decoded, and only fall back to the head of the line once that bead has used its
      // full grace. With the warm pool filled ahead of the click this is the ready path
      // every time; the grace is the safety net for a cold cache or a slow network.
      let k = swap.order.find((j) => !swap.dropped[j] && swap.tex[j].el.readyState >= 2);
      if (k === undefined) {
        const head = swap.order.find((j) => !swap.dropped[j]);
        if (head === undefined) return;
        if (now - dueAt < RAIN_WAIT_MS) return;   // still inside its grace, wait
        k = head;                                  // grace spent: drop it dim
      }
      const entry = swap.list[k];
      const tex = swap.tex[k];
      swap.dropped[k] = true;
      swap.done += 1;

      const target = pickTarget(swap.claimed);
      // spawn on a ring just outside the visible stage, at a random angle, and throw it
      // at the target (or the well's centre when nothing is left to hit)
      const halfH = visTop(), halfW = halfH * camera.aspect;
      const ang = Math.random() * Math.PI * 2;
      const spawn = new CANNON.Vec3(Math.cos(ang) * (halfW + 1.6), Math.sin(ang) * (halfH + 1.6), 0);
      const aimX = target ? target.body.position.x : 0;
      const aimY = target ? target.body.position.y : centreY;
      const dx = aimX - spawn.x, dy = aimY - spawn.y;
      const len = Math.hypot(dx, dy) || 1;
      const rec = makeBead(entry.slot, entry.url, entry.hd, tex, spawn);
      rec.state = 'incoming';
      rec.droppedAt = now;
      rec.body.linearDamping = 0.02;          // fly cleanly, damping resumes on landing
      rec.body.velocity.set((dx / len) * ENTRY_SPEED, (dy / len) * ENTRY_SPEED, 0);
      tex.el.play().catch(() => {});
      // ☠️ TOUCHING THE WALL IS LANDING. First contact with a bead that is already part
      // of the wall (live, or one on its way out) hands the newcomer to the spring on the
      // spot. Contact with another newcomer in flight does not count, or two beads that
      // clip each other on the way in would both stop short and hover.
      // ☠️ ONE LISTENER, AND IT IS NEVER REMOVED FROM INSIDE ITS OWN DISPATCH. cannon-es
      // walks the listener array by index; a listener that splices itself out while a
      // second one is queued behind it leaves the loop reading past the end, the throw
      // escapes world.step, and the animation frame is never re-armed. The page froze on
      // the first landing with "Cannot read properties of undefined (reading 'call')".
      // Flags make it idempotent; stepSwap detaches it at completion, outside any event.
      const hit = { landed: false, released: !target };
      const onCollide = (e) => {
        if (!hit.landed) {
          const other = units.find((u) => u.body === e.body);
          if (other && other.state !== 'incoming') { hit.landed = true; land(rec); }
        }
        if (!hit.released && e.body === target.body) { hit.released = true; releaseOutgoing(target); }
      };
      rec.body.addEventListener('collide', onCollide);
      rec.onCollide = onCollide;
      swap.beads.push(rec);
      if (target) {
        swap.claimed.add(target);
        // contact releases the target; a timeout releases it anyway, because a near miss
        // must not leave a bead that never leaves.
        swap.timers.push(setTimeout(() => { if (!hit.released) { hit.released = true; releaseOutgoing(target); } }, 1600));
      }
      return;
    }
    if (swap.done >= swap.list.length) {
      const stillIn = units.some((u) => u.state === 'incoming');
      if (!stillIn) {
        const done = swap.onDone;
        // ☠️ RELEASE BEFORE CLEARING, OR THE WALL GROWS TO TWENTY.
        // Each drop arms a 1.2s fallback that knocks its target out if the collision was a
        // near miss. The last drops' timers are still pending when the final bead lands, so
        // clearing them here without firing them first would leave those outgoing beads
        // live for ever: ten old plus ten new, and the next swap would claim against a
        // shoal twice the size it should be. Found by reading this back rather than in the
        // trace, because the first version stalled before it ever completed a swap.
        for (const t of swap.claimed) releaseOutgoing(t);
        swap.timers.forEach(clearTimeout);
        for (const b of swap.beads) detachCollide(b);
        swap = null;
        if (done) done();
        if (queued) { const q = queued; queued = null; swapTo(q.list, q.onDone); }
      }
    }
  }

  /**
   * Cross the wall over to a new set, raining the incoming beads in one at a time.
   * Returns false if the run was queued behind one already in progress.
   */
  function swapTo(list, onDone) {
    if (swap) { queued = { list, onDone }; return false; }
    if (!list || !list.length) return false;
    // a decoder the panel warmed while the wall was at rest is taken as it stands;
    // anything not warmed starts fetching now and rides the grace path if it must
    const tex = list.map((e) => {
      const key = warmKey(e);
      const w = warmed.get(key);
      if (w) { warmed.delete(key); return w; }
      return openTex(e);
    });
    swap = {
      list, tex, done: 0, dropped: list.map(() => false),
      order: list.map((_, k) => k), t0: performance.now(),
      claimed: new Set(), timers: [], beads: [], onDone,
    };
    return true;
  }

  /** True while a rain swap is running, so the caller can hold its label. */
  function swapping() { return !!swap; }

  // ────────────────────────────────────────────────────────────────────────────────────
  // TAP TO ADD
  //
  // The library is a RING. The first `count` reels seed the wall; every accepted tap takes
  // the next one, births its bead at the finger, and throws it at a bead in the wall. The
  // struck bead is knocked out through the same falling and retire path the rain uses, so
  // one in means one out and the wall holds its count however fast anyone taps.
  // ────────────────────────────────────────────────────────────────────────────────────
  const tapClaims = new Set();     // live beads a launch in the air is already aimed at
  const tapTimers = new Set();
  const stats = { taps: 0, launched: 0, ignored: 0, knocked: 0, retired: 0, haptics: 0 };
  let ringPos = tapMode ? Math.min(count, reels.length) % reels.length : 0;
  const LAUNCH_PLANE = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const tapKey = (e) => `tap|${e.url}`;

  // ☠️ NEVER TWO OF THE SAME REEL ON THE WALL. The ring wraps after a full lap, and a bead
  // nobody has struck in all that time would otherwise meet its own clip coming round
  // again. Anything already on the wall or on its way in is skipped this lap.
  function wallUrls() {
    return new Set(units.filter((u) => u.state !== 'falling').map((u) => u.shell.userData.url));
  }
  function peekAhead(n) {
    const out = [];
    if (!tapMode) return out;
    const onWall = wallUrls();
    for (let k = 0; k < reels.length && out.length < n; k += 1) {
      const e = reels[(ringPos + k) % reels.length];
      if (!onWall.has(e.url)) out.push(e);
    }
    return out;
  }
  function nextEntry() {
    const onWall = wallUrls();
    for (let k = 0; k < reels.length; k += 1) {
      const i = (ringPos + k) % reels.length;
      if (!onWall.has(reels[i].url)) { ringPos = (i + 1) % reels.length; return reels[i]; }
    }
    return null;
  }
  /** Keep exactly the next TAP_WARM_AHEAD reels' decoders open, and nothing else. */
  function warmAhead() {
    if (!tapMode) return;
    const ahead = peekAhead(TAP_WARM_AHEAD);
    const keep = new Set(ahead.map(tapKey));
    for (const [k, t] of warmed) if (!keep.has(k)) { dropWarm(t); warmed.delete(k); }
    for (const e of ahead) {
      const k = tapKey(e);
      if (!warmed.has(k)) warmed.set(k, openTex({ url: e.url, slot: 0, poster: e.poster }));
    }
  }
  function takeWarm(e) {
    const k = tapKey(e);
    const t = warmed.get(k);
    if (t) { warmed.delete(k); return t; }
    return openTex({ url: e.url, slot: 0, poster: e.poster });
  }

  /** The live bead under a screen point, or null. */
  function shellRecAt(cx, cy) {
    const rect = canvas.getBoundingClientRect();
    if (cx < rect.left || cx > rect.right || cy < rect.top || cy > rect.bottom) return null;
    _ndc.set(((cx - rect.left) / rect.width) * 2 - 1, -(((cy - rect.top) / rect.height) * 2 - 1));
    raycaster.setFromCamera(_ndc, camera);
    for (const h of raycaster.intersectObjects(shells, false)) {
      const rec = units.find((u) => u.shell === h.object);
      if (rec && rec.state === 'live') return rec;
    }
    return null;
  }
  const _p = new THREE.Vector3();
  function toScreen(rec, rect) {
    _p.set(rec.body.position.x, rec.body.position.y, rec.body.position.z).project(camera);
    return { x: rect.left + (_p.x * 0.5 + 0.5) * rect.width, y: rect.top + (-_p.y * 0.5 + 0.5) * rect.height };
  }
  /** The live, unclaimed bead whose centre is nearest a screen point. */
  function nearestLive(cx, cy) {
    const rect = canvas.getBoundingClientRect();
    let best = null, bd = Infinity;
    for (const rec of units) {
      if (rec.state !== 'live' || tapClaims.has(rec)) continue;
      const s = toScreen(rec, rect);
      const d = Math.hypot(s.x - cx, s.y - cy);
      if (d < bd) { bd = d; best = rec; }
    }
    return best;
  }

  function setRadius(rec, rad) {
    const sh = rec.body.shapes[0];
    sh.radius = rad;
    sh.updateBoundingSphereRadius();
    rec.body.updateBoundingRadius();
    rec.body.aabbNeedsUpdate = true;
  }

  /**
   * One accepted tap. Returns true when a bead was launched. `pick` is the bead the finger
   * landed on at pointerdown, read before anything could move it.
   */
  function launchAt(cx, cy, pick) {
    stats.taps += 1;
    let inFlight = 0;
    for (const u of units) if (u.state === 'incoming') inFlight += 1;
    if (inFlight >= TAP_IN_FLIGHT) { stats.ignored += 1; return false; }

    // the bead under the finger, else the nearest one; never one already being aimed at
    const ok = (rec) => rec && rec.state === 'live' && !tapClaims.has(rec);
    let target = ok(pick) ? pick : null;
    if (!target) { const under = shellRecAt(cx, cy); if (ok(under)) target = under; }
    if (!target) target = nearestLive(cx, cy);
    if (!target) { stats.ignored += 1; return false; }
    const entry = nextEntry();
    if (!entry) { stats.ignored += 1; return false; }

    // ☠️ BORN AT THE FINGER, IN FRONT OF THE WALL. The screen point is cast onto a plane
    // just in front of the target, so the new bead appears exactly under the fingertip and
    // nearer the camera than the bead it is about to hit: it comes OUT of the finger and
    // INTO the wall. Born small, so it does not overlap the target on its first frame.
    const r = baseR * LADDER[target.slot % LADDER.length];
    const launchZ = Math.min(camera.position.z * 0.45, target.body.position.z + target.r + r * 0.9);
    const rect = canvas.getBoundingClientRect();
    _ndc.set(((cx - rect.left) / rect.width) * 2 - 1, -(((cy - rect.top) / rect.height) * 2 - 1));
    raycaster.setFromCamera(_ndc, camera);
    LAUNCH_PLANE.constant = -launchZ;          // the plane z = launchZ
    if (!raycaster.ray.intersectPlane(LAUNCH_PLANE, _hit)) { stats.ignored += 1; return false; }

    const now = performance.now();
    const tex = takeWarm(entry);
    // the newcomer takes the struck bead's place on the size ladder, so the wall keeps its shape
    const rec = makeBead(target.slot, entry.url, entry.hd, tex, new CANNON.Vec3(_hit.x, _hit.y, launchZ));
    rec.state = 'incoming';
    rec.droppedAt = now;
    rec.body.linearDamping = 0.02;
    rec.unit.scale.setScalar(TAP_GROW_FROM);
    setRadius(rec, rec.r * TAP_GROW_FROM);
    const tp = { target, t0: now, growing: true, landed: false, released: false };
    rec.tap = tp;
    const tb = target.body.position, b = rec.body.position;
    const dx = tb.x - b.x, dy = tb.y - b.y, dz = tb.z - b.z;
    const len = Math.hypot(dx, dy, dz) || 1;
    rec.body.velocity.set((dx / len) * TAP_SPEED, (dy / len) * TAP_SPEED, (dz / len) * TAP_SPEED);

    // ☠️ THE SAME ONE-LISTENER, FLAGS-ONLY RULE AS THE RAIN (see stepSwap): cannon-es walks
    // its listener array by index, so this is never removed from inside its own dispatch.
    // stepTaps detaches it once both flags are set.
    const onCollide = (e) => {
      if (e.body === tp.target.body) {
        if (!tp.released) { tp.released = true; releaseOutgoing(tp.target); clink('hit'); hapticThud(); }
        if (!tp.landed) { tp.landed = true; land(rec); }
        return;
      }
      // until the target is struck, brushing another bead does not stop the throw
      if (!tp.landed && tp.released) {
        const other = units.find((u) => u.body === e.body);
        if (other && other.state === 'live') { tp.landed = true; land(rec); }
      }
    };
    rec.body.addEventListener('collide', onCollide);
    rec.onCollide = onCollide;
    tapClaims.add(target);
    // a throw that never touches its target still knocks it out, or the wall would grow
    const timer = setTimeout(() => {
      tapTimers.delete(timer);
      if (!tp.released) { tp.released = true; releaseOutgoing(tp.target); }
    }, TAP_KNOCK_MS);
    tapTimers.add(timer);

    if (active && !focused) tex.el.play().catch(() => {});
    // ☠️ ONE HAPTIC PER ACCEPTED TAP, AT LAUNCH, NEVER ON THE COLLISION. A tap that was
    // ignored (too many in the air) gets none, so the hand learns which taps counted.
    hapticTick();
    clink('tap');
    stats.haptics += 1;
    stats.launched += 1;
    hideHint();
    warmAhead();
    return true;
  }

  /** Per frame, before the physics step: grow the newborns and steer them home. */
  function stepTaps(now) {
    for (const rec of units) {
      const tp = rec.tap;
      if (!tp) continue;
      if (tp.growing) {
        const k = Math.min(1, (now - tp.t0) / TAP_GROW_MS);
        const s = TAP_GROW_FROM + (1 - TAP_GROW_FROM) * (1 - Math.pow(1 - k, 3));
        rec.unit.scale.setScalar(s);
        setRadius(rec, rec.r * s);
        if (k >= 1) tp.growing = false;
      }
      // ☠️ IT HOMES ON THE TARGET UNTIL IT STRIKES. The target is still a sprung bead in a
      // jostling wall, and a throw aimed at where it WAS can sail past by a bead's width,
      // which leaves the knock to the timer and reads as a miss. Re-aiming every frame at
      // the same speed makes the hit the outcome, not the hope.
      if (rec.state === 'incoming' && !tp.released && tp.target.state === 'live') {
        const tb = tp.target.body.position, b = rec.body.position;
        const dx = tb.x - b.x, dy = tb.y - b.y, dz = tb.z - b.z;
        const len = Math.hypot(dx, dy, dz) || 1;
        rec.body.velocity.set((dx / len) * TAP_SPEED, (dy / len) * TAP_SPEED, (dz / len) * TAP_SPEED);
      }
      if (!tp.growing && tp.released && rec.state !== 'incoming') {
        detachCollide(rec);          // outside any dispatch, as the rule above requires
        rec.tap = null;
      }
    }
  }

  /** Every bead as drawn: screen centre, diameter in css px, state and what its face shows.
   *  The proof harness reads this; the page does not. */
  function beads() {
    const rect = canvas.getBoundingClientRect();
    _right.setFromMatrixColumn(camera.matrixWorld, 0);
    return units.map((rec) => {
      const p = rec.unit.position.clone();
      const c = p.clone().project(camera);
      const e = p.clone().addScaledVector(_right, rec.body.shapes[0].radius).project(camera);
      const x = rect.left + (c.x * 0.5 + 0.5) * rect.width;
      const y = rect.top + (-c.y * 0.5 + 0.5) * rect.height;
      const ex = rect.left + (e.x * 0.5 + 0.5) * rect.width;
      const t = rec.tex;
      return {
        slot: rec.slot, state: rec.state, x, y, d: Math.abs(ex - x) * 2,
        url: rec.shell.userData.url,
        face: !t ? 'none' : t.released ? 'poster' : (t.planeMat.map === t.vtex ? 'video' : 'poster'),
      };
    });
  }

  if (tapMode) warmAhead();

  /** The shoal's own extent in world units, radii included, once the spring has settled.
   *  A caller can compare it against the visible height (2 * cameraZ * tan(22.5deg)) and
   *  know whether its framing actually clears the beads instead of guessing from a
   *  screenshot: this canvas has no preserveDrawingBuffer, so its pixels cannot be read
   *  back after the frame is presented. */
  function bounds() {
    // ☠️ TOP AND BOTTOM SEPARATELY, BECAUSE THE SHOAL IS NO LONGER CENTRED ON ZERO.
    // halfH used to be max(|y|)+r, which is only the shoal's extent while its centre sits
    // at the origin. With the well seated lower that number silently becomes the distance
    // to whichever edge happens to be further from zero, and a caller asking "does the top
    // clear the copy" would get an answer about the bottom. top and bottom are the real
    // edges; halfH is kept as the half HEIGHT so existing fit checks still mean something.
    // ☠️ LIVE BEADS ONLY. During a rain swap the array also holds beads still falling in
    // from above the stage and beads on their way out below it. Counting those would report
    // an extent several screens tall, and the panel's seating loop reads this number: it
    // would haul the whole wall around chasing a bead that is leaving.
    let maxX = 0, top = -Infinity, bottom = Infinity, sumY = 0, sumX = 0, n = 0;
    let incoming = 0, falling = 0;
    for (const { unit, body, state } of units) {
      if (state === 'incoming') incoming += 1;
      if (state === 'falling') falling += 1;
      if (state !== 'live') continue;
      n += 1;
      const r = body.shapes[0]?.radius ?? 0;
      maxX = Math.max(maxX, Math.abs(unit.position.x) + r);
      top = Math.max(top, unit.position.y + r);
      bottom = Math.min(bottom, unit.position.y - r);
      sumY += unit.position.y;
      sumX += unit.position.x;
    }
    if (!n) { top = 0; bottom = 0; }
    // ☠️ meanY IS WHAT A CALLER SHOULD MEASURE THE SHOAL'S SHAPE AGAINST, NOT centreY.
    // The shoal's SPREAD about its own centre of mass settles in a second or two. The
    // journey of that centre of mass to the well's centre takes far longer, and after the
    // well is re-seated it is a slow slide. Measuring the shape against centreY during
    // that slide reads a shoal that is smaller than it will be, which is exactly how the
    // first seating attempt ended up parking the wall over the copy it was meant to clear.
    const meanY = n ? sumY / n : 0;
    // ☠️ meanX IS THE SIGNAL FOR "DID IT COME BACK TO THE MIDDLE". The shoal's WIDTH is
    // not: beads rearrange when they are flung, so the extent settles near a different
    // number afterwards and a test watching it reads "never came home" on a wall that
    // plainly did. The centre of mass returns to the well's centre every time.
    const meanX = n ? sumX / n : 0;
    const maxY = (top - bottom) / 2;
    // ☠️ READ LIVE OFF THE CAMERA, NOT OFF A STORED NUMBER. The fov is vertical and fixed,
    // so the visible HEIGHT only depends on the camera distance, but the visible WIDTH is
    // height times the aspect, and resize() rewrites that aspect on every window change.
    // Computing it here means the reported stage is always the stage as it is now.
    const visibleHalfH = camera.position.z * Math.tan((45 * Math.PI) / 180 / 2);
    const visibleHalfW = visibleHalfH * camera.aspect;
    return {
      halfH: maxY, halfW: maxX, live: n, incoming, falling, warm: warmed.size,
      // decoders this cluster holds open right now (bead faces plus warm slots), and the
      // tap ledger: one launched should always mean one knocked and, later, one retired
      videos: liveVideos.size, stats: { ...stats },
      top, bottom, centreY, meanY, meanX,
      visibleHalfH, visibleHalfW,
      fits: maxY <= visibleHalfH && maxX <= visibleHalfW,
      fitsH: maxY <= visibleHalfH, fitsW: maxX <= visibleHalfW,
    };
  }

  /** Re-seat the well. The shoal slides to the new centre under its own spring. */
  function setCenterY(y) { if (Number.isFinite(y)) centreY = y; }

  return { setActive, resize, dispose, canvas, bounds, beads, setCenterY, swapTo, swapping, prefetch };
}
