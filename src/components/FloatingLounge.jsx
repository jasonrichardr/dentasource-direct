'use client';

import { useEffect, useRef, useState } from 'react';

const LOUNGE_VOL = 0.32;

// The lounge — a compact floating glass button. Idle, it breathes softly; playing,
// a tiny equalizer dances. When any reel speaks (scroll-focused showcase video or a
// marble opened in the theater), the lounge PAUSES completely and resumes by itself
// once the reel goes quiet — two audio sources never overlap.
export default function FloatingLounge() {
    const audioRef = useRef(null);
    const fadeRef = useRef(null);
    const suppressedRef = useRef(false); // paused BY a reel — resume when it ends
    const canFadeRef = useRef(null);     // iOS Safari ignores .volume writes — detect once
    const [playing, setPlaying] = useState(false);

    const getAudio = () => {
        if (!audioRef.current) {
            const a = new Audio('/audio/reading-flow.m4a');
            a.loop = true;
            a.preload = 'auto';
            audioRef.current = a;
            // Feature-detect programmatic volume: iPhones pin media volume to the
            // hardware buttons and silently ignore .volume writes. Without this check
            // the fade loop waits forever for a volume that never moves — and pause()
            // never fires (the "stuck lounge" on iOS).
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

    const fadeTo = (target, done) => {
        const a = audioRef.current;
        if (!a) return;
        clearInterval(fadeRef.current);
        if (!canFadeRef.current) {
            // No volume control (iOS) — act instantly instead of fading.
            if (done) done();
            return;
        }
        fadeRef.current = setInterval(() => {
            const delta = target - a.volume;
            if (Math.abs(delta) < 0.02) {
                a.volume = target;
                clearInterval(fadeRef.current);
                if (done) done();
                return;
            }
            a.volume = Math.min(1, Math.max(0, a.volume + delta * 0.2));
        }, 60);
    };

    const start = () => {
        const a = getAudio();
        if (canFadeRef.current) a.volume = 0;
        setPlaying(true); // optimistic — the button responds instantly even on slow networks
        const p = a.play();
        if (p && typeof p.then === 'function') {
            p.then(() => fadeTo(LOUNGE_VOL)).catch(() => setPlaying(false));
        } else {
            fadeTo(LOUNGE_VOL);
        }
    };

    const stop = () => {
        const a = audioRef.current;
        setPlaying(false);
        if (!a) return;
        fadeTo(0, () => a.pause());
    };

    const toggle = () => {
        suppressedRef.current = false; // a manual toggle always wins over auto-resume
        if (playing) stop();
        else start();
    };

    // A reel with audio started → pause the lounge; it ended → resume if WE paused it.
    useEffect(() => {
        const onVideoAudio = (e) => {
            const reelSpeaking = !!e.detail?.on;
            const a = audioRef.current;
            if (reelSpeaking) {
                if (a && !a.paused) {
                    suppressedRef.current = true;
                    stop();
                }
            } else if (suppressedRef.current) {
                suppressedRef.current = false;
                start();
            }
        };
        window.addEventListener('dsd:videoaudio', onVideoAudio);
        return () => {
            window.removeEventListener('dsd:videoaudio', onVideoAudio);
            clearInterval(fadeRef.current);
            if (audioRef.current) audioRef.current.pause();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <style>{`
                @keyframes dsdLoungeBreath {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.28), 0 6px 24px rgba(0,0,0,0.22); }
                    50% { box-shadow: 0 0 0 9px rgba(52, 211, 153, 0), 0 6px 24px rgba(0,0,0,0.22); }
                }
                @keyframes dsdLoungeEq {
                    0%, 100% { transform: scaleY(0.4); }
                    50% { transform: scaleY(1); }
                }
                .dsd-lounge-idle { animation: dsdLoungeBreath 3.4s ease-in-out infinite; }
                .dsd-lounge-eq span {
                    display: inline-block; width: 2.5px; border-radius: 2px;
                    background: currentColor; transform-origin: bottom;
                    animation: dsdLoungeEq 1.1s ease-in-out infinite;
                }
                .dsd-lounge-eq span:nth-child(1) { height: 7px; animation-delay: 0s; }
                .dsd-lounge-eq span:nth-child(2) { height: 12px; animation-delay: 0.22s; }
                .dsd-lounge-eq span:nth-child(3) { height: 9px; animation-delay: 0.44s; }
                .dsd-lounge-label {
                    max-width: 0; opacity: 0; overflow: hidden; white-space: nowrap;
                    transition: max-width .35s ease, opacity .3s ease, margin .35s ease;
                    margin-left: 0;
                }
                .dsd-lounge:hover .dsd-lounge-label {
                    max-width: 110px; opacity: 1; margin-left: 8px;
                }
            `}</style>
            <button
                type="button"
                onClick={toggle}
                aria-pressed={playing}
                aria-label={playing ? 'Pause lounge music' : 'Play lounge flow music'}
                title={playing ? 'Pause lounge music' : 'Lounge · flow music'}
                className={`dsd-lounge fixed bottom-5 left-5 z-40 flex h-11 items-center rounded-full border border-white/25 bg-black/25 px-[13px] text-emerald-50 backdrop-blur-xl transition-colors duration-300 hover:bg-black/40 ${
                    playing ? '' : 'dsd-lounge-idle'
                }`}
                style={{ WebkitBackdropFilter: 'blur(20px)' }}
            >
                {playing ? (
                    <span className="dsd-lounge-eq flex items-end gap-[2px]" aria-hidden="true">
                        <span /><span /><span />
                    </span>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" className="size-[15px]" aria-hidden="true">
                        <path d="M9 18V6l10-2v12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="6.5" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.7" />
                        <circle cx="16.5" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.7" />
                    </svg>
                )}
                <span className="dsd-lounge-label text-[11px] font-semibold tracking-[0.06em]">
                    {playing ? 'Lounge · on' : 'Lounge music'}
                </span>
            </button>
        </>
    );
}
