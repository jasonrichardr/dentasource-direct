// src/data/chairs/s3.js: everything the S3 page says and shows, in one place.
//
// Rendered by the shared chair template (src/components/chair/), shaped like a3.js.
//
// ☠️ EVERY FACT HERE HAS A SOURCE, AND NONE IS INVENTED. Sources: src/data/products.js
// (roson-dxs3), src/data/cinema/products.json (s3: forms, whoItIsFor, features, colors, door),
// and the legacy /s3 components in src/components/s3/ (feature grid, light section,
// ergonomics, tech specs, configurator, visual tour, what's in the box, warranty table).
// Where two sources differ, products.js wins: the delivery options are named as products.js
// names them (the legacy configurator called the swing mounted shot "Standard").
//
// Left out on purpose:
// - Warranty terms that are only in the legacy table or configurator (3-year Whisper-Silent
//   Motor, 5-year seamless microfiber). products.js states 2 years: parts and service in year
//   one, service in year two. Nothing else goes on the warranty card until the owner confirms.
// - "Global bestseller" wording (the house rules bar "best"), "brightest light in the lineup"
//   (no other chair in the data states a lux figure to check it against), and the legacy
//   "twice the price", "most chairs don't offer", "#1 cause of disability" and "8+ hour
//   clinical days" lines.
// - Claims found only in the markdown notes under public/images/products/s3/ (color LCD,
//   KLT-6220 model code, cup filler buttons on the foot control, slide-mouth stool fitting):
//   those notes are not a fact source for this page.
//
// Photos: the seven ROSON white-ground color shots (Unit Color Selection, 2560 px, same
// framing) for the hero, and the ROSON detail shots in /images/products/s3/, looked at one by
// one. Excluded: 06_cushion.jpg and S3_5.jpg (63 cm and 8 cm dimension callouts printed on the
// photo), the sunlit scene in products.js images (a generated room, not a photograph),
// 02_compact.jpg as the light handle (the legacy grid paired it with the handle; it shows the
// doctor's table, so it is used for that), the 640 px duplicates of the detail shots
// (S3_3, S3_4, S3_6, 1-1, 2-2), and the showroom photo in the products.json door beat
// (a staff member's face fills it).
//
// House rules for the words: headline 7 words or fewer, line 24 or fewer, stars 9 or fewer,
// no em or en dashes, no prices, no "#1" or "best", no competitor names, Pasig (never Manila).

import { SHOWROOM, CTA } from './shared';

const S3 = '/images/products/s3';
const COLORS = `${S3}/Unit Color Selection`;
const DETAIL = `${S3}/Advanced features and components`;
const DELIVERY = `${S3}/Handpiece Placement Choices`;
const SHARED = '/images/chairs/shared';

export const s3 = {
  slug: 's3',
  productSlug: 'roson-dxs3',
  route: '/s3',
  name: 'ROSON Hot-Selling Model S3',
  model: 'S3',
  lineName: 'Hot-Selling Model',
  family: 'S series',

  hero: {
    kicker: 'ROSON’s most popular chair worldwide',
    // A non-breaking hyphen (U+2011), so the h1 never breaks after "Hot-".
    title: 'ROSON Hot\u2011Selling Model S3',
    line: 'Built around cleaning. The light handle goes in the autoclave, and the spittoon bowl and suction filter come off without tools.',
    stars: [
      'LED sensor light at 35,000 lux or more',
      '6-way adjustable dentist stool comes included',
      'Free ocular visit, then our own technicians install it',
    ],
    ctas: [CTA.visit, CTA.inquire],
    // Swatch hexes are the legacy configurator's. Its order, so Light Blue opens.
    // Swatch dots are sampled from the upholstery in each photograph (2026-11-19), because the
    // legacy configurator hexes did not match the chairs they sat beside.
    colorways: {
      label: 'Color',
      note: 'Seven colors, shown on the chair. Tap one.',
      initial: 'light-blue',
      blend: true,
      options: [
        { key: 'light-blue', name: 'Light Blue', swatch: '#1a4b86', src: `${COLORS}/HX001-51_Light_blue.webp`, w: 2560, h: 1876 },
        { key: 'orange', name: 'Orange', swatch: '#a83714', src: `${COLORS}/HX001-12_Orange.webp`, w: 2560, h: 1876 },
        { key: 'ivory', name: 'Ivory', swatch: '#979797', src: `${COLORS}/HX001-31_Ivory.webp`, w: 2560, h: 1876 },
        { key: 'bordeaux', name: 'Bordeaux', swatch: '#a6151c', src: `${COLORS}/HX001-78_Bordeaux.webp`, w: 2560, h: 1876 },
        { key: 'brown', name: 'Brown', swatch: '#89584a', src: `${COLORS}/HX001-97_Brown.webp`, w: 2560, h: 1876 },
        { key: 'apple-green', name: 'Apple Green', swatch: '#989736', src: `${COLORS}/HX012-43_Apple_Green.webp`, w: 2560, h: 1876 },
        { key: 'green', name: 'Green', swatch: '#01673b', src: `${COLORS}/HX012-54_Green.webp`, w: 2560, h: 1876 },
      ],
    },
  },

  // The four figures a buyer asks for first. All from the spec sheet and the warranty below.
  glance: [
    { value: '400 to 750 mm', label: 'chair height range' },
    { value: '115° to 170°', label: 'backrest range' },
    { value: '150 kg', label: 'maximum patient load' },
    { value: '2 years', label: 'warranty on the whole unit' },
  ],

  // The one number the old page built a whole section around (products.js light spec).
  proof: {
    kicker: 'LED sensor light',
    title: 'Bright light without a touch',
    stat: '35,000',
    statCaption: 'lux or more at the operating light',
    line: 'Wave near the sensor to switch the light on or off, so nothing on it needs touching between patients.',
    stars: [
      'Stepless control for the intensity you want',
      'Multi-angle rotating arm for each treatment angle',
    ],
  },

  // products.json s3, the whoItIsFor beat.
  fit: {
    kicker: 'Who it suits',
    title: 'Clinics with a full appointment book',
    line: 'For practices seeing 20 or more patients a day, where the parts that touch a patient must come apart quickly.',
    segments: [
      'High-volume general practices',
      'Clinics with strict infection control routines',
      'Practices replacing a first chair',
    ],
  },

  features: {
    kicker: 'Features',
    title: 'Quick to clean, easy to work',
    line: 'What each part does for you between patients and across a full day.',
    items: [
      {
        key: 'handle',
        title: 'The light handle goes in the autoclave',
        line: 'Take the handle off, sterilize it at 134°C and refit it before the next patient.',
        photo: { src: `${DETAIL}/01_light.webp`, w: 2560, h: 1440, blend: true, fit: 'cover', alt: 'The S3 LED sensor light on its arm, with a handle on each side' },
      },
      {
        key: 'spittoon',
        title: 'The spittoon bowl lifts out',
        line: 'It swivels toward your patient and detaches without tools for a thorough clean.',
        photo: { src: `${DETAIL}/03_spittoon.jpg`, w: 1614, h: 1075, blend: true, fit: 'cover', alt: 'Gloved hands lifting the spittoon bowl off the S3 cuspidor' },
      },
      {
        key: 'filter',
        title: 'A suction filter you can sterilize',
        line: 'Its filter net stops bacteria building up, and it pulls out by hand for routine sterilization.',
        photo: { src: `${DETAIL}/04_filter.jpg`, w: 1614, h: 1075, fit: 'cover', alt: 'A gloved hand holding the S3 suction filter beside its open port' },
      },
      {
        key: 'table',
        title: 'Instruments close, touchpoints few',
        line: 'A clean workflow layout keeps instruments within easy reach and cross-contamination touchpoints to a minimum.',
        photo: { src: `${DETAIL}/02_compact.jpg`, w: 1614, h: 1075, blend: true, fit: 'cover', alt: 'The S3 doctor’s table with its control panel and handpiece holders' },
      },
      {
        key: 'foot',
        title: 'Your feet move the chair',
        line: '4-way hands-free control sets height and tilt, on a non-skid base that stays put.',
        photo: { src: `${DETAIL}/05_foot_control.jpg`, w: 1614, h: 1075, blend: true, fit: 'cover', alt: 'The S3 4-way foot control with its joystick and two buttons' },
      },
      {
        key: 'headrest',
        title: 'One hand sets the headrest',
        line: 'The multi-articulated headrest holds steady, safe for children and patients with limited mobility.',
        photo: { src: `${DETAIL}/08_headrest.jpg`, w: 1614, h: 1075, blend: true, fit: 'cover', alt: 'The S3 multi-articulated headrest, shown in two positions' },
      },
      // No clean photograph: the cushion shots carry printed dimension callouts.
      {
        key: 'elbow',
        title: 'A wide elbow support cushion',
        line: 'It eases upper body fatigue through long procedures.',
      },
    ],
    // Same framing for all three, so switching reads as one chair changing its delivery.
    delivery: {
      kicker: 'Delivery',
      title: 'Three ways to deliver instruments',
      line: 'Swing mounted, over the patient, or on a mobile cart you can reposition, to match your workflow.',
      initial: 'swing-mounted',
      blend: true,
      options: [
        { key: 'swing-mounted', name: 'Swing mounted', src: `${DELIVERY}/Standard.jpg`, w: 640, h: 640 },
        { key: 'over-patient', name: 'Over the patient', src: `${DELIVERY}/top.jpg`, w: 640, h: 640 },
        { key: 'cart', name: 'On a cart', src: `${DELIVERY}/cart.jpg`, w: 640, h: 640 },
      ],
    },
  },

  comfort: {
    kicker: 'Comfort',
    title: 'Three upholsteries, seven colors',
    line: 'PU leather is standard and easy to clean. Seamless microfiber has no seams, which helps infection control.',
    upholstery: [
      { name: 'PU leather', src: `${SHARED}/upholstery-pu-leather.webp`, w: 1400, h: 1050, alt: 'Close-up of PU leather upholstery' },
      { name: 'Sewn microfiber', src: `${SHARED}/upholstery-sewn-microfiber.webp`, w: 1400, h: 1050, alt: 'Close-up of sewn microfiber leather and its seam' },
      { name: 'Seamless microfiber', src: `${SHARED}/upholstery-seamless-microfiber.webp`, w: 1400, h: 1050, alt: 'Close-up of seamless microfiber leather' },
    ],
    stool: {
      title: 'The 6-way stool comes included',
      stars: [
        'Six-way adjustment fits your back and hips',
        'Keeps your spine in its natural curve',
        '360° silent casters on an aluminum alloy base',
      ],
    },
  },

  // From the old /s3 spec section and the products.js spec list, ranges written out with "to".
  specs: {
    kicker: 'Specifications',
    title: 'Every figure your technician needs',
    line: 'Grouped the way a technician reads a spec sheet, with every range written out.',
    groups: [
      {
        label: 'Electrical',
        rows: [
          ['Model', 'S3'],
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
          ['Motor', '24V DC silent electric motor'],
        ],
      },
      {
        label: 'Water',
        rows: [
          ['Water pressure', '0.2 to 0.4 MPa'],
          ['Water flow', '≥ 5 L/min'],
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
          ['Operating light', 'LED sensor light, ≥ 35,000 lux, autoclavable handle'],
          ['Foot control', '4-way, hands-free'],
          ['Spittoon', 'Detachable, swiveling bowl'],
        ],
      },
      {
        label: 'Build',
        rows: [
          ['Upholstery', 'PU or microfiber leather'],
          ['Delivery options', 'Over the patient, swing mounted, cart mounted'],
          ['Dentist stool', '6-way adjustable, included'],
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
    title: 'Ten parts, one delivery',
    line: 'The 6-way dentist stool and the upgraded foot control arrive with the chair.',
    items: [
      { icon: 'unit', title: 'Dental unit', line: 'The chair and its base' },
      { icon: 'light', title: 'LED sensor operating light', line: '35,000 lux or more, autoclavable handle' },
      { icon: 'bowl', title: 'Detachable swiveling spittoon', line: 'Comes off without tools for cleaning' },
      { icon: 'foot', title: 'Upgraded 4-way foot control', line: 'IPX4 rated, a free upgrade on every unit' },
      { icon: 'headrest', title: 'Multi-articulated headrest', line: 'One-handed positioning' },
      { icon: 'seat', title: 'Backrest and seat', line: 'In the upholstery color you choose' },
      { icon: 'stool', title: '6-way adjustable dentist stool', line: 'Gas spring, casters and backrest', tag: 'Included' },
      { icon: 'syringe', title: 'Three-way syringe and suction', line: 'Stainless steel syringe, strong and weak suction' },
      { icon: 'tube', title: 'Handpiece tubing', line: 'Stainless steel spiral, short tube' },
      { icon: 'docs', title: 'Documents and kit', line: 'Manual, quality certificate, warranty card, accessories' },
    ],
  },

  // products.js roson-dxs3 specs only. The legacy table also listed a 3-year motor term and the
  // configurator a 5-year seamless microfiber term; neither is in products.js, so both stay off
  // until the owner confirms them.
  warranty: {
    kicker: 'Warranty',
    title: 'Covered for two years',
    line: 'One term on the whole unit, written on the warranty card in the box.',
    rows: [
      { part: 'Dental unit', term: '2 years', note: 'Parts and service in year one, service in year two' },
    ],
  },

  door: {
    kicker: 'Pasig showroom',
    title: 'See it before you decide',
    line: 'The S3 is on our showroom floor. Run it through its full travel and bring your operatory measurements.',
    ...SHOWROOM,
    ctas: [CTA.visit, CTA.inquire, CTA.allChairs],
  },

  // How the S3 appears on /dentalchairs.
  card: {
    line: 'Made for a full appointment book. The parts that touch a patient come off for cleaning.',
    stars: [
      'Autoclavable light handle',
      'Detachable spittoon, no tools needed',
      'LED sensor light at 35,000 lux or more',
    ],
    photo: { src: `${COLORS}/HX001-51_Light_blue.webp`, w: 2560, h: 1876, blend: true, alt: 'The ROSON Hot-Selling Model S3 chair in Light Blue' },
  },
};

export default s3;
