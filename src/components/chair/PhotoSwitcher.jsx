'use client';

// One mat, several photographs of the same chair at the same framing, and the glass controls
// that choose between them: the hero's colorways (round swatches) and the delivery options
// (segments). Every option is rendered and stacked; choosing one crossfades it in with a
// small scale settle (chair.css .ch-layer). Transform and opacity only.
//
// The glass tick and the haptic are not called here. The controls carry `lg`, and
// src/components/site/LiquidGlass.jsx already answers every `lg` press with them (pointerdown
// for a mouse, pointerup for touch, where the browser grants the gesture). Calling tick()
// again would double it. The one gap is the keyboard: Enter or Space fires no pointer event,
// so a keyboard click (detail === 0) gets its tick from here.

import { useState } from 'react';
import Image from 'next/image';
import { tick } from '@/lib/glassFx';

export default function PhotoSwitcher({
  options,
  initial,
  mode = 'swatch',
  label,
  note,
  altPrefix = '',
  sizes = '(max-width: 960px) 92vw, 640px',
  preload = false,
  float = false,
  sweep = false,
  className = '',
}) {
  const first = initial || options[0].key;
  const [active, setActive] = useState(first);
  const current = options.find((o) => o.key === active) || options[0];

  const choose = (key, e) => {
    if (e && e.detail === 0) tick();
    setActive(key);
  };

  const layers = options.map((o) => {
    const on = o.key === active;
    return (
      <div key={o.key} className={`ch-layer${on ? ' is-on' : ''}`} aria-hidden={on ? undefined : 'true'}>
        <Image
          src={o.src}
          alt={on ? `${altPrefix} ${o.name}`.trim() : ''}
          fill
          sizes={sizes}
          quality={85}
          {...(preload && o.key === first ? { preload: true, fetchPriority: 'high' } : {})}
        />
      </div>
    );
  });

  return (
    <div className={className}>
      <div className="ch-mat ch-switch-mat">
        {float ? <div className="ch-float">{layers}</div> : layers}
        {sweep ? <span className="ch-sweep" aria-hidden="true" /> : null}
      </div>
      <div className="ch-controls">
        {mode === 'swatch' ? (
          <div className="ch-controls-meta">
            <p className="ch-controls-label">{label}</p>
            <p className="ch-controls-name" aria-live="polite">{current.name}</p>
            {note ? <p className="ch-controls-note">{note}</p> : null}
          </div>
        ) : null}
        <div className={mode === 'swatch' ? 'ch-swatches' : 'ch-segments'} role="group" aria-label={label}>
          {options.map((o) => {
            const on = o.key === active;
            return mode === 'swatch' ? (
              <button
                key={o.key}
                type="button"
                className="lg ch-swatch"
                aria-pressed={on}
                aria-label={o.name}
                title={o.name}
                onClick={(e) => choose(o.key, e)}
              >
                <span className="ch-swatch-dot" style={{ '--c': o.swatch }} />
              </button>
            ) : (
              <button
                key={o.key}
                type="button"
                className={`lg lg-sm${on ? ' lg-primary' : ''}`}
                aria-pressed={on}
                onClick={(e) => choose(o.key, e)}
              >
                {o.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
