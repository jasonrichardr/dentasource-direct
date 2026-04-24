import { BASE_URL } from './organization';

export function articleGraph(article) {
  const dateIso = article.date ? new Date(article.date).toISOString() : undefined;
  const image =
    article.image &&
    (article.image.startsWith('http') ? article.image : `${BASE_URL}${article.image}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${BASE_URL}/news/${article.slug}#article`,
    headline: article.title,
    description: article.abstract,
    image: image ? [image] : undefined,
    datePublished: dateIso,
    dateModified: dateIso,
    url: `${BASE_URL}/news/${article.slug}`,
    mainEntityOfPage: `${BASE_URL}/news/${article.slug}`,
    author: { '@type': 'Organization', name: 'DentaSource Direct', url: BASE_URL },
    publisher: { '@id': `${BASE_URL}/#organization` },
    articleSection: 'News',
    inLanguage: 'en-PH',
  };
}
