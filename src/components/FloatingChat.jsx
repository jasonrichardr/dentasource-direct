'use client';

import { useEffect } from 'react';

const TAWK_PROPERTY_ID = '69c111a6f5fa6e1c381d19b3';
const TAWK_WIDGET_ID = '1jkd2pt9u';

export default function FloatingChat() {
  useEffect(() => {
    // Prevent double-loading in React strict mode
    if (document.getElementById('tawk-script')) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement('script');
    script.id = 'tawk-script';
    script.async = true;
    script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.body.appendChild(script);
  }, []);

  return null;
}
