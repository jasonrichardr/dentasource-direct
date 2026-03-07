import Link from "next/link";
import Image from "next/image";

const featuredProducts = [
  {
    id: "n2-pro",
    badge: "PROFESSIONAL SERIES",
    name: "Roson N2 Pro",
    tagline: "High-End Dental Chair",
    description: "A perfect balance of intuitive technology and luxurious patient comfort. Designed for clinics that demand excellence in every procedure.",
    href: "/n2-pro",
    image: "/images/products/n2-pro/N2 Pro Dental Chair/1-1.jpg",
  },
  {
    id: "a3s",
    badge: "SMART SERIES",
    name: "Roson A3S",
    tagline: "Smart Model Dental Chair",
    description: "Intelligent features and a cloud-like experience with reliable, durable components. The next generation of connected dental care.",
    href: "/a3s",
    image: "/images/products/a3s/A3S Dental Chair/1-8.jpg",
  },
  {
    id: "a3",
    badge: "PREMIUM SERIES",
    name: "Roson A3",
    tagline: "Premium Dental Chair",
    description: "Uncompromising quality and smart integration for the modern clinic. Built to withstand the rigors of continuous daily use.",
    href: "/a3",
    image: "/images/products/a3/A3 Dental Chair/img01.jpg",
  },
  {
    id: "s3",
    badge: "HOT-SELLING VALUE",
    name: "Roson S3",
    tagline: "Hot-Selling Dental Chair",
    description: "Premium ergonomic design with medical-grade control and exceptional durability. The perfect balance of cost and clinical performance.",
    href: "/s3",
    image: "/images/products/s3/S3 Dental Chair/S3_1.jpg",
  },
];

const standardProducts = [
  {
    id: "s9",
    name: "Roson S9",
    tagline: "Flagship Dental Chair",
    description: "The ultimate expression of dental engineering with zero-gravity ergonomics.",
    href: "/s9",
    image: "/images/products/s9/S9 Dental Chair/img01.jpg",
  },
  {
    id: "n2-plus",
    name: "Roson N2+",
    tagline: "Classic Dental Chair",
    description: "Durability, ergonomics, and superior patient comfort within a refined design.",
    href: "/n2-plus",
    image: "/images/products/n2-plus/N2+ Dental Chair/N2_Angle.jpg",
  },
  {
    id: "s6",
    name: "Roson S6",
    tagline: "Advanced Dental Chair",
    description: "Reliable, durable, and packed with essential clinical innovations.",
    href: "/s6",
    image: "/images/products/s6/S6 Dental Chair/S6_1.jpg",
  },
  {
    id: "n1",
    name: "Roson N1",
    tagline: "Classic Dental Chair",
    description: "Ergonomic design with intuitive medical-grade controls and reliable performance.",
    href: "/n1",
    image: "/images/products/n1/N1 Dental Chair/N1_1.jpg",
  },
];

export default function DentalChairsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 font-[family-name:var(--font-geist-sans)] text-white pt-24 pb-24 overflow-hidden relative">
      {/* Ambient Background Glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Featured Products (Best Sellers) */}
        <div className="flex flex-col gap-24 md:gap-32 mb-32">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 lg:gap-24 group`}
            >
              {/* Image Showcase */}
              <div className="w-full md:w-1/2 relative">
                <Link href={product.href} className="block relative aspect-[4/3] w-full rounded-2xl md:rounded-[2rem] bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 border border-white/5 overflow-hidden flex items-center justify-center p-8 lg:p-16 hover:border-white/10 transition-colors duration-500">
                  {/* Spotlight Glow */}
                  <div className="absolute inset-0 bg-sky-500/20 opacity-0 group-hover:opacity-100 blur-[80px] transition-opacity duration-700 pointer-events-none" />
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-8 lg:p-12 drop-shadow-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </Link>
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <p className="text-sky-400 font-medium tracking-[0.2em] text-xs mb-4">
                  {product.badge}
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-2">
                  {product.name}
                </h2>
                <h3 className="text-xl md:text-2xl text-zinc-500 font-light mb-6">
                  {product.tagline}
                </h3>
                <p className="text-zinc-400 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-lg">
                  {product.description}
                </p>

                <Link
                  href={product.href}
                  className="group/btn flex items-center gap-4 text-white hover:text-sky-400 transition-colors w-fit"
                >
                  <span className="text-sm font-medium tracking-wider uppercase">Explore Model</span>
                  <div className="h-[1px] w-8 bg-white/20 group-hover/btn:bg-sky-400 group-hover/btn:w-12 transition-all duration-300" />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover/btn:translate-x-1 transition-transform">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-24" />

        {/* Standard Products Grid */}
        <div className="mb-12">
          <h3 className="text-2xl md:text-3xl font-light tracking-tight mb-12 text-center">
            More from the <span className="text-zinc-500">Roson Lineup</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {standardProducts.map((product) => (
              <Link
                href={product.href}
                key={product.id}
                className="group bg-zinc-900/40 backdrop-blur-sm border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-500 hover:bg-zinc-800/40 flex flex-col h-full z-10 relative"
              >
                <div className="relative aspect-[4/3] w-full mb-8 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-sky-500/10 opacity-0 group-hover:opacity-100 blur-[40px] transition-opacity duration-500 pointer-events-none rounded-full" />
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-700 ease-out z-10 relative"
                  />
                </div>

                <div className="mt-auto border-t border-white/5 pt-6 group-hover:border-white/10 transition-colors relative z-10 bg-transparent">
                  <h4 className="text-xl font-light mb-1 group-hover:text-sky-400 transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-zinc-500 text-sm mb-4">
                    {product.tagline}
                  </p>
                  <p className="text-zinc-400 text-sm font-light line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
