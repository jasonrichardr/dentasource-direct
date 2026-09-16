'use client';

import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

/**
 * Rear-camera QR scanner for the booth desk. Calls onToken(text) once per
 * distinct QR (re-armed after `cooldownMs`). Pure client, no uploads.
 */
export default function QrScanner({ onToken, cooldownMs = 2500, paused = false }) {
  const video = useRef(null);
  const canvas = useRef(null);
  const [error, setError] = useState('');
  const [active, setActive] = useState(false);
  const last = useRef({ text: '', at: 0 });
  const cbRef = useRef(onToken); cbRef.current = onToken;

  useEffect(() => {
    let stream; let raf = 0; let stopped = false;
    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
        if (stopped) { stream.getTracks().forEach((t) => t.stop()); return; }
        const v = video.current; v.srcObject = stream; v.setAttribute('playsinline', 'true'); await v.play();
        setActive(true);
        const c = canvas.current; const ctx = c.getContext('2d', { willReadFrequently: true });
        const tick = () => {
          if (stopped) return;
          if (!paused && v.readyState === 4) {
            const w = Math.min(640, v.videoWidth); const h = Math.round(w * (v.videoHeight / v.videoWidth));
            if (w && h) {
              c.width = w; c.height = h; ctx.drawImage(v, 0, 0, w, h);
              const img = ctx.getImageData(0, 0, w, h);
              const q = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
              if (q?.data) {
                const now = Date.now();
                if (q.data !== last.current.text || now - last.current.at > cooldownMs) {
                  last.current = { text: q.data, at: now };
                  cbRef.current?.(q.data);
                }
              }
            }
          }
          raf = window.setTimeout(tick, 140);
        };
        tick();
      } catch (e) {
        setError(e?.name === 'NotAllowedError' ? 'Camera permission was denied. Allow the camera for this site and try again.' : 'Could not open the camera on this device.');
      }
    };
    start();
    return () => { stopped = true; window.clearTimeout(raf); stream?.getTracks().forEach((t) => t.stop()); };
  }, [cooldownMs, paused]);

  return (
    <div className="scanner">
      <video ref={video} className="scanner-video" muted playsInline />
      <canvas ref={canvas} hidden />
      <div className="scanner-frame" aria-hidden />
      {!active && !error ? <p className="scanner-msg">Opening camera</p> : null}
      {error ? <p className="scanner-msg error">{error}</p> : null}
    </div>
  );
}
