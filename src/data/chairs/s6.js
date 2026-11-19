// src/data/chairs/s6.js: everything the S6 page says and shows, in one place.
//
// The shared chair template (src/components/chair/) renders this file and writes no copy of
// its own; src/data/chairs/a3.js explains the pattern.
//
// ☠️ EVERY FACT HERE HAS A SOURCE, AND NONE IS INVENTED. Facts come only from
// src/data/products.js (roson-dxs6), src/data/cinema/products.json (s6), and the old /s6 page
// and its legacy sections (src/components/s6/: feature grid, accessibility, ergonomics, spec,
// configurator, visual tour, box and warranty). Where two of those disagree, products.js wins.
//
// Left out on purpose, until the owner confirms:
//   - Motor warranty. The old warranty table says 3 years; products.js is silent.
//   - Seamless microfiber 5-year warranty. Only the old configurator says it; products.js is silent.
//   - "Built to last 15+ years" and "zero flex" (products.js advancedFeatures): durability
//     promises with no test behind them on the site.
//   - "20 mm below the industry standard" (products.js description): a claim about other
//     makers. The in-range claim (20 mm lower than any other ROSON chair) is used instead.
//   - "Musculoskeletal disorders are the #1 cause of disability in dentistry" and the stool's
//     "prevents femoral artery blockage" (old ergonomics section): unsourced medical claims.
//   - "Resists fading and chemical wear" (old configurator, said of every color).
//
// House rules for the words: a headline is 7 words or fewer, the line under it 24 or fewer,
// `stars` 9 words or fewer each, no em or en dashes, no prices, no "#1", no competitor names,
// Pasig showroom (never Manila).
//
// Photos: ROSON studio shots already in public/images/products/s6/, looked at one by one, plus
// the baked index shot public/images/chairs/index/s6-cart.webp. Delivery labels follow the A3
// page: upright handpieces = over the patient (S6_4), hanging tubes = swing mounted (S6_1). The
// old configurator had these two swapped. Excluded on purpose: cart.png (a cutout with stray
// fragments and a tighter frame than S6_1 and S6_4; the cleaned s6-cart.webp is used instead),
// hanging.jpg and continental.jpg (byte copies of S6_3 and S6_4), S6_3 (a different angle from
// the other delivery shots), 05_optimized_space.jpg (the old page called it a stool; it is the
// patient seat), and the 768 px "Upholstery Selection" close-ups (the shared close-ups are used).

import { SHOWROOM, CTA } from './shared';

const S6 = '/images/products/s6';
const COLORS = `${S6}/Unit Color Selection`;
const TOUR = `${S6}/S6 Dental Chair`;
const PARTS = `${S6}/Advanced features and components`;
const SHARED = '/images/chairs/shared';
const CART = '/images/chairs/index/s6-cart.webp';

export const s6 = {
  slug: 's6',
  productSlug: 'roson-dxs6',
  route: '/s6',
  name: 'ROSON Professional Model S6',
  model: 'S6',
  lineName: 'Professional Model',
  family: 'S series',

  hero: {
    kicker: 'The chair that goes lower',
    title: 'ROSON Professional Model S6',
    line: 'It starts lower than any other ROSON chair, so getting patients seated is easier, from children to wheelchair users.',
    stars: [
      'Casting steel frame and backrest support',
      'Whisper-Silent 24 V DC motor, soft start and stop',
      'Free ocular visit, then our own technicians install it',
    ],
    ctas: [CTA.visit, CTA.inquire],
    // One studio shot per color, same framing, white ground. Hexes from the old configurator.
    // Swatch dots are sampled from the upholstery in each photograph (2026-11-19), because the
    // legacy configurator hexes did not match the chairs they sat beside.
    colorways: {
      label: 'Color',
      note: 'The chair in each of its seven colors. Tap one.',
      initial: 'bordeaux',
      blend: true,
      options: [
        { key: 'bordeaux', name: 'Bordeaux', swatch: '#a6151c', src: `${COLORS}/HX001-78_Bordeaux.webp`, w: 2560, h: 1876 },
        { key: 'light-blue', name: 'Light Blue', swatch: '#1a4b86', src: `${COLORS}/HX001-51_Light_blue.webp`, w: 2560, h: 1876 },
        { key: 'orange', name: 'Orange', swatch: '#a83714', src: `${COLORS}/HX001-12_Orange.webp`, w: 2560, h: 1876 },
        { key: 'ivory', name: 'Ivory', swatch: '#979797', src: `${COLORS}/HX001-31_Ivory.webp`, w: 2560, h: 1876 },
        { key: 'brown', name: 'Brown', swatch: '#89584a', src: `${COLORS}/HX001-97_Brown.webp`, w: 2560, h: 1876 },
        { key: 'apple-green', name: 'Apple Green', swatch: '#989736', src: `${COLORS}/HX012-43_Apple_Green_1.webp`, w: 2560, h: 1876 },
        { key: 'green', name: 'Green', swatch: '#01673b', src: `${COLORS}/HX012-54_Green_2.webp`, w: 2560, h: 1876 },
      ],
    },
  },

  // From the old spec sheet, products.js specs (delivery options) and the warranty below.
  glance: [
    { value: '380 to 750 mm', label: 'chair height range' },
    { value: '150 kg', label: 'maximum patient load' },
    { value: '3', label: 'delivery systems to choose from' },
    { value: '2 years', label: 'warranty on the whole unit' },
  ],

  // products.js 'Lowest Position', the old accessibility section.
  proof: {
    kicker: 'Accessibility',
    title: 'Easier in, easier out',
    stat: '380 mm',
    statCaption: 'lowest chair position',
    line: 'Starting this low, the chair meets patients where they are instead of asking them to climb up.',
    stars: [
      'Wheelchair transfers without awkward lifting',
      'Children climb on and off without being lifted',
      'Elderly patients sit down with confidence',
    ],
  },

  // products.json s6, the whoItIsFor beat.
  fit: {
    kicker: 'Who it suits',
    title: 'Where getting seated is the hard part',
    line: 'If many of your patients are elderly or young, or your operatory is tight, start your shortlist here.',
    segments: [
      'Clinics with elderly and mobility-limited patients',
      'Pediatric rooms',
      'Four-handed practices in a compact operatory',
    ],
  },

  features: {
    kicker: 'Features',
    title: 'Built for both sides of the chair',
    line: "Each part earns its place in your working day, on your side and your assistant's.",
    items: [
      {
        key: 'light',
        title: 'Light you switch without touching',
        line: 'Rolight S with Philips LEDs. Infrared control turns it on and off, with no contact between patients.',
        photo: { src: `${PARTS}/01_light.webp`, w: 2560, h: 1440, blend: true, alt: 'The Rolight S dental light head, six LED lamps behind a clear cover, with two side handles' },
      },
      {
        key: 'frame',
        title: 'Cast steel where it carries weight',
        line: 'The chair frame and backrest support are casting steel, built for patients up to 150 kg.',
        photo: { src: `${PARTS}/07_chair_frame.jpg`, w: 1614, h: 1075, blend: true, alt: 'The S6 backrest and headrest from the front in red upholstery, with both armrests' },
      },
      {
        key: 'assistant',
        title: 'Room for four-handed work',
        line: 'The compact assistant unit, built for four-handed dentistry, puts what your assistant needs close at hand.',
        photo: { src: `${PARTS}/03_four_hand.jpg`, w: 1614, h: 1075, blend: true, alt: 'The S6 assistant unit with its control panel, three-way syringe and suction holders' },
      },
      {
        key: 'foot',
        title: 'Position the chair hands free',
        line: 'The 4-way foot control sets height and tilt, with a non-skid design and buttons for water and rinsing.',
        photo: { src: `${PARTS}/04_foot_control.jpg`, w: 1614, h: 1075, blend: true, alt: 'The grey 4-way foot control, with its joystick and two push buttons' },
      },
      {
        key: 'headrest',
        title: 'A headrest that stays put',
        line: "The multi-joint headrest sets to any patient's height with one hand, then holds steady.",
        photo: { src: `${PARTS}/06_headrest.jpg`, w: 1614, h: 1075, blend: true, alt: 'The S6 headrest in red, with faded outlines showing how far it adjusts' },
      },
      {
        key: 'tray',
        title: 'Instruments close, fewer touchpoints',
        line: 'The compact layout keeps every instrument within natural reach, with fewer touchpoints for cross-contamination.',
        photo: { src: `${PARTS}/02_compact.jpg`, w: 1614, h: 1075, blend: true, alt: "The S6 dentist's tray with handpieces and control keys, a gloved hand lifting its silicone mat" },
      },
    ],
    // Same framing for both, white ground. The third system, the mobile cart, has no photo at
    // this framing; it is shown in the showroom photo at the foot of the page.
    delivery: {
      kicker: 'Delivery',
      title: 'Over the patient, or swing mounted',
      line: 'Pick the delivery that suits how you work. A mobile cart is the third choice.',
      initial: 'swing-mounted',
      blend: true,
      options: [
        { key: 'over-patient', name: 'Over the patient', src: `${TOUR}/S6_4.jpg`, w: 640, h: 640 },
        { key: 'swing-mounted', name: 'Swing mounted', src: `${TOUR}/S6_1.jpg`, w: 640, h: 640 },
      ],
    },
  },

  comfort: {
    kicker: 'Comfort',
    title: 'Choose what patients sit on',
    line: 'PU leather is durable and easy to clean. Sewn microfiber adds stitching. Seamless microfiber has no seams, for better infection control.',
    upholstery: [
      { name: 'PU leather', src: `${SHARED}/upholstery-pu-leather.webp`, w: 1400, h: 1050, alt: 'Close-up of PU leather upholstery' },
      { name: 'Sewn microfiber', src: `${SHARED}/upholstery-sewn-microfiber.webp`, w: 1400, h: 1050, alt: 'Close-up of sewn microfiber leather and its seam' },
      { name: 'Seamless microfiber', src: `${SHARED}/upholstery-seamless-microfiber.webp`, w: 1400, h: 1050, alt: 'Close-up of seamless microfiber leather' },
    ],
    // The old box and ergonomics sections. products.js is silent on the S6 stool.
    stool: {
      title: 'The 6-way stool comes included',
      stars: [
        'Six-way adjustable to suit different body types',
        'Keeps your spine in its natural curve',
        '360° silent casters on an aluminum alloy base',
      ],
    },
  },

  // From the old /s6 spec section, ranges written out with "to"; motor, upholstery, delivery
  // and origin from products.js specs.
  specs: {
    kicker: 'Specifications',
    title: 'Every number your technician asks for',
    line: "Power, water and air requirements, plus the chair's travel, grouped the way a technician reads them.",
    groups: [
      {
        label: 'Electrical',
        rows: [
          ['Model', 'S6'],
          ['Input power', '720 VA max'],
          ['Voltage', '230 V AC ±10%, 50/60 Hz'],
          ['Protection class', 'Class I, Type B applied parts'],
          ['Water protection', 'IPX0 main unit, IPX4 foot control'],
        ],
      },
      {
        label: 'Chair',
        rows: [
          ['Height range', '380 to 750 mm (±10 mm)'],
          ['Backrest range', '115° to 170°'],
          ['Max patient load', '150 kg (ISO 7494-1)'],
          ['Motor', 'Whisper-Silent 24 V DC, soft start and stop'],
          ['Frame', 'Casting steel chair frame and backrest support'],
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
          ['Operating light', 'Rolight S, Philips LEDs, infrared control'],
          ['Foot control', '4-way, hands free'],
        ],
      },
      {
        label: 'Build',
        rows: [
          ['Upholstery', 'PU or microfiber leather'],
          ['Delivery', 'Over the patient, swing mounted, cart mounted'],
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
    title: 'Everything you need on day one',
    line: 'Ten parts arrive together, the 6-way dentist stool among them.',
    items: [
      { icon: 'unit', title: 'Dental unit', line: 'The chair on its casting steel frame base' },
      { icon: 'light', title: 'Rolight S operating light', line: 'Philips LEDs with infrared control' },
      { icon: 'bowl', title: 'Swiveling cuspidor bowl', line: 'With integrated flushing' },
      { icon: 'foot', title: '4-way foot control', line: 'IPX4 rated, a free upgrade on every unit' },
      { icon: 'headrest', title: 'Multi-joint headrest', line: 'Positions with one hand' },
      { icon: 'seat', title: 'Backrest and seat', line: 'In the upholstery color you choose' },
      { icon: 'stool', title: '6-way dentist stool', line: 'Gas spring, casters and backrest', tag: 'Included' },
      { icon: 'syringe', title: 'Three-way syringe and suction', line: 'Stainless steel syringe, strong and weak suction' },
      { icon: 'tube', title: 'Handpiece tubing', line: 'Stainless steel spiral, short tube' },
      { icon: 'docs', title: 'Documents and kit', line: 'Manual, quality certificate, warranty card, accessories' },
    ],
  },

  // products.js roson-dxs6 specs only. The old table's 3-year motor term stays off until the
  // owner confirms it.
  warranty: {
    kicker: 'Warranty',
    title: 'Two years, in plain terms',
    line: 'One warranty covers the whole S6 unit, split clearly between parts and service.',
    rows: [
      { part: 'Dental unit', term: '2 years', note: 'Parts and service in year one, service in year two' },
    ],
  },

  door: {
    kicker: 'Pasig showroom',
    title: 'See how low it goes',
    line: 'The S6 is on our showroom floor. Lower it all the way, sit in it, and bring your measurements.',
    ...SHOWROOM,
    photo: { src: CART, w: 1800, h: 1441, alt: 'The S6 in red with its Rolight S light and a mobile delivery cart' },
    ctas: [CTA.visit, CTA.inquire, CTA.allChairs],
  },

  // How the S6 appears on /dentalchairs.
  card: {
    line: 'Drops to 380 mm, the lowest in the ROSON range, for easier transfers. Built on a casting steel frame.',
    stars: [
      '380 mm lowest chair position',
      'Rolight S light with infrared control',
      '4-way hands-free foot control',
    ],
    photo: { src: CART, w: 1800, h: 1441, alt: 'ROSON Professional Model S6 with its mobile delivery cart' },
  },
};

export default s6;
