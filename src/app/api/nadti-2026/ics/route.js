import { NADTI_EVENT, NADTI_SESSIONS, sessionById, sessionSlot } from '@/data/nadti-2026-sessions';

// Calendar files for the NADTI 2026 lectures.
//   /api/nadti-2026/ics?s=<session id>   one lecture
//   /api/nadti-2026/ics?s=all            all ten
// Served as text/calendar so iPhone Safari opens Apple Calendar's "Add" sheet and Android hands it
// to Google Calendar. Every event carries two alarms (30 and 5 minutes before) and a full description.

export const dynamic = 'force-dynamic';

const pad = (n) => String(n).padStart(2, '0');

// ISO with +08:00 offset -> UTC "YYYYMMDDTHHMMSSZ"
function toUtc(iso) {
    const d = new Date(iso);
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
}

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

// RFC 5545 line folding at 75 octets.
function fold(line) {
    const bytes = Buffer.from(line, 'utf8');
    if (bytes.length <= 75) return line;
    const out = [];
    let cur = '';
    for (const ch of line) {
        if (Buffer.byteLength(cur + ch, 'utf8') > (out.length ? 74 : 75)) { out.push(cur); cur = ch; }
        else cur += ch;
    }
    if (cur) out.push(cur);
    return out.join('\r\n ');
}

function vevent(s, stamp) {
    const description = [
        `${s.speaker}${s.degrees ? `, ${s.degrees}` : ''} (${s.country} ${s.flag})`,
        s.role,
        '',
        `${s.track}, ${NADTI_EVENT.name}`,
        `${s.day}, ${sessionSlot(s)} (Manila time)`,
        `${NADTI_EVENT.venue}, ${NADTI_EVENT.halls}`,
        NADTI_EVENT.address,
        '',
        `${NADTI_EVENT.booth}. Spin the wheel: ${NADTI_EVENT.spinUrl}`,
        `Complete guide: ${NADTI_EVENT.articleUrl}`,
    ].join('\n');
    return [
        'BEGIN:VEVENT',
        `UID:nadti2026-${s.id}@dentasourcedirect.com`,
        `DTSTAMP:${stamp}`,
        `DTSTART:${toUtc(s.start)}`,
        `DTEND:${toUtc(s.end)}`,
        `SUMMARY:${esc(`NADTI 2026: ${s.speaker}: ${s.title}`)}`,
        `LOCATION:${esc(NADTI_EVENT.location)}`,
        `DESCRIPTION:${esc(description)}`,
        `URL:${NADTI_EVENT.articleUrl}`,
        'STATUS:CONFIRMED',
        'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(`In 30 minutes: ${s.speaker}, ${s.title}`)}`, 'TRIGGER:-PT30M', 'END:VALARM',
        'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(`Starting in 5 minutes: ${s.speaker}`)}`, 'TRIGGER:-PT5M', 'END:VALARM',
        'END:VEVENT',
    ];
}

export async function GET(request) {
    const id = new URL(request.url).searchParams.get('s') || 'all';
    const sessions = id === 'all' ? NADTI_SESSIONS : [sessionById(id)].filter(Boolean);
    if (!sessions.length) return new Response('Unknown session', { status: 404 });
    const stamp = toUtc(new Date().toISOString());
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//DentaSource Direct//NADTI 2026 guide//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        `X-WR-CALNAME:${esc(id === 'all' ? 'NADTI 2026 lectures' : `NADTI 2026: ${sessions[0].speaker}`)}`,
        'X-WR-TIMEZONE:Asia/Manila',
        ...sessions.flatMap((s) => vevent(s, stamp)),
        'END:VCALENDAR',
    ];
    const body = lines.map(fold).join('\r\n') + '\r\n';
    const filename = id === 'all' ? 'nadti-2026-lectures.ics' : `nadti-2026-${id}.ics`;
    return new Response(body, {
        status: 200,
        headers: {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Content-Disposition': `inline; filename="${filename}"`,
            'Cache-Control': 'public, max-age=3600',
        },
    });
}
