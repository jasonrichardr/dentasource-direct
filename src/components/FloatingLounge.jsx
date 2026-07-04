'use client';

import { useEffect, useRef, useState } from 'react';

const LOUNGE_VOL = 0.32;
const DUCK_VOL = 0.05; // while a showcase reel is speaking

// The lounge — a floating glassmorphism music pill. Idle, it breathes softly and
// invites a click; playing, it shows a tiny equalizer and fills the room with the
// flow track. It politely ducks whenever a showcase video is playing with audio.
export default function FloatingLounge() {
    const audioRef = useRef(null);
    const fadeRef = useRef(null);
    const duckedRef = useRef(false);
    const [playing, setPlaying] = useState(false);
    const [touched, setTouched] = useState(false); // collapses the invite label after first use

    const fadeTo = (target, done) => {
        const a = audioRef.current;
        if (!a) return;
        clearInterval(fadeRef.current);
        fadeRef.current = setInterval(() => {
            const delta = target - a.volume;
            if (Math.abs(delta) < 0.02) {
                a.volume = target;
                clearInterval(fadeRef.current);
                if (done) done();
                return;
            }
            a.volume = Math.min(1, Math.max(0, a.volume + delta * 0.18));
        }, 70);
    };

    const toggle = () => {
        setTouched(true);
        if (!audioRef.current) {
            audioRef.current = new Audio('/audio/reading-flow.m4a');
            audioRef.current.loop = true;
            audioRef.current.preload = 'auto';
        }
        const a = audioRef.current;
        if (playing) {
            fadeTo(0, () => a.pause());
            setPlaying(false);
        } else {
            a.volume = 0;
            a.play().then(() => {
                fadeTo(duckedRef.current ? DUCK_VOL : LOUNGE_VOL);
                setPlaying(true);
            }).catch(() => {});
        }
    };

    // Duck under showcase reels that are playing with audio.
    useEffect(() => {
        const onVideoAudio = (e) => {
            duckedRef.current = !!e.detail?.on;
            const a = audioRef.current;
            if (a && !a.paused) fadeTo(duckedRef.current ? DUCK_VOL : LOUNGE_VOL);
        };
        window.addEventListener('dsd:videoaudio', onVideoAudio);
        return () => {
            window.removeEventListener('dsd:videoaudio', onVideoAudio);
            clearInterval(fadeRef.current);
            if (audioRef.current) audioRef.current.pause();
        };
    }, []);

    return (
        <>
            <style>{`
                @keyframes dsdLoungeBreath {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.35), 0 8px 32px rgba(0,0,0,0.25); }
                    50% { box-shadow: 0 0 0 12px rgba(52, 211, 153, 0), 0 8px 32px rgba(0,0,0,0.25); }
                }
                @keyframes dsdLoungePop {
                    0% { transform: scale(1); }
                    35% { transform: scale(0.86); }
                    70% { transform: scale(1.08); }
                    100% { transform: scale(1); }
                }
                @keyframes dsdLoungeEq {
                    0%, 100% { transform: scaleY(0.45); }
                    50% { transform: scaleY(1); }
                }
                .dsd-lounge-idle { animation: dsdLoungeBreath 3.2s ease-in-out infinite; }
                .dsd-lounge-pop { animation: dsdLoungePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
                .dsd-lounge-eq span {
                    display: inline-block; width: 3px; border-radius: 2px;
                    background: currentColor; transform-origin: bottom;
                    animation: dsdLoungeEq 1.1s ease-in-out infinite;
                }
                .dsd-lounge-eq span:nth-child(1) { height: 8px; animation-delay: 0s; }
                .dsd-lounge-eq span:nth-child(2) { height: 14px; animation-delay: 0.22s; }
                .dsd-lounge-eq span:nth-child(3) { height: 10px; animation-delay: 0.44s; }
            `}</style>
            <button
                type="button"
                onClick={toggle}
                aria-pressed={playing}
                aria-label={playing ? 'Pause lounge music' : 'Play lounge flow music'}
                className={`fixed bottom-5 left-5 z-40 flex items-center gap-3 rounded-full border border-white/30 bg-white/15 py-2.5 pl-3 pr-4 text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/25 ${
                    playing ? 'dsd-lounge-pop' : 'dsd-lounge-idle'
                }`}
                style={{ WebkitBackdropFilter: 'blur(24px)' }}
            >
                <span className="flex size-8 items-center justify-center rounded-full bg-emerald-400/25 text-emerald-100 ring-1 ring-emerald-200/40">
                    {playing ? (
                        <span className="dsd-lounge-eq flex items-end gap-[2.5px]" aria-hidden="true">
                            <span /><span /><span />
                        </span>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
                            <path d="M9 18V6l10-2v12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="6.5" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.7" />
                            <circle cx="16.5" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.7" />
                        </svg>
                    )}
                </span>
                <span className="text-[12px] font-semibold tracking-[0.08em] drop-shadow-sm">
                    {playing ? 'Lounge · playing' : touched ? 'Lounge' : 'Lounge · flow music'}
                </span>
            </button>
        </>
    );
}
