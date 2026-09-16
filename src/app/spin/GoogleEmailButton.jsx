'use client';

import { useEffect, useRef, useState } from 'react';

// "Use my Google email": Google Identity Services one-tap style button that only
// hands us the ID token; we read name + email from it and fill the form. No
// account is created anywhere. Renders nothing when the client id is missing or
// Google refuses the origin (it must be authorized in Google Cloud).
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function decodeJwtPayload(jwt) {
  try {
    const part = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(atob(part).split('').map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`).join('')));
  } catch { return null; }
}

export default function GoogleEmailButton({ onIdentity }) {
  const host = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const cb = useRef(onIdentity);
  cb.current = onIdentity;

  useEffect(() => {
    if (!CLIENT_ID || typeof window === 'undefined') return;
    let cancelled = false;
    const init = () => {
      if (cancelled || !window.google?.accounts?.id || !host.current) return;
      try {
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (resp) => {
            const p = decodeJwtPayload(resp?.credential || '');
            if (p?.email) cb.current?.({ email: p.email, name: p.name || '' });
          },
          auto_select: false,
          itp_support: true,
        });
        window.google.accounts.id.renderButton(host.current, { theme: 'filled_black', size: 'large', shape: 'pill', text: 'continue_with', width: 300 });
        setReady(true);
      } catch { setFailed(true); }
    };
    if (window.google?.accounts?.id) { init(); return; }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true; s.defer = true;
    s.onload = init;
    s.onerror = () => setFailed(true);
    document.head.appendChild(s);
    return () => { cancelled = true; };
  }, []);

  if (!CLIENT_ID || failed) return null;
  return (
    <div className={`google-btn ${ready ? '' : 'pending'}`}>
      <div ref={host} />
      {ready ? <span className="google-hint">Fills your name and email. Nothing else.</span> : null}
    </div>
  );
}
