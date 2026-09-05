// formations/lockupConfig.js — the lockup's live dials.
//
// One object owns every number that decides how the printed mark becomes dots, so the
// on-page panel, the engine and (later) builder-room's /studio all read and write the
// same shape rather than three copies of it.
//
// The contract, so the studio can persist these without importing anything from here:
//   storage   localStorage['dsd:lockup-dials'] = JSON of a PARTIAL dial set
//   event     window 'dsd:lockup-dials', detail = { dials, source }
//   defaults  LOCKUP_DEFAULTS below; a partial is always merged over these, so a stored
//             set from an older build never breaks when a new dial is added.

export const DIALS_STORAGE_KEY = 'dsd:lockup-dials';
export const DIALS_EVENT = 'dsd:lockup-dials';

export const LOCKUP_DEFAULTS = {
  // ---- colour. MEASURED against the asset: the badge's own rim green is rgb(171,206,142),
  // a chroma of 0.31, while the printed brand green Jarich is asking for, rgb(156,196,73),
  // is 0.63. So the default saturation is the ~2x that closes exactly that gap rather than
  // a number picked to look busy. Brightness and contrast then lift the silver, which is
  // what made the disc read grey rather than metal.
  // MEASURED BY SWEEP, not guessed. At contrast 1.14 the badge's silver plate clipped
  // against the night's additive blending and swallowed the D entirely: the disc rendered
  // as a plain silver ball. Sweeping contrast 1.14/1.7/2.0 against brightness 1.08/0.85/0.8
  // showed the D only reads once the plate stops clipping, so contrast goes up and
  // brightness comes DOWN. Saturation is the separate lever and stays high, which is what
  // puts the brand greens back.
  saturation: 1.95,
  brightness: 0.86,
  contrast: 1.85,

  // ---- shape
  dotSize: 0.85,       // multiplies the dot size the grid pitch implies
  pitchBias: 1.0,      // <1 samples a FINER grid: more cells, sharper mark
  erosion: 2,          // pixels peeled off the mask edge, kills the anti-aliased halo

  // ---- dark register: black ink is invisible on a night sky, so anything under
  // darkLiftBelow is lifted onto the silver ladder, keeping darkLiftHue of its own colour
  darkLiftBelow: 0.35,
  darkLiftTo: 0.85,
  darkLiftHue: 0.22,

  // ---- light register: a silver disc on cream paper needs taking down to be seen at all
  lightDiscDarken: 0.62,
};

// Ranges are what the panel renders and what the studio should validate against.
export const LOCKUP_DIAL_META = [
  { key: 'saturation',      label: 'Vibrancy',        min: 0,    max: 3,    step: 0.01, group: 'Colour' },
  { key: 'brightness',      label: 'Brightness',      min: 0.5,  max: 1.8,  step: 0.01, group: 'Colour' },
  { key: 'contrast',        label: 'Contrast',        min: 0.5,  max: 2,    step: 0.01, group: 'Colour' },
  { key: 'pitchBias',       label: 'Sharpness (grid)',min: 0.4,  max: 2.5,  step: 0.05, group: 'Shape', invert: true },
  { key: 'dotSize',         label: 'Dot size',        min: 0.3,  max: 2.5,  step: 0.05, group: 'Shape' },
  { key: 'erosion',         label: 'Edge erosion',    min: 0,    max: 6,    step: 1,    group: 'Shape' },
  { key: 'darkLiftBelow',   label: 'Dark lift floor', min: 0,    max: 0.8,  step: 0.01, group: 'Dark register' },
  { key: 'darkLiftTo',      label: 'Dark lift to',    min: 0.3,  max: 1,    step: 0.01, group: 'Dark register' },
  { key: 'darkLiftHue',     label: 'Dark lift hue keep', min: 0, max: 1,    step: 0.01, group: 'Dark register' },
  { key: 'lightDiscDarken', label: 'Light disc darken', min: 0.2, max: 1,   step: 0.01, group: 'Light register' },
];

const clampToMeta = (key, v) => {
  const m = LOCKUP_DIAL_META.find((d) => d.key === key);
  const n = Number(v);
  if (!m || !Number.isFinite(n)) return null;
  return Math.min(m.max, Math.max(m.min, n));
};

// The live set. Held in the module so the formation code can read it without every call
// site having to thread it through, and re-read from storage on first use in the browser.
let live = { ...LOCKUP_DEFAULTS };
let loaded = false;

function loadOnce() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(DIALS_STORAGE_KEY);
    if (raw) applyPartial(JSON.parse(raw));
  } catch (e) {
    /* a broken or blocked store just means defaults, never a crash on boot */
  }
}

function applyPartial(partial) {
  if (!partial || typeof partial !== 'object') return;
  for (const [k, v] of Object.entries(partial)) {
    const c = clampToMeta(k, v);
    if (c !== null) live[k] = c;
  }
}

/** Every dial, defaults merged with whatever has been stored or set this session. */
export function getLockupDials() {
  loadOnce();
  return { ...live };
}

/**
 * Merge a partial dial set, persist it and tell the engine to rebuild.
 * `source` rides along on the event so a panel can ignore its own echo.
 */
export function setLockupDials(partial, source = 'panel') {
  loadOnce();
  applyPartial(partial);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(DIALS_STORAGE_KEY, JSON.stringify(live));
    } catch (e) { /* private mode: the session still works, it just will not persist */ }
    window.dispatchEvent(new CustomEvent(DIALS_EVENT, { detail: { dials: { ...live }, source } }));
  }
  return { ...live };
}

export function resetLockupDials(source = 'panel') {
  live = { ...LOCKUP_DEFAULTS };
  if (typeof window !== 'undefined') {
    try { window.localStorage.removeItem(DIALS_STORAGE_KEY); } catch (e) { /* nothing to clear */ }
    window.dispatchEvent(new CustomEvent(DIALS_EVENT, { detail: { dials: { ...live }, source } }));
  }
  return { ...live };
}

/** What the "copy settings" button puts on the clipboard, and what /studio should store. */
export function exportLockupDials() {
  return JSON.stringify(getLockupDials(), null, 2);
}

/**
 * The panel is a development tool and must never reach a visitor: it renders only in a dev
 * build or behind an explicit ?dials=1, and the production HTML therefore never contains it.
 */
export function dialsEnabled() {
  if (typeof window === 'undefined') return false;
  if (process.env.NODE_ENV === 'development') return true;
  try {
    return new URLSearchParams(window.location.search).get('dials') === '1';
  } catch (e) {
    return false;
  }
}
