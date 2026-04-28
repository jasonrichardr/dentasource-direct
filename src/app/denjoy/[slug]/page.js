import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getDenjoyBySlug, getCoStars, getFlagship } from '@/data/denjoy';
import CoStarDetail from '@/components/denjoy/CoStarDetail';
import FreePexHero from '@/components/denjoy/FreePexHero';
import FreePexLanding from '@/components/denjoy/FreePexLanding';
import { freePexFaqs } from '@/components/denjoy/freePexContent';

const SEO = {
  'free-pex': {
    title: 'FREE PEX Benchtop Apex Locator Philippines | Denjoy by DSD',
    description:
      'Denjoy FREE PEX benchtop apex locator — multi-frequency accuracy for wet or dry canals. Exclusive Philippines distribution by DentaSource Direct. PHP pricing, local warranty.',
    keyword: 'benchtop apex locator Philippines',
    keywords: [
      'benchtop apex locator Philippines',
      'FREE PEX Denjoy',
      'apex locator Philippines',
      'multi-frequency apex locator',
      'dental apex locator Manila',
    ],
  },
  'i-pexo': {
    title: 'i-Pexo Touch Apex Locator Philippines | Denjoy by DSD',
    description:
      'Denjoy i-Pexo — touchable phone-format apex locator with wireless handpiece. Same measurement engine as Meet Endo. Exclusive PH distribution by DentaSource Direct.',
    keyword: 'apex locator Philippines',
    keywords: [
      'apex locator Philippines',
      'i-Pexo Denjoy',
      'wireless apex locator',
      'touch screen apex locator',
      'Denjoy apex locator price Philippines',
    ],
  },
  aike: {
    title: 'AIKE Ultrasonic Activator Philippines | Denjoy by DSD',
    description:
      'Denjoy AIKE ultrasonic activator for irrigation and cleaning in root canal treatment. Exclusive Philippines distribution — PHP pricing, local service, nationwide delivery.',
    keyword: 'ultrasonic activator dental Philippines',
    keywords: [
      'ultrasonic activator Philippines',
      'AIKE Denjoy',
      'dental ultrasonic scaler Philippines',
      'endodontic ultrasonic Philippines',
      'irrigation activator dental',
    ],
  },
  imate3: {
    title: 'imate3 Cordless Endo Motor Philippines | Denjoy by DSD',
    description:
      'Denjoy imate3 cordless endo motor — reliable entry-level rotary endodontics with torque control. Exclusive PH distribution by DentaSource Direct. Transparent PHP pricing.',
    keyword: 'cordless endo motor Philippines',
    keywords: [
      'endo motor Philippines',
      'cordless endo motor Philippines',
      'imate3 Denjoy',
      'entry level endo motor',
      'rotary endo motor Philippines',
      'affordable endodontic motor Manila',
    ],
  },
};

export async function generateStaticParams() {
  return getCoStars().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getDenjoyBySlug(slug);
  if (!product) return {};

  const seo = SEO[slug] || {};
  const title = seo.title || `${product.fullName} — Denjoy | DentaSource Direct`;
  const description = seo.description || product.tagline;
  const url = `https://dentasourcedirect.com/denjoy/${slug}`;
  const image = product.heroImage
    ? `https://dentasourcedirect.com${product.heroImage}`
    : 'https://dentasourcedirect.com/images/denjoy/ensemble-hero-2.jpg';

  return {
    title,
    description,
    keywords: seo.keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'DentaSource Direct',
      locale: 'en_PH',
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: product.fullName }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

function buildProductSchema(product, slug) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.fullName,
    alternateName: product.name,
    description: product.tagline,
    image: product.heroImage
      ? `https://dentasourcedirect.com${product.heroImage}`
      : undefined,
    brand: { '@type': 'Brand', name: 'Denjoy' },
    category: 'Dental Equipment / Endodontics',
    url: `https://dentasourcedirect.com/denjoy/${slug}`,
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
}

export default async function DenjoyProductPage({ params }) {
  const { slug } = await params;

  const flagship = getFlagship();
  if (slug === flagship.slug) {
    notFound();
  }

  const product = getDenjoyBySlug(slug);
  if (!product || product.isFlagship) {
    notFound();
  }

  const schema = buildProductSchema(product, slug);

  if (slug === 'free-pex') {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: freePexFaqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    };
    return (
      <>
        <Script id={`denjoy-${slug}-schema`} type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(schema)}
        </Script>
        <Script id={`denjoy-${slug}-faq-schema`} type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(faqSchema)}
        </Script>
        <main>
          <FreePexHero />
          <FreePexLanding />
        </main>
      </>
    );
  }

  return (
    <>
      <Script id={`denjoy-${slug}-schema`} type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(schema)}
      </Script>
      <CoStarDetail product={product} />
    </>
  );
}
