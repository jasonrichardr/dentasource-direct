import ChairGallery from '@/components/chair/ChairGallery';
import { CHAIRS, INDEX_COPY } from '@/data/chairs/catalog';
import productsJson from '@/data/cinema/products.json';
import { visible } from '@/lib/cinema/visible';
import { SectionHead } from '@/components/chair/parts';
import ClientMarquee from '@/components/clients/ClientMarquee';
import { clientsFor, listEvents, OWN_FOR_HEADLINE } from '@/lib/clients/boothClients';

// ☠️ HIDDEN AT MODULE SCOPE, LIKE EVERY OTHER MANIFEST READ. The studio can hide a product in
// products.json; a hidden chair leaves this gallery too, not only its own arc. The gallery's
// words and photos live in src/data/chairs/catalog.js; products.json only decides who shows.
const SHOWN = new Set(visible(productsJson.products).map((p) => p.slug));
const CHAIRS_SHOWN = CHAIRS.filter((c) => SHOWN.has(c.slug));
const CLIENTS = clientsFor('roson');
const CLIENTS_OWN = CLIENTS.own >= OWN_FOR_HEADLINE;

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
        clients={CLIENTS.items.length ? (
          <section className="ch-section" aria-label="Our clients">
            <div className="ch-wrap">
              <SectionHead
                center
                kicker={CLIENTS_OWN ? 'Our clients' : 'From our booth'}
                title={CLIENTS_OWN ? 'From the booth to the clinic' : 'Doctors at our booth'}
                line={`${CLIENTS.events.length ? `At ${listEvents(CLIENTS.events)}` : 'At our booth'}${CLIENTS_OWN ? ', and at the clinics where the chair now works' : ''}. Tap any photo.`}
              />
            </div>
            <ClientMarquee items={CLIENTS.items} label={CLIENTS_OWN ? 'Doctors with ROSON chairs at our booth and in their clinics' : 'Doctors at our booth'} />
          </section>
        ) : null}
      />
    </main>
  );
}
