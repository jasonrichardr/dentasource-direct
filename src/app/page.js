import HomeCinema from '@/components/cinema-home/HomeCinema';
import { newsData } from '@/data/news';

export const metadata = {
  title: 'DentaSource Direct — Premium Dental Equipment Philippines',
  description: 'The Philippines\' largest dental equipment showroom. Premium ROSON dental chairs, imaging equipment, and clinical tools with white-glove installation and training.',
};

// The news marquee is fed HERE, on the server, and reaches the client as four fields per
// article. src/data/news.js carries the full markdown body of ninety one articles; passing
// the array itself into a client component would ship every word of it to the browser.
const MARQUEE_COUNT = 24;

function marqueeArticles() {
  return newsData
    .filter((a) => a.ogImage && a.slug && a.title)
    .map((a) => ({ slug: a.slug, title: a.title, image: a.ogImage, date: a.date }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, MARQUEE_COUNT);
}

export default function Home() {
  return (
    <main>
      <HomeCinema articles={marqueeArticles()} />
    </main>
  );
}
