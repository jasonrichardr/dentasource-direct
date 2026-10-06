// lib/cinema/homeDecks.js — THE HOME ARC'S MARQUEE LISTS, as a pure module.
//
// Moved out of HomeCinema.jsx VERBATIM on 2026-10-01 (WWW, plans/34fe-www.md in the console
// repo) so that two readers build the SAME lists from the SAME filters:
//   HomeCinema.jsx         the baked fallback for each beat
//   scripts/www-seed.mjs   the first copy of each WWW deck, sent to the console's Convex
// No React and no '@/' imports here, so plain Node can run it. The inputs are the manifests
// AFTER visible(): HomeCinema still filters them at module scope, which keeps the hidden
// filter gate (scripts/check-hidden-filter.mjs) biting on the file that imports the JSON.
//
// Once WWW has saved a deck, the console's manifest is canon for that strip and these lists
// only stand in when the manifest is unreachable or the deck is empty (see wwwFor below).

import { mixOrder } from './mixOrder.js';

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

/**
 * Every mixed marquee's baked list, keyed by beat. The inputs are the visible() lists
 * HomeCinema builds at module scope, passed under the same names they had there.
 */
export function buildHomeDecks({ HOME_BEATS, REEL_LIBRARY, ACTION_ITEMS, TRAINING_ITEMS, GROWTH_ITEMS, INSTALL_TILES, HEART_CLIENTS = [] }) {
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

  // ☠️ THE HEART IS THE CLIENTS (Jarich, 2026-10-06: "for the heart add a marquee of our clients
  // images and installed dental chair videos get from our facebook page … make dr amba and prominent
  // dentists the always start of the marquee"). Every photo is from facebook.com/dentasource, posted
  // with the client's consent (his ruling that day, which is what lets a named dentist appear here
  // at all). The lead dentists open the strip ALWAYS and in his order (`lead` 1..5 in
  // heart-clients.json); everyone else and every install reel follow, mixed so stills and clips
  // alternate. The panel plays this list `ordered`, so nothing re-sorts the leads away.
  const clientItem = (c) => ({ type: 'image', src: c.src, width: c.width, height: c.height, alt: c.alt, caption: c.alt });
  const heartLeads = HEART_CLIENTS.filter((c) => c.lead).sort((a, b) => a.lead - b.lead).map(clientItem);
  const heartRest = mixOrder(dedupe([
    ...HEART_CLIENTS.filter((c) => !c.lead).map(clientItem),
    ...REEL_LIBRARY
      .filter((r) => ['install', 'delivery'].includes(r.category) && r.location !== 'road' && !r.promoOverlay && !r.beatExclude)
      .map(reelItem),
  ]));

  const MIXED_ITEMS = {
    heart: [...heartLeads, ...heartRest],
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
  return MIXED_ITEMS;
}

// ══════════════════════════════════════════════════════════════════════════
// WWW (2026-10-01): the console at console.dentasourcedirect.com holds six of the home
// arc's strips as decks (the heart joined on 2026-10-06), and every staff seat arranges them from a phone. The page reads
// the console's public manifest on the server (src/lib/cinema/wwwManifest.js, ISR 60 s).
// ══════════════════════════════════════════════════════════════════════════

/** The mixed-marquee decks, by the beat they drive. `crew` is the crew row inside the
 *  after-sales parts beat and is handed to PartsPanel instead. `heart` (Chairs in service,
 *  2026-10-06) is the clients' marquee in the heart beat, which plays `ordered` whether it
 *  comes from the console or from the baked list, so its lead dentists always open it. */
export const WWW_BEAT_DECK = {
  heart: 'heart',
  'see-us-in-action': 'people',
  'the-floor': 'showroom',
  'training-center': 'training',
  delivery: 'nationwide',
};

/** A manifest tile in the shape ActionPanel's mixed marquee reads. */
export const wwwItem = (t) => ({
  type: t.type,
  src: t.src,
  poster: t.poster,
  alt: t.alt,
  caption: t.alt,
  width: t.w,
  height: t.h,
  playTo: t.playTo,
});

/** A manifest tile in the shape PartsPanel's crew row reads. */
export const wwwCrewShot = (t) => ({ src: t.src, alt: t.alt, width: t.w, height: t.h });

/**
 * The deck that replaces a beat's baked list, or null to keep the baked list.
 *
 * ☠️ A NON-EMPTY DECK OR NOTHING. An empty array from a half-written manifest would
 * otherwise blank a strip on the live page; the baked list is always the safer picture.
 */
export function wwwFor(www, deck, map) {
  const list = www && Array.isArray(www[deck]) ? www[deck] : null;
  return list && list.length ? list.map(map) : null;
}

/**
 * The six lists exactly as the page plays them TODAY, for the first WWW copy.
 *
 * ☠️ mixOrder IS APPLIED HERE, AT SEED TIME. A WWW deck is played in its own order (a
 * person arranged it), so the first copy has to BE the order a visitor sees now, or the
 * day the seed runs would reshuffle every strip. The whole list is kept, not the first 44:
 * the console draws the site's cut and staff can lift a tile from below the line.
 *
 * ☠️ EXCEPT THE HEART, WHICH IS ALREADY IN PLAY ORDER. buildHomeDecks puts the lead dentists
 * first and mixes only the rest, and the panel plays it `ordered`. mixOrder over the whole
 * list would put a video in slot one and push Dr. Amba out of the front.
 */
export function bakedDeckLists(mixed, crewShots) {
  return {
    people: mixOrder(mixed['see-us-in-action'] || []),
    showroom: mixOrder(mixed['the-floor'] || []),
    training: mixOrder(mixed['training-center'] || []),
    nationwide: mixOrder(mixed.delivery || []),
    crew: crewShots,
    heart: mixed.heart || [],
  };
}

/** A stable id for a baked tile: FNV-1a of its path, so a re-run names the same tile. */
export function tileIdFor(src) {
  let h = 0x811c9dc5;
  for (let i = 0; i < src.length; i += 1) {
    h ^= src.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `b-${h.toString(36)}`;
}

/**
 * One baked item as a seed tile. A still with no measured frame gets 4x3, which is the
 * ratio the stylesheet already pins such a still to, so its box on the page is identical;
 * a clip with none gets 9x16, the video tile's own ratio.
 */
export function seedTileFor(item, fallbackAlt) {
  const type = item.type === 'video' ? 'video' : 'image';
  const out = {
    id: tileIdFor(item.src),
    type,
    src: item.src,
    alt: String(item.caption || item.alt || fallbackAlt).trim() || fallbackAlt,
    w: item.width || (type === 'video' ? 9 : 4),
    h: item.height || (type === 'video' ? 16 : 3),
  };
  if (item.poster) out.poster = item.poster;
  if (typeof item.playTo === 'number') out.playTo = item.playTo;
  return out;
}
