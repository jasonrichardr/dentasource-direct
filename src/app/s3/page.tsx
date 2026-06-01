import ChairSchemas from "@/components/ChairSchemas";
import S3HeroVisual from "@/components/s3/S3HeroVisual";
import S3FeatureGrid from "@/components/s3/S3FeatureGrid";
import S3LightSection from "@/components/s3/S3LightSection";
import S3ErgonomicsSection from "@/components/s3/S3ErgonomicsSection";
import S3TechSpecs from "@/components/s3/S3TechSpecs";
import SpecGate from "@/components/SpecGate";
import S3ProductConfigurator from "@/components/s3/S3ProductConfigurator";
import S3VisualTour from "@/components/s3/S3VisualTour";
import S3WhatsInTheBox from "@/components/s3/S3WhatsInTheBox";
import S3WarrantyTable from "@/components/s3/S3WarrantyTable";

export const metadata = {
    title: "Roson S3 Best-Selling Dental Chair",
    description: "The Roson S3 Best Seller — brightest light at 35,000+ lux, autoclavable handle, detachable spittoon, and Whisper-Silent Motor.",
};

export default function S3Page() {
    return (
        <main className="min-h-screen font-[family-name:var(--font-geist-sans)]">
            <ChairSchemas route="/s3" />
            <S3HeroVisual />
            <S3FeatureGrid />
            <S3LightSection />
            <S3ErgonomicsSection />
            <SpecGate><S3TechSpecs /></SpecGate>
            <S3ProductConfigurator />
            <S3VisualTour />
            <S3WhatsInTheBox />
            <S3WarrantyTable />
        </main>
    );
}
