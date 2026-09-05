import HeroSection from '@/components/home/HeroSection';
import MeetTheTeam from '@/components/home/MeetTheTeam';
import VideoShowcase from '@/components/home/VideoShowcase';
import BentoShowcase from '@/components/home/BentoShowcase';
import WhyUsSection from '@/components/home/WhyUsSection';
import TraceabilitySection from '@/components/traceability/TraceabilitySection';
import ServicesSection from '@/components/home/ServicesSection';

// The previous home page, kept reachable while the cinema settles (Q15: thirty days).
// It is NOT a second front door: noindex keeps it out of search, so the cinema stays the
// only page anyone lands on from Google.
export const metadata = {
  title: 'DentaSource Direct — Premium Dental Equipment Philippines',
  description: 'The Philippines\' largest dental equipment showroom. Premium ROSON dental chairs, imaging equipment, and clinical tools with white-glove installation and training.',
  robots: { index: false },
};

// The composition is the old one, section for section, in the old order. The one thing
// that did not come across is FloatingLounge: the room in the site layout replaces it,
// and two players on one page would talk over each other.
export default function ClassicHome() {
  return (
    <main className="w-full font-sans bg-white selection:bg-[#10b981] selection:text-white">
      <div className="bg-[#0A1410] px-4 pt-28 pb-3 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-white/60">
        You are viewing the previous DentaSource Direct home page
      </div>
      <HeroSection />
      <MeetTheTeam />
      <VideoShowcase />
      <BentoShowcase />
      <WhyUsSection />
      <TraceabilitySection />
      <ServicesSection />
    </main>
  );
}
