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
import { buildHomeDecks, wwwFor, wwwItem, wwwCrewShot, WWW_BEAT_DECK } from '@/lib/cinema/homeDecks';
import { useMemo } from 'react';

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

// ☠️ NO SETS ANY MORE: THE MARBLES WALL IS A RING OVER THE WHOLE VISIBLE LIBRARY.
// Jarich, 2026-10-01: seven on the wall, a tap adds the next reel and knocks one out, and
// the Prev / Next pager is gone. MarblesPanel takes REEL_LIBRARY in visible() order (the
// order the old sets were cut from, so the first seven are the first seven of set 1).
// reel-library.json still ships `sets` of 24 and nothing reads them.
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
  // K-Clamps sits directly after the floor beat because it is the third line that only
  // comes through that door. Same sphere family as its neighbour, a touch tighter, so
  // the two brand beats read as a pair rather than as one held frame.
  'k-clamps': { kind: 'sphere', radius: 3.55, ripple: 0.2, dim: true },
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

// ══════════════════════════════════════════════════════════════════════════
// THE MIXED MARQUEES' LISTS LIVE IN src/lib/cinema/homeDecks.js NOW (2026-10-01, WWW).
// Every rule that used to be written here moved there VERBATIM, comments and all: round
// 6's rooms (`location`, `promoOverlay`, `beatExclude`), the dropped training stills and
// growth frames, the held-back clip, the live sessions, leadFirst and dedupe. It moved so
// the WWW seed script builds the console's first copy of each strip from the SAME filters
// this page bakes; proven identical beat by beat against the inline version before the cut.
//
// ☠️ ONCE WWW HAS SAVED A STRIP, THE CONSOLE'S MANIFEST IS CANON FOR IT. page.js reads it
// on the server (ISR 60 s) and hands it in as `www`; a non-empty deck replaces the list
// below for its beat and is played in the order a person arranged, and anything else (no
// deck, an empty one, the manifest unreachable) leaves this baked list standing.
// ══════════════════════════════════════════════════════════════════════════
const MIXED_ITEMS = buildHomeDecks({ HOME_BEATS, REEL_LIBRARY, ACTION_ITEMS, TRAINING_ITEMS, GROWTH_ITEMS, INSTALL_TILES });

function panelFor(beat, i, articles, live) {
  switch (beat.kind) {
    case 'lockup': return <LockupPanel beat={beat} level={1} />;
    case 'heart': return <HeartPanel beat={beat} />;
    case 'strip': return <StripPanel beat={beat} beatIndex={i} />;
    case 'marquee': return <NewsPanel beat={beat} beatIndex={i} articles={articles} />;
    // ☠️ THE TILES COME FROM THE MANIFEST, NOT FROM THE BEAT. See the note in
      // home-beats.json: the beat used to carry its own copy of this list and
      // installs.json was read by nothing.
      case 'installs': return <InstallsPanel beat={beat} beatIndex={i} tiles={INSTALL_TILES} />;
    case 'parts': return <PartsPanel beat={beat} beatIndex={i} parts={PARTS} crew={live.crew || CREW_SHOTS} />;
    case 'chat': return <ChatPanel beat={beat} beatIndex={i} script={ASK_SCRIPT} />;
    case 'marbles': return <MarblesPanel beat={beat} beatIndex={i} reels={REEL_LIBRARY} />;
    // WWW: a saved deck is played in its own order (`ordered` skips mixOrder); the baked
    // list keeps mixOrder exactly as before.
    case 'action': return live[beat.key]
      ? <ActionPanel beat={beat} beatIndex={i} items={live[beat.key]} ordered />
      : <ActionPanel beat={beat} beatIndex={i} items={MIXED_ITEMS[beat.key] || []} />;
    case 'door': return <DoorPanel beat={beat} />;
    case 'photo':
    default: return <PhotoPanel beat={beat} beatIndex={i} />;
  }
}

export default function HomeCinema({ articles = [], www = {} }) {
  // The WWW decks that are present and non-empty, mapped once into each panel's own shape.
  const live = useMemo(() => {
    const out = { crew: wwwFor(www, 'crew', wwwCrewShot) };
    for (const [beatKey, deck] of Object.entries(WWW_BEAT_DECK)) out[beatKey] = wwwFor(www, deck, wwwItem);
    return out;
  }, [www]);
  const beats = HOME_BEATS.map((b) => ({ key: b.key, ...(FORMATIONS[b.key] || { kind: 'sphere', dim: true }) }));
  const panels = HOME_BEATS.map((b, i) => panelFor(b, i, articles, live));

  return (
    <>
      <NightSky />
      <CinemaPage beats={beats} panels={panels} classicHref="/classic" />
    </>
  );
}
