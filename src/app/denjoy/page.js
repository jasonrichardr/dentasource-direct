import JsonLd from '@/components/JsonLd';
import DnaLanding from '@/components/denjoy/v2/DnaLanding';
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

// Catalog page of 12 distinct products → ItemList (Google's category-page markup).
// ProductGroup is for variants of ONE product and demands offers/review/rating,
// which we don't publish — it made the page invalid for rich results.
const productHubSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Denjoy Endodontic Equipment — Philippines',
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
      <JsonLd id="denjoy-product-schema" data={productHubSchema} />
      <JsonLd id="denjoy-faq-schema" data={faqSchema} />
      <main>
        <DnaLanding />
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
