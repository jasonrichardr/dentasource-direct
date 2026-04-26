import { products } from '@/data/products';
import { productGraph, breadcrumbGraph } from '@/lib/schemas/product';
import { faqGraph } from '@/lib/schemas/faq';
import JsonLd from '@/components/JsonLd';
import { rorayFaqs } from './rorayContent';

export default function RoraySchemas() {
  const product = products.find((p) => p.slug === 'roson-roray-xray');
  if (!product) return null;
  const enrichedProduct = {
    ...product,
    description:
      'ROSON RoRay handheld dental X-ray unit. 0.4mm ultra-fine focal spot, 100,000-cycle tube endurance, 9% full-coverage lead shielding, 50,000+ images per battery cycle. Exclusive Philippine distribution by DentaSource Direct.',
    images: [
      '/images/products/roray/hero.jpg',
      '/images/products/roray/view-2.jpg',
      '/images/products/roray/view-3.jpg',
      '/images/products/roray/view-4.jpg',
      '/images/products/roray/view-5.jpg',
      '/images/products/roray/view-6.jpg',
    ],
    specs: {
      'Form factor': 'Handheld / Portable',
      'Focal spot': '0.4 mm (Ultra-Fine)',
      'Tube technology': 'High-frequency, solid-state potting-encapsulated',
      'Tube endurance': '100,000+ exposure cycles',
      'Sharpness retention': 'Less than 5% attenuation over lifespan',
      'Battery capacity': '50,000+ images per cycle',
      Display: '2.8-inch HD color',
      'Lead shielding': '9% full-coverage',
      'Leakage radiation': 'Below standard requirements',
      Cooling: 'Self-cooling (no warm-up, no cooldown)',
      'Tablet required': 'No (onboard UI)',
      Origin: 'ROSON Medical, China',
      Warranty: '1-year parts and service',
    },
  };

  return (
    <>
      <JsonLd
        id="roray-product"
        data={productGraph(enrichedProduct, { urlPath: '/roray-xray' })}
      />
      <JsonLd
        id="roray-breadcrumb"
        data={breadcrumbGraph(enrichedProduct, '/roray-xray')}
      />
      <JsonLd id="roray-faq" data={faqGraph(rorayFaqs)} />
    </>
  );
}
