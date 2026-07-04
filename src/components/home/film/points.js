// engine/points.js — build the single THREE.Points cloud + its ShaderMaterial.
// One factory so the scene wiring (main.js) stays small and the engine is portable to R3F.

import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders.js";

export function createPoints(N, formations) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(formations[0].positions.slice(), 3));
  geometry.setAttribute("aTarget", new THREE.BufferAttribute(formations[1].positions.slice(), 3));
  const randoms = new Float32Array(N * 4);
  for (let i = 0; i < N * 4; i++) randoms[i] = Math.random();
  geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 4));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 30); // never cull mid-morph

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uProgress: { value: 0 },
      uDelay: { value: 0.35 },
      uSize: { value: 13 },
      uMaxSize: { value: 42 },                       // point-size cap (px); lowered on mobile in main.js
      uNoiseFrequency: { value: 0.6 },
      uNoiseStrength: { value: 1.1 },
      uTime: { value: 0 },
      uIdle: { value: 0.035 },
      uTextLock: { value: 0 },
      uColorA: { value: new THREE.Color("#f5f1ea") },
      uColorB: { value: new THREE.Color("#e9c46a") },
      uAlpha: { value: 0.62 },
      uVideo: { value: null },                       // photo / video texture (set in boot)
      uVideoMix: { value: 0 },                       // driven by the scroll director
      uVideoGain: { value: 1.0 },                    // photo brightness (1.0 = true-to-life)
      uVideo2: { value: null },                      // dashboard (stock-market) VideoTexture
      uVideo2Mix: { value: 0 },                      // dashboard-beat mix
      uVideoScale: { value: new THREE.Vector2(0.12, 0.2) }, // set precisely in main.js
      uBrainness: { value: 0 },                      // 1 during the psychology beat
      uAmygdala: { value: new THREE.Vector4(1.0, -0.7, 1.0, 0.85) },
      uHippo: { value: new THREE.Vector4(1.3, -1.05, 0.0, 1.0) },
      uPFC: { value: new THREE.Vector4(0.0, 1.0, 2.05, 1.3) },
    },
  });

  const points = new THREE.Points(geometry, material);
  return { points, geometry, material, randoms };
}
