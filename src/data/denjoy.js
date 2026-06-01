// src/data/denjoy.js
//
// Source of truth for the /denjoy landing page and detail pages.
// Chapters are first-class. Products carry a `chapter` foreign key.

// SECURITY NOTE: every product's `denjoyUrl` field uses http://www.denjoy.cn/...
// Denjoy's SSL certificate is expired (locked memory: reference_denjoy_ssl_expired).
// These URLs are stored as back-pointers for content updates only — DO NOT render
// them as clickable <a href> in user-facing UI without a "leaving secure site"
// confirmation, or browsers will surface a mixed-content / NET::ERR_CERT_DATE_INVALID
// warning. Use them only in admin contexts or in source comments.

// ✦ NEW badge stays visible for 90 days from launchedAt, then auto-fades.
// Eased from manual cleanup so launches don't require a follow-up commit.
const NEW_BADGE_DAYS = 90;

export const denjoyChapters = [
  { id: 'integrated',  roman: 'I',   name: 'Integrated Systems',
    color: '#ffd49a',  position: 'top'         },          // 0°
  { id: 'apex',        roman: 'II',  name: 'Apex Locators',
    color: '#9ad4ff',  position: 'upper-right' },          // 72°
  { id: 'microscopes', roman: 'III', name: 'Microscopes',
    color: '#c4a4ff',  position: 'lower-right' },          // 144°
  { id: 'motors',      roman: 'IV',  name: 'Motors & Tools',
    color: '#ff9ad4',  position: 'lower-left'  },          // 216°
  { id: 'auxiliary',   roman: 'V',   name: 'Auxiliary & Packs',
    color: '#9affc4',  position: 'upper-left'  },          // 288°
];

export const denjoyProducts = [
  // ============================================================
  // Chapter I — Integrated Systems
  // ============================================================
  {
    slug: 'meta-endo-pro-i',
    name: 'Meta Endo Pro I',
    fullName: 'Meta Endo Pro I Endodontic System',
    tagline: 'Surf the canal with joy.',
    chapter: 'integrated',
    isFlagship: true,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 58,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/58.html',
    heroImage: '/images/denjoy/meta-endo-pro-i/hero.jpg',
    gallery: [],
    keyFeatures: [
      'Pro evolution of the Meta Endo integrated platform.',
      'Same trusted Denjoy 4-in-1 endo workflow with refinements.',
      'Configurable per clinic operatory layout.',
      'Coming to DSD Manila showroom for live demo.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Meta Endo Pro I.",
    videos: [],
  },
  {
    slug: 'meet-endo',
    name: 'Meet Endo',
    fullName: 'Meet Endo All-in-One Endodontic System',
    tagline: 'The integrated endodontic system, reimagined.',
    chapter: 'integrated',
    isFlagship: false,
    isNew: false,
    launchedAt: '2026-04-20',
    denjoyId: 22,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/22.html',
    heroImage: '/images/denjoy/meet-endo/meetendo-studio-ui-on.jpg',
    gallery: [
      '/images/denjoy/meet-endo/denjoy-meetendo-1.jpg',
      '/images/denjoy/meet-endo/denjoy-meetendo-2.jpg',
      '/images/denjoy/meet-endo/meetendo-showroom-front.jpg',
      '/images/denjoy/meet-endo/meetendo-showroom-full.jpg',
      '/images/denjoy/meet-endo/meetendo-studio-alt.jpg',
    ],
    modules: [
      { name: 'MeetPex',   role: 'Apex Locator',  color: '#2a4d7a', description: 'Precision apex detection integrated into the touchscreen module.' },
      { name: 'MeetMotor', role: 'Endo Motor',    color: '#5c1a3a', description: 'Cordless endo motor with programmable torque profiles.' },
      { name: 'MeetFill',  role: 'GP Obturation', color: '#1a3c34', description: 'Gutta-percha obturation with thermal delivery control.' },
    ],
    keyFeatures: [
      'Integrated touchscreen running the MeetPex, MeetMotor, and MeetFill modules in one workflow.',
      'Mobile rolling cart — fits small Philippine clinic operatories.',
      'Four pen-holder slots for connected handpieces.',
      'Already installed at DSD Manila showroom for demo.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy Meet Endo.",
    videos: [
      { id: 'O6odfHoymqw', title: 'Denjoy Meet-Endo brand film', duration: '0:43' },
      { id: 'nlgMFP3HzJs', title: 'Meet Endo: The Ultimate Integrated Root Canal System', duration: '0:55' },
      { id: 'k2ZrdMYsfRg', title: 'Meta Endo 4-in-1 Unboxing', duration: '4:37' },
      { id: 'ney0zANs43E', title: '2024 Shanghai Dental Expo Highlight', duration: '0:33' },
    ],
  },
  {
    slug: 'meta-endo',
    name: 'Meta Endo',
    fullName: 'Meta Endo 4-in-1 Endodontic System',
    tagline: 'Four-in-one endo, classic.',
    chapter: 'integrated',
    isFlagship: false,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 23,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/23.html',
    heroImage: '/images/denjoy/meta-endo/hero.jpg',
    gallery: [],
    keyFeatures: [
      '4-in-1 integrated endo system — apex locator + motor + fill + activation in one base unit.',
      'The reference platform the Meet Endo and Meta Endo Pro I evolved from.',
      'Trusted Denjoy lineage since 2004.',
      'Suitable for clinics scaling endo capacity without going full Meta Endo Pro I.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Meta Endo.",
    videos: [
      { id: 'k2ZrdMYsfRg', title: 'Meta Endo 4-in-1 Unboxing', duration: '4:37' },
    ],
  },

  // ============================================================
  // Chapter II — Apex Locators
  // ============================================================
  {
    slug: 'free-pex',
    name: 'FREE PEX',
    fullName: 'FREE PEX Benchtop Apex Locator',
    tagline: 'Benchtop apex locator, built to stay put.',
    chapter: 'apex',
    isFlagship: false,
    isNew: false,
    launchedAt: '2026-04-20',
    denjoyId: 29,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/29.html',
    heroImage: '/images/denjoy/free-pex/freepex-three-quarter.jpg',
    gallery: [
      '/images/denjoy/free-pex/denjoy-freepex-1.jpg',
      '/images/denjoy/free-pex/denjoy-freepex-2.jpg',
      '/images/denjoy/free-pex/freepex-front.jpg',
    ],
    keyFeatures: [
      'Benchtop form factor — parks on the operatory counter, never rolls away.',
      'Large color display readable from chair-side.',
      'Multi-frequency measurement for wet or dry canals.',
      'Built by Denjoy, endo specialists since 2004.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy FREE PEX.",
    videos: [
      { id: 'bjmTrWOAK1c', title: 'New 6th-Generation Multi-Frequency Chip', duration: '1:20' },
      { id: '-GcLmwsAbPQ', title: 'Cost-Effective Accuracy Demonstration', duration: '2:40' },
      { id: 'xprn-n8mIsg', title: 'High-Accuracy 6th-Gen Apex Locator', duration: '1:20' },
    ],
  },
  {
    slug: 'i-pexo',
    name: 'i-Pexo',
    fullName: 'i-Pexo Touchable Apex Locator',
    tagline: 'The apex locator that feels like a phone.',
    chapter: 'apex',
    isFlagship: false,
    isNew: false,
    launchedAt: '2026-04-20',
    denjoyId: 31,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/31.html',
    heroImage: '/images/denjoy/i-pexo/denjoy-ipexo-1.jpg',
    gallery: [
      '/images/denjoy/i-pexo/denjoy-ipexo-2.jpg',
      '/images/denjoy/i-pexo/denjoy-ipexo-3.jpg',
      '/images/denjoy/i-pexo/denjoy-ipexo-4.jpg',
      '/images/denjoy/i-pexo/denjoy-ipexo-5.jpg',
    ],
    keyFeatures: [
      'Touchable phone-format interface — intuitive for any modern clinician.',
      'Same measurement engine that powers the MeetPex module inside Meet Endo.',
      'Rechargeable battery with all-day clinic endurance.',
      'Wireless handpiece connection.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy i-Pexo.",
    videos: [
      { id: 'jmpYr-jqe0s', title: 'High-Precision Touchscreen Apex Locator', duration: '1:27' },
      { id: 'b1zRZSZMnMw', title: 'How to Operate a High-Accuracy Apex Locator', duration: '1:20' },
    ],
  },

  // ============================================================
  // Chapter III — Microscopes
  // ============================================================
  {
    slug: 'ix7',
    name: 'ix7',
    fullName: 'ix7 Dental Microscope',
    tagline: 'See the canal, properly.',
    chapter: 'microscopes',
    isFlagship: false,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 24,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/24.html',
    heroImage: '/images/denjoy/ix7/hero.jpg',
    gallery: [],
    keyFeatures: [
      'High-magnification dental microscope for endodontic precision.',
      'The flagship microscope in Denjoy\'s ix family.',
      'Pairs with the Meet Endo workflow for full-system endodontics.',
      'Local install + training via DSD Manila showroom.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy ix7 microscope.",
    videos: [
      { id: 's-m0MTzbhe0', title: 'Microscope Unboxing & Installation', duration: '6:38' },
      { id: 'BzjLwsg2q0s', title: 'Explore Denjoy Microscope (Part II)', duration: '6:58' },
      { id: 'ofFaQAONEzM', title: 'Explore Denjoy Microscope (Part I)', duration: '7:50' },
    ],
  },
  {
    slug: 'ix6',
    name: 'ix6',
    fullName: 'ix6 Dental Microscope',
    tagline: 'High-precision optics, made local.',
    chapter: 'microscopes',
    isFlagship: false,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 25,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/25.html',
    heroImage: '/images/denjoy/ix6/hero.jpg',
    gallery: [],
    keyFeatures: [
      'Mid-tier dental microscope in the ix family.',
      'Same Denjoy optics quality, more accessible price point.',
      'Suitable for clinics scaling into microscope-assisted endo.',
      'Demos available at DSD Manila showroom.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy ix6 microscope.",
    videos: [
      { id: 's-m0MTzbhe0', title: 'Microscope Unboxing & Installation', duration: '6:38' },
    ],
  },

  // ============================================================
  // Chapter IV — Motors & Tools
  // ============================================================
  {
    slug: 'i-moto',
    name: 'i-Moto',
    fullName: "i-Moto Dentist's Dexterous Tool",
    tagline: 'Cordless precision, dentist-grade.',
    chapter: 'motors',
    isFlagship: false,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 36,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/36.html',
    heroImage: '/images/denjoy/i-moto/hero.jpg',
    gallery: [],
    keyFeatures: [
      'Cordless endo motor in the i-family lineage.',
      'Programmable torque profiles for rotary file work.',
      'Same motor engine inside the Meet Endo MeetMotor module.',
      'Compact form fits any glove.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy i-Moto.",
    videos: [],
  },

  // ============================================================
  // Chapter V — Auxiliary & Packs
  // ============================================================
  {
    slug: 'iue1',
    name: 'iUe1',
    fullName: 'iUe1 Ultrasonic Activator',
    tagline: 'Ultrasonic irrigation, evolved.',
    chapter: 'auxiliary',
    isFlagship: false,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 41,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/41.html',
    heroImage: '/images/denjoy/iue1/hero.jpg',
    gallery: [],
    keyFeatures: [
      'Ultrasonic activator for more effective root canal irrigation.',
      "The successor to AIKE in Denjoy's ultrasonic line.",
      'Ergonomic handpiece with multiple tip options.',
      'Pairs with any apex-locator-driven endo workflow.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy iUe1.",
    videos: [
      { id: 'dqI_autD9Ko', title: 'Denjoy iUe1 ultrasonic activator', duration: '0:30' },
    ],
  },
  {
    slug: 'icure',
    name: 'iCure',
    fullName: 'iCure Cordless Obturation System',
    tagline: 'Cordless GP obturation, simplified.',
    chapter: 'auxiliary',
    isFlagship: false,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 39,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/39.html',
    heroImage: '/images/denjoy/icure/hero.jpg',
    gallery: [],
    keyFeatures: [
      'Cordless GP obturation system from the i-family.',
      'Thermal delivery control for predictable canal sealing.',
      'Pairs with FREE PEX, i-Pexo, or Meet Endo workflows.',
      'Compact form for chairside operatory use.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy iCure.",
    videos: [],
  },
  {
    slug: 'ipack',
    name: 'iPack',
    fullName: 'iPack Endo Accessory Bundle',
    tagline: 'Everything the i-family pairs with.',
    chapter: 'auxiliary',
    isFlagship: false,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 28,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/28.html',
    heroImage: '/images/denjoy/ipack/hero.jpg',
    gallery: [],
    keyFeatures: [
      'Curated accessory bundle for the i-family endo line.',
      'Standardized consumables and tip options across i-Pexo, i-Moto, iCure.',
      'Reduces consumable SKU sprawl in the operatory.',
      'Ask DSD for the current iPack contents.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy iPack.",
    videos: [],
  },
  {
    slug: 'meta-pack',
    name: 'Meta Pack',
    fullName: 'Meta Pack Integrated System Bundle',
    tagline: 'Everything the Meta line pairs with.',
    chapter: 'auxiliary',
    isFlagship: false,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 26,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/26.html',
    heroImage: '/images/denjoy/meta-pack/hero.jpg',
    gallery: [],
    keyFeatures: [
      'Curated accessory bundle for the Meta Endo line.',
      'Consumables and tips matched to Meta Endo and Meta Endo Pro I workflows.',
      'Sized for high-volume endo practices.',
      'Ask DSD for the current Meta Pack contents.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy Meta Pack.",
    videos: [],
  },
];

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------
export const getProductsByChapter = (chapterId) =>
  denjoyProducts.filter((p) => p.chapter === chapterId);

export const getFlagship = () =>
  denjoyProducts.find((p) => p.isFlagship);

export const getDenjoyBySlug = (slug) =>
  denjoyProducts.find((p) => p.slug === slug);

export const getNewProducts = () =>
  denjoyProducts.filter(
    (p) =>
      p.isNew &&
      Date.now() - new Date(p.launchedAt) < NEW_BADGE_DAYS * 24 * 60 * 60 * 1000
  );

// Backwards-compatible helper used by /denjoy/[slug] and others.
// Filters out the flagship from the co-stars list.
export const getCoStars = () =>
  denjoyProducts.filter((p) => !p.isFlagship);
