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
    fullName: 'Meta Endo Pro I Advanced Endodontic Cart',
    tagline: 'The Meta Endo, in its surgical suit.',
    chapter: 'integrated',
    isFlagship: true,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 58,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/58.html',
    heroImage: '/images/denjoy/meta-endo-pro-i/hero.jpg',
    gallery: [],
    keyFeatures: [
      'Double-layer sterile drawers keep instruments hygienic at chairside — the Pro difference.',
      'Same Denjoy app and same four handpieces as the Meta Endo: motor, apex locator, down-pack pen, backfill gun.',
      'Up-mounted device base frees floor space; layout designed for two-handed operation.',
      'Live demos at the DSD Pasig showroom.',
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
      '7-inch capacitive touchscreen base showing live data from every wireless handpiece (2.4G auto-reconnect).',
      '68Wh built-in battery charges up to 5 devices at once — one cable for the whole endo workflow.',
      'MeetPex apex locator, MeetMotor prep, MeetPack heat plugger, MeetFill electric backfill — plus optional MeetPulp vitality tester.',
      'Installed at the DSD Pasig showroom for live demo.',
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
      '4-in-1 cart: endo motor, apex locator, down-pack heat pen, and backfill gun in one mobile station.',
      'Handpieces run cordless with the Denjoy app — the trolley is optional, the workflow is not.',
      'Integrated tray charging: every handpiece docks and charges in place, no loose cables.',
      'Standard configuration: down-mounted base, rotatable arm, dual-tray storage.',
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
      '6th-generation multi-frequency chip — accurate in wet or dry canals.',
      '3.9-inch color display: canal graphic, color-coded depth bar, numeric apex readout.',
      'Automatic calibration with included calibrator — immune to temperature and moisture swings.',
      'Full kit in the box: probe cable, 2 file holders, 4 hooks, calibrator, charger.',
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
      '4.3-inch capacitive touchscreen (480×800) — works portrait or landscape, gyroscope auto-rotates.',
      '200g and 40% lighter than the previous generation, with 50% less bulk.',
      'Color-coded canal bar: blue to apex, green approaching, yellow at apex, red over.',
      '3.7V 2000mAh battery for all-day clinic endurance.',
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
      'Stepless 0.4–2.4x zoom — magnification glides, never jumps mid-procedure.',
      '18W LED at ≥70,000 lx with yellow, green, and clear filters.',
      '12.5x eyepieces, ±6D diopter, 200–450mm variable-zoom objective.',
      'FDA, CE, and ISO 13485 certified. Install + training via the DSD Pasig showroom.',
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
      '5-step magnification (0.4x to 2.5x) with apochromatic multi-coated optics.',
      'LED illumination over 70,000 lx; yellow filter protects composites, green boosts vascular contrast.',
      'Config tiers up to an integrated 4K SONY-sensor camera (3840×2160 recording).',
      'Floor stand or tabletop clip. Demos at the DSD Pasig showroom.',
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
      '2-in-1 motor: endo prep on the 16:1 head (100–1000 rpm), polishing on the 4:1 head (500–4000 rpm).',
      '0.4–3.5 N·cm torque with nine P1–P9 presets storing speed, torque, and direction.',
      '85g coreless-motor body with a 360° articulating head — left- or right-hand modes.',
      'Continuous, reciprocating, and ACC modes on a color display.',
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
      '45kHz ultrasonic activation for more effective irrigant agitation.',
      'Tips pass through fine and curved canals — also rated for retreatment and broken-file removal.',
      'Cordless handpiece, 3.7V 2000mAh battery, charges from any USB adapter.',
      'Ships with a series of interchangeable ultrasonic working tips.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy iUe1.",
    videos: [
      { id: 'dqI_autD9Ko', title: 'Denjoy iUe1 ultrasonic activator', duration: '0:30' },
    ],
  },
  {
    slug: 'icure',
    name: 'iCure',
    fullName: 'iCure Cordless LED Curing Light',
    tagline: 'Six jobs. One 103-gram light.',
    chapter: 'auxiliary',
    isFlagship: false,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 39,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/39.html',
    heroImage: '/images/denjoy/icure/hero.jpg',
    gallery: [],
    keyFeatures: [
      '600–3000mW/cm² output — max intensity cures in 1 to 3 seconds (Ramp, Pulse, Super, Standard modes).',
      'Two swappable LED heads: curing, ortho bonding, and bleaching on one; caries detection, disinfection, and canal illumination on the other.',
      '103g aviation-aluminum body with a 360° rotatable head.',
      'OLED readout for mode, intensity, timer, and battery; charging base included.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy iCure.",
    videos: [],
  },
  {
    slug: 'ipack',
    name: 'iPack',
    fullName: 'iPack Cordless Gutta-Percha Down-Packer',
    tagline: 'Warm GP cutting, cordless.',
    chapter: 'auxiliary',
    isFlagship: false,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 28,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/28.html',
    heroImage: '/images/denjoy/ipack/hero.jpg',
    gallery: [],
    keyFeatures: [
      'Cordless down-pack pen (model DY-GP) with three thermostatic settings: 150, 200, and 220°C.',
      '360° activation switch with fast heat-up and precise heated-tip control that reduces scald accidents.',
      'Four color-coded plugger tips — F, FM, M, ML — covering most GP points on the market.',
      'Ambidextrous minimalist body with rapid-charge base.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy iPack.",
    videos: [],
  },
  {
    slug: 'meta-pack',
    name: 'Meta Pack',
    fullName: 'Meta Pack Down-Pack Heat Pen',
    tagline: '200°C in 0.2 seconds.',
    chapter: 'auxiliary',
    isFlagship: false,
    isNew: true,
    launchedAt: '2026-05-11',
    denjoyId: 26,
    denjoyUrl: 'http://www.denjoy.cn/sys-pd/26.html',
    heroImage: '/images/denjoy/meta-pack/hero.jpg',
    gallery: [],
    keyFeatures: [
      'Warm vertical condensation heat pen: 100–300°C range, reaching 200°C in 0.2 seconds.',
      'Fills to 3mm from apex for hermetic sealing; four pre-bendable tips (F, FM, M, ML) for curved canals.',
      '360° start/stop ring — activate from any grip angle.',
      'Wireless charging base with accessory tray; on-handle OLED shows live temperature.',
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
