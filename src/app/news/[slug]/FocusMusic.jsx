"use client";

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';

const TARGET_VOLUME = 0.35;
const TOAST_MS = 2000;

// The focus-music library. Track 0 is the house ambient loop; the rest is the
// lounge collection the shuffle button wanders through.
const TRACKS = [
    { src: '/audio/reading-flow.m4a', name: 'Flow State' },
    { src: '/audio/tracks/town-01-theme-of-alberta.m4a', name: 'Theme of Alberta' },
    { src: '/audio/tracks/town-02-theme-of-geffen.m4a', name: 'Theme of Geffen' },
    { src: '/audio/tracks/town-03-theme-of-payon.m4a', name: 'Theme of Payon' },
    { src: '/audio/tracks/town-04-theme-of-prontera.m4a', name: 'Theme of Prontera' },
    { src: '/audio/tracks/town-05-theme-of-morroc.m4a', name: 'Theme of Morroc' },
    { src: '/audio/tracks/town-06-everlasting-wanderers-izlude.m4a', name: 'Everlasting Wanderers (Izlude)' },
    { src: '/audio/tracks/town-07-theme-of-al-de-baran.m4a', name: 'Theme of Al de Baran' },
    { src: '/audio/tracks/town-08-theme-of-lutie.m4a', name: 'Theme of Lutie' },
    { src: '/audio/tracks/town-09-welcome-my-lord.m4a', name: 'Welcome My Lord' },
    { src: '/audio/tracks/town-10-high-roller-coaster-comodo.m4a', name: 'High Roller Coaster (Comodo)' },
    { src: '/audio/tracks/town-11-theme-of-juno.m4a', name: 'Theme of Juno' },
    { src: '/audio/tracks/town-12-purity-of-your-smile-amatsu.m4a', name: 'Purity of your Smile (Amatsu)' },
    { src: '/audio/tracks/town-13-not-so-far-away-gonryun.m4a', name: 'Not So Far Away (Gonryun)' },
    { src: '/audio/tracks/town-14-jazzy-funky-sweety-umbala.m4a', name: 'Jazzy Funky Sweety (Umbala)' },
    { src: '/audio/tracks/town-15-latinova-hugel.m4a', name: 'Latinova (Hugel)' },
    { src: '/audio/tracks/town-16-christmas-in-the-13th-month-niflheim.m4a', name: 'Christmas in the 13th Month (Niflheim)' },
    { src: '/audio/tracks/town-17-the-great-luoyang.m4a', name: 'The Great (Luoyang)' },
    { src: '/audio/tracks/town-18-thai-orchid-ayothaya.m4a', name: 'Thai Orchid (Ayothaya)' },
    { src: '/audio/tracks/town-19-steel-me-einbroch.m4a', name: 'Steel Me (Einbroch)' },
    { src: '/audio/tracks/town-20-noblesse-oblige-lighthalzen.m4a', name: 'Noblesse Oblige (Lighthalzen)' },
    { src: '/audio/tracks/town-21-theme-of-rael-rachel.m4a', name: 'Theme of Rael (Rachel)' },
    { src: '/audio/tracks/town-22-theme-of-moscovia.m4a', name: 'Theme of Moscovia' },
    { src: '/audio/tracks/town-23-splendid-dreams.m4a', name: 'Splendid Dreams' },
    { src: '/audio/tracks/field-01-streamside.m4a', name: 'Streamside' },
    { src: '/audio/tracks/field-02-one-fine-day.m4a', name: 'One Fine Day' },
    { src: '/audio/tracks/field-03-wanna-be-free.m4a', name: 'Wanna Be Free' },
    { src: '/audio/tracks/field-04-plateau.m4a', name: 'Plateau' },
    { src: '/audio/tracks/field-05-peaceful-forest.m4a', name: 'Peaceful Forest' },
    { src: '/audio/tracks/field-06-tread-on-the-ground.m4a', name: 'Tread On The Ground' },
    { src: '/audio/tracks/field-07-yuna-song.m4a', name: 'Yuna Song' },
    { src: '/audio/tracks/field-08-desert.m4a', name: 'Desert' },
    { src: '/audio/tracks/field-09-brassy-road.m4a', name: 'Brassy Road' },
    { src: '/audio/tracks/field-10-tale-of-the-east.m4a', name: 'Tale of The East' },
    { src: '/audio/tracks/field-11-dream-of-a-whale.m4a', name: 'Dream of a Whale' },
    { src: '/audio/tracks/field-12-believe-in-myself.m4a', name: 'Believe in Myself' },
    { src: '/audio/tracks/field-13-great-honor.m4a', name: 'Great Honor' },
    { src: '/audio/tracks/field-14-silver-bell.m4a', name: 'Silver Bell' },
    { src: '/audio/tracks/field-15-white-christmas.m4a', name: 'White Christmas' },
    { src: '/audio/tracks/field-16-don-t-cry-baby.m4a', name: 'Don\'t Cry Baby' },
    { src: '/audio/tracks/field-17-antique-cowboy.m4a', name: 'Antique Cowboy' },
    { src: '/audio/tracks/field-18-i-miss-you.m4a', name: 'I Miss You' },
    { src: '/audio/tracks/field-19-one-step-closer.m4a', name: 'One Step Closer' },
    { src: '/audio/tracks/dungeon-01-ancient-groover.m4a', name: 'Ancient Groover' },
    { src: '/audio/tracks/dungeon-02-through-the-tower.m4a', name: 'Through The Tower' },
    { src: '/audio/tracks/dungeon-03-can-t-go-home-again-baby.m4a', name: 'Can\'t Go Home Again Baby' },
    { src: '/audio/tracks/dungeon-04-rag-all-night-long.m4a', name: 'Rag All Night Long' },
    { src: '/audio/tracks/dungeon-05-jingle-bell-on-ragnarok.m4a', name: 'Jingle Bell On Ragnarok' },
    { src: '/audio/tracks/dungeon-06-dancing-christmas-in-the-13th-month.m4a', name: 'Dancing Christmas in the 13th Month' },
    { src: '/audio/tracks/dungeon-07-labyrinth.m4a', name: 'Labyrinth' },
    { src: '/audio/tracks/dungeon-08-aeon.m4a', name: 'Aeon' },
    { src: '/audio/tracks/dungeon-09-treasure-hunter.m4a', name: 'Treasure Hunter' },
    { src: '/audio/tracks/dungeon-10-into-the-abyss.m4a', name: 'Into The Abyss' },
    { src: '/audio/tracks/dungeon-11-wind-of-tragedy.m4a', name: 'Wind of Tragedy' },
    { src: '/audio/tracks/dungeon-12-title.m4a', name: 'Title' }
];

export default function FocusMusic({ minutes }) {
    const audioRef = useRef(null);
    const fadeRef = useRef(null);
    const canFadeRef = useRef(null); // iPhones ignore .volume writes — detect once
    const trackRef = useRef(0);
    const barRef = useRef(null);
    const toastTimers = useRef([]);
    const [playing, setPlaying] = useState(false);
    const [floating, setFloating] = useState(false); // hero bar scrolled away → show mini player
    const [toast, setToast] = useState(null);        // track name, shown ~2s on play/shuffle
    const [toastOut, setToastOut] = useState(false); // exit-animation phase

    const getAudio = () => {
        if (!audioRef.current) {
            const a = new Audio(TRACKS[trackRef.current].src);
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

    // Show the track name for ~2s, then animate back into the button.
    const announce = (name) => {
        toastTimers.current.forEach(clearTimeout);
        setToast(name);
        setToastOut(false);
        toastTimers.current = [
            setTimeout(() => setToastOut(true), TOAST_MS - 350),
            setTimeout(() => { setToast(null); setToastOut(false); }, TOAST_MS),
        ];
    };

    const start = () => {
        const a = getAudio();
        setPlaying(true); // the tap responds instantly, even on slow networks
        announce(TRACKS[trackRef.current].name);
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

    // Shuffle: jump to a different random track. The tap itself is the gesture,
    // so mobile browsers allow the new play() even mid-playback.
    const shuffle = () => {
        let next = trackRef.current;
        while (next === trackRef.current) next = Math.floor(Math.random() * TRACKS.length);
        trackRef.current = next;
        const a = getAudio();
        clearInterval(fadeRef.current);
        a.pause();
        a.src = TRACKS[next].src;
        setPlaying(true);
        announce(TRACKS[next].name);
        const p = a.play();
        if (p && typeof p.then === 'function') p.then(fadeIn).catch(() => setPlaying(false));
        else fadeIn();
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
            toastTimers.current.forEach(clearTimeout);
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

    const ShuffleIcon = (
        <svg viewBox="0 0 24 24" fill="none" className={styles.focusIcon} aria-hidden="true">
            <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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
                    <span>{toast || (playing ? 'Focus music on' : 'Read with focus music')}</span>
                </button>
                <button
                    type="button"
                    onClick={shuffle}
                    className={styles.focusToggle}
                    aria-label="Shuffle to another track"
                    title="Shuffle track"
                >
                    {ShuffleIcon}
                </button>
                <span className={styles.focusHint}>
                    Ambient audio tuned for present, focused reading
                </span>
            </div>

            {/* Floating mini player — bottom right, only while reading below the hero */}
            {floating && (
                <div className={styles.focusFloat}>
                    {toast && (
                        <span className={`${styles.focusToast} ${toastOut ? styles.focusToastOut : ''}`}>
                            {toast}
                        </span>
                    )}
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
                        {ShuffleIcon}
                    </button>
                </div>
            )}
        </>
    );
}
