import ChairsHero from '@/components/chairs/ChairsHero';
import ChairCatalog from '@/components/chairs/ChairCatalog';
import { products } from '@/data/products';

export const metadata = {
  title: 'Dental Chairs — ROSON Collection',
  description: 'Explore the complete ROSON dental chair lineup. From the flagship A3 to the budget-friendly S9, find the perfect chair for your practice.',
};

export default function DentalChairsPage() {
  // Filter to dental chairs only and map to the shape ChairCatalog expects
  const chairs = products
    .filter(p => p.category === 'chair')
    .map(p => ({
      id: p.slug,
      slug: p.slug,
      name: p.name,
      tagline: p.tagline || '',
      description: p.description || '',
      shortDesc: p.shortDesc || '',
      image: p.heroImage || (p.images && p.images[0]) || '',
      isFeatured: !!p.badge || ['roson-s9', 'roson-dxa3', 'roson-dxn2-pro', 'roson-dxs6'].includes(p.slug),
      features: (p.features || []).map(f =>
        typeof f === 'string' ? { title: f, desc: '' } : { title: f.title || f, desc: f.description || '' }
      ),
    }));

  return (
    <main className="w-full bg-white selection:bg-[#10b981] selection:text-white">
      <ChairsHero />
      <ChairCatalog initialChairs={chairs} />
    </main>
  );
}
