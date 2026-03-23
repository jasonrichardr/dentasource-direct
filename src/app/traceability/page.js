import TraceabilitySection from '@/components/traceability/TraceabilitySection';

export const metadata = {
  title: '100% Traceability System | DentaSource Direct',
  description: 'Full transparency in every product\'s journey. From raw materials to your clinic, we trace quality at every stage.',
};

export default function TraceabilityPage() {
  return (
    <main className="w-full min-h-screen overflow-x-hidden pt-[120px] md:pt-28 bg-neutral-950">
      <TraceabilitySection />
    </main>
  );
}
