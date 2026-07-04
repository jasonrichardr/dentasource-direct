import { Inter, Playfair_Display, Geist, Instrument_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import JsonLd from '@/components/JsonLd';
import { organizationGraph } from '@/lib/schemas/organization';
import { GoogleAnalytics } from '@next/third-parties/google';
import MetaPixel from '@/components/analytics/MetaPixel';
import FloatingChat from '@/components/FloatingChat';
import MotionProvider from '@/components/MotionProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
// SKU product-page template voice (rideradian DNA): grotesk display + mono labels.
const instrument = Instrument_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-instrument', display: 'swap' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono', display: 'swap' });

export const metadata = {
  title: {
    template: '%s | DentaSource Direct',
    default: 'DentaSource Direct — Premium Dental Equipment Philippines',
  },
  description:
    'Exclusive Philippine distributor for ROSON dental chairs, K-Clamps, and Denjoy endodontics. 140-sqm Pasig showroom, white-glove installation, hands-on training, 2-year warranty. Clinically backed by FFC Dental Clinic (5 branches).',
  keywords: [
    'dental equipment Philippines',
    'dental chairs Philippines',
    'ROSON Philippines',
    'K-Clamps Philippines',
    'Denjoy Philippines',
    'DentaSource Direct',
    'dental imaging Philippines',
    'dental supplies Manila',
    'endodontics Philippines',
    'endo motor Philippines',
    'dental showroom Pasig',
  ],
  metadataBase: new URL('https://dentasourcedirect.com'),
  openGraph: {
    title: 'DentaSource Direct. Your Growth Partner in Dentistry',
    description:
      'Exclusive Philippine distributor for ROSON, K-Clamps and Denjoy. Digitally Advanced Training Center. Philippines\' Largest Dental Showroom.',
    url: 'https://dentasourcedirect.com',
    siteName: 'DentaSource Direct',
    locale: 'en_PH',
    type: 'website',
    images: [{ url: '/images/og/dsd-real-dentasource-3.jpg', width: 1200, height: 630, alt: 'The real DentaSource — real footage from the showroom floor, conventions, and installs' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/og/dsd-real-dentasource-3.jpg'],
    title: 'DentaSource Direct. Your Growth Partner in Dentistry',
    description:
      'Exclusive Philippine distributor for ROSON, K-Clamps and Denjoy. Digitally Advanced Training Center. Philippines\' Largest Dental Showroom.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${geistSans.variable} ${instrument.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <MotionProvider>
        <MetaPixel />
        <JsonLd id="organization-graph" data={organizationGraph} />
        <Navbar />
        {children}
        <Footer />
        <FloatingChat />
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
        </MotionProvider>
      </body>
    </html>
  );
}
