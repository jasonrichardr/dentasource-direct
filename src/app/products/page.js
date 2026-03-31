import CatalogHero from '@/components/products/CatalogHero';
import ProductGrid from '@/components/products/ProductGrid';
import { products as staticProducts, categories as staticCategories } from '@/data/products';

export const metadata = {
  title: 'Premium Dental Equipment Catalog',
  description: 'Browse our full catalog of dental equipment — imaging, endodontics, curing lights, sterilization, and accessories from trusted global brands.',
};

export default function ProductsPage() {
  // Map static data to match the shape ProductGrid expects (Prisma-like nested category)
  const products = staticProducts.map((p, i) => ({
    id: p.slug,
    slug: p.slug,
    name: p.name,
    image: p.heroImage || (p.images && p.images[0]) || null,
    category: { name: p.category },
  }));

  // Build unique category list from product data
  const categorySet = [...new Set(staticProducts.map(p => p.category))];
  const categories = categorySet.sort().map(name => ({ id: name, name }));

  return (
    <main className="w-full min-h-screen bg-white selection:bg-[#10b981] selection:text-white pb-24">
      <CatalogHero />
      <ProductGrid initialProducts={products} categories={categories} />
    </main>
  );
}
