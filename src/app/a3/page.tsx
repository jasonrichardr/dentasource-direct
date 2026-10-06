import ChairSchemas from "@/components/ChairSchemas";
import ChairPage from "@/components/chair/ChairPage";
import a3 from "@/data/chairs/a3";

// The A3 is the pilot of the shared chair template: every word and photo on this page comes
// from src/data/chairs/a3.js, and the sections come from src/components/chair/. The spec
// table is still behind SpecGate (inside the template), and the JSON-LD is unchanged.

export const metadata = {
  title: "ROSON Flagship Model A3 Dental Chair",
  description:
    "EOW waterline disinfection, a medical-grade color touchscreen and hands-free cup filling, built in as standard. See the A3 at our Pasig showroom.",
  openGraph: {
    title: "ROSON Flagship Model A3 Dental Chair",
    description:
      "EOW waterline disinfection, a medical-grade color touchscreen and hands-free cup filling, built in as standard. See the A3 at our Pasig showroom.",
    url: "https://dentasourcedirect.com/a3",
    type: "website",
    images: ["/images/hero/dxa3-hero-original.jpg"],
  },
};

export default function A3Page() {
  return (
    <main className="min-h-screen">
      <ChairSchemas route="/a3" />
      <ChairPage chair={a3} />
    </main>
  );
}
