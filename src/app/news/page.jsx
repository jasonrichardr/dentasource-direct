import NewsContent from './NewsContent';

export const metadata = {
  title: 'Dental Industry News & Insights',
  description:
    'The latest from the Philippine dental industry — product launches, PDA updates, technology trends, and expert buying guides from DentaSource Direct.',
  alternates: { canonical: '/news' },
  openGraph: {
    title: 'Dental Industry News & Insights — DentaSource Direct',
    description:
      'Product launches, PDA updates, technology trends, and expert buying guides for Philippine dental clinics.',
    url: 'https://dentasourcedirect.com/news',
    type: 'website',
  },
};

export default function NewsPage() {
  return <NewsContent />;
}
