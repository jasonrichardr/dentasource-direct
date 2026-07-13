export const BASE_URL = 'https://dentasourcedirect.com';

export const organizationGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'DentaSource Direct',
      alternateName: ['DentaSource', 'DSD', 'DentaSource Direct Dental Supply'],
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/dsd-logo.png`,
      },
      foundingDate: '2024-10',
      description:
        'Exclusive Philippine distributor for ROSON dental chairs, K-Clamps, and Denjoy endodontics equipment. One of the largest dental equipment showrooms in the Philippines (140 sqm, Pasig City). Clinically backed by FFC Dental Clinic (5 branches, 30+ dentists).',
      sameAs: [
        'https://www.facebook.com/dentasource',
        'https://www.tiktok.com/@dentasourcedirect',
        'https://www.google.com/maps?cid=6544193348824466616',
      ],
      brand: [
        { '@type': 'Brand', name: 'ROSON' },
        { '@type': 'Brand', name: 'K-Clamps' },
        { '@type': 'Brand', name: 'Denjoy' },
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+63-962-579-3024',
        contactType: 'sales',
        areaServed: 'PH',
        availableLanguage: ['en', 'tl'],
      },
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${BASE_URL}/#localbusiness`,
      name: 'DentaSource Direct',
      image: `${BASE_URL}/images/showroom.jpg`,
      url: BASE_URL,
      telephone: '+63-962-579-3024',
      priceRange: '₱₱–₱₱₱',
      sameAs: ['https://www.google.com/maps?cid=6544193348824466616'],
      hasMap: 'https://www.google.com/maps?cid=6544193348824466616',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '610 C. Raymundo Ave',
        addressLocality: 'Pasig City',
        addressRegion: 'Metro Manila',
        postalCode: '1600',
        addressCountry: 'PH',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 14.5752,
        longitude: 121.0868,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '09:00',
          closes: '20:00',
        },
      ],
      parentOrganization: { '@id': `${BASE_URL}/#organization` },
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'DentaSource Direct',
      alternateName: ['DentaSource', 'DSD'],
      publisher: { '@id': `${BASE_URL}/#organization` },
      inLanguage: 'en-PH',
    },
  ],
};
