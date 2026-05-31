import Script from 'next/script';
import DenjoyHero from '@/components/denjoy/DenjoyHero';
import Constellation from '@/components/denjoy/Constellation';
import ChaptersBand from '@/components/denjoy/ChaptersBand';
import DenjoyFAQ from '@/components/denjoy/DenjoyFAQ';
import DenjoyCTA from '@/components/denjoy/DenjoyCTA';
import MessengerButton from '@/components/denjoy/MessengerButton';
import { denjoyProducts } from '@/data/denjoy';
import { faqGraph } from '@/lib/schemas/faq';
import styles from './page.module.css';

export const metadata = {
  title:
    'All of Denjoy in the Philippines — 12 Endo Instruments',
  description:
    'The complete Denjoy endodontic line — Meet Endo, Meta Endo Pro I, Meta Endo, ix6/ix7 microscopes, FREE PEX, i-Pexo, i-Moto, iUe1, iCure, iPack, Meta Pack. Exclusive distribution by DentaSource Direct. Pasig showroom demos available.',
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
    title: 'The Denjoy line — finally, all of it. Locally.',
    description:
      'Twelve Denjoy instruments in one Philippines lineup. Meet Endo, Meta Endo Pro I, Meta Endo, ix6/ix7 microscopes, FREE PEX, i-Pexo, i-Moto, iUe1, iCure, iPack, Meta Pack. Exclusive distribution by DentaSource Direct.',
    url: 'https://dentasourcedirect.com/denjoy',
    siteName: 'DentaSource Direct',
    locale: 'en_PH',
    type: 'website',
    images: [
      {
        url: 'https://dentasourcedirect.com/videos/denjoy/meet-endo-poster.jpg',
        width: 1200,
        height: 630,
        alt: 'The Denjoy line in the Philippines — twelve instruments, exclusive distribution by DentaSource Direct',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All of Denjoy in the Philippines | DentaSource Direct',
    description:
      'Twelve Denjoy instruments in one Philippines lineup. Exclusive by DSD.',
    images: ['https://dentasourcedirect.com/videos/denjoy/meet-endo-poster.jpg'],
  },
};

const productHubSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProductGroup',
  name: 'Denjoy Endodontic Equipment — Philippines',
  description:
    'Twelve Denjoy endodontic and microscopy products distributed exclusively in the Philippines by DentaSource Direct.',
  brand: { '@type': 'Brand', name: 'Denjoy' },
  url: 'https://dentasourcedirect.com/denjoy',
  image:
    'https://dentasourcedirect.com/videos/denjoy/meet-endo-poster.jpg',
  seller: {
    '@type': 'Organization',
    name: 'DentaSource Direct',
    url: 'https://dentasourcedirect.com',
    areaServed: 'Philippines',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '610 C. Maybunga Rd',
      addressLocality: 'Pasig City',
      postalCode: '1600',
      addressCountry: 'PH',
    },
  },
  hasVariant: denjoyProducts.map((p) => ({
    '@type': 'Product',
    name: p.fullName,
    url: `https://dentasourcedirect.com/denjoy/${p.slug}`,
    brand: { '@type': 'Brand', name: 'Denjoy' },
  })),
};

const faqSchema = faqGraph([
  {
    q: 'How many Denjoy products does DentaSource Direct distribute in the Philippines?',
    a: 'Twelve, as of 2026. The full Denjoy line is exclusively distributed by DSD: 3 integrated systems (Meet Endo, Meta Endo Pro I, Meta Endo), 2 apex locators (FREE PEX, i-Pexo), 2 microscopes (ix6, ix7), 1 cordless motor (i-Moto), and 4 auxiliary products (iUe1, iCure, iPack, Meta Pack).',
  },
  {
    q: 'Where can I see and demo a Denjoy unit before buying?',
    a: 'At the DentaSource Direct Pasig showroom — 610 C. Maybunga Rd, Pasig City 1600. The Meet Endo flagship is already installed for live demos. Other units are demo-ready by appointment. Message us via the chat to schedule.',
  },
  {
    q: 'Is DentaSource Direct an official Denjoy distributor?',
    a: 'DSD is the exclusive Denjoy distributor in the Philippines. All units sold by DSD include local warranty, training, and direct support — not just import paperwork.',
  },
]);

export default function DenjoyPage() {
  return (
    <>
      <Script
        id="denjoy-product-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(productHubSchema)}
      </Script>
      <Script
        id="denjoy-faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(faqSchema)}
      </Script>
      <main className={styles.scrollContainer}>
        <DenjoyHero />
        <Constellation />
        <ChaptersBand />
        <DenjoyCTA />
        <DenjoyFAQ />
      </main>
      <div className={styles.mobileStickyBar}>
        <MessengerButton
          prefillText="Hi DSD, I'd like to chat about the Denjoy line."
          label="Chat about Denjoy"
        />
      </div>
    </>
  );
}
