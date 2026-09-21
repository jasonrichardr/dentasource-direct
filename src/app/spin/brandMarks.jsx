// Inline brand marks so nothing loads from a third party on the booth Wi-Fi.
// Simplified glyphs, sized by the parent, coloured by currentColor unless the mark carries its own brand colour.

export function FacebookMark({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#1877f2" />
      <path d="M13.4 19.5v-6h2l.3-2.4h-2.3V9.6c0-.7.2-1.2 1.2-1.2h1.2V6.3c-.2 0-1-.1-1.8-.1-1.8 0-3 1.1-3 3.1v1.8H9v2.4h2v6h2.4z" fill="#fff" />
    </svg>
  );
}

export function InstagramMark({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id="igg" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#f9ce34" /><stop offset="0.5" stopColor="#ee2a7b" /><stop offset="1" stopColor="#6228d7" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#igg)" />
      <rect x="6" y="6" width="12" height="12" rx="3.5" fill="none" stroke="#fff" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3" fill="none" stroke="#fff" strokeWidth="1.8" />
      <circle cx="15.6" cy="8.4" r="1" fill="#fff" />
    </svg>
  );
}

export function TikTokMark({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <rect width="24" height="24" rx="6" fill="#000" />
      <path d="M13.2 5h2.3c.2 1.6 1.2 2.8 2.9 3v2.3c-1.1 0-2.1-.3-2.9-.9v4.9a3.9 3.9 0 1 1-3.9-3.9c.2 0 .5 0 .7.1v2.4a1.6 1.6 0 1 0 .9 1.4V5z" fill="#25f4ee" transform="translate(-.5 -.4)" />
      <path d="M13.2 5h2.3c.2 1.6 1.2 2.8 2.9 3v2.3c-1.1 0-2.1-.3-2.9-.9v4.9a3.9 3.9 0 1 1-3.9-3.9c.2 0 .5 0 .7.1v2.4a1.6 1.6 0 1 0 .9 1.4V5z" fill="#fe2c55" transform="translate(.5 .4)" />
      <path d="M13.2 5h2.3c.2 1.6 1.2 2.8 2.9 3v2.3c-1.1 0-2.1-.3-2.9-.9v4.9a3.9 3.9 0 1 1-3.9-3.9c.2 0 .5 0 .7.1v2.4a1.6 1.6 0 1 0 .9 1.4V5z" fill="#fff" />
    </svg>
  );
}

export function GoogleMapsMark({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M12 22s-7-7.6-7-12.4A7 7 0 0 1 19 9.6C19 14.4 12 22 12 22z" fill="#ea4335" />
      <path d="M12 22s-7-7.6-7-12.4c0-1.6.5-3 1.4-4.2L12 12z" fill="#4285f4" />
      <path d="M6.4 5.4A7 7 0 0 1 12 2.6l-3.5 4.7z" fill="#fbbc04" />
      <path d="M12 2.6c2 0 3.8.8 5 2.2L12 12 8.5 7.3z" fill="#34a853" />
      <circle cx="12" cy="9.6" r="2.6" fill="#fff" />
    </svg>
  );
}

export const MARK = { facebook: FacebookMark, instagram: InstagramMark, tiktok: TikTokMark, google: GoogleMapsMark };

export function AppleMark({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.8 3-.8s1.8.8 3 .7c1.3 0 2-1.1 2.8-2.2.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.8zM14.1 5.8c.6-.8 1.1-1.9.9-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.1-.5 2.8-1.3z" />
    </svg>
  );
}

export function AndroidMark({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="#3ddc84">
      <path d="M17.5 10.3H6.5v7.2c0 .7.5 1.2 1.2 1.2h1v2.6c0 .7.5 1.2 1.2 1.2s1.2-.5 1.2-1.2v-2.6h1.8v2.6c0 .7.5 1.2 1.2 1.2s1.2-.5 1.2-1.2v-2.6h1c.7 0 1.2-.5 1.2-1.2v-7.2zM3.9 10.3c-.7 0-1.2.5-1.2 1.2v5.1c0 .7.5 1.2 1.2 1.2s1.2-.5 1.2-1.2v-5.1c0-.7-.5-1.2-1.2-1.2zm16.2 0c-.7 0-1.2.5-1.2 1.2v5.1c0 .7.5 1.2 1.2 1.2s1.2-.5 1.2-1.2v-5.1c0-.7-.5-1.2-1.2-1.2zM15.6 4.3l1-1.6c.1-.1 0-.3-.1-.3-.1-.1-.3 0-.3.1l-1 1.7c-.9-.4-2-.7-3.2-.7s-2.3.2-3.2.7l-1-1.7c-.1-.1-.2-.2-.3-.1-.1 0-.2.2-.1.3l1 1.6C6.6 5.2 5.5 6.9 5.5 8.9v.6h13v-.6c0-2-1.2-3.7-2.9-4.6zM9.3 7.2c-.4 0-.7-.3-.7-.7s.3-.7.7-.7.7.3.7.7-.3.7-.7.7zm5.4 0c-.4 0-.7-.3-.7-.7s.3-.7.7-.7.7.3.7.7-.3.7-.7.7z" />
    </svg>
  );
}

export function WindowsMark({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="#00a4ef">
      <path d="M3 5.5l7.3-1v7H3zM11.3 4.3L21 3v8.5h-9.7zM3 12.5h7.3v7L3 18.5zM11.3 12.5H21V21l-9.7-1.3z" />
    </svg>
  );
}

/** Messenger: the lightning bolt in a gradient bubble. */
export function MessengerMark({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <defs><linearGradient id="msgr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#00b2ff" /><stop offset="1" stopColor="#006aff" /></linearGradient></defs>
      <path fill="url(#msgr)" d="M12 2C6.5 2 2 6.1 2 11.3c0 2.9 1.4 5.5 3.7 7.2V22l3.4-1.9c.9.3 1.9.4 2.9.4 5.5 0 10-4.1 10-9.3S17.5 2 12 2z" />
      <path fill="#fff" d="M6.4 14.2l3.2-5.1a1 1 0 0 1 1.5-.3l2.6 1.9 3.3-1.9a.5.5 0 0 1 .7.7l-3.2 5.1a1 1 0 0 1-1.5.3l-2.6-1.9-3.3 1.9a.5.5 0 0 1-.7-.7z" />
    </svg>
  );
}
