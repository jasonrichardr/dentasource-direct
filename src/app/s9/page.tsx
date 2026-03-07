import S9HeroVisual from "@/components/s9/S9HeroVisual";
import S9FeatureGrid from "@/components/s9/S9FeatureGrid";
import S9ProductConfigurator from "@/components/s9/S9ProductConfigurator";
import S9VisualTour from "@/components/s9/S9VisualTour";
import S9WarrantyTable from "@/components/s9/S9WarrantyTable";

export const metadata = {
    title: "Roson Affordable Luxury Model S9 | DentaSource Direct",
    description: "Discover the Roson Model S9 dental chair. Uncompromised value, advanced clinical features, and ergonomic comfort for modern dental practices.",
};

export default function S9Page() {
    return (
        <main className="min-h-screen font-[family-name:var(--font-geist-sans)]">
            <S9HeroVisual />
            <S9FeatureGrid />
            <S9ProductConfigurator />
            <S9VisualTour />
            <S9WarrantyTable />

            {/* Simple Footer added for completeness */}
            <footer className="bg-zinc-950 text-white/50 text-center py-8 text-sm">
                <p>© {new Date().getFullYear()} DentaSource Direct. All rights reserved.</p>
                <p className="mt-2 text-xs opacity-50">Authorized Roson Distributor</p>
            </footer>
        </main>
    );
}
