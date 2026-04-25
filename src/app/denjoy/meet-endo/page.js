import Script from 'next/script';
import { getFlagship } from '@/data/denjoy';
import MeetEndoDetail from '@/components/denjoy/MeetEndoDetail';

const TITLE = 'Meet Endo All-in-One — Cordless Endo Motor with Apex Locator Philippines | Denjoy by DSD';
const DESCRIPTION =
  'Denjoy Meet Endo All-in-One: cordless endo motor, apex locator, and obturation system in one touchscreen workflow. Exclusive Philippines distribution by DentaSource Direct. Transparent PHP pricing, local warranty, training included.';
const URL = 'https://dentasourcedirect.com/denjoy/meet-endo';

export function generateMetadata() {
  const product = getFlagship();
  const image = product.heroImage
    ? `https://dentasourcedirect.com${product.heroImage}`
    : 'https://dentasourcedirect.com/images/denjoy/ensemble-hero-2.jpg';

  return {
    title: TITLE,
    description: DESCRIPTION,
    keywords: [
      'cordless endo motor with apex locator Philippines',
      'endo motor Philippines',
      'Denjoy Meet Endo',
      'Meet Endo All-in-One',
      'root canal machine price Philippines',
      'endodontic motor with apex locator',
      'integrated endodontic system Philippines',
      'Denjoy Philippines distributor',
    ],
    alternates: { canonical: URL },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: URL,
      siteName: 'DentaSource Direct',
      locale: 'en_PH',
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: product.fullName }],
    },
    twitter: {
      card: 'summary_large_image',
      title: TITLE,
      description: DESCRIPTION,
      images: [image],
    },
  };
}

export default function MeetEndoPage() {
  const product = getFlagship();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.fullName,
    alternateName: product.name,
    description:
      'The Denjoy Meet Endo All-in-One Endodontic System combines a cordless endo motor, touchscreen apex locator, and gutta-percha obturation module into a single mobile unit built for modern Philippine dental clinics.',
    image: product.heroImage ? `https://dentasourcedirect.com${product.heroImage}` : undefined,
    brand: { '@type': 'Brand', name: 'Denjoy' },
    category: 'Dental Equipment / Endodontics / Integrated Systems',
    url: URL,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'PHP',
      areaServed: 'Philippines',
      seller: {
        '@type': 'Organization',
        name: 'DentaSource Direct',
        url: 'https://dentasourcedirect.com',
      },
    },
  };

  return (
    <>
      <Script id="denjoy-meet-endo-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(schema)}
      </Script>
      <MeetEndoDetail />
    </>
  );
}
