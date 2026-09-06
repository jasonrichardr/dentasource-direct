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
      /* ☠️ THE OLD sizes LIED ABOUT THIS TILE BY A FACTOR OF THREE. It said 34vw, which
         is 132px on a 390 phone. The tile's HEIGHT is what the stylesheet fixes; its width
         is height times the frame's aspect, and measured on the running page these render
         up to 360px wide on a phone and 384 on a desktop. The browser trusted the 34vw,
         asked the optimiser for 384, and painted it into 360 css px on a retina screen
         where 720 was needed. This describes the widest tile instead, which over-serves
         the narrow ones and is the right way round to be wrong when the ruling is quality. */
      sizes="(max-width: 700px) 92vw, 384px"
      quality={85}
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
        <div className="dsd-strip-track" data-marquee="strip">
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
              quality={85}
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

export function InstallsPanel({ beat, beatIndex, tiles = [] }) {
  const near = useBeatNear(beatIndex);
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
        <div className="dsd-strip-track" data-marquee="installs">
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
// ☠️ THE CREW ROW IS SHORTER THAN THE PARTS ROWS ON PURPOSE. Its tiles are photographs at
// 126px wide against parts cards at up to 250px, so matching the parts count would make
// the bottom row visibly shorter than the two above it and its loop seam would come round
// twice as often. 18 photographs is about the same track length as 14 parts cards.
const CREW_SHOWN = 18;

export function PartsPanel({ beat, beatIndex, parts = [], crew = [] }) {
  const near = useBeatNear(beatIndex);
  // The manifest already alternates technician and sales so a row never runs as one kind,
  // so this is a slice and not a shuffle: re-ordering here would undo that.
  const crewRow = useMemo(() => crew.slice(0, CREW_SHOWN), [crew]);
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
            <div className={`dsd-news-track${r === 1 ? ' reverse' : ''}`} data-marquee={`parts-${r + 1}`}>
              {(near ? [...row, ...row] : []).map((part, i) => (
                <div className={`dsd-part-card${part.name ? '' : ' is-bare'}`} key={`${r}-${i}-${part.slug}`} aria-hidden={i >= row.length ? 'true' : undefined}>
                  {near ? (
                    <Image src={part.src} alt="" width={112} height={112} quality={85} loading="lazy" className="dsd-part-img" />
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
        {/* ☠️ A THIRD ROW, AND IT SWEEPS THE WAY THE TOP ROW DOES. Three rows all moving
            together read as one sheet sliding sideways; the point of the alternation is
            that the eye has something to fix on. The middle row is the reversed one, so
            the row under it goes back the other way, same as the row above it.
            Photographs of the crew, no captions: the parts rows carry the names, and a
            caption under a candid photograph would be a claim about a person. */}
        {crewRow.length ? (
          <div className="dsd-news-row">
            <div className="dsd-news-track" data-marquee="parts-crew">
              {(near ? [...crewRow, ...crewRow] : []).map((shot, i) => (
                near ? (
                  <Image
                    key={`c-${i}-${shot.src}`}
                    className="dsd-crew-shot"
                    src={shot.src}
                    alt={i >= crewRow.length ? '' : shot.alt}
                    aria-hidden={i >= crewRow.length ? 'true' : undefined}
                    width={126}
                    height={84}
                    quality={85}
                    loading="lazy"
                  />
                ) : (
                  <span className="dsd-crew-shot" key={`c-${i}`} aria-hidden="true" />
                )
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <Ctas beat={beat} />
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
            <div className={`dsd-news-track${r === 1 ? ' reverse' : ''}`} data-marquee={`news-${r + 1}`}>
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
                    ? <Image src={a.image} alt="" width={96} height={72} sizes="96px" quality={85} className="dsd-news-thumb" />
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
// a page section. It is fed from src/data/cinema/reel-library.json so the wall grows by
// editing a list: the cluster is built with count = the list length, one bead per reel.
// ROLES ONLY. Nothing on this wall names a person.
/**
 * ☠️ THE 9.6 PHONE CAMERA IS GONE, AND ITS WORKING IS KEPT HERE BECAUSE IT EXPLAINS WHY.
 *
 * It was measured on the OLD stage, where the canvas was a 98vw by 52vh box and the shoal
 * was 33 beads under an isotropic spring. Settling readings on a 1440x900 desktop, as the
 * spring pulled the initial scatter in:
 *   14s 6.32   24s 3.45   34s 3.32   44s 2.95  (equilibrium)
 * 9.6 showed 3.976 units, 35% clear of that equilibrium, and the phone already fitted.
 *
 * Two things then changed under it. The wall pages in sets of 24 rather than showing all
 * 33, so the shoal is smaller. And the canvas is the viewport, so on a 390x844 phone the
 * visible WIDTH collapsed to 1.84 world units while the height grew. 9.6 was correct for
 * the stage it was measured on and wrong for this one, which is the whole reason bounds()
 * reports visibleHalfW now: a framing number that is not re-read after the stage changes
 * is a number that was true once.
 *
 * The phone's replacement (13.0 with a 2.4 by 4.2 portrait well) is at the call site.
 */

// ☠️ THE WALL PAGES, IT DOES NOT GROW. One bead per reel with no duplicates is the rule
// this cluster was built on, so the 192 entry library would be 192 video decoders on one
// screen. The sets arrive already cut in reel-library.json, 24 at a time, with the entries
// the wall already showed first so that nothing moves on the day of the switch. This
// component pages through what it is handed and does not re-cut it.
export function MarblesPanel({ beat, beatIndex, sets = [] }) {
  const mountRef = useRef(null);
  const near = useBeatNear(beatIndex, { margin: '80%' });
  const [reduced, setReduced] = useState(false);
  const [set, setSet] = useState(0);

  const setCount = Math.max(1, sets.length);
  // Clamp rather than modulo: a library that shrinks under the visitor should land on the
  // last real set, not wrap to the first.
  const setIndex = Math.min(set, setCount - 1);
  const shown = useMemo(() => sets[setIndex] || [], [sets, setIndex]);

  useEffect(() => {
    try { setReduced(matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { /* assume motion is fine */ }
  }, []);

  useEffect(() => {
    // ☠️ NOT UNTIL THE BEAT IS NEAR, AND NEVER UNDER REDUCED MOTION. This is a WebGL
    // canvas decoding a set of videos; booting it at page load would cost the arc its
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
    let cleanupSeat = null;
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
      cleanupSeat?.();
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
      // ☠️ spreadY CAME DOWN 2.2 -> 1.4 SO THE WALL CAN SIT UNDER THE COPY AT ALL.
      // Measured: at spreadY 2.2 the desktop shoal stands 4.25 world units tall against a
      // visible height of 5.80, which leaves 1.55 of slack. Clearing the copy needs the
      // top at world 1.19 on a 1440x900, and 1.19 minus 4.25 puts the bottom at -3.07
      // against a screen bottom of -2.90. It does not fit, and the seating loop's own
      // clamp was correctly refusing to push the wall off the bottom of the screen: it
      // came to rest at 9px of clearance where 24 was asked for.
      // The camera is NOT the dial here. Pulling it back would buy the room and cost the
      // 98 percent width fill that was ruled to stay. A flatter well buys the same room
      // and touches only the height: the wall becomes the wide band of glass across the
      // stage that it was asked to be, and spreadX is untouched.
      // Shoal height runs about 2 * (0.5 * spreadY + 1.04) on this bead set, so 1.4 gives
      // roughly 3.5 units and about 95px of room to spare under the wall.
      ? { isMobile: false, cameraZ: 7.0, spreadX: 5.8, spreadY: 1.4, centerPull: 1.8, beadScale: 1.5 }
      // ☠️ A PORTRAIT STAGE NEEDS A PORTRAIT WELL. The phone kept an isotropic shoal and a
      // near camera while its canvas was a 98vw by 52vh landscape box. The viewport stage
      // is the opposite shape: at 390x844 the aspect is 0.46, so the visible WIDTH in
      // world units collapses to 1.84 while the height grows to 3.98. The round shoal
      // measured 2.40 half-widths against that 1.84, which is 130 percent: a quarter of
      // the wall was hanging off both sides at REST, before anyone touched it.
      // Pushing the camera back alone would fix the overflow and shrink the beads to
      // nothing, so the well turns portrait as well: narrow in X, tall in Y, at a camera
      // far enough to hold it. Measured settled, 390x844: 81% of the visible width and
      // 55% of the height, both axes fitting. The height deliberately does NOT fill: the
      // copy sits above the beads and the pager below them, and the canvas now covers
      // both, so the band of glass has to leave them room.
      : { isMobile: true, cameraZ: 13.0, spreadX: 2.4, spreadY: 4.2, centerPull: 1.8, beadScale: 1.5 };
    // ☠️ EVERY ONE OF THESE SIX NUMBERS IS A SETTLED bounds() READING, NOT AN EYE.
    // Swept at the real viewports against the real stage, nine seconds after the beat was
    // parked, because a shoal read while it is still converging reads small. Desktop was
    // measured and LEFT ALONE: 7.0/6.4/2.2 fills 94% of the visible width and 70% of the
    // height and fits on both axes, and 94% is not a near miss, it is the wall spread
    // across the stage the way Jarich asked for. The alternatives that bought margin
    // (7.6/5.8/2.4 at 80%, 8.2/6.4/2.6 at 75%) bought it by making the beads smaller.
    // The fov is VERTICAL, so cameraZ is what decides how much of the shoal is on screen;
    // the box shape only ever changes how much is visible sideways. Both numbers above
    // were set by measuring bounds(), not by eye.
    cluster = createMarbleCluster(mount, {
      videos: shown.map((r) => r.src),
      // The theatre plays these, not the 480 bead loops, whenever the manifest has one.
      hdVideos: shown.map((r) => r.hd || null),
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

    // ☠️ THE WALL RESTS BELOW THE WORDS, AND IT IS MEASURED, NOT DIALLED.
    // Jarich: the shoal was sitting across the headline and body. The fix is to move where
    // the centring spring PULLS TO, never to fence the beads: a flung bead still travels
    // anywhere on or off the screen, it just comes home lower down.
    //
    // The seating is self calibrating because the spring is LINEAR. The shoal's shape does
    // not depend on where its well sits, so once we know the settled top relative to the
    // current centre, that gap is a constant and the correct centre is one subtraction
    // away. No sweep, no magic number, and it re derives itself at any viewport.
    //
    //   1. seat it at a safe estimate immediately, so it never sits over the copy even
    //      while the spring is still converging. spreadY overestimates the half height on
    //      both viewports (measured: 2.2 -> 2.03, 4.2 -> 2.97), and overestimating pushes
    //      the wall DOWN, which is the safe direction to be wrong in.
    //   2. once settled, read the real gap and seat it exactly.
    //   3. on resize, re-seat from the stored gap against the re measured copy block.
    // ☠️ AIM ABOVE THE FLOOR AND DO NOT CHASE NOISE. The instruction is a MINIMUM of 24px,
    // and the thing being measured is the top edge of the topmost bead, which is never
    // still: the beads jostle in the well, so that edge wanders several pixels either way
    // for as long as the wall is alive. A loop aiming at exactly 24 with a tight deadband
    // hunted around it and was measured resting at 19, 22, 23, 28. So it aims at 34 and
    // ignores errors under 8px: the wall comes to rest somewhere in a 26 to 42 band, and
    // the floor Jarich set is never breached by the jitter.
    const COPY_GAP_PX = 34;                 // aim, 10px above the 24px floor asked for
    const DEADBAND_PX = 8;                  // wider than the shoal's own jitter

    // ☠️ THE LOOP CLOSES ON THE PIXEL GAP, NOT ON A MODEL OF THE SHOAL.
    // Two earlier versions tried to predict where to put the well: seat it at
    // targetTop minus the shoal's half height, refine that half height once the spring
    // settled. Both were consistently short, and the reason is instructive. The half
    // height is an INTERMEDIATE quantity, so every tolerance in measuring it becomes an
    // error in the thing we actually care about: a 2 percent tolerance on a 1.89 unit
    // half height is 6 pixels of clearance, and the wall came to rest at 15px where 24
    // was asked for. So this measures the ONE number in the instruction, the gap in
    // pixels between the copy's bottom and the wall's top, and moves the well by exactly
    // that error. The spring is linear, so the correction is exact and converges in a
    // tick or two from any starting point, at any viewport, with no constant to keep.
    //
    // ☠️ IT ONLY CORRECTS WHILE THE SHOAL IS CALM. A flung bead makes the top edge shoot
    // up, and a loop that reacted to that would shove the whole wall downward every time
    // somebody played with it. Two consecutive samples have to agree before it touches
    // anything, which parks the loop for the duration of a fling and resumes after, and
    // is also what makes it correct itself after a resize without any resize handler
    // arithmetic. It runs for the life of the cluster because it costs a rect read and
    // some arithmetic every 1.2 seconds.
    // ☠️ CONTROL ON THE MEAN, NOT ON THE TOPMOST BEAD. The extreme edge is the noisiest
    // number the wall produces: whichever bead happens to be highest changes from tick to
    // tick and its edge wanders several pixels. Controlling on it meant the calm test
    // almost never passed on the phone, where 24 beads jostle in a narrow well, so the
    // correction hardly ever fired and the wall sat wherever the opening estimate left it.
    // meanY is an average over every bead and moves smoothly, and the shoal's half height
    // above that mean is a SHAPE property, so it is smoothed across ticks rather than
    // trusted from one. Together they give a control signal steady enough to act on and a
    // calm test that is true whenever the wall has actually stopped travelling.
    const spreadY = shape.spreadY ?? 3.0;
    let halfTop = null;

    const adjust = () => {
      const copy = mount.parentElement?.querySelector('.dsd-copy');
      const b = cluster.bounds();
      if (!copy || !b || !Number.isFinite(b.top) || !Number.isFinite(b.meanY)) return;

      // ☠️ THE CORRECTION ALWAYS RUNS. Gating it on the wall being calm was self
      // defeating and it is worth writing down why: a correction MOVES the shoal, which
      // makes the next sample not calm, which blocks the next correction. The loop could
      // therefore take exactly one step per settling period, each settling period is 7 to
      // 15 seconds, and the step it took was based on whatever the shape estimate happened
      // to be at that moment. Measured across two runs of identical code the desktop wall
      // came to rest at 73px and then at 19px. That is not a tuning problem, it is a loop
      // that cannot iterate.
      //
      // So the position command runs every tick and the SHAPE estimate is what gets
      // steadied, by a slow moving average. That also makes it fling proof without a calm
      // test: flinging one bead barely moves the mean, and the average absorbs the brief
      // change in the shoal's height rather than chasing it.
      const sample = b.top - b.meanY;
      halfTop = halfTop == null ? sample : halfTop * 0.85 + sample * 0.15;

      // World units per CSS pixel. The fov is vertical, so the visible HEIGHT maps onto
      // the canvas height, and on this stage the canvas is the viewport.
      const perPx = (b.visibleHalfH * 2) / (window.innerHeight || 1);
      const topPx = window.innerHeight / 2 - (b.meanY + halfTop) / perPx;
      const wantPx = copy.getBoundingClientRect().bottom + COPY_GAP_PX;
      const errPx = topPx - wantPx;               // negative means the wall is too high
      if (Math.abs(errPx) < DEADBAND_PX) return;

      // Never seat it so low that the wall's own bottom leaves the screen. Clearing the
      // copy is the instruction, but a wall nobody can see is not an improvement.
      // GAIN below 1 so the wall eases into place over a few ticks instead of lurching
      // the moment the page is resized, and so a wrong shape estimate cannot overshoot.
      let delta = errPx * perPx * 0.5;
      const floor = -b.visibleHalfH - b.bottom;   // the most we may still move down
      if (delta < floor) delta = floor;
      cluster.setCenterY(b.centreY + delta);
    };

    // One coarse placement before the first correction, so the wall never sits over the
    // copy even on the opening frames. spreadY overestimates the half height on both
    // viewports (2.2 -> 2.03, 4.2 -> 2.97) and overestimating seats it LOWER, which is
    // the safe direction to be wrong in.
    (() => {
      const copy = mount.parentElement?.querySelector('.dsd-copy');
      const b = cluster.bounds();
      if (!copy || !b) return;
      const perPx = (b.visibleHalfH * 2) / (window.innerHeight || 1);
      const targetTop = (window.innerHeight / 2 - (copy.getBoundingClientRect().bottom + COPY_GAP_PX)) * perPx;
      cluster.setCenterY(targetTop - spreadY);
    })();

    const seatTimer = setInterval(adjust, 1200);
    cleanupSeat = () => clearInterval(seatTimer);

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
          {(sets[0] || []).slice(0, 12).map((r) => (
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

/**
 * The mixed marquee's order rule, and it lives HERE now rather than baked into a manifest.
 *
 * It used to be action-reels.json's own decision: the file shipped its items already
 * interleaved and this component rendered them in file order. That worked while one file
 * fed one beat. The training beat's strip is merged in code from two manifests, so no
 * single file can decide the interleave for it, and two different ordering rules for the
 * same marquee is how they drift apart.
 *
 * ☠️ SPACED EVENLY, NOT ALTERNATED. Strict image, video, image alternation is right at a
 * dozen items and wrong at thirty: it spends every clip in the first third and leaves a
 * long silent tail. Opening on a video and spreading the rest across the whole run keeps
 * something moving from the first tile to the last, whatever the ratio happens to be.
 */
export function mixOrder(items) {
  const vids = items.filter((i) => i.type === 'video');
  const rest = items.filter((i) => i.type !== 'video');
  if (!vids.length) return rest;
  const n = vids.length + rest.length;
  const out = new Array(n).fill(null);
  vids.forEach((v, k) => { out[Math.round((k * n) / vids.length)] = v; });
  let r = 0;
  for (let i = 0; i < n; i += 1) if (!out[i]) { out[i] = rest[r]; r += 1; }
  return out.filter(Boolean);
}

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
  const tiles = useMemo(() => mixOrder(items), [items]);
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
        <div className="dsd-strip-track" ref={trackRef} data-marquee={`mixed-${beat.key}`}>
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
            // ☠️ A STILL TAKES ITS OWN SHAPE WHEN THE MANIFEST KNOWS IT. The stylesheet
            // pins every still to 4/3, which was right while every still in this strip was
            // a landscape news frame. The growth partner manifest is mostly portrait, at
            // 719x1200 and the like, and 4/3 with object-fit cover crops that to a thin
            // band out of the middle of the picture. Where width and height are given the
            // tile keeps the frame's real ratio; the HEIGHT is still fixed by the
            // stylesheet, so the track stays one clean band and only the width varies.
            const ratio = it.width && it.height ? `${it.width} / ${it.height}` : undefined;
            return near
              ? (
                <Image
                  key={key}
                  src={it.src}
                  alt={echo ? '' : it.caption || it.alt || ''}
                  aria-hidden={echo ? 'true' : undefined}
                  width={it.width || 320}
                  height={it.height || 240}
                  style={ratio ? { aspectRatio: ratio } : undefined}
                  sizes="(max-width: 700px) 92vw, 384px"
                  quality={85}
                  loading="eager"
                />
              )
              : <img key={key} alt="" aria-hidden="true" />;
          })}
        </div>
      </div>
      <Ctas beat={beat} />
    </div>
  );
}
