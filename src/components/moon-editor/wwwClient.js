// The moon editor's line to the console. Loaded only after the moon gate opens.
//
// TWO PARTS:
//
//   openBridge()  opens console.dentasourcedirect.com/www-bridge in a popup. The console signs
//                 the seat in (its own Google or password door), checks the same WWW wall every
//                 console door enforces, and posts the seat's Convex Auth token back to THIS
//                 window at this exact origin. We accept it only from the console's origin, only
//                 from the popup we opened, only in the agreed shape.
//
//   call()        the console's Convex functions over Convex's documented HTTP API
//                 (POST /api/query | /api/mutation | /api/action, Bearer token). No `convex`
//                 package: the site gains no dependency, and the editor chunk stays small.
//
// ☠️ THE TOKEN LIVES IN MEMORY AND IN sessionStorage (this tab only, gone when it closes), NEVER
// localStorage, and is never logged or rendered. Sign out forgets it.

export const CONSOLE_ORIGIN = 'https://console.dentasourcedirect.com';
export const CONVEX_URL = 'https://energized-puma-161.convex.cloud';
const BRIDGE_MESSAGE = 'dsd-www-token';
const SESSION_KEY = 'dsd:www-edit';

/** A sign-in that no longer works (expired or refused): the editor asks for a new one. */
export class SignInLost extends Error {}

/** The seconds-since-epoch expiry inside a JWT, or 0 if it cannot be read. Nothing else is read. */
export function tokenExpiry(token) {
  try {
    const part = String(token).split('.')[1] || '';
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(part.length / 4) * 4, '='));
    const exp = JSON.parse(json).exp;
    return typeof exp === 'number' && Number.isFinite(exp) ? exp : 0;
  } catch {
    return 0;
  }
}

/** True while the token has more than `slackS` seconds left. */
export const tokenFresh = (token, slackS = 30) => !!token && tokenExpiry(token) * 1000 - Date.now() > slackS * 1000;

export function loadSession() {
  try {
    const s = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
    if (s && typeof s.token === 'string' && tokenFresh(s.token)) return { token: s.token, name: typeof s.name === 'string' ? s.name : '' };
  } catch { /* storage blocked: the sheet asks for a sign-in */ }
  return null;
}

export function saveSession(session) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token: session.token, name: session.name })); } catch { /* memory still holds it */ }
}

export function forgetSession() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* nothing to forget */ }
}

/**
 * Open the console's bridge and wait for the seat's token. Must run inside a tap (a popup
 * opened any later is blocked). Resolves { token, name }; rejects with a sentence.
 */
export function openBridge() {
  return new Promise((resolve, reject) => {
    const url = `${CONSOLE_ORIGIN}/www-bridge?origin=${encodeURIComponent(window.location.origin)}`;
    const w = 460;
    const h = 700;
    const left = Math.max(0, (window.screenX || 0) + ((window.outerWidth || w) - w) / 2);
    const top = Math.max(0, (window.screenY || 0) + ((window.outerHeight || h) - h) / 2);
    // ☠️ NO noopener: the bridge posts back through window.opener, so it must have one.
    const pop = window.open(url, 'dsd-www-bridge', `popup,width=${w},height=${h},left=${Math.round(left)},top=${Math.round(top)}`);
    if (!pop) { reject(new Error('The browser blocked the sign-in window. Allow pop-ups for this site, then try again.')); return; }

    let done = false;
    const finish = (fn) => {
      if (done) return;
      done = true;
      window.removeEventListener('message', onMessage);
      clearInterval(watch);
      fn();
    };
    function onMessage(e) {
      if (e.origin !== CONSOLE_ORIGIN) return;     // only the console
      if (e.source !== pop) return;                // only the window we opened
      const d = e.data;
      if (!d || d.type !== BRIDGE_MESSAGE || typeof d.token !== 'string' || !d.token) return;
      if (!tokenFresh(d.token, 5)) { finish(() => reject(new Error('That sign-in had already run out. Try again.'))); return; }
      finish(() => resolve({ token: d.token, name: typeof d.name === 'string' ? d.name.slice(0, 80) : '' }));
    }
    window.addEventListener('message', onMessage);
    // a window closed without signing in ends the wait
    const watch = setInterval(() => {
      let closed = false;
      try { closed = pop.closed; } catch { closed = false; }
      if (closed) finish(() => reject(new Error('The sign-in window closed before it finished.')));
    }, 600);
  });
}

/** The sentence inside a Convex error, without its request id and stack. */
export function cleanError(raw) {
  const msg = String(raw || '');
  const m = /Uncaught (?:Error|ConvexError):\s*([^\n]+)/.exec(msg);
  if (m) return m[1].trim();
  return msg.replace(/\[[^\]]*\]\s*/g, '').split('\n')[0].trim() || 'The console did not answer.';
}

/**
 * One Convex function over HTTP. `kind` is query | mutation | action, `path` is "module:fn".
 * Resolves the function's value; rejects with a person-readable sentence, or SignInLost.
 */
export async function call(kind, path, args, token) {
  if (!tokenFresh(token, 5)) throw new SignInLost('Your sign-in ran out. Sign in again to keep editing.');
  let res;
  try {
    res = await fetch(`${CONVEX_URL}/api/${kind}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ path, args, format: 'json' }),
    });
  } catch {
    throw new Error('No connection to the console. Check the internet and try again.');
  }
  let body = null;
  try { body = await res.json(); } catch { body = null; }
  if (body && body.status === 'success') return body.value;
  if (res.status === 401 || res.status === 403) throw new SignInLost('Your sign-in ran out. Sign in again to keep editing.');
  const text = body && (body.errorMessage || body.message);
  if (/Not authenticated|Account not active/.test(String(text || ''))) throw new SignInLost('The console no longer knows this sign-in. Sign in again.');
  throw new Error(text ? cleanError(text) : `The console answered ${res.status}.`);
}

/** Bytes in Convex's JSON format ({ $bytes: base64 }), for wwwUpload.storeUpload. */
export function bytesArg(buffer) {
  const u8 = new Uint8Array(buffer);
  let bin = '';
  for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
  return { $bytes: btoa(bin) };
}
