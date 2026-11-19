// src/data/chairs/a3s.js: everything the A3S page says and shows, in one place.
//
// Rendered by the shared chair template (src/components/chair/); same shape as a3.js.
//
// EVERY FACT HERE HAS A SOURCE, AND NONE IS INVENTED. Sources: src/data/products.js
// (roson-dxa3s), src/data/cinema/products.json (a3s: forms, whoItIsFor, features, colors, door),
// and the legacy /a3s components in src/components/a3s/ (feature grid, tech specs, what's in the
// box, warranty table, configurator, color section, ergonomics section).
//
// Deliberately left out:
// - Colors: products.js names Mountain Blue and ROSON Blue; the legacy configurator, the legacy
//   color section and products.json name Orange and Light Green instead. products.js wins, so the
//   seven colors below are its seven, with its own swatch hexes. Orange and Light Green are off.
// - "Medical-grade color LCD" (legacy grid, products.json): products.js only states the power-on
//   self-test and fault code display, and the A3S tray photographs show a keypad, not a screen.
// - Breathing lamp placement: the legacy page puts it in the Rolight S; products.js says it is a
//   light "on the chair". Written as products.js has it, never as part of the light.
// - Warranty: only the 2-year unit term is in products.js. The legacy table's 5-year motor term
//   and the legacy 5-year seamless leather term stay off until the owner confirms them.
// - "Widest palette in the ROSON lineup", the stool's disability statistic and femoral artery
//   claim: left out.
//
// Photos: ROSON studio renders already in public/, looked at one by one. Hero is the sharpest
// full-unit shot (17-1.jpg, 1614 px). The legacy grid paired several photos with the wrong
// feature (10-1 is the tray, not the light; 4-7 is the recline, not the LCD), so each is used
// here for what it actually shows. Excluded: az-img.jpg (installation drawing), Dynamic-Comfort
// (stool infographic with text), the per-color chair-only renders (the chair sits small in the
// lower left of a square canvas, and two of the seven colors conflict with products.js), the
// sunlit PNGs (not studio photographs), and the products.json door photo (a person's face).
//
// House rules for the words: headline 7 words or fewer, line 24 or fewer, stars 9 or fewer, no
// em or en dashes, no prices, no "#1", no competitor names, Pasig showroom (never Manila).

import { SHOWROOM, CTA } from './shared';

const A3S = '/images/products/a3s';
const FEAT = `${A3S}/Advanced features and components`;
const DELIV = `${A3S}/Handpiece Placement Choices`;
const SHARED = '/images/chairs/shared';

export const a3s = {
  slug: 'a3s',
  productSlug: 'roson-dxa3s',
  route: '/a3s',
  name: 'ROSON Smart Model A3S',
  model: 'A3S',
  lineName: 'Smart Model',
  family: 'A3 family',

  hero: {
    kicker: 'The A3 platform, in seven colors',
    title: 'ROSON Smart Model A3S',
    line: 'The A3 platform in a lighter specification. Seamless microfiber leather is standard here, not an upgrade.',
    stars: [
      'Seven unit colors to suit your room',
      'Condition breathing lamp helps calm anxious patients',
      'Free ocular visit, then our own technicians install it',
    ],
    ctas: [CTA.visit, CTA.inquire],
    colorways: {
      label: 'Color',
      note: 'Studio render from ROSON.',
      initial: 'tiffany-blue',
      blend: true,
      options: [
        { key: 'tiffany-blue', name: 'Tiffany Blue', swatch: '#81D8D0', src: `${FEAT}/17-1.jpg`, w: 1614, h: 1075 },
      ],
    },
  },

  // The four figures a buyer asks for first: the color list (products.js), the legacy spec
  // sheet (ROSON CE manual) and the products.js warranty.
  glance: [
    { value: '7', label: 'unit colors to choose from' },
    { value: '400 to 750 mm', label: 'seat height range' },
    { value: '150 kg', label: 'maximum patient load' },
    { value: '2 years', label: 'warranty on the whole unit' },
  ],

  // No proof band: the A3S has no single sourced headline number.

  // products.json a3s, the whoItIsFor beat.
  fit: {
    kicker: 'Who it suits',
    title: 'First clinics and second operatories',
    line: 'A first clinic, or a second operatory where one budget covers two rooms, without leaving the A3 platform.',
    segments: [
      'First clinics fitting out one room',
      'Practices adding a second operatory',
      'Clinics that want color choice on the floor',
    ],
  },

  features: {
    kicker: 'Features',
    title: 'The parts you use all day',
    line: 'What each part does for you, and for the patient in the chair.',
    items: [
      {
        key: 'leather',
        title: 'Seamless leather, included',
        line: 'No seam crevices for bacteria to settle in, so the seat and backrest are easier to disinfect.',
        photo: { src: `${FEAT}/6-7.jpg`, w: 1614, h: 1075, blend: true, alt: 'Top view of the A3S seat, backrest and headrest in teal upholstery' },
      },
      {
        key: 'light',
        title: 'One light, two modes',
        line: 'The Rolight S runs on Philips LEDs with infrared control, and its double mode covers examination and treatment.',
        photo: { src: `${FEAT}/7-2.jpg`, w: 1614, h: 1075, blend: true, alt: 'The A3S operating light head, its LED lenses and two side handles' },
      },
      {
        key: 'motor',
        title: 'Moves without a jolt',
        line: 'Soft start and stop keeps every chair movement smooth and quiet, which helps nervous patients relax.',
        photo: { src: `${FEAT}/4-7.jpg`, w: 1614, h: 1075, blend: true, alt: 'The A3S backrest and headrest shown at three recline angles' },
      },
      {
        key: 'holder',
        title: 'Holders set to your angle',
        line: 'The handpiece holder adjusts to four angles, from 30° to 80°, to ease the strain on your wrist.',
        photo: { src: `${FEAT}/10-1.jpg`, w: 1614, h: 1075, blend: true, alt: 'The A3S doctor tray, its control keys and instruments resting in the holders' },
      },
      // The two parts with no clean photograph sit last, side by side, so neither text tile is
      // stretched to the height of a photo tile.
      {
        key: 'breathing',
        title: 'The chair shows its status',
        line: 'A soothing ambient light on the chair signals its status and helps put anxious patients at ease.',
      },
      {
        key: 'selftest',
        title: 'It checks itself at startup',
        line: 'A power-on self-test checks every system at startup. If something is off, a fault code tells you what to fix.',
      },
    ],
    // products.js names the three delivery systems; the photos are the legacy configurator's own.
    delivery: {
      kicker: 'Delivery',
      title: 'Three ways to set it up',
      line: 'Over the patient for direct access, swing mounted for left or right hands, or on a cart you can move.',
      initial: 'swing-mounted',
      blend: true,
      options: [
        { key: 'over-patient', name: 'Over the patient', src: `${DELIV}/Over-the-Patient.jpg`, w: 640, h: 640 },
        { key: 'swing-mounted', name: 'Swing mounted', src: `${DELIV}/Swing-Mounted.jpg`, w: 640, h: 640 },
        { key: 'cart', name: 'On a cart', src: `${DELIV}/Cart-Mounted.jpg`, w: 640, h: 640 },
      ],
    },
  },

  comfort: {
    kicker: 'Comfort',
    title: 'Pick the leather and color',
    line: 'Seamless microfiber comes standard. PU leather and sewn microfiber are the other two choices.',
    upholstery: [
      { name: 'Seamless microfiber', src: `${SHARED}/upholstery-seamless-microfiber.webp`, w: 1400, h: 1050, alt: 'Close-up of blue seamless microfiber leather beside a stitched edge' },
      { name: 'PU leather', src: `${SHARED}/upholstery-pu-leather.webp`, w: 1400, h: 1050, alt: 'Close-up of blue PU leather and its grain' },
      { name: 'Sewn microfiber', src: `${SHARED}/upholstery-sewn-microfiber.webp`, w: 1400, h: 1050, alt: 'Close-up of teal sewn microfiber leather where two panels meet' },
    ],
    // products.js configuratorOptions: the seven names and their swatch values.
    colors: {
      title: 'Unit colors',
      items: [
        { name: 'Tiffany Blue', swatch: '#81D8D0' },
        { name: 'Begonia Red', swatch: '#C93756' },
        { name: 'Olive Green', swatch: '#6B8E23' },
        { name: 'Gray', swatch: '#8C8C8C' },
        { name: 'Coloured Glaze Blue', swatch: '#6BA3D6' },
        { name: 'Mountain Blue', swatch: '#4682B4' },
        { name: 'ROSON Blue', swatch: '#2E5090' },
      ],
    },
    // products.js ergonomicsDeepDive, the RS06 stool.
    stool: {
      title: 'The RS06 stool is included',
      stars: [
        'Eight-way adjustable, with a 5° forward tilt',
        'High-density cushioning that keeps its shape',
        '360° silent casters on an aluminum alloy base',
      ],
    },
  },

  // From the legacy /a3s spec section (ROSON CE manual), plus the products.js spec rows.
  specs: {
    kicker: 'Specifications',
    title: 'Every figure your technician needs',
    line: 'From the ROSON CE manual, grouped by system.',
    groups: [
      {
        label: 'Electrical',
        rows: [
          ['Model', 'KLT-6220 A3S'],
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
          ['Max patient load', '150 kg (ISO 7494-1)'],
          ['Motor', 'Whisper-Silent Motor, soft start and stop'],
          ['Motor duty', 'Max 2 min on, min 18 min off'],
        ],
      },
      {
        label: 'Water',
        rows: [
          ['Water pressure', '0.2 to 0.4 MPa'],
          ['Water flow', '≥ 5 L/min'],
          ['pH', '6.5 to 8.5'],
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
        label: 'Physical',
        rows: [
          ['Net weight', 'About 230 kg'],
          ['Handpiece holder', '4-angle adjustable, 30° to 80°'],
          ['Operating light', 'Rolight S, Philips LEDs'],
          ['Upholstery', 'Seamless microfiber leather, standard'],
          ['Made by', 'Foshan Roson Medical, China'],
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

  // The legacy /a3s what's in the box section.
  box: {
    kicker: 'In the box',
    title: 'Ten parts, one delivery',
    line: 'Everything you need to start arrives together.',
    items: [
      { icon: 'unit', title: 'Dental unit', line: 'The chair and its base' },
      { icon: 'light', title: 'Rolight S operating light', line: 'Philips LEDs, infrared control' },
      { icon: 'bowl', title: 'Swiveling cuspidor bowl', line: 'With integrated flushing' },
      { icon: 'foot', title: 'Four-way foot control', line: 'IPX4 rated, a free upgrade on every unit' },
      { icon: 'headrest', title: 'Multi-articulated headrest', line: 'Adjusts for every patient size' },
      { icon: 'seat', title: 'Backrest and seat', line: 'In the upholstery and color you choose' },
      { icon: 'stool', title: 'RS06 dentist stool', line: 'Gas spring, casters, armrest and backrest', tag: 'Included' },
      { icon: 'syringe', title: 'Three-way syringe and suction', line: 'Stainless steel syringe, strong and weak suction' },
      { icon: 'tube', title: 'Handpiece tubing', line: 'Stainless steel spiral, short tube' },
      { icon: 'docs', title: 'Documents and kit', line: 'Manual, quality certificate, warranty card, accessories' },
    ],
  },

  // products.js roson-dxa3s specs only. The legacy table's 5-year motor term is not in the data
  // files, so it stays off until the owner confirms it.
  warranty: {
    kicker: 'Warranty',
    title: 'Covered for two years',
    line: 'One term covers the whole dental unit.',
    rows: [
      { part: 'Dental unit', term: '2 years', note: 'Parts and service in year one, service in year two' },
    ],
  },

  door: {
    kicker: 'Pasig showroom',
    title: 'See it before you decide',
    line: 'The A3S is on our showroom floor. Sit in it, run it through its full travel and bring your operatory measurements.',
    ...SHOWROOM,
    photo: { src: '/images/chairs/index/a3s-glaze-blue.webp', w: 963, h: 771, alt: 'ROSON Smart Model A3S in Coloured Glaze Blue, with its light and delivery arm' },
    ctas: [CTA.visit, CTA.inquire, CTA.allChairs],
  },

  // How the A3S appears on /dentalchairs.
  card: {
    line: 'Seamless microfiber leather as standard, seven unit colors and a breathing lamp, on the A3 platform.',
    stars: [
      'Seamless microfiber leather as standard',
      'Rolight S with Philips LEDs',
      'Handpiece holder from 30° to 80°',
    ],
    photo: { src: '/images/chairs/index/a3s-glaze-blue.webp', w: 963, h: 771, alt: 'ROSON Smart Model A3S in Coloured Glaze Blue' },
  },
};

export default a3s;
