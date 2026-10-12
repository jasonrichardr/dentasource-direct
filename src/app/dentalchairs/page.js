import ChairGallery from '@/components/chair/ChairGallery';
import { CHAIRS, INDEX_COPY } from '@/data/chairs/catalog';
import productsJson from '@/data/cinema/products.json';
import { visible } from '@/lib/cinema/visible';
import ClientMarquee from '@/components/clients/ClientMarquee';
import RingWrite from '@/components/clients/RingWrite';
import { brandStrip } from '@/lib/clients/brandMedia';

// ☠️ HIDDEN AT MODULE SCOPE, LIKE EVERY OTHER MANIFEST READ. The studio can hide a product in
// products.json; a hidden chair leaves this gallery too, not only its own arc. The gallery's
// words and photos live in src/data/chairs/catalog.js; products.json only decides who shows.
const SHOWN = new Set(visible(productsJson.products).map((p) => p.slug));
const CHAIRS_SHOWN = CHAIRS.filter((c) => SHOWN.has(c.slug));
// three photographs, then a clip: installs, deliveries and booth days (lib/clients/brandMedia.js)
const STRIP = brandStrip('roson');

export const metadata = {
  title: 'ROSON Dental Chairs',
  description:
    'Every ROSON dental chair we carry, from the A3 flagship to the S series, photographed side by side. See them at our Pasig showroom.',
  openGraph: {
    title: 'ROSON Dental Chairs',
    description:
      'Every ROSON dental chair we carry, from the A3 flagship to the S series, photographed side by side. See them at our Pasig showroom.',
    url: 'https://dentasourcedirect.com/dentalchairs',
    type: 'website',
    images: ['/images/hero/dxa3-hero-original.jpg'],
  },
};

export default function DentalChairsPage() {
  return (
    <main className="w-full">
      <ChairGallery
        chairs={CHAIRS_SHOWN}
        copy={INDEX_COPY}
        clients={STRIP.length ? (
          <section className="ch-section" aria-label="ROSON chairs in our clients' clinics">
            <div className="ch-wrap">
              {/* ☠️ SEVEN WORDS, ALWAYS (Jarich, 2026-10-12), written in fire by RingWrite */}
              <div className="ch-head ch-head-center" data-reveal>
                <p className="ch-kicker">Our clients</p>
                <RingWrite as="h2" className="ch-h2" text="Delivered, installed and smiling in clinics nationwide" />
                <p className="ch-line">Booth days, deliveries and installs, from Pasig out to Mindoro and Bacolod. Tap any photo.</p>
              </div>
            </div>
            <ClientMarquee items={STRIP} label="ROSON chairs delivered and installed in our clients' clinics" />
          </section>
        ) : null}
      />
    </main>
  );
}
