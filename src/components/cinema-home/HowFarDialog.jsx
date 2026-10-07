'use client';

// "How far am I?" — the showroom beat's popup. The console's Field map look (Esri imagery by
// day, NASA city lights by night, the round DSD badge) with the visitor's own road to the floor.
//
// ☠️ NO GOOGLE CONTENT ON THIS MAP. The console's law: anything Google returns (routes, places)
// may only be drawn on a Google map. This is a MapLibre map, so the road comes from OSRM over
// OpenStreetMap, called straight from the browser (it answers CORS *). Google Maps and Waze are
// LINKS out, never data in.
//
// ☠️ THE LOCATION NEVER REACHES US. It is read in the browser, rounded to three decimals
// (about 100 m), sent ONLY to the public OSRM router to draw the road, and dropped when the popup
// closes. Nothing is posted to DSD, nothing is stored. The privacy line in the JSON says exactly
// that (rounded, a free road map service, DSD never receives it), so keep the two in step.
//
// Every word a visitor reads comes from beat.howFar in home-beats.json (the house rule of the
// home arc). This file only formats numbers.
//
// The whole module (and maplibre-gl, about 230 KB gzipped) is a dynamic chunk: HowFar.jsx
// imports it on the first hover or tap, so the home page itself pays nothing for the map.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';
import './how-far.css';
// the console look and the line maths, shared with the reach popup (ReachDialog)
import {
  SHOWROOM, BADGE, manilaNow, isNightInManila, reducedMotion, consoleStyle, paintNight, foldAttribution,
  haversineKm, arc, measure, slice, pointAt, line, fc, EMPTY, lineFc, useCountUp, escapeHtml,
} from './mapKit';

// The default destination (SHOWROOM, in mapKit); a beat can send another (the Training Center) as copy.dest.
const OSRM = 'https://router.project-osrm.org/route/v1/driving/';
const MINT = '#34d399';
const HERE_KM = 0.15; // inside this radius the visitor is at the showroom
const FAR_KM = 450; // past this, a failed road lookup is read as "across the water", not as an outage
const ABROAD_KM = 1500; // the whole country sits inside this from Pasig; past it there is no road to ask OSRM for
const ROUTE_TIMEOUT_MS = 12000;
const GEO_TIMEOUT_MS = 12000;
// Chrome starts the geolocation timeout only AFTER permission; a prompt the visitor ignores
// (Safari dismissed, Firefox "Not now") never calls back at all. This hands them the cities.
const GEO_WATCHDOG_MS = 15000;
const MAP_WATCHDOG_MS = 15000;

/** A longitude moved to the showroom's side of the antimeridian, so a visitor in California or
 *  Dubai gets a line (and a camera) across the short side of the globe, not the long one. */
const nearLng = (lng, d) => (lng - d.lng > 180 ? lng - 360 : lng - d.lng < -180 ? lng + 360 : lng);
const near = (p, d) => ({ lat: p.lat, lng: nearLng(p.lng, d) });

/** OSRM's polyline6 → [[lng, lat], ...]. Compact on the wire even for a 1,000 km route. */
function decodePolyline6(str) {
  const out = [];
  let i = 0, lat = 0, lng = 0;
  while (i < str.length) {
    for (const axis of [0, 1]) {
      let shift = 0, result = 0, b;
      do { b = str.charCodeAt(i++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
      const d = result & 1 ? ~(result >> 1) : result >> 1;
      if (axis === 0) lat += d; else lng += d;
    }
    out.push([lng / 1e6, lat / 1e6]);
  }
  return out;
}

async function fetchRoute(from, to, signal) {
  // Three decimals is ~100 m: enough for a road, not enough to name a house.
  const o = `${from.lng.toFixed(3)},${from.lat.toFixed(3)}`;
  const res = await fetch(`${OSRM}${o};${to.lng},${to.lat}?overview=full&geometries=polyline6&steps=true`, { signal });
  if (!res.ok) throw new Error(`route ${res.status}`);
  const d = await res.json();
  if (d.code !== 'Ok' || !d.routes?.length) throw new Error(d.code || 'no route');
  const r = d.routes[0];
  // ☠️ A ROUTE WITH A FERRY IS NOT A DRIVE. OSRM happily routes Cebu to Pasig over RoRo and
  // calls it 18 hours; that number on a "how far" card is nonsense, so a ferry leg = far mode.
  const ferry = r.legs.some((l) => l.steps.some((s) => s.mode === 'ferry'));
  return { coords: decodePolyline6(r.geometry), km: r.distance / 1000, min: r.duration / 60, ferry };
}

function fmtKm(km) {
  if (km < 10) return { v: km.toFixed(1), u: 'km' };
  return { v: Math.round(km).toLocaleString('en-PH'), u: 'km' };
}
function fmtMin(min) {
  const m = Math.max(1, Math.round(min));
  if (m < 60) return { v: String(m), u: 'min' };
  const h = Math.floor(m / 60), r = m % 60;
  return { v: r ? `${h} h ${r}` : String(h), u: r ? 'min' : 'h' };
}

function Stat({ label, value, unit }) {
  return (
    <div className="hf-stat">
      <div className="hf-stat-label">{label}</div>
      <div className="hf-stat-value">{value}<span className="hf-stat-unit">{unit}</span></div>
    </div>
  );
}

/** The Messenger shortcut (Jarich, 2026-10-07): a small glass door to the FB page's inbox,
 *  in a new tab so the map stays where it was. Absent copy, no button. */
function Messenger({ copy }) {
  const m = copy.messenger;
  if (!m?.href || !m?.label) return null;
  return (
    <a className="hf-btn hf-btn-ghost hf-msg lg lg-sm" href={m.href} target="_blank" rel="noopener noreferrer">
      <MessageCircle size={15} strokeWidth={2.2} aria-hidden="true" />
      {m.label}
    </a>
  );
}

export default function HowFarDialog({ copy, onClose, instant = false }) {
  const destLat = Number(copy.dest?.lat), destLng = Number(copy.dest?.lng);
  const DEST = useMemo(() => (Number.isFinite(destLat) && Number.isFinite(destLng) ? { lat: destLat, lng: destLng } : SHOWROOM), [destLat, destLng]);
  const cardRef = useRef(null);
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const libRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const youRef = useRef(null);
  const rafRef = useRef(0);
  const geoTok = useRef(0); // bumped when the visitor picks a city: a late GPS answer is ignored
  const geoTimer = useRef(0);
  const [mapState, setMapState] = useState('booting'); // booting | ready | failed
  // phase: locating | routing | ready | ask (no location: pick a city)
  const [phase, setPhase] = useState('locating');
  const [origin, setOrigin] = useState(null); // { lat, lng, label? }
  const [result, setResult] = useState(null); // { mode: road|far|line|here, km, min, straightKm }
  const [night] = useState(isNightInManila);

  /* ── open / close plumbing: focus, Tab kept inside, the page underneath held still.
        Esc lives in HowFar.jsx, because it has to work before this chunk has arrived. ── */
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => {
      const card = cardRef.current;
      if (e.key !== 'Tab' || !card) return;
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
      window.clearTimeout(geoTimer.current);
    };
  }, []);

  /* ── the map: a globe over the Philippines until we know where the visitor is ── */
  useEffect(() => {
    let dead = false;
    let unfold = () => {};
    (async () => {
      try {
        const mod = await import('maplibre-gl');
        const maplibregl = mod.default ?? mod;
        if (dead || !mapEl.current) return;
        libRef.current = maplibregl;
        const map = new maplibregl.Map({
          container: mapEl.current,
          style: consoleStyle({
            space: '#020604',
            sky: { 'sky-color': '#03120c', 'horizon-color': '#1f8f6a', 'fog-color': '#03120c', 'sky-horizon-blend': 0.6, 'horizon-fog-blend': 0.8, 'fog-ground-blend': 0.5, 'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 10, 1, 12, 0] },
          }),
          center: [122.6, 12.2],
          zoom: 3.4,
          attributionControl: false,
        });
        mapRef.current = map;
        map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: 'Route © OSRM, OpenStreetMap contributors' }), 'top-right');
        // fold the compact credits once, so they do not sit over the title on a phone
        unfold = foldAttribution(mapEl.current);
        // A missing tile (Esri, NASA) is not a broken map; only a dead WebGL is.
        map.on('error', (ev) => { console.warn('[how-far] map', ev?.error?.message || ev); });
        // ☠️ NOT map.on('load'). 'load' waits for EVERY tile on screen, which measured ~9 s on
        // a slow GPU with the globe up; on Philippine mobile data it would be the same, and the
        // route layers would sit unadded the whole time. The style is an inline object, so
        // 'style.load' fires on the next frame: layers go in at once and tiles stream under them.
        const init = () => {
          if (dead) return;
          if (night) paintNight(map);
          map.addSource('route', { type: 'geojson', data: EMPTY });
          map.addSource('drawn', { type: 'geojson', data: EMPTY });
          map.addSource('link', { type: 'geojson', data: EMPTY });
          map.addSource('trail', { type: 'geojson', lineMetrics: true, data: EMPTY });
          map.addSource('comet', { type: 'geojson', data: EMPTY });
          map.addLayer({ id: 'route-ghost', type: 'line', source: 'route', paint: { 'line-color': '#ecfdf5', 'line-width': 2, 'line-opacity': 0.18, 'line-dasharray': [1, 2] }, layout: { 'line-cap': 'round', 'line-join': 'round' } });
          map.addLayer({ id: 'drawn-glow', type: 'line', source: 'drawn', paint: { 'line-color': MINT, 'line-width': 14, 'line-opacity': 0.35, 'line-blur': 6 }, layout: { 'line-cap': 'round', 'line-join': 'round' } });
          map.addLayer({ id: 'drawn-core', type: 'line', source: 'drawn', paint: { 'line-color': '#a7f3d0', 'line-width': 3.4 }, layout: { 'line-cap': 'round', 'line-join': 'round' } });
          map.addLayer({ id: 'link', type: 'line', source: 'link', paint: { 'line-color': '#e0f2fe', 'line-width': 1.6, 'line-opacity': 0.75, 'line-dasharray': [1.2, 1.6] }, layout: { 'line-cap': 'round' } });
          map.addLayer({ id: 'trail', type: 'line', source: 'trail', paint: { 'line-width': 6, 'line-blur': 2, 'line-gradient': ['interpolate', ['linear'], ['line-progress'], 0, 'rgba(52,211,153,0)', 1, 'rgba(236,253,245,0.95)'] }, layout: { 'line-cap': 'round', 'line-join': 'round' } });
          map.addLayer({ id: 'comet-glow', type: 'circle', source: 'comet', paint: { 'circle-radius': 14, 'circle-color': MINT, 'circle-opacity': 0.45, 'circle-blur': 1 } });
          map.addLayer({ id: 'comet', type: 'circle', source: 'comet', paint: { 'circle-radius': 4.5, 'circle-color': '#ffffff', 'circle-stroke-color': MINT, 'circle-stroke-width': 2 } });

          // The floor: the console's round DSD badge, gold ring, always on the map.
          const el = document.createElement('div');
          el.className = 'hf-home';
          el.innerHTML = `<span class="hf-home-pulse"></span><img src="${BADGE}" alt="" draggable="false" /><span class="hf-tag">${escapeHtml(copy.showroom || 'DentaSource Direct')}</span>`;
          new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([DEST.lng, DEST.lat]).addTo(map);

          setMapState('ready');
          if (!reducedMotion()) {
            // a slow turn of the globe while we wait for the visitor's position
            map.easeTo({ center: [121.4, 13.2], zoom: 4.6, duration: 2600, easing: (t) => 1 - (1 - t) ** 3 });
          }
        };
        if (map.isStyleLoaded()) init(); else map.once('style.load', init);
      } catch (err) {
        console.warn('[how-far] no map', err);
        if (!dead) setMapState('failed');
      }
    })();
    // A map that never gets its style (a stalled chunk, a dead GPU) says so instead of
    // spinning; if it does come up later, 'ready' simply replaces this.
    const watchdog = window.setTimeout(() => { if (!dead) setMapState((st) => (st === 'booting' ? 'failed' : st)); }, MAP_WATCHDOG_MS);
    return () => {
      dead = true;
      window.clearTimeout(watchdog);
      unfold();
      cancelAnimationFrame(rafRef.current);
      try { mapRef.current?.remove(); } catch { /* already gone */ }
      mapRef.current = null;
    };
  }, [copy.showroom, night, DEST]);

  /* ── where is the visitor ── */
  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) { setPhase('ask'); return; }
    const tok = ++geoTok.current;
    setPhase('locating');
    window.clearTimeout(geoTimer.current);
    geoTimer.current = window.setTimeout(() => {
      if (geoTok.current === tok) setPhase((ph) => (ph === 'locating' ? 'ask' : ph));
    }, GEO_WATCHDOG_MS);
    navigator.geolocation.getCurrentPosition(
      // a late yes after the watchdog still counts, unless the visitor has picked a city since
      (pos) => { window.clearTimeout(geoTimer.current); if (geoTok.current === tok) setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude }); },
      () => { window.clearTimeout(geoTimer.current); if (geoTok.current === tok) setPhase('ask'); },
      { enableHighAccuracy: false, timeout: GEO_TIMEOUT_MS, maximumAge: 5 * 60 * 1000 },
    );
  }, []);
  useEffect(() => { locate(); }, [locate]);
  const askCity = () => { geoTok.current++; window.clearTimeout(geoTimer.current); setOrigin(null); setResult(null); setPhase('ask'); };
  const pickCity = (c) => { geoTok.current++; window.clearTimeout(geoTimer.current); setOrigin({ lat: c.lat, lng: c.lng, label: c.name }); };

  /* ── the road (or the arc), once we have both a position and a map ── */
  useEffect(() => {
    if (!origin) return undefined;
    // `cancelled` = this origin was replaced or the popup closed. A TIMEOUT also aborts the
    // fetch, but that one must still fall through to the straight line, so the two are kept apart.
    let cancelled = false;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ROUTE_TIMEOUT_MS);
    const straightKm = haversineKm(origin, DEST);
    setResult(null);
    if (straightKm < HERE_KM) {
      setResult({ mode: 'here', straightKm, coords: [[origin.lng, origin.lat], [DEST.lng, DEST.lat]] });
      setPhase('ready');
      return () => { clearTimeout(timer); };
    }
    if (straightKm > ABROAD_KM) {
      // Abroad: OSRM can only answer 400 NoRoute, so do not ask it.
      setResult({ mode: 'far', straightKm, coords: arc(near(origin, DEST), DEST) });
      setPhase('ready');
      return () => { clearTimeout(timer); };
    }
    setPhase('routing');
    fetchRoute(origin, DEST, ctrl.signal)
      .then((r) => {
        if (cancelled) return;
        if (r.ferry) setResult({ mode: 'far', straightKm, coords: arc(near(origin, DEST), DEST) });
        else setResult({ mode: 'road', km: r.km, min: r.min, straightKm, coords: r.coords });
      })
      .catch(() => {
        if (cancelled) return;
        setResult({ mode: straightKm > FAR_KM ? 'far' : 'line', straightKm, coords: arc(near(origin, DEST), DEST) });
      })
      .finally(() => { clearTimeout(timer); if (!cancelled) setPhase('ready'); });
    return () => { cancelled = true; clearTimeout(timer); ctrl.abort(); };
  }, [origin, DEST]);

  /* ── paint it: fly in, draw the line, then send the comet down it on a loop ── */
  useEffect(() => {
    const map = mapRef.current;
    const lib = libRef.current;
    if (!map || !lib || mapState !== 'ready') return undefined;
    cancelAnimationFrame(rafRef.current);
    if (!origin || !result) {
      // between cities (or while the next road loads) the last road and its marker go first
      youRef.current?.remove();
      youRef.current = null;
      for (const id of ['route', 'drawn', 'link', 'trail', 'comet']) map.getSource(id)?.setData(EMPTY);
      return undefined;
    }
    let dead = false;
    const at = near(origin, DEST);

    youRef.current?.remove();
    const el = document.createElement('div');
    el.className = 'hf-you';
    el.innerHTML = `<span class="hf-you-ring"></span><span class="hf-you-ring hf-r2"></span><span class="hf-you-dot"></span><span class="hf-tag">${escapeHtml(origin.label || copy.you || 'You')}</span>`;
    youRef.current = new lib.Marker({ element: el, anchor: 'center' }).setLngLat([at.lng, at.lat]).addTo(map);

    const coords = result.coords;
    const cum = measure(coords);
    const src = (id) => map.getSource(id);
    src('route')?.setData(fc([line(coords)]));
    src('drawn')?.setData(EMPTY);
    src('trail')?.setData(EMPTY);
    src('comet')?.setData(EMPTY);
    // OSRM snaps to the nearest road; a thin dashed link closes the gap to the real dot.
    src('link')?.setData(result.mode === 'road' ? fc([line([[origin.lng, origin.lat], coords[0]])]) : EMPTY);

    const lngs = coords.map((c) => c[0]).concat(at.lng, DEST.lng);
    const lats = coords.map((c) => c[1]).concat(at.lat, DEST.lat);
    // ☠️ PADDING IS CLAMPED TO THE CARD. A landscape phone is wide but ~380 px tall; the full
    // padding there exceeds the canvas and MapLibre then refuses to move, silently.
    const cw = cardRef.current?.clientWidth || 1000, ch = cardRef.current?.clientHeight || 700;
    const narrow = cw < 640;
    const panel = panelRef.current;
    let padding;
    if (panel && panel.offsetHeight > ch * 0.6) {
      // a phone on its side: the panel is a right-hand column (how-far.css), the road gets the left
      padding = { top: Math.min(100, ch * 0.28), bottom: 56, left: 40, right: Math.min(panel.offsetWidth + 50, cw * 0.6) };
    } else {
      const bottom = Math.min((panel?.offsetHeight || 220) + (narrow ? 40 : 50), ch * 0.5);
      const side = Math.min(narrow ? 40 : 90, cw * 0.15);
      padding = { top: Math.min(narrow ? 120 : 130, ch * 0.22), bottom, left: side, right: side };
    }
    const still = reducedMotion();
    const pitch = result.mode === 'far' ? 20 : 52;
    try {
      map.fitBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], {
        padding, pitch, bearing: still ? 0 : -14, maxZoom: result.mode === 'here' ? 17 : 15.5, duration: still ? 0 : 3200, essential: true,
      });
    } catch { /* padding larger than a tiny viewport */ }

    const draw = () => {
      if (dead) return;
      if (still) { src('drawn')?.setData(lineFc(coords)); return; }
      const t0 = performance.now();
      const DRAW = 1700, LAP = Math.min(9000, Math.max(4200, (cum[cum.length - 1] || 1) * 140));
      const tick = (t) => {
        if (dead) return;
        const e = t - t0;
        if (e < DRAW) {
          const p = 1 - (1 - e / DRAW) ** 3;
          src('drawn')?.setData(lineFc(slice(coords, cum, 0, p)));
          src('comet')?.setData(fc([{ type: 'Feature', geometry: { type: 'Point', coordinates: pointAt(coords, cum, p) }, properties: {} }]));
        } else {
          if (e - DRAW < 40) src('drawn')?.setData(lineFc(coords));
          const f = ((e - DRAW) % LAP) / LAP;
          src('trail')?.setData(lineFc(slice(coords, cum, f - 0.12, f)));
          src('comet')?.setData(fc([{ type: 'Feature', geometry: { type: 'Point', coordinates: pointAt(coords, cum, f) }, properties: {} }]));
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };
    // The draw waits for the camera to land. A camera that is already there never fires
    // moveend, so a timer a little past the flight starts it anyway; `go` runs once.
    let started = false;
    const go = () => { if (!started) { started = true; draw(); } };
    let fallback = 0;
    if (still) go();
    else { map.once('moveend', go); fallback = window.setTimeout(go, 3600); }

    return () => { dead = true; window.clearTimeout(fallback); map.off('moveend', go); cancelAnimationFrame(rafRef.current); };
  }, [mapState, origin, result, copy.you, DEST]);

  /* ── the words ── */
  const ready = phase === 'ready' && result;
  const roadKm = useCountUp(result?.km ?? result?.straightKm ?? 0, !!ready);
  const driveMin = useCountUp(result?.min ?? 0, !!ready && result?.mode === 'road');
  const straight = useCountUp(result?.straightKm ?? 0, !!ready);

  const open = useMemo(() => {
    const m = manilaNow();
    const h = m.getUTCHours() + m.getUTCMinutes() / 60;
    const opensAt = Number(copy.opensAt ?? 9), closesAt = Number(copy.closesAt ?? 20);
    return h >= opensAt && h < closesAt;
  }, [copy.opensAt, copy.closesAt]);

  const dest = `${DEST.lat},${DEST.lng}`;
  const google = `https://www.google.com/maps/dir/?api=1${origin?.label ? `&origin=${encodeURIComponent(`${origin.lat},${origin.lng}`)}` : ''}&destination=${encodeURIComponent(dest)}&travelmode=driving`;
  const waze = `https://waze.com/ul?ll=${encodeURIComponent(dest)}&navigate=yes`;

  const status = phase === 'locating' ? copy.locating : phase === 'routing' ? copy.routing : null;
  const note = !ready ? null
    : result.mode === 'here' ? copy.here
    : result.mode === 'far' ? copy.far
    : result.mode === 'line' ? copy.noRoute
    : copy.clearRoads;

  const km = fmtKm(roadKm);
  const dm = fmtMin(driveMin);
  const sk = fmtKm(straight);
  // The rolling numbers are hidden from screen readers; this says the final values once.
  const said = (o) => `${o.v} ${o.u}`;
  const spoken = status || (!ready ? '' : [
    result.mode === 'road' ? `${copy.road}: ${said(fmtKm(result.km))}. ${copy.drive}: ${said(fmtMin(result.min))}.` : '',
    result.mode !== 'here' ? `${copy.straight}: ${said(fmtKm(result.straightKm))}.` : '',
    note || '',
  ].filter(Boolean).join(' '));

  return (
    <div className={`hf-backdrop${instant ? ' hf-instant' : ''}`} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="hf-card" ref={cardRef} role="dialog" aria-modal="true" aria-labelledby="hf-title">
        <div className="hf-map" ref={mapEl} />
        <div className={`hf-scan ${phase === 'ready' ? 'hf-scan-off' : ''}`} aria-hidden="true"><span /></div>
        <div className="hf-vignette" aria-hidden="true" />
        <span className="hf-corner hf-tl" aria-hidden="true" />
        <span className="hf-corner hf-tr" aria-hidden="true" />
        <span className="hf-corner hf-bl" aria-hidden="true" />
        <span className="hf-corner hf-br" aria-hidden="true" />

        <div className="hf-top">
          <div>
            <div className="hf-kicker"><span className="hf-live" aria-hidden="true" />{copy.kicker}</div>
            <h2 className="hf-title" id="hf-title">{copy.title}</h2>
            {copy.openNow && copy.closedNow ? (
              <div className={`hf-open ${open ? 'is-open' : 'is-closed'}`}>{open ? copy.openNow : copy.closedNow}</div>
            ) : null}
          </div>
          <button type="button" className="hf-close" ref={closeRef} onClick={onClose} aria-label={copy.close || 'Close'}>×</button>
        </div>

        <div className="hf-panel" ref={panelRef}>
          <p className="hf-sr" aria-live="polite">{spoken}</p>
          {status ? (
            <div className="hf-status" aria-hidden="true"><span className="hf-spinner" />{status}</div>
          ) : null}
          {phase === 'locating' && copy.pickCity ? (
            <button type="button" className="hf-btn hf-btn-ghost hf-retry lg" onClick={askCity}>{copy.pickCity}</button>
          ) : null}

          {phase === 'ask' ? (
            <div className="hf-ask">
              <p className="hf-note">{copy.askCity}</p>
              <div className="hf-chips">
                {(copy.cities || []).map((c) => (
                  <button type="button" key={c.name} className="hf-chip lg lg-sm" onClick={() => pickCity(c)}>{c.name}</button>
                ))}
              </div>
              <div className="hf-actions">
                <button type="button" className="hf-btn hf-btn-ghost lg" onClick={locate}>{copy.useLocation}</button>
                <Messenger copy={copy} />
              </div>
            </div>
          ) : null}

          {ready ? (
            <>
              <div className={`hf-stats ${result.mode === 'road' ? '' : 'hf-stats-one'}`} aria-hidden="true">
                {result.mode === 'road' ? (
                  <>
                    <Stat label={copy.road} value={km.v} unit={km.u} />
                    <Stat label={copy.drive} value={dm.v} unit={dm.u} />
                    <Stat label={copy.straight} value={sk.v} unit={sk.u} />
                  </>
                ) : result.mode === 'here' ? null : (
                  <Stat label={copy.straight} value={sk.v} unit={sk.u} />
                )}
              </div>
              {note ? <p className="hf-note" aria-hidden="true">{note}</p> : null}
              <div className="hf-actions">
                {result.mode === 'far' && copy.farCta ? (
                  <a className="hf-btn hf-btn-solid lg lg-primary" href={copy.farCta.href}>{copy.farCta.label}</a>
                ) : null}
                <a className="hf-btn hf-btn-solid lg lg-primary" href={google} target="_blank" rel="noopener noreferrer">{copy.google}</a>
                <a className="hf-btn hf-btn-ghost lg" href={waze} target="_blank" rel="noopener noreferrer">{copy.waze}</a>
                <button type="button" className="hf-btn hf-btn-ghost lg" onClick={askCity}>{copy.changeCity}</button>
                <Messenger copy={copy} />
              </div>
            </>
          ) : null}

          {mapState === 'failed' && !ready && phase !== 'ask' ? <p className="hf-note">{copy.noMap}</p> : null}
          <p className="hf-privacy">{copy.privacy}</p>
        </div>
      </div>
    </div>
  );
}
