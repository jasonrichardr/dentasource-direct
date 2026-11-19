// The shared chair page. One content file per chair (src/data/chairs/<model>.js) in, the whole
// page out; a section whose data is missing simply does not render, so a chair with no proof
// band or no delivery options still gets a complete page.
//
// ☠️ LIGHT ONLY, AND NO SKY (Jarich, 2026-11-19). The chair routes are locked to the light
// register in src/cinema/theme/theme.js (LIGHT_ONLY_ROUTES), and this page mounts no canvas of
// any kind: no night sky, no constellation lines, no particles. A white ground, the chair,
// the facts.

import ScrollFx from './ScrollFx';
import {
  ChairHero, LocalNav, Glance, ProofBand, Fit, FeatureStory, Comfort, Specs, BoxAndWarranty,
  Stories, Inspection, ShowroomDoor,
} from './sections';
import { clinicProof } from '@/lib/chairs/clinicProof';
import './chair.css';

export default function ChairPage({ chair }) {
  const rootId = `chair-${chair.slug}`;
  const proof = clinicProof(chair.slug);
  const stories = proof?.stories;

  // The local bar lists only the sections this chair actually has.
  const links = [
    chair.features && { label: 'Features', href: '#features' },
    chair.comfort && { label: 'Comfort', href: '#comfort' },
    chair.specs && { label: 'Specifications', href: '#specs' },
    chair.box && { label: 'In the box', href: '#in-the-box' },
    chair.warranty && { label: 'Warranty', href: '#warranty' },
    stories?.items?.length && { label: stories.kind === 'installs' ? 'In clinics' : 'Stories', href: '#in-clinics' },
    chair.door && { label: 'Showroom', href: '#showroom' },
  ].filter(Boolean);

  return (
    <div id={rootId} className="ch ch-page">
      <ChairHero chair={chair} />
      <LocalNav chair={chair} links={links} />
      <Glance glance={chair.glance} />
      <ProofBand proof={chair.proof} />
      <Fit fit={chair.fit} />
      <FeatureStory chair={chair} />
      <Comfort comfort={chair.comfort} />
      <Specs specs={chair.specs} />
      <BoxAndWarranty box={chair.box} warranty={chair.warranty} />
      <Stories stories={stories} />
      <Inspection inspection={proof?.inspection} />
      <ShowroomDoor door={chair.door} />
      <ScrollFx rootId={rootId} />
    </div>
  );
}
