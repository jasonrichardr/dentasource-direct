import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import { productGraph, breadcrumbGraph } from '@/lib/schemas/product';

export const revalidate = 0;

export default async function ProductDetailPage({ params }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      features: true
    }
  });

  if (!product) {
    notFound();
  }

  const schemaProduct = {
    slug: product.slug,
    name: product.name,
    description: product.description,
    tagline: product.tagline,
    shortDesc: product.shortDesc,
    category: product.category?.slug,
    images: product.image ? [product.image] : [],
    specs: product.specs,
  };

  return (
    <main className="w-full min-h-screen bg-white font-sans selection:bg-[#10b981] selection:text-white pt-24 pb-20">
      <JsonLd id={`product-${product.slug}`} data={productGraph(schemaProduct)} />
      <JsonLd id={`breadcrumb-${product.slug}`} data={breadcrumbGraph(schemaProduct)} />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div className="w-full lg:sticky lg:top-32">
            <ProductGallery image={product.image} alt={product.name} />
          </div>
          <div className="w-full">
            <ProductInfo product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}
