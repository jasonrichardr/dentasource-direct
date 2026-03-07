import S3HeroVisual from "@/components/s3/S3HeroVisual";
import S3FeatureGrid from "@/components/s3/S3FeatureGrid";
import S3ProductConfigurator from "@/components/s3/S3ProductConfigurator";
import S3VisualTour from "@/components/s3/S3VisualTour";
import S3WarrantyTable from "@/components/s3/S3WarrantyTable";

export default function S3Page() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white font-[family-name:var(--font-geist-sans)] selection:bg-sky-500/30 selection:text-sky-200 overflow-x-hidden w-full">
            {/* 1. Hero Visualizer Area */}
            <S3HeroVisual />

            {/* 2. Interactive Product Configurator */}
            <S3ProductConfigurator />

            {/* 3. Parallax Feature Grid */}
            <S3FeatureGrid />

            {/* 4. Full-screen Lightbox Visual Tour */}
            <S3VisualTour />

            {/* 5. Clean Specification/Warranty Tables */}
            <S3WarrantyTable />
        </main>
    );
}
