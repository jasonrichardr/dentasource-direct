'use client';
import { motion } from 'framer-motion';

export default function CatalogHero() {
  return (
    <section className="pt-40 pb-16 bg-[#F5F5F7] px-4 sm:px-6 lg:px-8 relative overflow-hidden transform-gpu">
      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1D1D1F] mb-6">
          Precision instruments for <br className="hidden sm:block" /><span className="text-[#86868B]">every clinical workflow.</span>
        </motion.h1>
      </div>
    </section>
  );
}
