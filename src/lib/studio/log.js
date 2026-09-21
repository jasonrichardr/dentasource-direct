// ── THE STUDIO'S OWN RECORD OF WHAT IT CHANGED ─────────────────────────────
//
// ☠️ A RECORD THAT CAN BE INCOMPLETE WITHOUT SAYING SO IS WORSE THAN NO RECORD,
// because a reader counts what is in it rather than what should have been. This
// file's three callers each had their own `catch {}` with a comment saying the
// log must never block a write — right policy, wrong silence: the write went
// through, the line vanished, and the log still looked like a full account.
//
// The policy is unchanged. A failed append never fails the edit. It now returns
// the failure so the caller can put it on screen, which is the difference
// between "nothing happened" and "nothing was written down".

import { appendFile } from 'node:fs/promises';

import { LOG_FILE, absolute } from './registry';

/** @returns {{ok: true} | {ok: false, error: string}} — never throws. */
export async function logLine(text) {
  try {
    await appendFile(absolute(LOG_FILE), `${new Date().toISOString()}  ${text}\n`, 'utf8');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
