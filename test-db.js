const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  console.log('Categories:', categories);

  const chairs = await prisma.product.findMany({
    where: { category: { slug: 'chair' } }
  });
  console.log(`Chairs found with slug 'chair': ${chairs.length}`);
  console.log('Chairs:', chairs);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
