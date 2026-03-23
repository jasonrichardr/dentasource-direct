import ChairsHero from '@/components/chairs/ChairsHero';
import ChairCatalog from '@/components/chairs/ChairCatalog';
import prisma from '@/lib/prisma';

export const revalidate = 0;

export const metadata = {
  title: 'Dental Chairs — ROSON Collection',
  description: 'Explore the complete ROSON dental chair lineup. From the flagship A3 to the budget-friendly S9, find the perfect chair for your practice.',
};

export default async function DentalChairsPage() {
  // Fetch only products in the dental chairs category
  const chairs = await prisma.product.findMany({
    where: { category: { slug: 'chair' } },
    include: { features: true },
    orderBy: { isFeatured: 'desc' }
  });

  return (
    <main className="w-full bg-white selection:bg-[#10b981] selection:text-white">
      <ChairsHero />
      <ChairCatalog initialChairs={chairs} />
    </main>
  );
}
