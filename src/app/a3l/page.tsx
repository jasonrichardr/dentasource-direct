import ChairSchemas from "@/components/ChairSchemas";
import A3LHeroVisual from "@/components/a3l/A3LHeroVisual";
import A3LFeatureGrid from "@/components/a3l/A3LFeatureGrid";
import A3LFashionSection from "@/components/a3l/A3LFashionSection";
import A3LErgonomicsSection from "@/components/a3l/A3LErgonomicsSection";
import A3LTechSpecs from "@/components/a3l/A3LTechSpecs";
import SpecGate from "@/components/SpecGate";
import A3LProductConfigurator from "@/components/a3l/A3LProductConfigurator";
import A3LVisualTour from "@/components/a3l/A3LVisualTour";
import A3LWhatsInTheBox from "@/components/a3l/A3LWhatsInTheBox";
import A3LWarrantyTable from "@/components/a3l/A3LWarrantyTable";
import ProductCinema from "@/cinema/product/ProductCinema";
import { productCinemaConfig } from "@/cinema/product/productConfig";

export const metadata = {
    title: "ROSON Fashion Model A3L Dental Chair",
    description: "Same A3 flagship platform with fashion-forward design customization. Whisper-Silent Motor, medical-grade LCD, anti-collision safety, and EOW-TECH disinfection available.",
  openGraph: {
    title: "ROSON Fashion Model A3L Dental Chair",
    description: "Same A3 flagship platform with fashion-forward design customization. Whisper-Silent Motor, medical-grade LCD, anti-collision safety, and EOW-TECH disinfection available.",
    url: 'https://dentasourcedirect.com/a3l',
    type: 'website',
    images: ['/images/hero/dxa3-hero-original.jpg'],
  },
};

export default function A3LPage() {
    return (
        <main className="min-h-screen font-[family-name:var(--font-geist-sans)]">
            <ChairSchemas route="/a3l" />
            <ProductCinema config={productCinemaConfig("a3l")}>
                <A3LHeroVisual />
                <A3LFeatureGrid />
                <A3LFashionSection />
                <A3LErgonomicsSection />
                <SpecGate><A3LTechSpecs /></SpecGate>
                <A3LProductConfigurator />
                <A3LVisualTour />
                <A3LWhatsInTheBox />
                <A3LWarrantyTable />
            </ProductCinema>
        </main>
    );
}
