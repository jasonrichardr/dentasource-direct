// engine/morph.js — the multi-state morph chain.
// A global scroll offset (0..1) is damped, scaled to S-1 segments; integer part picks
// the live pair [seg, seg+1], fractional part is that segment's uProgress. Attribute
// buffers are re-bound only when the segment changes (cheap, not per-frame).

import * as THREE from "three";

export function dampf(cur, target, lambda, dt) {
  return cur + (target - cur) * (1 - Math.exp(-lambda * dt));
}

// smootherstep — slow-fast-slow. Makes each formation HOLD crisp at the ends of its
// scroll band and morph quickly through the middle (arrive · hold · snap to next).
const smoother = (t) => {
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  return t * t * t * (t * (t * 6 - 15) + 10);
};

export class MorphChain {
  constructor(geometry, material, formations, { smoothing = 5.5 } = {}) {
    this.geometry = geometry;
    this.material = material;
    this.formations = formations;
    this.S = formations.length;
    this.smoothing = smoothing;
    this.smoothOffset = 0;
    this.lastSeg = -1;
  }

  _rebind(seg) {
    const g = this.geometry;
    g.attributes.position.array.set(this.formations[seg].positions);
    g.attributes.position.needsUpdate = true;
    g.attributes.aTarget.array.set(this.formations[seg + 1].positions);
    g.attributes.aTarget.needsUpdate = true;
    // calm turbulence when ARRIVING at a text state so words resolve crisply
    this.material.uniforms.uTextLock.value = this.formations[seg + 1].isText ? 1 : 0;
    this.lastSeg = seg;
  }

  // rawOffset: 0..1 scroll position. dt: seconds. Returns { g, seg, local, smoothOffset }.
  update(rawOffset, dt) {
    this.material.uniforms.uTime.value += dt;
    this.smoothOffset = dampf(this.smoothOffset, rawOffset, this.smoothing, dt);

    const gRaw = this.smoothOffset * (this.S - 1);
    let seg = Math.min(Math.floor(gRaw), this.S - 2);
    if (seg < 0) seg = 0;
    const easedLocal = smoother(gRaw - seg); // hold-then-snap pacing

    if (seg !== this.lastSeg) this._rebind(seg);
    this.material.uniforms.uProgress.value = easedLocal;

    // return the EASED g so camera + directors stay locked to the morph's holds
    const g = seg + easedLocal;
    return { g, seg, local: easedLocal, smoothOffset: this.smoothOffset };
  }
}
