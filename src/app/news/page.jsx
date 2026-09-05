import NewsContent from './NewsContent';
import { newsData } from '@/data/news';

/**
 * The card grid needs five fields per article. The BODIES are what make the corpus heavy,
 * and nothing on this screen renders one, so they never leave the server: the page ships
 * the slim list and the full archive waits behind an import() in newsSearchIndex.js until
 * somebody actually searches.
 */
function slimList() {
  return [...newsData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      abstract: a.abstract,
      date: a.date,
      image: a.ogImage || a.image || null,
    }));
}

export const metadata = {
  title: 'Dental Industry News & Insights',
  description:
    'The latest from the Philippine dental industry — product launches, PDA updates, technology trends, and expert buying guides from DentaSource Direct.',
  alternates: { canonical: '/news' },
  openGraph: {
    title: 'News & Insights from DentaSource Direct',
    description:
      'Installs, conventions, Training Center courses and every ROSON and Denjoy launch, written from the floor and dated to the day.',
    url: 'https://dentasourcedirect.com/news',
    siteName: 'DentaSource Direct',
    type: 'website',
    images: [{ url: '/images/og/og-news-2026-09-05f.jpg', width: 1200, height: 630, alt: 'News from the floor: installs, conventions, training and launches from DentaSource Direct' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'News & Insights from DentaSource Direct',
    description:
      'Installs, conventions, Training Center courses and every ROSON and Denjoy launch, written from the floor and dated to the day.',
    images: ['/images/og/og-news-2026-09-05f.jpg'],
  },
};

export default function NewsPage() {
  return <NewsContent articles={slimList()} />;
}
