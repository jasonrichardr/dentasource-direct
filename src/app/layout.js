import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata = {
  title: {
    template: '%s | DentaSource Direct',
    default: 'DentaSource Direct — Premium Dental Equipment Philippines',
  },
  description: 'Premium dental chairs, imaging equipment, and clinical tools with white-glove installation, hands-on training, and personalized support. Exclusive ROSON distributor in the Philippines.',
  keywords: ['dental equipment', 'dental chairs', 'Philippines', 'ROSON', 'DentaSource Direct', 'dental imaging', 'dental supplies'],
  metadataBase: new URL('https://dentasourcedirect.com'),
  openGraph: {
    title: 'DentaSource Direct — Premium Dental Equipment Philippines',
    description: 'Premium dental chairs and equipment with white-glove installation, training, and easy trade-in options.',
    url: 'https://dentasourcedirect.com',
    siteName: 'DentaSource Direct',
    locale: 'en_PH',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
