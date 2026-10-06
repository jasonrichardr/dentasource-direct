'use client';

// lib/cinema/moonEdit.js — the one seam between the home page and its hidden editor.
//
// Jarich, 2026-10-06: "when i press the moon 7 times i can login and simply click the photos
// i want removed, upload a new photo interchange them swap the timing". The editor itself is
// a lazy chunk (src/components/moon-editor/), fetched only after the moon gate opens, so a
// visitor downloads none of it. What every visitor DOES carry is this file: a slot that is
// null until the editor fills it with the component that draws an editable strip, and the
// hook the panels read it with.
//
// ☠️ THE SERVER SNAPSHOT IS ALWAYS null, and so is the first client render. That is what
// keeps the home page's markup identical on the server and the client for every visitor
// (a React #418 on this page was fixed on 2026-10-06 by keeping markup path independent;
// this must not reintroduce a difference).

import { useSyncExternalStore } from 'react';

let editor = null;
const listeners = new Set();

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Open (an object carrying `Strip`) or close (null) edit mode on every panel at once. */
export function setMoonEditor(next) {
  editor = next || null;
  for (const fn of listeners) fn();
}

/** The open editor, or null. Null on the server and for every visitor. */
export function useMoonEditor() {
  return useSyncExternalStore(subscribe, () => editor, () => null);
}
