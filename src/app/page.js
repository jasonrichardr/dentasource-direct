import HeroSection from '@/components/home/HeroSection';
import BentoShowcase from '@/components/home/BentoShowcase';
import WhyUsSection from '@/components/home/WhyUsSection';
import VideoShowcase from '@/components/home/VideoShowcase';
import TraceabilitySection from '@/components/traceability/TraceabilitySection';
import ServicesSection from '@/components/home/ServicesSection';

export const metadata = {
  title: 'DentaSource Direct — Premium Dental Equipment Philippines',
  description: 'The Philippines\' largest dental equipment showroom. Premium ROSON dental chairs, imaging equipment, and clinical tools with white-glove installation and training.',
};

export default function Home() {
  return (
    <main className="w-full font-sans bg-white selection:bg-[#10b981] selection:text-white">
      <HeroSection />
      <BentoShowcase />
      <WhyUsSection />
      <VideoShowcase />
      <TraceabilitySection />
      <ServicesSection />
    </main>
  );
}
