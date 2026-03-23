import A3SHeroVisual from "@/components/a3s/A3SHeroVisual";
import A3SFeatureGrid from "@/components/a3s/A3SFeatureGrid";
import A3SColorSection from "@/components/a3s/A3SColorSection";
import A3SErgonomicsSection from "@/components/a3s/A3SErgonomicsSection";
import A3STechSpecs from "@/components/a3s/A3STechSpecs";
import A3SProductConfigurator from "@/components/a3s/A3SProductConfigurator";
import A3SVisualTour from "@/components/a3s/A3SVisualTour";
import A3SWhatsInTheBox from "@/components/a3s/A3SWhatsInTheBox";
import A3SWarrantyTable from "@/components/a3s/A3SWarrantyTable";

export const metadata = {
    title: "Roson A3S Smart Dental Chair | DentaSource Direct",
    description: "The Roson A3S Smart Series — 7 colors, seamless microfiber leather as standard, Rolight S with breathing lamp, and whisper-quiet motor system.",
};

export default function A3SPage() {
    return (
        <main className="min-h-screen font-[family-name:var(--font-geist-sans)]">
            <A3SHeroVisual />
            <A3SFeatureGrid />
            <A3SColorSection />
            <A3SErgonomicsSection />
            <A3STechSpecs />
            <A3SProductConfigurator />
            <A3SVisualTour />
            <A3SWhatsInTheBox />
            <A3SWarrantyTable />
        </main>
    );
}
