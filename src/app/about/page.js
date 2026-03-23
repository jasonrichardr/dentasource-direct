import AboutDifference from '@/components/about/AboutDifference';
import AboutShowroom from '@/components/about/AboutShowroom';
import AboutTrainingCenter from '@/components/about/AboutTrainingCenter';
import AboutServiceJourney from '@/components/about/AboutServiceJourney';
import AboutROSON from '@/components/about/AboutROSON';
import AboutPartners from '@/components/about/AboutPartners';
import AboutNews from '@/components/about/AboutNews';

export const metadata = {
  title: 'About DentaSource Direct — Your Growth Partner in Dentistry',
  description: 'The Philippines\' largest dental equipment showroom. Exclusive ROSON and DENJOY distributor. White-glove installation, training programs, and 7-day-a-week support in Pasig City.',
};

export default function AboutPage() {
  return (
    <main className="w-full min-h-screen font-[family-name:var(--font-geist-sans)]">
      <AboutDifference />
      <AboutShowroom />
      <AboutTrainingCenter />
      <AboutServiceJourney />
      <AboutROSON />
      <AboutPartners />
      <AboutNews />
    </main>
  );
}
