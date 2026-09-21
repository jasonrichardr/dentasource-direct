import JsonLd from '@/components/JsonLd';
import KclampsExperience from './KclampsExperience';
import { clamps, faqs } from '@/data/kclamps';
import { faqGraph } from '@/lib/schemas/faq';

export const metadata = {
  title: 'K-Clamp Rubber Dam Clamps Philippines — 46 Sizes, Exclusive by DentaSource Direct',
  description:
    'Every K-Clamp rubber dam clamp by Shinhung (Korea), exclusively distributed in the Philippines by DentaSource Direct: molar, premolar, anterior, partially erupted and pediatric sizes, matte or glossy. Tap any clamp to see which teeth it fits.',
  keywords: [
    'K-Clamp Philippines',
    'rubber dam clamp Philippines',
    'K-Clamp Shinhung',
    'rubber dam clamp kit',
    'dental dam clamp sizes',
    'pediatric rubber dam clamp',
    'wingless rubber dam clamp',
    'DentaSource Direct',
  ],
  alternates: { canonical: 'https://dentasourcedirect.com/k-clamps' },
  openGraph: {
    title: 'K-Clamp in the Philippines — every size, and the tooth it fits',
    description:
      '46 K-Clamp rubber dam clamp sizes by Shinhung, exclusive in the Philippines through DentaSource Direct. Tap a clamp, see the tooth.',
    url: 'https://dentasourcedirect.com/k-clamps',
    siteName: 'DentaSource Direct',
    locale: 'en_PH',
    type: 'website',
    images: [
      {
        url: 'https://dentasourcedirect.com/images/kclamps/og.jpg',
        width: 1200,
        height: 630,
        alt: 'K-Clamp rubber dam clamps, exclusive in the Philippines through DentaSource Direct',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'K-Clamp Philippines | DentaSource Direct',
    description: '46 rubber dam clamp sizes by Shinhung. Tap a clamp, see the tooth it fits.',
    images: ['https://dentasourcedirect.com/images/kclamps/og.jpg'],
  },
};

const itemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'K-Clamp Rubber Dam Clamps — Philippines',
  description: 'The K-Clamp rubber dam clamp line by Shinhung, distributed exclusively in the Philippines by DentaSource Direct.',
  url: 'https://dentasourcedirect.com/k-clamps',
  numberOfItems: clamps.length,
  itemListElement: clamps.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: `K-Clamp ${c.label}`,
    url: `https://dentasourcedirect.com/k-clamps#clamp-${c.id}`,
  })),
};

const brand = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'K-Clamp Rubber Dam Clamps',
  brand: { '@type': 'Brand', name: 'K-Clamp' },
  manufacturer: { '@type': 'Organization', name: 'Shinhung Co., Ltd.' },
  description: 'Stainless steel rubber dam clamps in 46 sizes, matte or glossy, autoclavable to 121°C. Exclusive Philippine distribution by DentaSource Direct.',
  image: 'https://dentasourcedirect.com/images/kclamps/chart.jpg',
  url: 'https://dentasourcedirect.com/k-clamps',
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Material', value: 'Stainless steel' },
    { '@type': 'PropertyValue', name: 'Sterilization method', value: 'Steam autoclave' },
    { '@type': 'PropertyValue', name: 'Autoclave temperature', value: '121°C' },
    { '@type': 'PropertyValue', name: 'Finish', value: 'Matte or glossy' },
    { '@type': 'PropertyValue', name: 'Number of sizes', value: '46' },
    { '@type': 'PropertyValue', name: 'Country of manufacture', value: 'Republic of Korea' },
  ],
};

export default function KClampsPage() {
  return (
    <>
      <JsonLd id="kclamps-itemlist" data={itemList} />
      <JsonLd id="kclamps-product" data={brand} />
      <JsonLd id="kclamps-faq" data={faqGraph(faqs)} />
      <main>
        <KclampsExperience />
      </main>
    </>
  );
}
