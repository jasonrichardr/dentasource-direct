// src/data/chairs/catalog.js — the /dentalchairs gallery, one entry per chair.
//
// Every line and ✦ fact is lifted from that chair's own entry in src/data/cinema/products.json
// or src/data/products.js; nothing here is new copy about a product. Warranty is deliberately
// absent per card: every chair carries the same 2 years, so the page says it once.
//
// A chair that has moved onto the shared template (today only the A3) takes its card from its
// own content file, so the page and the gallery can never disagree.
//
// Photos: `baked: true` means the mat (#f7f8fa) is already in the file (src/data/chairs/a3.js
// explains how). The rest are the existing white-ground studio shots, which the card multiplies
// onto the mat so the white of the photograph and the mat read as one surface. `fit: 'cover'`
// is a scene with its own background (the A1 Pro brochure shot).
//
// Changed heroes (2026-10-06 pilot): A3S and S6 moved off their 640 px gallery thumbs to
// sharper model-specific fsroson renders (A3S 2026/07 Coloured Glaze Blue, S6 2025/09 cart).
// N1, S3 and S9 keep theirs on purpose: fsroson's newer N1 renders show a restyled unit, the
// S-series colorways are shared between S3 and S6, and the S9 colorways are chair-only cutouts
// without the delivery unit. N2 Pro moved from its rear view to the three-quarter shot in the
// same folder. N2 Plus keeps its own studio shot, re-encoded to WebP under a plain path: the
// original (N2+ Dental Chair/N2_Front.png, a paletted PNG with transparency) comes back from
// the image optimizer as "isn't a valid image", a 400.

import a3 from './a3';

export const CHAIRS = [
  {
    slug: 'a3',
    route: a3.route,
    model: a3.model,
    lineName: a3.lineName,
    family: a3.family,
    line: a3.card.line,
    stars: a3.card.stars,
    photo: { src: a3.hero.colorways.options[0].src, w: 940, h: 751, baked: true, alt: 'ROSON Flagship Model A3 in Turquoise' },
    // the featured card runs the A3's colorways on its own, slowly, while it is on screen
    cycle: a3.hero.colorways.options.map((o) => ({ key: o.key, src: o.src, name: o.name })),
    featured: true,
  },
  {
    slug: 'a3s',
    route: '/a3s',
    model: 'A3S',
    lineName: 'Smart Model',
    family: 'A3 family',
    line: 'The A3 platform with a lighter specification and seamless leather as standard.',
    stars: ['Seamless microfiber leather as standard', 'Rolight S with a condition breathing lamp', 'Handpiece holder from 30° to 80°'],
    photo: { src: '/images/chairs/index/a3s-glaze-blue.webp', w: 963, h: 771, baked: true, alt: 'ROSON Smart Model A3S in Coloured Glaze Blue' },
  },
  {
    slug: 'a3l',
    route: '/a3l',
    model: 'A3L',
    lineName: 'Fashion Model',
    family: 'A3 family',
    line: 'The same engineering as the A3, in a darker, more executive finish.',
    stars: ['Medical-grade color LCD with self-test', 'Anti-collision assistant arm', 'Soft start and stop Whisper-Silent Motor'],
    photo: { src: '/images/products/dxa3l/033_Roson_Fashion_Model_A3L_dental_chair__ergonomic_de.jpg', w: 1000, h: 1000, alt: 'ROSON Fashion Model A3L with gray upholstery' },
  },
  {
    slug: 'a1-pro',
    route: '/a1-pro',
    model: 'A1 Pro',
    lineName: 'Color-led unit',
    family: 'A1 series',
    line: 'A 12 mm carbon steel frame, finished in the color your clinic chooses.',
    stars: ['150 kg patient load', 'Rolight S 8-LED light, three modes', 'RS-07 dentist stool included'],
    photo: { src: '/images/products/a1-pro/hero-a1-pro-pink-4x3.webp', w: 1200, h: 900, fit: 'cover', alt: 'ROSON A1 Pro in Ballet Pink' },
  },
  {
    slug: 'n2-pro',
    route: '/n2-pro',
    model: 'N2 Pro',
    lineName: 'Elite Model',
    family: 'N series',
    line: 'The premium unit of the N series, built for heavy daily use in a busy room.',
    stars: ['Widest tray in the series, 650 by 315 mm', 'Independent disinfectant water supply', '180° rotatable ceramic spittoon'],
    photo: { src: '/images/products/n2-pro/N2 Pro Dental Chair/2-2.jpg', w: 1000, h: 1000, alt: 'ROSON Elite Model N2 Pro' },
  },
  {
    slug: 'n2-plus',
    route: '/n2-plus',
    model: 'N2 Plus',
    lineName: 'Classic Model',
    family: 'N series',
    line: 'The most complete standard configuration in the N series.',
    stars: ['5-in-1 tissue box and LED X-ray viewer built in', 'Two 1 L pure water bottles', '8-Tooth Smile Philips LED light'],
    photo: { src: '/images/chairs/index/n2-plus-front.webp', w: 1800, h: 1439, baked: true, alt: 'ROSON Classic Model N2 Plus' },
  },
  {
    slug: 'n1',
    route: '/n1',
    model: 'N1',
    lineName: 'Classic Model',
    family: 'N series',
    line: 'The simplest setup in the lineup, arriving as a complete operatory.',
    stars: ['Right arm swings clear for patient access', 'One starter for air, water and electricity', '180° rotatable ceramic spittoon'],
    photo: { src: '/images/products/n1/N1 Dental Chair/N1_1.jpg', w: 640, h: 640, alt: 'ROSON Classic Model N1' },
  },
  {
    slug: 's9',
    route: '/s9',
    model: 'S9',
    lineName: 'Affordable Luxury Model',
    family: 'S series',
    line: 'Waterline disinfection and memory positions, one step below the flagship.',
    stars: ['45° ergonomic operation panel', 'One-key smart drainage', 'Breathable seamless microfiber leather'],
    photo: { src: '/images/products/s9/main.jpg', w: 640, h: 640, alt: 'ROSON Affordable Luxury Model S9' },
  },
  {
    slug: 's6',
    route: '/s6',
    model: 'S6',
    lineName: 'Professional Model',
    family: 'S series',
    line: 'Goes down to 380 mm, 20 mm lower than any other ROSON chair.',
    stars: ['Casting steel frame and backrest support', 'Compact assistant unit for four-handed work', '4-way hands-free foot control'],
    photo: { src: '/images/chairs/index/s6-cart.webp', w: 1800, h: 1441, baked: true, alt: 'ROSON Professional Model S6 with its delivery cart' },
  },
  {
    slug: 's3',
    route: '/s3',
    model: 'S3',
    lineName: 'Hot-Selling Model',
    family: 'S series',
    line: 'Built around cleaning, with parts that come apart for sterilizing.',
    stars: ['Autoclavable light handle', 'Detachable spittoon, no tools needed', 'LED sensor light at 35,000 lux or more'],
    photo: { src: '/images/products/s3/S3 Dental Chair/S3_1.jpg', w: 640, h: 640, alt: 'ROSON Hot-Selling Model S3' },
  },
];

export const INDEX_COPY = {
  hero: {
    kicker: 'ROSON dental chairs',
    title: 'Find the chair for your room',
    line: 'Every ROSON chair we carry, side by side. Tap one to see how it works.',
    stars: [
      'Free ocular visit to measure your operatory',
      'Tested on an eight point checklist before it ships',
      '2-year warranty on every chair, parts and service in year one',
    ],
    ctas: [
      { label: 'Visit the showroom', href: '/contact#showroom', primary: true },
      { label: 'Send an inquiry', href: '/contact#inquiry' },
    ],
  },
  door: {
    kicker: 'Pasig showroom',
    title: 'Visit the Pasig showroom',
    line: 'Sit in the chairs, run them through their travel, and bring your operatory measurements.',
    address: '610 C. Raymundo Avenue, Maybunga, Pasig City',
    hours: 'Monday to Sunday, 9 AM to 8 PM',
    photo: null,
    ctas: [
      { label: 'Visit the showroom', href: '/contact#showroom', primary: true },
      { label: 'Send an inquiry', href: '/contact#inquiry' },
      { label: 'Message us', href: 'https://m.me/dentasource', external: true },
    ],
  },
};
