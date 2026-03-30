'use client';

import { useEffect, useRef, useState } from 'react';

export default function PDAArticlePage() {
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState(10000);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;

        // Hide the HTML article's own nav and footer (site has its own)
        const nav = doc.querySelector('.nav');
        if (nav) nav.style.display = 'none';
        const footer = doc.querySelector('.site-footer');
        if (footer) footer.style.display = 'none';

        const updateHeight = () => {
          const h = doc.documentElement.scrollHeight;
          setIframeHeight(h);
        };

        updateHeight();

        const observer = new MutationObserver(updateHeight);
        observer.observe(doc.body, { childList: true, subtree: true, attributes: true });

        doc.querySelectorAll('img').forEach(img => {
          img.addEventListener('load', updateHeight);
        });

        let count = 0;
        const interval = setInterval(() => {
          updateHeight();
          count++;
          if (count > 10) clearInterval(interval);
        }, 500);

        return () => {
          observer.disconnect();
          clearInterval(interval);
        };
      } catch (e) {
        setIframeHeight(12000);
      }
    };

    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, []);

  return (
    <main style={{ paddingTop: 90, minHeight: '100vh', background: '#faf8f5', overflowX: 'hidden', maxWidth: '100vw' }}>
      <div style={{ overflow: 'hidden', width: '100%', maxWidth: '100vw' }}>
      <iframe
        ref={iframeRef}
        src="/news-pda-2026.html"
        style={{
          width: '100%',
          maxWidth: '100vw',
          height: iframeHeight,
          border: 'none',
          overflow: 'hidden',
          display: 'block',
        }}
        scrolling="no"
        title="PDA Under Dr. Niñal: How the Association Is Empowering Filipino Dentists in 2026"
      />
      </div>
    </main>
  );
}
