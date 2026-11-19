import ChairSchemas from "@/components/ChairSchemas";
import ChairPage from "@/components/chair/ChairPage";
import a3l from "@/data/chairs/a3l";

// The A3L on the shared chair template: every word and photo on this page comes from
// src/data/chairs/a3l.js, and the sections come from src/components/chair/. The spec table is
// still behind SpecGate (inside the template), and the JSON-LD is unchanged.

export const metadata = {
  title: "ROSON Fashion Model A3L Dental Chair",
  description:
    "Flagship A3 engineering in seven unit colors and three upholsteries, with the RS06 stool included. See the A3L at our Pasig showroom.",
  openGraph: {
    title: "ROSON Fashion Model A3L Dental Chair",
    description:
      "Flagship A3 engineering in seven unit colors and three upholsteries, with the RS06 stool included. See the A3L at our Pasig showroom.",
    url: "https://dentasourcedirect.com/a3l",
    type: "website",
    images: ["/images/hero/dxa3-hero-original.jpg"],
  },
};

export default function A3LPage() {
  return (
    <main className="min-h-screen">
      <ChairSchemas route="/a3l" />
      <ChairPage chair={a3l} />
    </main>
  );
}
