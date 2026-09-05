'use client';

// The DOM panels of the home arc. One export per beat kind; HomeCinema wires them to the
// beats in src/data/cinema/home-beats.json and hands the whole list to CinemaPage.
//
// House rules, enforced here rather than trusted: every word a visitor reads comes from
// the JSON, never from this file. The only strings written here are the two door CTAs and
// the Ask DSD intro, which the JSON also carries. No names, no prices, no warranty terms.

import { useEffect, useMemo, useRef, useState } from 'react';
import { createMarbleCluster } from '@/components/home/marbleCluster';
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
    </div>
  );
}

export function Cta({ cta, variant = 'ghost' }) {
  if (!cta) return null;
  return (
    <Link href={cta.href} className={`cinema-cta dsd-cta dsd-cta-${variant}`}>
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
        <Link href="/contact#showroom" className="cinema-cta dsd-cta dsd-cta-solid">
          Visit the showroom
        </Link>
        <Link href="/contact" className="cinema-cta dsd-cta dsd-cta-ghost">
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
      <div className="dsd-strip">
        {/* The track is doubled so the -50% sweep wraps seamlessly. The second half is
            the same twelve tiles again, so it is announced to nobody. */}
        <div className="dsd-strip-track">
          {tiles.map((t, i) => <StripTile key={`a-${i}`} tile={t} near={near} />)}
          {tiles.map((t, i) => <StripTile key={`b-${i}`} tile={t} near={near} echo />)}
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
  const shots = (beat.media || []).filter((m) => !m.startsWith('PLACEHOLDER:')).slice(0, 2);
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

export function MarblesPanel({ beat, beatIndex, reels = [] }) {
  const mountRef = useRef(null);
  const near = useBeatNear(beatIndex, { margin: '80%' });
  const [reduced, setReduced] = useState(false);

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
    if (!mount || !reels.length) return undefined;

    // ☠️ THE SMALL BEAD BUILD ON EVERY VIEWPORT, and it is the only fit knob there is.
    // The cluster's camera is fixed at z=8 with a 45 degree VERTICAL fov, so the world it
    // shows is always 6.63 units tall whatever size its box is: a taller box renders the
    // same shoal larger, it does not reveal more of it. Since the centring spring packs
    // the beads into a shoal about that tall, the only way to buy margin at the top and
    // bottom is to make the beads themselves smaller, and `isMobile` is the one option
    // that does it (radius 0.50 against 0.56, about 11%), uniformly, so the size ORDER
    // that maps bead 0 to the hero reel is untouched.
    const cluster = createMarbleCluster(mount, {
      videos: reels.map((r) => r.src),
      count: reels.length,          // exactly one bead per reel, however many there are
      isMobile: true,
      // ☠️ THE DISTANCE IS THE FIT. The cluster's fov is vertical, so its camera distance
      // is the only thing that decides how much of the shoal is on screen; the box shape
      // cannot add height. Measured with cluster.bounds() and set so the beads clear the
      // frame at 1440x900 and at 390x844. The option defaults to 8 for every other caller,
      // so /classic renders exactly as it did.
      cameraZ: CLUSTER_CAMERA_Z,
      faceZoomDefault: 0.55,
      faceZoom: {},
    });
    // the proof harness reads the shoal's real extent through this; nothing in the page
    // uses it, and it goes with the cluster on dispose
    mount._dsdCluster = cluster;

    // The cluster sleeps whenever its stage leaves the screen.
    const io = new IntersectionObserver(
      ([entry]) => cluster.setActive(entry.isIntersecting && entry.intersectionRatio >= 0.2),
      { threshold: [0, 0.2] },
    );
    io.observe(mount);

    // Press and hold opens a reel WITH audio. The theater mounts a .cp-theater overlay, so
    // watching for it is how we tell the room to stand aside without forking the cluster.
    let theaterOpen = false;
    const mo = new MutationObserver(() => {
      const open = !!document.querySelector('.cp-theater');
      if (open !== theaterOpen) {
        theaterOpen = open;
        window.dispatchEvent(new CustomEvent('dsd:videoaudio', { detail: { on: open } }));
      }
    });
    mo.observe(document.body, { childList: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      if (theaterOpen) window.dispatchEvent(new CustomEvent('dsd:videoaudio', { detail: { on: false } }));
      delete mount._dsdCluster;
      cluster.dispose();
    };
  }, [near, reduced, reels]);

  return (
    <div className="dsd-panel">
      <Copy beat={beat} />
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
      <Cta cta={beat.cta} />
    </div>
  );
}

/* ── the action beat: the showcase reels ───────────────────────────────────────────── */

// The old home's VideoShowcase, as a beat. Sources are attached only once the beat is
// near, so six vertical clips never download for a visitor who stops at the heart.
export function ActionPanel({ beat, beatIndex, reels = [] }) {
  const near = useBeatNear(beatIndex, { margin: '80%' });

  // The room stands aside for a reel that is actually speaking, and comes back after.
  const speak = (on) => {
    try { window.dispatchEvent(new CustomEvent('dsd:videoaudio', { detail: { on } })); } catch (e) { /* no CustomEvent */ }
  };
  useEffect(() => () => speak(false), []);

  return (
    <div className="dsd-panel">
      <Copy beat={beat} />
      <div className="dsd-reels dsd-interactive">
        {reels.map((r) => (
          <figure className="dsd-reel" key={r.src}>
            <video
              src={near ? r.src : undefined}
              poster={r.poster}
              controls
              muted
              loop
              playsInline
              preload="none"
              onPlay={(e) => { if (!e.currentTarget.muted) speak(true); }}
              onVolumeChange={(e) => speak(!e.currentTarget.muted && !e.currentTarget.paused)}
              onPause={() => speak(false)}
              onEnded={() => speak(false)}
            />
            <figcaption>{r.caption}</figcaption>
          </figure>
        ))}
      </div>
      <Cta cta={beat.cta} />
    </div>
  );
}
