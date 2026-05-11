import { newsData } from '@/data/news';
import { denjoyProducts } from '@/data/denjoy';

const BASE_URL = 'https://dentasourcedirect.com';

const staticRoutes = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/dentalchairs', priority: 0.95, changeFrequency: 'weekly' },
  { path: '/denjoy', priority: 0.95, changeFrequency: 'weekly' },
  { path: '/products', priority: 0.85, changeFrequency: 'weekly' },
  { path: '/services', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/trade-in', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/traceability', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/news', priority: 0.7, changeFrequency: 'weekly' },
  // Canonical ROSON chair landing pages
  { path: '/a3', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/a3l', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/a3s', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/s3', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/s6', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/s9', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/n1', priority: 0.75, changeFrequency: 'monthly' },
  { path: '/n2-plus', priority: 0.75, changeFrequency: 'monthly' },
  { path: '/n2-pro', priority: 0.75, changeFrequency: 'monthly' },
];

export default function sitemap() {
  const now = new Date();

  const staticEntries = staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const denjoyEntries = (denjoyProducts || [])
    .filter((p) => !p.isFlagship)
    .map((item) => ({
      url: `${BASE_URL}/denjoy/${item.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: item.slug === 'meet-endo' ? 0.95 : 0.85,
    }));

  const newsEntries = (newsData || []).map((article) => ({
    url: `${BASE_URL}/news/${article.slug}`,
    lastModified: article.date ? new Date(article.date) : now,
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  return [...staticEntries, ...denjoyEntries, ...newsEntries];
}
