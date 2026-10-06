// The shared chair page. One content file per chair (src/data/chairs/<model>.js) in, the whole
// page out; a section whose data is missing simply does not render, so a chair with no proof
// band or no delivery options still gets a complete page.
//
// No ThemeProvider and no ThemeToggle in here: SiteShell mounts the site's one provider, and
// the theme arrives through the --paper / --ink tokens on <html data-theme>.

import ScrollFx from './ScrollFx';
import { ChairHero, ProofBand, FeatureStory, Comfort, Specs, BoxAndWarranty, ShowroomDoor } from './sections';
import './chair.css';

export default function ChairPage({ chair }) {
  const rootId = `chair-${chair.slug}`;
  return (
    <div id={rootId} className="ch">
      <ChairHero chair={chair} />
      <ProofBand proof={chair.proof} />
      <FeatureStory chair={chair} />
      <Comfort comfort={chair.comfort} />
      <Specs specs={chair.specs} />
      <BoxAndWarranty box={chair.box} warranty={chair.warranty} />
      <ShowroomDoor door={chair.door} />
      <ScrollFx rootId={rootId} />
    </div>
  );
}
