'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function ProductGrid({ initialProducts = [], categories = [] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Create a mapping of category IDs to Category Names
  const categoryNames = ['All', ...categories.map(c => c.name)];

  const filteredProducts = initialProducts.filter(p => {
    if (activeCategory === 'All') return true;
    return p.category.name === activeCategory;
  });

  // Pre-mapped custom landing pages
  const customRoutes = {
    'roson-dxn2-pro': '/n2-pro',
    'roson-s9': '/s9',
    'roson-dxa3': '/a3',
    'roson-dxa3s': '/a3s',
    'roson-dxs3': '/s3',
    'roson-dxs6': '/s6',
    'roson-dxn2plus': '/n2-plus',
    'roson-dxn1': '/n1',
  };

  return (
    <section className="py-12 bg-white min-h-[60vh] relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 w-full max-w-[100vw] overflow-hidden">
          {categoryNames.map((catName) => (
            <button key={catName} onClick={() => setActiveCategory(catName)} className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${activeCategory === catName ? 'bg-[#1D1D1F] text-white shadow-md scale-105' : 'bg-[#F5F5F7] text-[#86868B] hover:bg-black/5 hover:text-[#1D1D1F]'}`}>
              {catName}
            </button>
          ))}
        </div>
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence>
            {filteredProducts.map((p) => {
              const targetUrl = customRoutes[p.slug] || `/products/${p.slug}`;
              return (
                <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="group flex flex-col h-full">
                  <Link href={targetUrl} className="block relative w-full pt-[100%] bg-[#F5F5F7] rounded-[2rem] overflow-hidden mb-6">
                    <div className="absolute top-6 left-6 z-20"><span className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-xs font-semibold text-[#1D1D1F] shadow-sm">{p.category.name}</span></div>
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-contain p-8 mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out" />
                    ) : (
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center text-black/10">No Image</div>
                    )}
                  </Link>
                  <div className="px-2 flex flex-col flex-1"><h3 className="text-xl font-semibold text-[#1D1D1F] mb-1">{p.name}</h3></div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
