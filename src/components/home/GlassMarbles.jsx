'use client';

import { useEffect, useRef } from 'react';
import { createMarbleCluster } from './marbleCluster';

// The FFC company-profile "glass marbles" — ported 1:1. Same cluster, same physics,
// same press-and-hold theater.
//
// ☠️ NOTHING HERE STREAMS FROM ffcdentalclinic.care ANY MORE. 23 of these reels were
// loaded straight off the FFC PATIENT domain, which is a separate business behind a
// separate firewall whose host can change without us: /classic is a live DSD route and it
// must not depend on it. builder-products fetched and re-encoded all 23 into this repo at
// 500c180, and every src below now points at /cinema/reels/. The library records where
// each one came from in its own source_url; do not fetch from those.
//
// This list is the /classic wall and is deliberately NOT reel-library.json. The cinema
// home wall pages through the library; /classic is the fallback page and stays exactly the
// 33 reels it has always shown, in the order it has always shown them.
// EVERY marble is NAMED (Jarich 2026-07-05) — grep a name to find its video fast. Those
// names are developer labels in source and are never rendered.
// EVERY marble is NAMED (Jarich 2026-07-05) — grep a name to find its video fast.
const MARBLES = [
    // ORDER MAPS TO SIZE (see marbleCluster.js sizing): bead 0 = big HERO marble, LAST = small one.
    { src: '/cinema/reels/wall-fb-11.mp4', name: 'HERO — chairside team mid-procedure (Jarich reel, FB 1A3qs2Fyiw)' },
    { src: '/cinema/reels/wall-dsd-showcase-4.mp4', name: 'Meet the team — Stay vibrant' },
    { src: '/cinema/reels/wall-dsd-showcase.mp4', name: 'SMX Convention showcase' },
    { src: '/cinema/reels/wall-dsd-showcase-2.mp4', name: 'Pre-inspection before delivery & install' },
    { src: '/cinema/reels/wall-dsd-showcase-5.mp4', name: 'Denjoy — endo-focused R&D' },
    { src: '/cinema/reels/wall-dsd-showcase-3.mp4', name: 'Digital dentistry & surgery' },
    { src: '/cinema/reels/wall-dsd-hero-loop.mp4', name: 'DSD hero loop — showroom sweep' },
    { src: '/cinema/reels/wall-fb-01.mp4', name: 'Showroom chair session — hands on a live unit' },
    { src: '/cinema/reels/wall-fb-02.mp4', name: 'Studio shoot behind the scenes — DentaSource wall' },
    { src: '/cinema/reels/wall-fb-04.mp4', name: 'FFC dentist intro — white coat at the chair' },
    { src: '/cinema/reels/wall-fb-05.mp4', name: 'Clinic prep — assistant with the clipboard' },
    { src: '/cinema/reels/wall-fb-06.mp4', name: 'Chairside treatment — the M&M jacket patient' },
    { src: '/cinema/reels/wall-fb-07.mp4', name: 'FFC clinic hallway walkthrough' },
    { src: '/cinema/reels/wall-fb-08.mp4', name: 'FFC dentist greeting — white coat wave' },
    { src: '/cinema/reels/wall-fb-09.mp4', name: 'Patient testimonial — young man' },
    { src: '/cinema/reels/wall-fb-10.mp4', name: 'Intraoral close-up — treatment detail' },
    { src: '/cinema/reels/wall-fb-12.mp4', name: 'Showroom event — host on the mic at the chairs' },
    { src: '/cinema/reels/wall-fb-16.mp4', name: 'Chairside dentistry — working on a patient' },
    { src: '/cinema/reels/wall-fb-27.mp4', name: 'Digital scan on the laptop — FFC digital dentistry' },
    { src: '/cinema/reels/wall-fb-17.mp4', name: 'Two doctors walking the clinic' },
    { src: '/cinema/reels/wall-fb-24.mp4', name: 'DentaSource × ROSON operatory at the expo' },
    { src: '/cinema/reels/wall-fb-28.mp4', name: 'DSD team over the equipment + FFC storefront' },
    // Exhibit-loop harvest (2026-07-04) — cut from the 22-min booth master:
    { src: '/reels/ex-01.mp4', name: 'Founder intro talk — sim-lab chairs' },
    { src: '/reels/ex-03.mp4', name: 'Blue chair install road trip' },
    { src: '/reels/ex-07.mp4', name: 'Delivery day — hauling units up the stairs by hand' },
    { src: '/reels/ex-08.mp4', name: 'Provincial run — ferry crossing, then the on-site chair build' },
    { src: '/reels/ex-11.mp4', name: 'Training center promo — phantom heads' },
    { src: '/reels/ex-12.mp4', name: 'Endo skit — the couple' },
    { src: '/reels/ex-14.mp4', name: 'Event night walk-in' },
    { src: '/reels/ex-18.mp4', name: 'Expo booth — autoclave demo' },
    { src: '/reels/ex-20.mp4', name: 'Booth spokesperson' },
    { src: '/reels/ex-21.mp4', name: 'Showroom finale — price boards' },
    { src: '/cinema/reels/wall-fb-03.mp4', name: 'SMALL — convention wave, two women' },
];
const VIDEOS = MARBLES.map((m) => m.src);

export default function GlassMarbles() {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const cluster = createMarbleCluster(mount, {
            videos: VIDEOS,
            count: VIDEOS.length, // exactly one bead per reel — no empty marbles
            isMobile,
            faceZoomDefault: 0.55,
            faceZoom: {},
        });

        // The cluster runs only while its stage is on screen (decoders + physics sleep otherwise).
        const io = new IntersectionObserver(
            ([entry]) => cluster.setActive(entry.isIntersecting && entry.intersectionRatio >= 0.2),
            { threshold: [0, 0.2] }
        );
        io.observe(mount);

        // The press-and-hold theater plays a reel WITH audio. Watch for it opening and
        // closing (it mounts/unmounts a .cp-theater overlay) and tell the lounge, so the
        // music pauses for the reel and continues right after — without forking the
        // verbatim marbleCluster source.
        let theaterOpen = false;
        const mo = new MutationObserver(() => {
            const open = !!document.querySelector('.cp-theater');
            if (open !== theaterOpen) {
                theaterOpen = open;
                window.dispatchEvent(new CustomEvent('dsd:videoaudio', { detail: { on: open } }));
            }
        });
        mo.observe(document.body, { childList: true });

        return () => {
            io.disconnect();
            mo.disconnect();
            if (theaterOpen) window.dispatchEvent(new CustomEvent('dsd:videoaudio', { detail: { on: false } }));
            cluster.dispose();
        };
    }, []);

    return (
        <div className="relative w-screen left-1/2 -translate-x-1/2 bg-[#06070c]">
            {/* Soft edges into the light section — no box, the stage just breathes in and out */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#F8F7F4] to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#F8F7F4] to-transparent" />
            {/* Full-screen stage on mobile (like the FFC original); generous window on desktop */}
            <div ref={mountRef} className="h-[100svh] w-full sm:h-[720px]" />
            <p className="pointer-events-none absolute bottom-6 left-0 right-0 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                Press &amp; hold a marble to watch
            </p>
        </div>
    );
}
