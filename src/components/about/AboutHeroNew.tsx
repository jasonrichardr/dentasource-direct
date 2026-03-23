"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "140 sqm", label: "Showroom" },
  { value: "Open 7 Days", label: "Mon–Sun" },
  { value: "100+", label: "Clinics Equipped" },
  { value: "ISO 13485", label: "Certified" },
];

export default function AboutHeroNew() {
  return (
    <section className="relative w-full overflow-hidden bg-[#1E3A2E] text-white">
      {/* Subtle gradient depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#182e24] via-[#1E3A2E] to-[#12241c] z-0" />

      <div className="relative z-10 pt-28 sm:pt-36 md:pt-44 pb-16 sm:pb-20 md:pb-24 max-w-5xl mx-auto px-6 flex flex-col items-center text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/90">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            The Philippines&apos; Largest Dental Equipment Showroom
          </span>
        </motion.div>

        {/* Main headline — serif italic "Growth Partner" matching live site */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl tracking-tight mb-8"
        >
          Your <span className="text-[#F26522] italic font-serif pr-1">Growth Partner</span>
          <br className="hidden md:block" /> in Dentistry.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg md:text-xl text-white/60 font-light max-w-2xl mb-12 leading-relaxed"
        >
          DentaSource Direct was built on a simple belief: Filipino dentists deserve more than a supplier. They deserve a partner who shows up — with world-class equipment, hands-on training, and support that doesn&apos;t disappear after the sale.
        </motion.p>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="w-full max-w-3xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
                className="bg-[#1E3A2E]/80 backdrop-blur-sm px-5 py-6 text-center"
              >
                <span className="block text-xl sm:text-2xl font-bold text-white tracking-tight mb-1">
                  {stat.value}
                </span>
                <span className="block text-xs uppercase tracking-[0.15em] text-white/45">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
