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

export function applyTheme(mode) {
  document.documentElement.setAttribute("data-theme", mode);
}

export function rememberTheme(mode) {
  try { localStorage.setItem(THEME_KEY, mode); } catch (e) {}
}

// The pre-paint stamp, as a string so it can be inlined in <head>. Without it the cinema
// paints cream for one frame and then snaps to night. Same rule as resolveTheme: a
// remembered choice, else dark.
//
// ONE template literal, never a concatenation of several. Built as `a` + `b` + `c` this
// reached the page as a spliced ruin: `var k='dsd:theme` followed by fragments of the
// other two literals, which is a syntax error, which means no stamp and a light flash on
// every load. Node printed the correct 218 characters from the same source, so the splice
// happens when the bundler folds the pieces. One literal, one string, nothing to fold.
export const THEME_SCRIPT = `(function(){var v='${DEFAULT_THEME}';try{if(localStorage.getItem('${THEME_KEY}')==='light')v='light';}catch(e){}document.documentElement.setAttribute('data-theme',v);})();`;
