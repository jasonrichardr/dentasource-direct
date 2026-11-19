import ChairSchemas from "@/components/ChairSchemas";
import ChairPage from "@/components/chair/ChairPage";
import s6 from "@/data/chairs/s6";

// The S6 runs on the shared chair template: every word and photo on this page comes from
// src/data/chairs/s6.js, and the sections come from src/components/chair/. The spec table is
// still behind SpecGate (inside the template), and the JSON-LD is unchanged.

export const metadata = {
  title: "ROSON Professional Model S6 Dental Chair",
  description:
    "Lowers to 380 mm, the lowest in the ROSON range, on a casting steel frame. See the S6 at our Pasig showroom.",
  openGraph: {
    title: "ROSON Professional Model S6 Dental Chair",
    description:
      "Lowers to 380 mm, the lowest in the ROSON range, on a casting steel frame. See the S6 at our Pasig showroom.",
    url: "https://dentasourcedirect.com/s6",
    type: "website",
    images: ["/images/hero/dxa3-hero-original.jpg"],
  },
};

export default function S6Page() {
  return (
    <main className="min-h-screen">
      <ChairSchemas route="/s6" />
      <ChairPage chair={s6} />
    </main>
  );
}
