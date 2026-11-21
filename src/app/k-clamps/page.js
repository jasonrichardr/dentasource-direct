import JsonLd from '@/components/JsonLd';
import ScrollFx from '@/components/chair/ScrollFx';
import { ShowroomDoor } from '@/components/chair/sections';
import DenjoyTrack from '@/components/denjoy/light/DenjoyTrack';
import { SHOWROOM } from '@/data/chairs/shared';
import KclampsExperience from './KclampsExperience';
import '@/components/chair/chair.css';
import { clamps, faqs } from '@/data/kclamps';
import { faqGraph } from '@/lib/schemas/faq';

export const metadata = {
  title: 'K-Clamp Rubber Dam Clamps in the Philippines, 46 Sizes',
  description:
    'All 46 K-Clamp rubber dam clamps by Shinhung of Korea: molar, premolar, anterior and pediatric sizes. Tap a tooth to see which clamps fit. Pasig showroom.',
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
    title: 'K-Clamp in the Philippines: every size, and the tooth it fits',
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
  name: 'K-Clamp Rubber Dam Clamps, Philippines',
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

const ROOT_ID = 'kclamps-page';

const DOOR = {
  kicker: 'Pasig showroom',
  title: 'Handle every size before you choose',
  line: 'Kits and single clamps ship from our Pasig showroom, where you can compare the sizes side by side.',
  ...SHOWROOM,
  ctas: [
    { label: 'Visit the showroom', href: '/contact#showroom', primary: true },
    { label: 'Message us', href: `https://m.me/dentasource?ref=${encodeURIComponent("Hi DSD, I'd like to ask about K-Clamp.")}`, external: true },
    { label: 'See all equipment', href: '/products' },
  ],
};

export default function KClampsPage() {
  return (
    <>
      <JsonLd id="kclamps-itemlist" data={itemList} />
      <JsonLd id="kclamps-product" data={brand} />
      <JsonLd id="kclamps-faq" data={faqGraph(faqs)} />
      <main className="min-h-screen">
        {/* `.ch` supplies the chair design system's tokens and type; the finder is the only
            client part, and the showroom door closes the page as it does for the chairs. */}
        <div id={ROOT_ID} className="ch">
          <KclampsExperience />
          <ShowroomDoor door={DOOR} />
          <ScrollFx rootId={ROOT_ID} />
          <DenjoyTrack rootId={ROOT_ID} name="kclamp-footer" />
        </div>
      </main>
    </>
  );
}
