import CatalogHero from '@/components/products/CatalogHero';
import ProductGrid from '@/components/products/ProductGrid';
import { products as staticProducts } from '@/data/products';

export const metadata = {
  title: 'Equipment Catalog',
  description:
    'Imaging, endodontics, curing, sterilization, and accessories from DentaSource Direct. For dental chairs, see /dentalchairs.',
};

const categoryLabels = {
  imaging: 'Imaging',
  endo: 'Endodontics',
  microscopes: 'Microscopes',
  curing: 'Curing & Filling',
  sterilization: 'Sterilization',
  accessories: 'Accessories',
};

export default function ProductsPage() {
  // Equipment catalog excludes dental chairs — those have their own
  // canonical pages at /dentalchairs and /a3, /a3l, /a3s, /s3, /s6, /s9,
  // /n1, /n2-plus, /n2-pro.
  const equipment = staticProducts
    .filter((p) => p.category !== 'chair')
    .map((p) => ({
      id: p.slug,
      slug: p.slug,
      name: p.name,
      image: p.heroImage || (p.images && p.images[0]) || null,
      categorySlug: p.category,
      category: { name: categoryLabels[p.category] || p.category },
    }));

  const uniqueCategorySlugs = [...new Set(equipment.map((p) => p.categorySlug))];
  const categories = uniqueCategorySlugs
    .map((slug) => ({ id: slug, name: categoryLabels[slug] || slug }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="w-full min-h-screen bg-white selection:bg-[#10b981] selection:text-white pb-24">
      <CatalogHero />
      <ProductGrid initialProducts={equipment} categories={categories} />
    </main>
  );
}
