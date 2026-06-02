import { Inter, Playfair_Display, Geist } from 'next/font/google';
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

export const metadata = {
  title: {
    template: '%s | DentaSource Direct',
    default: 'DentaSource Direct — Premium Dental Equipment Philippines',
  },
  description:
    'Exclusive Philippine distributor for ROSON dental chairs and Denjoy endodontics. 140-sqm Pasig showroom, white-glove installation, hands-on training, 2-year warranty. Clinically backed by FFC Dental Clinic (5 branches).',
  keywords: [
    'dental equipment Philippines',
    'dental chairs Philippines',
    'ROSON Philippines',
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
    title: 'DentaSource Direct — Premium Dental Equipment Philippines',
    description:
      'Exclusive Philippine distributor for ROSON and Denjoy. 140-sqm Pasig showroom. Clinically-owned by a practicing dentist.',
    url: 'https://dentasourcedirect.com',
    siteName: 'DentaSource Direct',
    locale: 'en_PH',
    type: 'website',
    images: [{ url: '/images/og/smx-booth-og.jpg', width: 1200, height: 630, alt: 'DentaSource Direct booth at the SMX dental convention' }],
    videos: [{ url: 'https://dentasourcedirect.com/videos/dsd-showcase.mp4', secureUrl: 'https://dentasourcedirect.com/videos/dsd-showcase.mp4', type: 'video/mp4', width: 720, height: 1280 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/og/smx-booth-og.jpg'],
    title: 'DentaSource Direct — Premium Dental Equipment Philippines',
    description:
      'Exclusive Philippine distributor for ROSON and Denjoy. 140-sqm Pasig showroom. Clinically-owned.',
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
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${geistSans.variable}`} suppressHydrationWarning>
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
