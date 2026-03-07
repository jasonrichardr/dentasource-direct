import S6HeroVisual from "@/components/s6/S6HeroVisual";
import S6FeatureGrid from "@/components/s6/S6FeatureGrid";
import S6ProductConfigurator from "@/components/s6/S6ProductConfigurator";
import S6VisualTour from "@/components/s6/S6VisualTour";
import S6WarrantyTable from "@/components/s6/S6WarrantyTable";

export default function S6Page() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white font-[family-name:var(--font-geist-sans)] selection:bg-sky-500/30 selection:text-sky-200 overflow-x-hidden w-full">
            {/* 1. Hero Visualizer Area */}
            <S6HeroVisual />

            {/* 2. Interactive Product Configurator */}
            <S6ProductConfigurator />

            {/* 3. Parallax Feature Grid */}
            <S6FeatureGrid />

            {/* 4. Full-screen Lightbox Visual Tour */}
            <S6VisualTour />

            {/* 5. Clean Specification/Warranty Tables */}
            <S6WarrantyTable />
        </main>
    );
}
