// lib/cinema/visible.js — the one place a hidden entry is dropped.
//
// The studio (a17a40f) lets Jarich hide any entry in any manifest it edits. Hiding writes
// `hidden: true` onto that entry and unhiding DELETES the key, so the flag is only ever
// absent or exactly true; the entry keeps its place in the file either way, which is the
// point. Hiding a beat is not deleting it, and a hidden beat has to be able to come back
// with its copy, its media and its position intact.
//
// ☠️ A FLAG NOTHING READS IS A CONTROL WIRED TO NOTHING. That is not a hypothetical here:
// installs.json spent a round being edited by a studio that could not change a pixel,
// because the page read a copy of the list from somewhere else (6be5842). So this file is
// deliberately the ONLY filter, every consumer calls it, and scripts/check-hidden-filter.mjs
// fails the build if a manifest gets read without it.
//
// It runs at MODULE SCOPE in each consumer, not per render: the manifests are static
// imports, so the filtered list is computed once when the bundle is evaluated. That is
// what makes the hiding reach the arc's beat COUNT and the engine's formation list, not
// just the panel that would have drawn the beat. A filter applied later, inside a
// component, would leave the engine still holding a slot for a beat nobody can see.

/**
 * The entries a visitor is allowed to see, in file order.
 *
 * Defensive about shape on purpose: these lists come out of hand edited JSON and a
 * manifest that is mid-reshape upstream should degrade to an empty strip rather than
 * throw the whole arc off the page.
 */
export function visible(list) {
  if (!Array.isArray(list)) return [];
  return list.filter((entry) => !entry || entry.hidden !== true);
}

/** How many of a list are hidden. Used by the check script and useful in a console. */
export function hiddenCount(list) {
  return Array.isArray(list) ? list.length - visible(list).length : 0;
}
