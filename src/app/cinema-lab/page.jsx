import CinemaPage from '@/cinema/CinemaPage';
import NightSky from '@/cinema/NightSky';

export const metadata = {
  title: 'Cinema lab',
  robots: { index: false, follow: false },
};

// A three beat proof arc: the round mark forms from particles, becomes the red heart,
// then a real product photo forms a chair. A beat may name its image as `src` or as the
// first image in a `media` array, which is the shape the content configs in
// builds/dsd-site-overhaul/content/ already use.
const BEATS = [
  {
    key: 'hero',
    kind: 'lockup',
    src: '/cinema/brand/dsd-round.png',
    // the round badge only: the source PNG bakes its own hairline wordmark under the
    // mark, and hairline type samples muddy at particle density, so the words are
    // re-rendered from canvas type instead (see the lockup builder)
    crop: { sx: 86, sy: 41, sw: 308, sh: 300 },
    text: 'DentaSource Direct',
    lockup: { markBox: 3.1, markY: 2.35, wordCenterY: -2.0 },
  },
  {
    key: 'heart',
    kind: 'heart',
  },
  {
    // A white ground studio shot with no alpha, so the sampler keys on brightness:
    // everything darker than 0.72 is the unit, everything above it is the room. The
    // crop drops the floor slab and the backdrop panels.
    key: 'chair',
    kind: 'image',
    media: ['/images/products/a1-pro/hero.jpg'],
    mode: 'dark',
    threshold: 0.72,
    crop: { x: 0.15, y: 0.02, w: 0.66, h: 0.74 },
    boxW: 6.4,
    boxH: 3.8,
    yOffset: 1.5,
    copyLow: true,
    camera: { angle: 0.05, dist: 16.0 },
  },
];

const PANELS = [
  <div className="cinema-copy" key="hero">
    <h1 className="cinema-head">Your growth partner in dentistry</h1>
    <p className="cinema-sub">
      Equipment, installation and after sales care for clinics across the Philippines.
    </p>
  </div>,
  <div className="cinema-copy" key="heart">
    <h2 className="cinema-head">Hundreds of dental chairs</h2>
    <p className="cinema-sub">in clinics across the Philippines</p>
  </div>,
  <div className="cinema-copy" key="chair">
    <div className="cinema-kicker">The unit</div>
    <h2 className="cinema-head">ROSON A1 Pro</h2>
    <p className="cinema-sub">
      Uncrated, tested and signed off in our warehouse, then assembled in the operatory
      by our own technicians.
    </p>
  </div>,
];

// SiteShell in the root layout owns the one ThemeProvider and the one Room, and the
// navbar owns the toggle, so this page mounts only the cinema itself. The <main> matters:
// it is what the room hides while it holds the screen, restoring only the stars behind it.
export default function CinemaLabPage() {
  return (
    <main>
      <NightSky />
      <CinemaPage beats={BEATS} panels={PANELS} />
    </main>
  );
}
