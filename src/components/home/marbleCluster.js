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
const FALL_G = 9.0;
// ☠️ AN INCOMING BEAD NEEDS A PULL OF ITS OWN, OR IT CAN HOVER FOR EVER. It is dropped with
// a velocity and nothing else, and when it hits a target that sits near the top of the
// wall it simply stops, resting on the shoal with its centre still above the landing
// line. No spring (it is not live yet), no gravity (that was only for departing beads):
// three of ten sat there for the whole trace and the swap could not complete. This keeps
// it moving down until it is inside the stage, gentler than FALL_G so the hit does not
// scatter the wall.
const DROP_G = 4.0;
const RAIN_EVERY_MS = 300;   // Jarich: "a marble glass one by one ... per 0.3 second"
const RAIN_WAIT_MS = 1000;   // longest we hold a drop back waiting for its texture to decode
const LAND_BY_MS = 1500;     // an incoming bead still not landed by then is declared landed

export function createMarbleCluster(container, {
  videos = [], hdVideos = [], count = 18, isMobile = false, faceFocus = {}, faceZoom = {},
  faceZoomDefault = 1, cameraZ = 8, spreadX = NATURAL_R, spreadY = NATURAL_R,
  stage = 'container', centerY = 0, centerPull = 1, beadScale = 1, linDamp = LIN_DAMP,
} = {}) {
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
  hint.innerHTML = '<span class="cp-hint-icon" aria-hidden="true">\ud83d\udc46</span><span class="cp-hint-title">Press &amp; <b>hold</b> a marble<br>to see</span>';
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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 1.9));
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
  function makeTex(url, i) {
    const el = document.createElement("video");
    el.src = mediaUrl(url);      // repo path in the manifest, media origin at run time
    el.muted = true; el.loop = true; el.playsInline = true; el.crossOrigin = "anonymous";
    el.preload = "none"; el.setAttribute("playsinline", ""); el.setAttribute("muted", "");
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
    return { el, planeMat };
  }
  const texPool = videos.map(makeTex);
  // ☠️ vids IS NOT A SNAPSHOT ANY MORE. The rain swap adds and removes decoders while the
  // wall is running, so setActive and dispose have to walk the LIVE set rather than a list
  // captured at build time. It is derived from units on demand instead of stored.
  const vids = () => units.map((u) => u.tex && u.tex.el).filter(Boolean);

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
  const rMax = baseR * 1.85;      // the hero bead (biggest)
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
    const r = isFilled
      ? (slot === HERO_I ? baseR * 1.85
         : slot === SMALL_I ? baseR * 0.62
         : baseR * (0.95 + hash(slot) * 0.55))
      : baseR * (0.5 + Math.pow(hash(slot + 101), 1.4) * 1.35);

    const glass = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 0, roughness: isFilled ? 0.05 : 0.04,
      transmission: 1, ior: 1.45, thickness: r * (isFilled ? 1.0 : 1.3),
      attenuationColor: isFilled ? ATTEN : CLEAR_TINTS[slot % CLEAR_TINTS.length],
      attenuationDistance: isFilled ? 1.6 : 0.85,
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
  const onMove = (e) => {
    if (focused) { ptr.engaged = false; return; } // a marble is open — don't fling underneath it
    const t = e.touches ? e.touches[0] : e;
    if (!t) return;
    const r = canvas.getBoundingClientRect();
    // only engage when the pointer/touch is ON the canvas — so touches above/below (headline, founders,
    // black margins) still scroll the page freely, while drags ON the beads fling them.
    if (t.clientX < r.left || t.clientX > r.right || t.clientY < r.top || t.clientY > r.bottom) { ptr.engaged = false; return; }
    ptr.x = ((t.clientX - r.left) / r.width) * 2 - 1;
    ptr.y = -(((t.clientY - r.top) / r.height) * 2 - 1);
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
  function beadScreenRect(index) {
    const u = units[index].unit;
    const rad = units[index].body.shapes[0].radius;
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
    ptr.engaged = false;
    vids().forEach((el) => el.pause());
    if (navigator.vibrate) try { navigator.vibrate(12); } catch (_) {}

    const o = beadScreenRect(pick.index);
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
          -K_CENTER_Z * body.position.z * m,
        );
        body.applyForce(_f, body.position);
      } else if (state === 'falling') {
        // gravity for the departing bead only; the world itself stays weightless
        _f.set(0, -FALL_G * m, -K_CENTER_Z * body.position.z * m);
        body.applyForce(_f, body.position);
      } else {
        // incoming: a gentle pull down so it keeps coming until it is inside the stage,
        // and the z spring so it lands in the wall, not in front of it
        _f.set(0, -DROP_G * m, -K_CENTER_Z * body.position.z * m);
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
    for (const rec of units) {
      if (!rec.tex) continue;
      try { rec.tex.el.pause(); rec.tex.el.removeAttribute("src"); rec.tex.el.load(); } catch (e) { /* already torn down */ }
      rec.tex.planeMat.map?.dispose();
      rec.tex.planeMat.dispose();
    }
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
    const t = makeTex(e.url, e.slot);
    t.el.preload = "auto";
    try { t.el.load(); } catch (err) { /* torn down */ }
    return t;
  }
  function dropWarm(t) {
    try { t.el.pause(); t.el.removeAttribute("src"); t.el.load(); } catch (e) { /* torn down */ }
    t.planeMat.map?.dispose();
    t.planeMat.dispose();
  }
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
    // a shove down and a little spin, so it tumbles out rather than sinking on rails
    rec.body.velocity.y -= 2.2;
    rec.body.angularVelocity.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
    rec.body.linearDamping = 0.05;   // let it actually fall
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
    if (rec.tex) {
      // ☠️ THE DECODER GOES WITH THE BEAD. Both halves: removing src alone leaves the
      // decoder holding its last buffer, and load() on a src-less element frees it.
      try { rec.tex.el.pause(); rec.tex.el.removeAttribute("src"); rec.tex.el.load(); } catch (e) { /* torn down */ }
      rec.tex.planeMat.map?.dispose();
      rec.tex.planeMat.dispose();
    }
  }

  /** Nearest LIVE bead to x that has not already been claimed by this run. */
  function pickTarget(x, claimed) {
    let best = null, bestD = Infinity;
    for (const rec of units) {
      if (rec.state !== 'live' || claimed.has(rec)) continue;
      const d = Math.abs(rec.body.position.x - x);
      if (d < bestD) { bestD = d; best = rec; }
    }
    return best;
  }

  function stepSwap() {
    // a departing bead is gone once it is a whole bead below the visible floor
    const tNow = performance.now();
    for (let i = units.length - 1; i >= 0; i -= 1) {
      const rec = units[i];
      if (rec.state === 'falling' && rec.body.position.y < -visTop() - rec.r * 2) retire(rec);
      // an incoming bead joins the wall the moment it is inside the stage, or once it has
      // plainly arrived and is resting on the shoal above the line: from there the spring
      // pulls it in, and a swap can never be left waiting on a bead that is already home
      if (rec.state === 'incoming' && (rec.body.position.y < visTop() - rec.r || tNow - rec.droppedAt > LAND_BY_MS)) land(rec);
    }
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

      const target = pickTarget(swap.xs[k], swap.claimed);
      const x = target ? target.body.position.x : swap.xs[k];
      const spawn = new CANNON.Vec3(x, visTop() + 1.2 + Math.random() * 0.6, 0);
      const rec = makeBead(entry.slot, entry.url, entry.hd, tex, spawn);
      rec.state = 'incoming';
      rec.droppedAt = now;
      rec.body.linearDamping = 0.02;          // fall cleanly, damping resumes on landing
      rec.body.velocity.set(0, -4.2, 0);
      tex.el.play().catch(() => {});
      // ☠️ TOUCHING THE WALL IS LANDING. The line test alone (centre inside the stage) left
      // beads resting on top of the shoal for the whole grace: the wall's top edge sits
      // near the stage's top, so a bead that has plainly arrived can still be above the
      // line. Measured at 3.8 to 6.2 s a swap, which is the 2.7 s of drops plus the cap.
      // First contact with anything in the world hands it to the spring on the spot.
      // ☠️ ONE LISTENER, AND IT IS NEVER REMOVED FROM INSIDE ITS OWN DISPATCH. cannon-es
      // walks the listener array by index; a listener that splices itself out while a
      // second one is queued behind it leaves the loop reading past the end, the throw
      // escapes world.step, and the animation frame is never re-armed. The page froze on
      // the first landing with "Cannot read properties of undefined (reading 'call')".
      // Flags make it idempotent; stepSwap detaches it at completion, outside any event.
      const hit = { landed: false, released: !target };
      const onCollide = (e) => {
        if (!hit.landed) { hit.landed = true; land(rec); }
        if (!hit.released && e.body === target.body) { hit.released = true; releaseOutgoing(target); }
      };
      rec.body.addEventListener('collide', onCollide);
      rec.onCollide = onCollide;
      swap.beads.push(rec);
      if (target) {
        swap.claimed.add(target);
        // contact releases the target; a timeout releases it anyway, because a near miss
        // must not leave a bead that never leaves.
        swap.timers.push(setTimeout(() => { if (!hit.released) { hit.released = true; releaseOutgoing(target); } }, 1200));
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
    const halfW = visTop() * camera.aspect;
    swap = {
      list, tex, done: 0, dropped: list.map(() => false),
      order: list.map((_, k) => k), t0: performance.now(),
      xs: list.map((_, k) => (list.length === 1 ? 0 : (-halfW * 0.7 + (2 * halfW * 0.7) * (k / (list.length - 1)))),
      ),
      claimed: new Set(), timers: [], beads: [], onDone,
    };
    return true;
  }

  /** True while a rain swap is running, so the caller can hold its label. */
  function swapping() { return !!swap; }

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
      top, bottom, centreY, meanY, meanX,
      visibleHalfH, visibleHalfW,
      fits: maxY <= visibleHalfH && maxX <= visibleHalfW,
      fitsH: maxY <= visibleHalfH, fitsW: maxX <= visibleHalfW,
    };
  }

  /** Re-seat the well. The shoal slides to the new centre under its own spring. */
  function setCenterY(y) { if (Number.isFinite(y)) centreY = y; }

  return { setActive, resize, dispose, canvas, bounds, setCenterY, swapTo, swapping, prefetch };
}
