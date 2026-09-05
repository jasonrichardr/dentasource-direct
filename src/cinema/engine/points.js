// engine/points.js — build the single THREE.Points cloud + its ShaderMaterial.

import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders.js";

export function createPoints(N, formations) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(formations[0].positions.slice(), 3));
  geometry.setAttribute("aTarget", new THREE.BufferAttribute(formations[1].positions.slice(), 3));
  // Sampled formations carry a colour per dot; uniform ones carry zeros and lean on the
  // tint WEIGHT being zero, so the buffers always exist and the rebind never branches.
  const blank = () => new Float32Array(N * 3);
  geometry.setAttribute("aColor", new THREE.BufferAttribute(formations[0].colors ? formations[0].colors.slice() : blank(), 3));
  geometry.setAttribute("aColorTarget", new THREE.BufferAttribute(formations[1].colors ? formations[1].colors.slice() : blank(), 3));
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
      uMaxSize: { value: 42 },                       // point-size cap (px); lowered on mobile
      uNoiseFrequency: { value: 0.6 },
      uNoiseStrength: { value: 1.1 },
      uTime: { value: 0 },
      uIdle: { value: 0.035 },
      uTextLock: { value: 0 },
      uTintA: { value: 0 },       // per formation: 1 = wear the sampled colours
      uTintB: { value: 0 },
      uTintGain: { value: 1 },    // the theme exposure, applied to sampled colours too
      uSizeA: { value: 1 },       // per formation point size scale
      uSizeB: { value: 1 },
      uColorA: { value: new THREE.Color("#f5f1ea") },
      uColorB: { value: new THREE.Color("#e9c46a") },
      uAlpha: { value: 0.62 },
      uVideo: { value: null },                       // photo texture (set at boot)
      uVideoMix: { value: 0 },                       // driven by the scroll director
      uVideoGain: { value: 1.0 },                    // photo brightness (1.0 = true-to-life)
      uVideoScale: { value: new THREE.Vector2(0.12, 0.2) },
    },
  });

  const points = new THREE.Points(geometry, material);
  return { points, geometry, material, randoms };
}
