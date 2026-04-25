import Script from 'next/script';
import DenjoyHero from '@/components/denjoy/DenjoyHero';
import MeetEndoPanel from '@/components/denjoy/MeetEndoPanel';
import ProductPanel from '@/components/denjoy/ProductPanel';
import DenjoyWhyPH from '@/components/denjoy/DenjoyWhyPH';
import DenjoyFAQ from '@/components/denjoy/DenjoyFAQ';
import DenjoyCTA from '@/components/denjoy/DenjoyCTA';
import MessengerButton from '@/components/denjoy/MessengerButton';
import { getCoStars } from '@/data/denjoy';
import styles from './page.module.css';

export const metadata = {
  title: 'Most Advanced Endo Motor Philippines — Real-Time & Wireless | Denjoy',
  description:
    'Philippines\u2019 most digitally advanced endodontic system. Five wireless handpieces, centralized 4,700 mAh dock, real-time data visualization. Denjoy Meet Endo — exclusive to DentaSource Direct.',
  keywords: [
    'endo motor Philippines',
    'Denjoy Philippines',
    'apex locator Philippines',
    'cordless endo motor Philippines',
    'root canal machine price Philippines',
    'endodontic motor with apex locator',
    'dental equipment supplier Manila',
    'Denjoy Meet Endo',
    'endodontic handpiece Philippines',
    'ultrasonic scaler dental Philippines',
  ],
  alternates: {
    canonical: 'https://dentasourcedirect.com/denjoy',
  },
  openGraph: {
    title: 'The Most Digitally Advanced Endo Motor in the Philippines — Denjoy Meet Endo',
    description:
      'Real-time data visualization. Five wireless handpieces on one 4,700 mAh dock. Intelligent auto-pairing. No other endodontic system sold in PH integrates the workflow this way. Exclusive by DentaSource Direct.',
    url: 'https://dentasourcedirect.com/denjoy',
    siteName: 'DentaSource Direct',
    locale: 'en_PH',
    type: 'website',
    images: [
      {
        url: 'https://dentasourcedirect.com/images/denjoy/ensemble-hero-2.jpg',
        width: 1200,
        height: 630,
        alt: 'Denjoy Meet Endo, FREE PEX, i-Pexo, AIKE and imate3 — exclusive Philippines distribution by DentaSource Direct',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Endo Motor Philippines by Denjoy | DentaSource Direct',
    description:
      'Exclusive Denjoy endodontics in the Philippines. Meet Endo, FREE PEX, i-Pexo, AIKE, imate3.',
    images: ['https://dentasourcedirect.com/images/denjoy/ensemble-hero-2.jpg'],
  },
};

const COSTAR_ACCENTS = {
  'free-pex': '#2a4d7a',
  'i-pexo':   '#4a7aaf',
  'aike':     '#6a9acf',
  'imate3':   '#3a4855',
};

const productHubSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProductGroup',
  name: 'Denjoy Endodontic Equipment — Philippines',
  description:
    'Five world-class endodontic instruments distributed exclusively in the Philippines by DentaSource Direct: Meet Endo All-in-One, FREE PEX, i-Pexo, AIKE, and imate3.',
  brand: {
    '@type': 'Brand',
    name: 'Denjoy',
  },
  url: 'https://dentasourcedirect.com/denjoy',
  image: 'https://dentasourcedirect.com/images/denjoy/ensemble-hero-2.jpg',
  seller: {
    '@type': 'Organization',
    name: 'DentaSource Direct',
    url: 'https://dentasourcedirect.com',
    areaServed: 'Philippines',
  },
};

export default function DenjoyPage() {
  const coStars = getCoStars();

  return (
    <>
      <Script id="denjoy-product-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(productHubSchema)}
      </Script>
      <main className={styles.scrollContainer}>
        <DenjoyHero />
        <MeetEndoPanel />
        {coStars.map((product, i) => (
          <ProductPanel
            key={product.slug}
            product={product}
            imagePosition={i % 2 === 0 ? 'right' : 'left'}
            accentColor={COSTAR_ACCENTS[product.slug] || '#7a2a4d'}
          />
        ))}
        <DenjoyWhyPH />
        <DenjoyFAQ />
        <DenjoyCTA />
      </main>
      <div className={styles.mobileStickyBar}>
        <MessengerButton
          prefillText="Hi DSD, I'd like to chat about the Denjoy launch."
          label="Chat about Denjoy"
        />
      </div>
    </>
  );
}
