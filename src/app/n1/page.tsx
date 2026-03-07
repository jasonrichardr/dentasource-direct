import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamic imports for performance
const N1HeroVisual = dynamic(() => import('@/components/n1/N1HeroVisual'));
const N1FeatureGrid = dynamic(() => import('@/components/n1/N1FeatureGrid'));
const N1ProductConfigurator = dynamic(() => import('@/components/n1/N1ProductConfigurator'));
const N1VisualTour = dynamic(() => import('@/components/n1/N1VisualTour'));
const N1WarrantyTable = dynamic(() => import('@/components/n1/N1WarrantyTable'));

export const metadata: Metadata = {
    title: 'Roson N1 Dental Chair | Classic Ergonomic Design',
    description: 'Explore the Roson Classic Model N1 Dental Chair. Engineered for comfort, efficiency, and reliability with an array of ergonomic features and configurations.',
};

export default function N1Page() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white font-[family-name:var(--font-geist-sans)] selection:bg-sky-500/30 selection:text-sky-200 overflow-x-hidden w-full">
            <N1HeroVisual />
            <N1ProductConfigurator />
            <N1FeatureGrid />
            <N1VisualTour />
            <N1WarrantyTable />
        </main>
    );
}
