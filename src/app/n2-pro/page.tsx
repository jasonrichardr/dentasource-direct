import HeroVisual from "@/components/HeroVisual";
import FeatureGrid from "@/components/FeatureGrid";
import ProductConfigurator from "@/components/ProductConfigurator";
import GalleryGrid from "@/components/GalleryGrid";
import TechnicalSpecsTable from "@/components/TechnicalSpecsTable";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 font-[family-name:var(--font-geist-sans)]">
      <HeroVisual />
      <FeatureGrid />
      <ProductConfigurator />
      <GalleryGrid />
      <TechnicalSpecsTable />

      {/* Simple Footer added for completeness */}
      <footer className="bg-zinc-950 text-white/50 text-center py-8 text-sm">
        <p>© {new Date().getFullYear()} DentaSource Direct. All rights reserved.</p>
        <p className="mt-2 text-xs opacity-50">Authorized Roson Distributor</p>
      </footer>
    </main>
  );
}
