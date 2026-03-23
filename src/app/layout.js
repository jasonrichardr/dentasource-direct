import { Inter, Playfair_Display, Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

export const metadata = {
  title: {
    template: '%s | DentaSource Direct',
    default: 'DentaSource Direct — Premium Dental Equipment Philippines',
  },
  description: 'Premium dental chairs, imaging equipment, and clinical tools with white-glove installation. The largest showroom in the Philippines.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'DentaSource Direct',
  description: 'Premium dental equipment distributor in the Philippines. Exclusive ROSON and DENJOY partner.',
  url: 'https://dentasourcedirect.com',
  telephone: '+639625793024',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '610 C. Maybunga Rd',
    addressLocality: 'Pasig City',
    addressRegion: 'Metro Manila',
    addressCountry: 'PH',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '09:00',
    closes: '20:00',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${geistSans.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
