'use client';

import { useEffect, useRef } from 'react';
import { createMarbleCluster } from '@/components/home/marbleCluster';

// The article-embedded glass marbles — same 1:1 FFC cluster as the homepage
// (same physics, same press-and-hold theater), but curated: ONLY reels of the
// team working on dental chairs — deliveries, on-site installs, inspections.
// Every marble is NAMED so future curation can grep by what's in the video.
const CDN = 'https://ffcdentalclinic.care/company-profile';
const A = (p) => CDN + p;

// ORDER MAPS TO SIZE (marbleCluster.js sizing): marble 0 = big HERO, LAST = small.
// field-01..24 = Jarich's 24 field reels (2026-07-05 batch, FB reel rips):
// beads at /reels/field-NN.mp4 (24s muted), theater HD at /reels/hd/field-NN.mp4.
const MARBLES = [
    { src: A('/reels/dsd-showcase-2.mp4'), name: 'Pre-inspection before delivery & install' }, // HERO
    { src: '/reels/ex-07.mp4', name: 'Delivery day — hauling units up the stairs by hand' },
    { src: '/reels/ex-08.mp4', name: 'Provincial run — ferry crossing, then the on-site chair build' },
    { src: '/reels/ex-03.mp4', name: 'Blue chair install road trip' },
    { src: '/reels/field-04.mp4', name: 'Crate day — forklifts and fresh units at the warehouse' },
    { src: '/reels/field-15.mp4', name: 'Fly-out install — boarding Cebu Pacific with the crew' },
    { src: '/reels/field-18.mp4', name: 'Bound to Pangasinan — provincial install run' },
    { src: '/reels/field-03.mp4', name: 'White-glove unwrap — cushions carried in by hand' },
    { src: '/reels/field-06.mp4', name: 'Operatory build — base to cuspidor' },
    { src: '/reels/field-09.mp4', name: 'Backrest screwdriver work — until the doctor sits' },
    { src: '/reels/field-16.mp4', name: 'Truck bay — crates rolling out' },
    { src: '/reels/field-02.mp4', name: 'Unload to install — compressor down, cabinets up' },
    { src: '/reels/field-12.mp4', name: 'Tiled-clinic install — daylight to neon night' },
    { src: '/reels/field-21.mp4', name: 'Van run — strapped, padded, delivered' },
    { src: '/reels/field-08.mp4', name: 'On-site A3 build + parts walk-through' },
    { src: '/reels/field-24.mp4', name: 'Build day — bare frame to a happy clinic' },
    { src: '/reels/field-10.mp4', name: 'Street delivery — compressor in, wiring tucked' },
    { src: '/reels/field-05.mp4', name: 'Fit-out wiring, then the handover demo' },
    { src: '/reels/field-07.mp4', name: 'Unbox to first whir — handpiece test with the client' },
    { src: '/reels/field-19.mp4', name: 'Service-elevator run — chair to the finished op' },
    { src: '/reels/field-20.mp4', name: 'Night haul — teal chair down, LEDs on' },
    { src: '/reels/field-23.mp4', name: 'Delivery check — every box opened and verified' },
    { src: '/reels/field-17.mp4', name: 'Wrap-off — the unit dressed in place' },
    { src: '/reels/field-11.mp4', name: 'Doctor stool unbox + the cleaning fog' },
    { src: '/reels/field-22.mp4', name: 'Dr. Maureen Castillo — K-Clamp user story' },
    { src: '/reels/field-01.mp4', name: 'Showroom consult — walking a clinic owner through the fit' },
    { src: '/reels/field-13.mp4', name: 'Christmas at the showroom — new hardware in hand' },
    { src: '/reels/field-14.mp4', name: 'Dealer rounds — corridor to the MMR booth' },
    { src: A('/reels/fb/fb-01.mp4'), name: 'Showroom chair session — hands on a live unit' }, // SMALL
];

export default function ArticleMarbles() {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const cluster = createMarbleCluster(mount, {
            videos: MARBLES.map((m) => m.src),
            count: MARBLES.length, // exactly one bead per reel — no empty marbles
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

        // The press-and-hold theater plays a reel WITH audio — tell the focus music
        // (same dsd:videoaudio contract as the homepage lounge) so it pauses for the
        // reel and continues right after, without forking the verbatim cluster source.
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
        <div className="relative w-screen left-1/2 -translate-x-1/2 bg-[#06070c]" style={{ margin: '2.5rem 0' }}>
            {/* Soft edges into the white article page — no box, the stage breathes in and out */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#ffffff] to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#ffffff] to-transparent" />
            {/* Full-screen stage on mobile (like the FFC original); generous window on desktop */}
            <div ref={mountRef} className="h-[100svh] w-full sm:h-[640px]" />
            <p className="pointer-events-none absolute bottom-6 left-0 right-0 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                Press &amp; hold a marble to watch
            </p>
        </div>
    );
}
