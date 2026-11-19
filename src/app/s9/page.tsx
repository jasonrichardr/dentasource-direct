import ChairSchemas from "@/components/ChairSchemas";
import ChairPage from "@/components/chair/ChairPage";
import s9 from "@/data/chairs/s9";

// The S9 runs on the shared chair template: every word and photo on this page comes from
// src/data/chairs/s9.js, and the sections come from src/components/chair/. The spec table is
// still behind SpecGate (inside the template), and the JSON-LD is unchanged.

export const metadata = {
  title: "ROSON Affordable Luxury Model S9 Dental Chair",
  description:
    "EOW waterline disinfection, a 45° operation panel with three memory positions and one key drainage. See the S9 at our Pasig showroom.",
  openGraph: {
    title: "ROSON Affordable Luxury Model S9 Dental Chair",
    description:
      "EOW waterline disinfection, a 45° operation panel with three memory positions and one key drainage. See the S9 at our Pasig showroom.",
    url: "https://dentasourcedirect.com/s9",
    type: "website",
    images: ["/images/hero/dxa3-hero-original.jpg"],
  },
};

export default function S9Page() {
  return (
    <main className="min-h-screen">
      <ChairSchemas route="/s9" />
      <ChairPage chair={s9} />
    </main>
  );
}
