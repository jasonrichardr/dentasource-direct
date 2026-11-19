// src/data/chairs/a1-pro.js: everything the A1 Pro page says and shows, in one place.
//
// Rendered by the shared chair template (src/components/chair/), exactly like a3.js.
//
// ☠️ EVERY FACT HERE HAS A SOURCE, AND NONE IS INVENTED. Sources, in order of authority:
// src/data/products.js (roson-a1-pro-fashionable), src/data/cinema/products.json (a1-pro), and
// the legacy page's own files: src/components/a1-radian/content.js (feature panels, the ROSON
// A1 configuration sheet, spec groups, closing), src/components/a1-pro/a1proContent.js (FAQ,
// dentist segments, signature colors) and src/components/a1-pro/A1ProSchemas.jsx.
//
// Left out on purpose:
// - "44 colorways" (content.js, products.json colors beat, the JSON-LD). products.js says
//   12 silicone leather plus 21 PU leather options, so that is the count used here.
// - "Up to 5 years on the motor" (content.js, the JSON-LD). products.js states only the
//   2-year unit term, so the motor term waits for the owner to confirm it.
// - The signature color hex values in a1proContent.js. ROSON Blue is #3D6F90 there, a dusky
//   blue, while every ROSON photograph shows it as turquoise; no swatch beats a wrong one.
// - Any price line ("this month's price"), per the house rules.
//
// Photos, each one looked at: the hero and card use the ROSON brochure scene in Ballet Pink
// (hero-a1-pro-pink-4x3.webp), a scene with its own background, so `fit: 'cover'`, not blend.
// Rejected: every brochure and news-deck page (headlines, captions, page numbers, the ROSON
// mark), the view-*.jpg set and hero.jpg (failed cutouts with leftover boxes and dark floor
// remnants; view-5 also shows an 8-bead light head that does not match the brochure Rolight
// S), the hero-morph renders (an unsourced recolor, the pink one appears in no ROSON page),
// the RS-07 stool shots (caption text in the frame), pieces/handpiece-grip1.png (a browser
// screenshot, not a product photo) and pieces/handpiece-grip2.png (not this chair). There is
// no clean photo of the light, the holder or the upholstery, so those parts are text only.

import { SHOWROOM, CTA } from './shared';

const A1 = '/images/products/a1-pro';

export const a1Pro = {
  slug: 'a1-pro',
  productSlug: 'roson-a1-pro-fashionable',
  route: '/a1-pro',
  name: 'ROSON A1 Pro',
  model: 'A1 Pro',
  lineName: 'Color-led unit',
  family: 'A1 series',

  hero: {
    kicker: 'Color, engineered',
    title: 'ROSON A1 Pro',
    line: "ROSON's color-led chair for the new generation of dentists, finished in the color your clinic chooses, with the RS-07 stool included.",
    stars: [
      'ROSON Blue, Ballet Pink and Mint Green signatures',
      '12 mm carbon steel frame, 150 kg patient load',
      'RS-07 dentist stool and LED X-ray viewer included',
    ],
    ctas: [CTA.visit, CTA.inquire],
    // One clean photograph only, so the color controls hide themselves; the three signature
    // colors are listed under Comfort instead.
    colorways: {
      label: 'Color',
      note: 'ROSON brochure scene in Ballet Pink.',
      initial: 'ballet-pink',
      fit: 'cover',
      options: [
        { key: 'ballet-pink', name: 'Ballet Pink', src: `${A1}/hero-a1-pro-pink-4x3.webp`, w: 1200, h: 900, fit: 'cover' },
      ],
    },
  },

  // The four figures a buyer asks for first, from products.js specs and warranty.
  glance: [
    { value: '12 mm', label: 'carbon structural steel frame' },
    { value: '150 kg', label: 'maximum patient load' },
    { value: '12 + 21', label: 'silicone and PU leather options' },
    { value: '2 years', label: 'warranty on the whole unit' },
  ],

  // No proof band: the A1 Pro has no single headline figure of its own in the sources.

  // products.json a1-pro, the whoItIsFor beat; a1proContent.js dentistSegments for the line.
  fit: {
    kicker: 'Who it suits',
    title: 'First practices and design-led rooms',
    line: 'For the dentist whose clinic is their statement. The full kit comes out of the box, in a color chosen for the room.',
    segments: [
      'New generation dentists setting up a first practice',
      'Multi chair clinics that want a color per room',
      'Pediatric and family clinics with anxious patients',
    ],
  },

  features: {
    kicker: 'Features',
    title: 'Seconds saved on every patient',
    line: 'The parts you touch all day, and the routine steps the chair runs for you.',
    items: [
      {
        key: 'shortcuts',
        title: 'Pro Shortcut Combos on the tray',
        line: 'One touch recalls your chair position. The keys run cup fill, rinse and pipeline flush on their own.',
        photo: { src: `${A1}/pieces/pro-shortcut-hero-isolated.png`, w: 1773, h: 697, fit: 'cover', alt: 'The A1 Pro doctor tray with its shortcut keys and direction pad, handpiece hoses below' },
      },
      {
        key: 'four-handed',
        title: 'Laid out for four hands',
        line: 'The operatory is laid out for the whole team, so you and your assistant keep everything within reach.',
        photo: { src: `${A1}/pieces/four-handed-top-down-pink-clean.png`, w: 1626, h: 1716, fit: 'cover', alt: 'An A1 operatory in pink seen from above: chair, spittoon, assistant holders, foot control and two stools' },
      },
      // The two text tiles share the second row, so neither stands empty beside a photograph.
      {
        key: 'smart-clean',
        title: 'One press rinses and flushes',
        line: 'Smart Clean moves the chair to its entry position, fills the cup and runs a 5 minute spittoon rinse and pipeline flush.',
      },
      {
        key: 'holder',
        title: 'Four holder positions',
        line: 'Storage and two grip angles are among them, so each handpiece sits where your hand expects it.',
      },
    ],
    // Standard parts with no clean photograph (every shot of them is a captioned brochure page).
    extras: {
      title: 'Also built in',
      items: [
        { icon: 'light', title: 'Rolight S 8-LED light', line: 'Yellow, white or mixed, by infrared or button.' },
        { icon: 'motor', title: 'Sleep-grade soft start and stop', line: 'The chair rises and reclines without a lurch.' },
        { icon: 'bowl', title: 'Ceramic spittoon', line: 'Detachable, with a rotary odor trap.' },
        { icon: 'water', title: 'Patient self-help cup fill', line: 'The spittoon rinse starts 8 seconds after the cup fills.' },
      ],
    },
  },

  comfort: {
    kicker: 'Comfort',
    title: 'Leather that wipes clean',
    line: 'Choose soft silicone rubber leather, stain resistant and hypoallergenic, or medical grade PU leather.',
    // No upholstery close-ups: the shared files show PU and microfiber, and there is no clean
    // photograph of the silicone rubber leather that leads this chair.
    colors: {
      title: 'Unit colors',
      items: [
        { name: 'ROSON Blue (FS21)' },
        { name: 'Ballet Pink (FS22)' },
        { name: 'Mint Green (FS23)' },
      ],
    },
    stool: {
      title: 'The RS-07 stool comes included',
      stars: [
        'U-shaped vent cutout against heat buildup',
        '90° to 110° adaptive backrest',
        '300 to 428 mm adjustable seat depth',
      ],
    },
  },

  // products.js specs, with the content.js spec groups and the ROSON A1 configuration sheet.
  specs: {
    kicker: 'Specifications',
    title: 'The full specification sheet',
    line: 'Per the ROSON A1 configuration sheet. Your final build is confirmed at quote.',
    groups: [
      {
        label: 'Chair',
        rows: [
          ['Frame', '12 mm premium carbon structural steel'],
          ['Max patient load', '150 kg'],
          ['Chair base', 'Stable Core'],
          ['Motion', 'Sleep-grade soft start and stop'],
          ['Memory', 'Intelligent one-touch position recall'],
        ],
      },
      {
        label: 'Water and hygiene',
        rows: [
          ['Smart Clean', '5 minute spittoon rinse and pipeline flush'],
          ['Cup fill', 'Linked to the spittoon rinse, patient self-help button'],
          ['Spittoon', 'Detachable ceramic, rotary odor trap'],
          ['Water source', 'One-key water source switch'],
          ['Pipeline', 'Intelligent draining pipeline rinse'],
        ],
      },
      {
        label: 'Delivery and control',
        rows: [
          ['Handpiece holder', '4 positions, storage and 2 grip angles'],
          ['Control system', 'ROSON intelligent control system'],
          ['Diagnostics', 'Error self-check and error code display'],
          ['Foot control', 'Multifunction'],
          ['Film viewer', 'LED X-ray viewer, standard'],
        ],
      },
      {
        label: 'Light',
        rows: [
          ['Operating light', 'Rolight S, 8 LED'],
          ['Modes', 'Yellow, white and mixed'],
          ['Control', 'Infrared sensing and manual button'],
          ['Handle', 'Removable for cleaning'],
        ],
      },
      {
        label: 'Upholstery and color',
        rows: [
          ['Upholstery', 'Soft silicone rubber leather or medical-grade PU leather'],
          ['Signature colors', 'ROSON Blue (FS21), Ballet Pink (FS22), Mint Green (FS23)'],
          ['Custom colors', '12 silicone and 21 PU leather options'],
          ['Color matching', 'Water box, upholstery and instrument tray'],
        ],
      },
      {
        label: 'Configuration',
        rows: [
          ['Mounting', 'Top mounted, implant or trolley'],
          ['Dentist stool', 'RS-07 Professional, included'],
          ['Optional', 'Built-in scaler, micro motor, curing light, intraoral camera'],
          ['Origin', 'Foshan Roson Medical, China'],
        ],
      },
    ],
  },

  // The standard (√) items of the ROSON A1 configuration sheet, plus its four optional (△) ones.
  box: {
    kicker: 'In the box',
    title: 'The full kit, out of the box',
    line: 'Chair, stool, light and X-ray viewer come as standard.',
    items: [
      { icon: 'unit', title: 'Dental unit', line: 'Stable Core chair base, PU upholstery as standard' },
      { icon: 'light', title: 'Rolight S LED light', line: 'Three light modes, removable handle' },
      { icon: 'bowl', title: 'Ceramic spittoon', line: 'Detachable and rotatable' },
      { icon: 'water', title: 'Self-help cup filler', line: 'Linked to the spittoon rinse' },
      { icon: 'foot', title: 'Multifunction foot control' },
      { icon: 'screen', title: 'LED X-ray viewer', line: 'Built into the unit' },
      { icon: 'stool', title: 'RS-07 dentist stool', line: 'U-shaped vent seat, adaptive backrest', tag: 'Included' },
      { icon: 'layers', title: 'Built-in add-ons', line: 'Scaler, micro motor, curing light, intraoral camera', tag: 'Optional' },
    ],
  },

  // products.js roson-a1-pro-fashionable specs only. The legacy page also listed "up to 5 years
  // on the motor"; it is not in products.js, so it stays off until the owner confirms it.
  warranty: {
    kicker: 'Warranty',
    title: 'Covered for two years',
    line: 'One term covers the whole unit. Service and parts are supported locally.',
    rows: [
      { part: 'Dental unit', term: '2 years', note: 'Parts and service in year one, service in year two' },
    ],
  },

  door: {
    kicker: 'Pasig showroom',
    title: 'See every color in person',
    line: 'The A1 Pro is on our showroom floor. Sit in it, recline it and feel the silicone leather.',
    ...SHOWROOM,
    ctas: [CTA.visit, CTA.inquire, CTA.allChairs],
  },

  // How the A1 Pro appears on /dentalchairs.
  card: {
    line: 'Three signature colors on a 12 mm carbon steel frame, with the RS-07 stool included.',
    stars: [
      '150 kg patient load',
      'Rolight S 8-LED light, three modes',
      'Smart Clean rinse and pipeline flush',
    ],
    photo: { src: `${A1}/hero-a1-pro-pink-4x3.webp`, w: 1200, h: 900, fit: 'cover', alt: 'ROSON A1 Pro in Ballet Pink, in a ROSON brochure scene' },
  },
};

export default a1Pro;
