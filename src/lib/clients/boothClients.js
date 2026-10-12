// lib/clients/boothClients.js: which booth and clinic moments each product page shows.
//
// The manifest (src/data/clients/booth-clients.json) is built by
// builds/dsd-client-marquee/build_manifest.py from frames that were each looked at; see its
// `excluded` list for what was left out and why. Entries carry `brands`: the product a
// moment clearly shows (roson, denjoy, kclamp), or `dsd` for a booth moment with no one
// product in it.

import data from '@/data/clients/booth-clients.json';
import { visible } from '@/lib/cinema/visible';

const ITEMS = visible(data.items);

/** A strip earns a brand headline ("Doctors who chose Denjoy") only with this many of the
 *  brand's own moments in it. Below that the page says "at our booth" instead: a headline that
 *  names a product over photos that do not show it would be a claim the strip cannot back. */
export const OWN_FOR_HEADLINE = 6;

/**
 * A page's strip: its own brand's moments in manifest order, then, only if that leaves the
 * strip thin, general booth moments to fill it. A ROSON moment is never borrowed for the
 * Denjoy page or the other way round: a chair in a Denjoy strip would be a claim about the
 * wrong product.
 *
 * Returns { items, own, events }: `own` is how many are the brand's own, `events` the short
 * names of the shows in the strip ("PDA", "NADTI" ...) in the order they first appear, so the
 * page's line never lists a show the strip does not have.
 */
export function clientsFor(brand, { min = 10 } = {}) {
  const own = ITEMS.filter((i) => i.brands.includes(brand));
  // clips lead the fill, so a strip short of its own moments still has something moving in it
  const general = ITEMS.filter((i) => i.brands.length === 1 && i.brands[0] === 'dsd')
    .sort((a, b) => (b.kind === 'video') - (a.kind === 'video'));
  const items = own.length >= min ? own : [...own, ...general.slice(0, min - own.length)];
  const events = [];
  for (const i of items) {
    const short = (i.tag || '').replace(/\s*\d{4}$/, '').replace(/ (Convention|Quezon City|Benguet|Luzon|Cebu|Cavite)$/, '');
    if (!/clinic|booth|seminar/i.test(short) && short && !events.includes(short)) events.push(short);
  }
  return { items, own: own.length, events };
}

/** "PDA, NADTI and MINCON" */
export function listEvents(events) {
  if (events.length <= 1) return events.join('');
  return `${events.slice(0, -1).join(', ')} and ${events[events.length - 1]}`;
}
