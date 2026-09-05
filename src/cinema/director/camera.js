// director/camera.js — per-beat camera keyframes, sized to whatever arc the page passes.
// Frontal on flat marks and lockups; a little orbit on 3D shapes so depth reads; pulled
// back on the beats whose DOM panel owns the frame. A beat can override with
// `camera: { angle, dist }`.

import * as THREE from "three";

const BY_KIND = {
  lockup:        { angle: 0.00, dist: 15.0 },
  image:         { angle: 0.08, dist: 16.4 },
  text:          { angle: 0.00, dist: 16.0 },
  heart:         { angle: 0.15, dist: 16.5 },
  sphere:        { angle: 0.11, dist: 16.6 },
  leaf:          { angle: 0.10, dist: 16.2 },
  constellation: { angle: 0.26, dist: 18.5 },
};

// The closing beat sits nearer than the opening one so a cinema that ends on its mark
// ends on a bigger mark.
export function cameraKeys(beats) {
  const last = beats.length - 1;
  const angle = [], dist = [];
  beats.forEach((b, i) => {
    const base = BY_KIND[b.kind] || BY_KIND.sphere;
    const over = b.camera || {};
    angle.push(over.angle ?? base.angle);
    dist.push(over.dist ?? (over.angle === undefined && b.kind === "lockup" && i === last && last > 0
      ? 14.0
      : base.dist));
  });
  return { angle, dist };
}

function lerpKey(arr, g) {
  const n = arr.length - 1;
  const i = THREE.MathUtils.clamp(Math.floor(g), 0, n);
  const j = Math.min(i + 1, n);
  const f = THREE.MathUtils.clamp(g - Math.floor(g), 0, 1);
  return arr[i] + (arr[j] - arr[i]) * f;
}

export function cameraTarget(g, keys) {
  const a = lerpKey(keys.angle, g);
  const d = lerpKey(keys.dist, g);
  return { x: Math.sin(a) * d, y: 0, z: Math.cos(a) * d };
}
