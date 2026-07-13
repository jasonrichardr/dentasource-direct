// Content spine for the Denjoy DNA landing (apechain-mobile blueprint).
// Product data itself lives in src/data/denjoy.js — this file only orders
// and augments it for the scene composition.

import { denjoyProducts, denjoyChapters } from '@/data/denjoy';

// The six stars of the hero arc, in ring order (flagship faces first).
const ARC_SLUGS = ['meta-endo-pro-i', 'ix7', 'i-pexo', 'meet-endo', 'ix6', 'meta-endo'];

export const arcStars = ARC_SLUGS.map((slug) => {
  const p = denjoyProducts.find((x) => x.slug === slug);
  const chapter = denjoyChapters.find((c) => c.id === p.chapter);
  return { ...p, chapterName: chapter ? chapter.name : '' };
});

export const allInstruments = denjoyProducts.map((p) => ({
  ...p,
  chapterName: (denjoyChapters.find((c) => c.id === p.chapter) || {}).name || '',
}));

export const chapters = denjoyChapters.map((c) => ({
  ...c,
  count: denjoyProducts.filter((p) => p.chapter === c.id).length,
}));

// Menu takeover — ≤5 giant words (blueprint law).
export const menuLinks = [
  { label: 'The Arc', href: '#top' },
  { label: 'Instruments', href: '#instruments' },
  { label: 'Chapters', href: '#chapters' },
  { label: 'Visit Us', href: '/contact' },
];

// Marquee — DSD trust strings (subset of the Navbar trust items).
export const marqueeItems = [
  'White Glove Installation',
  'Hands-On Training Included',
  'Up to 5-Year Motor Warranty',
  'Pasig Showroom Demos',
  'Nationwide Delivery',
  'Philippine-Based Support',
];

// On-page FAQ — mirrors the JSON-LD faqSchema in page.js (SEO parity).
export const faqs = [
  {
    q: 'How many Denjoy products does DSD carry?',
    a: 'Twelve, as of 2026 — 3 integrated systems (Meet Endo, Meta Endo Pro I, Meta Endo), 2 apex locators (FREE PEX, i-Pexo), 2 microscopes (ix6, ix7), the i-Moto cordless motor, and 4 auxiliary products (iUe1, iCure, iPack, Meta Pack). DentaSource Direct is the exclusive Philippine distributor.',
  },
  {
    q: 'Where can I demo a unit before buying?',
    a: 'At the DentaSource Direct Pasig showroom — 610 C. Raymundo Ave, Pasig City. The Meet Endo flagship is installed for live demos; other units are demo-ready by appointment. Message us to schedule.',
  },
  {
    q: 'Is DSD an official Denjoy distributor?',
    a: 'DSD is the exclusive Denjoy distributor in the Philippines. Every unit includes local warranty, hands-on training, and Philippine-based support — not just import paperwork.',
  },
];

export const MESSENGER_HANDLE = 'dentasource';

export const messengerUrl = (text) =>
  `https://m.me/${MESSENGER_HANDLE}?ref=${encodeURIComponent(text)}`;
