import JsonLd from '@/components/JsonLd';
import DenjoyHub from '@/components/denjoy/light/DenjoyHub';
import { denjoyProducts } from '@/data/denjoy';
import { denjoyPages, DENJOY_FAMILIES, DENJOY_HUB } from '@/data/denjoyPages';
import { faqGraph } from '@/lib/schemas/faq';

const TITLE = 'Denjoy Endodontic Equipment in the Philippines';
const DESCRIPTION =
  'The full Denjoy line: integrated endo systems, apex locators, microscopes and cordless tools. Exclusive distributor, with demos at our Pasig showroom.';
const OG_IMAGE = 'https://dentasourcedirect.com/videos/denjoy/meet-endo-poster.jpg';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'Denjoy Philippines',
    'endo motor Philippines',
    'apex locator Philippines',
    'dental microscope Philippines',
    'cordless endo motor Philippines',
    'ultrasonic activator Philippines',
    'root canal equipment Philippines',
    'Denjoy Meet Endo',
    'Denjoy ix7 microscope',
    'Denjoy ix6 microscope',
    'Meta Endo Pro I',
    'DentaSource Direct',
  ],
  alternates: { canonical: 'https://dentasourcedirect.com/denjoy' },
  openGraph: {
    title: 'The full Denjoy endodontic line, in the Philippines',
    description: DESCRIPTION,
    url: 'https://dentasourcedirect.com/denjoy',
    siteName: 'DentaSource Direct',
    locale: 'en_PH',
    type: 'website',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'The Denjoy line in the Philippines: twelve instruments, distributed exclusively by DentaSource Direct',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} | DentaSource Direct`,
    description: 'Twelve Denjoy instruments in one Philippine lineup, with demos at our Pasig showroom.',
    images: [OG_IMAGE],
  },
};

// Catalog page of 12 distinct products → ItemList (Google's category-page markup).
// ProductGroup is for variants of ONE product and demands offers/review/rating,
// which we don't publish — it made the page invalid for rich results.
const productHubSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Denjoy Endodontic Equipment, Philippines',
  description:
    'Twelve Denjoy endodontic and microscopy products distributed exclusively in the Philippines by DentaSource Direct.',
  url: 'https://dentasourcedirect.com/denjoy',
  numberOfItems: denjoyProducts.length,
  itemListElement: denjoyProducts.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: p.fullName,
    url: `https://dentasourcedirect.com/denjoy/${p.slug}`,
  })),
};

// The same three questions the page shows, so the markup and the visible answers agree.
const faqSchema = faqGraph(DENJOY_HUB.faq.items);

export default function DenjoyPage() {
  return (
    <>
      <JsonLd id="denjoy-product-schema" data={productHubSchema} />
      <JsonLd id="denjoy-faq-schema" data={faqSchema} />
      <main className="min-h-screen">
        <DenjoyHub pages={denjoyPages} families={DENJOY_FAMILIES} copy={DENJOY_HUB} />
      </main>
    </>
  );
}
