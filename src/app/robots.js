export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/products/roson-s9', '/a3-dental-chair'],
    },
    sitemap: 'https://dentasourcedirect.com/sitemap.xml',
  };
}
