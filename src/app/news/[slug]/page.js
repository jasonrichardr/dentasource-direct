import { newsData } from '@/data/news';
import { notFound } from 'next/navigation';
import { BASE_URL } from '@/lib/schemas/organization';
import JsonLd from '@/components/JsonLd';
import ArticleContent from './ArticleContent';

// NewsArticle schema already ships from ArticleContent via lib/schemas/article.js;
// this adds only the breadcrumb trail Google reads for site hierarchy.
function breadcrumbGraph(article) {
    const url = `${BASE_URL}/news/${article.slug}`;
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'News', item: `${BASE_URL}/news` },
            { '@type': 'ListItem', position: 3, name: article.title, item: url },
        ],
    };
}

export async function generateMetadata(props) {
    const params = await props.params;
    const article = newsData.find(item => item.slug === params.slug);
    if (!article) return {};

    const ogSource = article.ogImage || article.image;
    const ogImage = ogSource && (ogSource.startsWith('http') ? ogSource : `${BASE_URL}${ogSource}`);

    return {
        title: article.title,
        description: article.abstract,
        alternates: { canonical: `/news/${article.slug}` },
        openGraph: {
            title: article.title,
            description: article.abstract,
            url: `${BASE_URL}/news/${article.slug}`,
            siteName: 'DentaSource Direct',
            type: 'article',
            images: ogImage
                ? [article.ogImage
                    ? { url: ogImage, width: 1200, height: 630, alt: article.title }
                    : { url: ogImage, alt: article.title }]
                : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.abstract,
            images: ogImage ? [ogImage] : undefined,
        },
    };
}

export default async function NewsArticle(props) {
    const params = await props.params;
    const article = newsData.find(item => item.slug === params.slug);

    if (!article) {
        notFound();
    }

    return (
        <>
            <JsonLd id={`breadcrumb-${article.slug}`} data={breadcrumbGraph(article)} />
            <ArticleContent article={article} />
        </>
    );
}
