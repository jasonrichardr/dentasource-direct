import NewsContent from './NewsContent';

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
  return <NewsContent />;
}
