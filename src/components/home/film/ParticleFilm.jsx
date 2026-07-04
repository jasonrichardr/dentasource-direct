'use client';

import { useEffect, useRef } from 'react';

// ParticleFilm — the DSD Day scroll-film layer, built on the FFC company-profile engine
// (points/morph/shaders ported verbatim). One fixed canvas lives BEHIND the landing
// sections; as the visitor scrolls, a dark-gold/emerald particle cloud morphs
// dust → DSD emblem → dental chair → Philippine archipelago → journey timeline.
// Light sections are translucent so the cloud breathes through; dark sections cover
// it naturally, giving the film its chapters.
export default function ParticleFilm() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let disposed = false;
        let cleanup = null;

        (async () => {
            const [THREE, { createPoints }, { MorphChain }, F] = await Promise.all([
                import('three'),
                import('./points.js'),
                import('./morph.js'),
                import('./formations.js'),
            ]);
            if (disposed) return;

            const IS_MOBILE = window.innerWidth < 820 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
            const N = IS_MOBILE ? 26000 : 54000;

            let emblemImg, chairImg, phImg;
            try {
                [emblemImg, chairImg, phImg] = await Promise.all([
                    F.loadImage('/film/emblem.png'),
                    F.loadImage('/film/chair-mask.png'),
                    F.loadImage('/film/ph-mask.png'),
                ]);
            } catch {
                return; // masks unavailable — the page simply runs without the film
            }
            if (disposed) return;

            const formations = [
                { positions: F.dustToPositions(N) },
                { positions: F.imageToPositions(N, emblemImg, { boxW: F.WORLD * 1.15, boxH: F.WORLD * 0.8 }) },
                { positions: F.imageToPositions(N, chairImg, { boxW: F.WORLD * 0.95, boxH: F.WORLD * 0.95 }) },
                { positions: F.imageToPositions(N, phImg, { boxW: F.WORLD * 0.8, boxH: F.WORLD * 1.05 }) },
                { positions: F.timelineToPositions(N) },
            ];

            const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0); // transparent — the page's cream shows through

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
            camera.position.set(0, 0, 21);

            const { points, geometry, material } = createPoints(N, formations);
            // DSD DAY: dark gold + deep emerald ink on cream — normal blending (additive
            // would vanish on a light page), soft alpha so text stays readable above it.
            material.blending = THREE.NormalBlending;
            material.uniforms.uColorA.value = new THREE.Color('#8a6420');
            material.uniforms.uColorB.value = new THREE.Color('#1a3c34');
            material.uniforms.uAlpha.value = 0.42;
            material.uniforms.uSize.value = IS_MOBILE ? 8 : 10;
            material.uniforms.uMaxSize.value = 26;
            material.uniforms.uNoiseStrength.value = 0.9;
            scene.add(points);

            const chain = new MorphChain(geometry, material, formations, { smoothing: 5.0 });

            const clock = new THREE.Clock();
            let rafId = 0;
            const frame = () => {
                const dt = Math.min(clock.getDelta(), 1 / 30);
                const doc = document.documentElement;
                const max = Math.max(1, doc.scrollHeight - window.innerHeight);
                const raw = Math.min(1, Math.max(0, window.scrollY / max));
                chain.update(raw, dt);
                renderer.render(scene, camera);
                rafId = requestAnimationFrame(frame);
            };
            rafId = requestAnimationFrame(frame);

            const onResize = () => {
                renderer.setSize(window.innerWidth, window.innerHeight);
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
            };
            window.addEventListener('resize', onResize);

            const onVisibility = () => {
                if (document.hidden) cancelAnimationFrame(rafId);
                else { clock.getDelta(); rafId = requestAnimationFrame(frame); }
            };
            document.addEventListener('visibilitychange', onVisibility);

            cleanup = () => {
                cancelAnimationFrame(rafId);
                window.removeEventListener('resize', onResize);
                document.removeEventListener('visibilitychange', onVisibility);
                geometry.dispose();
                material.dispose();
                renderer.dispose();
            };
        })();

        return () => {
            disposed = true;
            if (cleanup) cleanup();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 h-full w-full"
        />
    );
}
