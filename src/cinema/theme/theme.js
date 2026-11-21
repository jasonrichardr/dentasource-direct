// theme/theme.js — DARK IS THE DEFAULT. The cinema is a night sky with a moon in it, so
// that is what a first visit meets; light is opt-in through the toggle and remembered on
// that device. A remembered tap is the only thing that overrides the default, which is
// why prefers-color-scheme is not consulted at all: a phone in light mode would otherwise
// open the cinema in daylight and never show the stars. The mode is stamped on
// <html data-theme>, which is what every cinema token keys off: one attribute, the whole
// page turns.

export const THEME_KEY = "dsd:theme";

export function storedTheme() {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch (e) {
    return null;               // private mode / blocked storage — never throw
  }
}

export const DEFAULT_THEME = "dark";

export function resolveTheme() {
  return storedTheme() || DEFAULT_THEME;
}

// ☠️ THE CHAIR PAGES ARE LIGHT ONLY (Jarich, 2026-11-19: "make it light themed here not dark
// all of them dental chairs as well"). A product page is a showroom: white ground, the chair,
// the facts. These routes ignore the remembered theme and the default, never mount the sky,
// and hide the switch. The list is spelled out a second time inside THEME_SCRIPT below, for
// the first paint; scripts/check-theme-script.mjs fails the build if the two ever disagree.
export const LIGHT_ONLY_ROUTES = [
  "/dentalchairs", "/a3", "/a3s", "/a3l", "/a1-pro", "/n2-pro", "/n2-plus", "/n1", "/s9", "/s6", "/s3",
  // The Denjoy pages joined them on 2026-11-21: the hub and all twelve instruments.
  "/denjoy", "/denjoy/meta-endo-pro-i", "/denjoy/meet-endo", "/denjoy/meta-endo", "/denjoy/free-pex", "/denjoy/i-pexo", "/denjoy/ix7",
  "/denjoy/ix6", "/denjoy/i-moto", "/denjoy/iue1", "/denjoy/icure", "/denjoy/ipack", "/denjoy/meta-pack",
];

export function isLightOnly(pathname) {
  if (!pathname) return false;
  const path = pathname.replace(/[/]+$/, "");
  return LIGHT_ONLY_ROUTES.includes(path);
}

// What a route should show: light on the light-only routes, otherwise the remembered tap or
// the default.
export function themeFor(pathname) {
  return isLightOnly(pathname) ? "light" : resolveTheme();
}

export function applyTheme(mode) {
  document.documentElement.setAttribute("data-theme", mode);
}

export function rememberTheme(mode) {
  try { localStorage.setItem(THEME_KEY, mode); } catch (e) {}
}

// The pre-paint stamp, inlined in <head>. Without it the page paints the wrong theme for
// one frame and then snaps, which is the flash this whole file exists to prevent.
//
// ☠️ ONE PLAIN STRING LITERAL. No template literal, no `+` concatenation, no interpolation.
// Written as `a` + `b` + `c` this reached the browser spliced into nonsense:
//     (function(){try{var k='dsd:themedocument.documentElement.setAttribute('data-theme','dark');}})();
// which throws `Unexpected identifier 'data'`, so data-theme is never stamped and every
// page flashes. Node printed the correct string from that same source, so the splice
// happens when the bundler folds the pieces, and the only safe shape is a literal with
// nothing to fold. The outer quotes are double so every quote inside can be single.
//
// The key and the default are spelled out here rather than interpolated, for the same
// reason. THEME_KEY and DEFAULT_THEME above are the source of truth for the JS side;
// scripts/check-theme-script.mjs fails the build if this literal drifts from them or if
// what reaches the built HTML is not this exact script.
export const THEME_SCRIPT =
  "(function(){var v='dark';try{if(localStorage.getItem('dsd:theme')==='light')v='light';}catch(e){}if('|/dentalchairs|/a3|/a3s|/a3l|/a1-pro|/n2-pro|/n2-plus|/n1|/s9|/s6|/s3|/denjoy|/denjoy/meta-endo-pro-i|/denjoy/meet-endo|/denjoy/meta-endo|/denjoy/free-pex|/denjoy/i-pexo|/denjoy/ix7|/denjoy/ix6|/denjoy/i-moto|/denjoy/iue1|/denjoy/icure|/denjoy/ipack|/denjoy/meta-pack|'.indexOf('|'+location.pathname.replace(/[/]+$/,'')+'|')!==-1)v='light';document.documentElement.setAttribute('data-theme',v);})();";
