import JsonLd from '@/components/JsonLd';
import { faqs } from './n2proContent';

const product = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'ROSON N2 Pro Dental Chair',
  alternateName: ['ROSON N2 PRO', 'KLT-6220', 'KLT-6210'],
  brand: { '@type': 'Brand', name: 'ROSON' },
  manufacturer: {
    '@type': 'Organization',
    name: 'Foshan Roson Medical Instrument Co., Ltd',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'No.9 Henggui Zhong Road, Lianhe Avenue, Luocun, Shishan Town',
      addressLocality: 'Foshan',
      addressRegion: 'Guangdong',
      postalCode: '528226',
      addressCountry: 'CN',
    },
  },
  category: 'Dental chair / dental treatment unit',
  description:
    "ROSON's flagship N-series dental chair. 650×315mm dentist tray (widest in series), independent disinfectant water supply, 24V silent motor with intelligent soft start/stop. CE marked, six microbiological certifications.",
  image: [
    'https://dentasourcedirect.com/images/products/n2-pro/N2%20Pro%20Dental%20Chair/1-1.jpg',
    'https://dentasourcedirect.com/images/products/n2-pro/N2%20Pro%20Dental%20Chair/2-2.jpg',
    'https://dentasourcedirect.com/images/products/n2-pro/N2%20Pro%20Dental%20Chair/3-1.jpg',
  ],
  isAccessoryOrSparePartFor: [],
  offers: {
    '@type': 'Offer',
    priceCurrency: 'PHP',
    availability: 'https://schema.org/InStock',
    url: 'https://dentasourcedirect.com/n2-pro',
    seller: {
      '@type': 'Organization',
      name: 'DentaSource Direct',
      url: 'https://dentasourcedirect.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Pasig',
        addressRegion: 'Metro Manila',
        addressCountry: 'PH',
      },
    },
  },
  hasMerchantReturnPolicy: undefined,
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Dentist tray', value: '650 × 315 mm' },
    { '@type': 'PropertyValue', name: 'Patient height range', value: '400–750 mm' },
    { '@type': 'PropertyValue', name: 'Backrest range', value: '115°–170°' },
    { '@type': 'PropertyValue', name: 'Maximum patient load', value: '150 kg' },
    { '@type': 'PropertyValue', name: 'Net weight', value: '≈230 kg' },
    { '@type': 'PropertyValue', name: 'Input power', value: '720 VA max' },
    { '@type': 'PropertyValue', name: 'Voltage', value: '230V AC ±10%, 50/60 Hz' },
    { '@type': 'PropertyValue', name: 'Operating light', value: 'Rolight S — IR hands-free' },
    { '@type': 'PropertyValue', name: 'Spittoon', value: 'Ceramic, 180° rotatable' },
    { '@type': 'PropertyValue', name: 'Disinfectant water supply', value: 'Independent rear cabinet' },
  ],
};

const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const breadcrumbs = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dentasourcedirect.com' },
    { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://dentasourcedirect.com/products' },
    { '@type': 'ListItem', position: 3, name: 'N2 Pro Dental Chair', item: 'https://dentasourcedirect.com/n2-pro' },
  ],
};

export default function N2ProSchemas() {
  return (
    <>
      <JsonLd id="n2-pro-product" data={product} />
      <JsonLd id="n2-pro-faq" data={faqPage} />
      <JsonLd id="n2-pro-breadcrumbs" data={breadcrumbs} />
    </>
  );
}
