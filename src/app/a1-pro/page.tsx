import A1RadianLanding from '@/components/a1-radian/A1RadianLanding';
import A1ProSchemas from '@/components/a1-pro/A1ProSchemas';

export const metadata = {
  title: { absolute: 'ROSON A1 Pro Dental Chair | DentaSource Direct Philippines' },
  description:
    'Color-led dental chair for the new generation of dentists. 12 mm carbon-steel frame, 150 kg load, sleep-grade soft start/stop, Rolight S 8-LED tri-mode light, intelligent chair memory. Three signature colors (ROSON Blue, Ballet Pink, Mint Green) plus 44 total colorways. RS-07 stool included. Pasig showroom demos available.',
  alternates: { canonical: 'https://dentasourcedirect.com/a1-pro' },
  openGraph: {
    title: 'ROSON A1 Pro Dental Chair',
    description:
      'A dental unit built for the new generation of dentists. Premium engineering, color as a first-class design choice. Three signature colors, complete chair-stool-light kit, Pasig showroom demos.',
    url: 'https://dentasourcedirect.com/a1-pro',
    type: 'website',
    siteName: 'DentaSource Direct',
    images: [
      {
        url: 'https://dentasourcedirect.com/images/products/a1-pro/og-a1-pro-pastel.jpg',
        width: 1200,
        height: 630,
        alt: 'ROSON A1 Pro in Ballet Pink — Color, Pastel: 3 signature colors, 44-color range, digital workflow',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ROSON A1 Pro Dental Chair',
    description:
      'A dental unit built for the new generation of dentists. Color as a first-class design choice — three signature colors, 44 colorways, complete chair-stool-light kit. Pasig showroom demos.',
    images: ['https://dentasourcedirect.com/images/products/a1-pro/og-a1-pro-pastel.jpg'],
  },
};

export default function A1ProPage() {
  return (
    <main className="min-h-screen bg-white">
      <A1ProSchemas />
      <A1RadianLanding />
    </main>
  );
}
