// src/data/chairs/n2-plus.js: everything the N2 Plus page says and shows, in one place.
//
// Rendered by the shared chair template (src/components/chair/), shaped like a3.js.
//
// ☠️ EVERY FACT HERE HAS A SOURCE, AND NONE IS INVENTED. Sources: src/data/products.js
// (roson-dxn2plus), src/data/cinema/products.json (n2-plus: forms, whoItIsFor, features,
// colors, door), and the legacy /n2-plus components in src/components/n2-plus/ (feature grid,
// complete section, ergonomics, tech specs, configurator, what's in the box, warranty table).
// Where two sources differ, products.js wins: the motor is written as products.js has it
// ("24V DC silent electric motor"), and the standard build is 13 components (products.js)
// while the legacy box list shows 10 parts, so the box line states no count.
//
// Left out on purpose:
// - Warranty terms that are only in the legacy table or configurator (3-year motor, 5-year
//   seamless microfiber). products.js states 2 years: parts and service in year one, service
//   in year two. Nothing else goes on the warranty card until the owner confirms it.
// - "Widest standard table in the N series" and "tissue box exclusive to the N2+": legacy-only
//   claims, and the N2 Pro card lists a 650 by 315 mm tray.
// - The legacy "8+ hour clinical days" and "musculoskeletal" stool lines (not specific facts).
//
// Photos: the pre-baked hero (index/n2-plus-front.webp, no blend) and the ROSON white-ground
// detail shots in /images/products/n2-plus/, looked at one by one. Excluded: N2_Side.jpg
// (an infographic with an inset and Chinese caption), 04_Suction_Filter.jpg and filter.jpg
// (the legacy page used the suction filter shot as its "X-ray viewer" photo; it is not one,
// so the viewer is told in the dentist table tile, whose photo shows it),
// the seven Unit Color Selection shots (seat only, set small in the lower left of a mostly
// empty frame, so the colors are listed in comfort.colors instead), Standard.png (the same
// file as N2_Front.png, used for all three delivery options), and the A3 folder stool photo.
//
// House rules for the words: headline 7 words or fewer, line 24 or fewer, stars 9 or fewer,
// no em or en dashes, no prices, no "#1", no competitor names, Pasig showroom (never Manila).

import { SHOWROOM, CTA } from './shared';

const N2P = '/images/products/n2-plus';
const FEAT = `${N2P}/Advanced features and components`;
const SHARED = '/images/chairs/shared';

export const n2Plus = {
  slug: 'n2-plus',
  productSlug: 'roson-dxn2plus',
  route: '/n2-plus',
  name: 'ROSON Classic Model N2 Plus',
  model: 'N2 Plus',
  lineName: 'Classic Model',
  family: 'N series',

  hero: {
    kicker: "Everything you need, nothing you don't",
    title: 'ROSON Classic Model N2 Plus',
    line: 'The tissue box, the X-ray viewer and the second water bottle come in the standard build. Nothing to add later.',
    stars: [
      'Philips LED light with two modes, infrared switching',
      'Ceramic spittoon that rotates 180°',
      'Over the patient, swing mounted or cart delivery',
    ],
    ctas: [CTA.visit, CTA.inquire],
    // One clean studio photograph; the seven unit colors are listed under Comfort.
    colorways: {
      label: 'Color',
      note: 'Studio photograph from ROSON.',
      initial: 'front',
      options: [
        { key: 'front', name: 'a front studio view', src: '/images/chairs/index/n2-plus-front.webp', w: 1800, h: 1439 },
      ],
    },
  },

  // From the legacy spec table, and products.js for the holder and the warranty.
  glance: [
    { value: '400 to 750 mm', label: 'seat height range' },
    { value: '150 kg', label: 'maximum patient load' },
    { value: '5', label: 'handpiece holder positions' },
    { value: '2 years', label: 'warranty on the whole unit' },
  ],

  // products.js: "13 components included as standard".
  proof: {
    kicker: 'The standard build',
    title: 'The extras already come fitted',
    stat: '13',
    statCaption: 'components included as standard',
    line: 'The most complete standard configuration in the N series. The parts other models list as options are already fitted.',
    stars: [
      'A 5-in-1 tissue box and an LED X-ray viewer',
      'Two 1 L pure water bottles',
      'A doctor stool with armrest and backrest',
    ],
  },

  // products.json n2-plus, the whoItIsFor beat.
  fit: {
    kicker: 'Who it suits',
    title: 'Clinics that want the extras included',
    line: 'Choose one build and every room gets the same complete setup, with no option list to work through.',
    segments: [
      'Busy general practices',
      'Clinics standardizing two or more rooms',
      'Buyers who would rather skip the option list',
    ],
  },

  features: {
    kicker: 'Features',
    title: 'What comes on the unit',
    line: 'The parts you use with every patient, and what each one does for your day.',
    items: [
      {
        key: 'table',
        title: 'Instruments and films within reach',
        line: 'A 650 by 300 mm table with a five-position handpiece holder, plus an LED X-ray viewer for reading films chairside.',
        photo: { src: `${FEAT}/02_Dentist_Table.jpg`, w: 1614, h: 1075, blend: true, alt: 'The N2 Plus dentist table with its keypad, X-ray viewer and five handpiece holders' },
      },
      {
        key: 'light',
        title: 'Switch the light without touching it',
        line: '8-Tooth Smile light with Philips LEDs. Wave a hand to switch modes, nothing to touch between patients.',
        photo: { src: `${FEAT}/01_Oral_Light.jpg`, w: 1614, h: 1075, blend: true, alt: 'The N2 Plus oral light head with its LEDs, handles and power button' },
      },
      {
        key: 'tissue',
        title: 'Tissues and storage, built in',
        line: 'A 5-in-1 multifunctional tissue box with dual layer storage, part of the standard build.',
        photo: { src: `${FEAT}/05_Tissue_Box.jpg`, w: 1614, h: 1075, blend: true, fit: 'cover', alt: 'The 5-in-1 tissue box mounted on the N2 Plus light post' },
      },
      {
        key: 'spittoon',
        title: 'Ceramic, so it stays clean',
        line: 'More hygienic and durable than plastic. It rotates 180° for easy access, with programmable cup filling and rinsing.',
        photo: { src: `${FEAT}/03_Spittoon.jpg`, w: 1614, h: 1075, blend: true, fit: 'cover', alt: 'The N2 Plus ceramic spittoon bowl beside its cup filler' },
      },
      {
        key: 'water',
        title: 'Two bottles, fewer refills',
        line: 'Two 1 L pure water bottles see you through a full morning of patients. Warm water holds at 40 °C ±5 °C.',
        photo: { src: `${FEAT}/06_Water_Supply.jpg`, w: 1614, h: 1075, blend: true, fit: 'cover', alt: 'The two pure water bottles behind a clear cover on the N2 Plus' },
      },
      {
        key: 'assistant',
        title: 'Your assistant gets a full station',
        line: 'Control panel, warm water three-way syringe and a curing light position, ready for four-handed dentistry.',
        photo: { src: `${FEAT}/07_Assistant_Table.jpg`, w: 1614, h: 1075, blend: true, fit: 'cover', alt: 'The N2 Plus assistant holders with a three-way syringe and suction tubes' },
      },
    ],
    // No same-framing photos of the three delivery options exist (the legacy page used one
    // image for all three), so they are listed here instead of in a switcher.
    extras: {
      title: 'Also built in',
      items: [
        { icon: 'water', title: 'Independent disinfectant water', line: 'Kept apart from the patient water circuit.' },
        { icon: 'move', title: 'Three delivery options', line: 'Over the patient, swing mounted or on a cart.' },
        { icon: 'headrest', title: 'Multi-articulated headrest', line: 'Adapts to any patient height.' },
        { icon: 'motor', title: '24 V DC silent motor', line: 'Quiet electric drive for the chair.' },
      ],
    },
  },

  comfort: {
    kicker: 'Comfort',
    title: 'Choose the finish your patients feel',
    line: 'Three upholstery choices and seven unit colors, so the chair suits the room it goes into.',
    upholstery: [
      { name: 'PU leather', src: `${SHARED}/upholstery-pu-leather.webp`, w: 1400, h: 1050, alt: 'Close-up of PU leather upholstery' },
      { name: 'Sewn microfiber', src: `${SHARED}/upholstery-sewn-microfiber.webp`, w: 1400, h: 1050, alt: 'Close-up of sewn microfiber leather and its seam' },
      { name: 'Seamless microfiber', src: `${SHARED}/upholstery-seamless-microfiber.webp`, w: 1400, h: 1050, alt: 'Close-up of seamless microfiber leather' },
    ],
    // Names from products.json and the legacy configurator; hex values from the configurator.
    colors: {
      title: 'Unit colors',
      items: [
        { name: 'Apple Green', swatch: '#8BC34A' },
        { name: 'Bordeaux', swatch: '#800020' },
        { name: 'Dark Blue', swatch: '#1A3B5C' },
        { name: 'Green', swatch: '#4CAF50' },
        { name: 'Light Grey', swatch: '#E0E0E0' },
        { name: 'Middle Grey', swatch: '#9E9E9E' },
        { name: 'Orange', swatch: '#FF9800' },
      ],
    },
    stool: {
      title: 'The RS03 dentist stool is included',
      stars: [
        'Integrated armrest and backrest for long procedures',
        'Wide cast aluminum base, stable on any floor',
        'Silent nylon wheels that will not scuff floors',
      ],
    },
  },

  // From the legacy /n2-plus spec section, with products.js wording where both speak.
  specs: {
    kicker: 'Specifications',
    title: 'The full technical sheet',
    line: 'Grouped the way a technician reads it, for planning your power, water and air.',
    groups: [
      {
        label: 'Electrical',
        rows: [
          ['Model', 'N2+'],
          ['Input power', '720 VA max'],
          ['Voltage', '230 V AC ±10%, 50/60 Hz'],
          ['Protection class', 'Class I, Type B applied parts'],
          ['Water protection', 'IPX0 main unit, IPX4 foot control'],
        ],
      },
      {
        label: 'Chair',
        rows: [
          ['Height range', '400 to 750 mm (±10 mm)'],
          ['Backrest range', '115° to 170°'],
          ['Max patient load', '150 kg'],
          ['Motor', '24 V DC silent electric motor'],
          ['Delivery options', 'Over the patient, swing mounted, cart mounted'],
        ],
      },
      {
        label: 'Water',
        rows: [
          ['Water pressure', '0.2 to 0.4 MPa'],
          ['Water flow', '≥ 5 L/min'],
          ['Warm water', '40 °C ±5 °C'],
          ['Pure water bottles', '2 × 1 L'],
          ['Disinfectant water', 'Independent supply'],
        ],
      },
      {
        label: 'Air',
        rows: [
          ['Air pressure', '0.55 to 0.8 MPa'],
          ['Air flow', '≥ 90 L/min'],
          ['Oil', 'None, oil-free compressor only'],
        ],
      },
      {
        label: 'Unit',
        rows: [
          ['Net weight', 'About 230 kg'],
          ['Dentist table', '650 × 300 mm'],
          ['Handpiece holder', '5 positions'],
          ['Spittoon', 'Ceramic, 180° rotatable'],
          ['Operating light', '8-Tooth Smile, Philips LEDs, infrared'],
          ['X-ray viewer', 'LED backlit, built in'],
          ['Tissue box', '5-in-1, dual layer'],
          ['Upholstery', 'PU, sewn microfiber or seamless microfiber'],
          ['Origin', 'Foshan Roson Medical, China'],
        ],
      },
    ],
    standards: [
      'IEC 60601-1:2005+A1:2012',
      'EN ISO 7494-1:2018',
      'ISO 9680:2014',
      'CE marked per Council Directive 93/42/EEC',
    ],
  },

  box: {
    kicker: 'In the box',
    title: 'What arrives at your clinic',
    line: 'The full unit, its light and spittoon, the RS03 stool and the paperwork, delivered together.',
    items: [
      { icon: 'unit', title: 'Dental unit', line: 'The chair and its base' },
      { icon: 'light', title: 'Operating light', line: '8-Tooth Smile Philips LED oral light' },
      { icon: 'bowl', title: 'Ceramic spittoon', line: 'Rotates 180°, with programmable flushing' },
      { icon: 'foot', title: 'Upgraded foot control', line: 'Multifunction controller, a DentaSource upgrade', tag: 'Free upgrade' },
      { icon: 'headrest', title: 'Multi-articulated headrest', line: 'Adjustable for all patient sizes' },
      { icon: 'seat', title: 'Backrest and seat', line: 'In the upholstery color you choose' },
      { icon: 'stool', title: 'RS03 dentist stool', line: 'Armrest, backrest and a wide cast aluminum base', tag: 'Included' },
      { icon: 'syringe', title: 'Three-way syringe and suction', line: 'Warm water syringe, strong and weak suction' },
      { icon: 'tube', title: 'Handpiece tubing', line: 'Stainless steel spiral, short tube' },
      { icon: 'docs', title: 'Documents and kit', line: 'Manual, quality certificate, warranty card, accessories' },
    ],
  },

  // products.js roson-dxn2plus only: "2 years (1st year parts + service, 2nd year service)".
  // The legacy table's 3-year motor term stays off until the owner confirms it.
  warranty: {
    kicker: 'Warranty',
    title: 'Service covered for two years',
    line: 'Parts and service are covered in the first year, and service continues through the second.',
    rows: [
      { part: 'Dental unit, service', term: '2 years' },
      { part: 'Dental unit, parts', term: '1 year' },
    ],
  },

  door: {
    kicker: 'Pasig showroom',
    title: 'See it before you decide',
    line: 'The N2 Plus is on our showroom floor. Sit in it, run it through its full travel, and bring your measurements.',
    ...SHOWROOM,
    photo: { src: `${N2P}/N2+ Dental Chair/N2_Angle.jpg`, w: 640, h: 640, blend: true, alt: 'The N2 Plus seen from behind, its dentist element and spittoon on the left' },
    ctas: [CTA.visit, CTA.inquire, CTA.allChairs],
  },

  // How the N2 Plus appears on /dentalchairs.
  card: {
    line: 'The most complete standard package in the N series, with the extras already fitted.',
    stars: [
      '5-in-1 tissue box and LED X-ray viewer',
      'Two 1 L pure water bottles',
      '8-Tooth Smile Philips LED light',
    ],
    photo: { src: '/images/chairs/index/n2-plus-front.webp', w: 1800, h: 1439, alt: 'ROSON Classic Model N2 Plus, front view with its light, spittoon and dentist table' },
  },
};

export default n2Plus;
