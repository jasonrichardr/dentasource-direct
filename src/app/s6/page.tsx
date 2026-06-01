import ChairSchemas from "@/components/ChairSchemas";
import S6HeroVisual from "@/components/s6/S6HeroVisual";
import S6FeatureGrid from "@/components/s6/S6FeatureGrid";
import S6AccessibilitySection from "@/components/s6/S6AccessibilitySection";
import S6ErgonomicsSection from "@/components/s6/S6ErgonomicsSection";
import S6TechSpecs from "@/components/s6/S6TechSpecs";
import SpecGate from "@/components/SpecGate";
import S6ProductConfigurator from "@/components/s6/S6ProductConfigurator";
import S6VisualTour from "@/components/s6/S6VisualTour";
import S6WhatsInTheBox from "@/components/s6/S6WhatsInTheBox";
import S6WarrantyTable from "@/components/s6/S6WarrantyTable";

export const metadata = {
    title: "Roson S6 Professional Dental Chair",
    description: "The Roson S6 Professional — 380mm lowest position, casting steel frame, Philips LED lighting, and Whisper-Silent Motor.",
};

export default function S6Page() {
    return (
        <main className="min-h-screen font-[family-name:var(--font-geist-sans)]">
            <ChairSchemas route="/s6" />
            <S6HeroVisual />
            <S6FeatureGrid />
            <S6AccessibilitySection />
            <S6ErgonomicsSection />
            <SpecGate><S6TechSpecs /></SpecGate>
            <S6ProductConfigurator />
            <S6VisualTour />
            <S6WhatsInTheBox />
            <S6WarrantyTable />
        </main>
    );
}
