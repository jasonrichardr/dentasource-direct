import N2ProHeroVisual from "@/components/n2-pro/N2ProHeroVisual";
import N2ProFeatureGrid from "@/components/n2-pro/N2ProFeatureGrid";
import N2ProTrustSection from "@/components/n2-pro/N2ProTrustSection";
import N2ProErgonomicsSection from "@/components/n2-pro/N2ProErgonomicsSection";
import N2ProTechSpecs from "@/components/n2-pro/N2ProTechSpecs";
import N2ProProductConfigurator from "@/components/n2-pro/N2ProProductConfigurator";
import N2ProVisualTour from "@/components/n2-pro/N2ProVisualTour";
import N2ProWhatsInTheBox from "@/components/n2-pro/N2ProWhatsInTheBox";
import N2ProWarrantyTable from "@/components/n2-pro/N2ProWarrantyTable";

export const metadata = {
    title: "ROSON Elite Model N2 PRO Dental Chair | DentaSource Direct",
    description: "Trusted by 80,000+ dentists worldwide. The N2 PRO features the widest dentist table, 180° ceramic spittoon, and independent disinfectant water supply.",
};

export default function N2ProPage() {
    return (
        <main className="min-h-screen font-[family-name:var(--font-geist-sans)]">
            <N2ProHeroVisual />
            <N2ProFeatureGrid />
            <N2ProTrustSection />
            <N2ProErgonomicsSection />
            <N2ProTechSpecs />
            <N2ProProductConfigurator />
            <N2ProVisualTour />
            <N2ProWhatsInTheBox />
            <N2ProWarrantyTable />
        </main>
    );
}
