import ChairSchemas from "@/components/ChairSchemas";
import ChairPage from "@/components/chair/ChairPage";
import n2Plus from "@/data/chairs/n2-plus";

// The N2 Plus on the shared chair template: every word and photo on this page comes from
// src/data/chairs/n2-plus.js, and the sections come from src/components/chair/. The spec
// table is still behind SpecGate (inside the template), and the JSON-LD is unchanged.

export const metadata = {
  title: "ROSON Classic Model N2 Plus Dental Chair",
  description:
    "The most complete standard build in the N series, with the tissue box, LED X-ray viewer and two water bottles fitted. See it at our Pasig showroom.",
  openGraph: {
    title: "ROSON Classic Model N2 Plus Dental Chair",
    description:
      "The most complete standard build in the N series, with the tissue box, LED X-ray viewer and two water bottles fitted. See it at our Pasig showroom.",
    url: "https://dentasourcedirect.com/n2-plus",
    type: "website",
    images: ["/images/hero/dxa3-hero-original.jpg"],
  },
};

export default function N2PlusPage() {
  return (
    <main className="min-h-screen">
      <ChairSchemas route="/n2-plus" />
      <ChairPage chair={n2Plus} />
    </main>
  );
}
