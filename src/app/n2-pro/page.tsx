import ChairSchemas from "@/components/ChairSchemas";
import ChairPage from "@/components/chair/ChairPage";
import n2Pro from "@/data/chairs/n2-pro";

// The N2 Pro on the shared chair template: every word and photo on this page comes from
// src/data/chairs/n2-pro.js, and the sections come from src/components/chair/. The spec
// table is still behind SpecGate (inside the template).

export const metadata = {
  title: "ROSON Elite Model N2 Pro Dental Chair",
  description:
    "The widest dentist tray in the N series and its own disinfectant water supply, built for heavy daily use. See it at our Pasig showroom.",
  alternates: { canonical: "https://dentasourcedirect.com/n2-pro" },
  openGraph: {
    title: "ROSON Elite Model N2 Pro Dental Chair",
    description:
      "The widest dentist tray in the N series and its own disinfectant water supply, built for heavy daily use. See it at our Pasig showroom.",
    url: "https://dentasourcedirect.com/n2-pro",
    type: "website",
    images: [
      {
        url: "https://dentasourcedirect.com/images/products/n2-pro/N2%20Pro%20Dental%20Chair/1-1.jpg",
        width: 1200,
        height: 1200,
        alt: "ROSON Elite Model N2 Pro dental chair",
      },
    ],
  },
};

export default function N2ProPage() {
  return (
    <main className="min-h-screen">
      <ChairSchemas route="/n2-pro" />
      <ChairPage chair={n2Pro} />
    </main>
  );
}
