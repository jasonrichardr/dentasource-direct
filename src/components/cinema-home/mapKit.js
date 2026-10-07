// mapKit.js: what the two map popups share: "How far am I?" (HowFarDialog) and "See our
// reach" (ReachDialog). Moved out of HowFarDialog VERBATIM on 2026-10-07 when the second
// popup arrived, so the console's Field map look is written once.
//
// Only the two dialog chunks import this file, so it travels with them: a visitor who never
// opens a map never downloads it.

import { useEffect, useState } from 'react';

// The showroom, from Jarich's Maps place link (console plan 34o).
export const SHOWROOM = { lat: 14.5809669, lng: 121.0867494 };
export const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
export const NIGHT = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/2016-01-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png';
export const BADGE = '/cinema/brand/dsd-round.png';

export const manilaNow = (now = Date.now()) => new Date(now + 8 * 3600 * 1000);
export const isNightInManila = () => { const h = manilaNow().getUTCHours(); return h < 6 || h >= 18; };
export const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * The console look as a MapLibre style: Esri World Imagery, NASA's Black Marble city lights
 * (off until paintNight turns them up), a globe, and a sky tinted to the popup's own colour.
 */
export function consoleStyle({ space, sky }) {
  return {
    version: 8,
    projection: { type: 'globe' },
    sources: {
      esri: { type: 'raster', tiles: [ESRI], tileSize: 256, maxzoom: 19, attribution: 'Imagery © Esri, Maxar, Earthstar Geographics' },
      night: { type: 'raster', tiles: [NIGHT], tileSize: 256, maxzoom: 8, attribution: 'Night lights © NASA GIBS / VIIRS Black Marble' },
    },
    layers: [
      { id: 'space', type: 'background', paint: { 'background-color': space } },
      { id: 'esri', type: 'raster', source: 'esri', paint: { 'raster-fade-duration': 300 } },
      { id: 'night', type: 'raster', source: 'night', paint: { 'raster-opacity': 0, 'raster-fade-duration': 300 } },
    ],
    sky,
  };
}

/** After 6 PM in Manila: the city lights come up and the imagery goes down. */
export function paintNight(map) {
  map.setPaintProperty('night', 'raster-opacity', ['interpolate', ['linear'], ['zoom'], 5, 0.95, 8, 0.8, 11, 0]);
  map.setPaintProperty('esri', 'raster-brightness-max', ['interpolate', ['linear'], ['zoom'], 8, 0.28, 11, 0.55, 14, 0.72]);
  map.setPaintProperty('esri', 'raster-saturation', ['interpolate', ['linear'], ['zoom'], 8, -0.45, 11, -0.2, 14, -0.05]);
}

/**
 * The compact credits open themselves the first time they fill, and fold only after a
 * drag, so on a phone they sat over the title. Fold them once; the (i) still opens them.
 * Returns the cleanup.
 */
export function foldAttribution(container) {
  const attribEl = container?.querySelector('.maplibregl-ctrl-attrib');
  if (!attribEl || typeof MutationObserver === 'undefined') return () => {};
  const mo = new MutationObserver(() => {
    if (attribEl.classList.contains('maplibregl-compact-show')) { attribEl.classList.remove('maplibregl-compact-show'); mo.disconnect(); }
  });
  mo.observe(attribEl, { attributes: true, attributeFilter: ['class'] });
  const timer = window.setTimeout(() => mo.disconnect(), 20000);
  return () => { window.clearTimeout(timer); mo.disconnect(); };
}

export function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** A soft curve between two points (`bend` is how far the middle lifts off the chord). */
export function arc(from, to, n = 96, bend = 0.22) {
  const dx = to.lng - from.lng, dy = to.lat - from.lat;
  const cx = (from.lng + to.lng) / 2 - dy * bend, cy = (from.lat + to.lat) / 2 + dx * bend;
  const pts = [];
  for (let k = 0; k <= n; k++) {
    const t = k / n, u = 1 - t;
    pts.push([u * u * from.lng + 2 * u * t * cx + t * t * to.lng, u * u * from.lat + 2 * u * t * cy + t * t * to.lat]);
  }
  return pts;
}

/** Cumulative distance along a line, for "where is the comet at fraction f". */
export function measure(coords) {
  const cum = [0];
  for (let k = 1; k < coords.length; k++) {
    cum.push(cum[k - 1] + haversineKm({ lng: coords[k - 1][0], lat: coords[k - 1][1] }, { lng: coords[k][0], lat: coords[k][1] }));
  }
  return cum;
}
/** The part of the line between fractions f0 and f1, both ends interpolated ([] when empty). */
export function slice(coords, cum, f0, f1) {
  const lo = Math.min(1, Math.max(0, f0)), hi = Math.min(1, Math.max(0, f1));
  if (hi <= lo) return [];
  const total = cum[cum.length - 1] || 1, a = lo * total, b = hi * total;
  const pts = [pointAt(coords, cum, lo)];
  for (let k = 0; k < coords.length; k++) if (cum[k] > a && cum[k] < b) pts.push(coords[k]);
  pts.push(pointAt(coords, cum, hi));
  return pts;
}
export function pointAt(coords, cum, f) {
  const total = cum[cum.length - 1] || 1, d = Math.min(1, Math.max(0, f)) * total;
  let lo = 0, hi = cum.length - 1;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (cum[mid] < d) lo = mid + 1; else hi = mid; }
  const k = Math.max(1, lo), seg = cum[k] - cum[k - 1] || 1, t = (d - cum[k - 1]) / seg;
  return [coords[k - 1][0] + (coords[k][0] - coords[k - 1][0]) * t, coords[k - 1][1] + (coords[k][1] - coords[k - 1][1]) * t];
}

export const line = (coords) => ({ type: 'Feature', geometry: { type: 'LineString', coordinates: coords }, properties: {} });
export const point = (c) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: c }, properties: {} });
export const fc = (features) => ({ type: 'FeatureCollection', features });
export const EMPTY = fc([]);
export const lineFc = (pts) => fc(pts.length >= 2 ? [line(pts)] : []);

/** Rolls a number up from 0 once `run` turns true. Plain rAF, no library. */
export function useCountUp(target, run, ms = 1300) {
  const [v, setV] = useState(0);
  const [still] = useState(reducedMotion);
  useEffect(() => {
    if (!run || still || !Number.isFinite(target)) return undefined;
    let raf = 0;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / ms);
      setV(target * (1 - (1 - p) ** 3));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms, still]);
  // reduced motion: no roll, the number is simply there
  return still ? (run ? target : 0) : v;
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
