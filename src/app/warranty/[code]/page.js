import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import WarrantyCard from '@/components/warranty/WarrantyCard';

// Public, no-login warranty card. The customer opens dentasourcedirect.com/warranty/<code>.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { code } = await params;
  return {
    title: `Warranty ${code} — DentaSource Direct`,
    robots: { index: false, follow: false },
  };
}

export default async function WarrantyPage({ params }) {
  const { code } = await params;
  const w = await prisma.warranty.findUnique({ where: { code } });
  if (!w) notFound();

  const warranty = {
    code: w.code,
    clinicName: w.clinicName,
    contactName: w.contactName,
    productName: w.productName,
    serialNumber: w.serialNumber,
    purchaseDate: w.purchaseDate ? w.purchaseDate.toISOString() : null,
    warrantyStart: w.warrantyStart.toISOString(),
    warrantyEnd: w.warrantyEnd.toISOString(),
    coverage: w.coverage,
  };

  return <WarrantyCard warranty={warranty} />;
}
