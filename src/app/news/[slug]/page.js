import { newsData } from '@/data/news';
import { notFound } from 'next/navigation';
import { BASE_URL } from '@/lib/schemas/organization';
import ArticleContent from './ArticleContent';

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

    return <ArticleContent article={article} />;
}
