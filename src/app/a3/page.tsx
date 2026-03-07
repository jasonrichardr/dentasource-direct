import A3HeroVisual from "@/components/a3/A3HeroVisual";
import A3FeatureGrid from "@/components/a3/A3FeatureGrid";
import A3ProductConfigurator from "@/components/a3/A3ProductConfigurator";
import A3VisualTour from "@/components/a3/A3VisualTour";
import A3WarrantyTable from "@/components/a3/A3WarrantyTable";

export default function A3Page() {
    return (
        <main className="min-h-screen font-[family-name:var(--font-geist-sans)]">
            <A3HeroVisual />
            <A3FeatureGrid />
            <A3ProductConfigurator />
            <A3VisualTour />
            <A3WarrantyTable />

            {/* Simple Footer added for completeness */}
            <footer className="bg-zinc-950 text-white/50 text-center py-8 text-sm">
                <p>© {new Date().getFullYear()} DentaSource Direct. All rights reserved.</p>
                <p className="mt-2 text-xs opacity-50">Authorized Roson Distributor</p>
            </footer>
        </main>
    );
}
