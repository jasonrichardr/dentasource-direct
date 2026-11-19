// src/data/chairs/a3l.js: everything the A3L page says and shows, in one place.
//
// Same shape as src/data/chairs/a3.js; the shared chair template renders it and writes no copy
// of its own.
//
// ☠️ EVERY FACT HERE HAS A SOURCE, AND NONE IS INVENTED. Sources: src/data/products.js
// (roson-dxa3l), src/data/cinema/products.json (a3l), and the legacy /a3l components in
// src/components/a3l/ (feature grid, fashion section, ergonomics, tech specs from the ROSON CE
// manual, configurator, what's in the box, warranty table). Where they disagree, products.js
// wins; where products.js is silent on a disputed point, the claim is left out.
//
// Left out on purpose:
// - The proof band. products.js specs list EOW-TECH as optional on the A3L (the legacy page
//   agrees), so the 99.9999% figure is not this chair's headline. EOW-TECH, dual IR cup filling
//   and warm water appear in the spec sheet as options. (products.js shortDesc and description
//   call EOW-TECH and dual IR included; its own specs say optional. Conflict flagged.)
// - The light model. Legacy says "8-Tooth Smile (RV008-1)" with infrared on and off and an
//   atmosphere light; products.js says "RoLight 8-bead Philips LED". The products.js name is
//   used, and the infrared switch and atmosphere light are dropped.
// - The "darker, more executive finish" (products.json): the colorway photos show a white unit
//   with colored upholstery, so the claim is not repeated here.
// - Seamless microfiber 5-year warranty: legacy fashion section only, not in products.js.
// - TIMOTION (legacy motor spec), "patients describe it as sitting on a cloud", the "#1 cause
//   of disability" line, femoral artery claims, and anything about price.
//
// Photos: real studio shots already in public/images/products/dxa3l/, each looked at.
// The seven colorways (032 to 038) share one framing; 012 and 011 share one framing (over the
// patient, swing mounted). Rejected: detail.jpg and 025 (navy infographics with a logo
// lockup), 030 and 031 (line drawings), 022 (a four-LED light that matches neither stated
// light), 050 (a different chair model, not the A3 series base), 008 (the same render as 026 at
// a lower size), 009 and 010 (near repeats of 012), and the sunlit scene, which reads as a
// generated image. Not used by name: 042 to 047 (lab report scans), 049 (an A3S technical
// drawing), 040, 041, 048 and 054 (named for other models), the 150 px thumbnails, and the
// logo and site-section files. Upholstery uses the shared close-ups in /images/chairs/shared/.

import { SHOWROOM, CTA } from './shared';

const A3L = '/images/products/dxa3l';
const SHARED = '/images/chairs/shared';

export const a3l = {
  slug: 'a3l',
  productSlug: 'roson-dxa3l',
  route: '/a3l',
  name: 'ROSON Fashion Model A3L',
  model: 'A3L',
  lineName: 'Fashion Model',
  family: 'A3 family',

  hero: {
    kicker: "Same A3 power, your clinic's style",
    title: 'ROSON Fashion Model A3L',
    line: 'The engineering of our flagship A3, in a look you choose for your operatory.',
    stars: [
      'Seven unit colors and three upholstery choices',
      'Color LCD with three memory positions',
      'RS06 dentist stool included in the box',
    ],
    ctas: [CTA.visit, CTA.inquire],
    // Swatch hex values are the legacy configurator's, unchanged.
    // Swatch dots are sampled from the upholstery in each photograph (2026-11-19), because the
    // legacy configurator hexes did not match the chairs they sat beside.
    colorways: {
      label: 'Color',
      note: 'Studio photos of the A3L. Tap a color.',
      initial: 'glaze-blue',
      blend: true,
      options: [
        { key: 'glaze-blue', name: 'Coloured Glaze Blue', swatch: '#447abc', src: `${A3L}/032_Roson_Fashion_Model_A3L_dental_chair__ergonomic_de.jpg`, w: 1000, h: 1000 },
        { key: 'gray', name: 'Gray', swatch: '#676c75', src: `${A3L}/033_Roson_Fashion_Model_A3L_dental_chair__ergonomic_de.jpg`, w: 1000, h: 1000 },
        { key: 'begonia-red', name: 'Begonia Red', swatch: '#661c1d', src: `${A3L}/034_Roson_Fashion_Model_A3L_dental_chair_with_red_seat.jpg`, w: 1000, h: 1000 },
        { key: 'hermes-orange', name: 'Hermes Orange', swatch: '#fe7627', src: `${A3L}/036_Roson_Fashion_Model_A3L_dental_chair__ergonomic_or.jpg`, w: 1000, h: 1000 },
        { key: 'olive-green', name: 'Olive Green', swatch: '#99a75a', src: `${A3L}/035_Roson_Fashion_Model_A3L_dental_chair__ergonomic_de.jpg`, w: 1000, h: 1000 },
        { key: 'tiffany-blue', name: 'Tiffany Blue', swatch: '#759ca6', src: `${A3L}/037_Roson_Fashion_Model_A3L_Dental_Chair__teal_seat__e.jpg`, w: 1000, h: 1000 },
        { key: 'light-green', name: 'Light Green', swatch: '#83bd87', src: `${A3L}/038_Roson_Fashion_Model_A3L_Dental_Chair__green_seat_a.jpg`, w: 1000, h: 1000 },
      ],
    },
  },

  // From products.js (memory positions, warranty) and the legacy spec sheet (height, load).
  glance: [
    { value: '3', label: 'memory positions on the color LCD' },
    { value: '400 to 750 mm', label: 'seat height range' },
    { value: '150 kg', label: 'maximum patient load' },
    { value: '2 years', label: 'warranty on the whole unit' },
  ],

  // products.json a3l, the whoItIsFor beat (and the forms beat for the title).
  fit: {
    kicker: 'Who it suits',
    title: 'For the room patients see first',
    line: 'For practices where the operatory is part of the brand, and dentists who want A3 engineering in a look of their own.',
    segments: [
      'Design-forward private practices',
      'Clinics fitting a signature operatory',
      'Second rooms that have to match the first',
    ],
  },

  features: {
    kicker: 'Features',
    title: 'Styled for the room, built for work',
    line: 'What each part does for you and your patient through a full clinic day.',
    items: [
      {
        key: 'platform',
        title: 'The A3 underneath',
        line: 'Same chassis, motor, LCD and handpiece system as our flagship A3. Only the look is yours to choose.',
        photo: { src: `${A3L}/026_Roson_Fashion_Model_A3L_dental_chair__ergonomic_de.jpg`, w: 1614, h: 1075, alt: 'The A3L with dark brown upholstery, A3 series lettered on its base', blend: true },
      },
      {
        key: 'look',
        title: 'Dress it for your brand',
        line: 'Customize the colors, upholstery and design details so the operatory looks like your clinic.',
        photo: { src: `${A3L}/013_Roson_Fashion_Model_A3L_Dental_Chair_with_brown_se.jpg`, w: 640, h: 640, alt: 'Top-down view of the A3L in dark brown with its light, trays, cuspidor and RS06 stool', blend: true },
      },
      {
        key: 'cart',
        title: 'A cart when the room needs one',
        line: 'Put the instrument tray on a mobile cart and reposition it whenever you need to.',
        photo: { src: `${A3L}/014_Roson_Fashion_Model_A3L_dental_chair__brown_seat__.jpg`, w: 640, h: 640, alt: 'The A3L in dark brown from the front, its instrument tray on a mobile cart', blend: true },
      },
      {
        key: 'holder',
        title: 'Holders set to your angle',
        line: 'The handpiece holder adjusts through four angles, from 30° to 80°, to suit the way you work.',
        photo: { src: `${A3L}/equipment.jpg`, w: 720, h: 480, alt: 'Close-up of the A3L doctor tray, handpieces resting in their holders below the control keys', blend: true },
      },
      {
        key: 'lcd',
        title: 'The whole unit, on one screen',
        line: 'Medical-grade color LCD with a power-on self-test, fault codes, three memory positions and a clock and timer.',
      },
      {
        key: 'motor',
        title: 'Smooth, quiet chair travel',
        line: 'The Whisper-Silent Motor starts and stops softly, so the chair moves without a jolt.',
      },
    ],
    // 012 and 011 share one framing. The cart option has no photo at this angle, so it is the
    // feature tile above instead.
    delivery: {
      kicker: 'Delivery',
      title: 'Over the patient or swing mounted',
      line: 'Choose the tray mounting that fits your habits. The mobile cart shown above is the third option.',
      initial: 'over-patient',
      blend: true,
      options: [
        { key: 'over-patient', name: 'Over the patient', src: `${A3L}/012_Roson_Fashion_Model_A3L_Dental_Chair__ergonomic_br.jpg`, w: 640, h: 640 },
        { key: 'swing-mounted', name: 'Swing mounted', src: `${A3L}/011_Roson_Fashion_Model_A3L_dental_chair_with_brown_se.jpg`, w: 640, h: 640 },
      ],
    },
    // Standard parts with no clean photograph (the anti-collision shot is a navy infographic).
    extras: {
      title: 'Also built in',
      items: [
        { icon: 'shield', title: 'Anti-collision assistant arm', line: 'Stops and backs off the moment it meets an obstacle.' },
        { icon: 'move', title: 'German-engineered arm joints', line: 'Four times the wear life of standard arms.' },
        { icon: 'clean', title: 'One-key smart drainage', line: 'One button starts a 5 minute auto-cleaning cycle.' },
        { icon: 'pipes', title: 'SMC polyether pipelines', line: 'Polyether water lines, covered for 5 years.' },
      ],
    },
  },

  comfort: {
    kicker: 'Comfort',
    title: 'Upholstery in three grades',
    line: 'PU leather comes standard and wipes clean. Upgrade to sewn microfiber for stitched detail, or seamless microfiber with no seams to clean around.',
    upholstery: [
      { name: 'PU leather (standard)', src: `${SHARED}/upholstery-pu-leather.webp`, w: 1400, h: 1050, alt: 'Close-up of PU leather upholstery' },
      { name: 'Sewn microfiber', src: `${SHARED}/upholstery-sewn-microfiber.webp`, w: 1400, h: 1050, alt: 'Close-up of sewn microfiber leather and its seam' },
      { name: 'Seamless microfiber', src: `${SHARED}/upholstery-seamless-microfiber.webp`, w: 1400, h: 1050, alt: 'Close-up of seamless microfiber leather' },
    ],
    // products.js ergonomicsDeepDive.
    stool: {
      title: 'Your RS06 stool, included',
      stars: [
        'Eight-way adjustment to fit your build',
        '5° forward tilt for a natural spine curve',
        '360° silent casters, aluminum alloy base',
      ],
    },
  },

  // From the legacy /a3l spec section (ROSON CE manual), ranges written out with "to".
  // Light, display, upholstery and origin rows from products.js.
  specs: {
    kicker: 'Specifications',
    title: 'What your technician will ask',
    line: 'From the ROSON CE manual, grouped by system.',
    groups: [
      {
        label: 'Electrical',
        rows: [
          ['Model', 'KLT-6220 A3L'],
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
          ['EOW-TECH disinfection', 'Optional'],
          ['Dual IR and gravity cup filling', 'Optional'],
          ['Warm water', 'Optional upgrade'],
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
          ['Handpiece holder', '4 angles, 30° to 80°'],
          ['Operating light', 'RoLight 8-bead Philips LED'],
          ['Display', 'Medical-grade color LCD'],
          ['Tubing', 'Polyether'],
          ['Upholstery', 'PU leather standard, microfiber upgrade'],
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
    line: 'Everything arrives together, with the RS06 stool and the upgraded foot control.',
    items: [
      { icon: 'unit', title: 'Dental unit', line: 'The chair and its base' },
      { icon: 'light', title: 'Operating light', line: 'RoLight 8-bead Philips LED' },
      { icon: 'bowl', title: 'Swiveling cuspidor bowl', line: 'With integrated flushing' },
      { icon: 'foot', title: 'Upgraded foot control', line: 'Four-way, IPX4 rated, a DentaSource exclusive' },
      { icon: 'headrest', title: 'Multi-articulated headrest', line: 'Adjusts for every patient size' },
      { icon: 'seat', title: 'Backrest and seat', line: 'In the upholstery color you choose' },
      { icon: 'stool', title: 'RS06 dentist stool', line: 'Gas spring, casters, armrest and backrest', tag: 'Included' },
      { icon: 'syringe', title: 'Three-way syringe and suction', line: 'Stainless steel syringe, strong and weak suction' },
      { icon: 'tube', title: 'Handpiece tubing', line: 'Polyether, short tube design' },
      { icon: 'docs', title: 'Documents and kit', line: 'Manual, quality certificate, warranty card, accessories' },
    ],
  },

  // products.js roson-dxa3l only: specs (unit, light), features (pipelines), advancedFeatures
  // (motor). The legacy fashion section's 5-year seamless microfiber term is not in products.js,
  // so it stays off until the owner confirms it.
  warranty: {
    kicker: 'Warranty',
    title: 'What the warranty covers',
    line: 'Two years on the whole unit, five on the motor and pipelines, three on the light.',
    rows: [
      { part: 'Dental unit', term: '2 years', note: 'Parts and service in year one, service in year two' },
      { part: 'Whisper-Silent Motor', term: '5 years' },
      { part: 'SMC polyether pipelines', term: '5 years' },
      { part: 'RoLight dental light', term: '3 years' },
    ],
  },

  // products.json a3l, the door beat.
  door: {
    kicker: 'Pasig showroom',
    title: 'See it before you decide',
    line: 'The A3L is on our showroom floor. Sit in it, run it through its full travel, and bring your measurements.',
    ...SHOWROOM,
    ctas: [CTA.visit, CTA.inquire, CTA.allChairs],
  },

  // How the A3L appears on /dentalchairs.
  card: {
    line: 'Our flagship A3 engineering, in the colors and upholstery your clinic chooses.',
    stars: [
      'Seven unit colors, three upholsteries',
      'Medical-grade color LCD with self-test',
      'RS06 dentist stool included',
    ],
    photo: { src: `${A3L}/033_Roson_Fashion_Model_A3L_dental_chair__ergonomic_de.jpg`, w: 1000, h: 1000, alt: 'ROSON Fashion Model A3L with gray upholstery', blend: true },
  },
};

export default a3l;
