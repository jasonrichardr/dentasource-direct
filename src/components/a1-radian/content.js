/* ─────────────────────────────────────────────────────────────────────
   ROSON A1 Pro — content for the rideradian-DNA detail sections that sit
   under the product cinema on /a1-pro.
   Copy laws (DSD, locked): no competitor names, no emojis, Pasig showroom,
   real product angles, learning-first (no "#1" roadmaps), no prices, and
   no dashes (em or en) in public copy. Say less, bigger.

   2026-09-27 (the length pass): the page ran 25 viewport heights on a phone.
   The second pinned hero, the manifesto, the two feature sections and the
   configurations panel are now ONE swipeable detail row; configurations and
   the spec sheet are ONE accordion; the close carries ONE call (Messenger,
   this month's price). Nothing factual was dropped: every spec row, every
   standard item and every optional add-on still renders.
   ───────────────────────────────────────────────────────────────────── */

import { signatureColors, dentistSegments, a1proFaqs } from '../a1-pro/a1proContent';
export { signatureColors, dentistSegments, a1proFaqs };

const P = '/images/products/a1-pro/pieces';
const NEWS = '/images/news/roson-a1-2026'; // the clean, mobile-perfect ROSON deck panels (from the news guide)

/* The one call on the page. m.me cannot prefill a message; `ref` tags the
   thread so the team can see it came from this page. */
export const MESSENGER_PRICE = {
  label: 'Get this month’s price on Messenger',
  short: 'Get this month’s price',
  href: 'https://m.me/dentasource?ref=a1pro_month_price',
};

/* Detail row header (the manifesto line, kept). */
export const details = {
  eyebrow: 'For the new generation',
  headline: ['Some dentists inherit a room.', 'You design one.'],
  sub: 'Every part of the A1 Pro, one card at a time. Swipe through.',
};

/* The finished ROSON deck pages, shown WHOLE at native ratio with a short
   DSD line under each. The configurations panel closes the row. */
export const featurePanels = [
  {
    src: `${NEWS}/a1-frame-system.jpg`, ratio: 0.685,
    alt: 'Stable Core chair frame, 12 mm steel, 150 kg load, and the sleep grade moving system',
    title: 'Rock solid. 150 kg.',
    copy: 'A 12 mm carbon steel core holds steady under every procedure, and the sleep grade motion rises and falls without a lurch.',
  },
  {
    src: `${NEWS}/a1-shortcuts.jpg`, ratio: 0.685,
    alt: 'Pro Shortcut Combos and the 4 position adjustable handpiece holder',
    title: 'Your shortcuts, one touch.',
    copy: 'Pro Shortcut Combos recall your positions and run cup fill, rinse and pipeline flush on their own. The 4 position holder keeps every handpiece where your hand expects it.',
  },
  {
    src: `${NEWS}/a1-rolight.jpg`, ratio: 0.685,
    alt: 'Rolight S dental light, spittoon odor trap, and integrated handle',
    title: 'Light that adapts.',
    copy: 'The Rolight S covers the whole oral cavity in yellow, white or mixed mode, with a removable handle for disinfection and a rotary odor trap spittoon.',
  },
  {
    src: `${NEWS}/a1-cup-upholstery.jpg`, ratio: 0.685,
    alt: 'Patient self help cup filling and the soft silicone rubber leather upholstery',
    title: 'Patients help themselves.',
    copy: 'One touch cup filling the patient can reach, wrapped in soft silicone rubber leather: stain resistant, hypoallergenic, easy to wipe clean.',
  },
  {
    src: `${NEWS}/a1-stool.jpg`, ratio: 0.685,
    alt: 'The RS-07 professional dentist stool',
    title: 'The RS-07 stool, included.',
    copy: 'A professional dentist stool ships standard, with a U vent seat, adaptive backrest and sloped leg rest for long chairside days.',
  },
  {
    src: `${NEWS}/a1-four-handed.jpg`, ratio: 1.464,
    alt: 'The A1 four handed treatment space, seen from above',
    title: 'Built for four hands.',
    copy: 'An operatory laid out for the whole team, everything within reach.',
  },
  {
    src: `${NEWS}/a1-configurations.jpg`, ratio: 0.685,
    alt: 'The three A1 mounting configurations: top mounted, implant, and trolley',
    title: 'Three ways to build it.',
    copy: 'A top mounted delivery unit, an implant ready setup, or a mobile trolley. The full kit list is in the specifications below.',
  },
];

/* The color library moving strip: the color cards, drifting. */
export const colorPanels = [
  { src: `${NEWS}/a1-signature-colors.jpg`, ratio: 0.685, alt: 'The three A1 signature colors: ROSON Blue, Ballet Pink, Mint Green' },
  { src: `${NEWS}/a1-tone-setter.jpg`, ratio: 1.464, alt: 'Integrated color customization: upholstery, water box, and instrument tray matched' },
  { src: `${NEWS}/a1-upholstery-charts.jpg`, ratio: 1.464, alt: 'The full upholstery palette: soft silicone rubber leather and medical grade PU' },
  { src: `${NEWS}/a1-glamour.jpg`, ratio: 0.685, alt: 'ROSON A1 in Ballet Pink' },
];

export const colorCopy = {
  eyebrow: 'The color library',
  headline: ['Forty four ways', 'to be yours.'],
  body: 'Three signatures pre styled by ROSON, then the full FS silicone and PU leather ranges, 44 colorways in all, matched across the water box, tray and upholstery.',
};

/* Configurations: the official ROSON A1 product configuration sheet
   (PDF p.19 to 20). Standard (√) vs the four optional (△) clinical add-ons. */
export const configurations = {
  mounting: ['Top mounted', 'Implant', 'Trolley'],
  standard: [
    'PU upholstery',
    'Soft start and stop system',
    'Stable Core chair base',
    'Patient self help cup filler',
    'Detachable, rotatable ceramic spittoon',
    'One key water source switch',
    'ROSON intelligent control system',
    'Error self check program',
    'Error code display',
    'Intelligent memory chair position',
    'Intelligent draining pipeline rinse',
    'Cup fill and spittoon rinse linkage',
    'Multifunction foot control',
    'Rolight S LED light',
    'RS-07 dentist stool',
    'LED X-ray viewer',
  ],
  optional: ['Built in scaler', 'Built in micro motor', 'Built in curing light', 'Intraoral camera'],
  note: 'Per the ROSON A1 product configuration sheet; final build confirmed at quote.',
};

/* Tech specs, grouped for the accordion (superset of the JSON-LD schema). */
export const specGroups = [
  {
    key: 'chair',
    title: 'Chair and frame',
    rows: [
      ['Frame', '12 mm premium carbon structural steel'],
      ['Maximum patient load', '150 kg'],
      ['Motion system', 'Sleep grade soft start and stop'],
      ['Memory positions', 'Intelligent chair position recall, one touch'],
      ['Smart workflow', 'Smart Clean: 5 minute spittoon rinse and pipeline flush'],
      ['Handpiece holder', '4 position adjustable (storage plus 2 grip angles)'],
      ['Spittoon', 'Detachable ceramic with rotary odor trap'],
      ['Film viewer', 'LED X-ray viewer, built in, standard'],
    ],
  },
  {
    key: 'light',
    title: 'Light',
    rows: [
      ['Operating light', 'Rolight S, 8 LED, tri mode (yellow, white, mixed)'],
      ['Light control', 'Infrared sensing plus manual button, removable handle'],
    ],
  },
  {
    key: 'color',
    title: 'Upholstery and color',
    rows: [
      ['Upholstery', 'Soft silicone rubber leather or medical grade PU leather'],
      ['Signature colors', 'ROSON Blue (FS21), Ballet Pink (FS22), Mint Green (FS23)'],
      ['Custom colors', '44 colorways across the FS silicone and PU leather ranges'],
    ],
  },
  {
    key: 'kit',
    title: 'Kit and configuration',
    rows: [
      ['Dentist stool', 'RS-07 Professional, included standard'],
      ['Configurations', 'Top mounted, Implant, Trolley'],
    ],
    kit: true, // renders the standard (√) / optional (△) lists under the rows
  },
  {
    key: 'origin',
    title: 'Origin and warranty',
    rows: [
      ['Origin', 'Foshan Roson Medical, China'],
      ['Warranty', 'Up to 5 years on the motor'],
    ],
  },
];

/* Closing: the Pasig showroom and the one call. */
export const closing = {
  coords: '14.5764°N  121.0851°E',
  coordsLabel: 'DentaSource showroom · Pasig',
  headline: ['See every color', 'in person.'],
  body: 'Sit in it, recline it, feel the silicone leather and pick your color at our Pasig showroom, open Monday to Sunday, 9 AM to 8 PM. Service and parts are supported locally.',
  included: 'Chair, stool, light and X-ray viewer included as standard.',
  cta: MESSENGER_PRICE,
  deliver: { label: 'See how we deliver and install', href: '/news/how-we-install-your-dental-chair' },
  disclaimer: 'Configuration may vary. Specifications confirmed at showroom demo and quote.',
  bg: `${P}/four-handed-top-down-pink-clean.png`,
};

/* ── Reading time ────────────────────────────────────────────────────────
   An honest "N min read" for the page, derived from the copy that renders
   here, with the same formula the news articles use (words / 200, floored at
   1). Strings that start with '/' or 'http' are asset paths and routes. */
function countWords(value) {
  if (typeof value === 'string') {
    if (value.startsWith('/') || value.startsWith('http')) return 0;
    return value.trim().split(/\s+/).filter(Boolean).length;
  }
  if (Array.isArray(value)) return value.reduce((n, v) => n + countWords(v), 0);
  if (value && typeof value === 'object') {
    return Object.values(value).reduce((n, v) => n + countWords(v), 0);
  }
  return 0;
}

const COPY_SOURCES = [
  details, featurePanels, colorCopy, colorPanels,
  configurations, specGroups, closing,
];

export const readingWordCount = COPY_SOURCES.reduce((n, src) => n + countWords(src), 0);
export const readingMinutes = Math.max(1, Math.round(readingWordCount / 200));
