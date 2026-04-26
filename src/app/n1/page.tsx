import ChairSchemas from "@/components/ChairSchemas";
import N1HeroVisual from "@/components/n1/N1HeroVisual";
import N1FeatureGrid from "@/components/n1/N1FeatureGrid";
import N1SimplicitySection from "@/components/n1/N1SimplicitySection";
import N1ErgonomicsSection from "@/components/n1/N1ErgonomicsSection";
import N1TechSpecs from "@/components/n1/N1TechSpecs";
import N1ProductConfigurator from "@/components/n1/N1ProductConfigurator";
import N1VisualTour from "@/components/n1/N1VisualTour";
import N1WhatsInTheBox from "@/components/n1/N1WhatsInTheBox";
import N1WarrantyTable from "@/components/n1/N1WarrantyTable";

export const metadata = {
    title: "Roson Classic Model N1 | DentaSource Direct",
    description: "The Roson Classic Model N1 — the simplest setup in the lineup. Proven N-series platform, one starter system, zero complexity.",
};

export default function N1Page() {
    return (
        <main className="min-h-screen font-[family-name:var(--font-geist-sans)]">
            <ChairSchemas route="/n1" />
            <N1HeroVisual />
            <N1FeatureGrid />
            <N1SimplicitySection />
            <N1ErgonomicsSection />
            <N1TechSpecs />
            <N1ProductConfigurator />
            <N1VisualTour />
            <N1WhatsInTheBox />
            <N1WarrantyTable />
        </main>
    );
}
