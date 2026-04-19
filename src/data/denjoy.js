export const denjoyProducts = [
  {
    slug: 'meet-endo',
    name: 'Meet Endo',
    fullName: 'Meet Endo All-in-One Endodontic System',
    tagline: 'The integrated endodontic system, reimagined.',
    isFlagship: true,
    category: 'integrated-system',
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
  },
  {
    slug: 'free-pex',
    name: 'FREE PEX',
    fullName: 'FREE PEX Benchtop Apex Locator',
    tagline: 'Benchtop apex locator, built to stay put.',
    isFlagship: false,
    category: 'apex-locator',
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
  },
  {
    slug: 'i-pexo',
    name: 'i-Pexo',
    fullName: 'i-Pexo Touchable Apex Locator',
    tagline: 'The apex locator that feels like a phone.',
    isFlagship: false,
    category: 'apex-locator',
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
  },
  {
    slug: 'aike',
    name: 'AIKE',
    fullName: 'AIKE Ultrasonic Activator',
    tagline: 'Ultrasonic irrigation, evolved.',
    isFlagship: false,
    category: 'ultrasonic',
    heroImage: '/images/denjoy/aike/aike-on-stand.jpg',
    gallery: [
      '/images/denjoy/aike/aike-standalone.jpg',
      '/images/denjoy/aike/denjoy-aike-1.jpg',
    ],
    keyFeatures: [
      'Ultrasonic activation that enhances irrigation penetration.',
      'Ergonomic handpiece with multiple tip options.',
      'Dedicated stand to keep the operatory tidy.',
      'The category reference at Denjoy — no sub-model variants.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy AIKE.",
  },
  {
    slug: 'imate3',
    name: 'imate3',
    fullName: 'imate3 Cordless Endo Motor',
    tagline: 'Cordless endo motor, pocket-sized precision.',
    isFlagship: false,
    category: 'endo-motor',
    heroImage: '/images/denjoy/imate3/imate3-front.jpg',
    gallery: [
      '/images/denjoy/imate3/denjoy-imate3-1.jpg',
      '/images/denjoy/imate3/denjoy-imate3-2.jpg',
      '/images/denjoy/imate3/denjoy-imate-ii-alt-1.jpg',
      '/images/denjoy/imate3/denjoy-imate-ii-alt-2.jpg',
    ],
    keyFeatures: [
      '3-in-1 cordless operation — motor, apex locator integration, programmable profiles.',
      'Compact form fits even the smallest glove.',
      'Same motor lineage used inside the Meet Endo MeetMotor module.',
      'Up to 200 cycles per charge — clinic-day endurance.',
    ],
    messengerText: "Hi DSD, I'd like to know more about the Denjoy imate3.",
  },
];

export const getDenjoyBySlug = (slug) =>
  denjoyProducts.find((p) => p.slug === slug);

export const getCoStars = () =>
  denjoyProducts.filter((p) => !p.isFlagship);

export const getFlagship = () =>
  denjoyProducts.find((p) => p.isFlagship);
