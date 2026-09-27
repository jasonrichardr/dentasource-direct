'use client';

/* ROSON A1 Pro — rideradian-DNA detail sections, under the product cinema.
   2026-09-27 length pass (Jarich: "too long to scroll"): the page ran 25
   viewport heights on a phone. The cinema above already carries the hero,
   the audience, the feature list, the colors, the inspection and the door, so
   this block only adds what the cinema cannot: the ROSON deck cards, the
   color library, the full spec sheet and the one call to action.
   Flow: bone focus band → bone detail row (swipe) → ink color strip (moving)
   → bone spec accordion → ink showroom close.
   The `.radian` wrapper provides the scoped tokens + fonts. */

import FocusBand from './sections/FocusBand';
import DetailScroller from './sections/DetailScroller';
import ColorStrip from './sections/ColorStrip';
import SpecsAccordion from './sections/SpecsAccordion';
import ClosingShowroom from './sections/ClosingShowroom';

export default function A1RadianLanding() {
  return (
    <div className="radian">
      <FocusBand />
      <DetailScroller />
      <ColorStrip />
      <SpecsAccordion />
      <ClosingShowroom />
    </div>
  );
}
