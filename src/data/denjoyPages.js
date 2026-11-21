// src/data/denjoyPages.js — the words and photographs of the light Denjoy pages: the /denjoy
// hub and all twelve instrument pages (src/components/denjoy/light/).
//
// src/data/denjoy.js stays the catalog (slugs, names, chapters, videos, Messenger text, and
// the sitemap and JSON-LD read it). This file is the page copy, written on top of it.
//
// SOURCES. Every fact below already stood in the repo before this file existed:
//   - src/data/denjoy.js (keyFeatures, modules, videos)
//   - src/components/denjoy/FreePexLanding.jsx and freePexContent.js (FREE PEX specs, kit,
//     who it suits, warranty, questions)
//   - src/components/denjoy/iPexoContent.js (i-Pexo questions and warranty)
//   - public/images/denjoy/i-pexo/denjoy-ipexo-6.jpg (the maker's i-Pexo specification sheet)
//   - src/components/denjoy/v2/dnaContent.js (the three hub questions)
//   - src/data/cinema/products.json, the denjoy entry (the showroom sentence: the Denjoy bench
//     beside the ROSON chairs, demonstrations by appointment because units are shared)
// Nothing here is invented or "typical for the category". Where a product has no stated
// specification table, warranty term or kit list, its page simply has no such section.
//
// LEFT OUT ON PURPOSE: the chair marquee line about a 5-year motor warranty (it is about
// chairs), the FREE PEX "generation tiers" chart (an industry generalisation, not a product
// fact), every price phrase, and two Meet Endo showroom photos that show a person's face on a
// banner behind the unit.
//
// HOUSE RULES: plain, specific, written to a dentist as a peer. A headline is 7 words or
// fewer, the line under it 24 or fewer. No em or en dashes, no prices, no competitor names,
// Pasig showroom (never Manila).
//
// PHOTOS: `fit: 'cover'` fills the square mat (the maker's studio shots carry their own pale
// ground, which the Denjoy mat color matches). `blend: true` is added for the white-ground
// shots, so their white is multiplied into the mat color.

import { denjoyProducts } from './denjoy';
import { SHOWROOM } from './chairs/shared';

const IMG = '/images/denjoy';
const MESSENGER = 'https://m.me/dentasource';

export const DENJOY_CTA = {
  demo: { label: 'Book a demo', href: '/contact#showroom', primary: true },
  inquire: { label: 'Send an inquiry', href: '/contact#inquiry' },
  all: { label: 'See all Denjoy', href: '/denjoy' },
  message: (text) => ({
    label: 'Message us',
    href: `${MESSENGER}?ref=${encodeURIComponent(text)}`,
    external: true,
    track: true,
  }),
};

// The five groups, in page order. `id` matches the `chapter` key in denjoy.js.
export const DENJOY_FAMILIES = [
  {
    id: 'integrated',
    short: 'Integrated systems',
    kind: 'Integrated system',
    title: 'Integrated systems',
    line: 'One station for the whole root canal: measure, shape, pack and fill.',
  },
  {
    id: 'apex',
    short: 'Apex locators',
    kind: 'Apex locator',
    title: 'Apex locators',
    line: 'Working length you can trust, on the counter or in your hand.',
  },
  {
    id: 'microscopes',
    short: 'Microscopes',
    kind: 'Dental microscope',
    title: 'Microscopes',
    line: 'Magnification and light for the detail the naked eye misses.',
  },
  {
    id: 'motors',
    short: 'Motors',
    kind: 'Cordless motor',
    title: 'Motors',
    line: 'A cordless motor for shaping and polishing.',
  },
  {
    id: 'auxiliary',
    short: 'Obturation and auxiliaries',
    kind: 'Auxiliary',
    title: 'Obturation and auxiliaries',
    line: 'The cordless tools that finish the canal: irrigate, pack and cure.',
  },
];

const PAGES = {
  /* ── integrated systems ─────────────────────────────────────────────────────────── */
  'meta-endo-pro-i': {
    featured: true,
    hero: {
      line: 'The four-handpiece Meta Endo cart, with sterile drawers built in and a base that leaves the floor clear.',
      stars: ['Four handpieces on one cart', 'Double-layer sterile drawers', 'Live demos at our Pasig showroom'],
      photo: { src: `${IMG}/meta-endo-pro-i/hero.jpg`, w: 2000, h: 2000, fit: 'cover', alt: 'Denjoy Meta Endo Pro I cart with a tablet on top, four handpieces in the tray and drawers below' },
    },
    glance: [
      { value: '4', label: 'handpieces on one cart' },
      { value: '2', label: 'layers of sterile drawers' },
      { value: '1', label: 'app runs every handpiece' },
      { value: 'Pasig', label: 'live demos at our showroom' },
    ],
    features: {
      title: 'A full endo station, chairside',
      line: 'Everything the Meta Endo does, on a cart built to keep instruments clean and close.',
      items: [
        { icon: 'layers', title: 'Sterile drawers at the chair', line: 'Double-layer sterile drawers keep instruments hygienic and within reach. This is what the Pro adds.' },
        { icon: 'hand', title: 'Four handpieces, one app', line: 'Endo motor, apex locator, down-pack pen and backfill gun, run from the same Denjoy app as the Meta Endo.' },
        { icon: 'move', title: 'A base that clears the floor', line: 'The device base mounts up top, which frees the floor space under the cart.' },
        { icon: 'check', title: 'Laid out for two hands', line: 'The layout is designed for two-handed operation, so you reach less and keep working.' },
      ],
    },
    card: {
      line: 'The Meta Endo cart with sterile drawers built in.',
      stars: ['Four handpieces, one app', 'Double-layer sterile drawers', 'Up-mounted base frees floor space'],
    },
  },

  'meet-endo': {
    hero: {
      line: 'One touchscreen base runs your apex locator, endo motor, heat plugger and backfill wirelessly, and charges them all.',
      stars: ['7-inch touchscreen base', 'Charges up to 5 devices at once', 'Installed for live demo in Pasig'],
      photo: { src: `${IMG}/meet-endo/meetendo-studio-ui-on.jpg`, w: 1536, h: 2048, fit: 'cover', alt: 'Denjoy Meet Endo touchscreen base showing MeetPex, MeetMotor and MeetFill, with four handpieces docked behind it' },
    },
    glance: [
      { value: '7 in', label: 'capacitive touchscreen base' },
      { value: '68 Wh', label: 'built-in battery' },
      { value: '5', label: 'devices charged at once' },
      { value: '2.4G', label: 'wireless link that reconnects itself' },
    ],
    features: {
      title: 'One screen for the whole procedure',
      line: 'The handpieces are wireless. The base shows what each one is doing and keeps them charged.',
      items: [
        { icon: 'screen', title: 'Every handpiece on one screen', line: 'The 7-inch capacitive touchscreen shows live data from each wireless handpiece. The 2.4G link reconnects automatically.' },
        { icon: 'power', title: 'One cable charges everything', line: 'A 68Wh built-in battery charges up to five devices at once, so one cable covers the whole endo workflow.' },
        { icon: 'layers', title: 'Tools that work as a set', line: 'MeetPex, MeetMotor, MeetPack and MeetFill run together from the base. MeetPulp is an option.' },
        { icon: 'hand', title: 'Try it before you decide', line: 'The demo unit is installed at our Pasig showroom. Hold the handpieces and watch the screen respond.' },
      ],
    },
    modules: {
      kicker: 'The modules',
      title: 'Four tools, plus one option',
      line: 'Each one is a wireless handpiece that reports to the touchscreen.',
      items: [
        { icon: 'ruler', title: 'MeetPex', tag: 'Apex locator', line: 'Apex detection, shown on the touchscreen.' },
        { icon: 'motor', title: 'MeetMotor', tag: 'Endo motor', line: 'Cordless canal preparation with programmable torque profiles.' },
        { icon: 'warm', title: 'MeetPack', tag: 'Heat plugger', line: 'The heat plugger for the down-pack.' },
        { icon: 'syringe', title: 'MeetFill', tag: 'Backfill', line: 'Electric gutta-percha backfill with thermal delivery control.' },
        { icon: 'power', title: 'MeetPulp', tag: 'Optional', line: 'A pulp vitality tester you can add to the set.' },
      ],
    },
    doorPhoto: { src: `${IMG}/meet-endo/meetendo-studio-alt.jpg`, w: 1536, h: 2048, fit: 'cover', alt: 'Meet Endo base seen from above, its touchscreen lit and the handpieces standing in their charging dock' },
    card: {
      line: 'A touchscreen base for four wireless endo handpieces.',
      stars: ['7-inch touchscreen', '68Wh battery charges 5 devices', 'Live demo unit in Pasig'],
    },
  },

  'meta-endo': {
    hero: {
      line: 'Endo motor, apex locator, down-pack pen and backfill gun on one mobile cart that charges them where they rest.',
      stars: ['Four instruments on one cart', 'Cordless handpieces, run by app', 'Handpieces charge in the tray'],
      photo: { src: `${IMG}/meta-endo/hero.jpg`, w: 768, h: 768, fit: 'cover', alt: 'Denjoy Meta Endo cart with a tablet, a tray of four handpieces and two storage shelves' },
    },
    glance: [
      { value: '4', label: 'instruments on one cart' },
      { value: '2', label: 'storage trays' },
      { value: '1', label: 'rotatable arm' },
      { value: '0', label: 'loose charging cables' },
    ],
    features: {
      title: 'Four instruments, one mobile station',
      line: 'Roll it to the chair and the whole root canal kit arrives charged.',
      items: [
        { icon: 'layers', title: 'Four in one cart', line: 'Endo motor, apex locator, down-pack heat pen and backfill gun in a single mobile station.' },
        { icon: 'hand', title: 'Cordless, with or without the cart', line: 'The handpieces run cordless through the Denjoy app. The trolley is optional.' },
        { icon: 'power', title: 'Charging built into the tray', line: 'Every handpiece docks and charges in place, with no loose cables.' },
        { icon: 'move', title: 'The standard setup', line: 'A down-mounted base, a rotatable arm and dual-tray storage.' },
      ],
    },
    card: {
      line: 'Four endo instruments on one mobile cart.',
      stars: ['Motor, apex locator, pack and fill', 'Cordless handpieces', 'Charges in the tray'],
    },
  },

  /* ── apex locators ──────────────────────────────────────────────────────────────── */
  'free-pex': {
    hero: {
      line: 'A benchtop apex locator that stays on your counter and holds a steady reading in wet or dry canals.',
      stars: ['6th-generation multi-frequency chip', '3.9-inch color display', 'Calibrates itself, calibrator included'],
      photo: { src: `${IMG}/free-pex/denjoy-freepex-1.jpg`, w: 1200, h: 1200, blend: true, fit: 'cover', alt: 'Denjoy FREE PEX benchtop apex locator on its stand, the display showing a canal graphic and depth bar' },
    },
    glance: [
      { value: '6th', label: 'generation multi-frequency chip' },
      { value: '3.9 in', label: 'color display' },
      { value: '12 mo', label: 'local warranty, parts and service' },
      { value: 'FDA · CE', label: 'certified' },
    ],
    fit: {
      kicker: 'Who it suits',
      title: 'Made for busy endo days',
      line: 'A stay-put locator earns its place on the bench when root canals are routine.',
      segments: [
        'Endodontics-focused practices with a high volume of root canals',
        'Multi-room clinics standardizing on Denjoy in every operatory',
        'General dentists moving from hand-file estimation to electronic measurement',
      ],
    },
    features: {
      title: 'Steady readings, wet or dry',
      line: 'The reading should not flicker when the canal changes. This is how it holds.',
      items: [
        { icon: 'water', title: 'Reads through wet canals', line: 'The chip sends several frequencies at once and cross-checks them, so the reading holds through irrigation and bleeding.' },
        { icon: 'screen', title: 'A display you read from your seat', line: 'The 3.9-inch color screen shows a canal graphic, a color-coded depth bar and a numeric apex readout.' },
        { icon: 'check', title: 'It calibrates itself', line: 'Automatic calibration with the included calibrator keeps readings steady through temperature and moisture swings.' },
        { icon: 'lock', title: 'It stays where you put it', line: 'It lives on the counter, so it is never borrowed by the next room and never rolls off a tray.' },
      ],
    },
    gallery: [
      { src: `${IMG}/free-pex/denjoy-freepex-2.jpg`, w: 768, h: 768, alt: 'FREE PEX from the front left, its display lit' },
      { src: `${IMG}/free-pex/freepex-front.jpg`, w: 960, h: 1280, alt: 'FREE PEX on the display counter at our showroom, front view' },
      { src: `${IMG}/free-pex/freepex-three-quarter.jpg`, w: 960, h: 1280, alt: 'FREE PEX on the display counter at our showroom, three-quarter view' },
    ],
    specs: {
      kicker: 'Specifications',
      title: 'The FREE PEX on paper',
      line: 'Voltage, weight and dimensions are confirmed with your quote.',
      groups: [
        {
          label: 'Measurement',
          rows: [
            ['Type', '6th-generation multi-frequency'],
            ['Canal conditions', 'Wet, dry and blood-contaminated'],
            ['Calibration', 'Automatic, calibrator included'],
            ['Audible alarm', 'Multi-stage tone: canal entry, apex, beyond'],
          ],
        },
        {
          label: 'Unit',
          rows: [
            ['Form', 'Benchtop'],
            ['Display', '3.9-inch color'],
            ['Power', 'Built-in rechargeable battery'],
            ['Charging', 'AC adapter'],
            ['Made by', 'Denjoy Dental, Hunan, China'],
          ],
        },
      ],
      standards: ['FDA', 'CE'],
    },
    box: {
      kicker: 'In the box',
      title: 'A full kit, ready to measure',
      line: 'Everything you need for the first canal comes with the unit.',
      items: [
        { icon: 'tube', title: 'Probe cable' },
        { icon: 'hand', title: 'File holders', tag: '2' },
        { icon: 'check', title: 'Hooks', tag: '4' },
        { icon: 'ruler', title: 'Calibrator' },
        { icon: 'power', title: 'Charger' },
      ],
    },
    warranty: {
      kicker: 'Warranty',
      title: 'Serviced here, by us',
      line: 'Repairs and calibration go through our Pasig service center, not overseas.',
      rows: [{ part: 'FREE PEX unit', term: '12 months', note: 'Parts and service, with field calibration' }],
    },
    faqs: [
      { q: 'What is a benchtop apex locator?', a: 'It is an electronic apex locator that lives on the operatory counter. Unlike a handheld unit, it is not borrowed between rooms and does not roll off a tray, so the reading is always where you left it.' },
      { q: 'How accurate is the FREE PEX in wet or bleeding canals?', a: 'Its 6th-generation chip sends several frequencies at once and cross-checks the signals. The apex graphic stays stable through irrigation, bleeding and changes in pulp tissue.' },
      { q: 'How do I get a quote for the FREE PEX?', a: 'Message us or send an inquiry and we will reply with the current quote. Installment options are available for clinics, and the local warranty is included.' },
      { q: 'Do you deliver outside Metro Manila?', a: 'Yes. We ship Denjoy equipment nationwide, including Cebu, Davao, Iloilo and Baguio. Most orders leave our Pasig stock within the same week.' },
      { q: 'Does the warranty cover calibration and local service?', a: 'Yes. Every FREE PEX from us carries a 12-month local warranty with field calibration and access to our Pasig service center.' },
      { q: 'How does the FREE PEX relate to the Meet Endo?', a: 'It shares its multi-frequency measurement lineage with the MeetPex module in the Meet Endo. A clinic running both keeps one calibration standard, and can move up to the integrated system without retraining.' },
    ],
    card: {
      line: 'The benchtop apex locator that stays on the counter.',
      stars: ['6th-generation multi-frequency chip', '3.9-inch color display', '12-month local warranty'],
    },
  },

  'i-pexo': {
    hero: {
      line: 'A touchscreen apex locator the size of a phone. It reads in portrait or landscape and weighs 200 grams.',
      stars: ['4.3-inch capacitive touchscreen', '200 g, 40% lighter than before', '2000mAh rechargeable battery'],
      photo: { src: `${IMG}/i-pexo/denjoy-ipexo-7.jpg`, w: 768, h: 768, fit: 'cover', alt: 'Denjoy i-Pexo apex locator, a phone-sized unit with a canal graphic and depth reading on its touchscreen' },
    },
    glance: [
      { value: '4.3 in', label: 'capacitive touchscreen' },
      { value: '200 g', label: 'total weight' },
      { value: '40%', label: 'lighter than the previous generation' },
      { value: '2000 mAh', label: 'rechargeable battery' },
    ],
    features: {
      title: 'Familiar from the first tap',
      line: 'If you can use a phone, you already know how to read it.',
      items: [
        { icon: 'screen', title: 'It works like your phone', line: 'A 4.3-inch capacitive touchscreen at 480×800. Turn the unit and the gyroscope rotates the display.' },
        { icon: 'move', title: 'Light enough to move around', line: 'At 200 grams it is 40% lighter than the previous generation, with 50% less bulk.' },
        { icon: 'color', title: 'Color tells you the depth', line: 'Blue on the way to the apex, green as you approach, yellow at the apex and red when you pass it.' },
        { icon: 'power', title: 'A battery for the clinic day', line: 'The 3.7V 2000mAh battery is sized for a full day of cases without a midday charge.' },
      ],
    },
    gallery: [
      { src: `${IMG}/i-pexo/ipexo-front-hero.jpg`, w: 960, h: 1280, alt: 'i-Pexo standing upright on the display counter at our showroom' },
      { src: `${IMG}/i-pexo/ipexo-landscape-hero.jpg`, w: 1536, h: 2048, alt: 'i-Pexo seen from the side on its fold-out stand at our showroom' },
    ],
    specs: {
      kicker: 'Specifications',
      title: 'The i-Pexo on paper',
      line: 'From the maker\'s specification sheet.',
      groups: [
        {
          label: 'Screen',
          rows: [
            ['Size', '4.3 inches'],
            ['Resolution', '480 × 800'],
            ['Type', 'Capacitive touchscreen'],
            ['Orientation', 'Portrait and landscape'],
          ],
        },
        {
          label: 'Power and body',
          rows: [
            ['Battery', '3.7V, 2000mAh'],
            ['Adapter input', '100 to 240V, 50/60Hz, 0.5A max'],
            ['Adapter output', '5V DC'],
            ['Weight', '200 g'],
          ],
        },
      ],
    },
    warranty: {
      kicker: 'Warranty',
      title: 'Serviced here, by us',
      line: 'Repairs and calibration go through our Pasig service center, not overseas.',
      rows: [{ part: 'i-Pexo unit', term: '12 months', note: 'Local warranty, with field calibration' }],
    },
    faqs: [
      { q: 'What is a touchable apex locator?', a: 'It is an apex locator with a phone-style touchscreen. You tap and swipe as you would on a smartphone, which shortens the learning curve for the whole team.' },
      { q: 'How does the i-Pexo relate to the Meet Endo?', a: 'It runs the same measurement engine as the MeetPex module in the Meet Endo. A clinician trained on the i-Pexo can step up to the Meet Endo without relearning apex measurement.' },
      { q: 'How long does the battery last?', a: 'The i-Pexo carries a 3.7V 2000mAh rechargeable battery, sized for a full clinic day of endodontic cases.' },
      { q: 'How do I get a quote for the i-Pexo?', a: 'Message us or send an inquiry and we will reply with the current quote. Installment options are available for clinics, and the local warranty is included.' },
      { q: 'Do you deliver outside Metro Manila?', a: 'Yes. We ship Denjoy equipment nationwide, including Cebu, Davao, Iloilo and Baguio. Most orders leave our Pasig stock within the same week.' },
      { q: 'Does the warranty cover calibration and local service?', a: 'Yes. Every i-Pexo from us carries a 12-month local warranty with field calibration and access to our Pasig service center.' },
    ],
    card: {
      line: 'A touchscreen apex locator the size of a phone.',
      stars: ['4.3-inch touchscreen', '200 g', 'Portrait or landscape'],
    },
  },

  /* ── microscopes ────────────────────────────────────────────────────────────────── */
  ix7: {
    hero: {
      line: 'Stepless zoom and a bright LED, so the canal stays in view while you change magnification.',
      stars: ['Stepless 0.4x to 2.4x zoom', '18W LED, 70,000 lx or more', 'FDA, CE and ISO 13485 certified'],
      photo: { src: `${IMG}/ix7/hero.jpg`, w: 1200, h: 1200, blend: true, fit: 'cover', alt: 'Denjoy ix7 dental microscope on a wheeled floor stand, with a monitor mounted on the column' },
    },
    glance: [
      { value: '0.4 to 2.4x', label: 'stepless zoom' },
      { value: '70,000 lx', label: 'or more, from an 18W LED' },
      { value: '12.5x', label: 'eyepieces' },
      { value: '200 to 450', label: 'mm variable-zoom objective' },
    ],
    features: {
      title: 'See the canal, properly',
      line: 'Smooth magnification, strong light and optics you can set to your own eyes.',
      items: [
        { icon: 'move', title: 'Zoom that glides', line: 'Stepless 0.4x to 2.4x zoom. The magnification never jumps in the middle of a procedure.' },
        { icon: 'light', title: 'Bright light, three filters', line: 'An 18W LED at 70,000 lx or more, with yellow, green and clear filters.' },
        { icon: 'ruler', title: 'Optics set to your eyes', line: '12.5x eyepieces with ±6D diopter adjustment and a 200 to 450 mm variable-zoom objective.' },
        { icon: 'wrench', title: 'Installed and taught by us', line: 'We handle installation and train your team through the Pasig showroom.' },
      ],
    },
    standards: ['FDA', 'CE', 'ISO 13485'],
    card: {
      line: 'A dental microscope with stepless zoom.',
      stars: ['Stepless 0.4x to 2.4x zoom', '18W LED, three filters', 'FDA, CE, ISO 13485'],
    },
  },

  ix6: {
    hero: {
      line: 'Five magnification steps, coated optics and an optional 4K camera, on a floor stand or a tabletop clip.',
      stars: ['5 steps, 0.4x to 2.5x', 'LED over 70,000 lx', '4K camera available'],
      photo: { src: `${IMG}/ix6/hero.jpg`, w: 1200, h: 1200, blend: true, fit: 'cover', alt: 'Denjoy ix6 dental microscope on a wheeled floor stand' },
    },
    glance: [
      { value: '5', label: 'magnification steps' },
      { value: '0.4 to 2.5x', label: 'magnification range' },
      { value: '70,000+', label: 'lx of LED illumination' },
      { value: '4K', label: 'camera on the top configuration' },
    ],
    features: {
      title: 'Clear optics, your choice of setup',
      line: 'Pick the mount and the camera that match how you work and teach.',
      items: [
        { icon: 'layers', title: 'Five steps of magnification', line: 'From 0.4x to 2.5x through apochromatic, multi-coated optics.' },
        { icon: 'light', title: 'Light with a purpose', line: 'LED illumination over 70,000 lx. The yellow filter protects composites and the green one boosts vascular contrast.' },
        { icon: 'screen', title: 'Record in 4K', line: 'Configurations go up to an integrated 4K camera with a Sony sensor, recording at 3840×2160.' },
        { icon: 'move', title: 'Floor stand or tabletop', line: 'Mount it on a floor stand or a tabletop clip. See both at the Pasig showroom.' },
      ],
    },
    card: {
      line: 'Five-step magnification with a 4K camera option.',
      stars: ['0.4x to 2.5x in five steps', 'Apochromatic coated optics', 'Floor stand or tabletop clip'],
    },
  },

  /* ── motors ─────────────────────────────────────────────────────────────────────── */
  'i-moto': {
    hero: {
      line: 'One cordless motor for canal preparation and polishing. Change the head and it changes job.',
      stars: ['Two heads: 16:1 and 4:1', 'Nine saved presets', '85 g, left or right handed'],
      photo: { src: `${IMG}/i-moto/hero.jpg`, w: 768, h: 768, fit: 'cover', alt: 'Two Denjoy i-Moto cordless motors, one resting on its stand and one standing upright with a file fitted' },
    },
    glance: [
      { value: '85 g', label: 'coreless-motor body' },
      { value: '2', label: 'heads: endo and polishing' },
      { value: '9', label: 'presets, P1 to P9' },
      { value: '3.5 N·cm', label: 'maximum torque, from 0.4' },
    ],
    features: {
      title: 'Two jobs, one handpiece',
      line: 'Endo in the morning, polishing in the afternoon, without a second motor.',
      items: [
        { icon: 'motor', title: 'A head for each job', line: 'The 16:1 head runs 100 to 1000 rpm for endo preparation. The 4:1 head runs 500 to 4000 rpm for polishing.' },
        { icon: 'check', title: 'Your settings, saved', line: 'Torque from 0.4 to 3.5 N·cm, with nine presets that store speed, torque and direction.' },
        { icon: 'hand', title: 'Light in either hand', line: 'An 85-gram body with a 360° articulating head and modes for left and right hands.' },
        { icon: 'screen', title: 'Three ways to rotate', line: 'Continuous, reciprocating and ACC modes, shown on a color display.' },
      ],
    },
    card: {
      line: 'A cordless motor for endo and polishing.',
      stars: ['16:1 and 4:1 heads', '0.4 to 3.5 N·cm torque', '85 g body'],
    },
  },

  /* ── obturation and auxiliaries ─────────────────────────────────────────────────── */
  iue1: {
    hero: {
      line: 'A cordless ultrasonic activator for more effective irrigation, with tips made for fine and curved canals.',
      stars: ['45kHz ultrasonic activation', 'Cordless, charges from USB', 'Interchangeable tips included'],
      photo: { src: `${IMG}/iue1/hero.jpg`, w: 768, h: 768, fit: 'cover', alt: 'Denjoy iUe1 ultrasonic activator standing in its charging base, with a fine angled tip fitted' },
    },
    glance: [
      { value: '45 kHz', label: 'ultrasonic activation' },
      { value: '2000 mAh', label: '3.7V battery' },
      { value: 'USB', label: 'charges from any adapter' },
      { value: 'Cordless', label: 'handpiece' },
    ],
    features: {
      title: 'More effective irrigation',
      line: 'Ultrasonic energy does the agitating, through tips made for fine and curved canals.',
      items: [
        { icon: 'water', title: 'Stronger agitation', line: '45kHz ultrasonic activation moves irrigant more effectively through the canal.' },
        { icon: 'ruler', title: 'Tips for fine and curved canals', line: 'The tips pass through fine and curved canals, and are also rated for retreatment and broken-file removal.' },
        { icon: 'power', title: 'Cordless and USB charged', line: 'A 3.7V 2000mAh battery in the handpiece. It charges from any USB adapter.' },
        { icon: 'box', title: 'A set of tips in the box', line: 'It ships with a series of interchangeable ultrasonic working tips.' },
      ],
    },
    card: {
      line: 'Cordless ultrasonic activation for irrigation.',
      stars: ['45kHz activation', 'Fine and curved canal tips', 'USB charging'],
    },
  },

  icure: {
    hero: {
      line: 'A 103-gram cordless curing light with two swappable heads that cover six chairside jobs.',
      stars: ['Up to 3000mW/cm² output', 'Two swappable LED heads', 'Charging base included'],
      photo: { src: `${IMG}/icure/hero.jpg`, w: 768, h: 768, fit: 'cover', alt: 'Denjoy iCure cordless curing light standing in its charging base, its small display lit' },
    },
    glance: [
      { value: '103 g', label: 'aviation-aluminum body' },
      { value: '3000', label: 'mW/cm² at full output' },
      { value: '6', label: 'jobs across two heads' },
      { value: '4', label: 'curing modes' },
    ],
    features: {
      title: 'Six jobs, one light',
      line: 'Cure, bond and bleach with one head. Detect, disinfect and illuminate with the other.',
      items: [
        { icon: 'light', title: 'Cures in seconds', line: 'Output from 600 to 3000mW/cm². At full intensity it cures in 1 to 3 seconds.' },
        { icon: 'layers', title: 'Two heads, six uses', line: 'One head for curing, ortho bonding and bleaching. One for caries detection, disinfection and canal illumination.' },
        { icon: 'hand', title: 'Light and easy to aim', line: 'A 103-gram aviation-aluminum body with a head that rotates 360°.' },
        { icon: 'screen', title: 'Settings at a glance', line: 'Ramp, Pulse, Super and Standard modes. The OLED shows mode, intensity, timer and battery.' },
      ],
    },
    card: {
      line: 'A cordless curing light with two swappable heads.',
      stars: ['600 to 3000mW/cm²', 'Six uses across two heads', '103 g'],
    },
  },

  ipack: {
    hero: {
      line: 'A cordless down-pack pen with three fixed heat settings and four color-coded plugger tips.',
      stars: ['150, 200 and 220°C settings', 'Four plugger tips: F, FM, M, ML', 'Rapid-charge base'],
      photo: { src: `${IMG}/ipack/hero.jpg`, w: 768, h: 768, fit: 'cover', alt: 'Denjoy iPack cordless down-pack pen standing in its charging base, with a heated plugger tip fitted' },
    },
    glance: [
      { value: '3', label: 'thermostatic heat settings' },
      { value: '220°C', label: 'highest setting' },
      { value: '4', label: 'color-coded plugger tips' },
      { value: '360°', label: 'activation switch' },
    ],
    features: {
      title: 'Warm gutta-percha, no cord',
      line: 'Set the heat, pick the tip, and pack from whichever grip is comfortable.',
      items: [
        { icon: 'warm', title: 'Three set temperatures', line: 'Thermostatic settings at 150, 200 and 220°C on the cordless DY-GP pen.' },
        { icon: 'check', title: 'Heat you control', line: 'A 360° activation switch, fast heat-up and precise control of the heated tip, which reduces scald accidents.' },
        { icon: 'color', title: 'Four tips, color coded', line: 'F, FM, M and ML plugger tips cover most gutta-percha points on the market.' },
        { icon: 'hand', title: 'Made for either hand', line: 'An ambidextrous, minimalist body that sits in a rapid-charge base.' },
      ],
    },
    card: {
      line: 'A cordless down-pack pen with three heat settings.',
      stars: ['150, 200 and 220°C', 'Four color-coded tips', 'Rapid-charge base'],
    },
  },

  'meta-pack': {
    hero: {
      line: 'A down-pack heat pen that reaches 200°C in 0.2 seconds, with pre-bendable tips for curved canals.',
      stars: ['200°C in 0.2 seconds', '100 to 300°C range', 'Wireless charging base'],
      photo: { src: `${IMG}/meta-pack/hero.jpg`, w: 768, h: 768, fit: 'cover', alt: 'Denjoy Meta Pack heat pen standing on its wireless charging base, its handle display showing the temperature' },
    },
    glance: [
      { value: '0.2 s', label: 'to reach 200°C' },
      { value: '300°C', label: 'top of the range, from 100' },
      { value: '4', label: 'pre-bendable tips' },
      { value: '360°', label: 'start and stop ring' },
    ],
    features: {
      title: 'Heat the moment you need it',
      line: 'Built for warm vertical condensation, with almost no wait for the tip.',
      items: [
        { icon: 'warm', title: 'Hot in a fifth of a second', line: 'A 100 to 300°C range. It reaches 200°C in 0.2 seconds.' },
        { icon: 'ruler', title: 'Tips that follow the canal', line: 'Four pre-bendable tips (F, FM, M, ML) for curved canals. It fills to 3 mm from the apex for a hermetic seal.' },
        { icon: 'hand', title: 'Start from any grip', line: 'A 360° start and stop ring lets you activate it at any grip angle.' },
        { icon: 'power', title: 'Charges without a plug', line: 'A wireless charging base with an accessory tray. The OLED on the handle shows live temperature.' },
      ],
    },
    card: {
      line: 'A heat pen that reaches 200°C in 0.2 seconds.',
      stars: ['100 to 300°C range', 'Four pre-bendable tips', 'Wireless charging base'],
    },
  },
};

const familyOf = (id) => DENJOY_FAMILIES.find((f) => f.id === id);

// One full page object per instrument: the catalog entry from denjoy.js plus its page copy.
export const denjoyPages = denjoyProducts
  .filter((p) => PAGES[p.slug])
  .map((p) => {
    const page = PAGES[p.slug];
    const family = familyOf(p.chapter);
    return {
      slug: p.slug,
      route: `/denjoy/${p.slug}`,
      name: p.name,
      fullName: p.fullName,
      family,
      kind: family.kind,
      videos: p.videos || [],
      messengerText: p.messengerText,
      ...page,
      hero: { kicker: family.kind, title: `Denjoy ${p.name}`, ...page.hero },
      door: {
        kicker: 'Pasig showroom',
        title: `See the ${p.name} in person`,
        line: 'The Denjoy bench sits beside the ROSON chairs in our Pasig showroom. Demonstrations are by appointment.',
        ...SHOWROOM,
        ...(page.doorPhoto ? { photo: page.doorPhoto } : {}),
        ctas: [DENJOY_CTA.demo, DENJOY_CTA.message(p.messengerText), DENJOY_CTA.all],
      },
    };
  });

export const getDenjoyPage = (slug) => denjoyPages.find((p) => p.slug === slug);

// The three questions on the hub. page.js builds its FAQ JSON-LD from this same list, so the
// markup and the visible answers can never drift apart.
export const DENJOY_HUB = {
  hero: {
    kicker: 'Exclusive Denjoy distributor in the Philippines',
    title: 'The full Denjoy endodontic line',
    line: 'Twelve instruments for root canal work, from apex locators to microscopes. Try them at our Pasig showroom, with local warranty, training and support.',
    ctas: [DENJOY_CTA.demo, DENJOY_CTA.message("Hi DSD, I'd like to chat about the Denjoy line.")],
  },
  assurance: {
    title: 'Included with every Denjoy unit',
    items: [
      { icon: 'shield', title: 'Local warranty', line: 'Warranty service is handled here, by our own team.' },
      { icon: 'hand', title: 'Hands-on training', line: 'We show you and your staff how to use it.' },
      { icon: 'wrench', title: 'Philippine-based support', line: 'A direct line to us after the sale.' },
      { icon: 'check', title: 'A demo before you buy', line: 'The Meet Endo is installed in Pasig. Other units are ready by appointment.' },
    ],
  },
  jumpLabel: 'Browse by type',
  faq: {
    kicker: 'Questions',
    title: 'Before you visit',
    items: [
      { q: 'How many Denjoy products does DentaSource Direct carry?', a: 'Twelve: three integrated systems (Meet Endo, Meta Endo Pro I, Meta Endo), two apex locators (FREE PEX, i-Pexo), two microscopes (ix6, ix7), the i-Moto cordless motor, and four auxiliary products (iUe1, iCure, iPack, Meta Pack). DentaSource Direct is the exclusive Denjoy distributor in the Philippines.' },
      { q: 'Where can I try a unit before buying?', a: `At our Pasig showroom, ${SHOWROOM.address}. The Meet Endo is installed for live demonstrations, and the other units are demo-ready by appointment. Message us to schedule.` },
      { q: 'Is DentaSource Direct an official Denjoy distributor?', a: 'Yes. DentaSource Direct is the exclusive Denjoy distributor in the Philippines. Every unit comes with local warranty, hands-on training and Philippine-based support.' },
    ],
  },
  door: {
    kicker: 'Pasig showroom',
    title: 'See it before you decide',
    line: 'The Denjoy bench sits beside the ROSON chairs in our Pasig showroom. Demonstrations are by appointment, because the units are shared between visitors.',
    ...SHOWROOM,
    ctas: [DENJOY_CTA.demo, DENJOY_CTA.inquire],
  },
};
