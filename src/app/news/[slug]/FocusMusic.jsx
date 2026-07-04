"use client";

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';

const TARGET_VOLUME = 0.35;

// The focus-music tracks. Add files to public/audio/ and list them here —
// the shuffle button rotates the reader through them.
const TRACKS = [
    '/audio/reading-flow.m4a',
];

export default function FocusMusic({ minutes }) {
    const audioRef = useRef(null);
    const fadeRef = useRef(null);
    const canFadeRef = useRef(null); // iPhones ignore .volume writes — detect once
    const trackRef = useRef(0);
    const barRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [floating, setFloating] = useState(false); // hero bar scrolled away → show mini player

    const getAudio = () => {
        if (!audioRef.current) {
            const a = new Audio(TRACKS[trackRef.current]);
            a.loop = true;
            a.preload = 'none';
            audioRef.current = a;
            try {
                a.volume = 0.5;
                canFadeRef.current = Math.abs(a.volume - 0.5) < 0.01;
                a.volume = 1;
            } catch {
                canFadeRef.current = false;
            }
        }
        return audioRef.current;
    };

    const fadeIn = () => {
        const a = audioRef.current;
        if (!a || !canFadeRef.current) return;
        clearInterval(fadeRef.current);
        a.volume = 0;
        fadeRef.current = setInterval(() => {
            const delta = TARGET_VOLUME - a.volume;
            if (Math.abs(delta) < 0.03) {
                a.volume = TARGET_VOLUME;
                clearInterval(fadeRef.current);
                return;
            }
            a.volume = Math.min(1, a.volume + delta * 0.2);
        }, 80);
    };

    const start = () => {
        const a = getAudio();
        setPlaying(true); // the tap responds instantly, even on slow networks
        const p = a.play();
        if (p && typeof p.then === 'function') {
            p.then(fadeIn).catch(() => setPlaying(false));
        } else {
            fadeIn();
        }
    };

    // STOP IS INSTANT — no fade, no waiting, no device quirks. One tap, silence.
    const stop = () => {
        clearInterval(fadeRef.current);
        setPlaying(false);
        const a = audioRef.current;
        if (a) a.pause();
    };

    const toggle = () => (playing ? stop() : start());

    // Shuffle: jump to a different track. If music is on, the switch is seamless
    // (the tap itself is the gesture, so mobile browsers allow the new play()).
    const shuffle = () => {
        if (TRACKS.length < 2) {
            if (!playing) start();
            return;
        }
        let next = trackRef.current;
        while (next === trackRef.current) next = Math.floor(Math.random() * TRACKS.length);
        trackRef.current = next;
        const a = getAudio();
        const wasPlaying = playing;
        clearInterval(fadeRef.current);
        a.pause();
        a.src = TRACKS[next];
        if (wasPlaying || !playing) {
            setPlaying(true);
            const p = a.play();
            if (p && typeof p.then === 'function') p.then(fadeIn).catch(() => setPlaying(false));
            else fadeIn();
        }
    };

    // The floating mini player appears when the hero bar scrolls out of view.
    useEffect(() => {
        const bar = barRef.current;
        if (!bar || typeof IntersectionObserver === 'undefined') return;
        const io = new IntersectionObserver(
            ([entry]) => setFloating(!entry.isIntersecting),
            { threshold: 0 }
        );
        io.observe(bar);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        return () => {
            clearInterval(fadeRef.current);
            if (audioRef.current) audioRef.current.pause();
        };
    }, []);

    const NoteIcon = (
        <svg viewBox="0 0 24 24" fill="none" className={styles.focusIcon} aria-hidden="true">
            <path d="M9 18V6l10-2v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="6.5" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="16.5" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );

    const Eq = (
        <span className={styles.eq} aria-hidden="true">
            <span /><span /><span />
        </span>
    );

    return (
        <>
            <div className={styles.focusBar} ref={barRef}>
                <span className={styles.readTime}>{minutes} min read</span>
                <span className={styles.focusDivider} aria-hidden="true">·</span>
                <button
                    type="button"
                    onClick={toggle}
                    className={`${styles.focusToggle} ${playing ? styles.focusToggleOn : ''}`}
                    aria-pressed={playing}
                    aria-label={playing ? 'Stop focus music' : 'Play focus music'}
                >
                    {playing ? Eq : NoteIcon}
                    <span>{playing ? 'Focus music on' : 'Read with focus music'}</span>
                </button>
                <span className={styles.focusHint}>
                    Ambient audio tuned for present, focused reading
                </span>
            </div>

            {/* Floating mini player — bottom right, only while reading below the hero */}
            {floating && (
                <div className={styles.focusFloat}>
                    <button
                        type="button"
                        onClick={toggle}
                        className={`${styles.focusFloatBtn} ${playing ? styles.focusFloatBtnOn : ''}`}
                        aria-pressed={playing}
                        aria-label={playing ? 'Stop focus music' : 'Play focus music'}
                        title={playing ? 'Stop focus music' : 'Play focus music'}
                    >
                        {playing ? Eq : NoteIcon}
                    </button>
                    <button
                        type="button"
                        onClick={shuffle}
                        className={styles.focusFloatBtn}
                        aria-label="Shuffle to another track"
                        title="Shuffle track"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className={styles.focusIcon} aria-hidden="true">
                            <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            )}
        </>
    );
}
