// src/data/chairs/catalog.js — the /dentalchairs gallery: one card per chair, grouped by family.
//
// Every chair is on the shared template now, so every card is read from that chair's own
// content file (its `card` block): the page and the gallery can never disagree, and nothing
// about a product is written here. Warranty is deliberately absent per card: every chair
// carries the same 2 years on the unit, so the page says it once (shared.js ASSURANCE).
//
// Photos (card.photo): `blend: true` is a white-ground studio shot, which the card multiplies
// onto the mat (#f7f8fa) so the white of the photograph and the mat read as one surface.
// Without it the mat is already baked into the file. `fit: 'cover'` is a scene with its own
// background (the A1 Pro brochure shot).
//
// House rules for the words: see shared.js.

import a3 from './a3';
import a3s from './a3s';
import a3l from './a3l';
import a1Pro from './a1-pro';
import n2Pro from './n2-pro';
import n2Plus from './n2-plus';
import n1 from './n1';
import s9 from './s9';
import s6 from './s6';
import s3 from './s3';
import { ASSURANCE, SHOWROOM, CTA } from './shared';

const card = (chair, extra = {}) => ({
  slug: chair.slug,
  route: chair.route,
  model: chair.model,
  lineName: chair.lineName,
  family: chair.family,
  line: chair.card.line,
  stars: chair.card.stars,
  photo: chair.card.photo,
  ...extra,
});

// Gallery order: by family, the lead chair of each family first.
export const CHAIRS = [
  // the lead card runs the A3's colorways on its own, slowly, while it is on screen
  card(a3, {
    featured: true,
    cycle: a3.hero.colorways.options.map((o) => ({ key: o.key, src: o.src, name: o.name })),
  }),
  card(a3s),
  card(a3l),
  card(a1Pro),
  card(n2Pro),
  card(n2Plus),
  card(n1),
  card(s9),
  card(s6),
  card(s3),
];

export const INDEX_COPY = {
  hero: {
    kicker: 'Exclusive ROSON distributor in the Philippines',
    title: 'A dental chair for every operatory',
    line: 'The full ROSON range, from the straightforward N1 to the flagship A3. We inspect every unit ourselves, install it in your room and stand behind it after.',
    ctas: [CTA.visit, CTA.inquire],
  },
  assurance: ASSURANCE,
  jumpLabel: 'Browse by family',
  // `key` matches a chair's `family`; a family with no visible chair does not render.
  families: [
    {
      key: 'A3 family',
      id: 'a3-family',
      short: 'A3 family',
      title: 'The A3 family',
      line: 'Our flagship platform, in three specifications.',
    },
    {
      key: 'A1 series',
      id: 'a1-series',
      short: 'A1 series',
      title: 'The A1 series',
      line: 'A steel-framed unit you finish in your clinic\u2019s own color.',
    },
    {
      key: 'N series',
      id: 'n-series',
      short: 'N series',
      title: 'The N series',
      line: 'Complete, practical units for the everyday operatory.',
    },
    {
      key: 'S series',
      id: 's-series',
      short: 'S series',
      title: 'The S series',
      line: 'Waterline care, a low seat or easy cleaning, model by model.',
    },
  ],
  door: {
    kicker: 'Pasig showroom',
    title: 'See them side by side',
    line: 'Sit in the chairs, run them through their full travel, and bring your room measurements. We will help you plan the layout.',
    ...SHOWROOM,
    photo: null,
    ctas: [CTA.visit, CTA.inquire, CTA.message],
  },
};
