'use client';
import { useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Map product category to the contact-form `interest` dropdown value.
// Defaults to 'general' for categories without an exact match.
const categoryToInterest = {
  imaging: 'imaging',
  endo: 'endo',
  microscopes: 'microscopes',
  curing: 'general',
  sterilization: 'general',
  accessories: 'general',
};

export default function ProductGrid({ initialProducts = [], categories = [] }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const categoryNames = ['All', ...categories.map((c) => c.name)];

  const filteredProducts = initialProducts.filter((p) => {
    if (activeCategory === 'All') return true;
    return p.category.name === activeCategory;
  });

  return (
    <section className="py-12 bg-white min-h-[60vh] relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 w-full max-w-[100vw] overflow-hidden">
          {categoryNames.map((catName) => (
            <button
              key={catName}
              onClick={() => setActiveCategory(catName)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === catName
                  ? 'bg-[#1D1D1F] text-white shadow-md scale-105'
                  : 'bg-[#F5F5F7] text-[#86868B] hover:bg-black/5 hover:text-[#1D1D1F]'
              }`}
            >
              {catName}
            </button>
          ))}
        </div>
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          <AnimatePresence>
            {filteredProducts.map((p) => {
              const interest = categoryToInterest[p.categorySlug] || 'general';
              const inquireHref = `/contact?interest=${encodeURIComponent(interest)}`;
              const cardHref = p.detailPath || inquireHref;
              const ctaLabel = p.detailPath ? 'Learn more' : 'Inquire';
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group flex flex-col h-full"
                >
                  <Link
                    href={cardHref}
                    className="block relative w-full pt-[100%] bg-[#F5F5F7] rounded-[2rem] overflow-hidden mb-6"
                  >
                    <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
                      <span className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-xs font-semibold text-[#1D1D1F] shadow-sm">
                        {p.category.name}
                      </span>
                      {p.badge && (
                        <span className="px-3 py-1 bg-emerald-600 rounded-full text-xs font-semibold text-white shadow-sm">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image}
                        alt={p.name}
                        className="absolute inset-0 w-full h-full object-contain p-8 mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center text-black/10">
                        No Image
                      </div>
                    )}
                  </Link>
                  <div className="px-2 flex flex-col flex-1">
                    <h3 className="text-xl font-semibold text-[#1D1D1F] mb-2">{p.name}</h3>
                    <Link
                      href={cardHref}
                      className="text-sm font-medium text-[#1D1D1F] hover:text-[#10b981] transition-colors inline-flex items-center gap-1 mt-auto"
                    >
                      {ctaLabel}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
