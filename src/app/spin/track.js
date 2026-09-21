// Umami page events for /spin. Guarded on every hop: the script is blocked by
// plenty of phones, and a missing tracker must never break a conversion path.
export function track(name) {
  try { window.umami?.track?.(name); } catch { /* ignore */ }
}
