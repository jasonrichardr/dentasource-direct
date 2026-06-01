import ChairSchemas from "@/components/ChairSchemas";
import A3HeroVisual from "@/components/a3/A3HeroVisual";
import A3FeatureGrid from "@/components/a3/A3FeatureGrid";
import A3DisinfectionSection from "@/components/a3/A3DisinfectionSection";
import A3ErgonomicsSection from "@/components/a3/A3ErgonomicsSection";
import A3TechSpecs from "@/components/a3/A3TechSpecs";
import SpecGate from "@/components/SpecGate";
import A3ProductConfigurator from "@/components/a3/A3ProductConfigurator";
import A3VisualTour from "@/components/a3/A3VisualTour";
import A3WhatsInTheBox from "@/components/a3/A3WhatsInTheBox";
import A3WarrantyTable from "@/components/a3/A3WarrantyTable";

export const metadata = {
    title: "Roson A3 Flagship Dental Chair",
    description: "The Roson A3 flagship — medical-grade water disinfection, intelligent infrared sensors, and whisper-quiet TiMOTION lift system.",
  openGraph: {
    title: "Roson A3 Flagship Dental Chair",
    description: "The Roson A3 flagship — medical-grade water disinfection, intelligent infrared sensors, and whisper-quiet TiMOTION lift system.",
    url: 'https://dentasourcedirect.com/a3',
    type: 'website',
    images: ['/images/hero/dxa3-hero-original.jpg'],
  },
};

export default function A3Page() {
    return (
        <main className="min-h-screen font-[family-name:var(--font-geist-sans)]">
            <ChairSchemas route="/a3" />
            <A3HeroVisual />
            <A3FeatureGrid />
            <A3DisinfectionSection />
            <A3ErgonomicsSection />
            <SpecGate><A3TechSpecs /></SpecGate>
            <A3ProductConfigurator />
            <A3VisualTour />
            <A3WhatsInTheBox />
            <A3WarrantyTable />
        </main>
    );
}
