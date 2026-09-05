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
import actionReels from '@/data/cinema/action-reels.json';
import partsData from '@/data/cinema/parts.json';
import crewShots from '@/data/cinema/crew-shots.json';
import installsData from '@/data/cinema/installs.json';
import growthPartner from '@/data/cinema/growth-partner.json';
import reelLibrary from '@/data/cinema/reel-library.json';
import trainingMedia from '@/data/cinema/training-media.json';
import { visible } from '@/lib/cinema/visible';

// ☠️ EVERY MANIFEST IS FILTERED HERE, AT MODULE SCOPE, AND NOWHERE ELSE.
// The studio writes `hidden: true` on an entry Jarich hides. Filtering at module scope
// rather than inside a panel is what makes the hiding reach the arc's beat COUNT and the
// engine's formation list: a filter applied further down would leave the engine holding a
// slot for a beat nobody can see, and the scroll rail would still have a stop for it.
// scripts/check-hidden-filter.mjs fails the build if a manifest is read without this.
const HOME_BEATS = visible(beatsData.beats);
const ASK_SCRIPT = { ...askScript, exchanges: visible(askScript.exchanges) };
const REEL_LIBRARY = visible(reelLibrary.reels);
const TRAINING_ITEMS = visible(trainingMedia.items);

// ☠️ THE WALL PAGES ON THE MANIFEST'S OWN SETS, AND LOOKS REELS UP BY id.
// reel-library.json ships `sets` precomputed in groups of 24 with the existing wall
// entries first, so the wall is identical to marbles-reels.json on the day of the switch
// and only grows after it. Slicing the flat list here instead would quietly re-cut those
// groups the moment an entry is hidden or added, and the first set is the one that must
// not move. An id that resolves to nothing is dropped rather than left as a hole, which
// is also how a hidden reel leaves its set.
const REEL_BY_ID = new Map(REEL_LIBRARY.map((r) => [r.id, r]));
// `sets` is STRUCTURE, not content: it holds labels and id lists, and the studio hides
// reels rather than sets. The hiding still reaches it, because every id is resolved
// through REEL_BY_ID above, which is built from the filtered list, and an id that resolves
// to nothing is dropped on the next line.
const REEL_SETS = (reelLibrary.sets || []) /* unfiltered: id lists, resolved through the filtered REEL_BY_ID below */
  .map((set) => (set.ids || []).map((id) => REEL_BY_ID.get(id)).filter(Boolean))
  .filter((set) => set.length);
const ACTION_ITEMS = visible(actionReels.items);
const PARTS = visible(partsData.parts);
const CREW_SHOTS = visible(crewShots.items);
const INSTALL_TILES = visible(installsData.tiles);
const GROWTH_ITEMS = visible(growthPartner.items);

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

/**
 * Two beats render the mixed marquee now, and they read different manifests.
 *
 * The training beat's strip is MERGED: the growth partner page's frames plus the four
 * Training Center photographs the beat was already showing, because those four are this
 * room and the visitor should still see it. The component spaces the clips through
 * whatever it is handed, so a merge does not need the sources pre interleaved.
 *
 * training-media.json landed at 500c180 and leads the merged array: it is this Training
 * Center, and the growth partner frames follow it. mixOrder() spaces the clips through
 * whatever it is handed, so a merge does not need the sources pre interleaved.
 */
const TRAINING_BEAT = HOME_BEATS.find((b) => b.key === 'training-center');
const MIXED_ITEMS = {
  'see-us-in-action': ACTION_ITEMS,
  'training-center': [
    ...TRAINING_ITEMS,
    ...GROWTH_ITEMS,
    ...(TRAINING_BEAT?.media || []).map((src) => ({
      type: 'image', src, caption: 'Inside the Training Center in Pasig',
    })),
  ],
};

function panelFor(beat, i, articles) {
  switch (beat.kind) {
    case 'lockup': return <LockupPanel beat={beat} level={1} />;
    case 'heart': return <HeartPanel beat={beat} />;
    case 'strip': return <StripPanel beat={beat} beatIndex={i} />;
    case 'marquee': return <NewsPanel beat={beat} beatIndex={i} articles={articles} />;
    // ☠️ THE TILES COME FROM THE MANIFEST, NOT FROM THE BEAT. See the note in
      // home-beats.json: the beat used to carry its own copy of this list and
      // installs.json was read by nothing.
      case 'installs': return <InstallsPanel beat={beat} beatIndex={i} tiles={INSTALL_TILES} />;
    case 'parts': return <PartsPanel beat={beat} beatIndex={i} parts={PARTS} crew={CREW_SHOTS} />;
    case 'chat': return <ChatPanel beat={beat} beatIndex={i} script={ASK_SCRIPT} />;
    case 'marbles': return <MarblesPanel beat={beat} beatIndex={i} sets={REEL_SETS} />;
    case 'action': return <ActionPanel beat={beat} beatIndex={i} items={MIXED_ITEMS[beat.key] || []} />;
    case 'door': return <DoorPanel beat={beat} />;
    case 'photo':
    default: return <PhotoPanel beat={beat} beatIndex={i} />;
  }
}

export default function HomeCinema({ articles = [] }) {
  const beats = HOME_BEATS.map((b) => ({ key: b.key, ...(FORMATIONS[b.key] || { kind: 'sphere', dim: true }) }));
  const panels = HOME_BEATS.map((b, i) => panelFor(b, i, articles));

  return (
    <>
      <NightSky />
      <CinemaPage beats={beats} panels={panels} classicHref="/classic" />
    </>
  );
}
