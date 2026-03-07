import A3SHeroVisual from "@/components/a3s/A3SHeroVisual";
import A3SFeatureGrid from "@/components/a3s/A3SFeatureGrid";
import A3SProductConfigurator from "@/components/a3s/A3SProductConfigurator";
import A3SVisualTour from "@/components/a3s/A3SVisualTour";
import A3SWarrantyTable from "@/components/a3s/A3SWarrantyTable";

export const metadata = {
    title: "Roson A3S Dental Chair | DentaSource Direct",
    description: "Premium reliability and unparalleled comfort. Explore the advanced technological integrations of the Roson Smart Model KLT-6220 A3S.",
};

export default function A3SPage() {
    return (
        <main className="min-h-screen bg-white">
            <A3SHeroVisual />
            <A3SFeatureGrid />
            <A3SProductConfigurator />
            <A3SVisualTour />
            <A3SWarrantyTable />

            {/* Simple Footer added for completeness */}
            <footer className="bg-gray-900 py-12 text-center text-gray-400">
                <p>© {new Date().getFullYear()} DentaSource Direct. All rights reserved.</p>
            </footer>
        </main>
    );
}
