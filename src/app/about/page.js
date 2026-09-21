import PageCinema from '@/components/cinema-pages/PageCinema';
import aboutBeats from '@/components/cinema-pages/about-beats.json';
import { visible } from '@/lib/cinema/visible';

// Hidden beats drop out before the arc is built, so the beat count and the scroll rail
// exclude them too. See src/lib/cinema/visible.js.
const ABOUT_BEATS = visible(aboutBeats.beats);

export const metadata = {
  title: 'About DentaSource Direct — Your Growth Partner in Dentistry',
  description: 'The Philippines\' largest dental equipment showroom. Exclusive ROSON, K-Clamps and DENJOY distributor. White-glove installation, training programs, and 7-day-a-week support in Pasig City.',
};

// The six beat About arc. The cinema lives in <main> because that is what the music room
// hides while it holds the screen, restoring only the stars behind itself.
export default function AboutPage() {
  return (
    <main>
      <PageCinema beats={ABOUT_BEATS} />
    </main>
  );
}
