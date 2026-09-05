'use client';

// ══════════════════════════════════════════════════════════════════════════
// THE MARKETING PAGE ARC — the adapter About and Contact share.
//
// Same shape as HomeCinema: this file maps each beat in a beats JSON to a particle
// formation and to a DOM panel, and hands both to the ported engine. It authors no copy
// and no engine behaviour.
//
// ☠️ PARTICLES CARRY THE MARK AND NOTHING ELSE (Jarich, 2026-09-05). No product or object
// forms from the cloud on these pages, so every beat between the two lockups is a calm
// sphere with `dim` set: the engine drops the cloud well back and the DOM plate owns the
// frame.
// ══════════════════════════════════════════════════════════════════════════

import CinemaPage from '@/cinema/CinemaPage';
import NightSky from '@/cinema/NightSky';
import { LockupPanel, PhotoPanel } from '@/components/cinema-home/panels';
import '@/components/cinema-home/home-cinema.css';

import { DetailsPanel, FormPanel, PageDoorPanel, StatementPanel } from './panels';
import './page-cinema.css';

/** The round mark, and the crop that isolates the badge from the wordmark baked into the
 *  source PNG: hairline lettering samples muddy at particle density, so the words are
 *  re-rendered from canvas type by the lockup builder instead. The lockup numbers are the
 *  home arc's, which were measured against a real copy band at 390x844 so the particles
 *  own the upper half and the words own the lower one. */
const MARK = '/cinema/brand/dsd-round.png';
const MARK_CROP = { sx: 86, sy: 41, sw: 308, sh: 300 };
const WORDMARK = 'DentaSource Direct';
const HERO_LOCKUP = { markBox: 2.7, markY: 3.45, wordBoxH: 2.2, wordCenterY: 0.95 };
const DOOR_LOCKUP = { markBox: 2.6, markY: 3.2, wordBoxH: 2.1, wordCenterY: 0.85 };

// Radius and ripple vary a little so a run of copy beats does not read as one held frame.
const SPHERES = [
  { radius: 3.9, ripple: 0.13 },
  { radius: 3.6, ripple: 0.19 },
  { radius: 3.8, ripple: 0.15 },
  { radius: 3.5, ripple: 0.21 },
  { radius: 3.7, ripple: 0.17 },
];

function formationFor(beat, i) {
  if (beat.kind === 'lockup') {
    return { kind: 'lockup', src: MARK, crop: MARK_CROP, text: WORDMARK, lockup: HERO_LOCKUP };
  }
  if (beat.kind === 'door') {
    return { kind: 'lockup', src: MARK, crop: MARK_CROP, text: WORDMARK, lockup: DOOR_LOCKUP };
  }
  const sphere = SPHERES[i % SPHERES.length];
  // A statement beat has no plate to cede the frame to, so its cloud stays lit.
  return { kind: 'sphere', ...sphere, dim: beat.kind !== 'statement' };
}

function panelFor(beat, i) {
  switch (beat.kind) {
    case 'lockup': return <LockupPanel beat={beat} level={1} />;
    case 'statement': return <StatementPanel beat={beat} />;
    case 'details': return <DetailsPanel beat={beat} />;
    case 'form': return <FormPanel beat={beat} />;
    case 'door': return <PageDoorPanel beat={beat} />;
    case 'photo':
    default: return <PhotoPanel beat={beat} beatIndex={i} />;
  }
}

export default function PageCinema({ beats }) {
  const arc = beats.map((beat, i) => ({ key: beat.key, ...formationFor(beat, i) }));
  const panels = beats.map((beat, i) => panelFor(beat, i));
  return (
    <>
      <NightSky />
      <CinemaPage beats={arc} panels={panels} />
    </>
  );
}
