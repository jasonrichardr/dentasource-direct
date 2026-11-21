import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import DenjoyProductPage from '@/components/denjoy/light/DenjoyProductPage';
import { getDenjoyBySlug, denjoyProducts } from '@/data/denjoy';
import { denjoyPages, getDenjoyPage } from '@/data/denjoyPages';
import { faqGraph } from '@/lib/schemas/faq';

// Search phrases per instrument. Titles and descriptions are written from the page copy
// (src/data/denjoyPages.js): no prices, no dashes, and the showroom is in Pasig.
const SEO = {
  'meta-endo-pro-i': {
    title: 'Denjoy Meta Endo Pro I Endodontic Cart',
    description: 'Four endo handpieces on one cart with double-layer sterile drawers. See the Meta Endo Pro I at our Pasig showroom.',
    keywords: ['Meta Endo Pro I', 'endodontic cart Philippines', 'Denjoy Philippines', 'integrated endodontic system Philippines'],
  },
  'meet-endo': {
    title: 'Denjoy Meet Endo All-in-One Endodontic System',
    description: 'A touchscreen base that runs and charges your wireless apex locator, endo motor, heat plugger and backfill. Live demo at our Pasig showroom.',
    keywords: [
      'cordless endo motor with apex locator Philippines',
      'endo motor Philippines',
      'Denjoy Meet Endo',
      'Meet Endo All-in-One',
      'endodontic motor with apex locator',
      'integrated endodontic system Philippines',
      'Denjoy Philippines distributor',
    ],
  },
  'meta-endo': {
    title: 'Denjoy Meta Endo 4-in-1 Endodontic System',
    description: 'Endo motor, apex locator, down-pack pen and backfill gun on one mobile cart that charges them in the tray. See it at our Pasig showroom.',
    keywords: ['Meta Endo 4-in-1', 'endodontic cart Philippines', 'Denjoy Meta Endo', 'root canal equipment Philippines'],
  },
  'free-pex': {
    title: 'Denjoy FREE PEX Benchtop Apex Locator',
    description: 'A benchtop apex locator with a 6th-generation multi-frequency chip for wet or dry canals. 12-month local warranty. Pasig showroom.',
    keywords: ['benchtop apex locator Philippines', 'FREE PEX Denjoy', 'apex locator Philippines', 'multi-frequency apex locator'],
  },
  'i-pexo': {
    title: 'Denjoy i-Pexo Touchscreen Apex Locator',
    description: 'A 200-gram touchscreen apex locator that reads in portrait or landscape. 12-month local warranty. Try it at our Pasig showroom.',
    keywords: ['apex locator Philippines', 'i-Pexo Denjoy', 'touch screen apex locator', 'portable apex locator Philippines'],
  },
  ix7: {
    title: 'Denjoy ix7 Dental Microscope',
    description: 'A dental microscope with stepless 0.4x to 2.4x zoom and an 18W LED. Installation and training through our Pasig showroom.',
    keywords: ['dental microscope Philippines', 'Denjoy ix7 microscope', 'endodontic microscope Philippines'],
  },
  ix6: {
    title: 'Denjoy ix6 Dental Microscope',
    description: 'Five-step magnification, coated optics and an optional 4K camera, on a floor stand or tabletop clip. See it at our Pasig showroom.',
    keywords: ['dental microscope Philippines', 'Denjoy ix6 microscope', 'dental microscope with camera'],
  },
  'i-moto': {
    title: 'Denjoy i-Moto Cordless Endo Motor',
    description: 'An 85-gram cordless motor with two heads, for canal preparation and polishing. Nine saved presets. See it at our Pasig showroom.',
    keywords: ['cordless endo motor Philippines', 'endo motor Philippines', 'Denjoy i-Moto', 'rotary endo motor Philippines'],
  },
  iue1: {
    title: 'Denjoy iUe1 Ultrasonic Activator',
    description: 'A cordless 45kHz ultrasonic activator for irrigation in fine and curved canals. USB charging. See it at our Pasig showroom.',
    keywords: ['ultrasonic activator Philippines', 'Denjoy iUe1', 'endodontic irrigation activator', 'endodontic ultrasonic Philippines'],
  },
  icure: {
    title: 'Denjoy iCure Cordless LED Curing Light',
    description: 'A 103-gram cordless curing light with two swappable heads and up to 3000mW/cm² output. See it at our Pasig showroom.',
    keywords: ['LED curing light Philippines', 'Denjoy iCure', 'cordless curing light'],
  },
  ipack: {
    title: 'Denjoy iPack Cordless Gutta-Percha Down-Packer',
    description: 'A cordless down-pack pen with 150, 200 and 220°C settings and four color-coded plugger tips. See it at our Pasig showroom.',
    keywords: ['gutta percha obturation Philippines', 'Denjoy iPack', 'down pack pen', 'warm vertical condensation'],
  },
  'meta-pack': {
    title: 'Denjoy Meta Pack Down-Pack Heat Pen',
    description: 'A down-pack heat pen that reaches 200°C in 0.2 seconds, with four pre-bendable tips. See it at our Pasig showroom.',
    keywords: ['down pack heat pen', 'Denjoy Meta Pack', 'gutta percha obturation Philippines', 'warm vertical condensation'],
  },
};

const FALLBACK_IMAGE = 'https://dentasourcedirect.com/images/denjoy/ensemble-hero-2.jpg';

export async function generateStaticParams() {
  return denjoyProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getDenjoyBySlug(slug);
  const page = getDenjoyPage(slug);
  if (!product || !page) return {};

  const seo = SEO[slug] || {};
  const title = seo.title || `Denjoy ${product.name}`;
  const description = seo.description || page.hero.line;
  const url = `https://dentasourcedirect.com/denjoy/${slug}`;
  const image = page.hero.photo?.src
    ? `https://dentasourcedirect.com${page.hero.photo.src}`
    : FALLBACK_IMAGE;

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
      images: [{ url: image, width: page.hero.photo?.w, height: page.hero.photo?.h, alt: product.fullName }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

function buildProductSchema(product, page, slug) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.fullName,
    alternateName: product.name,
    description: page.hero.line,
    image: page.hero.photo?.src ? `https://dentasourcedirect.com${page.hero.photo.src}` : undefined,
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

export default async function DenjoyInstrumentPage({ params }) {
  const { slug } = await params;
  const product = getDenjoyBySlug(slug);
  const page = getDenjoyPage(slug);
  if (!product || !page) notFound();

  // Up to three neighbours: the same family first, then the integrated systems.
  const related = [
    ...denjoyPages.filter((p) => p.slug !== slug && p.family.id === page.family.id),
    ...denjoyPages.filter((p) => p.slug !== slug && p.family.id !== page.family.id && p.family.id === 'integrated'),
    ...denjoyPages.filter((p) => p.slug !== slug && p.family.id !== page.family.id && p.family.id !== 'integrated'),
  ].slice(0, 3);

  return (
    <>
      <JsonLd id={`denjoy-${slug}-schema`} data={buildProductSchema(product, page, slug)} />
      {page.faqs?.length ? <JsonLd id={`denjoy-${slug}-faq-schema`} data={faqGraph(page.faqs)} /> : null}
      <main className="min-h-screen">
        <DenjoyProductPage item={page} related={related} />
      </main>
    </>
  );
}
