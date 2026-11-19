// src/data/chairs/s9.js: everything the S9 page says and shows, in one place.
//
// The shared chair template (src/components/chair/) renders this file and writes no copy of
// its own; src/data/chairs/a3.js explains the pattern.
//
// ☠️ EVERY FACT HERE HAS A SOURCE, AND NONE IS INVENTED. Facts come only from
// src/data/products.js (roson-s9), src/data/cinema/products.json (s9), and the old /s9 page
// and its legacy sections (src/components/s9/: feature grid, disinfection, ergonomics, spec,
// configurator, visual tour, box and warranty). Where two of those disagree, products.js wins.
//
// Left out on purpose, until the owner confirms:
//   - Motor warranty. The old spec and warranty table say 3 years; products.js is silent.
//   - Orange, Tiffany Blue and Jewel Green. The old configurator and products.json list seven
//     colors (and call Jewel Green S9 only); products.js lists five, so the five stand.
//   - "Below the flagship" positioning (products.json) against products.js badge 'Flagship'.
//     Neither claim is made here.
//   - The old stool was "6-way adjustable"; products.js names the RS06 as eight-way. RS06 used.
//   - Swatch hexes: products.js and the old configurator disagree; products.js values used.
//   - The six lab test names on the old disinfection section (no test reports shown here).
//
// House rules for the words: a headline is 7 words or fewer, the line under it 24 or fewer,
// `stars` 9 words or fewer each, no em or en dashes, no prices, no "#1", no competitor names,
// Pasig showroom (never Manila).
//
// Photos: ROSON studio shots already in public/images/products/s9/, looked at one by one.
// Excluded on purpose: the six microbiological report scans (041 to 046), the installation
// drawing (048), the stool posture diagram (047), two shots of a different chair model (049,
// 050), the "Upholstery Selection" close-ups (their source names them N2 PRO; the shared
// upholstery close-ups are used instead), the composite with a figure on the stool (17.jpg),
// and the duplicate copies of the same frames under other file names.

import { SHOWROOM, CTA } from './shared';

const S9 = '/images/products/s9';
const COLORS = `${S9}/Unit Color Selection`;
const TOUR = `${S9}/S9 Dental Chair`;
const SHARED = '/images/chairs/shared';

export const s9 = {
  slug: 's9',
  productSlug: 'roson-s9',
  route: '/s9',
  name: 'ROSON Affordable Luxury Model S9',
  model: 'S9',
  lineName: 'Affordable Luxury Model',
  family: 'S series',

  hero: {
    kicker: 'Waterline disinfection, built in',
    title: 'ROSON Affordable Luxury Model S9',
    line: 'Disinfected waterlines, controls angled to your hand and one key cleanup at closing. The parts a clinic uses every day, built in.',
    stars: [
      'EOW-TECH disinfection eliminates 99.9999% of bacteria',
      '45° operation panel with three memory positions',
      'Free ocular visit, then our own technicians install it',
    ],
    ctas: [CTA.visit, CTA.inquire],
    // Four of the five products.js colors have a studio photo at the same framing. All five
    // are listed under comfort.colors.
    // Swatch dots are sampled from the upholstery in each photograph (2026-11-19), because the
    // legacy configurator hexes did not match the chairs they sat beside.
    colorways: {
      label: 'Color',
      note: 'Studio photos from ROSON. Tap a color.',
      initial: 'begonia-red',
      blend: true,
      options: [
        { key: 'begonia-red', name: 'Begonia Red', swatch: '#a9555a', src: `${COLORS}/Begonia-red.webp`, w: 2560, h: 2008 },
        { key: 'coloured-glaze-blue', name: 'Coloured Glaze Blue', swatch: '#3785e3', src: `${COLORS}/Coloured-glaze-blue.webp`, w: 2560, h: 2008 },
        { key: 'gray', name: 'Gray', swatch: '#7c8389', src: `${COLORS}/Gray.webp`, w: 2560, h: 2008 },
        { key: 'olive-green', name: 'Olive Green', swatch: '#cbc357', src: `${COLORS}/Olive-green.webp`, w: 2560, h: 2008 },
      ],
    },
  },

  // The four figures a buyer asks for first. From the old spec section and products.js.
  glance: [
    { value: '45°', label: 'angle of the operation panel' },
    { value: '400 to 750 mm', label: 'seat height range' },
    { value: '150 kg', label: 'maximum patient load' },
    { value: '2 years', label: 'warranty on the whole unit' },
  ],

  // products.js disinfectionDeepDive and the old disinfection section.
  proof: {
    kicker: 'EOW-TECH disinfection',
    title: 'Waterlines kept clean while you work',
    stat: '99.9999%',
    statCaption: 'of bacteria eliminated',
    line: 'Electrolyzed oxidizing water disinfects the lines without harsh chemicals. Water is the only by-product, gentle for patients.',
    stars: [
      'Inhibits biofilm in the SMC pipelines',
      'Adapts to your local water conditions',
      'No free chlorine ions, so metal parts last',
    ],
  },

  // products.json s9, the whoItIsFor beat.
  fit: {
    kicker: 'Who it suits',
    title: 'For the room you use most',
    line: 'For clinics that want active waterline disinfection and one key drainage in the room, from day one.',
    segments: [
      'Growing practices upgrading a main room',
      'Clinics adding a second high specification operatory',
      'Buyers choosing between the S9 and the A3',
    ],
  },

  features: {
    kicker: 'Features',
    title: 'What it does for your day',
    line: 'The parts you and your assistant touch every day, and what each one does for you.',
    // ROSON's detail shots run off their own frame (an arm off the top, tubing off the bottom,
    // the headrest and the tissue box arm off the right), so those four fill their tile
    // (`fit: 'cover'`) and the frame edge lands on the tile edge. The headrest and the tissue
    // box sit in the two narrower tiles (2 and 3), where cover only trims the sides.
    items: [
      {
        key: 'panel',
        title: 'Controls at a 45° angle',
        line: 'The angled panel sits at your hand, with three memory positions, P1 to P3, for your usual setups.',
        photo: { src: `${S9}/s9-front.jpg`, w: 1614, h: 1075, blend: true, fit: 'cover', alt: 'The S9 doctor tray, its instrument holders and the keypad with P1, P2 and P3 memory keys' },
      },
      {
        key: 'headrest',
        title: 'A headrest for every patient',
        line: 'Multi-articulated joints let you set the headrest for each patient, whatever their size.',
        photo: { src: `${S9}/s9-angle2.jpg`, w: 1614, h: 1075, blend: true, fit: 'cover', alt: 'The S9 headrest and its articulated joint, shown in more than one position' },
      },
      {
        key: 'tissue',
        title: 'A tidy room, built in',
        line: 'The 5-in-1 tissue box has dual-layer storage in impact-resistant material, and fits with a slide-mouth design.',
        photo: { src: `${S9}/s9-angle3.jpg`, w: 1614, h: 1075, blend: true, fit: 'cover', alt: 'The 5-in-1 tissue box mounted on the S9 post, with a lidded cup holder beside it' },
      },
      {
        key: 'assistant',
        title: 'Your assistant has room to work',
        line: 'A compact module keeps suction, syringe and controls within your assistant\'s reach, made for four-handed dentistry.',
        photo: { src: `${S9}/s9-side.jpg`, w: 1614, h: 1075, blend: true, fit: 'cover', alt: 'The S9 assistant module with its touch keypad, a three-way syringe and two suction holders' },
      },
      {
        key: 'light',
        title: 'Light across the whole mouth',
        line: 'The 8-Tooth Smile oral light uses Philips LEDs for broad, daylight quality light that eases eye strain.',
        photo: { src: `${S9}/s9-rear.jpg`, w: 1614, h: 1075, blend: true, alt: 'The S9 oral light, its eight LEDs and two handles' },
      },
      {
        // No clean photograph of the drainage key; a text tile.
        key: 'drain',
        title: 'Cleanup in one press',
        line: 'Press one key at closing. The chair rises to its highest position and flushes the spittoon for 5 minutes.',
      },
    ],
    // Same camera and framing for all three, from the old visual tour.
    delivery: {
      kicker: 'Delivery',
      title: 'Three ways to hold your instruments',
      line: 'Over the patient, swing mounted for left or right hands, or on a mobile cart you can reposition.',
      initial: 'over-patient',
      blend: true,
      options: [
        { key: 'over-patient', name: 'Over the patient', src: `${S9}/main.jpg`, w: 640, h: 640 },
        { key: 'swing-mounted', name: 'Swing mounted', src: `${TOUR}/img01.jpg`, w: 640, h: 640 },
        { key: 'cart', name: 'On a cart', src: `${TOUR}/1-3.jpg`, w: 640, h: 640 },
      ],
    },
    // Standard parts with no clean photograph of their own.
    extras: {
      title: 'Also built in',
      items: [
        { icon: 'shield', title: 'Anti-collision backrest', line: 'Stops at once if it meets an obstacle.' },
        { icon: 'motor', title: 'Whisper-Silent Motor', line: 'Soft start and stop keeps every move smooth and quiet.' },
        { icon: 'screen', title: 'Medical-grade color LCD', line: 'Run the whole unit from one touchscreen.' },
        { icon: 'foot', title: 'Four-way foot control', line: 'IPX4 rated, a free upgrade on every unit.' },
      ],
    },
  },

  comfort: {
    kicker: 'Comfort',
    title: 'Soft, breathable, easy to clean',
    line: 'Three upholstery choices. Breathable seamless microfiber is easy to sanitize and carries a 5-year warranty.',
    upholstery: [
      { name: 'PU leather', src: `${SHARED}/upholstery-pu-leather.webp`, w: 1400, h: 1050, alt: 'Close-up of PU leather upholstery' },
      { name: 'Sewn microfiber', src: `${SHARED}/upholstery-sewn-microfiber.webp`, w: 1400, h: 1050, alt: 'Close-up of sewn microfiber leather and its seam' },
      { name: 'Seamless microfiber', src: `${SHARED}/upholstery-seamless-microfiber.webp`, w: 1400, h: 1050, alt: 'Close-up of seamless microfiber leather' },
    ],
    // products.js configuratorOptions.colors. Classic Blue has no studio photo yet.
    colors: {
      title: 'Unit colors',
      items: [
        { name: 'Begonia Red', swatch: '#a9555a' },
        { name: 'Coloured Glaze Blue', swatch: '#3785e3' },
        { name: 'Classic Blue', swatch: '#4A90D9' },
        { name: 'Gray', swatch: '#7c8389' },
        { name: 'Olive Green', swatch: '#cbc357' },
      ],
    },
    // products.js ergonomicsDeepDive; the old box section says the stool comes with every S9.
    stool: {
      title: 'Your RS06 stool is included',
      stars: [
        'Eight-way adjustable, with a 5° forward tilt',
        'Holds your spine in its natural curve',
        '360° silent casters on an aluminum alloy base',
      ],
    },
  },

  // From the old /s9 spec section (ROSON CE manual), ranges written out with "to". The old
  // "Motor warranty: 3-year" row is left off (see the header).
  specs: {
    kicker: 'Specifications',
    title: 'The full technical sheet',
    line: 'Power, chair, water and air figures from the ROSON CE manual.',
    groups: [
      {
        label: 'Electrical',
        rows: [
          ['Model', 'S9'],
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
          ['Disinfection', 'EOW-TECH electrolyzed oxidizing water'],
          ['Pipelines', 'SMC polyether'],
          ['Warm water', '40 °C ±5 °C'],
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
        label: 'Controls and physical',
        rows: [
          ['Operation panel', '45° ergonomic angle'],
          ['Memory positions', '3 (P1, P2, P3)'],
          ['Display', 'Medical-grade color LCD'],
          ['Operating light', 'RoLight dental light'],
          ['Net weight', 'About 230 kg'],
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
    line: 'Everything arrives together, the RS06 stool included.',
    items: [
      { icon: 'unit', title: 'Dental unit', line: 'The chair and its base' },
      { icon: 'light', title: 'Oral light', line: '8-Tooth Smile light with Philips LEDs' },
      { icon: 'bowl', title: 'Swiveling cuspidor bowl', line: 'With integrated flushing' },
      { icon: 'foot', title: 'Four-way foot control', line: 'IPX4 rated, a free upgrade' },
      { icon: 'headrest', title: 'Multi-articulated headrest', line: 'Adjustable for all patient sizes' },
      { icon: 'seat', title: 'Backrest and seat', line: 'In the upholstery color you choose' },
      { icon: 'stool', title: 'RS06 dentist stool', line: 'Gas spring, casters and ergonomic support', tag: 'Included' },
      { icon: 'syringe', title: 'Three-way syringe and suction', line: 'Stainless steel syringe, strong and weak suction' },
      { icon: 'tube', title: 'Handpiece tubing', line: 'Stainless steel spiral, short tube' },
      { icon: 'docs', title: 'Documents and kit', line: 'Manual, quality certificate, warranty card, accessories' },
    ],
  },

  // products.js roson-s9 specs only.
  warranty: {
    kicker: 'Warranty',
    title: 'What the warranty covers',
    line: 'Two years on the whole unit, five on the leather and pipelines, three on the light.',
    rows: [
      { part: 'Dental unit', term: '2 years', note: 'Parts and service in year one, service in year two' },
      { part: 'Seamless microfiber leather', term: '5 years' },
      { part: 'SMC polyether pipelines', term: '5 years' },
      { part: 'RoLight dental light', term: '3 years' },
    ],
  },

  // products.json s9, the door beat.
  door: {
    kicker: 'Pasig showroom',
    title: 'Try the S9 before you decide',
    line: 'The S9 is on our showroom floor. Sit in it, run its full travel and bring your operatory measurements.',
    ...SHOWROOM,
    photo: { src: `${S9}/Advanced features and components/6-14.jpg`, w: 1614, h: 1075, blend: true, alt: 'The S9 with over-the-patient delivery, its oral light and cuspidor' },
    ctas: [CTA.visit, CTA.inquire, CTA.allChairs],
  },

  // How the S9 appears on /dentalchairs.
  card: {
    line: 'EOW waterline disinfection, a 45° panel with three memory positions, and one key cleanup at the end of the day.',
    stars: [
      'EOW waterline disinfection',
      '45° ergonomic operation panel',
      'One key smart drainage',
    ],
    photo: { src: `${S9}/Advanced features and components/6-14.jpg`, w: 1614, h: 1075, blend: true, alt: 'The ROSON Affordable Luxury Model S9 with over-the-patient delivery' },
  },
};

export default s9;
