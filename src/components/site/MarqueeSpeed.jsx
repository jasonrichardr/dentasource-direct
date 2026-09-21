'use client';

// Every marquee on the site, held at FFC's measured speed.
//
// One mount, in SiteShell, rather than a hook in each of the five panels that own a track.
// The panels do not agree on a speed, they do not need to know one, and a per panel hook
// would be five places to keep in step the next time a ruling changes the number. The
// speed itself lives in src/lib/cinema/marquee.js and is the only thing to edit.
//
// Two observers because FFC runs two speeds and we map like for like: the media strips
// take the strip speed, the one line of running text takes the text speed.

import { useEffect } from 'react';
import { observeMarquees } from '@/lib/cinema/marquee';

export default function MarqueeSpeed() {
  useEffect(() => {
    const stopMedia = observeMarquees(document.body, 'media', '.dsd-strip-track, .dsd-news-track');
    const stopText = observeMarquees(document.body, 'text', '.dsd-trust-track');
    return () => { stopMedia(); stopText(); };
  }, []);
  return null;
}
