import N2ProLanding from "@/components/n2-pro-v2/N2ProLanding";
import N2ProSchemas from "@/components/n2-pro-v2/N2ProSchemas";

export const metadata = {
    title: { absolute: "ROSON N2 Pro Dental Chair Philippines — DentaSource Direct" },
    description:
        "Flagship N-series chair: 650×315mm dentist tray (widest in series), independent disinfectant water supply, 24V silent motor with soft start/stop, six microbiological certifications. CE marked. Exclusive in the Philippines through DentaSource Direct, Pasig showroom. 5-year motor warranty, local service.",
    alternates: { canonical: "https://dentasourcedirect.com/n2-pro" },
    openGraph: {
        title: "ROSON N2 Pro Dental Chair — DentaSource Direct Philippines",
        description:
            "Widest dentist tray in the N-series. Independent disinfectant water. Three-year motor warranty, local Pasig service center.",
        url: "https://dentasourcedirect.com/n2-pro",
        type: "website",
        images: [
            {
                url: "https://dentasourcedirect.com/images/products/n2-pro/N2%20Pro%20Dental%20Chair/1-1.jpg",
                width: 1200,
                height: 1200,
                alt: "ROSON N2 Pro dental chair — flagship N-series unit",
            },
        ],
    },
};

export default function N2ProPage() {
    return (
        <main className="min-h-screen bg-white">
            <N2ProSchemas />
            <N2ProLanding />
        </main>
    );
}
