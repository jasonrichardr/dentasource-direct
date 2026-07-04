'use client';

import { useEffect, useRef } from 'react';
import { createMarbleCluster } from './marbleCluster';

// The FFC company-profile "glass marbles" — ported 1:1. Same cluster, same physics,
// same press-and-hold theater, same reels (served from ffcdentalclinic.care, which
// sends open CORS headers, so the WebGL video textures work cross-origin).
const CDN = 'https://ffcdentalclinic.care/company-profile';
const A = (p) => CDN + p;

const VIDEOS = [
    // ORDER MAPS TO SIZE (see marbleCluster.js sizing): bead 0 = big HERO marble, LAST = small one.
    '/reels/fb/fb-11.mp4',       // [0] HERO (biggest)
    '/reels/dsd-showcase-4.mp4', // Meet the team — Stay vibrant
    '/reels/dsd-showcase.mp4',   // SMX Convention
    '/reels/dsd-showcase-2.mp4', // Pre-inspection before delivery & install
    '/reels/dsd-showcase-5.mp4', // Denjoy — endo-focused, R&D
    '/reels/dsd-showcase-3.mp4', // Digital dentistry & surgery
    '/reels/dsd-hero-loop.mp4',  // DSD hero loop
    '/reels/fb/fb-01.mp4', '/reels/fb/fb-02.mp4', '/reels/fb/fb-04.mp4', '/reels/fb/fb-05.mp4', '/reels/fb/fb-06.mp4',
    '/reels/fb/fb-07.mp4', '/reels/fb/fb-08.mp4', '/reels/fb/fb-09.mp4', '/reels/fb/fb-10.mp4',
    '/reels/fb/fb-12.mp4', '/reels/fb/fb-16.mp4',
    '/reels/fb/fb-27.mp4',
    '/reels/fb/fb-17.mp4',
    '/reels/fb/fb-24.mp4',
    '/reels/fb/fb-28.mp4',       // DSD team/showroom + FFC storefront reel
    '/reels/fb/fb-03.mp4',       // [last] SMALL
].map(A);

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
