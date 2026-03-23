import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');
  
  // Dynamically import the ES module
  const { products } = await import('../src/data/products.js');

  // 1. Create Categories
  const categories = [
    { name: 'Dental Chairs', slug: 'chair', description: 'Premium clinical seating and delivery systems.' },
    { name: 'Imaging', slug: 'imaging', description: 'Advanced X-Ray and 3D imaging solutions.' },
    { name: 'Endodontics', slug: 'endo', description: 'Precision endodontic motors and apex locators.' },
    { name: 'Microscopes', slug: 'microscopes', description: 'High-clarity dental operative microscopes.' },
    { name: 'Motors', slug: 'motors', description: 'Implant and surgical motors.' },
    { name: 'Curing & Filling', slug: 'curing', description: '' },
    { name: 'Sterilization', slug: 'sterilization', description: '' },
    { name: 'Accessories', slug: 'accessories', description: '' }
  ];

  const categoryMap = {};
  for (const cat of categories) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    });
    categoryMap[cat.slug] = createdCat.id;
    console.log(`✅ Upserted Category: ${cat.name}`);
  }

  // 2. Loop through products and insert
  for (const productData of products) {
    if (!productData) continue;
    
    // We map product category exactly as it exists in products.js if available, 
    // otherwise fallback to a best guess.
    let catSlug = productData.category || 'chair'; 
    
    // The main identifier in the file is 'slug'
    const productSlug = productData.slug || productData.id;
    if (!productSlug) {
        console.warn('⚠️ Skipping a product without a slug:', productData.name);
        continue;
    }

    const categoryId = categoryMap[catSlug] || categoryMap['chair'];

    const specsJson = {};
    if (productData.specs) {
        if (Array.isArray(productData.specs)) {
            productData.specs.forEach(s => {
                specsJson[s.label] = s.value;
            });
        }
    }

    // Determine featured status based on badge or specific models
    const isFeatured = !!productData.badge || ['roson-s9', 'roson-dxa3', 'roson-n2-pro', 'roson-s6'].includes(productSlug);

    const mainImage = productData.heroImage || (productData.images && productData.images.length > 0 ? productData.images[0] : '');

    const createdProduct = await prisma.product.upsert({
      where: { slug: productSlug },
      update: {
        name: productData.name,
        tagline: productData.tagline || 'Premium Dental Equipment',
        description: productData.description || productData.shortDesc || '',
        image: mainImage,
        categoryId: categoryId,
        specs: specsJson,
        isFeatured: isFeatured
      },
      create: {
        name: productData.name,
        slug: productSlug,
        tagline: productData.tagline || 'Premium Dental Equipment',
        description: productData.description || productData.shortDesc || '',
        image: mainImage,
        categoryId: categoryId,
        specs: specsJson,
        isFeatured: isFeatured
      },
    });

    console.log(`✅ Upserted Product: ${productData.name}`);
    
    // First, clear existing features for this product to avoid duplicates on re-seed
    await prisma.feature.deleteMany({
      where: { productId: createdProduct.id }
    });

    if (productData.features && Array.isArray(productData.features)) {
        for (const feat of productData.features) {
            const title = typeof feat === 'string' ? feat : (feat.title || 'Feature');
            const desc = typeof feat === 'string' ? '' : (feat.description || '');
            
            await prisma.feature.create({
                data: {
                    title: title,
                    desc: desc,
                    icon: '✨',
                    productId: createdProduct.id
                }
            });
        }
        console.log(`   + Added ${productData.features.length} features for ${productData.name}`);
    }
  }

  console.log('🌲 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
