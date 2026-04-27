// All N2 Pro content sourced from
// /Users/jarich/second-brain/businesses/dsd-suppliers/roson-catalog/chairs/n2-pro.md
// Warranty per Jarich's DSD-Philippines local-support policy (2026-04-27).
// Public-facing — no personal names, no JF Empire references, no Denjoy contact info.

export const heroPitch =
  "ROSON's flagship N-series dental chair. 650×315mm dentist tray (widest in series), independent disinfectant water supply, 24V silent motor with intelligent soft start/stop. Exclusive in the Philippines through DentaSource Direct.";

export const numericFlexes = [
  {
    figure: '80,000+',
    label: 'dentists worldwide',
    note: 'ROSON’s strongest social-proof figure across the N-series lineup.',
  },
  {
    figure: '650 × 315 mm',
    label: 'dentist tray',
    note: 'The widest workspace in the N-series — 5% more surface than the N2+ (650×300mm).',
  },
  {
    figure: '6',
    label: 'microbiological certifications',
    note: 'Sorusha disinfectant system: hydrogen peroxide concentration, static and dynamic bactericidal, oral toxicity, ozone concentration, colony inspection.',
  },
];

export const quietDifference = {
  eyebrow: 'The quiet difference',
  title: 'Independent disinfectant water supply.',
  body:
    'Most chairs route disinfectant through the same waterlines that feed the patient circuit. The N2 Pro doesn’t. A dedicated rear cabinet houses two labeled containers and ON/OFF switches — one for tap-fed treatment water, one for disinfectant cycling. Switch sources without contaminating the patient circuit, run a full 4-hour 3% hydrogen peroxide line purge overnight, return to clean operation by morning.',
  pillars: [
    {
      tag: 'Hardware-isolated',
      body: 'Separate physical reservoirs in the rear cabinet — not a software toggle on a shared line.',
    },
    {
      tag: 'Visible status',
      body: 'External ON/OFF switches show line state at a glance; staff cannot mistake which mode is active.',
    },
    {
      tag: 'Validated by ROSON',
      body: 'Six microbiological certifications across the Sorusha disinfectant system — oral toxicity, dynamic and static bactericidal performance, hydrogen peroxide and ozone concentration.',
    },
  ],
};

// N-series comparison — facts only, drawn from per-chair catalog pages.
export const nSeriesComparison = {
  rows: [
    { label: 'Position in series', n2pro: 'Flagship', n2plus: 'Mid-tier', n1: 'Entry' },
    { label: 'Dentist tray', n2pro: '650 × 315 mm', n2plus: '650 × 300 mm', n1: '650 × 300 mm' },
    {
      label: 'Operating light',
      n2pro: 'Rolight S — IR hands-free, double mode',
      n2plus: '8-Tooth Smile — IR hands-free',
      n1: 'LED-FSN/A — manual switch',
    },
    {
      label: 'Disinfectant water supply',
      n2pro: 'Independent rear cabinet',
      n2plus: 'Independent (legacy implementation)',
      n1: 'Not included',
    },
    { label: 'Spittoon', n2pro: 'Ceramic, 180°', n2plus: 'Ceramic, 180°', n1: 'Ceramic, fixed' },
    { label: 'Chair motor', n2pro: '24V DC silent + soft start/stop', n2plus: '24V DC silent', n1: '24V DC' },
    { label: 'Programmable positions', n2pro: 'P1, P2, P3 + R + LP', n2plus: 'R + LP', n1: 'R + LP' },
    { label: 'Max patient load', n2pro: '150 kg', n2plus: '150 kg', n1: '150 kg' },
    { label: 'Cabinet design', n2pro: 'Shield-shape (2025)', n2plus: 'Standard', n1: 'Standard' },
    { label: 'Color palette', n2pro: '7 colors incl. ROSON Blue', n2plus: '6 colors', n1: '5 colors' },
  ],
};

export const colors = [
  { code: 'FS21', name: 'ROSON Blue', src: '/images/products/n2-pro/Unit Color Selection/Roson_Blue.jpg' },
  { code: 'FS19', name: 'Skyscraper Gray', src: '/images/products/n2-pro/Unit Color Selection/Skyscraper_Gray.jpg' },
  { code: 'FS14', name: 'Mountain Blue', src: '/images/products/n2-pro/Unit Color Selection/Mountain_Blue.jpg' },
  { code: 'FS02', name: 'Coloured Glaze Blue', src: '/images/products/n2-pro/Unit Color Selection/Coloured_Glaze_Blue.jpg' },
  { code: 'FS04', name: 'Begonia Red', src: '/images/products/n2-pro/Unit Color Selection/Begonia_Red.jpg' },
  { code: 'FS05', name: 'Hermes Orange', src: '/images/products/n2-pro/Unit Color Selection/Hermes_Orange.jpg' },
  { code: 'FS06', name: 'Olive Green', src: '/images/products/n2-pro/Unit Color Selection/Olive_Green.jpg' },
];

export const upholstery = [
  {
    name: 'Seamless Microfiber',
    desc: 'Smooth, single-piece microfiber surface with no visible stitching. Same material as Sewn — personal preference on whether you want seams or not.',
    src: '/images/products/n2-pro/Upholstery Selection/Seamless_Microfiber.webp',
  },
  {
    name: 'Sewn Microfiber',
    desc: 'The same microfiber as Seamless, finished with traditional stitched seams. Personal preference on the seam detail; the material itself is identical.',
    src: '/images/products/n2-pro/Upholstery Selection/Sewn_Microfiber.webp',
  },
  {
    name: 'PU Leather',
    desc: 'Synthetic leather alternative for clinics that want a different surface feel. Easy to wipe clean, cost-effective.',
    src: '/images/products/n2-pro/Upholstery Selection/PU_Leather.webp',
  },
];

export const specGroups = [
  {
    label: 'Electrical',
    rows: [
      ['Input max power', '720 VA'],
      ['Power connection', '230V AC ±10%, 50/60 Hz'],
      ['Rated current', '3.15 A at 230V'],
      ['Fuse', 'Ø5×20 F6.3A H 250VAC'],
      ['Protection class', 'Class I — Type B applied parts'],
    ],
  },
  {
    label: 'Chair mechanics',
    rows: [
      ['Patient height range', '400–750 mm (±10 mm)'],
      ['Backrest range', '115°–170°'],
      ['Headrest extension', '120 mm max'],
      ['Maximum patient load', '150 kg (per ISO 7494-1)'],
      ['Chair motor', '24V DC silent, intelligent soft start/stop'],
      ['Motor duty cycle', 'Max 2 min ON / Min 18 min OFF'],
      ['Programmable positions', 'P1, P2, P3 + R (entry/exit) + LP (working)'],
      ['Net weight', '≈230 kg (KLT-6220) / ≈180 kg (KLT-6210)'],
    ],
  },
  {
    label: 'Water system',
    rows: [
      ['Water supply pressure', '0.2–0.4 MPa'],
      ['Water flow', '≥5 L/min'],
      ['Water hardness', '<12° dH (<2.14 mmol/L)'],
      ['Water pH', '6.5–8.5'],
      ['Warm water temperature', '40°C ±5°C (constant)'],
      ['Pure water bottles', '2 × 1 L (KLT-6220) / 1 × 1 L (KLT-6210)'],
      ['Disinfectant supply', 'Independent rear-cabinet system'],
      ['Water ingress — main unit', 'IPX0'],
      ['Water ingress — foot controller', 'IPX4'],
    ],
  },
  {
    label: 'Air supply',
    rows: [
      ['Air supply pressure', '0.55–0.8 MPa'],
      ['Air supply flow', '≥90 L/min'],
      ['Air requirement', 'Oil-free, dry, filter pore ≤50 µm'],
      ['Handpiece air output', '0–0.4 MPa (1–3.2 bar working range)'],
      ['Cooling water pressure', '0.2 MPa'],
    ],
  },
  {
    label: 'Workspace',
    rows: [
      ['Dentist tray', '650 × 315 mm — widest in N-series'],
      ['Handpiece holders', '5 positions + scaler/electromotor pre-positions'],
      ['Spittoon', 'Ceramic, 180° rotatable'],
      ['Operating light', 'Rolight S — IR hands-free, double mode, Philips LEDs'],
      ['3-way syringe', 'Warm water enabled, dentist + assistant sides'],
      ['Maximum tray load', '2.5 kg'],
    ],
  },
  {
    label: 'Operating environment',
    rows: [
      ['Operating temperature', '5°C – 40°C'],
      ['Operating humidity', '30% – 85% RH'],
      ['Operating pressure', '540–1060 hPa'],
      ['Storage temperature', '-40°C – +70°C'],
      ['Installation altitude', '≤3,000 m above sea level'],
    ],
  },
];

export const standards = [
  'IEC 60601-1:2005+A1:2012 / EN 60601-1:2006+A1:2013',
  'IEC 60601-1-2:2014 / EN 60601-1-2:2015 (EMC)',
  'IEC 60601-1-6:2010+A1:2013 & IEC 62366-1:2015 (usability)',
  'EN ISO 7494-1:2018',
  'EN ISO 7494-2:2015',
  'ISO 9680:2014',
  'CE marked — Council Directive 93/42/EEC',
];

export const microbiologicalCerts = [
  'Hydrogen Peroxide Concentration',
  'Static Liquid Bactericidal',
  'Oral Toxicity',
  'Ozone Concentration',
  'Colony Inspection',
  'Dynamic Liquid Bactericidal',
];

export const dsdWarranty = [
  { term: '5 years', body: 'Motor warranty — the chair drive system is the highest-mileage component on a daily-use unit. Five years matches the realistic ownership horizon of a busy clinic.' },
  { term: '2 years', body: 'Service free of charge — scheduled maintenance, parts adjustment, and field service visits at no cost.' },
  { term: '1 year', body: 'Parts + service free of charge — covered components replaced at zero parts cost on top of the free service window.' },
  { term: 'Parts on hand', body: 'All standard ROSON spare parts are stocked locally at our Pasig facility — no offshore RMA, no shipping wait, fixes happen the week you call.' },
  { term: 'Local support', body: 'DentaSource Direct in Pasig is the exclusive ROSON service center for the Philippines — one warranty chain, one phone number, all support handled in-country.' },
];

export const ocularInspection = {
  eyebrow: 'Free ocular inspection',
  title: 'Bring 7+ years of dental clinic build experience to your floor plan.',
  intro:
    'Before you commit to a chair, a layout, or a renovation budget — let us walk your space first. DentaSource Direct has helped dozens of Philippine clinics plan their operatories, from solo practices to multi-chair group setups. The site visit costs nothing.',
  whatWeAdvise: [
    {
      tag: 'Operatory placement',
      body: 'Where the chair sits relative to the door, window, suction line, and assistant zone. Bad placement costs you 30 minutes a day for the lifetime of the lease.',
    },
    {
      tag: 'Workflow + traffic',
      body: 'Patient flow, sterilization route, sharp-disposal sightlines, where the next chair could go. We map it on the floor with tape before any concrete is poured.',
    },
    {
      tag: 'Utility rough-in',
      body: 'Power, air, water, drain, network — what your contractor needs to stub out and exactly where. Saves you from re-cutting tile two weeks after install.',
    },
    {
      tag: 'Equipment fit',
      body: 'Will the chair you want actually fit through your door, the elevator, the corridor? We measure before quoting.',
    },
    {
      tag: 'Investment sequencing',
      body: 'What to buy now vs in year two. The mistake most clinics make is buying everything upfront; the second mistake is buying the wrong order. We tell you what we have seen work.',
    },
    {
      tag: 'Honest no',
      body: 'If a feature is marketing fluff for your specific patient mix, we will tell you to skip it.',
    },
  ],
  cta: 'Schedule a free ocular',
};

const _installationLegacy = {
  room: '2,800 × 2,500 × 2,500 mm minimum (L × W × H)',
  floor: 'Level within 3/2,000 mm; minimum load 0.5 N/cm² (~500 kg/m²)',
  electrical: '230V ±10%, 50/60 Hz dedicated circuit',
  air: '0.55–0.8 MPa, ≥90 L/min, oil-free, dry, filter pore ≤50 µm',
  water: '0.2–0.4 MPa, ≥5 L/min, hardness <12° dH, pH 6.5–8.5, particle <100 µm',
  pipeRoughIn: 'Power exit 80 mm from floor; water/air pipe 36 mm Ø; drain 52 mm Ø inner, exit 50 mm from floor',
  installer: 'Installation must be performed by a manufacturer-authorized engineer.',
};

export const faqs = [
  {
    q: 'What is the warranty on the ROSON N2 Pro in the Philippines?',
    a: 'DentaSource Direct provides a five-year motor warranty, two years of service free of charge, and one year of parts plus service free of charge. An annual inspection by a ROSON-authorized engineer is required to maintain manufacturer warranty validity. All service is performed locally from the Pasig service center — no offshore parts wait.',
  },
  {
    q: 'What is the difference between the N2 Pro, N2+, and N1?',
    a: 'The N2 Pro is the flagship of the N-series. It has a 650×315 mm dentist tray (5% wider than the N2+ and N1, both at 650×300 mm), the Rolight S operating light with infrared hands-free control and double mode lighting, an independent disinfectant water supply housed in a redesigned shield-shape rear cabinet, intelligent soft start/stop motor control, and three programmable chair positions. The N2+ keeps the silent motor and IR-hands-free light but on the standard cabinet. The N1 is the entry tier without the disinfectant water system or programmable positions.',
  },
  {
    q: 'Is the N2 Pro CE marked?',
    a: 'Yes. The N2 Pro is CE marked under Council Directive 93/42/EEC. It also complies with IEC 60601-1, IEC 60601-1-2 (EMC), EN ISO 7494-1:2018, EN ISO 7494-2:2015, and ISO 9680:2014. The Sorusha disinfectant system carries six independent microbiological certifications.',
  },
  {
    q: 'How does the independent disinfectant water supply work?',
    a: 'The rear cabinet houses two physically separate reservoirs — one for treatment-circuit water, one for disinfectant. External ON/OFF switches show line state. To run a full disinfection cycle, the operator switches sources to the disinfectant reservoir (typically 3% hydrogen peroxide), purges all instrument lines for at least four hours, then flushes back through with clean pure water for at least 30 seconds per line. Patient water is never co-mingled with disinfectant.',
  },
  {
    q: 'What is the Rolight S operating light?',
    a: 'Rolight S is the operating light fitted to the N2 Pro. It uses Philips LED beads, double-mode brightness and color-temperature presets, infrared hands-free on/off and intensity cycling (wave at 60–80 cm), digital illumination control, manual shortcut buttons, and a status breathing lamp. Load-bearing rating 1.5 kg.',
  },
  {
    q: 'What colors and upholstery options are available?',
    a: 'Seven cabinet colors as of the 2025/06 palette refresh: ROSON Blue (signature), Skyscraper Gray, Mountain Blue, Coloured Glaze Blue, Begonia Red, Hermes Orange, and Olive Green. Three upholstery materials: seamless microfiber (top tier, no stitching, infection-control optimal), sewn microfiber (premium feel, stitched), and PU leather (standard, cost-effective). Any color pairs with any upholstery.',
  },
  {
    q: 'What does my clinic need to install an N2 Pro?',
    a: 'Minimum room dimensions of 2,800 × 2,500 × 2,500 mm. A level floor with at least 0.5 N/cm² load capacity. A dedicated 230V ±10% / 50–60 Hz circuit. Compressed air at 0.55–0.8 MPa with at least 90 L/min flow, oil-free and dry. Water at 0.2–0.4 MPa with at least 5 L/min flow, hardness below 12° dH and pH 6.5–8.5. A drain pipe of 52 mm inner diameter exiting 50 mm above the floor. Installation must be performed by a manufacturer-authorized engineer; DentaSource Direct provides certified install in Metro Manila and across the Philippines.',
  },
  {
    q: 'How much does the N2 Pro cost in the Philippines?',
    a: 'Pricing depends on configuration (dentist-tray placement, upholstery, color, accessory bundles). DentaSource Direct provides written quotes within one business day of a configuration consultation, with bundle pricing available when paired with ROSON imaging (RoRay handheld X-ray + Rosensor) or Denjoy endodontic equipment. Showroom demos are free.',
  },
  {
    q: 'Where can I see the N2 Pro in the Philippines before buying?',
    a: 'DentaSource Direct operates a 140-square-meter showroom in Pasig with the N2 Pro on the floor for live demonstration. Patient-position cycling, motor sound check, light-mode walkthrough, spittoon rotation, and the disinfection cabinet are all hands-on. Visits are by appointment to ensure a dedicated walkthrough.',
  },
  {
    q: 'How do I clean and maintain the N2 Pro?',
    a: 'Per-patient: wipe upholstery, control panels, and handles with 65–75% alcohol; sterilize handpieces and 3-way syringe tips at 134°C steam for 20 minutes; flush spittoon at least 30 seconds. Daily: purge all water/air lines for 30 seconds, pump 200 mL cleaning water through suction hoses, wash the suction filter in 1,000 mg/L chlorine solution. Weekly: 1 L disinfectant pour-through on the cuspidor water line. Monthly: replace return-air bottle cotton, full 4-hour 3% hydrogen peroxide line disinfection. Annual: replace suction filter, full inspection by an authorized engineer. Every two years: full electrical safety test.',
  },
];

export const featureCards = [
  {
    id: 'rolight-s',
    title: 'Rolight S Operating Light',
    eyebrow: 'IR hands-free',
    src: '/images/products/n2-pro/Advanced features and components/Rolight_S_Dental_Light.webp',
    alt: 'ROSON N2 Pro — Rolight S operating light with IR hands-free control',
    lead: 'Wave to control. The sterile field stays sterile.',
    details: [
      {
        label: 'Hands-free trigger',
        body: 'Infrared sensor reads a wave at 60–80 cm to switch on, off, and cycle intensity. No glove contact, no shared handle, no break in the gloved-up workflow.',
      },
      {
        label: 'Light quality',
        body: 'Philips LED beads. Double-mode brightness and color-temperature presets, digital illumination control, manual shortcut buttons, and a status breathing lamp.',
      },
      {
        label: 'Certified',
        body: 'ISO 9680:2014 — the international standard for dental operating lights. Load-bearing rating 1.5 kg.',
      },
    ],
  },
  {
    id: 'swing-bridge',
    title: 'Swing-Mount Doctor Bridge',
    eyebrow: 'Four-handed comfort',
    src: '/images/products/n2-pro/Advanced features and components/Swing_Mount_Bridge.png',
    alt: 'ROSON N2 Pro — doctor instrument bridge pivots for assistant access and four-handed dentistry',
    lead: 'Built for the assistant. Earned over long procedures.',
    details: [
      {
        label: 'Easy assistant access',
        body: 'The bridge pivots toward the assistant side so handpieces, suction, and 3-way syringe land within natural reach — no over-the-patient stretching, no awkward hand-overs across the chest line.',
      },
      {
        label: 'Comfort on long cases',
        body: 'Endo, full-arch prep, surgical procedures — the moves the assistant repeats hundreds of times in an appointment stay close-in. Less shoulder fatigue, less wrist strain, less rebooking because the team is fresh at the end of the day.',
      },
      {
        label: 'Five handpiece positions',
        body: 'High-speed, low-speed, scaler/electromotor pre-positions, and 3-way syringe — laid out so the dentist reaches the same place every time, regardless of which way the bridge is swung.',
      },
    ],
  },
  {
    id: 'rotatable-bridge',
    title: '180° Rotatable Spittoon',
    eyebrow: 'Swing-out access',
    src: '/images/products/n2-pro/Advanced features and components/Rotatable_Spittoon.jpg',
    alt: 'ROSON N2 Pro — ceramic spittoon rotates 180 degrees for assistant access',
    lead: 'Ceramic bowl that meets the patient where they are.',
    details: [
      {
        label: '180° rotation',
        body: 'Smooth-bearing swing: out of the way for patient entry and exit, in close for rinses, toward the assistant side when reclined for four-handed work.',
      },
      {
        label: 'Ceramic, not plastic',
        body: 'Wipes clean fully. Resists staining from chlorhexidine, iodine, and povidone rinses across years of daily disinfection.',
      },
    ],
  },
  {
    id: 'disinfectant-water',
    title: 'Independent Disinfectant Water Supply',
    eyebrow: 'Hardware-isolated',
    src: '/images/products/n2-pro/Advanced features and components/Water_Supply_System.jpg',
    alt: 'ROSON N2 Pro independent disinfectant water supply rear cabinet',
    lead: 'Two reservoirs. One patient circuit. Zero co-mingling.',
    details: [
      {
        label: 'Physically separated',
        body: 'Hardware-isolated reservoirs in the rear cabinet — one for tap-fed treatment water, one for disinfectant cycling. Not a software toggle on a shared line.',
      },
      {
        label: 'Visible line state',
        body: 'External ON/OFF switches show which source is active at a glance. Staff cannot mistake disinfectant for treatment water.',
      },
      {
        label: 'Validated cycle',
        body: 'Six microbiological certifications across the Sorusha system — oral toxicity, dynamic and static bactericidal, hydrogen peroxide and ozone concentration, colony inspection. Independently audited, not self-declared.',
      },
    ],
  },
];

export const galleryImages = [
  { src: '/images/products/n2-pro/N2 Pro Dental Chair/1-1.jpg', alt: 'ROSON N2 Pro — hero front view' },
  { src: '/images/products/n2-pro/N2 Pro Dental Chair/2-2.jpg', alt: 'ROSON N2 Pro — alternate angle' },
  { src: '/images/products/n2-pro/N2 Pro Dental Chair/3-1.jpg', alt: 'ROSON N2 Pro — instrument tray detail' },
  { src: '/images/products/n2-pro/N2 Pro Dental Chair/4-1.jpg', alt: 'ROSON N2 Pro — spittoon detail' },
  { src: '/images/products/n2-pro/N2 Pro Dental Chair/5-1.jpg', alt: 'ROSON N2 Pro — assistant arm' },
  { src: '/images/products/n2-pro/N2 Pro Dental Chair/6-1.jpg', alt: 'ROSON N2 Pro — base detail' },
];
