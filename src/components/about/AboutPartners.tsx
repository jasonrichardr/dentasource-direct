"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const partners = [
  {
    name: "ROSON",
    logo: "/images/brand/roson-logo-final.png",
    description:
      "Exclusive Philippine partner for dental chairs and units. 120+ countries, 100,000+ users, ISO 13485 certified.",
    logoWidth: 240,
    logoHeight: 60,
  },
  {
    name: "DENJOY",
    logo: "/images/brand/denjoy-logo-final.png",
    description:
      "Exclusive Philippine partner for endodontic equipment. European-standard technology trusted across Italy, Russia, and beyond.",
    logoWidth: 200,
    logoHeight: 80,
  },
];

export default function AboutPartners() {
  return (
    <section className="py-16 lg:py-24 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-emerald-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
              Exclusive Partnerships
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              World-Class Brands, Local Support
            </h2>
          </motion.div>
        </div>

        {/* Partner Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8 flex flex-col items-center text-center"
            >
              <div className="relative mb-6" style={{ width: partner.logoWidth, height: partner.logoHeight }}>
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-4">
                Exclusive Philippine Partner
              </span>
              <p className="text-gray-600 leading-relaxed">
                {partner.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
