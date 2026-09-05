'use client';

// The marquee speeds, shown and not editable.
//
// ☠️ THIS PANEL IS A WINDOW, NOT A DIAL, AND THAT IS ON PURPOSE. The speeds are
// a JS constant in src/lib/cinema/marquee.js, outside the fence the studio is
// allowed to write inside (src/data/cinema, src/components/cinema-pages,
// public/cinema/uploads). Offering a slider that silently failed to save, or
// that reached outside the fence to succeed, would both be worse than showing
// the number and saying where it lives.
//
// The values are IMPORTED rather than retyped, so this panel cannot drift from
// the source: change the constant and this display changes with it.

import { FFC_MARQUEE_PX_PER_S, NARROW_MAX_PX } from '@/lib/cinema/marquee';

const FAMILIES = [
  {
    key: 'media',
    label: 'Photographs and video',
    what: 'The picture strips: our people, installs, see us in action, the training wall, the parts rows.',
  },
  {
    key: 'text',
    label: 'A line of running text',
    what: 'The trust line under the header, and the news rows.',
  },
];

export default function MarqueeSpeed() {
  return (
    <>
      <h2 className="st-h">Marquee speed</h2>
      <p className="st-hint">
        These are FFC&rsquo;s own speeds, measured on the live site on 2026-09-06, not copied from its source and not
        guessed. Every marquee on this site derives its duration from its own width against these numbers, so a strip
        that gains pictures keeps its speed instead of speeding up. Changing one of these re-times every marquee on the
        site at once.
      </p>

      {FAMILIES.map((f) => (
        <div className="st-dial-group" key={f.key}>
          <div className="st-nest-h">{f.label}</div>
          <p className="st-hint" style={{ margin: '0 0 8px' }}>{f.what}</p>
          <div className="st-speed">
            <div className="st-speed-row">
              <span>Desktop</span>
              <span className="st-speed-v">{FFC_MARQUEE_PX_PER_S[f.key].wide}</span>
              <span className="st-speed-u">px per second</span>
            </div>
            <div className="st-speed-row">
              <span>Phone, {NARROW_MAX_PX}px and under</span>
              <span className="st-speed-v">{FFC_MARQUEE_PX_PER_S[f.key].narrow}</span>
              <span className="st-speed-u">px per second</span>
            </div>
          </div>
        </div>
      ))}

      <p className="st-hint">
        Read only here. To change one, edit <code>FFC_MARQUEE_PX_PER_S</code> in{' '}
        <code>src/lib/cinema/marquee.js</code>. That file is code rather than content, so it sits outside the part of
        the repo this studio is allowed to write to.
      </p>
    </>
  );
}
