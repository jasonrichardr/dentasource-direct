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

// ☠️ TEN PER SET, CUT HERE, NOT THE MANIFEST'S TWENTY FOUR.
// Jarich: "instead of set of 8 make them set of 10 so we can reduce glass marbles for
// each". Read as ten MARBLES per page rather than ten pages: "reduce glass marbles for
// each" only makes sense as fewer beads on screen at once, and 192 reels at ten a page is
// twenty sets, which matches "instead of set of 8" being about the label he can see.
//
// reel-library.json still ships `sets` of 24 and this no longer reads them. The cut is
// taken from the FLAT reels order, which is the same order those sets were built from
// (the 33 entries the wall has always shown come first), so nothing is dropped and
// nothing is reordered: there are simply more, shorter pages. The reason the old code
// deferred to the manifest was to keep set 1 stable on the day of the switch; that day
// has passed, and the instruction now is explicitly to re-cut. If builder-products ever
// re-cuts `sets` to ten, this should go back to reading them.
const MARBLES_PER_SET = 10;
const REEL_SETS = [];
for (let i = 0; i < REEL_LIBRARY.length; i += MARBLES_PER_SET) {
  REEL_SETS.push(REEL_LIBRARY.slice(i, i + MARBLES_PER_SET));
}
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
// ══════════════════════════════════════════════════════════════════════════
// ROUND 6: A BEAT'S MEDIA IS A FUNCTION OF WHERE THE CLIP WAS SHOT.
//
// ☠️ `category` IN reel-library.json IS NOT A PLACE, AND IT NEVER WAS. It was written
// from the FACEBOOK CAPTION, and a caption describes the OCCASION, not the room: clips
// captioned "Hands on training at the Training Center" turn out to be a PDA seminar in a
// hotel ballroom, and clips captioned "A delivery going out" turn out to be the showroom
// floor. Measured on 2026-09-21 by opening a five frame contact sheet of every one of the
// 182 reels: `category` disagrees with the room actually on screen for 138 of them.
//
// So round 6 added `location`, decided by LOOKING, and these lists read THAT. The per
// clip evidence, naming the marks seen in each sheet, is in the vault at
// builds/dsd-site-overhaul/round6/reel-locations.json.
//
// ☠️ AND THE LISTS ARE DERIVED, NOT TYPED. A hand written array of ids is a second copy
// of a judgement that already lives in the manifest, and the two drift the first time
// anybody reclassifies a clip. Everything below is a filter over the library, so
// correcting one `location` moves the clip between beats on the next build and no beat
// can quietly keep showing a clip the visual pass moved somewhere else.
// ══════════════════════════════════════════════════════════════════════════

/**
 * ☠️ THREE CLIPS IN training-media.json ARE NOT IN THE LIBRARY AT ALL. They sit in
 * reel-library.json's `heldBack` list, so a lookup by id finds nothing and a naive filter
 * would silently drop all three. Opened and looked at on 2026-09-21: one is the Training
 * Center and two are hotel ballrooms (a PDA Cavite chapter seminar and a Philippine
 * Academy of General Dentistry convocation). Only the first is named here; the other two
 * fall out with the rest of the convention footage, which is the correct outcome.
 */
const HELD_BACK_TRAINING = ['1275898978018496'];

/**
 * Stills in training-media.json that were NOT shot in the Training Center.
 *
 * Every still in that manifest was opened and looked at on 2026-09-21. Ten are plainly
 * somewhere else: two convention halls, the CREST study group's own room, an ELEGOO lab
 * bench, a photo studio with roller shutter doors, and DSD's back office. Nine more could
 * not be placed at all, because they are closeups of a hand or a manikin's mouth with no
 * ceiling, wall or bench in frame.
 *
 * ☠️ THE UNPLACEABLE ONES GO TOO, and that is the point of the round rather than an
 * oversight. The rule the brief set is that a frame is admitted AFTER somebody looked and
 * saw the room. "It sits in an article about a training day" is the caption reasoning
 * that put convention footage in this beat in the first place. A closeup that could have
 * been taken anywhere proves nothing about where it was taken.
 *
 * ☠️ v070-7 IS ALSO A PRIVACY DROP, not only a room drop: the touchscreen behind the
 * speaker is showing a face photograph against a named case file. It would come out even
 * if the room were certain.
 */
const TRAINING_STILLS_DROPPED = [
  // looked at, and demonstrably a different place
  '/images/news/pda-quezon-city-3rd-scientific-seminar-2026/v006-1.jpg',
  '/images/news/cbct-training-crest-study-group-dr-loleng/v044-2.jpg',
  '/images/news/cbct-training-crest-study-group-dr-loleng/v044-3.jpg',
  '/images/news/3d-printing-nesting-post-processing-training/v048-2.jpg',
  '/images/news/3d-printing-nesting-post-processing-training/v048-4.jpg',
  '/images/news/digital-shade-matching-stain-glazing-training/v065-6.jpg',
  '/images/news/smile-design-guided-crown-lengthening-training/v070-2.jpg',
  '/images/news/smile-design-guided-crown-lengthening-training/v070-4.jpg',
  '/images/news/smile-design-guided-crown-lengthening-training/v078-2.jpg',
  '/images/news/pda-benguet-chapter-induction-baguio-2026/v106-1.jpg',
  // looked at, and the room cannot be told from the frame
  '/images/news/dentasource-training-center-opens-pasig/v032-4.jpg',
  '/images/news/cbct-training-crest-study-group-dr-loleng/v044-4.jpg',
  '/images/news/3d-printing-nesting-post-processing-training/v048-1.jpg',
  '/images/news/3d-printing-nesting-post-processing-training/v048-5.jpg',
  '/images/news/3d-printing-nesting-post-processing-training/v048-7.jpg',
  '/images/news/digital-shade-matching-stain-glazing-training/v065-4.jpg',
  '/images/news/digital-shade-matching-stain-glazing-training/v065-8.jpg',
  '/images/news/tads-training-first-batch-dr-emil/v129-3.jpg',
  // a named case file on the screen behind the speaker
  '/images/news/smile-design-guided-crown-lengthening-training/v070-7.jpg',
];

/**
 * Entries in growth-partner.json that were NOT shot in the Training Center. Same pass,
 * same rule. The CREST study group meets in its own room with grey walls and a banner,
 * which is the commonest false positive here, and reel-11's poster is blown out past the
 * point where anything can be identified in it.
 */
const GROWTH_DROPPED = [
  '/cinema/growth/venue-04.jpg',
  '/cinema/growth/venue-10.jpg',
  '/cinema/growth/studio-01.jpg',
  '/cinema/growth/scan-01.jpg',
  '/cinema/growth/scan-03.jpg',
  '/cinema/growth/scan-04.jpg',
  '/cinema/growth/scan-07.jpg',
  '/cinema/growth/reel-11.mp4',
];

/**
 * The CREST and ortho sessions filmed in the Training Center.
 *
 * ☠️ THEY WERE THE LAST VIDEO LEFT IN THE REPO, and they were about to be served from it.
 * public/gp/live holds 25 MB of mp4 that the growth partner page streams straight out of
 * the app; /gp/live/ is not one of the four prefixes in lib/cinema/media.js, so putting
 * these on the home arc as they stood would have sent every visitor's copy through
 * Vercel instead of the media origin. They were uploaded to /srv/media/dsd/cinema/growth
 * on 2026-09-21, verified by sha256 against the local files, and are addressed here by
 * their origin path so mediaUrl resolves them like every other clip. The POSTERS keep
 * pointing at the repo, which is the rule for every reel on the arc: an unreachable
 * origin degrades to a still rather than to a black tile.
 *
 * ☠️ AND ONLY ONE OF THE SEVEN SURVIVED THE LOOK. The folder is named for the growth
 * partner's live sessions, so all seven read as this room from the manifest. They are not:
 * six are a wood floored meeting room, a lecture theatre, and two different clinics. TWO
 * OF THOSE SHOW PATIENTS UNDERGOING A PROCEDURE with faces partly visible, and one also
 * carries another practice's door signage, so they are a privacy exclusion before they
 * are ever a room question. They stay in the repo because the growth partner page has its
 * own rules about them; they do not come to the home arc.
 */
const LIVE_SESSIONS = [
  { slug: 'crest-workshop', alt: 'A workshop session running in the Training Center', duration: 32.0, playTo: 26.0 },
].map(({ slug, alt, duration, playTo }) => ({
  type: 'video',
  src: `/cinema/growth/${slug}.mp4`,
  poster: `/gp/live/${slug}.jpg`,
  alt,
  caption: alt,
  width: 720,
  height: 1280,
  duration,
  playTo,
}));

/** A library reel in the shape ActionPanel's mixed marquee wants. */
const reelItem = (r) => ({
  type: 'video',
  src: r.src,
  poster: r.poster,
  alt: r.caption,
  caption: r.caption,
  width: r.width,
  height: r.height,
  duration: r.duration,
  playTo: r.playTo,
  reel_id: r.id,
});

/**
 * Every reel the visual pass placed in one room, in library order.
 *
 * ☠️ `promoOverlay` IS A SEPARATE QUESTION FROM `location` AND BOTH HAVE TO PASS. Two
 * clips are genuinely shot on the showroom floor and are still wrong for a beat: one is
 * a "We are OPEN" card with opening hours and a phone number laid over four of its five
 * frames, the other is a product advertisement that ends on VISIT OUR WEBSITE. The
 * exclusion law bars a promo card as a tile whatever room it was filmed in, so the room
 * test alone would have let both through. Seven clips carry the flag once the travelling
 * footage is included, because the installation story was advertised harder than any
 * other: three of them are the same QR code and phone number card.
 *
 * ☠️ `beatExclude` IS THE HARD ONE AND IT IS NOT ABOUT TASTE. Two travelling clips put a
 * private practice's signboard, carrying the practice name and a named dentist, across
 * the frame. That is the exclusion law's own example, and one of the two is FFC, which
 * this site keeps at arm's length by standing rule. Neither may appear on any beat.
 */
const reelsShotIn = (...places) => REEL_LIBRARY
  .filter((r) => places.includes(r.location) && !r.promoOverlay && !r.beatExclude)
  .map(reelItem);

/** A beat's own stills. Round 6 gave them width and height so the tile keeps its frame. */
const beatStills = (beat, fallbackAlt) => (beat?.media || []).map((m) => (typeof m === 'string'
  ? { type: 'image', src: m, caption: fallbackAlt, alt: fallbackAlt }
  : { type: 'image', ...m, caption: m.alt }));

/** The one clip a beat opens on, pulled to the front of its own list. */
const leadFirst = (items, reelId) => {
  if (!reelId) return items;
  const i = items.findIndex((it) => it.reel_id === reelId);
  return i < 0 ? items : [items[i], ...items.slice(0, i), ...items.slice(i + 1)];
};

/**
 * One tile per source, first mention wins.
 *
 * ☠️ THE BEATS AND THE MANIFESTS OVERLAP ON PURPOSE AND THAT MAKES DUPLICATES. A beat's
 * own `media` array is the list it was hand written with, and the manifests were later
 * built over the same articles, so the nationwide beat listed four frames that
 * installs.json already carried and the training beat three that training-media.json did.
 * Rendered, that is the same photograph twice in one sweep of the marquee, which reads as
 * a bug in the strip rather than as a repeated picture.
 */
const dedupe = (items) => {
  const seen = new Set();
  return items.filter((it) => {
    if (!it || !it.src || seen.has(it.src)) return false;
    seen.add(it.src);
    return true;
  });
};

const FLOOR_BEAT = HOME_BEATS.find((b) => b.key === 'the-floor');
const TRAINING_BEAT = HOME_BEATS.find((b) => b.key === 'training-center');
const DELIVERY_BEAT = HOME_BEATS.find((b) => b.key === 'delivery');

// ☠️ THE TRAINING MANIFESTS CARRY CLIPS THAT WERE NOT SHOT IN THAT ROOM.
// training-media.json was assembled from caption matches, and 17 of its 30 videos are a
// convention hall, a customer clinic or the showroom. Rather than edit that manifest by
// hand and leave the same trap for the next round, its videos are re-checked against
// `location` here and the ones that are not the room fall out. Its STILLS were checked by
// eye and the ones that are not the room are named in trainingStillDropped below.
const trainingVideoIsTheRoom = (item) => {
  const r = REEL_LIBRARY.find((x) => x.id === item.reel_id);
  // ☠️ THE ROOM TEST IS NOT THE ONLY TEST HERE EITHER. A clip can be filmed in the
  // Training Center and still be an advertisement for it: one of these is a workshop
  // promo reading OPEN NOW FOR NEXT BATCH and LIMITED SLOTS ONLY over the whole frame.
  // Reaching for `location` alone let it through on the first pass.
  if (r) return r.location === 'training' && !r.promoOverlay && !r.beatExclude;
  return HELD_BACK_TRAINING.includes(item.reel_id);
};

const MIXED_ITEMS = {
  'see-us-in-action': ACTION_ITEMS,

  // The floor: every reel shot in the showroom, opening on the one Jarich named, with the
  // showroom's own photographs mixed through them.
  'the-floor': leadFirst(
    dedupe([...reelsShotIn('showroom'), ...beatStills(FLOOR_BEAT, 'The showroom floor in Pasig')]),
    FLOOR_BEAT?.leadReel,
  ),

  // The Training Center: everything actually shot in that room, from three manifests.
  'training-center': dedupe([
    ...TRAINING_ITEMS.filter((it) => (it.type !== 'video' ? !TRAINING_STILLS_DROPPED.includes(it.src) : trainingVideoIsTheRoom(it))),
    ...GROWTH_ITEMS.filter((it) => !GROWTH_DROPPED.includes(it.src)),
    ...LIVE_SESSIONS,
    // training reels the caption-built manifest never picked up
    ...reelsShotIn('training').filter((v) => !TRAINING_ITEMS.some((it) => it.reel_id === v.reel_id)),
    ...beatStills(TRAINING_BEAT, 'Inside the Training Center in Pasig'),
  ]),

  // Nationwide: the install tiles, and every reel of the team or the cargo travelling.
  delivery: dedupe([
    // a tile whose luminance makes it paint as a black rectangle is held out the same way
    // a promo card is: it is in the manifest, it is not on the beat
    ...INSTALL_TILES.filter((t) => !t.beatExclude).map((t) => ({ type: 'image', ...t, caption: t.alt })),
    ...reelsShotIn('road'),
    ...beatStills(DELIVERY_BEAT, 'On the road with a delivery'),
  ]),
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
