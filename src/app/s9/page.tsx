import ChairSchemas from "@/components/ChairSchemas";
import S9HeroVisual from "@/components/s9/S9HeroVisual";
import S9FeatureGrid from "@/components/s9/S9FeatureGrid";
import S9DisinfectionSection from "@/components/s9/S9DisinfectionSection";
import S9ErgonomicsSection from "@/components/s9/S9ErgonomicsSection";
import S9TechSpecs from "@/components/s9/S9TechSpecs";
import SpecGate from "@/components/SpecGate";
import S9ProductConfigurator from "@/components/s9/S9ProductConfigurator";
import S9VisualTour from "@/components/s9/S9VisualTour";
import S9WhatsInTheBox from "@/components/s9/S9WhatsInTheBox";
import S9WarrantyTable from "@/components/s9/S9WarrantyTable";
import ProductCinema from "@/cinema/product/ProductCinema";
import { productCinemaConfig } from "@/cinema/product/productConfig";

export const metadata = {
    title: "Roson S9 Affordable Luxury Dental Chair",
    description: "The Roson S9 Affordable Luxury — EOW-TECH disinfection, whisper-quiet motor, 45-degree ergonomic panel, and premium features at a smart price.",
  openGraph: {
    title: "Roson S9 Affordable Luxury Dental Chair",
    description: "The Roson S9 Affordable Luxury — EOW-TECH disinfection, whisper-quiet motor, 45-degree ergonomic panel, and premium features at a smart price.",
    url: 'https://dentasourcedirect.com/s9',
    type: 'website',
    images: ['/images/hero/dxa3-hero-original.jpg'],
  },
};

export default function S9Page() {
    return (
        <main className="min-h-screen font-[family-name:var(--font-geist-sans)]">
            <ChairSchemas route="/s9" />
            <ProductCinema config={productCinemaConfig("s9")}>
                <S9HeroVisual />
                <S9FeatureGrid />
                <S9DisinfectionSection />
                <S9ErgonomicsSection />
                <SpecGate><S9TechSpecs /></SpecGate>
                <S9ProductConfigurator />
                <S9VisualTour />
                <S9WhatsInTheBox />
                <S9WarrantyTable />
            </ProductCinema>
        </main>
    );
}
