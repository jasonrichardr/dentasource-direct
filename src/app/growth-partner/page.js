import { newsData } from '@/data/news';
import GrowthPartner from './GrowthPartner';
import './gp.css';

export const metadata = {
  title: 'Growth Partner | DentaSource Direct Training Center',
  description: 'Digital Dentistry, Dental Assistant Training, Orthodontics with Orthostrategy, Endodontics, Prosthodontics, Oral Surgery, Aesthetics, and Practice Business at the DentaSource Direct Training Center in Pasig. See how we teach, then reserve your seat.',
  openGraph: {
    title: 'Your growth partner in dentistry',
    description: 'Eight hands-on courses at the DentaSource Direct Training Center, inside the largest dental showroom in the Philippines. Now open, more to come.',
    images: [{ url: '/images/og/growth-partner-2026-09-18b.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: ['/images/og/growth-partner-2026-09-18b.png'] },
};

const MONTHS = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12 };
function dateKey(s) {
  const m = /^([A-Za-z]+) (\d{1,2}), (\d{4})$/.exec(String(s || '').trim());
  if (!m) return 0;
  return Number(m[3]) * 10000 + (MONTHS[m[1]] || 0) * 100 + Number(m[2]);
}

export default function GrowthPartnerPage() {
  const news = [...newsData]
    .filter((a) => a.slug && a.title)
    .sort((a, b) => dateKey(b.date) - dateKey(a.date))
    .slice(0, 3)
    .map((a) => ({ slug: a.slug, title: a.title, date: a.date, image: a.image || a.ogImage || null, abstract: a.abstract || '' }));
  return <GrowthPartner news={news} />;
}
