// lib/clients/brandMedia.js: the brand strips (ROSON, Denjoy, K-Clamps) on their own pages
// and on the home page.
//
// Jarich, 2026-10-12: "add videos and images ... so the videos autoplay every 3 images, put
// all we have". src/data/clients/brand-media.json is built by
// builds/dsd-client-marquee/r2/build_brand_media.py from media ALREADY on the site (the news
// desk's photos, Chairs in service, the reel library) plus round 1's booth moments, in the
// rhythm three photographs, then a clip. Every photo and clip in it was looked at.
//
// ☠️ A CLIP IS A REEL-LIBRARY ID, SO THE STUDIO'S HIDE STILL BITES. A reel hidden in
// reel-library.json drops out of these strips on the next build, the same as everywhere else.

import data from '@/data/clients/brand-media.json';
import reelLibrary from '@/data/cinema/reel-library.json';
import { visible } from '@/lib/cinema/visible';

const LIVE_REELS = new Set(visible(reelLibrary.reels).map((r) => r.id));
const live = (it) => !it.reel || LIVE_REELS.has(it.reel);

/** The strip for a brand page: 'roson' | 'denjoy' | 'kclamp'. */
export function brandStrip(brand) {
  return visible(data[brand] || []).filter(live);
}

/** The same strip in ActionPanel's tile shape, for the home beats (endAt is its playTo). */
export function brandTiles(brand) {
  return brandStrip(brand).map((it) => ({
    type: it.kind === 'video' ? 'video' : 'photo',
    src: it.src,
    poster: it.poster,
    width: it.w,
    height: it.h,
    alt: it.alt,
    playTo: it.endAt || undefined,
  }));
}

/** The shows a strip's booth moments come from, short and in order: "PDA, NADTI and MINCON". */
export function showsIn(items) {
  const shows = [];
  for (const it of items) {
    const m = /^(PDA|NADTI|MINCON|DIGICON|PAGD)\b/.exec(it.tag || '');
    if (m && !shows.includes(m[1])) shows.push(m[1]);
  }
  if (shows.length <= 1) return shows.join('');
  return `${shows.slice(0, -1).join(', ')} and ${shows[shows.length - 1]}`;
}

/** How many of a strip's moments are the brand's own (a K-Clamp strip may borrow booth clips). */
export function ownCount(items, brand) {
  return items.filter((it) => it.brands.includes(brand)).length;
}
