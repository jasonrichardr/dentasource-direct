import CinemaPage from '@/cinema/CinemaPage';
import NightSky from '@/cinema/NightSky';
import ThemeProvider from '@/cinema/ThemeProvider';
import ThemeToggle from '@/cinema/ThemeToggle';

export const metadata = {
  title: 'Cinema lab',
  robots: { index: false, follow: false },
};

// A three beat proof arc: the round mark forms from particles, becomes the red heart,
// then settles to a calm sphere. The home arc will be the same shape, longer.
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
    key: 'placeholder',
    kind: 'sphere',
    radius: 3.6,
    ripple: 0.16,
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
  <div className="cinema-copy" key="placeholder">
    <div className="cinema-kicker">Next beat</div>
    <h2 className="cinema-head">This screen is a placeholder</h2>
    <p className="cinema-sub">
      The rest of the arc lands here: the showroom, the exclusives, the training center,
      delivery and installation, and the door.
    </p>
  </div>,
];

export default function CinemaLabPage() {
  return (
    <ThemeProvider>
      <NightSky />
      <CinemaPage beats={BEATS} panels={PANELS} />
      <ThemeToggle />
    </ThemeProvider>
  );
}
