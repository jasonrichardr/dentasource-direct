import CatalogHero from '@/components/products/CatalogHero';
import ProductGrid from '@/components/products/ProductGrid';
import { products as staticProducts } from '@/data/products';

export const metadata = {
  title: 'Premium Dental Chair Catalog',
  description: 'Browse our full catalog of ROSON dental chairs — exclusive Philippine distributor. A3 Flagship, A3L Fashion, A3S, S-series, and N-series.',
};

export default function ProductsPage() {
  // Show ROSON dental chairs only. Other categories live on dedicated routes
  // (e.g. /denjoy for endodontics, /dentalchairs for the chair landing).
  const chairProducts = staticProducts
    .filter((p) => p.category === 'chair')
    .map((p) => ({
      id: p.slug,
      slug: p.slug,
      name: p.name,
      image: p.heroImage || (p.images && p.images[0]) || null,
      category: { name: 'Dental Chair' },
    }));

  const categories = [{ id: 'chair', name: 'Dental Chair' }];

  return (
    <main className="w-full min-h-screen bg-white selection:bg-[#10b981] selection:text-white pb-24">
      <CatalogHero />
      <ProductGrid initialProducts={chairProducts} categories={categories} />
    </main>
  );
}
