import ChairSchemas from "@/components/ChairSchemas";
import ChairPage from "@/components/chair/ChairPage";
import n1 from "@/data/chairs/n1";

// The N1 on the shared chair template: every word and photo on this page comes from
// src/data/chairs/n1.js, and the sections come from src/components/chair/. The spec table is
// still behind SpecGate (inside the template), and the JSON-LD is unchanged.

export const metadata = {
  title: "ROSON Classic Model N1 Dental Chair",
  description:
    "One starter for air, water and electricity, and a right arm that swings clear for patients. See the N1 at our Pasig showroom.",
  openGraph: {
    title: "ROSON Classic Model N1 Dental Chair",
    description:
      "One starter for air, water and electricity, and a right arm that swings clear for patients. See the N1 at our Pasig showroom.",
    url: 'https://dentasourcedirect.com/n1',
    type: 'website',
    images: ['/images/hero/dxa3-hero-original.jpg'],
  },
};

export default function N1Page() {
  return (
    <main className="min-h-screen">
      <ChairSchemas route="/n1" />
      <ChairPage chair={n1} />
    </main>
  );
}
