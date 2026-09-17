// 26th NADTI Trade Exhibit and Scientific Sessions, September 22 to 24, 2026.
// Times are as posted by NADTI (Asia/Manila). Used by the article's speaker cards,
// the schedule block, and /api/nadti-2026/ics (calendar files).

const IMG = '/images/news/nadti-2026-smx-manila-complete-guide';

export const NADTI_EVENT = {
    name: '26th NADTI Trade Exhibit and Scientific Sessions',
    venue: 'SMX Convention Center Manila',
    halls: 'Halls 1 to 3',
    address: 'Seashell Lane, Mall of Asia Complex, Pasay City',
    location: 'SMX Convention Center Manila, Halls 1 to 3, Seashell Lane, Mall of Asia Complex, Pasay City',
    booth: 'DentaSource Direct is at Booth 034 and 035',
    tz: 'Asia/Manila',
    articleUrl: 'https://dentasourcedirect.com/news/nadti-2026-smx-manila-complete-guide',
    spinUrl: 'https://dentasourcedirect.com/spin',
};

export const NADTI_SESSIONS = [
    {
        id: 'ryan-san', track: 'Scientific Sessions',
        speaker: 'Mr. Ryan San Yi Leong', degrees: 'BCom (Curtin)',
        role: 'CEO and co-founder, EM2AI, Q&M Dental Group', country: 'Singapore', flag: '🇸🇬',
        portrait: `${IMG}/avatar-ryan-san.jpg`,
        title: 'Practical Lessons from Implementing AI-assisted Dental Workflows',
        day: 'Tuesday, September 22', start: '2026-09-22T10:00:00+08:00', end: '2026-09-22T11:00:00+08:00',
    },
    {
        id: 'noor-addeen-abo-arsheed', track: 'Scientific Sessions',
        speaker: 'Assoc. Prof. Dr. Noor Addeen Abo Arsheed', degrees: 'BDS, MDS, FPFA, MICP',
        role: 'Head of Restorative Dentistry, MAHSA University', country: 'Malaysia', flag: '🇲🇾',
        portrait: `${IMG}/avatar-noor-addeen-abo-arsheed.jpg`,
        title: 'Breaking the Rules: Why Endocrowns are Changing the Way We Restore Teeth. The Biomimetic Revolution',
        day: 'Tuesday, September 22', start: '2026-09-22T13:30:00+08:00', end: '2026-09-22T15:00:00+08:00',
    },
    {
        id: 'felylou-altura-fernandez', track: 'Scientific Sessions',
        speaker: 'Dr. Felylou Altura Fernandez', degrees: 'JD (LLB), DMD, RN, USRN',
        role: 'Dental jurisprudence lecturer', country: 'Philippines', flag: '🇵🇭',
        portrait: `${IMG}/avatar-felylou-altura-fernandez.jpg`,
        title: 'Legal Foundations of Dentistry: Mastering the Code of Ethics for Dentists, Dental Hygienists and Dental Technologists',
        day: 'Tuesday, September 22', start: '2026-09-22T16:00:00+08:00', end: '2026-09-22T17:00:00+08:00',
    },
    {
        id: 'nazatul-sabariah-ahmad', track: 'Scientific Sessions',
        speaker: 'Dr. Nazatul Sabariah Bt. Ahmad', degrees: 'DDS (UKM), DClinDent Paediatric Dentistry (UCL Eastman)',
        role: 'Paediatric dentist, CEO of DV Group Berhad', country: 'Malaysia', flag: '🇲🇾',
        portrait: `${IMG}/avatar-nazatul-sabariah-ahmad.jpg`,
        title: 'Molar Incisor Hypomineralisation: Navigating Diagnosis, Prevention and Clinical Management',
        day: 'Wednesday, September 23', start: '2026-09-23T10:30:00+08:00', end: '2026-09-23T11:30:00+08:00',
    },
    {
        id: 'johnah-galicia', track: 'Scientific Sessions',
        speaker: 'Dr. Johnah C. Galicia', degrees: 'DMD, PhD, MS, Diplomate of the American Board of Endodontics',
        role: 'Professor and Associate Dean, MCU College of Dentistry', country: 'Philippines', flag: '🇵🇭',
        portrait: `${IMG}/avatar-johnah-galicia.jpg`,
        title: 'Persistent Endodontic Infections: From Biological Causes to Clinical Solutions',
        day: 'Wednesday, September 23', start: '2026-09-23T13:00:00+08:00', end: '2026-09-23T14:00:00+08:00',
    },
    {
        id: 'karla-marrie-manaloto', track: 'Scientific Sessions',
        speaker: 'Dr. Karla Marrie L. Manaloto', degrees: 'MS Orthodontics',
        role: 'Orthodontist, TMJ and orofacial pain fellowship', country: 'Philippines', flag: '🇵🇭',
        portrait: `${IMG}/avatar-karla-marrie-manaloto.jpg`,
        title: 'The One Archwire Revolution: Leveraging Low Hysteresis Technology for Efficient and Predictable Orthodontic Treatment',
        day: 'Wednesday, September 23', start: '2026-09-23T14:30:00+08:00', end: '2026-09-23T15:30:00+08:00',
    },
    {
        id: 'student-forum-abo-arsheed', track: 'Student Forum',
        speaker: 'Assoc. Prof. Dr. Noor Addeen Abo Arsheed', degrees: 'BDS, MDS, FPFA, MICP',
        role: 'Head of Restorative Dentistry, MAHSA University', country: 'Malaysia', flag: '🇲🇾',
        portrait: `${IMG}/avatar-noor-addeen-abo-arsheed.jpg`,
        title: 'When to Restore, When to Replace: Clinical Decision-Making for Future Dentists',
        day: 'Thursday, September 24', start: '2026-09-24T09:00:00+08:00', end: '2026-09-24T10:00:00+08:00',
    },
    {
        id: 'kullanant-pansrimangkorn', track: 'Scientific Sessions',
        speaker: 'Dr. Kullanant Pansrimangkorn', degrees: 'DDS',
        role: 'Certified iTOP lecturer, Curaden Academy, Bangkok', country: 'Thailand', flag: '🇹🇭',
        portrait: `${IMG}/avatar-kullanant-pansrimangkorn.jpg`,
        title: 'Transform Patient Oral Hygiene Education with iTOP: Empowering Patients for Lifelong Oral Health',
        day: 'Thursday, September 24', start: '2026-09-24T10:30:00+08:00', end: '2026-09-24T11:30:00+08:00',
    },
    {
        id: 'chung-hua-chen', track: 'Scientific Sessions',
        speaker: 'Dr. Chung Hua Chen', degrees: '',
        role: 'Endodontist', country: 'Taiwan', flag: '🇹🇼',
        portrait: `${IMG}/avatar-chung-hua-chen.jpg`,
        title: 'Bioceramic Obturation: The Contemporary Solution for Minimally Invasive Endodontics',
        day: 'Thursday, September 24', start: '2026-09-24T13:00:00+08:00', end: '2026-09-24T14:30:00+08:00',
    },
    {
        id: 'renoir-amba', track: 'Scientific Sessions',
        speaker: 'Dr. Renoir S. Amba', degrees: '',
        role: 'Prosthodontist, Amba Dental Clinic, Parañaque', country: 'Philippines', flag: '🇵🇭',
        portrait: `${IMG}/avatar-renoir-amba.jpg`,
        title: 'Metal Free: All-Ceramic Conservative Approach to Posterior Single Tooth Replacement',
        day: 'Thursday, September 24', start: '2026-09-24T15:00:00+08:00', end: '2026-09-24T16:00:00+08:00',
    },
];

export const sessionById = (id) => NADTI_SESSIONS.find((s) => s.id === id) || null;

// "10:00 AM" in Manila time, from an ISO string with a fixed +08:00 offset.
export function manilaTime(iso) {
    const m = iso.match(/T(\d{2}):(\d{2})/);
    let h = Number(m[1]); const min = m[2]; const ampm = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
    return `${h}:${min} ${ampm}`;
}

export function sessionSlot(s) {
    return `${manilaTime(s.start)} to ${manilaTime(s.end)}`;
}

// Google Calendar template link. Local wall-clock times + ctz keep it correct on any phone.
export function googleCalendarUrl(s) {
    const local = (iso) => iso.replace(/[-:]/g, '').slice(0, 15); // YYYYMMDDTHHMMSS
    const details = [
        `${s.speaker}${s.degrees ? `, ${s.degrees}` : ''} (${s.country} ${s.flag})`,
        s.role,
        '',
        `${s.track}, ${NADTI_EVENT.name}`,
        `${s.day}, ${sessionSlot(s)} (Manila time)`,
        `${NADTI_EVENT.venue}, ${NADTI_EVENT.halls}`,
        '',
        `${NADTI_EVENT.booth}. Spin the wheel: ${NADTI_EVENT.spinUrl}`,
        `Complete guide: ${NADTI_EVENT.articleUrl}`,
    ].join('\n');
    const p = new URLSearchParams({
        action: 'TEMPLATE',
        text: `NADTI 2026: ${s.speaker}: ${s.title}`,
        dates: `${local(s.start)}/${local(s.end)}`,
        ctz: NADTI_EVENT.tz,
        details,
        location: NADTI_EVENT.location,
    });
    return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export const icsUrl = (id) => `/api/nadti-2026/ics?s=${encodeURIComponent(id)}`;
