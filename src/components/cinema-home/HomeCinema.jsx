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
import marblesReels from '@/data/cinema/marbles-reels.json';
import actionReels from '@/data/cinema/action-reels.json';
import partsData from '@/data/cinema/parts.json';

import {
  ActionPanel, ChatPanel, DoorPanel, HeartPanel, InstallsPanel, LockupPanel,
  MarblesPanel, NewsPanel, PartsPanel, PhotoPanel, StripPanel,
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
 *  the lower one, on a phone and on a laptop alike.
 *
 *  ☠️ AND THEN THE TOP OF THE DISC WENT OFF THE SCREEN. Two knobs decide the framing in
 *  the rebuilt lockup builder, and they are NOT the two this file used to lean on:
 *  wordHalfW sets the scale of the WHOLE group (the wordmark's width is the unit, the
 *  disc is a quarter of it, centred above with the asset's own gap), and markY is the
 *  group's CENTRE. markBox and wordCenterY are accepted and ignored there; they are kept
 *  below only so the legacy path stays sane if it is ever taken again.
 *
 *  THE PHONE IS THE BINDING CONSTRAINT, not the laptop. A portrait aspect makes the
 *  engine pull the camera back by up to 2x, which buys vertical room and spends
 *  HORIZONTAL room, so a group sized to fill a 1440 viewport runs off the sides of a 390
 *  one. Computed at both: group 9.20 wide inside 10.9 available on the phone, and the top
 *  of the disc clearing the viewport by 95px on the laptop and 247px on the phone. */
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
    // ☠️ DROPPED 12% OF THE VIEWPORT (Jarich: "place it a bit low its too high").
    // markY is the GROUP centre, so moving the disc down 12% of the screen means moving
    // the centre by 0.12 of the visible height in world units: 1.49 at the lockup camera.
    // Measured after: the disc top sits about 22% down instead of 10%, and the group's
    // foot still clears the copy band on a 390px phone, which is the tighter of the two.
    lockup: { markBox: 2.3, markY: 1.17, wordHalfW: 4.6, wordBoxH: 2.2, wordCenterY: 0.6 },
  },
  // copyLow: the copy sits UNDER the heart rather than inside it, as in the lab.
  heart: { kind: 'heart', copyLow: true },
  'our-people': { kind: 'sphere', radius: 3.9, ripple: 0.13, dim: true },
  // the merged beat: the floor, and the two brands that only come through it
  'the-floor': { kind: 'sphere', radius: 3.7, ripple: 0.18, dim: true },
  'training-center': { kind: 'sphere', radius: 3.85, ripple: 0.19, dim: true },
  delivery: { kind: 'sphere', radius: 3.6, ripple: 0.16, dim: true },
  'after-sales': { kind: 'sphere', radius: 3.5, ripple: 0.21, dim: true },
  news: { kind: 'sphere', radius: 4.0, ripple: 0.12, dim: true },
  'ask-dsd': { kind: 'sphere', radius: 3.4, ripple: 0.22, dim: true },
  // The reel cluster and the showcase reels are their own light source: the cloud drops
  // right back so a WebGL wall of video is not competing with a particle field.
  marbles: { kind: 'sphere', radius: 3.9, ripple: 0.18, dim: true },
  'see-us-in-action': { kind: 'sphere', radius: 3.6, ripple: 0.14, dim: true },
  // The closing lockup. The camera director already seats a final lockup nearer than
  // the opening one, so the door's mark is the biggest in the arc without a dial here.
  door: {
    kind: 'lockup', src: MARK, crop: MARK_CROP, text: WORDMARK,
    lockup: { markBox: 2.2, markY: 2.30, wordHalfW: 4.5, wordBoxH: 2.1, wordCenterY: 0.4 },
  },
};

function panelFor(beat, i, articles) {
  switch (beat.kind) {
    case 'lockup': return <LockupPanel beat={beat} level={1} />;
    case 'heart': return <HeartPanel beat={beat} />;
    case 'strip': return <StripPanel beat={beat} beatIndex={i} />;
    case 'marquee': return <NewsPanel beat={beat} beatIndex={i} articles={articles} />;
    case 'installs': return <InstallsPanel beat={beat} beatIndex={i} />;
    case 'parts': return <PartsPanel beat={beat} beatIndex={i} parts={partsData.parts} />;
    case 'chat': return <ChatPanel beat={beat} beatIndex={i} script={askScript} />;
    case 'marbles': return <MarblesPanel beat={beat} beatIndex={i} reels={marblesReels.reels} />;
    case 'action': return <ActionPanel beat={beat} beatIndex={i} items={actionReels.items} />;
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
