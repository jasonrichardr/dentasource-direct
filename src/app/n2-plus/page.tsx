import ChairSchemas from "@/components/ChairSchemas";
import N2PlusHeroVisual from "@/components/n2-plus/N2PlusHeroVisual";
import N2PlusFeatureGrid from "@/components/n2-plus/N2PlusFeatureGrid";
import N2PlusCompleteSection from "@/components/n2-plus/N2PlusCompleteSection";
import N2PlusErgonomicsSection from "@/components/n2-plus/N2PlusErgonomicsSection";
import N2PlusTechSpecs from "@/components/n2-plus/N2PlusTechSpecs";
import SpecGate from "@/components/SpecGate";
import N2PlusProductConfigurator from "@/components/n2-plus/N2PlusProductConfigurator";
import N2PlusVisualTour from "@/components/n2-plus/N2PlusVisualTour";
import N2PlusWhatsInTheBox from "@/components/n2-plus/N2PlusWhatsInTheBox";
import N2PlusWarrantyTable from "@/components/n2-plus/N2PlusWarrantyTable";

export const metadata = {
    title: "Roson Classic Model N2+",
    description: "The Roson Classic Model N2+ — the most complete standard configuration in the N-series. Everything you need, nothing you don't.",
  openGraph: {
    title: "Roson Classic Model N2+",
    description: "The Roson Classic Model N2+ — the most complete standard configuration in the N-series. Everything you need, nothing you don't.",
    url: 'https://dentasourcedirect.com/n2-plus',
    type: 'website',
    images: ['/images/hero/dxa3-hero-original.jpg'],
  },
};

export default function N2PlusPage() {
    return (
        <main className="min-h-screen font-[family-name:var(--font-geist-sans)]">
            <ChairSchemas route="/n2-plus" />
            <N2PlusHeroVisual />
            <N2PlusFeatureGrid />
            <N2PlusCompleteSection />
            <N2PlusErgonomicsSection />
            <SpecGate><N2PlusTechSpecs /></SpecGate>
            <N2PlusProductConfigurator />
            <N2PlusVisualTour />
            <N2PlusWhatsInTheBox />
            <N2PlusWarrantyTable />
        </main>
    );
}
