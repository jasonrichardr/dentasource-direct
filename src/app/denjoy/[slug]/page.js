import { notFound } from 'next/navigation';
import { getDenjoyBySlug, getCoStars, getFlagship } from '@/data/denjoy';
import CoStarDetail from '@/components/denjoy/CoStarDetail';

export async function generateStaticParams() {
  return getCoStars().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getDenjoyBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.fullName} — Denjoy | DentaSource Direct`,
    description: product.tagline,
  };
}

export default async function DenjoyProductPage({ params }) {
  const { slug } = await params;

  const flagship = getFlagship();
  if (slug === flagship.slug) {
    notFound();
  }

  const product = getDenjoyBySlug(slug);
  if (!product || product.isFlagship) {
    notFound();
  }

  return <CoStarDetail product={product} />;
}
