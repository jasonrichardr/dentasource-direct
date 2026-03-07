import { Metadata } from "next";
import N2PlusHeroVisual from "@/components/n2-plus/N2PlusHeroVisual";
import N2PlusFeatureGrid from "@/components/n2-plus/N2PlusFeatureGrid";
import N2PlusProductConfigurator from "@/components/n2-plus/N2PlusProductConfigurator";
import N2PlusVisualTour from "@/components/n2-plus/N2PlusVisualTour";
import N2PlusWarrantyTable from "@/components/n2-plus/N2PlusWarrantyTable";

export const metadata: Metadata = {
    title: "Roson Classic Model N2+ | DentaSource Direct",
    description: "The Roson Classic Model N2+ blends durability and modern ergonomics to elevate the standard of patient and practitioner comfort.",
};

export default function N2PlusPage() {
    return (
        <main className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 font-[family-name:var(--font-geist-sans)]">
            <article>
                {/* 1. Immersive Hero Section */}
                <N2PlusHeroVisual />

                {/* 2. Interactive Product Configurator */}
                <N2PlusProductConfigurator />

                {/* 3. Deep-Dive Feature Grid */}
                <div id="features">
                    <N2PlusFeatureGrid />
                </div>

                {/* 4. Visual Tour / Masonry Gallery */}
                <N2PlusVisualTour />

                {/* 5. Warranty Information */}
                <N2PlusWarrantyTable />
            </article>

            {/* Simple Footer added for completeness */}
            <footer className="bg-zinc-950 text-white/50 text-center py-8 text-sm">
                <p>© {new Date().getFullYear()} DentaSource Direct. All rights reserved.</p>
                <p className="mt-2 text-xs opacity-50">Authorized Roson Distributor</p>
            </footer>
        </main>
    );
}
