// src/data/chairs/a3.js — everything the A3 page says and shows, in one place.
//
// The shared chair template (src/components/chair/) renders this file and writes no copy of
// its own. Moving another chair onto the template means adding a file like this one and
// pointing its route at <ChairPage chair={...} />; no component changes.
//
// ☠️ EVERY FACT HERE HAS A SOURCE, AND NONE IS INVENTED. Numbers and claims come from
// src/data/products.js (roson-dxa3), src/data/cinema/products.json (a3), the old /a3 spec,
// box and warranty sections (ROSON CE manual RSBD-YF-55), or the fsroson.com A3 page
// (https://www.fsroson.com/roson-flagship-model-a3/). If a line cannot be traced to one of
// those, it does not belong in this file.
//
// House rules for the words: a headline is 7 words or fewer, the line under it 20 or fewer,
// proof goes in ✦ stars rather than paragraphs, no em or en dashes, no prices, no "#1",
// no competitor names, Pasig showroom (never Manila).
//
// Photos: fsroson.com studio renders and detail shots, downloaded 2026-10-06, looked at one by
// one, cropped to a shared frame per set, mat baked to #f7f8fa, WebP. Excluded on purpose:
// the navy infographic frames (LCD, anti-collision, speed/RPM) because they carry text and
// the ROSON logo lockup, the six lab certificate scans, the installation drawing, and the
// stool diagram.

const A3 = '/images/chairs/a3';
const SHARED = '/images/chairs/shared';

export const a3 = {
  slug: 'a3',
  productSlug: 'roson-dxa3',
  route: '/a3',
  name: 'ROSON Flagship Model A3',
  model: 'A3',
  lineName: 'Flagship Model',
  family: 'A3 family',

  hero: {
    kicker: 'ROSON dental chair',
    title: 'ROSON Flagship Model A3',
    line: 'Waterline disinfection, a color touchscreen and hands-free cup filling, all built in as standard.',
    stars: [
      'EOW disinfection eliminates 99.9999% of waterline bacteria',
      'Medical-grade color touchscreen with three memory positions',
      'Free ocular visit, then our own technicians install it',
    ],
    ctas: [
      { label: 'Visit the showroom', href: '/contact#showroom', primary: true },
      { label: 'Send an inquiry', href: '/contact#inquiry' },
    ],
    colorways: {
      label: 'Color',
      note: 'Studio renders from ROSON. Tap a color.',
      initial: 'turquoise',
      options: [
        { key: 'turquoise', name: 'Turquoise', swatch: '#7fb0ae', src: `${A3}/a3-color-turquoise.webp`, w: 940, h: 751 },
        { key: 'mountain-blue', name: 'Mountain Blue', swatch: '#6f8fae', src: `${A3}/a3-color-mountain-blue.webp`, w: 940, h: 751 },
        { key: 'clear-green', name: 'Clear Green', swatch: '#9cc18a', src: `${A3}/a3-color-clear-green.webp`, w: 940, h: 751 },
        { key: 'cherry-red', name: 'Cherry Red', swatch: '#b23a3a', src: `${A3}/a3-color-cherry-red.webp`, w: 940, h: 751 },
        { key: 'vintage-brown', name: 'Vintage Brown', swatch: '#7a4a3e', src: `${A3}/a3-color-vintage-brown.webp`, w: 940, h: 751 },
        { key: 'skyscraper-gray', name: 'Skyscraper Gray', swatch: '#8f8f95', src: `${A3}/a3-color-skyscraper-gray.webp`, w: 940, h: 751 },
      ],
    },
  },

  // The one number worth a whole band.
  proof: {
    kicker: 'EOW-TECH disinfection',
    title: 'Clean water, every single rinse',
    stat: '99.9999%',
    statCaption: 'of waterline bacteria eliminated',
    line: 'Micro-electrolysis disinfects the waterlines without harsh chemical additives.',
    stars: [
      'Inhibits biofilm in the SMC pipelines',
      'Safe active oxygen, gentle for patient rinsing',
      'No free chlorine ions, so valves and metal parts last',
    ],
  },

  features: {
    kicker: 'Why it works',
    title: 'Built around a working day',
    line: 'The parts you reach for all day, and what each one does for you.',
    items: [
      {
        key: 'light',
        title: 'Light without the shadows',
        line: '8-bead Philips LED with adjustable brightness and color temperature, easy on your eyes.',
        photo: { src: `${A3}/a3-light.webp`, w: 897, h: 897, alt: 'The A3 RoLight dental light, its eight LED beads and handles' },
      },
      {
        key: 'lcd',
        title: 'Every setting on one screen',
        line: 'Medical-grade color LCD with a startup self-check, error codes and three memory positions.',
        photo: { src: `${A3}/a3-lcd-tray.webp`, w: 970, h: 776, alt: 'The A3 doctor tray with its color LCD and control keys' },
      },
      {
        key: 'holder',
        title: 'Holders at your angle',
        line: 'Four-level adjustable handpiece holder, from 30° to 80°, set to the way you work.',
        photo: { src: `${A3}/a3-handpiece-holder.webp`, w: 720, h: 480, alt: 'Handpieces resting in the adjustable holder of the A3', fit: 'cover' },
      },
      {
        key: 'warm',
        title: 'Warm water at one touch',
        line: 'Warm water to the handpieces and three-way syringe, kinder to sensitive patients.',
        photo: { src: `${A3}/a3-warm-water-switch.webp`, w: 945, h: 756, alt: 'The one-touch warm water switch on the A3 tray' },
      },
      {
        key: 'cup',
        title: 'The cup fills itself',
        line: 'Dual infrared and gravity sensing detects the cup and fills it, touch free.',
        photo: { src: `${A3}/a3-cup-filler.webp`, w: 720, h: 480, alt: 'The A3 cup filler with its infrared sensor above the spittoon' },
      },
      {
        key: 'tissue',
        title: 'One box, five jobs',
        line: 'The 5-in-1 tissue box adds two storage layers in impact-resistant material.',
        photo: { src: `${A3}/a3-tissue-box.webp`, w: 1234, h: 987, alt: 'The 5-in-1 multifunctional tissue box mounted on the A3' },
      },
      {
        key: 'drain',
        title: 'One key ends the day',
        line: 'Raises the chair to its highest position and runs a 5 minute spittoon flush.',
        photo: { src: `${A3}/a3-spittoon.webp`, w: 1000, h: 1000, alt: 'The A3 spittoon bowl and cup holder' },
      },
    ],
    // Same framing for all three, so switching reads as one chair changing its delivery.
    delivery: {
      kicker: 'Delivery',
      title: 'Mount it three ways',
      line: 'Over the patient, swing mounted or on a cart, to suit the room you have.',
      initial: 'swing-mounted',
      options: [
        { key: 'over-patient', name: 'Over the patient', src: `${A3}/a3-delivery-over-patient.webp`, w: 939, h: 751 },
        { key: 'swing-mounted', name: 'Swing mounted', src: `${A3}/a3-delivery-swing-mounted.webp`, w: 939, h: 751 },
        { key: 'cart', name: 'On a cart', src: `${A3}/a3-delivery-cart.webp`, w: 939, h: 751 },
      ],
    },
    // Standard parts with no clean photograph (the anti-collision shot is a navy infographic).
    extras: {
      title: 'Also built in',
      items: [
        { icon: 'shield', title: 'Anti-collision assistant arm', line: 'Pauses and reverses when it meets an obstacle.' },
        { icon: 'motor', title: 'Whisper-Silent Motor', line: 'Soft start and stop for smooth, quiet travel.' },
        { icon: 'pipes', title: 'SMC polyether pipelines', line: 'Anti-corrosive water and air lines.' },
        { icon: 'foot', title: 'Four-way foot control', line: 'IPX4 rated, a free upgrade on every unit.' },
      ],
    },
  },

  comfort: {
    kicker: 'Comfort',
    title: 'Soft where patients feel it',
    line: 'Three upholstery choices. Breathable seamless microfiber carries a 5-year warranty.',
    upholstery: [
      { name: 'PU leather', src: `${SHARED}/upholstery-pu-leather.webp`, w: 1400, h: 1050, alt: 'Close-up of PU leather upholstery' },
      { name: 'Sewn microfiber', src: `${SHARED}/upholstery-sewn-microfiber.webp`, w: 1400, h: 1050, alt: 'Close-up of sewn microfiber leather and its seam' },
      { name: 'Seamless microfiber', src: `${SHARED}/upholstery-seamless-microfiber.webp`, w: 1400, h: 1050, alt: 'Close-up of seamless microfiber leather' },
    ],
    stool: {
      title: 'The RS06 stool comes included',
      stars: [
        'Eight-way adjustable, with a 5° forward tilt',
        'Keeps your spine in its natural curve',
        '360° silent casters on an aluminum alloy base',
      ],
    },
  },

  // From the old /a3 spec section (ROSON CE manual RSBD-YF-55), ranges written out with "to".
  specs: {
    kicker: 'Specifications',
    title: 'The full technical sheet',
    line: 'From the ROSON CE manual, grouped the way a technician reads it.',
    groups: [
      {
        label: 'Electrical',
        rows: [
          ['Model', 'KLT-6220 A3'],
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
          ['Water hardness', 'Below 25 (below 12° dH)'],
          ['Warm water', '40 °C ±5 °C'],
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
          ['Pure water bottles', '2 × 1 L'],
          ['Operating light', 'RoLight 8-bead Philips LED'],
          ['Light arm capacity', '1.5 kg'],
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
    title: 'Everything to start working',
    line: 'Ten parts arrive together, the RS06 stool included.',
    items: [
      { icon: 'unit', title: 'Dental unit', line: 'The chair and its base' },
      { icon: 'light', title: 'Operating light', line: 'RoLight 8-bead Philips LED' },
      { icon: 'bowl', title: 'Swiveling cuspidor bowl', line: 'With integrated flushing' },
      { icon: 'foot', title: 'Four-way foot control', line: 'IPX4 rated, a free upgrade' },
      { icon: 'headrest', title: 'Multi-articulated headrest', line: 'Adjusts for every patient size' },
      { icon: 'seat', title: 'Backrest and seat', line: 'In the upholstery color you choose' },
      { icon: 'stool', title: 'RS06 dentist stool', line: 'Gas spring, casters, armrest and backrest', tag: 'Included' },
      { icon: 'syringe', title: 'Three-way syringe and suction', line: 'Stainless steel syringe, strong and weak suction' },
      { icon: 'tube', title: 'Handpiece tubing', line: 'Stainless steel spiral, short tube' },
      { icon: 'docs', title: 'Documents and kit', line: 'Manual, quality certificate, warranty card, accessories' },
    ],
  },

  // products.js roson-dxa3 specs only. The old page also listed a 5-year motor term; it is not
  // in the data files, so it stays off until the owner confirms it.
  warranty: {
    kicker: 'Warranty',
    title: 'Covered, in plain terms',
    line: 'Two years on the whole unit, and longer on the leather, the pipelines and the light.',
    rows: [
      { part: 'Dental unit', term: '2 years', note: 'Parts and service in year one, service in year two' },
      { part: 'Seamless microfiber leather', term: '5 years' },
      { part: 'SMC polyether pipelines', term: '5 years' },
      { part: 'RoLight dental light', term: '3 years' },
    ],
  },

  door: {
    kicker: 'Pasig showroom',
    title: 'Sit in it before you decide',
    line: 'The A3 is on our showroom floor. Run it through its full travel and bring your measurements.',
    address: '610 C. Raymundo Avenue, Maybunga, Pasig City',
    hours: 'Monday to Sunday, 9 AM to 8 PM',
    photo: { src: `${A3}/a3-rear.webp`, w: 1124, h: 900, alt: 'The A3 from behind, with its delivery cart' },
    ctas: [
      { label: 'Visit the showroom', href: '/contact#showroom', primary: true },
      { label: 'Send an inquiry', href: '/contact#inquiry' },
      { label: 'See all chairs', href: '/dentalchairs' },
    ],
  },

  // How the A3 appears on /dentalchairs.
  card: {
    line: 'Waterline disinfection, a color touchscreen and hands-free cup filling, built in.',
    stars: [
      'EOW waterline disinfection',
      '8-bead Philips LED light',
      'Anti-collision assistant arm',
    ],
  },
};

export default a3;
