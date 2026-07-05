'use client';

/* ─────────────────────────────────────────────────────────────────────
   FOCUS BAND — the news articles' focus-music player, brought onto the
   A1 Pro product page (Jarich's ask: same music shuffle + "N min read").
   A slim light utility strip sitting between the hero and the manifesto:
   it shows the honest reading time for the page and lets the reader put on
   the ambient focus-lounge (shuffle included).

   FocusMusic is shared verbatim with /news/[slug]; its CSS module is
   LIGHT-designed (bone bar, grey controls, white floating dock), so we host
   it on a bone band to read native against the rideradian light sections —
   not a pasted widget. Mounting it once also gives the fixed bottom-right
   mini-dock that appears when this bar scrolls out of view.
   ───────────────────────────────────────────────────────────────────── */

import FocusMusic from '@/app/news/[slug]/FocusMusic';
import { readingMinutes } from '../content';

export default function FocusBand() {
  return (
    <section className="relative border-t border-[var(--line-ink)] bg-[var(--bone)] py-7 text-[var(--ink)] md:py-8">
      {/* The player's bar carries a 1.4rem top margin for its article context;
          we zero it here via a structural selector (no edit to the shared
          component) so the band's own padding sets the vertical rhythm. The
          bar self-centers (width: fit-content + auto side margins). */}
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 [&>div:first-child]:!mt-0">
        <FocusMusic minutes={readingMinutes} />
      </div>
    </section>
  );
}
