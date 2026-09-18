// The learners' community (round 5, 2026-09-17): the creed became a Community guidelines sheet, written for
// professionals. Jarich's rulings kept word for word where they matter: education first, no politics, equals.
export const GUIDELINES = {
  kicker: 'Community guidelines',
  head: 'A community of learners. Not entertainers.',
  lead: 'The Training Center is a place to learn and to teach. These are the terms every member, speaker and partner agrees to.',
  items: [
    { title: 'Learners first, speakers included', text: 'Everyone keeps learning. Education never stops, for the lecturer as much as for the first-year. Nobody is a know-it-all. The more we know, the more we see there is to know.' },
    { title: 'Education, as experience', text: 'What we teach was applied before it was taught: techniques at the chair, then the running of the clinic and the company behind it. Almost a decade of trial and error across different ways of managing people, money and patients, kept because it worked and dropped when it did not. Sessions are hands-on and evidence-led. This is not from a book; it is what we still do every day.' },
    { title: 'Science, research and innovation', text: 'Claims are backed by literature or by cases we can show. When the evidence changes, so do we. Product talk is welcome only when it teaches.' },
    { title: 'Everyone is equal at the table', text: 'A first-year practitioner and a thirty-year practitioner sit side by side and both ask questions. Titles do not buy a better seat.' },
    { title: 'No politics', text: 'Not in the lectures, not in the forums, not in the chat. Strictly. Religion, elections and party lines stay outside the door.' },
    { title: 'Respect and confidentiality', text: 'Patients in any case shown are anonymised and consented. What a colleague shares in the room stays in the room unless they say otherwise.' },
    { title: 'Members-only forums, soon', text: 'Internal forums open to members shortly. Until then, the Training Center is the room. The same rules apply online.' },
  ],
  foot: 'DentaSource Direct Training Center · Community guidelines · version 1 · September 2026',
};

// About us (round 5): the FFC about-sheet grammar, DSD's story. Portraits from the FFC brand set (Jarich + Dr. Finn).
export const ABOUT = {
  logo: '/gp/about/dsd-round.png',
  kicker: 'Est. Pasig · Metro Manila',
  head: 'We sell the tools.\nWe would rather teach you to use them.',
  paras: [
    'DentaSource Direct is a dental equipment company with the largest dental showroom in the country, in Pasig, and the exclusive distributor of ROSON and Denjoy in the Philippines. Our sister clinic, FFC Dental Clinic, is where the same tools work on real patients every day. The Training Center sits between the two, so what we teach is what we run.',
    'We are honest about what we sell. If a tool is not good we say so, even when it is on our shelf, and when a better one exists we move to it. We only contract with manufacturers that do their own research and development, and we visit their factories and labs before we sign.',
    'China leads research and development in dental equipment today, and we say that plainly. The direction of the market is easy to see, in dentistry and beyond. Our job is to bring the best of it here, service it properly, and teach people to use it well.',
  ],
  pillarsKicker: 'Three pillars · one purpose',
  pillars: [
    { name: 'DentaSource Direct', logo: '/gp/about/dsd-round.png', text: 'Equipment, installation, service and the Training Center, inside the largest dental showroom in the Philippines.' },
    { name: 'FFC Dental Clinic', logo: '/gp/logos/ffc-ring-clean.png', href: 'https://ffcdentalclinic.com', text: 'Five branches across Metro Manila since 2017. Endodontics, oral surgery, orthodontics and restorative care, and the clinic behind the Dental Assistant track.' },
    { name: 'JDev Studio', logo: '/gp/logos/cred-jdev-round.png', text: 'The studio that builds the software behind both companies, and teaches software, agents, crypto and trading at the Center.' },
  ],
  peopleKicker: 'The people behind it',
  people: [
    { name: 'Jason Richard Ramirez', role: 'Founder', photo: '/gp/about/jarich.png', bio: 'Founded DentaSource Direct and builds its software through JDev Studio. Runs the showroom, the service team and the Training Center.' },
    { name: 'Dr. Fairylane Finn Chan-Ramirez', role: 'Co-founder', photo: '/gp/about/finn.png', bio: 'Founded FFC Dental Clinic in 2017 and leads its branches. Trained under Università di Siena faculty. Every clinical track here is checked against her chair.' },
  ],
};

export const SAMPLE_BOARD = {
  href: 'https://dentasourcedirect.com/orthostrategy/dremil/sample',
  lead: 'Every course leaves you with a board of your own: the modules, the protocols, the photos from your batch, the decks, all linked, searchable, with a graph you can wander. Not a PDF in an email. A place you come back to.',
  note: 'The sample opens two of Dr. Emil\'s five TADs modules. The rest, the decks and the live-patient day belong to the people who sat the course.',
};

// Where (round 4): the showroom, same address and map as the contact page.
export const WHERE = {
  name: 'DentaSource Direct Showroom and Training Center',
  lines: ['610 C. Maybunga Rd', 'Pasig City, Metro Manila'],
  hours: 'Monday to Sunday, 9AM to 8PM',
  phone: '+63 962 579 3024',
  share: 'https://share.google/X0K3OZYUqNradruP2',
  embed: 'https://maps.google.com/maps?q=610%20C.%20Maybunga%20Rd%20Pasig%20City%20Metro%20Manila&output=embed',
};

// Knowledge-base screenshots from the Training Center boards (moved from the FFC page 2026-09-17; case tables left out).
export const KB = [
  { src: '/gp/kb/digi-01.jpg', cap: 'Orthodontic TADs board, welcome' },
  { src: '/gp/kb/kb-13.jpg', cap: 'TADs board, the modules' },
  { src: '/gp/kb/kb-14.jpg', cap: 'Module 2, placement technique' },
  { src: '/gp/kb/kb-15.jpg', cap: 'The 30 degree safe-zone law' },
  { src: '/gp/kb/kb-16.jpg', cap: 'Self-drilling, step by step' },
  { src: '/gp/kb/kb-01.jpg', cap: 'Advanced Endodontics board, welcome' },
  { src: '/gp/kb/kb-03.jpg', cap: 'Graph view of a whole course' },
  { src: '/gp/kb/kb-04.jpg', cap: 'Every note linked' },
  { src: '/gp/kb/kb-05.jpg', cap: 'Zoomed in on one protocol' },
  { src: '/gp/kb/kb-06.jpg', cap: 'Case timelines at a glance' },
  { src: '/gp/kb/kb-07.jpg', cap: 'Evidence from the library' },
  { src: '/gp/kb/kb-11.jpg', cap: 'The referral conversation' },
  { src: '/gp/kb/kb-12.jpg', cap: 'On a laptop, on a phone' },
];
