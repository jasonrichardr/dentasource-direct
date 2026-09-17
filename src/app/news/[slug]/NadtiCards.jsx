"use client";

import { useEffect, useState } from 'react';
import { NADTI_SESSIONS, sessionById, sessionSlot, googleCalendarUrl, icsUrl } from '@/data/nadti-2026-sessions';
import styles from './nadti.module.css';

// Which calendar the reader most likely uses. iPhone and iPad open .ics files straight into
// Apple Calendar; Android hands a Google Calendar template link to the Calendar app.
function usePlatform() {
    const [platform, setPlatform] = useState('other');
    useEffect(() => {
        const ua = navigator.userAgent || '';
        const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        setPlatform(iOS ? 'ios' : /Android/i.test(ua) ? 'android' : 'other');
    }, []);
    return platform;
}

function CalendarButtons({ session, compact = false }) {
    const platform = usePlatform();
    const apple = (
        <a key="apple" href={icsUrl(session.id)} className={styles.btn} data-kind="apple">
            <span aria-hidden="true"></span> {compact ? 'iPhone' : 'Add to iPhone Calendar'}
        </a>
    );
    const google = (
        <a key="google" href={googleCalendarUrl(session)} target="_blank" rel="noopener noreferrer" className={styles.btn} data-kind="google">
            <span aria-hidden="true" className={styles.gdot} /> {compact ? 'Google' : 'Add to Google Calendar'}
        </a>
    );
    const order = platform === 'android' ? [google, apple] : [apple, google];
    return (
        <div className={styles.btnRow} data-platform={platform}>
            {order.map((b, i) => (i === 0 ? b : <span key={b.key} className={styles.secondary}>{b}</span>))}
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
                <div className={styles.alarmNote}>Saves with two reminders, 30 minutes and 5 minutes before, plus the venue and booth details.</div>
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
    const platform = usePlatform();
    return (
        <div className={styles.schedule}>
            <div className={styles.allRow}>
                <a href={icsUrl('all')} className={styles.btn} data-kind="apple">
                    <span aria-hidden="true">🗓</span> Add all ten lectures to my calendar
                </a>
                <span className={styles.allHint}>
                    {platform === 'android' ? 'Opens in Google Calendar as a set of events.' : 'One file, ten events, reminders on each.'}
                </span>
            </div>
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
