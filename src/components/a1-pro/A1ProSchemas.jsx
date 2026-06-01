import { products } from '@/data/products';
import { productGraph, breadcrumbGraph } from '@/lib/schemas/product';
import { faqGraph } from '@/lib/schemas/faq';
import JsonLd from '@/components/JsonLd';
import { a1proFaqs } from './a1proContent';

export default function A1ProSchemas() {
  const product = products.find((p) => p.slug === 'roson-a1-pro-fashionable');
  if (!product) return null;
  const enrichedProduct = {
    ...product,
    description:
      'ROSON A1 Pro dental chair. 12 mm carbon-structural-steel frame, 150 kg patient load, sleep-grade soft start/stop motion, Rolight S 8-LED tri-mode dental light, intelligent memory chair position, 4-position adjustable handpiece holder. Three signature colors (ROSON Blue, Ballet Pink, Mint Green) with 33+ silicone and PU leather customization options. RS-07 Professional Dentist Stool included standard. Exclusive Philippine distribution by DentaSource Direct.',
    images: [
      '/images/products/a1-pro/hero.jpg',
      '/images/products/a1-pro/view-2-headrest.jpg',
      '/images/products/a1-pro/view-3-touchscreen.jpg',
      '/images/products/a1-pro/view-4-instrument-arm.jpg',
      '/images/products/a1-pro/view-5-light.jpg',
      '/images/products/a1-pro/view-6-cart.jpg',
    ],
    specs: {
      Frame: '12 mm premium carbon structural steel',
      'Maximum patient load': '150 kg',
      'Motion system': 'Sleep-grade soft start/stop',
      'Operating light': 'Rolight S — 8-LED, tri-mode (yellow / white / mixed)',
      'Light control': 'Infrared sensing + manual button, removable handle',
      'Memory positions': 'Intelligent chair-position recall (one-touch)',
      'Smart workflow': 'Smart Clean button: 5-min spittoon rinse + pipeline flush',
      'Handpiece holder': '4-position adjustable (storage + 2 grip angles)',
      Spittoon: 'Detachable ceramic with rotary odor trap',
      Upholstery: 'Soft silicone rubber leather OR medical-grade PU leather',
      'Signature colors': 'ROSON Blue, Ballet Pink, Mint Green',
      'Custom colors': '12 silicone + 21 PU leather options',
      'Dentist stool': 'RS-07 Professional (included standard)',
      Origin: 'Foshan Roson Medical, China',
      Warranty: '2 years (1st year parts + service, 2nd year service)',
    },
  };

  return (
    <>
      <JsonLd
        id="a1-pro-product"
        data={productGraph(enrichedProduct, { urlPath: '/a1-pro' })}
      />
      <JsonLd
        id="a1-pro-breadcrumb"
        data={breadcrumbGraph(enrichedProduct, '/a1-pro')}
      />
      <JsonLd id="a1-pro-faq" data={faqGraph(a1proFaqs)} />
    </>
  );
}
