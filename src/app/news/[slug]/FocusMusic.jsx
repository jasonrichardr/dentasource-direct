"use client";

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';

const TARGET_VOLUME = 0.35;

export default function FocusMusic({ minutes }) {
    const audioRef = useRef(null);
    const fadeRef = useRef(null);
    const [playing, setPlaying] = useState(false);

    const fadeTo = (target, done) => {
        const audio = audioRef.current;
        if (!audio) return;
        clearInterval(fadeRef.current);
        fadeRef.current = setInterval(() => {
            const delta = target - audio.volume;
            if (Math.abs(delta) < 0.03) {
                audio.volume = target;
                clearInterval(fadeRef.current);
                if (done) done();
                return;
            }
            audio.volume = Math.min(1, Math.max(0, audio.volume + delta * 0.2));
        }, 80);
    };

    const toggle = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (playing) {
            fadeTo(0, () => audio.pause());
            setPlaying(false);
        } else {
            audio.volume = 0;
            audio.play().then(() => {
                fadeTo(TARGET_VOLUME);
                setPlaying(true);
            }).catch(() => {});
        }
    };

    useEffect(() => {
        return () => {
            clearInterval(fadeRef.current);
            if (audioRef.current) audioRef.current.pause();
        };
    }, []);

    return (
        <div className={styles.focusBar}>
            <audio ref={audioRef} src="/audio/reading-flow.m4a" loop preload="none" />
            <span className={styles.readTime}>{minutes} min read</span>
            <span className={styles.focusDivider} aria-hidden="true">·</span>
            <button
                type="button"
                onClick={toggle}
                className={`${styles.focusToggle} ${playing ? styles.focusToggleOn : ''}`}
                aria-pressed={playing}
                aria-label={playing ? 'Turn off focus music' : 'Turn on focus music'}
            >
                {playing ? (
                    <span className={styles.eq} aria-hidden="true">
                        <span /><span /><span />
                    </span>
                ) : (
                    <svg className={styles.focusIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M9 18V6l10-2v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="6.5" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                        <circle cx="16.5" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                )}
                <span>{playing ? 'Focus music on' : 'Read with focus music'}</span>
            </button>
            <span className={styles.focusHint}>
                Ambient audio tuned for present, focused reading
            </span>
        </div>
    );
}
