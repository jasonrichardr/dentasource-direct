'use client';

// ══════════════════════════════════════════════════════════════════════════
// THE HOME ARC — fifteen beats, ruled in
// brainstorms/2026-09-05-dsd-site-overhaul-ffc-parity.md (Q10 to Q16).
//
// This file is the ADAPTER, nothing else: it maps each beat in
// src/data/cinema/home-beats.json to a particle formation and to a DOM panel,
// and hands both to the ported engine. The copy lives in the JSON, the engine
// lives in src/cinema/, and neither is written here.
// ══════════════════════════════════════════════════════════════════════════

import CinemaPage from '@/cinema/CinemaPage';
import NightSky from '@/cinema/NightSky';
import beatsData from '@/data/cinema/home-beats.json';
import askScript from '@/data/cinema/ask-dsd.json';
import marblesData from '@/data/cinema/marbles.json';

import {
  ChatPanel, ConsolePanel, DoorPanel, HeartPanel, LockupPanel,
  MarblesPanel, NewsPanel, PhotoPanel, StripPanel,
} from './panels';
import './home-cinema.css';

/** The round mark, and the crop that isolates the badge from the wordmark baked into
 *  the source PNG. Hairline lettering samples muddy at particle density, so the words
 *  are re-rendered from canvas type by the lockup builder instead.
 *
 *  ☠️ THE LOCKUP SITS IN THE TOP HALF, not the middle. The lab's numbers put the canvas
 *  wordmark at y -2.0, which is exactly where a home panel's copy band lands: measured at
 *  390x844 the two collided, particles running straight through the headline. Mark and
 *  wordmark were lifted together so the particles own the upper half and the copy owns
 *  the lower one, on a phone and on a laptop alike. */
const MARK = '/cinema/brand/dsd-round.png';
const MARK_CROP = { sx: 86, sy: 41, sw: 308, sh: 300 };
const WORDMARK = 'DentaSource Direct';

/**
 * Formation per beat key. `dim` is the engine's PHOTO_BEATS hook: it drops the cloud
 * well back so the DOM plate owns the frame. The spheres vary a little in radius and
 * ripple so eight copy beats in a row do not read as the same held frame.
 */
const FORMATIONS = {
  hero: {
    kind: 'lockup', src: MARK, crop: MARK_CROP, text: WORDMARK,
    lockup: { markBox: 2.7, markY: 3.45, wordBoxH: 2.2, wordCenterY: 0.95 },
  },
  // copyLow: the copy sits UNDER the heart rather than inside it, as in the lab.
  heart: { kind: 'heart', copyLow: true },
  'one-team': { kind: 'sphere', radius: 3.9, ripple: 0.13, dim: true },
  showroom: { kind: 'sphere', radius: 3.6, ripple: 0.17, dim: true },
  roson: { kind: 'sphere', radius: 3.75, ripple: 0.20, dim: true },
  denjoy: { kind: 'sphere', radius: 3.5, ripple: 0.15, dim: true },
  'training-center': { kind: 'sphere', radius: 3.85, ripple: 0.19, dim: true },
  delivery: { kind: 'sphere', radius: 3.6, ripple: 0.16, dim: true },
  'pre-delivery-inspection': { kind: 'sphere', radius: 3.7, ripple: 0.18, dim: true },
  'after-sales': { kind: 'sphere', radius: 3.5, ripple: 0.21, dim: true },
  news: { kind: 'sphere', radius: 4.0, ripple: 0.12, dim: true },
  'ask-dsd': { kind: 'sphere', radius: 3.4, ripple: 0.22, dim: true },
  console: { kind: 'sphere', radius: 3.8, ripple: 0.15, dim: true },
  marbles: { kind: 'sphere', radius: 3.9, ripple: 0.18, dim: true },
  // The closing lockup. The camera director already seats a final lockup nearer than
  // the opening one, so the door's mark is the biggest in the arc without a dial here.
  door: {
    kind: 'lockup', src: MARK, crop: MARK_CROP, text: WORDMARK,
    lockup: { markBox: 2.6, markY: 3.2, wordBoxH: 2.1, wordCenterY: 0.85 },
  },
};

function panelFor(beat, i, articles) {
  switch (beat.kind) {
    case 'lockup': return <LockupPanel beat={beat} level={1} />;
    case 'heart': return <HeartPanel beat={beat} />;
    case 'strip': return <StripPanel beat={beat} beatIndex={i} />;
    case 'marquee': return <NewsPanel beat={beat} beatIndex={i} articles={articles} />;
    case 'chat': return <ChatPanel beat={beat} beatIndex={i} script={askScript} />;
    case 'app': return <ConsolePanel beat={beat} />;
    case 'marbles': return <MarblesPanel beat={beat} roster={marblesData.marbles} />;
    case 'door': return <DoorPanel beat={beat} />;
    case 'photo':
    default: return <PhotoPanel beat={beat} beatIndex={i} />;
  }
}

export default function HomeCinema({ articles = [] }) {
  const beats = beatsData.beats.map((b) => ({ key: b.key, ...(FORMATIONS[b.key] || { kind: 'sphere', dim: true }) }));
  const panels = beatsData.beats.map((b, i) => panelFor(b, i, articles));

  return (
    <>
      <NightSky />
      <CinemaPage beats={beats} panels={panels} classicHref="/classic" />
    </>
  );
}
