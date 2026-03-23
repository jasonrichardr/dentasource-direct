import S9HeroVisual from "@/components/s9/S9HeroVisual";
import S9FeatureGrid from "@/components/s9/S9FeatureGrid";
import S9DisinfectionSection from "@/components/s9/S9DisinfectionSection";
import S9ErgonomicsSection from "@/components/s9/S9ErgonomicsSection";
import S9TechSpecs from "@/components/s9/S9TechSpecs";
import S9ProductConfigurator from "@/components/s9/S9ProductConfigurator";
import S9VisualTour from "@/components/s9/S9VisualTour";
import S9WhatsInTheBox from "@/components/s9/S9WhatsInTheBox";
import S9WarrantyTable from "@/components/s9/S9WarrantyTable";

export const metadata = {
    title: "Roson S9 Affordable Luxury Dental Chair | DentaSource Direct",
    description: "The Roson S9 Affordable Luxury — EOW-TECH disinfection, whisper-quiet motor, 45-degree ergonomic panel, and premium features at a smart price.",
};

export default function S9Page() {
    return (
        <main className="min-h-screen font-[family-name:var(--font-geist-sans)]">
            <S9HeroVisual />
            <S9FeatureGrid />
            <S9DisinfectionSection />
            <S9ErgonomicsSection />
            <S9TechSpecs />
            <S9ProductConfigurator />
            <S9VisualTour />
            <S9WhatsInTheBox />
            <S9WarrantyTable />
        </main>
    );
}
