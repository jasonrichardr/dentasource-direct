// theme/theme.js — light and dark, resolved in one order: a remembered tap wins, else the
// device's own setting (live, so a phone that flips at sunset flips the cinema with it),
// and a tap overrides and is remembered on that device. The mode is stamped on
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

export function systemTheme() {
  try {
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch (e) {
    return "light";
  }
}

export function resolveTheme() {
  return storedTheme() || systemTheme();
}

export function applyTheme(mode) {
  document.documentElement.setAttribute("data-theme", mode);
}

export function rememberTheme(mode) {
  try { localStorage.setItem(THEME_KEY, mode); } catch (e) {}
}

/** Until they choose, the device keeps the wheel. Returns an unsubscribe. */
export function watchSystemTheme(onChange) {
  let media;
  try {
    media = matchMedia("(prefers-color-scheme: dark)");
  } catch (e) {
    return () => {};
  }
  const handler = (e) => { if (!storedTheme()) onChange(e.matches ? "dark" : "light"); };
  if (media.addEventListener) media.addEventListener("change", handler);
  else media.addListener(handler);
  return () => {
    if (media.removeEventListener) media.removeEventListener("change", handler);
    else media.removeListener(handler);
  };
}

// The pre-paint stamp, as a string so it can be inlined in <head>. Without it the cinema
// paints cream for one frame and then snaps to night.
export const THEME_SCRIPT = `(function(){try{var k='${THEME_KEY}';var v=localStorage.getItem(k);` +
  `if(v!=='light'&&v!=='dark')v=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';` +
  `document.documentElement.setAttribute('data-theme',v);}catch(e){}})();`;
