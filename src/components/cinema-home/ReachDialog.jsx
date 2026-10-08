'use client';

// "See our reach": the nationwide beat's popup (Jarich, 2026-10-07: "make like stars on our
// clients so they know how far is our reach … live and dynamic … futuristic and awesome like
// it can turn cold clients to warm"). The console's Field map look, shared with How far am I?
// through mapKit.js: Esri imagery by day, NASA city lights by night, a globe, the round DSD
// badge on the Pasig showroom.
//
// The scene: the camera opens on the globe and flies to the Philippines; then one star per
// client lights up, nearest first, each at the end of a thin light that arcs out of the
// showroom, so the network grows out of DSD; then the whole network keeps a slow shimmer,
// a light running down a link now and then. Beside it, the after sales shelf goes by.
//
// ☠️ A STAR IS A TOWN, NEVER A CLINIC. src/data/cinema/reach.json carries no names, phones or
// addresses, only coordinates rounded to two decimals (about 1 km) and a city or province
// (Jarich's ruling: city only, no clinic names on stars). Tapping a star shows that `area` and
// nothing else. Keep it that way: nothing here may ever join a point back to a client.
//
// Every word a visitor reads comes from beat.reach in home-beats.json; this file only
// formats numbers. The whole module, the points, the parts column and maplibre-gl are one
// split chunk that ReachMap.jsx loads on the first hover or tap.

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';
import './how-far.css';
import './reach.css';
import reachData from '@/data/cinema/reach.json';
import partsData from '@/data/cinema/parts.json';
import { visible } from '@/lib/cinema/visible';
import { pickParts } from '@/lib/cinema/partsPick';
import HowFar from './HowFar';
import {
  SHOWROOM, BADGE, isNightInManila, reducedMotion, consoleStyle, paintNight, foldAttribution,
  haversineKm, arc, measure, slice, pointAt, line, point, fc, EMPTY, escapeHtml,
} from './mapKit';

const GOLD = '#e6c76a';
// ☠️ THE STAGGER IS BY DISTANCE, NOT ONE NUMBER. About thirty of the clients are inside Metro
// Manila, under or beside the badge at country zoom, so they light fast (30 ms apart) and the
// provinces, where the links are long enough to watch, get the time (120 ms apart).
const NEAR_KM = 25;
const NEAR_STAGGER_MS = 30;
const FAR_STAGGER_MS = 120;
const FLY_MS = 4200;
const MAP_WATCHDOG_MS = 15000;
// ☠️ "How far am I?" can open ON TOP of this popup. While it is up, its own trap and Esc own
// the keyboard and this one stands aside (ReachMap passes the same selector as `yieldTo`).
const ABOVE = '.hf-backdrop, .hf-booting';

/**
 * The stars, once, at module scope, nearest to Pasig first (so the network grows outward).
 * Two clinics can round into the same square; the second and later step out on a small
 * spiral, a few hundred metres, well inside the kilometre the rounding already blurs.
 */
const STARS = (() => {
  const seen = new Map();
  return visible(reachData.points)
    .filter((p) => Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lng)))
    .map((p) => {
      const lat = Number(p.lat), lng = Number(p.lng);
      const key = `${lat},${lng}`;
      const k = seen.get(key) || 0;
      seen.set(key, k + 1);
      const a = k * 2.39996, r = k ? 0.0045 * Math.sqrt(k) : 0;
      return { lat: lat + r * Math.sin(a), lng: lng + r * Math.cos(a), area: String(p.area || ''), km: haversineKm(SHOWROOM, { lat, lng }) };
    })
    .sort((a, b) => a.km - b.km);
})();
const CLINICS = Number(reachData.clinics) || STARS.length;
const AREAS = Number(reachData.areas) || new Set(STARS.map((s) => s.area)).size;
const FARTHEST_KM = STARS.reduce((m, s) => Math.max(m, s.km), 0);
// the province of an area: "Pasig, Metro Manila" is Metro Manila, "Iloilo" is Iloilo
const provinceOf = (area) => area.split(',').pop().trim();

/** One light link per star: the arc, its length table, and its timing. */
let startsAt = 0;
const LINKS = STARS.map((s, i) => {
  const coords = arc(SHOWROOM, s, s.km > 40 ? 64 : 16, 0.2);
  const start = startsAt;
  startsAt += s.km < NEAR_KM ? NEAR_STAGGER_MS : FAR_STAGGER_MS;
  return {
    coords,
    cum: measure(coords),
    start,
    // nearer links are drawn faster, so a star always lights after the one before it
    draw: Math.min(1500, 650 + s.km * 1.4),
    // a link inside Metro Manila is shorter than its own glow at country zoom; only the longer
    // ones carry a running light after the build, so the shimmer reads as travel, not noise
    shimmer: s.km > NEAR_KM,
    lap: 3600 + (i % 5) * 650,
    phase: (i * 0.6180339) % 1,
  };
});

/** A number that glides to each new value instead of jumping (the counters follow the stars). */
function useGlide(target, still, ms = 450) {
  const [v, setV] = useState(0);
  const now = useRef(0);
  useEffect(() => {
    if (still) return undefined;
    let raf = 0;
    const a = now.current, t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / ms);
      now.current = a + (target - a) * (1 - (1 - p) ** 3);
      setV(now.current);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, still, ms]);
  return still ? target : v;
}

// the after sales shelf: the very parts, pictures and names the After sales beat shows
const PARTS = pickParts(visible(partsData.parts));

const fmtInt = (n) => Math.round(n).toLocaleString('en-PH');

function Stat({ label, value, unit }) {
  return (
    <div className="hf-stat">
      <div className="hf-stat-label">{label}</div>
      <div className="hf-stat-value">{value}{unit ? <span className="hf-stat-unit">{unit}</span> : null}</div>
    </div>
  );
}

/** Where the camera lands: every star in view, clear of the title and the panel. */
function frameFor(map, stage, panel) {
  const w = stage?.clientWidth || 900, h = stage?.clientHeight || 700;
  const pw = panel?.offsetWidth || 0, ph = panel?.offsetHeight || 0;
  // ☠️ PADDING IS CLAMPED TO THE STAGE (How far's law): padding wider than the canvas makes
  // MapLibre refuse to move, silently. On a wide stage the panel is a box in the lower left,
  // so the stars take the right; on a phone it is a band along the bottom.
  const wide = w >= 700;
  const padding = wide
    ? { top: Math.min(140, h * 0.22), bottom: 40, left: Math.min(pw + 60, w * 0.55), right: 56 }
    : { top: Math.min(120, h * 0.22), bottom: Math.min(ph + 26, h * 0.55), left: 24, right: 24 };
  const lngs = STARS.map((s) => s.lng).concat(SHOWROOM.lng);
  const lats = STARS.map((s) => s.lat).concat(SHOWROOM.lat);
  try {
    const cam = map.cameraForBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], { padding });
    if (cam?.center) return { center: cam.center, zoom: Math.min(cam.zoom, 7.5), bearing: 0, pitch: 0 };
  } catch { /* a stage too small for its padding */ }
  return { center: [122.4, 12.6], zoom: 4.8, bearing: 0, pitch: 0 };
}

export default function ReachDialog({ copy, onClose, instant = false }) {
  const cardRef = useRef(null);
  const stageRef = useRef(null);
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const libRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const rafRef = useRef(0);
  const starEls = useRef([]);
  const tagRef = useRef(null);
  const [mapState, setMapState] = useState('booting'); // booting | ready | failed
  const [lit, setLit] = useState(0); // how many stars are lit: the counters follow it
  const [picked, setPicked] = useState(null); // index into STARS
  const [night] = useState(isNightInManila);
  const [still] = useState(reducedMotion);

  /* ── open / close plumbing: focus, Tab kept inside, the page underneath held still.
        Esc lives in lazyDialog.js, because it has to work before this chunk has arrived. ── */
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => {
      const card = cardRef.current;
      if (e.key !== 'Tab' || !card || document.querySelector(ABOVE)) return;
      const f = [...card.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter((el) => el.getClientRects().length > 0);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1], at = document.activeElement;
      if (!card.contains(at)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && at === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey, true);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener('keydown', onKey, true);
    };
  }, []);

  /* ── the map, the flight, and the network ── */
  useEffect(() => {
    let dead = false;
    let unfold = () => {};
    let fallback = 0;
    (async () => {
      try {
        const mod = await import('maplibre-gl');
        const maplibregl = mod.default ?? mod;
        if (dead || !mapEl.current) return;
        libRef.current = maplibregl;
        const map = new maplibregl.Map({
          container: mapEl.current,
          style: consoleStyle({
            space: '#03040a',
            sky: { 'sky-color': '#060914', 'horizon-color': '#a7822f', 'fog-color': '#060914', 'sky-horizon-blend': 0.55, 'horizon-fog-blend': 0.8, 'fog-ground-blend': 0.5, 'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 10, 1, 12, 0] },
          }),
          // the globe, turned a little west of home, so the flight in is a quarter turn
          center: still ? [122.4, 12.6] : [104, 16],
          zoom: still ? 4.8 : 1.15,
          attributionControl: false,
          dragRotate: false,
          pitchWithRotate: false,
          touchPitch: false,
          renderWorldCopies: false,
        });
        mapRef.current = map;
        map.touchZoomRotate?.disableRotation?.();
        map.addControl(new maplibregl.AttributionControl({ compact: true }), 'top-right');
        unfold = foldAttribution(mapEl.current);
        // a missing tile (Esri, NASA) is not a broken map; only a dead WebGL is
        map.on('error', (ev) => { console.warn('[reach] map', ev?.error?.message || ev); });

        // ☠️ 'style.load', NOT 'load' (How far's law): 'load' waits for every tile on screen,
        // seconds on Philippine mobile data. The style is inline, so this fires next frame.
        const init = () => {
          if (dead) return;
          if (night) paintNight(map);
          // by day the imagery is turned down a little, so a gold line still reads over green land
          else map.setPaintProperty('esri', 'raster-brightness-max', 0.78);
          map.addSource('rm-links', { type: 'geojson', data: EMPTY });
          map.addSource('rm-trails', { type: 'geojson', lineMetrics: true, data: EMPTY });
          map.addSource('rm-lights', { type: 'geojson', data: EMPTY });
          map.addLayer({ id: 'rm-link-glow', type: 'line', source: 'rm-links', paint: { 'line-color': GOLD, 'line-width': 4.5, 'line-opacity': 0.24, 'line-blur': 3 }, layout: { 'line-cap': 'round', 'line-join': 'round' } });
          map.addLayer({ id: 'rm-link', type: 'line', source: 'rm-links', paint: { 'line-color': '#fff1c1', 'line-width': 1.15, 'line-opacity': 0.62 }, layout: { 'line-cap': 'round', 'line-join': 'round' } });
          map.addLayer({ id: 'rm-trail', type: 'line', source: 'rm-trails', paint: { 'line-width': 3.2, 'line-blur': 1, 'line-gradient': ['interpolate', ['linear'], ['line-progress'], 0, 'rgba(230,199,106,0)', 1, 'rgba(255,250,232,0.95)'] }, layout: { 'line-cap': 'round', 'line-join': 'round' } });
          map.addLayer({ id: 'rm-light-glow', type: 'circle', source: 'rm-lights', paint: { 'circle-radius': 9, 'circle-color': GOLD, 'circle-opacity': 0.5, 'circle-blur': 1 } });
          map.addLayer({ id: 'rm-light', type: 'circle', source: 'rm-lights', paint: { 'circle-radius': 2.6, 'circle-color': '#fffdf3' } });

          // ☠️ TWO STARS CAN SHARE A FINGER. Iloilo and Bacolod sit about 20 px apart on a phone,
          // so their tap targets overlap and the one added later used to win whichever was meant.
          // A tap picks the lit star whose centre is NEAREST the finger, not the one on top.
          const pickNearest = (e) => {
            e.stopPropagation();
            let best = -1, bestD = Infinity;
            starEls.current.forEach((el, k) => {
              if (!el.classList.contains('is-on')) return;
              const r = el.getBoundingClientRect();
              const d = (r.left + r.width / 2 - e.clientX) ** 2 + (r.top + r.height / 2 - e.clientY) ** 2;
              if (d < bestD) { bestD = d; best = k; }
            });
            if (best >= 0) setPicked(best);
          };

          // the stars, dark until their link arrives
          starEls.current = STARS.map((s, i) => {
            const el = document.createElement('button');
            el.type = 'button';
            el.className = `rm-star${s.km < NEAR_KM ? ' is-near' : ''}`;
            el.tabIndex = -1; // sixty-one tab stops would bury the buttons; the areas are read out below
            el.setAttribute('aria-label', s.area);
            el.dataset.area = s.area;
            el.innerHTML = `<span class="rm-star-body" style="--tw:${(2.4 + ((i * 7) % 11) * 0.17).toFixed(2)}s"><span class="rm-star-burst"></span><span class="rm-star-glow"></span><span class="rm-star-core"></span></span>`;
            el.addEventListener('click', pickNearest);
            new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([s.lng, s.lat]).addTo(map);
            return el;
          });

          // ☠️ THE HUB GOES ON LAST, OVER THE STARS. Some thirty clients are in Metro Manila,
          // and drawn over the badge their glows burned it into a featureless gold blob. On top,
          // the DSD mark stays legible and the Metro stars ring it; a pinch in separates them.
          const home = document.createElement('div');
          home.className = 'hf-home rm-home';
          home.innerHTML = `<span class="hf-home-pulse"></span><img src="${BADGE}" alt="" draggable="false" /><span class="hf-tag rm-home-tag">${escapeHtml(copy.showroom || 'DentaSource Direct')}</span>`;
          new maplibregl.Marker({ element: home, anchor: 'center' }).setLngLat([SHOWROOM.lng, SHOWROOM.lat]).addTo(map);
          map.on('click', (e) => { if (!e.originalEvent?.target?.closest?.('.rm-star')) setPicked(null); });

          setMapState('ready');
          const cam = frameFor(map, stageRef.current, panelRef.current);
          if (still) { map.jumpTo(cam); grow(map); return; }
          map.flyTo({ ...cam, duration: FLY_MS, curve: 1.5, essential: true });
          // the network starts when the camera lands; a flight cut short by a drag lands too,
          // and a timer a little past the flight starts it anyway; `go` runs once
          let started = false;
          const go = () => { if (!started && !dead) { started = true; window.clearTimeout(fallback); grow(map); } };
          map.once('moveend', go);
          fallback = window.setTimeout(go, FLY_MS + 600);
        };
        if (map.isStyleLoaded()) init(); else map.once('style.load', init);
      } catch (err) {
        console.warn('[reach] no map', err);
        if (!dead) setMapState('failed');
      }
    })();

    /** The build, then the shimmer. One rAF loop; three small GeoJSON sources. */
    function grow(map) {
      const src = (id) => map.getSource(id);
      if (still) {
        for (const el of starEls.current) el.classList.add('is-on', 'is-still');
        src('rm-links')?.setData(fc(LINKS.map((L) => line(L.coords))));
        setLit(STARS.length);
        return;
      }
      const lit = new Array(LINKS.length).fill(false);
      let litCount = 0;
      let built = false;
      const t0 = performance.now();
      const tick = (t) => {
        if (dead) return;
        const e = t - t0;
        const links = [], trails = [], lights = [];
        let building = false;
        LINKS.forEach((L, i) => {
          const p = (e - L.start) / L.draw;
          if (p < 1) {
            building = true;
            if (p <= 0) return;
            const q = 1 - (1 - p) ** 3;
            const drawn = slice(L.coords, L.cum, 0, q);
            if (drawn.length >= 2) links.push(line(drawn));
            const tail = slice(L.coords, L.cum, q - 0.3, q);
            if (tail.length >= 2) trails.push(line(tail));
            lights.push(point(pointAt(L.coords, L.cum, q)));
            return;
          }
          if (!lit[i]) { lit[i] = true; litCount += 1; starEls.current[i]?.classList.add('is-on'); }
          if (!built) links.push(line(L.coords));
          if (L.shimmer) {
            // the light is on the wire for the first half of each lap and rests for the other
            const g = ((((e - L.start - L.draw) / L.lap) + L.phase) % 1) / 0.5;
            if (g < 1) {
              const tail = slice(L.coords, L.cum, g - 0.22, g);
              if (tail.length >= 2) trails.push(line(tail));
              lights.push(point(pointAt(L.coords, L.cum, g)));
            }
          }
        });
        if (!built) {
          src('rm-links')?.setData(fc(links));
          setLit(litCount); // a no-op render when nothing new lit this frame
          if (!building) built = true;
        }
        src('rm-trails')?.setData(fc(trails));
        src('rm-lights')?.setData(fc(lights));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    // a map that never gets its style says so instead of spinning
    const watchdog = window.setTimeout(() => { if (!dead) setMapState((st) => (st === 'booting' ? 'failed' : st)); }, MAP_WATCHDOG_MS);
    return () => {
      dead = true;
      window.clearTimeout(watchdog);
      window.clearTimeout(fallback);
      unfold();
      cancelAnimationFrame(rafRef.current);
      try { mapRef.current?.remove(); } catch { /* already gone */ }
      mapRef.current = null;
      tagRef.current = null;
      starEls.current = [];
    };
  }, [copy.showroom, night, still]);

  /* ── a tapped star: its town, and only its town ── */
  useEffect(() => {
    starEls.current.forEach((el, i) => el?.classList.toggle('is-picked', i === picked));
    const map = mapRef.current, lib = libRef.current;
    if (!map || !lib || mapState !== 'ready') return;
    if (picked == null) { tagRef.current?.remove(); return; }
    const s = STARS[picked];
    if (!tagRef.current) {
      const el = document.createElement('div');
      el.className = 'rm-pick';
      tagRef.current = new lib.Marker({ element: el, anchor: 'bottom', offset: [0, -14] });
    }
    tagRef.current.getElement().textContent = s.area;
    // removed and re-added so it is always the last marker in the DOM, over every star
    tagRef.current.remove();
    tagRef.current.setLngLat([s.lng, s.lat]).addTo(map);
  }, [picked, mapState]);

  /* ── the numbers: they count the stars as they light, so the panel and the map agree ── */
  const done = lit >= STARS.length || mapState === 'failed';
  // ☠️ THE CLINICS COUNTER IS CLINICS SERVED, NOT STARS (Jarich, 2026-10-08: "instead of 61 clinics
  // on the map make it 100+"). The console holds 188 active clients; only those with a known
  // location are stars. The counter climbs in step with the stars to `clinicsShown` and lands on
  // it with the `clinicsPlus` mark, both from the copy; without them it counts the stars as before.
  const clinicsTarget = Number(copy.clinicsShown) || CLINICS;
  const shown = useMemo(() => {
    if (done) return { clinics: clinicsTarget, areas: AREAS, far: FARTHEST_KM };
    // stars light in index order (nearest first), so the lit ones are the first `lit`
    const on = STARS.slice(0, lit);
    return {
      clinics: Math.round((lit / Math.max(1, STARS.length)) * clinicsTarget),
      areas: Math.min(AREAS, new Set(on.map((s) => provinceOf(s.area))).size),
      far: on.reduce((m, s) => Math.max(m, s.km), 0),
    };
  }, [lit, done, clinicsTarget]);
  const clinics = useGlide(shown.clinics, still);
  const plus = done && copy.clinicsPlus ? copy.clinicsPlus : '';
  const areas = useGlide(shown.areas, still);
  const far = useGlide(shown.far, still);
  const unit = copy.unit || 'km';
  // the moving numbers are hidden from screen readers; this says the final values once
  const spoken = !done ? '' : `${copy.clinics}: ${clinicsTarget}${plus}. ${copy.areas}: ${AREAS}. ${copy.farthest}: ${fmtInt(FARTHEST_KM)} ${unit}.`;
  const areaList = [...new Set(STARS.map((s) => s.area))].join(', ');
  const shelf = still ? PARTS : [...PARTS, ...PARTS];

  return (
    <div className={`rm-backdrop${instant ? ' rm-instant' : ''}`} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="rm-card lg-on-dark" ref={cardRef} role="dialog" aria-modal="true" aria-labelledby="rm-title">
        <div className="rm-stage" ref={stageRef}>
          <div className="rm-map" ref={mapEl} />
          <div className="rm-vignette" aria-hidden="true" />
          <span className="hf-corner hf-tl" aria-hidden="true" />
          <span className="hf-corner hf-tr" aria-hidden="true" />
          <span className="hf-corner hf-bl" aria-hidden="true" />
          <span className="hf-corner hf-br" aria-hidden="true" />

          <div className="hf-top">
            <div>
              <div className="hf-kicker"><span className="hf-live" aria-hidden="true" />{copy.kicker}</div>
              <h2 className="hf-title" id="rm-title">{copy.title}</h2>
            </div>
            <button type="button" className="hf-close" ref={closeRef} onClick={onClose} aria-label={copy.close || 'Close'}>×</button>
          </div>

          <div className="rm-panel" ref={panelRef}>
            <p className="hf-sr" aria-live="polite">{spoken}</p>
            <p className="hf-sr" aria-live="polite">{picked != null ? STARS[picked].area : ''}</p>
            <p className="hf-sr">{areaList}</p>
            <div className="hf-stats rm-stats" aria-hidden="true">
              <Stat label={copy.clinics} value={`${fmtInt(clinics)}${plus}`} />
              <Stat label={copy.areas} value={fmtInt(areas)} />
              <Stat label={copy.farthest} value={fmtInt(far)} unit={unit} />
            </div>
            <p className="rm-note">{mapState === 'failed' ? copy.noMap : copy.note}</p>
            <div className="hf-actions">
              {copy.messenger?.href ? (
                <a className="hf-btn rm-msg lg lg-primary" href={copy.messenger.href} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={17} strokeWidth={2.2} aria-hidden="true" />
                  {copy.messenger.label}
                </a>
              ) : null}
              {copy.howFar ? <HowFar copy={copy.howFar} className="hf-btn hf-btn-ghost dsd-howfar lg" /> : null}
            </div>
            {copy.privacy ? <p className="hf-privacy">{copy.privacy}</p> : null}
          </div>
        </div>

        <aside className="rm-parts" aria-labelledby="rm-parts-title">
          <div className="rm-parts-head">
            {copy.partsKicker ? <div className="rm-parts-kicker"><span className="hf-live" aria-hidden="true" />{copy.partsKicker}</div> : null}
            <h3 className="rm-parts-title" id="rm-parts-title">{copy.partsTitle}</h3>
            {copy.partsNote ? <p className="rm-parts-note">{copy.partsNote}</p> : null}
          </div>
          <div className="rm-parts-window">
            <div className="rm-parts-track" style={{ '--rm-n': PARTS.length }}>
              {shelf.map((part, i) => (
                <div className={`rm-part${part.name ? '' : ' is-bare'}`} key={`${i}-${part.slug}`} aria-hidden={i >= PARTS.length ? 'true' : undefined}>
                  <Image src={part.src} alt={i >= PARTS.length ? '' : part.name || ''} width={112} height={112} quality={85} className="rm-part-img" />
                  {part.name ? <span className="rm-part-name">{part.name}</span> : null}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
