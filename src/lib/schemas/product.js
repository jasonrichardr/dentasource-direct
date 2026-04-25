import { BASE_URL } from './organization';

const categoryToLabel = {
  chair: 'Dental Chair',
  imaging: 'Dental Imaging Equipment',
  endo: 'Endodontics Equipment',
  curing: 'Curing and Filling Equipment',
  sterilization: 'Sterilization Equipment',
  accessories: 'Dental Accessory',
};

function inferBrand(slug = '', explicit) {
  if (explicit) return explicit;
  if (slug.startsWith('roson') || slug.startsWith('dx')) return 'ROSON';
  if (slug.startsWith('mecco')) return 'MECCO';
  if (slug.startsWith('denjoy') || ['meet-endo', 'free-pex', 'i-pexo', 'aike', 'imate3'].includes(slug)) return 'Denjoy';
  if (slug.includes('autoclave')) return 'EasyClave';
  return 'DentaSource Direct';
}

export function productGraph(product, overrides = {}) {
  const brand = inferBrand(product.slug, product.brand || overrides.brand);
  const categoryKey = overrides.category || product.category;
  const categoryLabel = categoryToLabel[categoryKey] || 'Dental Equipment';
  const urlPath = overrides.urlPath || `/products/${product.slug}`;
  const images = (product.images || []).map((img) =>
    img?.startsWith('http') ? img : `${BASE_URL}${img}`
  );
  const warrantyDays = categoryKey === 'chair' ? 730 : 365;

  const graph = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${BASE_URL}${urlPath}#product`,
    name: product.name,
    description: product.description || product.shortDesc || product.tagline,
    sku: product.slug,
    category: categoryLabel,
    brand: { '@type': 'Brand', name: brand },
    manufacturer: { '@type': 'Organization', name: brand },
    image: images.length > 0 ? images : undefined,
    url: `${BASE_URL}${urlPath}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PHP',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: `${BASE_URL}${urlPath}`,
      seller: { '@id': `${BASE_URL}/#organization` },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'PH',
        returnPolicyCategory:
          'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'PH' },
        shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'PHP' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 14,
            unitCode: 'DAY',
          },
        },
      },
      warranty: {
        '@type': 'WarrantyPromise',
        durationOfWarranty: {
          '@type': 'QuantitativeValue',
          value: warrantyDays,
          unitCode: 'DAY',
        },
        warrantyScope:
          categoryKey === 'chair'
            ? 'Year 1: parts + service. Year 2: service only.'
            : '1-year parts and service warranty.',
      },
    },
    additionalProperty: product.specs
      ? Object.entries(product.specs).map(([key, value]) => ({
          '@type': 'PropertyValue',
          name: key,
          value: String(value),
        }))
      : undefined,
  };

  return graph;
}

export function breadcrumbGraph(product, urlPath) {
  const categoryKey = product.category;
  const path = urlPath || `/products/${product.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Products',
        item: `${BASE_URL}/products`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryToLabel[categoryKey] || 'Dental Equipment',
        item: `${BASE_URL}/products?c=${categoryKey}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `${BASE_URL}${path}`,
      },
    ],
  };
}
