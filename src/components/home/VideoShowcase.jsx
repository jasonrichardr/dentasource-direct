'use client';

import { useRef, useEffect } from 'react';
import { m as motion } from 'framer-motion';
import { mediaUrl } from '@/lib/cinema/media';

const videos = [
    { src: '/videos/dsd-showcase-4.mp4', poster: '/videos/dsd-showcase-4-poster.jpg', label: 'Meet the team — Stay vibrant ✨❤️' },
    { src: '/videos/dsd-showcase.mp4', poster: '/videos/dsd-showcase-poster.jpg', label: 'SMX Convention' },
    { src: '/videos/dsd-showcase-2.mp4', poster: '/videos/dsd-showcase-2-poster.jpg', label: 'Pre-inspection before delivery & install' },
    { src: '/videos/dsd-showcase-6.mp4', poster: '/videos/dsd-showcase-6-poster.jpg', label: 'ROSON training & service — our exclusive partner 🤝' },
    { src: '/videos/dsd-showcase-5.mp4', poster: '/videos/dsd-showcase-5-poster.jpg', label: 'Denjoy — endo-focused, with research & development' },
    { src: '/videos/dsd-showcase-3.mp4', poster: '/videos/dsd-showcase-3-poster.jpg', label: 'Digital dentistry & surgery — updated skills every year' },
];

export default function VideoShowcase() {
    const videoRefs = useRef([]);

    // Reels-style focus: as the user scrolls, the clip nearest the viewport
    // center autoplays immediately — with audio once the browser allows it
    // (after the first tap/click/keypress anywhere) — while every other clip
    // pauses and mutes, so attention stays on one video at a time.
    useEffect(() => {
        const els = videoRefs.current.filter(Boolean);
        if (!els.length || typeof IntersectionObserver === 'undefined') return;

        let gestureSeen = false;
        const gestures = ['pointerdown', 'keydown', 'touchstart'];
        const onGesture = () => {
            gestureSeen = true;
            gestures.forEach((ev) => window.removeEventListener(ev, onGesture));
        };
        gestures.forEach((ev) => window.addEventListener(ev, onGesture, { passive: true }));

        const ratios = new Map();

        const tellLounge = (on) =>
            window.dispatchEvent(new CustomEvent('dsd:videoaudio', { detail: { on } }));

        const focusCenter = () => {
            const midY = window.innerHeight / 2;
            const midX = window.innerWidth / 2;
            let active = null;
            let best = Infinity;
            els.forEach((el) => {
                // A reel qualifies as soon as it's meaningfully on screen (25%) — audio
                // starts the moment it autoplays, not only once it reaches dead center.
                if ((ratios.get(el) || 0) < 0.25) return;
                const r = el.getBoundingClientRect();
                const d = Math.abs(r.top + r.height / 2 - midY) + Math.abs(r.left + r.width / 2 - midX);
                if (d < best) { best = d; active = el; }
            });

            // Hand the stage over BEFORE the reel speaks: the lounge starts fading out
            // first, so the two audio sources never fight — no overlap, no race.
            if (active && gestureSeen) tellLounge(true);
            else if (!active) tellLounge(false);

            els.forEach((el) => {
                if (el === active) {
                    if (gestureSeen && el.muted) {
                        el.muted = false;
                        el.volume = 1;
                    }
                    const p = el.play();
                    if (p && typeof p.catch === 'function') {
                        p.catch(() => {
                            // Audio blocked — fall back to muted autoplay and give the
                            // stage back to the lounge, since no reel is speaking.
                            el.muted = true;
                            const m = el.play();
                            if (m && typeof m.catch === 'function') m.catch(() => {});
                            tellLounge(false);
                        });
                    }
                } else {
                    el.muted = true;
                    if (!el.paused) el.pause();
                }
            });
        };

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => ratios.set(entry.target, entry.intersectionRatio));
                focusCenter();
            },
            { threshold: [0, 0.25, 0.45, 0.7, 1] }
        );
        els.forEach((el) => io.observe(el));

        // Re-evaluate the center while scrolling/swiping so focus hands off instantly.
        let raf = null;
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => { raf = null; focusCenter(); });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('touchmove', onScroll, { passive: true });

        return () => {
            io.disconnect();
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('touchmove', onScroll);
            gestures.forEach((ev) => window.removeEventListener(ev, onGesture));
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <section className="relative overflow-hidden bg-[#0A1410] px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
            {/* Ambient glows */}
            <div className="pointer-events-none absolute -top-24 left-1/4 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[140px]" />
            <div className="pointer-events-none absolute bottom-0 right-1/4 h-[360px] w-[360px] translate-x-1/2 rounded-full bg-[#C99A3C]/10 blur-[140px]" />

            <div className="relative mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                        See Us In Action
                    </p>
                    <h2 className="mt-2 text-[1.7rem] leading-[1.12] font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
                        The real DentaSource.
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-[14px] leading-relaxed text-white/55 sm:text-base">
                        True enthusiasts and professionals in their craft. The crew I get to build with every day —
                        and they bring it. Real footage, no stock photos.
                    </p>
                </motion.div>

                <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-6">
                    {videos.map((v, i) => (
                        <motion.div
                            key={v.src}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                            className="flex flex-col items-center"
                        >
                            <div className="group relative aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-2xl bg-black ring-1 ring-white/10 shadow-2xl shadow-black/40 transition-transform duration-300 hover:-translate-y-1">
                                <video
                                    ref={(el) => { videoRefs.current[i] = el; }}
                                    className="h-full w-full object-cover"
                                    controls
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                    poster={v.poster}
                                >
                                    <source src={mediaUrl(v.src)} type="video/mp4" />
                                    Your browser doesn&apos;t support embedded video.
                                </video>
                            </div>
                            <p className="mt-3.5 max-w-[260px] text-center text-[13px] font-medium leading-snug text-white/80">
                                {v.label}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <p className="mt-12 text-center text-sm text-white/45">
                    See more on{' '}
                    <a
                        href="https://www.facebook.com/dentasource"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
                    >
                        Facebook
                    </a>{' '}
                    and{' '}
                    <a
                        href="https://www.tiktok.com/@dentasourcedirect"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
                    >
                        TikTok
                    </a>
                    .
                </p>
            </div>
        </section>
    );
}
