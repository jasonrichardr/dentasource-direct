// src/data/chairs/shared.js — the words every chair page and the /dentalchairs gallery share.
//
// What DentaSource Direct does for a buyer is the same whichever chair they choose, so it is
// written once, here, and never per chair. Every claim below already stood on the site before
// this file existed: the free ocular visit and the eight point check (products.json, the
// inspectionAndInstallation beat and the pre-delivery inspection article), our own technicians
// installing and the hands-on training (the trust marquee), and the 2-year unit warranty
// (src/data/chairs/a3.js, from products.js).
//
// House rules for the words: plain and specific, written to a dentist as a peer. A headline is
// 7 words or fewer. No em or en dashes, no prices, no "#1", no competitor names, Pasig showroom
// (never Manila).

export const SHOWROOM = {
  address: '610 C. Raymundo Avenue, Maybunga, Pasig City',
  hours: 'Monday to Sunday, 9 AM to 8 PM',
};

export const CTA = {
  visit: { label: 'Visit the showroom', href: '/contact#showroom', primary: true },
  inquire: { label: 'Send an inquiry', href: '/contact#inquiry' },
  message: { label: 'Message us', href: 'https://m.me/dentasource', external: true },
  allChairs: { label: 'See all chairs', href: '/dentalchairs' },
};

// The four things that come with every chair, whichever one it is.
export const ASSURANCE = {
  title: 'Included with every chair',
  items: [
    { icon: 'ruler', title: 'A free ocular visit', line: 'We measure your operatory and plan the layout before you order.' },
    { icon: 'check', title: 'An eight point inspection', line: 'Each unit is assembled, powered up and tested before it ships.' },
    { icon: 'wrench', title: 'Installed by our own technicians', line: 'We build it in your room, then train your team on it.' },
    { icon: 'shield', title: 'A 2-year warranty', line: 'Parts and service in year one, service in year two.' },
  ],
};

// Shown on every chair page above the showroom door. The eight checklist lines and the two
// photographs come from products.json (src/lib/chairs/clinicProof.js).
export const INSPECTION = {
  kicker: 'Before it reaches you',
  title: 'Tested by us, built in your room',
  line: 'We uncrate, assemble, power up and test every unit against an eight point checklist before it ships. Then our own technicians build it in your operatory and hand it over.',
  checklistTitle: 'The eight point check',
  article: { label: 'See how we inspect every chair', href: '/news/pre-delivery-inspection-every-dental-chair' },
};

// The heading over a chair's own delivery and install photographs, or over its news stories
// when it has no install photographs yet.
export const STORIES = {
  installs: {
    kicker: 'In real clinics',
    title: 'Already at work in clinics',
    line: 'Photos from our own deliveries and installs. Open one to read the full story.',
  },
  news: {
    kicker: 'From our news desk',
    title: 'Stories about this chair',
    line: 'Deliveries, installs and notes from our team.',
  },
};
