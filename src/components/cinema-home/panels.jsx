'use client';

// The DOM panels of the home arc. One export per beat kind; HomeCinema wires them to the
// beats in src/data/cinema/home-beats.json and hands the whole list to CinemaPage.
//
// House rules, enforced here rather than trusted: every word a visitor reads comes from
// the JSON, never from this file. The only strings written here are the two door CTAs and
// the Ask DSD intro, which the JSON also carries. No names, no prices, no warranty terms.

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useBeatNear from './useBeatNear';

/* ── the shared copy block ─────────────────────────────────────────────────── */

export function Copy({ beat, level = 2, className = 'dsd-copy' }) {
  const Head = level === 1 ? 'h1' : 'h2';
  return (
    <div className={className}>
      {beat.eyebrow ? <div className="cinema-kicker">{beat.eyebrow}</div> : null}
      <Head className="cinema-head">{beat.headline}</Head>
      {beat.body ? <p className="cinema-sub">{beat.body}</p> : null}
      {/* ☠️ FFC'S STAR STATEMENT, PORTED 1:1. On the FFC sign in cinema the claim is one
          short line and the proof sits under it as ✦ bullets, left aligned inside a
          centred column so the marker column lines up and the sentences do not. A beat
          that has more than one thing to say gets this instead of a longer paragraph:
          four short lines are read, a six line paragraph on a moving stage is not. */}
      {Array.isArray(beat.stars) && beat.stars.length ? (
        <ul className="dsd-stars">
          {beat.stars.map((line) => <li key={line}>{line}</li>)}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * One CTA or several. `beat.ctas` wins over `beat.cta`; the row is the same one the door
 * beat uses, so a two button beat looks like the ending rather than like a new invention.
 */
export function Ctas({ beat, variant = 'ghost' }) {
  if (Array.isArray(beat.ctas) && beat.ctas.length) {
    return (
      <div className="dsd-cta-row">
        {beat.ctas.map((c) => <Cta key={c.href + c.label} cta={c} variant={c.variant || variant} />)}
      </div>
    );
  }
  return <Cta cta={beat.cta} variant={variant} />;
}

/**
 * ☠️ NOTHING IN THE ARC PREFETCHES. Every beat's panel is a FIXED overlay, so as far as an
 * App Router <Link> is concerned all fifteen of them are on screen the moment the page
 * loads, and every destination in the whole arc was being fetched before the visitor had
 * scrolled past the hero: the CTAs of all fifteen beats plus forty eight cards in the news
 * marquee. Measured on a fresh load, forty one route prefetches. Hover still prefetches,
 * which is where intent actually shows up.
 */
export function Cta({ cta, variant = 'ghost' }) {
  if (!cta) return null;
  // An external door is a plain anchor, and it carries rel="noopener" because a target
  // _blank without it hands the opened page a handle on this one.
  if (cta.external) {
    return (
      <a
        href={cta.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`cinema-cta dsd-cta dsd-cta-${variant}`}
      >
        {cta.label}
      </a>
    );
  }
  return (
    <Link href={cta.href} prefetch={false} className={`cinema-cta dsd-cta dsd-cta-${variant}`}>
      {cta.label}
    </Link>
  );
}

/* ── beat 0 and beat 14: the lockups ───────────────────────────────────────── */

// The particles carry the mark, so the panel is only the words seated under it. The
// eyebrow is dropped from the glass because the canvas wordmark above it already reads
// "DentaSource Direct"; it stays in the HTML so the JSON's copy is still crawlable.
export function LockupPanel({ beat, level = 1 }) {
  const { eyebrow, ...rest } = beat;
  return (
    <div className="dsd-panel dsd-copy-wide">
      {eyebrow ? <p className="dsd-sr-only">{eyebrow}</p> : null}
      <Copy beat={rest} level={level} className="dsd-copy-wide" />
      <Cta cta={beat.cta} variant="solid" />
    </div>
  );
}

// The closing beat: the same lockup, nearer, with both doors open.
export function DoorPanel({ beat }) {
  return (
    <div className="dsd-panel dsd-copy-wide">
      <Copy beat={beat} className="dsd-copy-wide" />
      <div className="dsd-cta-row">
        <Link href="/contact#showroom" prefetch={false} className="cinema-cta dsd-cta dsd-cta-solid">
          Visit the showroom
        </Link>
        <Link href="/contact" prefetch={false} className="cinema-cta dsd-cta dsd-cta-ghost">
          Send an inquiry
        </Link>
      </div>
    </div>
  );
}

/* ── beat 1: the heart ─────────────────────────────────────────────────────── */

export function HeartPanel({ beat }) {
  return (
    <div className="dsd-panel">
      <Copy beat={beat} />
      <Cta cta={beat.cta} />
    </div>
  );
}

/* ── beat 2: one team, the photo strip ─────────────────────────────────────── */

/** One tile of the team strip.
 *
 *  ☠️ THE PLACEHOLDER IS ALSO AN <img>, and that is the whole trick. The doubled track
 *  only wraps seamlessly at -50% if its two halves are the SAME WIDTH, so a tile that has
 *  not loaded yet must occupy the identical box. Same element, same CSS rule, same
 *  aspect-ratio box whether it is carrying a picture or waiting for one.
 *
 *  The source files are full-size news photographs; at a 240px tall tile that is most of
 *  a megabyte thrown away twelve times over, so they go through next/image now. */
const STRIP_W = 320;
const STRIP_H = 240;

function StripTile({ tile, near, echo = false }) {
  if (!near) return <img alt="" aria-hidden="true" />;
  return (
    <Image
      src={tile.src}
      alt={echo ? '' : tile.alt}
      aria-hidden={echo ? 'true' : undefined}
      width={STRIP_W}
      height={STRIP_H}
      sizes="(max-width: 700px) 34vw, 320px"
      // ☠️ EAGER, ONCE NEAR. next/image lazy-loads per tile as it enters the viewport, but
      // this viewport is a TRANSLATING track: tiles cross the edge one at a time and the
      // optimizer answers one at a time, so the sweep showed holes where a tile had not
      // arrived yet. The gate is `near`, not the scroll position; once the beat is close
      // the whole doubled track is fetched at once and the strip is never gappy again.
      loading="eager"
    />
  );
}

export function StripPanel({ beat, beatIndex }) {
  const near = useBeatNear(beatIndex);
  const tiles = beat.tiles || [];
  return (
    <div className="dsd-panel">
      <Copy beat={beat} />
      {/* ☠️ AN EMPTY TRACK UNTIL THE BEAT IS NEAR. Gating the SOURCES stopped the bytes,
          but the elements were still built: three marquees' worth of tiles rendering at
          boot for beats nobody had reached, which is main thread work and nothing else.
          Measured, that cost showed up as TBT rather than as weight. The track is empty
          until `near`, and the copy above it is untouched, so nothing a crawler or a
          reader wants disappears. */}
      <div className="dsd-strip">
        {/* The track is doubled so the -50% sweep wraps seamlessly. The second half is
            the same tiles again, so it is announced to nobody. */}
        <div className="dsd-strip-track">
          {near ? tiles.map((t, i) => <StripTile key={`a-${i}`} tile={t} near />) : null}
          {near ? tiles.map((t, i) => <StripTile key={`b-${i}`} tile={t} near echo />) : null}
        </div>
      </div>
      <Cta cta={beat.cta} />
    </div>
  );
}

/* ── beats 3 to 9: the photo beats ─────────────────────────────────────────── */

// A two up plate over the dimmed sphere; a phone drops to one up in CSS. The first two
// media entries are the photographs (a logo, where a beat carries one, is last).
export function PhotoPanel({ beat, beatIndex }) {
  const near = useBeatNear(beatIndex);
  // The merged floor beat shows three: the showroom, a ROSON frame and a Denjoy frame.
  // Every other photo beat still shows two, and a phone shows one of whichever it is.
  const shots = (beat.media || []).filter((m) => !m.startsWith('PLACEHOLDER:')).slice(0, 3);
  return (
    <div className="dsd-panel">
      <div className="dsd-photos">
        {/* Nothing here is eager: the only beat above the fold is beat 0, and beat 0 is a
            lockup made of particles, so the arc has no first paint image to prioritise. */}
        {shots.map((src, i) => (near
          ? (
            <Image
              key={src}
              src={src}
              alt={i === 0 ? beat.headline : ''}
              aria-hidden={i > 0 ? 'true' : undefined}
              width={940}
              height={640}
              sizes="(max-width: 700px) 92vw, 470px"
            />
          )
          : <img key={src} alt="" aria-hidden="true" />
        ))}
      </div>
      <Copy beat={beat} />
      {beat.checklist ? (
        <ul className="dsd-checklist">
          {beat.checklist.map((line) => <li key={line}>{line}</li>)}
        </ul>
      ) : null}
      <div className="dsd-cta-row">
        <Cta cta={beat.cta} />
        <Cta cta={beat.cta2} />
      </div>
    </div>
  );
}

/* ── the installs marquee: every article's install and delivery frames ─────────────── */

export function InstallsPanel({ beat, beatIndex }) {
  const near = useBeatNear(beatIndex);
  const tiles = beat.tiles || [];
  return (
    <div className="dsd-panel">
      <Copy beat={beat} />
      {/* ☠️ AN EMPTY TRACK UNTIL THE BEAT IS NEAR. Gating the SOURCES stopped the bytes,
          but the elements were still built: three marquees' worth of tiles rendering at
          boot for beats nobody had reached, which is main thread work and nothing else.
          Measured, that cost showed up as TBT rather than as weight. The track is empty
          until `near`, and the copy above it is untouched, so nothing a crawler or a
          reader wants disappears. */}
      <div className="dsd-strip">
        <div className="dsd-strip-track">
          {near ? tiles.map((t, i) => <StripTile key={`a-${i}`} tile={t} near />) : null}
          {near ? tiles.map((t, i) => <StripTile key={`b-${i}`} tile={t} near echo />) : null}
        </div>
      </div>
      <Cta cta={beat.cta} />
    </div>
  );
}

/* ── the parts marquee: two rows, the news desk's grammar ──────────────────────────── */

/** How many parts the two rows carry. The file holds 244; a marquee that long is a
 *  warehouse inventory, not a shelf, and every extra tile is another image to fetch. */
const PARTS_SHOWN = 28;

export function PartsPanel({ beat, beatIndex, parts = [] }) {
  const near = useBeatNear(beatIndex);
  const rows = useMemo(() => {
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
    for (let round = 0; picked.length < PARTS_SHOWN; round += 1) {
      let addedThisRound = false;
      for (const k of keys) {
        const list = buckets.get(k);
        if (round < list.length) { picked.push(list[round]); addedThisRound = true; }
        if (picked.length >= PARTS_SHOWN) break;
      }
      if (!addedThisRound) break;          // every bucket exhausted
    }
    const half = Math.ceil(picked.length / 2) || 1;
    return [picked.slice(0, half), picked.slice(half)];
  }, [parts]);
  return (
    <div className="dsd-panel">
      <Copy beat={beat} />
      <div className="dsd-news">
        {rows.map((row, r) => (
          <div className="dsd-news-row" key={r}>
            <div className={`dsd-news-track${r === 1 ? ' reverse' : ''}`}>
              {(near ? [...row, ...row] : []).map((part, i) => (
                <div className={`dsd-part-card${part.name ? '' : ' is-bare'}`} key={`${r}-${i}-${part.slug}`} aria-hidden={i >= row.length ? 'true' : undefined}>
                  {near ? (
                    <Image src={part.src} alt="" width={112} height={112} loading="lazy" className="dsd-part-img" />
                  ) : (
                    <span className="dsd-part-img" aria-hidden="true" />
                  )}
                  {/* ☠️ NAMES ONLY, AND ONLY WHEN THERE IS ONE. 161 of the 244 parts carry
                      no name in the source, just a code, and a code is never shown. Those
                      tiles are the photograph alone: no caption, and no apologetic
                      placeholder text standing in for one. */}
                  {part.name ? <span className="dsd-part-name">{part.name}</span> : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Cta cta={beat.cta} />
    </div>
  );
}

/* ── beat 10: the news marquee ─────────────────────────────────────────────── */

export function NewsPanel({ beat, beatIndex, articles = [] }) {
  const near = useBeatNear(beatIndex);
  const rows = useMemo(() => {
    const half = Math.ceil(articles.length / 2);
    return [articles.slice(0, half), articles.slice(half)];
  }, [articles]);

  return (
    <div className="dsd-panel">
      <Copy beat={beat} />
      <div className="dsd-news dsd-interactive">
        {rows.map((row, r) => (
          <div className="dsd-news-row" key={r}>
            <div className={`dsd-news-track${r === 1 ? ' reverse' : ''}`}>
              {[...row, ...row].map((a, i) => (
                <Link
                  key={`${r}-${i}-${a.slug}`}
                  href={`/news/${a.slug}`}
                  prefetch={false}
                  className="dsd-news-card"
                  tabIndex={i >= row.length ? -1 : undefined}
                  aria-hidden={i >= row.length ? 'true' : undefined}
                >
                  {/* The og cards are 1200x630 social masters; at a 96px thumb that is a
                      megabyte of nothing. next/image serves the cut this box actually needs,
                      and the thumb is only mounted once the beat is near. */}
                  {near
                    ? <Image src={a.image} alt="" width={96} height={72} sizes="96px" className="dsd-news-thumb" />
                    : <span className="dsd-news-thumb" aria-hidden="true" />}
                  <span className="dsd-news-title">{a.title}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Cta cta={beat.cta} />
    </div>
  );
}

/* ── beat 11: Ask DSD ──────────────────────────────────────────────────────── */

// Scripted, not intelligent: ten questions, ten written answers, a typewriter and a door.
// No network call is made and none can be, which is the point of the beat.
const CHAR_MS = 22;      // the FFC reading cadence: a shade under a fast reader
const THINK_MS = 420;    // the beat between the tap and the first character

export function ChatPanel({ beat, beatIndex, script }) {
  const near = useBeatNear(beatIndex, { margin: '60%' });
  const exchanges = script.exchanges || [];
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState('');
  const reducedRef = useRef(false);

  useEffect(() => {
    try { reducedRef.current = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* assume motion is fine */ }
  }, []);

  // The typing starts when the beat is near, not at page load: a visitor who never
  // reaches beat eleven should never have watched an answer type itself out of sight.
  useEffect(() => {
    const full = exchanges[active]?.answer || '';
    if (!near) { setTyped(''); return undefined; }
    if (reducedRef.current) { setTyped(full); return undefined; }
    setTyped('');
    let i = 0;
    let t = setTimeout(function step() {
      i += 1;
      setTyped(full.slice(0, i));
      if (i < full.length) t = setTimeout(step, CHAR_MS);
    }, THINK_MS);
    return () => clearTimeout(t);
  }, [active, near, exchanges]);

  const full = exchanges[active]?.answer || '';
  return (
    <div className="dsd-panel dsd-chat">
      <Copy beat={beat} />
      <div className="dsd-chips dsd-interactive" role="group" aria-label={script.intro}>
        {exchanges.map((x, i) => (
          <button
            key={x.id}
            type="button"
            className="dsd-chip"
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            {x.question}
          </button>
        ))}
      </div>
      <div className="dsd-answer" aria-live="polite">
        <p>
          {typed}
          {typed.length < full.length ? <span className="dsd-caret" aria-hidden="true" /> : null}
        </p>
      </div>
      <Cta cta={script.cta || beat.cta} variant="solid" />
      {/* Every answer, in the HTML, for a crawler and for anyone who never taps a chip. */}
      <dl className="dsd-sr-only">
        {exchanges.map((x) => (
          <div key={`sr-${x.id}`}>
            <dt>{x.question}</dt>
            <dd>{x.answer}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ── the marbles beat: the reel cluster, on the night stage ────────────────────────── */

// The same glass-marble cluster the old home carried, mounted as a beat panel instead of
// a page section. It is fed from src/data/cinema/marbles-reels.json so the wall grows by
// editing a list: the cluster is built with count = the list length, one bead per reel.
// ROLES ONLY. Nothing on this wall names a person.
/**
 * Camera distance for the reel shoal. MEASURED, not guessed, through cluster.bounds(),
 * which reports the beads' own extent in world units because this canvas carries no
 * preserveDrawingBuffer and its pixels cannot be read back.
 *
 * At the stock z=8 the camera shows 3.314 units above the axis. Measured half heights of
 * the shoal on a 1440x900 desktop as the spring pulls the initial scatter in:
 *   14s 6.32   24s 3.45   34s 3.32   44s 2.95  (equilibrium)
 * So the settled shoal is about 3.0 and the stock framing clipped it for the first half
 * minute and sat right on the edge after that. On a phone it settles smaller, near 2.97,
 * and already fitted, which is why only the desktop frame showed the slice.
 *
 * 9.6 shows 3.976 units: 15% clear of the 24 second state and 35% clear of equilibrium.
 * The opening seconds are still wider than the frame, but that is the physics arriving,
 * not the framing being wrong, and chasing it would need a camera so far back that the
 * beads would read as beads rather than as reels.
 */
const CLUSTER_CAMERA_Z = 9.6;

// ☠️ THE WALL PAGES, IT DOES NOT GROW. One bead per reel with no duplicates is the rule
// this cluster was built on, so a library of a hundred and forty reels would be a hundred
// and forty decoders. 24 is the set size: it fills the stage at the sizes the beads are
// drawn at, and it is under the point where a phone starts refusing to decode more.
const MARBLE_SET = 24;

export function MarblesPanel({ beat, beatIndex, reels = [] }) {
  const mountRef = useRef(null);
  const near = useBeatNear(beatIndex, { margin: '80%' });
  const [reduced, setReduced] = useState(false);
  const [set, setSet] = useState(0);

  const setCount = Math.max(1, Math.ceil(reels.length / MARBLE_SET));
  // Clamp rather than modulo: a library that shrinks under the visitor should land on the
  // last real set, not wrap to the first.
  const setIndex = Math.min(set, setCount - 1);
  const shown = useMemo(
    () => reels.slice(setIndex * MARBLE_SET, setIndex * MARBLE_SET + MARBLE_SET),
    [reels, setIndex],
  );

  useEffect(() => {
    try { setReduced(matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { /* assume motion is fine */ }
  }, []);

  useEffect(() => {
    // ☠️ NOT UNTIL THE BEAT IS NEAR, AND NEVER UNDER REDUCED MOTION. This is a WebGL
    // canvas decoding thirty three videos; booting it at page load would cost the arc its
    // first paint, and running it at all for someone who asked the system to hold still
    // would be the opposite of what they asked for.
    if (!near || reduced) return undefined;
    const mount = mountRef.current;
    if (!mount || !shown.length) return undefined;

    // ☠️ THE CLUSTER AND ITS PHYSICS ENGINE ARRIVE WITH THE BEAT, NOT WITH THE PAGE.
    // marbleCluster pulls in cannon-es and its own several hundred lines, and a static
    // import put all of it in the home page's first load for a beat thirteen screens
    // down. It is imported here instead, so the bytes are fetched by the same signal that
    // decides to build the wall at all. `cancelled` covers the visitor who scrolls past
    // during the fetch.
    let cancelled = false;
    let cluster = null;
    let io = null;
    let mo = null;
    let theaterOpen = false;

    import('@/components/home/marbleCluster').then(({ createMarbleCluster }) => {
      if (cancelled || !mountRef.current) return;
      start(createMarbleCluster);
    });

    return () => {
      cancelled = true;
      io?.disconnect();
      mo?.disconnect();
      if (theaterOpen) window.dispatchEvent(new CustomEvent('dsd:videoaudio', { detail: { on: false } }));
      delete mount._dsdCluster;
      cluster?.dispose();
    };

    function start(createMarbleCluster) {

    // ☠️ LANDSCAPE GETS THE WIDE STAGE, THE PHONE KEEPS ITS BALL.
    // On a wide screen the isotropic well left a small clump of beads in a lot of empty
    // space; the wall is meant to read as big glass spheres spread across the stage. So a
    // landscape viewport asks for an ELLIPSE (wide, short) and gets the LARGE bead build
    // back, while a phone keeps the small beads and the round shoal it already had.
    const landscape = (() => {
      try { return matchMedia('(min-width: 820px)').matches; } catch (e) { return false; }
    })();
    const shape = landscape
      // ☠️ THE SPREAD IS BISTABLE, SO THE WIDTH IS BOUGHT WITH THE CAMERA INSTEAD.
      // Measured at a settled state, spreadX maps to the shoal's half width like this:
      //   4.75 -> 4.92    6.0 -> 5.04    7.6 -> 13.25    9.5 -> 13.0
      // There is a threshold between 6.0 and 7.6 where the shoal stops being a clump and
      // flies apart into a band, and the span we want sits right inside it. Tuning there
      // would be tuning on a knife edge: a small change in bead count or radius would
      // flip the wall between a tight ball and a scatter that runs off both sides.
      // So the shoal stays in the STABLE clumped regime, and the stage is made smaller
      // around it: a nearer camera shows less world, so the same beads fill more of the
      // frame and render larger at the same time. cameraZ, not spreadX, is the dial to
      // reach for if this needs adjusting again.
      ? { isMobile: false, cameraZ: 7.0, spreadX: 6.4, spreadY: 2.2 }
      : { isMobile: true, cameraZ: CLUSTER_CAMERA_Z };   // phone: unchanged
    // ☠️ THESE FOUR NUMBERS WERE MEASURED AGAINST THE OLD BOX AND ARE NOW PROVISIONAL.
    // They were tuned when the canvas was min(98vw,1240px) by 56vh, an aspect near 2.5.
    // The viewport stage is a different shape: the vertical fov is fixed so the visible
    // HEIGHT in world units did not move, but the visible WIDTH is height times aspect,
    // and desktop 1440x900 is 1.6 while a 390x844 phone is 0.46. At the same cameraZ the
    // stage is therefore NARROWER in world units than the box it replaced, which is the
    // opposite of what it looks like on screen. The shoal will need re-framing, and the
    // right dial is cameraZ on the desktop and the well's shape on the phone (a portrait
    // stage wants a portrait ellipse, not a further camera, or the beads go tiny).
    // NOT GUESSED HERE. bounds() now reports visibleHalfW alongside visibleHalfH, so the
    // browser pass reads the real settled extent against the real stage and sets these
    // once, after the spring has settled rather than while it is still moving.
    // The fov is VERTICAL, so cameraZ is what decides how much of the shoal is on screen;
    // the box shape only ever changes how much is visible sideways. Both numbers above
    // were set by measuring bounds(), not by eye.
    cluster = createMarbleCluster(mount, {
      videos: shown.map((r) => r.src),
      count: shown.length,          // exactly one bead per reel in THIS set
      ...shape,
      // ☠️ THE STAGE IS THE WHOLE SCREEN, NOT A BOX IN THE MIDDLE OF IT. See the note on
      // .dsd-cluster: the canvas is pinned to the viewport and the mount stays in flow as
      // the sentinel the observer below watches.
      stage: 'viewport',
      faceZoomDefault: 0.55,
      faceZoom: {},
    });
    // the proof harness reads the shoal's real extent through this; nothing in the page
    // uses it, and it goes with the cluster on dispose
    mount._dsdCluster = cluster;

    // The cluster sleeps whenever its stage leaves the screen.
    io = new IntersectionObserver(
      ([entry]) => cluster.setActive(entry.isIntersecting && entry.intersectionRatio >= 0.2),
      { threshold: [0, 0.2] },
    );
    io.observe(mount);

    // Press and hold opens a reel WITH audio. The theater mounts a .cp-theater overlay, so
    // watching for it is how we tell the room to stand aside without forking the cluster.
    mo = new MutationObserver(() => {
      const open = !!document.querySelector('.cp-theater');
      if (open !== theaterOpen) {
        theaterOpen = open;
        window.dispatchEvent(new CustomEvent('dsd:videoaudio', { detail: { on: open } }));
      }
    });
    mo.observe(document.body, { childList: true });
    }
    // ☠️ setIndex IS A DEPENDENCY, AND THE TEARDOWN IS THE POINT. Changing set runs this
    // effect's cleanup, which calls cluster.dispose(), which now actually releases the 24
    // video decoders, their textures and every material holding one. Swapping the textures
    // in place would avoid rebuilding the WebGL context, but it would also mean carrying a
    // second teardown path for the same objects, and the one that runs on every set change
    // is exactly the one that has to be right. One path, exercised constantly.
  }, [near, reduced, shown, setIndex]);

  return (
    <div className="dsd-panel">
      <Copy beat={beat} />
      {/* ☠️ THE STAGE IS THE POINT, NOT JUST THE SPHERES. Ported from FFC's leadership
          beat: a dark academia field behind the glass, a soft centre vignette so the beads
          read as gems rather than as cut-outs, and a bottom scrim so the copy stays
          legible over it. Rendered ONLY when the beat is near, because a CSS background
          image on an always-mounted panel would fetch at boot like everything else did. */}
      {near && !reduced ? <div className="dsd-marble-stage" aria-hidden="true" /> : null}
      {reduced ? (
        // ☠️ THE CLUSTER HAS NO REDUCED MOTION PATH OF ITS OWN. I checked: there is no
        // prefers-reduced-motion branch anywhere in GlassMarbles or marbleCluster. So the
        // still wall is built here, from the same list, and nothing moves or decodes.
        <div className="dsd-marbles" role="list">
          {reels.slice(0, 12).map((r) => (
            <div className="dsd-marble" role="listitem" key={r.src}>
              <span className="dsd-marble-art" aria-hidden="true" />
              <span className="dsd-marble-note">{r.alt}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="dsd-cluster dsd-interactive" ref={mountRef} />
      )}
      {/* The pager only appears when there is somewhere to go. It sits above the canvas,
          which now covers the screen, and it is .dsd-interactive so the engine only lets
          it be tapped while this beat is the live one. */}
      {!reduced && setCount > 1 ? (
        <div className="dsd-pager dsd-interactive">
          <button
            type="button"
            className="dsd-pager-btn"
            onClick={() => setSet((n) => Math.max(0, n - 1))}
            disabled={setIndex === 0}
            aria-label="Previous set of reels"
          >
            Prev
          </button>
          {/* aria-live so a screen reader is told the wall changed under it: the beads
              themselves announce nothing. */}
          <span className="dsd-pager-count" aria-live="polite">
            {`Set ${setIndex + 1} of ${setCount}`}
          </span>
          <button
            type="button"
            className="dsd-pager-btn"
            onClick={() => setSet((n) => Math.min(setCount - 1, n + 1))}
            disabled={setIndex === setCount - 1}
            aria-label="Next set of reels"
          >
            Next
          </button>
        </div>
      ) : null}
      <Ctas beat={beat} />
    </div>
  );
}

/* ── the action beat: the showcase reels ───────────────────────────────────────────── */

// The old home's VideoShowcase, as a beat. Sources are attached only once the beat is
// near, so six vertical clips never download for a visitor who stops at the heart.
/** Next's optimiser, addressed directly. A <video poster> cannot take a next/image
 *  component, but it can take the URL the optimiser serves, which is AVIF or WebP at the
 *  width actually rendered instead of the full JPEG. */
// ☠️ THE QUALITY MUST BE ONE NEXT ALLOWS. Next 16 answers 400 with '"q" parameter
// (quality) of 70 is not allowed' for anything outside its configured list, and the
// default list is [75]. A hand built optimiser URL has to respect that; a next/image
// component would have picked a legal value for us. Measured: 19 of these 400s on a
// desktop pass before this was corrected.
const optimised = (src, w = 384, q = 75) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${q}`;

export function ActionPanel({ beat, beatIndex, items = [] }) {
  const near = useBeatNear(beatIndex, { margin: '80%' });

  // The room only stands aside for a reel that is actually AUDIBLE. Everything in this
  // marquee autoplays muted, so in practice it never asks; the handler exists because a
  // visitor can unmute one, and then it must.
  const speak = (on) => {
    try { window.dispatchEvent(new CustomEvent('dsd:videoaudio', { detail: { on } })); } catch (e) { /* no CustomEvent */ }
  };
  useEffect(() => () => speak(false), []);

  // ☠️ ONE DOUBLED TRACK, MIXED. The order comes from action-reels.json and is deliberate
  // (video first, then image, then video, and images alone once the clips run out); this
  // component does not sort, it renders what the file decided, so the strategy is
  // editable without touching code.
  const tiles = items.length ? items : [];
  const trackRef = useRef(null);

  // ☠️ ONE CLIP SPEAKS AT A TIME, AND THAT IS A DATA DECISION, NOT A TASTE ONE.
  // Autoplaying every tile in the doubled track measured 47 MB of video at this beat: six
  // clips, each mounted twice, all streaming at once. For a dentist on Philippine mobile
  // data that is not a marquee, it is a bill. So the tiles carry preload="none" and only
  // the ONE nearest the middle of the screen plays; the rest sit on their poster frames.
  // The strip still moves and something in it is always alive, which is what the FFC
  // marquee actually reads as, at about a twelfth of the bytes.
  useEffect(() => {
    if (!near) return undefined;
    const tick = () => {
      const vids = trackRef.current ? [...trackRef.current.querySelectorAll('video')] : [];
      if (!vids.length) return;
      const mid = window.innerWidth / 2;
      let best = null, bestD = Infinity;
      for (const v of vids) {
        const r = v.getBoundingClientRect();
        if (r.right < 0 || r.left > window.innerWidth) { if (!v.paused) v.pause(); continue; }
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bestD) { bestD = d; best = v; }
      }
      for (const v of vids) {
        if (v === best) { if (v.paused) v.play().catch(() => {}); }
        else if (!v.paused) v.pause();
      }
    };
    tick();
    const id = setInterval(tick, 1200);
    return () => {
      clearInterval(id);
      const vids = trackRef.current ? [...trackRef.current.querySelectorAll('video')] : [];
      for (const v of vids) { try { v.pause(); } catch (e) { /* torn down */ } }
    };
  }, [near]);

  return (
    <div className="dsd-panel">
      <Copy beat={beat} />
      <div className="dsd-strip dsd-mixed">
        <div className="dsd-strip-track" ref={trackRef}>
          {(near ? [...tiles, ...tiles] : []).map((it, i) => {
            const echo = i >= tiles.length;
            const key = `${i}-${it.src}`;
            if (it.type === 'video') {
              return (
                <video
                  key={key}
                  src={near ? it.src : undefined}
                  poster={near ? optimised(it.poster, 384) : undefined}
                  aria-hidden={echo ? 'true' : undefined}
                  muted
                  loop
                  playsInline
                  preload="none"
                  onVolumeChange={(e) => speak(!e.currentTarget.muted && !e.currentTarget.paused)}
                  onPause={() => speak(false)}
                />
              );
            }
            return near
              ? <Image key={key} src={it.src} alt={echo ? '' : it.caption} aria-hidden={echo ? 'true' : undefined} width={320} height={240} sizes="(max-width: 700px) 34vw, 300px" loading="eager" />
              : <img key={key} alt="" aria-hidden="true" />;
          })}
        </div>
      </div>
      <Ctas beat={beat} />
    </div>
  );
}
