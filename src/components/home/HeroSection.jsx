'use client';

import { m as motion } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const stats = [
    { value: '140', unit: 'sqm', label: 'Showroom' },
    { value: 'ISO 13485', unit: '', label: 'Certified' },
    { value: 'Up to 5-Yr', unit: '', label: 'Motor Warranty' },
    { value: '120+', unit: '', label: 'Countries Trust ROSON' },
];

const FULL_VOL = 1.0;
const DUCK_VOL = 0.12; // volume while the tab/app is not focused

export default function HeroSection() {
    const videoRef = useRef(null);
    const userMutedRef = useRef(false); // sticky: user chose silence
    const fadeRaf = useRef(null);
    const [muted, setMuted] = useState(true); // reflects video.muted for the button

    // Smooth volume ramp (rides the display refresh for a buttery fade).
    const fadeTo = useCallback((target, ms = 500) => {
        const v = videoRef.current;
        if (!v) return;
        if (fadeRaf.current) cancelAnimationFrame(fadeRaf.current);
        const from = v.volume;
        const start = performance.now();
        const tick = (now) => {
            const t = Math.min(1, (now - start) / ms);
            const e = 1 - (1 - t) * (1 - t); // easeOutQuad
            v.volume = Math.max(0, Math.min(1, from + (target - from) * e));
            if (t < 1) fadeRaf.current = requestAnimationFrame(tick);
            else fadeRaf.current = null;
        };
        fadeRaf.current = requestAnimationFrame(tick);
    }, []);

    // Turn sound on (unless the user chose to keep it muted). Fades in from 0.
    const enableSound = useCallback(() => {
        const v = videoRef.current;
        if (!v || userMutedRef.current || !v.muted) return;
        v.muted = false;
        v.volume = 0;
        const p = v.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
        fadeTo(document.hidden ? DUCK_VOL : FULL_VOL, 700);
        setMuted(false);
    }, [fadeTo]);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        v.volume = 0; // start silent so the first unmute fades in cleanly

        // Sound on the first interaction (autoplay-with-sound is blocked until a gesture).
        const events = ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll'];
        const onFirst = () => {
            enableSound();
            events.forEach((ev) => window.removeEventListener(ev, onFirst));
        };
        events.forEach((ev) => window.addEventListener(ev, onFirst, { passive: true }));

        // Duck the volume when they switch tabs/apps; bring it back when they return.
        const duck = () => {
            const vid = videoRef.current;
            if (vid && !vid.muted && !userMutedRef.current) fadeTo(DUCK_VOL, 450);
        };
        const restore = () => {
            const vid = videoRef.current;
            if (vid && !vid.muted && !userMutedRef.current) fadeTo(FULL_VOL, 600);
        };
        const onVisibility = () => (document.hidden ? duck() : restore());
        document.addEventListener('visibilitychange', onVisibility);
        window.addEventListener('blur', duck);
        window.addEventListener('focus', restore);

        // Auto-mute when the hero scrolls out of view; bring the sound back when
        // it returns (unless the user muted it themselves).
        let autoMuted = false;
        let io;
        if (typeof IntersectionObserver !== 'undefined') {
            io = new IntersectionObserver(
                ([entry]) => {
                    const vid = videoRef.current;
                    if (!vid) return;
                    if (entry.intersectionRatio < 0.25 && !vid.muted) {
                        vid.muted = true;
                        autoMuted = true;
                        setMuted(true);
                    } else if (entry.intersectionRatio >= 0.5 && autoMuted && !userMutedRef.current) {
                        autoMuted = false;
                        vid.muted = false;
                        vid.volume = 0;
                        const p = vid.play();
                        if (p && typeof p.catch === 'function') p.catch(() => {});
                        fadeTo(document.hidden ? DUCK_VOL : FULL_VOL, 500);
                        setMuted(false);
                    }
                },
                { threshold: [0, 0.25, 0.5] }
            );
            io.observe(v);
        }

        return () => {
            events.forEach((ev) => window.removeEventListener(ev, onFirst));
            document.removeEventListener('visibilitychange', onVisibility);
            window.removeEventListener('blur', duck);
            window.removeEventListener('focus', restore);
            if (io) io.disconnect();
            if (fadeRaf.current) cancelAnimationFrame(fadeRaf.current);
        };
    }, [enableSound, fadeTo]);

    function toggleSound() {
        const v = videoRef.current;
        if (!v) return;
        if (v.muted) {
            userMutedRef.current = false;
            v.muted = false;
            v.volume = 0;
            const p = v.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
            fadeTo(document.hidden ? DUCK_VOL : FULL_VOL, 500);
            setMuted(false);
        } else {
            userMutedRef.current = true; // sticky — stays muted through tab changes
            if (fadeRaf.current) cancelAnimationFrame(fadeRaf.current);
            v.muted = true;
            setMuted(true);
        }
    }

    return (
        <section className="relative w-full min-h-[100svh] overflow-hidden bg-[#0A1410]">
            {/* Autoplay video background */}
            <div className="absolute inset-0 z-0">
                <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster="/videos/dsd-hero-poster.jpg"
                >
                    <source src="/videos/dsd-hero-loop.mp4" type="video/mp4" />
                </video>
                {/* Legibility overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0A1410] to-transparent" />
            </div>

            {/* Subtle sound toggle */}
            <button
                onClick={toggleSound}
                aria-label={muted ? 'Unmute hero video' : 'Mute hero video'}
                title={muted ? 'Tap for sound' : 'Mute'}
                className="absolute right-5 bottom-28 z-30 flex size-9 items-center justify-center rounded-full bg-black/30 text-white/70 ring-1 ring-white/15 backdrop-blur-sm transition hover:bg-black/55 hover:text-white"
            >
                {muted ? <VolumeX className="size-[17px]" strokeWidth={1.75} /> : <Volume2 className="size-[17px]" strokeWidth={1.75} />}
            </button>

            <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-28 sm:pt-32 md:pt-36 pb-8 sm:pb-12 min-h-[100svh] flex flex-col">
                <div className="flex-1 flex flex-col justify-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[2rem] leading-[1.12] sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-3xl"
                    >
                        Your Growth Partner{' '}
                        <br className="hidden sm:block" />
                        <span className="text-emerald-400">in Dentistry.</span>
                    </motion.h1>
                </div>

                {/* Stats strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 sm:divide-x sm:divide-white/15 border-t border-white/15 pt-6 sm:pt-8 mt-8 lg:mt-10">
                        {stats.map((stat) => (
                            <div key={stat.label} className="sm:px-6 first:sm:pl-0 last:sm:pr-0">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                                        {stat.value}
                                    </span>
                                    {stat.unit && (
                                        <span className="text-sm sm:text-base font-medium text-white/60">{stat.unit}</span>
                                    )}
                                </div>
                                <span className="text-[11px] sm:text-xs font-medium text-white/60 uppercase tracking-wider mt-1 block">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
