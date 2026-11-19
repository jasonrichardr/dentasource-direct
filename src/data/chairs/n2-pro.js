// src/data/chairs/n2-pro.js: everything the N2 Pro page says and shows, in one place.
//
// Rendered by the shared chair template (src/components/chair/), which writes no copy of its
// own. Same shape as src/data/chairs/a3.js.
//
// ☠️ EVERY FACT HERE HAS A SOURCE, AND NONE IS INVENTED. Facts come only from
// src/data/products.js (roson-dxn2-pro), src/data/cinema/products.json (n2-pro), and the old
// /n2-pro page: src/app/n2-pro/page.tsx and src/components/n2-pro-v2/ (n2proContent.js,
// N2ProLanding.jsx, N2ProAutoplayHero.jsx, N2ProSchemas.jsx). Where those disagree,
// products.js wins.
//
// Left out on purpose:
// - The 3-year motor warranty (old warranty table) and the 5-year motor warranty (old meta
//   description). Neither is in products.js, so they stay off until the owner confirms.
// - The swing mount doctor bridge (old feature card, products.json features beat). products.js
//   lists the delivery options as over the patient and cart only, so the page shows those two.
// - The N2 Plus and N1 comparison table, the free ocular advice list, the cleaning schedule,
//   the installation rough-in figures, the FAQ and the quote and bundle lines (prices, other
//   models, and service detail that belongs elsewhere).
// - The .md notes inside public/images/products/n2-pro/ (an RS03 stool, a color LCD): they
//   are not one of this page's fact sources.
// - Swatch hexes: the old N2 Pro color section gives names and FS codes, no hex, so the hero
//   carries one photograph and the seven colors are listed by name in comfort.colors.
//
// House rules for the words: a headline is 7 words or fewer, the line under it 24 or fewer,
// `stars` 9 or fewer each, no em or en dashes, no prices, no "#1", no competitor names,
// Pasig showroom (never Manila).
//
// Photos: ROSON studio renders and detail shots already in public/images/products/n2-pro/,
// looked at one by one. White-ground shots carry `blend`. Not used: Swing_Mount_Bridge.png and
// N2 Pro Dental Chair/5-1.jpg (a drawn motion arrow, and the PNG is a low-res duplicate),
// 6-1.jpg (ghosted double exposure), Shield_Design.jpg (a cutaway with a cropped label),
// Swing_Mounted.jpg (see the delivery note above), the 768 px upholstery thumbnails (the
// shared 1400 px close-ups are the same material), and 7-foot-control.jpg (no sourced fact
// about the foot control beyond its IPX4 rating).

import { SHOWROOM, CTA } from './shared';

const N2P = '/images/products/n2-pro';
const SHARED = '/images/chairs/shared';

export const n2Pro = {
  slug: 'n2-pro',
  productSlug: 'roson-dxn2-pro',
  route: '/n2-pro',
  name: 'ROSON Elite Model N2 PRO',
  model: 'N2 Pro',
  lineName: 'Elite Model',
  family: 'N series',

  hero: {
    kicker: 'Built for heavy daily use',
    title: 'ROSON Elite Model N2 PRO',
    line: "The premium N series unit, with the series' widest dentist tray and a disinfectant water supply of its own.",
    stars: [
      'Rolight S light with hands-free infrared control',
      '180° rotatable ceramic spittoon, easy to clean',
      'Soft start and stop on a silent 24V motor',
    ],
    ctas: [CTA.visit, CTA.inquire],
    // One clean hero photograph: the old color section has a photo per color but no hex, so
    // the colors are listed by name under Comfort instead of as swatches.
    colorways: {
      label: 'Color',
      note: 'Shown in ROSON Blue. All seven unit colors are listed under Comfort.',
      initial: 'roson-blue',
      blend: true,
      options: [
        { key: 'roson-blue', name: 'ROSON Blue', src: `${N2P}/Unit Color Selection/Roson_Blue.jpg`, w: 1600, h: 1600 },
      ],
    },
  },

  // From the old spec sheet and products.js.
  glance: [
    { value: '650 × 315 mm', label: 'of dentist tray surface' },
    { value: '5', label: 'handpiece holder positions' },
    { value: '150 kg', label: 'maximum patient load' },
    { value: '2 years', label: 'warranty on the whole unit' },
  ],

  // products.js: tagline "Trusted by 80,000+ Dentists Worldwide", "ROSON's most-proven
  // dental chair", and "more dentists worldwide have chosen the N-series platform than any
  // other ROSON line". The stars come from the old page.
  proof: {
    kicker: 'Trusted worldwide',
    title: 'A chair dentists already trust',
    stat: '80,000+',
    statCaption: 'dentists worldwide trust this chair',
    line: 'It is the most proven chair ROSON makes, from the ROSON line dentists choose most.',
    stars: [
      'Six microbiological certifications on its disinfectant system',
      'Serviced locally from our Pasig service center',
      'Exclusive in the Philippines through DentaSource Direct',
    ],
  },

  // products.json n2-pro, the whoItIsFor beat.
  fit: {
    kicker: 'Who it suits',
    title: 'Rooms that run all day',
    line: 'For a practice where one operatory carries the schedule, and the tray, the water supply and the motor have to keep up.',
    segments: [
      'High volume general practices',
      'Clinics running one main operatory',
      'Practices replacing a worn N series unit',
    ],
  },

  features: {
    kicker: 'Features',
    title: 'Made for long, full days',
    line: 'What each part does for you and your patient, from the tray to the spittoon.',
    // The 2560 px detail shots run off their own frame, so they fill the tile (`cover`) and
    // stay blended onto the mat; the filter shot has its own grey ground.
    items: [
      {
        key: 'tray',
        title: 'Room for every instrument',
        line: '650 by 315 mm of tray, and five holder positions with scaler and micromotor pre-positions.',
        photo: { src: `${N2P}/Advanced features and components/Dentist_Table.jpg`, w: 2560, h: 1440, blend: true, fit: 'cover', alt: 'The N2 PRO dentist tray, its control keys and the handpiece holder below it' },
      },
      {
        key: 'water',
        title: 'Disinfectant never meets patient water',
        line: 'A separate supply cleans the waterlines without mixing chemicals into the patient circuit. Switches show which source is on.',
        photo: { src: `${N2P}/Advanced features and components/Water_Supply_System.jpg`, w: 2560, h: 1440, blend: true, fit: 'cover', alt: 'A water bottle and its ON/OFF switch under the N2 PRO unit box' },
      },
      {
        key: 'light',
        title: 'Light you control with a wave',
        line: 'Rolight S with Philips LEDs. An infrared sensor switches it on, off and through its levels, with no glove contact.',
        photo: { src: `${N2P}/Advanced features and components/Rolight_S_Dental_Light.webp`, w: 2560, h: 1440, blend: true, fit: 'cover', alt: 'The Rolight S dental light, its six LED beads and two handles' },
      },
      {
        key: 'spittoon',
        title: 'A ceramic bowl that turns',
        line: 'Swings 180°: out of the way as patients sit down, in close for rinses. Ceramic cleans easier than plastic.',
        photo: { src: `${N2P}/Advanced features and components/Rotatable_Spittoon.jpg`, w: 2560, h: 1440, blend: true, fit: 'cover', alt: 'The N2 PRO ceramic spittoon bowl and cup filler, seen from above' },
      },
      {
        key: 'warm',
        title: 'Warm water on both sides',
        line: 'Constant temperature warm water feeds the three-way syringe on the dentist side and the assistant side.',
        photo: { src: `${N2P}/Advanced features and components/Assistant_Table.jpg`, w: 2560, h: 1440, blend: true, fit: 'cover', alt: 'The N2 PRO assistant instrument holder and its control keys' },
      },
      {
        key: 'filter',
        title: 'A filter you lift out',
        line: 'The suction filter detaches for quick cleaning between patients.',
        photo: { src: `${N2P}/Advanced features and components/Detachable_Suction_Filter.jpg`, w: 1614, h: 1075, fit: 'cover', alt: 'Gloved hands holding the detached suction filter beside its housing' },
      },
    ],
    // products.js: "Delivery Options: Over-the-Patient, Cart-Mounted". Same framing for both.
    delivery: {
      kicker: 'Delivery options',
      title: 'Over the patient, or on a cart',
      line: 'Pick the delivery that fits your room and the way you work.',
      initial: 'over-patient',
      blend: true,
      options: [
        { key: 'over-patient', name: 'Over the patient', src: `${N2P}/Handpiece Placement Choices/Over_The_Patient.jpg`, w: 1600, h: 1600 },
        { key: 'cart', name: 'On a cart', src: `${N2P}/Handpiece Placement Choices/Cart_Mounted.jpg`, w: 1600, h: 1600 },
      ],
    },
    // Standard parts with no clean photograph of their own.
    extras: {
      title: 'Also built in',
      items: [
        { icon: 'water', title: 'Programmable cup filler', line: 'Cup filling and spittoon rinsing, both programmable.' },
        { icon: 'move', title: 'Three programmable positions', line: 'P1, P2 and P3, plus entry and working positions.' },
        { icon: 'headrest', title: 'Extending headrest', line: 'Reaches out up to 120 mm.' },
        { icon: 'foot', title: 'IPX4 foot control', line: 'Rated IPX4 for water ingress.' },
      ],
    },
  },

  comfort: {
    kicker: 'Comfort',
    title: 'Three upholsteries, seven colors',
    line: 'Seamless and sewn microfiber differ only in the seam. PU leather wipes clean easily. Any color pairs with any upholstery.',
    upholstery: [
      { name: 'Seamless microfiber', src: `${SHARED}/upholstery-seamless-microfiber.webp`, w: 1400, h: 1050, alt: 'Close-up of seamless microfiber leather in blue' },
      { name: 'Sewn microfiber', src: `${SHARED}/upholstery-sewn-microfiber.webp`, w: 1400, h: 1050, alt: 'Close-up of sewn microfiber leather in green, at a seam' },
      { name: 'PU leather', src: `${SHARED}/upholstery-pu-leather.webp`, w: 1400, h: 1050, alt: 'Close-up of blue PU leather and its grain' },
    ],
    // products.json n2-pro colors beat, with ROSON's FS codes. No hex in the sources.
    colors: {
      title: 'Unit colors',
      items: [
        { name: 'ROSON Blue (FS21)' },
        { name: 'Skyscraper Gray (FS19)' },
        { name: 'Mountain Blue (FS14)' },
        { name: 'Coloured Glaze Blue (FS02)' },
        { name: 'Begonia Red (FS04)' },
        { name: 'Hermes Orange (FS05)' },
        { name: 'Olive Green (FS06)' },
      ],
    },
  },

  // From the old /n2-pro spec sheet (n2proContent.js specGroups), ranges written with "to".
  specs: {
    kicker: 'Specifications',
    title: 'Every number on the sheet',
    line: 'Grouped the way your technician and your contractor will read them.',
    groups: [
      {
        label: 'Electrical',
        rows: [
          ['Input power', '720 VA max'],
          ['Voltage', '230 V AC ±10%, 50/60 Hz'],
          ['Rated current', '3.15 A at 230 V'],
          ['Fuse', 'Ø5×20 F6.3A H 250VAC'],
          ['Protection class', 'Class I, Type B applied parts'],
          ['Water protection', 'IPX0 main unit, IPX4 foot control'],
        ],
      },
      {
        label: 'Chair',
        rows: [
          ['Height range', '400 to 750 mm (±10 mm)'],
          ['Backrest range', '115° to 170°'],
          ['Headrest extension', '120 mm max'],
          ['Max patient load', '150 kg (ISO 7494-1)'],
          ['Motor', '24V DC silent, soft start and stop'],
          ['Motor duty', 'Max 2 min on, min 18 min off'],
          ['Programmed positions', 'P1, P2, P3, entry and exit (R), working (LP)'],
        ],
      },
      {
        label: 'Water',
        rows: [
          ['Water pressure', '0.2 to 0.4 MPa'],
          ['Water flow', '≥ 5 L/min'],
          ['Water hardness', 'Below 12° dH (below 2.14 mmol/L)'],
          ['pH', '6.5 to 8.5'],
          ['Warm water', '40 °C ±5 °C, constant'],
          ['Pure water bottles', '2 × 1 L (KLT-6220), 1 × 1 L (KLT-6210)'],
          ['Disinfectant supply', 'Independent, in the rear cabinet'],
        ],
      },
      {
        label: 'Air',
        rows: [
          ['Air pressure', '0.55 to 0.8 MPa'],
          ['Air flow', '≥ 90 L/min'],
          ['Air quality', 'Oil-free and dry, filter pore ≤ 50 µm'],
          ['Handpiece air output', '0 to 0.4 MPa (1 to 3.2 bar working range)'],
          ['Cooling water pressure', '0.2 MPa'],
        ],
      },
      {
        label: 'Workspace',
        rows: [
          ['Dentist tray', '650 × 315 mm'],
          ['Max tray load', '2.5 kg'],
          ['Handpiece holder', '5 positions, scaler and micromotor pre-positions'],
          ['Spittoon', 'Ceramic, rotates 180°'],
          ['Operating light', 'Rolight S, Philips LEDs, infrared hands-free'],
          ['Three-way syringe', 'Warm water, dentist and assistant sides'],
        ],
      },
      {
        label: 'Physical and environment',
        rows: [
          ['Net weight', 'About 230 kg (KLT-6220), about 180 kg (KLT-6210)'],
          ['Operating temperature', '5 °C to 40 °C'],
          ['Operating humidity', '30% to 85% RH'],
          ['Atmospheric pressure', '540 to 1060 hPa'],
          ['Storage temperature', '-40 °C to 70 °C'],
          ['Installation altitude', 'Up to 3,000 m above sea level'],
        ],
      },
    ],
    standards: [
      'IEC 60601-1:2005+A1:2012',
      'EN 60601-1:2006+A1:2013',
      'IEC 60601-1-2:2014 (EMC)',
      'EN 60601-1-2:2015 (EMC)',
      'IEC 60601-1-6:2010+A1:2013',
      'IEC 62366-1:2015',
      'EN ISO 7494-1:2018',
      'EN ISO 7494-2:2015',
      'ISO 9680:2014',
      'CE marked per Council Directive 93/42/EEC',
    ],
  },

  // No box list: the old page and the data files do not list what ships with the N2 Pro.

  // products.js roson-dxn2-pro specs only. The old page also listed a 3-year motor term and
  // its meta description a 5-year one; neither is in the data files.
  warranty: {
    kicker: 'Warranty',
    title: 'Covered for two years',
    line: 'One plain term that covers the whole dental unit.',
    rows: [
      { part: 'Dental unit', term: '2 years', note: 'Parts and service in year one, service in year two' },
    ],
  },

  door: {
    kicker: 'Pasig showroom',
    title: 'See it before you decide',
    line: 'The N2 Pro is on our showroom floor. Sit in it, run it through its full travel, and bring your operatory measurements.',
    ...SHOWROOM,
    photo: { src: `${N2P}/N2 Pro Dental Chair/1-1.jpg`, w: 1000, h: 1000, blend: true, alt: 'The N2 PRO from behind, with its light, dentist tray and assistant holder' },
    ctas: [CTA.visit, CTA.inquire, CTA.allChairs],
  },

  // How the N2 Pro appears on /dentalchairs.
  card: {
    line: 'The premium N series unit, made for a room that runs all day.',
    stars: [
      'Widest dentist tray in the N series',
      'Independent disinfectant water supply',
      '180° rotatable ceramic spittoon',
    ],
    photo: { src: `${N2P}/Unit Color Selection/Roson_Blue.jpg`, w: 1600, h: 1600, blend: true, alt: 'ROSON Elite Model N2 PRO in ROSON Blue' },
  },
};

export default n2Pro;
