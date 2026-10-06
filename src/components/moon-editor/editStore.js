// The moon editor's state: the signed-in seat, the six strips as the console holds them, and
// every change. One module-level store, because the strips it feeds are drawn INSIDE the home
// page's panels (through the moonEdit seam) while the sheet and the bar are drawn by the
// editor's own root, and no React context spans both.
//
// THE CONSOLE IS THE TRUTH. Every change shows at once (remove, swap, a photo arriving, the
// timing), goes to the same WWW doors the console's own WWW sheet uses, and the strips are
// read back from the console afterwards, so what the editor shows is what the site will play.

import { useSyncExternalStore } from 'react';
import { SignInLost, bytesArg, call, forgetSession, loadSession, saveSession } from './wwwClient';
import { preparePhoto } from './photo';

const TOAST_MS = 6500;
const SPEED_SETTLE_MS = 450;

// The timing slider moves the strip's number at once and saves when the hand settles; until
// then a re-read of the strips keeps the slider's value rather than the server's older one.
const pendingSpeed = {};
const speedTimers = {};

let state = {
  session: loadSession(),   // { token, name } or null
  decks: null,              // { [deck]: { name, shown, defaultAlt, exists, tiles, speed } }
  loading: false,
  loadError: null,
  signInLost: false,
  picked: null,             // { deck, id }: the first tile of a swap
  uploads: {},              // { [deck]: [{ key, preview }] } photos on their way
  busy: {},                 // { [deck]: n } writes in flight
  toast: null,              // { id, text, tone, undo }
};
const listeners = new Set();

function set(patch) {
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
  for (const fn of listeners) fn();
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useEdit() {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

export const getEdit = () => state;

// ---- the toast -----------------------------------------------------------------------------

let toastTimer = 0;
let toastSeq = 0;
export function toast(text, tone = 'ok', undo = null) {
  clearTimeout(toastTimer);
  toastSeq += 1;
  const id = toastSeq;
  set({ toast: { id, text, tone, undo } });
  toastTimer = setTimeout(() => { if (state.toast && state.toast.id === id) set({ toast: null }); }, TOAST_MS);
}
export const dismissToast = () => set({ toast: null });

// ---- the session ---------------------------------------------------------------------------

export function signedIn(session) {
  saveSession(session);
  set({ session, signInLost: false });
}

export function signOut() {
  forgetSession();
  clearTimeout(toastTimer);
  set({ session: null, decks: null, picked: null, uploads: {}, busy: {}, toast: null, signInLost: false, loadError: null });
}

// ---- reading the strips --------------------------------------------------------------------

const byDeck = (list) => {
  const out = {};
  for (const d of list || []) {
    out[d.deck] = {
      name: d.name, shown: d.shown, defaultAlt: d.defaultAlt, exists: !!d.exists,
      tiles: Array.isArray(d.tiles) ? d.tiles : [],
      speed: typeof d.speed === 'number' ? d.speed : 1,
    };
  }
  return out;
};

function lost(e) {
  if (e instanceof SignInLost) { set({ signInLost: true }); return true; }
  return false;
}

export async function loadDecks() {
  const s = state.session;
  if (!s) return;
  set({ loading: true, loadError: null });
  try {
    const list = await call('query', 'www:decks', {}, s.token);
    // a strip whose timing is being dragged keeps the slider's value, not the server's
    const next = byDeck(list);
    for (const [deck, n] of Object.entries(pendingSpeed)) if (next[deck]) next[deck].speed = n;
    set({ decks: next, loading: false });
  } catch (e) {
    if (!lost(e)) set({ loadError: e.message || 'The strips did not load.' });
    set({ loading: false });
  }
}

// ---- one write, the same shape every time --------------------------------------------------

function patchDeck(deck, fn) {
  set((st) => (st.decks && st.decks[deck] ? { decks: { ...st.decks, [deck]: { ...st.decks[deck], ...fn(st.decks[deck]) } } } : {}));
}

async function write(deck, optimistic, run) {
  const s = state.session;
  if (!s) return null;
  const before = state.decks;
  if (optimistic) patchDeck(deck, optimistic);
  set((st) => ({ busy: { ...st.busy, [deck]: (st.busy[deck] || 0) + 1 } }));
  try {
    return await run(s.token);
  } catch (e) {
    // the change did not save: take the at-once view back before anything else, so a strip
    // never shows a removal or a swap the console does not have (the re-read below may fail
    // too, when the sign-in is what ran out)
    if (optimistic) set({ decks: before });
    if (!lost(e)) toast(e.message || 'That did not save.', 'danger');
    return null;
  } finally {
    set((st) => ({ busy: { ...st.busy, [deck]: Math.max(0, (st.busy[deck] || 1) - 1) } }));
    await loadDecks();
  }
}

const undoFor = (deck, logId) => (logId ? () => undoChange(deck, logId) : null);

export async function undoChange(deck, logId) {
  dismissToast();
  const r = await write(deck, null, (token) => call('mutation', 'www:undo', { deck, logId }, token));
  if (r) toast(r.lost ? `${r.what}. ${r.lost} could not come back.` : r.what, 'ok');
}

// ---- the four things the editor does -------------------------------------------------------

/** The glass x: take one tile off the strip (Undo in the toast). */
export async function removeTile(deck, id) {
  if (state.picked && state.picked.id === id) set({ picked: null });
  const r = await write(deck, (d) => ({ tiles: d.tiles.filter((t) => t.id !== id) }),
    (token) => call('mutation', 'www:remove', { deck, ids: [id] }, token));
  if (r) toast(`${r.what}. Live on the site in about a minute.`, 'ok', undoFor(deck, r.logId));
}

/** Tap one tile, then another in the same strip: they trade places. */
export function pickTile(deck, id) {
  const p = state.picked;
  if (!p || p.deck !== deck) { set({ picked: { deck, id } }); return; }
  if (p.id === id) { set({ picked: null }); return; }
  set({ picked: null });
  void swapTiles(deck, p.id, id);
}

export async function swapTiles(deck, a, b) {
  const r = await write(deck, (d) => {
    const tiles = d.tiles.slice();
    const i = tiles.findIndex((t) => t.id === a);
    const j = tiles.findIndex((t) => t.id === b);
    if (i >= 0 && j >= 0) [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    return { tiles };
  }, (token) => call('mutation', 'www:swap', { deck, a, b }, token));
  if (r) toast(`${r.what}. Live on the site in about a minute.`, 'ok', undoFor(deck, r.logId));
}

/** The + tile: check, slim, store, attach at the FRONT of the strip. */
export async function addPhoto(deck, file) {
  let photo;
  try {
    photo = await preparePhoto(file);
  } catch (e) {
    toast(e.message, 'danger');
    return;
  }
  const key = `u${Date.now()}`;
  let preview = '';
  try { preview = URL.createObjectURL(new Blob([photo.bytes])); } catch { preview = ''; }
  set((st) => ({ uploads: { ...st.uploads, [deck]: [{ key, preview }, ...(st.uploads[deck] || [])] } }));
  const alt = (state.decks && state.decks[deck] && state.decks[deck].defaultAlt) || 'DentaSource Direct';
  const r = await write(deck, null, async (token) => {
    const storageId = await call('action', 'wwwUpload:storeUpload', { bytes: bytesArg(photo.bytes) }, token);
    return call('mutation', 'www:addUploads', { deck, items: [{ storageId, w: photo.w, h: photo.h, alt }] }, token);
  });
  set((st) => ({ uploads: { ...st.uploads, [deck]: (st.uploads[deck] || []).filter((u) => u.key !== key) } }));
  if (preview) { try { URL.revokeObjectURL(preview); } catch { /* gone */ } }
  if (r) toast(`${r.what}. Live on the site in about a minute.`, 'ok', undoFor(deck, r.logId));
}

/** The timing slider: 0.5 to 2 times the site's measured marquee speed. */
export function setSpeed(deck, speed) {
  pendingSpeed[deck] = speed;
  patchDeck(deck, () => ({ speed }));
  clearTimeout(speedTimers[deck]);
  speedTimers[deck] = setTimeout(async () => {
    const want = pendingSpeed[deck];
    const r = await write(deck, null, (token) => call('mutation', 'www:setSpeed', { deck, speed: want }, token));
    if (pendingSpeed[deck] === want) delete pendingSpeed[deck];
    if (r) toast(`${r.what}. Live on the site in about a minute.`, 'ok');
  }, SPEED_SETTLE_MS);
}
