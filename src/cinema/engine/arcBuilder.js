// engine/arcBuilder.js — the arc, built without blocking the page.
//
// ☠️ WHY THIS EXISTS. Building all fifteen formations at boot cost 2,092ms of scripting
// on the mobile Lighthouse run and took Total Blocking Time to 1,610ms, which is most of
// a failed performance score. None of it had to happen before the first frame: a reader
// looking at beat 0 cannot see beat 9, and by the time they scroll there the work is
// long done.
//
// So the opening pair is built synchronously, because the engine cannot draw without a
// state and a target, and everything after it is built in slices under a time budget.
// The budget is what matters rather than the slicing: a task only counts toward blocking
// time past 50ms, so each pass stops at BUDGET_MS and hands the thread back. Nothing here
// is faster than it was; it is the same work, spent where nobody is waiting on it.
//
// requestIdleCallback is the right scheduler for this and Safari still does not have it,
// so a timeout stands in. The timeout path is slower to drain but never blocks either.

import { createBeatJob } from '../formations/index.js';

const BUDGET_MS = 8;          // well inside a frame, and far inside the 50ms blocking bar
const SYNC_BEATS = 2;         // the engine needs a state AND a target to draw at all

const schedule = typeof requestIdleCallback === 'function'
  ? (fn) => requestIdleCallback(fn, { timeout: 200 })
  : (fn) => setTimeout(() => fn({ timeRemaining: () => 0 }), 16);
const unschedule = typeof cancelIdleCallback === 'function'
  ? (id) => cancelIdleCallback(id)
  : (id) => clearTimeout(id);

/**
 * Builds `beats` into formations. Returns the opening pair immediately and calls
 * onFormation(index, positions, isText) for each later beat as it lands.
 */
export function buildArcProgressive(N, beats, images, { onFormation, onDone } = {}) {
  const jobs = beats.map((beat) => createBeatJob(N, beat, images));
  const formations = new Array(beats.length).fill(null);

  const finish = (i) => {
    formations[i] = { positions: jobs[i].positions, isText: jobs[i].isText };
    return formations[i];
  };

  // the opening pair, synchronously: there is no frame to draw without them
  const syncCount = Math.min(SYNC_BEATS, beats.length);
  for (let i = 0; i < syncCount; i++) {
    while (!jobs[i].work());
    finish(i);
  }

  let next = syncCount;
  let handle = 0;
  let stopped = false;

  const pump = () => {
    handle = 0;
    if (stopped) return;
    const until = performance.now() + BUDGET_MS;
    // spend the budget, then yield even if mid formation. A slice of the heart is a
    // perfectly good place to stop; it resumes exactly where it left off.
    while (next < jobs.length && performance.now() < until) {
      if (jobs[next].work()) {
        const f = finish(next);
        onFormation?.(next, f.positions, f.isText);
        next += 1;
      }
    }
    if (next < jobs.length) handle = schedule(pump);
    else onDone?.();
  };

  if (next < jobs.length) handle = schedule(pump);
  else onDone?.();

  return {
    formations,
    get built() { return next; },
    stop() {
      stopped = true;
      if (handle) unschedule(handle);
      handle = 0;
    },
  };
}
