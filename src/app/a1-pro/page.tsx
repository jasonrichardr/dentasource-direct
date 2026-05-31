import A1ProLanding from '@/components/a1-pro/A1ProLanding';
import A1ProSchemas from '@/components/a1-pro/A1ProSchemas';

export const metadata = {
  title: { absolute: 'ROSON A1 Pro Fashionable Dental Chair | DentaSource Direct Philippines' },
  description:
    'Color-led dental chair for the new generation of dentists. 12 mm carbon-steel frame, 150 kg load, sleep-grade soft start/stop, Rolight S 8-LED tri-mode light, intelligent chair memory. Three signature colors (ROSON Blue, Ballet Pink, Mint Green) plus 33+ customization options. RS-07 stool included. Pasig showroom demos available.',
  alternates: { canonical: 'https://dentasourcedirect.com/a1-pro' },
  openGraph: {
    title: 'ROSON A1 Pro Fashionable Dental Chair',
    description:
      'The first dental unit built for the new generation of dentists. Premium engineering, color as a first-class design choice. Three signature colors, complete chair-stool-light kit, Pasig showroom demos.',
    url: 'https://dentasourcedirect.com/a1-pro',
    type: 'website',
    images: [
      {
        url: 'https://dentasourcedirect.com/images/products/a1-pro/og.jpg',
        width: 1200,
        height: 1200,
        alt: 'ROSON A1 Pro Fashionable dental chair — full unit with light arm and assistant tray',
      },
    ],
  },
};

export default function A1ProPage() {
  return (
    <main className="min-h-screen bg-white">
      <A1ProSchemas />
      <A1ProLanding />
    </main>
  );
}
