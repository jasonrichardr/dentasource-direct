'use client';

/* ROSON A1 Pro — rideradian-DNA landing (ARTICLE-PANEL edition).
   Jarich's direction: use the clean, mobile-perfect ROSON deck panels from the
   news guide, shown WHOLE (never our cropped sub-panels), and bring back the
   auto-moving strip he loves. Kept: the color-morph hero and the "You design
   one" statement (its button → the color library).
   Flow (theme flips punctuate — no more than two of a kind adjacent):
     light hero → dark statement → dark FEATURE STRIP (moving) → LIGHT gallery
     (panels whole) → dark COLOR STRIP (moving) → LIGHT configurations →
     dark specs → dark showroom.
   The `.radian` wrapper provides the scoped tokens + fonts. */

import HeroColorMorph from './sections/HeroColorMorph';
import FocusBand from './sections/FocusBand';
import StatementInterlude from './sections/StatementInterlude';
import FeatureStrip from './sections/FeatureStrip';
import FeatureGallery from './sections/FeatureGallery';
import ColorStrip from './sections/ColorStrip';
import ConfigurationsSection from './sections/ConfigurationsSection';
import TechSpecs from './sections/TechSpecs';
import ClosingShowroom from './sections/ClosingShowroom';

export default function A1RadianLanding() {
  return (
    <div className="radian">
      <HeroColorMorph />
      <FocusBand />
      <StatementInterlude />
      <FeatureStrip />
      <FeatureGallery />
      <ColorStrip />
      <ConfigurationsSection />
      <TechSpecs />
      <ClosingShowroom />
    </div>
  );
}
