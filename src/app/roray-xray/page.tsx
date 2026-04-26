import RorayLanding from '@/components/roray-xray/RorayLanding';
import RoraySchemas from '@/components/roray-xray/RoraySchemas';

export const metadata = {
  title: 'ROSON RoRay Handheld Dental X-Ray | DentaSource Direct Philippines',
  description:
    'Handheld dental X-ray with 0.4mm ultra-fine focal spot, 100,000-cycle tube validation, and 9% full-coverage lead shielding. Exclusive ROSON distributor in the Philippines. Pasig showroom demos available.',
  alternates: { canonical: 'https://dentasourcedirect.com/roray-xray' },
  openGraph: {
    title: 'ROSON RoRay Handheld Dental X-Ray',
    description:
      '0.4mm ultra-fine focal spot. 20-year tube life. Full-coverage lead shielding. The complete digital radiography upgrade for Filipino dental clinics.',
    url: 'https://dentasourcedirect.com/roray-xray',
    type: 'website',
    images: [
      {
        url: 'https://dentasourcedirect.com/images/products/roray/hero.jpg',
        width: 840,
        height: 840,
        alt: 'ROSON RoRay handheld dental X-ray unit',
      },
    ],
  },
};

export default function RorayXrayPage() {
  return (
    <main className="min-h-screen bg-white">
      <RoraySchemas />
      <RorayLanding />
    </main>
  );
}
