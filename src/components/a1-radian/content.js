/* ─────────────────────────────────────────────────────────────────────
   ROSON A1 Pro — content for the rideradian-DNA page.
   Copy laws (DSD, locked): no competitor names, no emojis, Pasig showroom,
   real product angles, learning-first (no "#1" roadmaps). Say less, bigger.
   Reuses the existing curated copy in ../a1-pro/a1proContent.js.
   ───────────────────────────────────────────────────────────────────── */

export { signatureColors, dentistSegments, a1proFaqs } from '../a1-pro/a1proContent';

const P = '/images/products/a1-pro/pieces';
const HM = '/images/products/a1-pro/hero-morph';
const NEWS = '/images/news/roson-a1-2026'; // the clean, mobile-perfect ROSON deck panels (from the news guide)

/* ── Article panels (Jarich's pick) ──────────────────────────────────────
   The finished ROSON deck pages: each is a self-contained editorial card
   (image + heading + caption baked in), sized tall for mobile. We show them
   WHOLE at native ratio — never overlay our own captions (they'd clash). */
export const featurePanels = [
  {
    src: `${NEWS}/a1-frame-system.jpg`, ratio: 0.685,
    alt: 'Stable Core chair frame — 12 mm steel, 150 kg load — and the sleep-grade moving system',
    title: 'Rock-solid. 150 kg.',
    copy: 'A 12 mm carbon-steel core holds steady under every procedure — no wobble, no drift — and the sleep-grade motion rises and falls without a lurch.',
  },
  {
    src: `${NEWS}/a1-shortcuts.jpg`, ratio: 0.685,
    alt: 'Pro Shortcut Combos and the 4-position adjustable handpiece holder',
    title: 'Your shortcuts, one touch.',
    copy: 'Pro Shortcut Combos recall your positions and run cup-fill, rinse and pipeline flush on their own — the 4-position handpiece holder keeps every instrument where your hand expects it.',
  },
  {
    src: `${NEWS}/a1-rolight.jpg`, ratio: 0.685,
    alt: 'Rolight S dental light, spittoon odor trap, and integrated handle',
    title: 'Light that adapts.',
    copy: 'The Rolight S covers the whole oral cavity in three modes — yellow, white, mixed — with a removable handle for disinfection and a rotary odor-trap spittoon.',
  },
  {
    src: `${NEWS}/a1-cup-upholstery.jpg`, ratio: 0.685,
    alt: 'Patient self-help cup filling and the soft silicone rubber leather upholstery',
    title: 'Patients help themselves.',
    copy: 'One-touch cup filling the patient can reach, wrapped in soft silicone rubber leather — stain-resistant, hypoallergenic, and built to be wiped clean all day.',
  },
  {
    src: `${NEWS}/a1-stool.jpg`, ratio: 0.685,
    alt: 'The RS-07 professional dentist stool',
    title: 'The RS-07 stool, included.',
    copy: 'A professional dentist stool ships standard — U-vent seat, adaptive backrest, sloped leg rest — engineered against the lumbar and circulatory strain of long chairside days.',
  },
  {
    src: `${NEWS}/a1-four-handed.jpg`, ratio: 1.464,
    alt: 'The A1 four-handed treatment space, seen from above',
    title: 'Built for four hands.',
    copy: 'An operatory laid out for the whole team — everything within reach, seen from above.',
  },
];

/* The moving showcase strip — a beauty-led mix that drifts on its own. */
export const showcasePanels = [
  { src: `${NEWS}/a1-glamour.jpg`, ratio: 0.685, alt: 'ROSON A1 in Ballet Pink' },
  { src: `${NEWS}/a1-frame-system.jpg`, ratio: 0.685, alt: 'Stable Core chair frame — 12 mm steel, 150 kg load' },
  { src: `${NEWS}/a1-shortcuts.jpg`, ratio: 0.685, alt: 'Pro Shortcut Combos and the 4-position handpiece holder' },
  { src: `${NEWS}/a1-rolight.jpg`, ratio: 0.685, alt: 'Rolight S dental light and spittoon' },
  { src: `${NEWS}/a1-cup-upholstery.jpg`, ratio: 0.685, alt: 'Patient self-help cup filling and silicone upholstery' },
  { src: `${NEWS}/a1-stool.jpg`, ratio: 0.685, alt: 'The RS-07 professional dentist stool' },
  { src: `${NEWS}/a1-four-handed.jpg`, ratio: 1.464, alt: 'The A1 four-handed treatment space, from above' },
  { src: `${NEWS}/a1-tone-setter.jpg`, ratio: 1.464, alt: 'Integrated color customization across the unit' },
];

/* The color-library moving strip — the color cards, drifting. */
export const colorPanels = [
  { src: `${NEWS}/a1-signature-colors.jpg`, ratio: 0.685, alt: 'The three A1 signature colors — ROSON Blue, Ballet Pink, Mint Green' },
  { src: `${NEWS}/a1-tone-setter.jpg`, ratio: 1.464, alt: 'Integrated color customization — upholstery, water box, and instrument tray matched' },
  { src: `${NEWS}/a1-upholstery-charts.jpg`, ratio: 1.464, alt: 'The full upholstery palette — soft silicone rubber leather and medical-grade PU' },
  { src: `${NEWS}/a1-glamour.jpg`, ratio: 0.685, alt: 'ROSON A1 in Ballet Pink' },
];

/* Hero color-morph frames — three real colorways of one render, same angle. */
export const heroFrames = [
  { key: 'blue', name: 'ROSON Blue', code: 'FS21', src: `${HM}/a1-hero-blue-v2.webp`, swatch: '#3D6F90' },
  { key: 'pink', name: 'Ballet Pink', code: 'FS22', src: `${HM}/a1-hero-pink-v2.webp`, swatch: '#D87B8A' },
  { key: 'mint', name: 'Mint Green', code: 'FS23', src: `${HM}/a1-hero-mint-v2.webp`, swatch: '#9BC5B4' },
];

export const hero = {
  eyebrow: 'The ROSON A1 Pro',
  headline: ['Your clinic.', 'Your color.'],
  sub: 'A dental unit built for the new generation of dentists.',
  primary: { label: 'Book a showroom demo', href: '/contact?interest=dental-chairs' },
  secondary: { label: 'Explore the A1 Pro', href: '#a1-color' },
  scrollHint: 'Scroll',
};

/* USP spotlight — the "why the A1 Pro" argument, one line at a time.
   Eight benefit-led titles (Jarich asked for more than five). Each product
   also earns its own dedicated section below; this is the headline case.
   Every item carries its image's NATIVE ratio — the media panel bends to the
   photo (NativeImg), so nothing is ever cropped, portrait or ultra-wide. */

/* Statement interlude — the young-generation manifesto. */
export const manifesto = {
  headline: ['Some dentists inherit a room.', 'You design one.'],
  body: 'The A1 Pro treats color as a first-class engineering choice, not an afterthought. Solid performance to support your diagnosis, premium aesthetics to brighten your practice — where beauty meets capability, and style walks with professionalism.',
  cta: { label: 'Explore the color library', href: '#a1-color' },
  bg: `${P}/atmosphere-pink-chair-curtains-clean.png`,
};

/* Engineers — the making. Real production-base + QC-lab photography (native
   ratio, never cropped), a self-built stat tile, demoted spec-ticks, creds.
   Language law: "production base", never "factory". */

/* Color library — the 44-color story told with real ROSON swatch walls at
   native ratio (marquee retired). Signatures strip up top, then the two full
   material walls side by side. signatureColors (names + hex + poetry) imported. */

/* Configurations — the official ROSON A1 product-configuration table
   (PDF p.19–20), three mounting models at native ratio. Standard (√) vs the
   four optional (△) clinical add-ons, verbatim from the sheet. */
export const configurations = {
  eyebrow: 'A configuration for every scenario',
  headline: ['Three ways', 'to build it.'],
  intro: 'The A1 Pro adapts to your operatory — a top-mounted delivery unit, an implant-ready setup, or a mobile trolley. Everything in the standard column ships as standard; four clinical add-ons are optional.',
  // one clean article panel showing all three mounting models (shown whole)
  panel: { src: `${NEWS}/a1-configurations.jpg`, ratio: 0.685, alt: 'The three A1 mounting configurations — top-mounted, implant, and trolley' },
  standard: [
    'PU upholstery',
    'Soft start & stop system',
    'Stable Core chair base',
    'Patient self-help cup filler',
    'Detachable & rotatable ceramic spittoon',
    'One-key water-source switch',
    'ROSON intelligent control system',
    'Error self-check program',
    'Error-code display',
    'Intelligent memory chair position',
    'Intelligent draining pipeline rinse',
    'Cup-fill & spittoon-rinse linkage',
    'Multifunction foot control',
    'Rolight S LED light',
    'RS-07 dentist stool',
    'LED X-ray viewer',
  ],
  optional: ['Built-in scaler', 'Built-in micro motor', 'Built-in curing light', 'Intraoral camera'],
  note: 'Per the ROSON A1 product-configuration sheet; final build confirmed at quote.',
};

/* Closing — the Pasig showroom moment. */
export const closing = {
  // ruler counts colors, not units (A1 Pro isn't limited-run)
  rulerStart: 'FS 01 / 44',
  rulerEnd: '44 / 44',
  coords: '14.5764°N  121.0851°E',
  coordsLabel: 'DentaSource showroom · Pasig',
  headline: ['See every color', 'in person.'],
  body: 'Sit in it. Recline it. Feel the silicone leather and pick your color. The country’s largest dental showroom is in Pasig — service and parts supported locally.',
  priceLine: 'Complete chair · stool · light · X-ray viewer — included as standard.',
  primary: { label: 'Book a showroom demo', href: '/contact?interest=dental-chairs' },
  secondary: { label: 'Request a quote', href: '/contact?interest=dental-chairs' },
  disclaimer: 'Configuration may vary. Specifications confirmed at showroom demo and quote.',
  bg: `${P}/four-handed-top-down-pink-clean.png`,
  // old A1 Pro hero loop — color-reveal film, now the living backdrop of the showroom finale
  video: '/videos/a1-pro-hero-loop.mp4',
};

/* Tech specs — the full mono definition list (superset of the JSON-LD schema;
   Configurations reflect the ROSON A1 mounting options, confirmed at quote). */
export const techSpecs = [
  ['Frame', '12 mm premium carbon structural steel'],
  ['Maximum patient load', '150 kg'],
  ['Motion system', 'Sleep-grade soft start / stop'],
  ['Operating light', 'Rolight S — 8-LED, tri-mode (yellow / white / mixed)'],
  ['Light control', 'Infrared sensing + manual button, removable handle'],
  ['Memory positions', 'Intelligent chair-position recall (one-touch)'],
  ['Smart workflow', 'Smart Clean: 5-min spittoon rinse + pipeline flush'],
  ['Handpiece holder', '4-position adjustable (storage + 2 grip angles)'],
  ['Spittoon', 'Detachable ceramic with rotary odor trap'],
  ['Film viewer', 'LED X-ray viewer — built-in, standard'],
  ['Upholstery', 'Soft silicone rubber leather or medical-grade PU leather'],
  ['Signature colors', 'ROSON Blue · Ballet Pink · Mint Green'],
  ['Custom colors', '44 colorways — FS silicone + PU leather ranges'],
  ['Dentist stool', 'RS-07 Professional (included standard)'],
  ['Configurations', 'Top-mounted · Implant · Trolley'],
  ['Optional add-ons', 'Built-in scaler · micro motor · curing light · intraoral camera'],
  ['Origin', 'Foshan Roson Medical, China'],
  ['Warranty', 'Up to 5 years on the motor'],
];
