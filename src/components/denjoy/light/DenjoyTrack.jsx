'use client';

// The Messenger doors on the Denjoy pages are plain server-rendered links. This listens once,
// on the page root, and reports a click on any of them the way the old MessengerButton did.

import { useEffect } from 'react';
import { trackContact } from '@/lib/analytics';

export default function DenjoyTrack({ rootId, name = 'denjoy' }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return undefined;
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="https://m.me/"]');
      // a link that reports its own click carries data-tracked, so it is not counted twice
      if (a && !a.dataset.tracked) trackContact({ channel: 'messenger', content_name: name });
    };
    root.addEventListener('click', onClick);
    return () => root.removeEventListener('click', onClick);
  }, [rootId, name]);
  return null;
}
