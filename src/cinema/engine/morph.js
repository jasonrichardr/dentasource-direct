// engine/morph.js — the multi-state morph chain.
// A global scroll offset (0..1) is damped, scaled to S-1 segments; the integer part picks
// the live pair [seg, seg+1], the fractional part is that segment's uProgress. Attribute
// buffers are re-bound only when the segment changes (cheap, not per-frame).

export function dampf(cur, target, lambda, dt) {
  return cur + (target - cur) * (1 - Math.exp(-lambda * dt));
}

// smootherstep — slow-fast-slow. Makes each formation HOLD crisp at the ends of its
// scroll band and morph quickly through the middle (arrive, hold, snap to next).
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
    this._countReady();
  }

  // The arc arrives a beat at a time now, so the chain has to know how far it can walk.
  // `ready` is the CONTIGUOUS run of built formations from the start: a hole means the
  // morph stops at its edge rather than reaching into nothing.
  _countReady() {
    let n = 0;
    while (n < this.S && this.formations[n]) n += 1;
    this.ready = n;
  }

  /** A formation finished building. Slot it in, and re-bind if the live pair just grew. */
  setFormation(i, positions, isText = false) {
    this.formations[i] = { positions, isText };
    this._countReady();
    if (i === this.lastSeg + 1) this._rebind(this.lastSeg);
  }

  _rebind(seg) {
    const g = this.geometry;
    // A target that has not been built yet means holding this state rather than morphing
    // into nothing. It cannot happen once the arc is complete.
    if (!this.formations[seg] || !this.formations[seg + 1]) return;
    g.attributes.position.array.set(this.formations[seg].positions);
    g.attributes.position.needsUpdate = true;
    g.attributes.aTarget.array.set(this.formations[seg + 1].positions);
    g.attributes.aTarget.needsUpdate = true;
    // calm the turbulence when ARRIVING at a text state so words resolve crisply
    this.material.uniforms.uTextLock.value = this.formations[seg + 1].isText ? 1 : 0;
    this.lastSeg = seg;
  }

  // rawOffset: 0..1 scroll position. dt: seconds. Returns { g, seg, local, smoothOffset }.
  update(rawOffset, dt) {
    this.material.uniforms.uTime.value += dt;
    this.smoothOffset = dampf(this.smoothOffset, rawOffset, this.smoothing, dt);

    // never walk past the built edge: the reader can scroll faster than the arc builds,
    // and the cinema holds the last finished formation until the next one lands.
    const limit = Math.max(0, this.ready - 1);
    const gRaw = Math.min(this.smoothOffset * (this.S - 1), limit);
    let seg = Math.min(Math.floor(gRaw), this.S - 2);
    if (seg < 0) seg = 0;
    const easedLocal = smoother(gRaw - seg); // hold-then-snap pacing

    if (seg !== this.lastSeg) this._rebind(seg);
    this.material.uniforms.uProgress.value = easedLocal;

    // return the EASED g so the camera + directors stay locked to the morph's holds
    const g = seg + easedLocal;
    return { g, seg, local: easedLocal, smoothOffset: this.smoothOffset };
  }
}
