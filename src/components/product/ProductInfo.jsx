'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ProductInfo({ product }) {
  return (
    <div className="flex flex-col py-8 lg:py-16 px-4 sm:px-8 lg:px-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1D1D1F] mb-6">{product.name}</h1>
        <p className="text-xl text-[#86868B] font-medium mb-10 leading-relaxed">{product.tagline}</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-16">
        <h3 className="text-2xl font-semibold text-[#1D1D1F] mb-6 border-b border-black/10 pb-4">Technical Specifications</h3>
        <ul className="divide-y divide-black/5">
          {Object.entries(product.specs).map(([key, value]) => (
            <li key={key} className="py-4 flex flex-col sm:flex-row sm:justify-between gap-2">
              <span className="text-[#86868B] font-medium">{key}</span>
              <span className="text-[#1D1D1F] font-medium text-right">{value}</span>
            </li>
          ))}
        </ul>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-black/10">
        <Link href={`/contact?interest=${product.slug}`} className="w-full sm:w-auto px-10 py-4 bg-[#0071E3] text-white rounded-full font-medium hover:bg-[#0077ED] transition-colors hover:shadow-lg text-center">Request a Quote</Link>
      </motion.div>
    </div>
  );
}
