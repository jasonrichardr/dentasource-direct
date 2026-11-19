import ChairSchemas from "@/components/ChairSchemas";
import ChairPage from "@/components/chair/ChairPage";
import a3s from "@/data/chairs/a3s";

// The A3S on the shared chair template: every word and photo on this page comes from
// src/data/chairs/a3s.js, and the sections come from src/components/chair/. The spec table is
// still behind SpecGate (inside the template), and the JSON-LD is unchanged.

export const metadata = {
  title: "ROSON Smart Model A3S Dental Chair",
  description:
    "The A3 platform with seamless microfiber leather as standard, seven unit colors and the Rolight S light. See the A3S at our Pasig showroom.",
  openGraph: {
    title: "ROSON Smart Model A3S Dental Chair",
    description:
      "The A3 platform with seamless microfiber leather as standard, seven unit colors and the Rolight S light. See the A3S at our Pasig showroom.",
    url: "https://dentasourcedirect.com/a3s",
    type: "website",
    images: ["/images/hero/dxa3-hero-original.jpg"],
  },
};

export default function A3SPage() {
  return (
    <main className="min-h-screen">
      <ChairSchemas route="/a3s" />
      <ChairPage chair={a3s} />
    </main>
  );
}
