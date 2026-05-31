import ChairSchemas from "@/components/ChairSchemas";
import A3LHeroVisual from "@/components/a3l/A3LHeroVisual";
import A3LFeatureGrid from "@/components/a3l/A3LFeatureGrid";
import A3LFashionSection from "@/components/a3l/A3LFashionSection";
import A3LErgonomicsSection from "@/components/a3l/A3LErgonomicsSection";
import A3LTechSpecs from "@/components/a3l/A3LTechSpecs";
import A3LProductConfigurator from "@/components/a3l/A3LProductConfigurator";
import A3LVisualTour from "@/components/a3l/A3LVisualTour";
import A3LWhatsInTheBox from "@/components/a3l/A3LWhatsInTheBox";
import A3LWarrantyTable from "@/components/a3l/A3LWarrantyTable";

export const metadata = {
    title: "ROSON Fashion Model A3L Dental Chair",
    description: "Same A3 flagship platform with fashion-forward design customization. Whisper-Silent Motor, medical-grade LCD, anti-collision safety, and EOW-TECH disinfection available.",
};

export default function A3LPage() {
    return (
        <main className="min-h-screen font-[family-name:var(--font-geist-sans)]">
            <ChairSchemas route="/a3l" />
            <A3LHeroVisual />
            <A3LFeatureGrid />
            <A3LFashionSection />
            <A3LErgonomicsSection />
            <A3LTechSpecs />
            <A3LProductConfigurator />
            <A3LVisualTour />
            <A3LWhatsInTheBox />
            <A3LWarrantyTable />
        </main>
    );
}
