// Thin, safe analytics wrappers. They no-op if GA / Meta Pixel aren't loaded
// (e.g. the env IDs aren't set yet), so calling them never throws and never
// blocks the UI. Fire these at real conversion moments only.

function trackEvent(name, detail = {}) {
  try {
    if (typeof window === 'undefined') return;
    // Meta Pixel
    if (typeof window.fbq === 'function') window.fbq('track', name, detail);
    // GA4
    if (typeof window.gtag === 'function') window.gtag('event', name.toLowerCase(), detail);
  } catch {
    /* analytics must never break the app */
  }
}

// A dental clinic submitted the contact form (the primary conversion).
export function trackLead(detail = {}) {
  trackEvent('Lead', detail);
}

// A visitor clicked through to Messenger / a contact channel.
export function trackContact(detail = {}) {
  trackEvent('Contact', detail);
}
