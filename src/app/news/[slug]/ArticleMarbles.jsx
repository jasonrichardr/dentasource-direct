'use client';

import { useEffect, useRef } from 'react';
import { createMarbleCluster } from '@/components/home/marbleCluster';
import reelLibrary from '@/data/cinema/reel-library.json';
import { visible } from '@/lib/cinema/visible';
import { mediaUrl } from '@/lib/cinema/media';

// The article-embedded glass marbles — same 1:1 FFC cluster as the homepage
// (same physics, same press-and-hold theater), but curated: ONLY reels of the
// team working on dental chairs — deliveries, on-site installs, inspections.
// Every marble is NAMED so future curation can grep by what's in the video.
// ☠️ NO DSD ROUTE STREAMS FROM THE FFC PATIENT DOMAIN. Two of these marbles used to be
// fetched from https://ffcdentalclinic.care/company-profile, which made an article page
// depend on a clinic domain it has no business calling. Both are local now, mapped through
// src/data/cinema/reel-library.json by source_url rather than by guessing at a filename:
//   .../reels/dsd-showcase-2.mp4  ->  wall-04  ->  /cinema/reels/wall-dsd-showcase-2.mp4
//   .../reels/fb/fb-01.mp4        ->  wall-08  ->  /cinema/reels/wall-fb-01.mp4
// The other 27 were already local under /reels/ and every one of them is on disk.

// ORDER MAPS TO SIZE (marbleCluster.js sizing): marble 0 = big HERO, LAST = small.
// field-01..24 = Jarich's 24 field reels (2026-07-05 batch, FB reel rips):
// beads at /reels/field-NN.mp4 (24s muted), theater HD at /reels/hd/field-NN.mp4.
const MARBLES = [
    { src: '/cinema/reels/wall-dsd-showcase-2.mp4', name: 'Pre-inspection before delivery & install' }, // HERO
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
    { src: '/cinema/reels/wall-fb-01.mp4', name: 'Showroom chair session — hands on a live unit' }, // SMALL
];

// ☠️ THE THEATRE CANNOT GUESS THIS PAGE'S HD PATHS, AND IT LOOKED LIKE IT COULD.
// marbleCluster falls back to rewriting a bead's url into /reels/hd/<same name>, which is
// what this page relied on. Measured against the library, that rewrite disagrees with the
// real file for 20 of these 29 beads, because the HD copies are named by reel ID and the
// bead files are named by clip: the bead at /cinema/reels/wall-dsd-showcase-2.mp4 has its
// HD at /cinema/reels/hd/wall-04.mp4, not at /cinema/reels/hd/wall-dsd-showcase-2.mp4.
// For the two /cinema/reels/wall-* beads the rewrite asks for a file that cannot exist, so
// they took a 404 and quietly played the muted 480 loop with an HD copy sitting in the
// library. Nothing threw and nothing looked wrong, which is why this needed measuring
// rather than reading.
//
// So the entry is looked up by src in the manifest, exactly as the cinema wall and
// /classic do. The remaining 9 beads have no library HD; for those the cluster's rewrite
// is kept and it lands on a real file in the older /reels/hd/field-*.mp4 set, verified on
// disk, so they get an HD copy too rather than the loop.
//
// Filtered through visible() like every other manifest read: a reel Jarich has hidden must
// not have its high definition copy served from an article either, and the hidden-filter
// gate fails the build on a raw read. See src/lib/cinema/visible.js.
const HD_BY_SRC = new Map(
    visible(reelLibrary.reels).filter((r) => r.hd).map((r) => [r.src, { src: r.hd, w: r.hdWidth, h: r.hdHeight }]),
);
// hdWidth/hdHeight ride along so the theatre sizes its frame from the real clip instead of
// the stylesheet's pinned 9/16, which crops a landscape HD copy to a vertical sliver.
// Both the bead and its HD go through mediaUrl, the one place a media path becomes a URL;
// with NEXT_PUBLIC_MEDIA_BASE unset it returns every path unchanged, so this is a no-op
// until the VPS origin is switched on. The LOOKUP uses the raw manifest path, because the
// manifest is deliberately not rewritten.
const VIDEOS = MARBLES.map((m) => mediaUrl(m.src));
const HD_VIDEOS = MARBLES.map((m) => {
    const e = HD_BY_SRC.get(m.src);
    return e ? { src: mediaUrl(e.src), w: e.w, h: e.h } : null;
});

export default function ArticleMarbles() {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const cluster = createMarbleCluster(mount, {
            videos: VIDEOS,
            hdVideos: HD_VIDEOS,
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
