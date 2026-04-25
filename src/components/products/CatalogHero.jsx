'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CatalogHero() {
  return (
    <section className="pt-40 pb-16 bg-[#F5F5F7] px-4 sm:px-6 lg:px-8 relative overflow-hidden transform-gpu">
      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1D1D1F] mb-6"
        >
          Precision instruments for <br className="hidden sm:block" />
          <span className="text-[#86868B]">every clinical workflow.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <p className="text-[#86868B] text-base">Looking for dental chairs?</p>
          <Link
            href="/dentalchairs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D1D1F] text-white rounded-full font-medium hover:bg-black transition-colors"
          >
            View our dental chair lineup
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
