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
          {tiles.map((t, i) => (
            <img key={`a-${i}`} src={near ? t.src : undefined} data-src={t.src} alt={t.alt} loading="lazy" decoding="async" />
          ))}
          {tiles.map((t, i) => (
            <img key={`b-${i}`} src={near ? t.src : undefined} data-src={t.src} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          ))}
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
        {shots.map((src, i) => (
          <img key={src} src={near ? src : undefined} data-src={src} alt={i === 0 ? beat.headline : ''} aria-hidden={i > 0 ? 'true' : undefined} loading="lazy" decoding="async" />
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

/* ── beat 12: inside the console ───────────────────────────────────────────── */

// The real screenshots are still to be taken, so the plates say exactly what they are
// rather than pretending to be a product. The captions come from the JSON's media list.
export function ConsolePanel({ beat }) {
  const shots = ['/cinema/placeholder/console-1.svg', '/cinema/placeholder/console-2.svg', '/cinema/placeholder/console-3.svg'];
  const labels = (beat.media || []).map((m) => m.replace(/^PLACEHOLDER:/, ''));
  return (
    <div className="dsd-panel">
      <Copy beat={beat} />
      <div className="dsd-console">
        {shots.map((src, i) => (
          <img key={src} src={src} alt={labels[i] || 'Console screenshot placeholder'} width="640" height="400" loading="lazy" decoding="async" />
        ))}
      </div>
      <Cta cta={beat.cta} />
    </div>
  );
}

/* ── beat 13: the marbles wall ─────────────────────────────────────────────── */

// Roles, never names. Phase B1 draws the beads in CSS: the cannon-es cluster is a later
// pass, and a static wall says the same thing without a physics engine on a phone.
export function MarblesPanel({ beat, roster = [] }) {
  return (
    <div className="dsd-panel">
      <Copy beat={beat} />
      <div className="dsd-marbles">
        {roster.map((m) => (
          <div className="dsd-marble" key={m.role}>
            <span className="dsd-marble-art" role="img" aria-label={m.alt} />
            <span className="dsd-marble-role">{m.role}</span>
            <span className="dsd-marble-note">{m.description}</span>
          </div>
        ))}
      </div>
      <Cta cta={beat.cta} />
    </div>
  );
}
