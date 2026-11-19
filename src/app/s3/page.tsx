import ChairSchemas from "@/components/ChairSchemas";
import ChairPage from "@/components/chair/ChairPage";
import s3 from "@/data/chairs/s3";

// The S3 on the shared chair template: every word and photo on this page comes from
// src/data/chairs/s3.js, and the sections come from src/components/chair/. The spec table is
// still behind SpecGate (inside the template), and the JSON-LD is unchanged.

export const metadata = {
  title: "ROSON Hot-Selling Model S3 Dental Chair",
  description:
    "An autoclavable light handle, a spittoon and suction filter that come off without tools, and a 6-way stool included. See the S3 at our Pasig showroom.",
  openGraph: {
    title: "ROSON Hot-Selling Model S3 Dental Chair",
    description:
      "An autoclavable light handle, a spittoon and suction filter that come off without tools, and a 6-way stool included. See the S3 at our Pasig showroom.",
    url: "https://dentasourcedirect.com/s3",
    type: "website",
    images: ["/images/hero/dxa3-hero-original.jpg"],
  },
};

export default function S3Page() {
  return (
    <main className="min-h-screen">
      <ChairSchemas route="/s3" />
      <ChairPage chair={s3} />
    </main>
  );
}
