"use client";

import { NADTI_SESSIONS, sessionById, sessionSlot, googleCalendarUrl } from '@/data/nadti-2026-sessions';
import styles from './nadti.module.css';

// Google Calendar icon (four-colour calendar glyph), inline so it needs no asset.
function GCalIcon() {
    return (
        <svg className={styles.gicon} viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
            <rect x="10" y="10" width="28" height="28" fill="#fff" />
            <path d="M34 38H14l-4-4V14l4-4h20l4 4v20z" fill="none" />
            <path d="M14 10h20v4H14z" fill="#4285f4" />
            <path d="M34 10h4v4l-4 4z" fill="#1967d2" />
            <path d="M34 14h4v20h-4z" fill="#fbbc04" />
            <path d="M34 34h4l-4 4z" fill="#ea4335" />
            <path d="M14 34h20v4H14z" fill="#34a853" />
            <path d="M10 34h4v4z" fill="#188038" />
            <path d="M10 14h4v20h-4z" fill="#4285f4" />
            <path d="M10 10h4v4h-4z" fill="#1967d2" />
            <path d="M19.6 30.2c-1.1 0-2-.3-2.8-.9-.7-.6-1.2-1.4-1.4-2.4l2.3-.9c.1.6.4 1 .7 1.3.4.3.8.5 1.3.5s1-.2 1.4-.5c.4-.4.6-.8.6-1.3 0-.6-.2-1-.6-1.4-.4-.3-1-.5-1.6-.5h-1.3v-2.2h1.2c.6 0 1-.2 1.4-.5.4-.3.5-.7.5-1.2s-.2-.9-.5-1.2c-.3-.3-.7-.4-1.2-.4s-.9.1-1.2.4c-.3.3-.5.6-.6 1l-2.2-.9c.3-.9.8-1.6 1.5-2.1.7-.5 1.6-.8 2.6-.8.8 0 1.5.2 2.1.5.6.3 1.1.8 1.5 1.3.3.6.5 1.2.5 1.9 0 .7-.2 1.3-.5 1.8s-.7.9-1.2 1.1v.1c.7.3 1.2.7 1.6 1.3.4.6.6 1.3.6 2.1 0 .8-.2 1.5-.6 2.1s-.9 1.1-1.6 1.4c-.7.4-1.5.6-2.4.6zm9.9-9.4-2.3 1.7-1.2-1.8 4.1-3h1.7v12.3h-2.3z" fill="#1967d2" />
        </svg>
    );
}

function CalendarButtons({ session, compact = false }) {
    return (
        <div className={styles.btnRow}>
            <a href={googleCalendarUrl(session)} target="_blank" rel="noopener noreferrer" className={styles.btn} data-kind="google">
                <GCalIcon /> {compact ? 'Add to Google Calendar' : 'Add to Google Calendar'}
            </a>
        </div>
    );
}

export function NadtiSpeakerCard({ id }) {
    const s = sessionById(id);
    if (!s) return null;
    return (
        <article className={styles.card} id={`speaker-${s.id}`}>
            <div className={styles.portraitWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.portrait} alt={s.speaker} className={styles.portrait} loading="lazy" />
                <span className={styles.flagBadge} title={s.country}>{s.flag}</span>
            </div>
            <div className={styles.body}>
                <div className={styles.country}>{s.flag} {s.country} · {s.track}</div>
                <h3 className={styles.name}>{s.speaker}</h3>
                {s.degrees ? <div className={styles.degrees}>{s.degrees}</div> : null}
                <div className={styles.role}>{s.role}</div>
                <p className={styles.talk}>{s.title}</p>
                <div className={styles.slot}>
                    <span aria-hidden="true">🗓</span> {s.day} · <strong>{sessionSlot(s)}</strong> · SMX Halls 1 to 3
                </div>
                <CalendarButtons session={s} />
                <div className={styles.alarmNote}>Opens Google Calendar with the speaker, lecture, venue and booth details filled in. Your usual reminder applies.</div>
            </div>
        </article>
    );
}

export function NadtiSchedule() {
    const days = [];
    for (const s of NADTI_SESSIONS) {
        let d = days.find((x) => x.day === s.day);
        if (!d) { d = { day: s.day, items: [] }; days.push(d); }
        d.items.push(s);
    }
    return (
        <div className={styles.schedule}>
            {days.map((d) => (
                <section key={d.day} className={styles.day}>
                    <h4 className={styles.dayTitle}>{d.day}</h4>
                    {d.items.map((s) => (
                        <div key={s.id} className={styles.row}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={s.portrait} alt="" className={styles.rowAvatar} loading="lazy" />
                            <div className={styles.rowBody}>
                                <div className={styles.rowTime}>
                                    <strong>{sessionSlot(s)}</strong>
                                    {s.track === 'Student Forum' ? <span className={styles.tag}>Student Forum</span> : null}
                                </div>
                                <div className={styles.rowName}>
                                    <a href={`#speaker-${s.id}`}>{s.speaker}</a>{s.degrees ? `, ${s.degrees}` : ''} <span className={styles.rowFlag}>{s.flag} {s.country}</span>
                                </div>
                                <div className={styles.rowTalk}>{s.title}</div>
                                <CalendarButtons session={s} compact />
                            </div>
                        </div>
                    ))}
                </section>
            ))}
        </div>
    );
}
