import CatalogHero from '@/components/products/CatalogHero';
import ProductGrid from '@/components/products/ProductGrid';
import prisma from '@/lib/prisma';

export const revalidate = 0;

export const metadata = {
  title: 'Premium Dental Equipment Catalog',
  description: 'Browse our full catalog of dental equipment — imaging, endodontics, curing lights, sterilization, and accessories from trusted global brands.',
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <main className="w-full min-h-screen bg-white selection:bg-[#10b981] selection:text-white pb-24">
      <CatalogHero />
      <ProductGrid initialProducts={products} categories={categories} />
    </main>
  );
}
