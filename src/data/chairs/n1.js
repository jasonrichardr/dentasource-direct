// src/data/chairs/n1.js: everything the N1 page says and shows, in one place.
//
// The shared chair template (src/components/chair/) renders this file and writes no copy of
// its own. Same shape as a3.js.
//
// ☠️ EVERY FACT HERE HAS A SOURCE, AND NONE IS INVENTED. Numbers and claims come from
// src/data/products.js (roson-dxn1), src/data/cinema/products.json (n1), and the legacy /n1
// sections (src/components/n1/: feature grid, simplicity, ergonomics, tech specs,
// configurator, what's in the box, warranty table). Where two disagree, products.js wins:
// the motor is named as products.js names it ("24V DC silent electric motor").
//
// Left out on purpose:
// - "Trusted by 80,000+ dentists" (legacy simplicity section). products.js gives that figure
//   to the N2 PRO only, so there is no proof band on this page.
// - The 3-year motor term (legacy warranty table) and the 5-year seamless microfiber term
//   (legacy configurator). products.js states only the 2-year unit warranty for the N1.
// - The ergonomics health claims (fatigue on 8+ hour days, musculoskeletal disorders,
//   lumbar lordosis) and the comparison with the N2+ light.
// - The per-color finish line ("resists fading and chemical wear") and the HX color codes.
// - Everything that appears only in the .md notes inside public/images/products/n1/ (a color
//   LCD, a detachable suction filter, adjustable color temperature, a cup filler, the
//   assistant control panel): not one of this page's fact sources.
//
// House rules for the words: a headline is 7 words or fewer, the line under it 24 or fewer,
// facts in `stars` 9 words or fewer, no em or en dashes, no prices, no "#1", no competitor
// names, Pasig showroom (never Manila).
//
// Photos: ROSON white-ground studio shots already in public/images/products/n1/, looked at one
// by one, every one `blend`. The legacy feature grid paired several photos with the wrong
// feature (the suction filter shot sat under warm water); here each photo goes with the part
// it actually shows. Not used: the seven per-color shots (the chair sits small in the lower
// left of a wide empty frame), the gloved-hand suction filter shots (N1_4, 04_filter), the
// assistant control pad (N1_2), the soft patient seat shot (08), the A3 stool photo the legacy
// ergonomics section borrowed, and the showroom photo in products.json (it shows a person's
// face). The cart delivery option has no photo of its own (the legacy configurator reused the
// over-the-patient shot), so it is named in words only.

import { SHOWROOM, CTA } from './shared';

const N1 = '/images/products/n1';
const UNIT = `${N1}/N1 Dental Chair`;
const PARTS = `${N1}/Advanced features and components`;
const DELIVERY = `${N1}/Handpiece Placement Choices`;
const SHARED = '/images/chairs/shared';

export const n1 = {
  slug: 'n1',
  productSlug: 'roson-dxn1',
  route: '/n1',
  name: 'ROSON Classic Model N1',
  model: 'N1',
  lineName: 'Classic Model',
  family: 'N series',

  hero: {
    kicker: 'The simplest setup in the lineup',
    title: 'ROSON Classic Model N1',
    line: 'The entry point to the ROSON range, delivered as a complete operatory. Quick to install, easy to run every day.',
    stars: [
      'One starter for air, water and electricity',
      'Right arm swings clear for easy patient entry',
      'Free ocular visit, then our own technicians install it',
    ],
    ctas: [CTA.visit, CTA.inquire],
    // One clean full-unit studio shot, so the color controls hide themselves; the seven unit
    // colors are listed under comfort.colors.
    colorways: {
      label: 'Color',
      note: 'Studio photo from ROSON.',
      initial: 'studio',
      blend: true,
      options: [
        { key: 'studio', name: 'blue upholstery, with its light and delivery unit', src: `${UNIT}/N1_3.jpg`, w: 640, h: 640 },
      ],
    },
  },

  // The four figures a buyer asks for first, all from products.js roson-dxn1.
  glance: [
    { value: '650 × 300 mm', label: 'dentist table' },
    { value: '5', label: 'positions on the handpiece holder' },
    { value: '180°', label: 'rotation on the ceramic spittoon' },
    { value: '2 years', label: 'warranty on the whole unit' },
  ],

  // products.json n1, the whoItIsFor beat.
  fit: {
    kicker: 'Who it suits',
    title: 'A first clinic, or a simple room',
    line: 'Entry level and complete, with a right arm that gives elderly patients, children and patients with limited mobility an easy way in.',
    segments: [
      'First clinics on a fixed build budget',
      'Rooms treating elderly and pediatric patients',
      'Satellite and provincial branches',
    ],
  },

  features: {
    kicker: 'Features',
    title: 'Simple where it counts',
    line: 'The parts you and your patient touch every day, and what each one does.',
    // Order follows the bento's slot shapes: the 3:2 shots take the wide slots (1 and 4), the
    // square arm shot a squarer one (3). `fit: 'cover'` on every shot whose part runs off the
    // edge of the photograph, so that edge meets the tile edge instead of floating inside it.
    items: [
      {
        key: 'light',
        title: 'Light where you are working',
        line: '8-Tooth Smile light with Philips LEDs, two modes and an infrared sensor to switch it on and off.',
        photo: { src: `${PARTS}/01_light.jpg`, w: 1614, h: 1075, blend: true, fit: 'cover', alt: 'The 8-Tooth Smile oral light head of the N1, with its two handles' },
      },
      {
        key: 'starter',
        title: 'One switch starts the day',
        line: 'Air, water and electricity run from one starter. No sequence to remember, and your technician installs it faster.',
      },
      {
        key: 'arm',
        title: 'The right arm swings clear',
        line: 'It swings fully out of the way, so nothing stands between your patient and the seat.',
        photo: { src: `${UNIT}/N1_5.jpg`, w: 640, h: 640, blend: true, fit: 'cover', alt: 'The N1 right armrest shown swinging out from the seat through several positions' },
      },
      {
        key: 'spittoon',
        title: 'A ceramic spittoon that turns',
        line: 'Ceramic is more hygienic and lasts longer than plastic, and the bowl rotates through 180°.',
        photo: { src: `${PARTS}/03_spittoon.jpg`, w: 1614, h: 1075, blend: true, fit: 'cover', alt: 'The N1 ceramic spittoon bowl beside its cup holder and water spout' },
      },
      {
        key: 'table',
        title: 'A table with room to work',
        line: 'A 650 by 300 mm dentist table with a 5-position handpiece holder, so every instrument has its place.',
        photo: { src: `${PARTS}/02_dentist_table.jpg`, w: 1614, h: 1075, blend: true, fit: 'cover', alt: 'The N1 dentist table, its control keys and the five-position handpiece holder below' },
      },
      {
        key: 'warm',
        title: 'Warm water, not a cold shock',
        line: 'Water at 40 °C ±5 °C reaches the handpieces and syringe, so patients skip the cold shock.',
        photo: { src: `${PARTS}/07_assistant_table.jpg`, w: 1614, h: 1075, blend: true, fit: 'cover', alt: 'The N1 assistant holder with the three-way syringe and the strong and weak suction' },
      },
      {
        key: 'foot',
        title: 'Hands stay on the patient',
        line: 'The multifunction foot control has a non-skid base and its own water rinsing and supply buttons.',
        photo: { src: `${PARTS}/05_foot_control.jpg`, w: 1614, h: 1075, blend: true, alt: 'The N1 multifunction foot control with its pedals, buttons and carry handle' },
      },
    ],
    // Same framing for both, so switching reads as one chair changing its delivery.
    delivery: {
      kicker: 'Delivery',
      title: 'Mount it the way you work',
      line: 'Over the patient or swing mounted, shown here. A cart-mounted delivery is also available.',
      initial: 'over-patient',
      blend: true,
      options: [
        { key: 'over-patient', name: 'Over the patient', src: `${DELIVERY}/Over-the-Patient.jpg`, w: 640, h: 640 },
        { key: 'swing-mounted', name: 'Swing mounted', src: `${DELIVERY}/Swing-Mounted.jpg`, w: 640, h: 640 },
      ],
    },
    // Standard parts with no clean photograph of their own.
    extras: {
      title: 'Also built in',
      items: [
        { icon: 'water', title: 'Pure water supply', line: 'Clean water to every handpiece.' },
        { icon: 'clean', title: 'Programmable flushing', line: 'The spittoon rinses on a set program.' },
        { icon: 'motor', title: '24V DC silent motor', line: 'A quiet electric drive moves the chair.' },
      ],
    },
  },

  comfort: {
    kicker: 'Comfort',
    title: 'Pick the finish for your room',
    line: 'Seven unit colors and three upholstery choices, the same palette as the rest of the N series.',
    upholstery: [
      { name: 'PU leather', src: `${SHARED}/upholstery-pu-leather.webp`, w: 1400, h: 1050, alt: 'Close-up of PU leather upholstery' },
      { name: 'Sewn microfiber', src: `${SHARED}/upholstery-sewn-microfiber.webp`, w: 1400, h: 1050, alt: 'Close-up of sewn microfiber leather and its seam' },
      { name: 'Seamless microfiber', src: `${SHARED}/upholstery-seamless-microfiber.webp`, w: 1400, h: 1050, alt: 'Close-up of seamless microfiber leather' },
    ],
    // Names from products.json n1 (colors beat); swatches from the legacy N1 configurator.
    colors: {
      title: 'Unit colors',
      items: [
        { name: 'Dark Blue', swatch: '#00008B' },
        { name: 'Orange', swatch: '#E77A41' },
        { name: 'Light Grey', swatch: '#D3D3D3' },
        { name: 'Bordeaux', swatch: '#8A2E3B' },
        { name: 'Apple Green', swatch: '#A8E160' },
        { name: 'Middle Grey', swatch: '#808080' },
        { name: 'Green', swatch: '#2E8B57' },
      ],
    },
    stool: {
      title: 'The RS03 stool comes included',
      stars: [
        'Integrated armrest and backrest support your upper body',
        'Wide cast aluminum base keeps it stable',
        'Noiseless nylon wheels that will not scuff floors',
      ],
    },
  },

  // From the legacy /n1 spec section, with products.js wording where both name a part.
  specs: {
    kicker: 'Specifications',
    title: 'The numbers your technician needs',
    line: 'Power, water and air requirements, plus the working ranges of the chair, in one sheet.',
    groups: [
      {
        label: 'Electrical',
        rows: [
          ['Model', 'N1'],
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
          ['Motor', '24V DC silent electric motor'],
          ['Right arm', 'Rotatable for patient entry and exit'],
        ],
      },
      {
        label: 'Water',
        rows: [
          ['Water pressure', '0.2 to 0.4 MPa'],
          ['Water flow', '≥ 5 L/min'],
          ['Warm water', '40 °C ±5 °C, constant temperature'],
          ['Water supply', 'Pure water supply'],
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
          ['Dentist table', '650 × 300 mm'],
          ['Handpiece holder', '5 positions'],
          ['Spittoon', 'Ceramic, 180° rotatable'],
          ['Operating light', '8-Tooth Smile, Philips LEDs, infrared'],
          ['Starter system', 'One starter for air, water and electricity'],
        ],
      },
      {
        label: 'Options',
        rows: [
          ['Upholstery', 'PU, sewn microfiber or seamless microfiber leather'],
          ['Delivery', 'Over the patient, swing mounted or cart mounted'],
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

  box: {
    kicker: 'In the box',
    title: 'A complete room in one delivery',
    line: 'Ten parts arrive together. A full setup, not a chair you still have to finish buying.',
    items: [
      { icon: 'unit', title: 'Dental unit', line: 'The chair and its base' },
      { icon: 'light', title: 'Operating light', line: '8-Tooth Smile Philips LED light' },
      { icon: 'bowl', title: 'Ceramic spittoon', line: '180° rotatable, with programmable flushing' },
      { icon: 'foot', title: 'Multifunction foot control', line: 'A free upgrade, exclusive to DentaSource' },
      { icon: 'headrest', title: 'Multi-articulated headrest', line: 'Adjustable for all patient sizes' },
      { icon: 'seat', title: 'Backrest and seat', line: 'In the upholstery color you choose' },
      { icon: 'stool', title: 'RS03 dentist stool', line: 'Armrest, backrest and a wide cast aluminum base', tag: 'Included' },
      { icon: 'syringe', title: 'Three-way syringe and suction', line: 'Warm water syringe, strong and weak suction' },
      { icon: 'tube', title: 'Handpiece tubing', line: 'Stainless steel spiral, short tube' },
      { icon: 'docs', title: 'Documents and kit', line: 'Manual, quality certificate, warranty card, accessories' },
    ],
  },

  // products.js roson-dxn1 only. The legacy table also listed a 3-year motor term; it is not in
  // the data files, so it stays off until the owner confirms it.
  warranty: {
    kicker: 'Warranty',
    title: 'Two years on the whole unit',
    line: 'Parts and service in the first year, then service through the second.',
    rows: [
      { part: 'Dental unit', term: '2 years' },
    ],
  },

  door: {
    kicker: 'Pasig showroom',
    title: 'See it before you decide',
    line: 'The N1 is on our showroom floor. Sit in it, swing the arm clear and bring your operatory measurements.',
    ...SHOWROOM,
    photo: { src: `${UNIT}/N1_6.jpg`, w: 640, h: 640, blend: true, fit: 'cover', alt: 'The N1 headrest and backrest in blue upholstery, close up' },
    ctas: [CTA.visit, CTA.inquire, CTA.allChairs],
  },

  // How the N1 appears on /dentalchairs.
  card: {
    line: 'The simplest setup in the ROSON range, with one starter for air, water and electricity.',
    stars: [
      'Right arm swings clear for patient access',
      '180° rotatable ceramic spittoon',
      'RS03 dentist stool included',
    ],
    photo: { src: `${UNIT}/N1_3.jpg`, w: 640, h: 640, blend: true, alt: 'ROSON Classic Model N1 with its light and delivery unit' },
  },
};

export default n1;
