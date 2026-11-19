import A1ProSchemas from "@/components/a1-pro/A1ProSchemas";
import ChairPage from "@/components/chair/ChairPage";
import a1Pro from "@/data/chairs/a1-pro";

// The A1 Pro on the shared chair template: every word and photo on this page comes from
// src/data/chairs/a1-pro.js, and the sections come from src/components/chair/. The JSON-LD is
// still the A1 Pro's own (A1ProSchemas, with its FAQ graph), unchanged.

const DESCRIPTION =
  "A color-led chair on a 12 mm carbon steel frame, with the RS-07 stool and Rolight S light included. See it at our Pasig showroom.";

export const metadata = {
  title: "ROSON A1 Pro Dental Chair",
  description: DESCRIPTION,
  alternates: { canonical: "https://dentasourcedirect.com/a1-pro" },
  openGraph: {
    title: "ROSON A1 Pro Dental Chair",
    description: DESCRIPTION,
    url: "https://dentasourcedirect.com/a1-pro",
    type: "website",
    siteName: "DentaSource Direct",
    images: [
      {
        url: "https://dentasourcedirect.com/images/products/a1-pro/og-a1-pro-finest.jpg",
        width: 1200,
        height: 630,
        alt: "ROSON A1 Pro social card showing the three signature colors: ROSON Blue, Ballet Pink and Mint Green",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ROSON A1 Pro Dental Chair",
    description: DESCRIPTION,
    images: ["https://dentasourcedirect.com/images/products/a1-pro/og-a1-pro-finest.jpg"],
  },
};

export default function A1ProPage() {
  return (
    <main className="min-h-screen">
      <A1ProSchemas />
      <ChairPage chair={a1Pro} />
    </main>
  );
}
