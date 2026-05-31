'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Social proof badges
const socialProof = {
  'roson-dxa3': { label: 'Flagship', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-500', icon: '👑' },
  'roson-dxs3': { label: 'Best Seller', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-500', icon: '🏆' },
  'roson-dxn2-pro': { label: '80K+ Dentists', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-500', icon: '⭐' },
  'roson-dxs6': { label: 'Accessibility', color: 'from-violet-500 to-violet-600', bg: 'bg-violet-500', icon: '♿' },
  'roson-dxa3s': { label: '7+ Colors', color: 'from-rose-500 to-rose-600', bg: 'bg-rose-500', icon: '🎨' },
  'roson-s9': { label: 'Best Value', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-500', icon: '🔥' },
};

// Custom landing page routes
const customRoutes = {
  'roson-dxn2-pro': '/n2-pro',
  'roson-s9': '/s9',
  'roson-dxa3': '/a3',
  'roson-dxa3s': '/a3s',
  'roson-dxs3': '/s3',
  'roson-dxs6': '/s6',
  'roson-dxn2plus': '/n2-plus',
  'roson-dxn1': '/n1',
  'roson-dxa3l': '/a3l',
};

function Badge({ slug }) {
  const badge = socialProof[slug];
  if (!badge) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${badge.color} text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg`}>
      <span>{badge.icon}</span>
      {badge.label}
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-1">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}

// Image showcase
function ChairShowcase({ chair, badge, index, className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#F5F5F7] shadow-sm ${className}`}>
      {/* Subtle overlay for legibility on bright sunlit photos */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/20 to-transparent z-[5] pointer-events-none" />

      {/* Chair image */}
      <div className="relative w-full h-full flex items-center justify-center bg-[#F5F5F7]">
        {chair.image ? (
          <img
            src={chair.image}
            alt={chair.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-black/20 text-sm">No Image</div>
        )}
      </div>
    </div>
  );
}

export default function ChairCatalog({ initialChairs = [] }) {
  if (initialChairs.length === 0) {
    return (
      <section className="py-24 bg-white relative z-20 -mt-8 rounded-t-[2.5rem] md:rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[#86868B]">
          No chairs available at the moment.
        </div>
      </section>
    );
  }

  // Flagship top 3 — in display order
  const topSlugs = ['roson-dxa3', 'roson-dxn2-pro', 'roson-dxa3s'];
  const topChairs = topSlugs
    .map(slug => initialChairs.find(c => c.slug === slug))
    .filter(Boolean);
  const gridChairs = initialChairs.filter(c => !topSlugs.includes(c.slug));

  return (
    <section className="bg-white relative z-30 pt-16 sm:pt-20 md:pt-32 pb-12 sm:pb-16 md:pb-24 rounded-t-[2rem] sm:rounded-t-[2.5rem] md:rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-10 sm:mb-14 md:mb-20">
          <p className="text-[#F26522] font-semibold tracking-wider text-[10px] sm:text-xs uppercase mb-3">Featured Collection</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1D1D1F] tracking-tight">Our Top Models</h2>
        </div>

        {/* TOP FLAGSHIP MODELS */}
        <div className="mb-12 sm:mb-16 md:mb-32 flex flex-col gap-10 sm:gap-14 md:gap-0">
          {topChairs.map((chair, index) => {
            const isRightAligned = index % 2 !== 0;
            const targetUrl = customRoutes[chair.slug] || `/products/${chair.slug}`;
            const badge = socialProof[chair.slug];

            return (
              <div
                key={chair.id || index}
                className={`flex flex-col ${isRightAligned ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-6 sm:gap-8 md:gap-16 lg:gap-20 md:py-20 md:border-b md:border-black/5 md:last:border-0`}
              >
                {/* Image showcase */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  className="w-full md:w-1/2 group"
                >
                  <Link href={targetUrl} className="block cursor-pointer">
                    <ChairShowcase
                      chair={chair}
                      badge={badge}
                      index={index}
                      className="h-[260px] sm:h-[340px] md:h-[500px]"
                    />
                  </Link>
                </motion.div>

                {/* Text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: 0.1 }}
                  className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left"
                >
                  <h3 className="text-[#F26522] font-semibold tracking-wider text-[10px] sm:text-xs uppercase mb-2 sm:mb-3">{chair.tagline}</h3>
                  <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-[3.5rem] font-semibold text-[#1D1D1F] tracking-tight leading-tight mb-3 sm:mb-4 md:mb-6">{chair.name}</h2>
                  
                  {/* Short generic intro instead of long desc */}
                  <p className="text-[#86868B] text-sm sm:text-base leading-relaxed mb-4 max-w-lg mx-auto md:mx-0">
                    {chair.shortDesc || chair.description}
                  </p>

                  {/* Bulleted High-Impact Features */}
                  {chair.features && chair.features.length > 0 && (
                    <ul className="flex flex-col gap-2.5 sm:gap-3 mb-6 sm:mb-8 text-left max-w-lg mx-auto md:mx-0">
                      {chair.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <svg className="w-[1.125rem] h-[1.125rem] sm:w-5 sm:h-5 text-[#10b981] mt-[2px] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                          </svg>
                          <span className="text-[#1D1D1F] text-sm sm:text-base leading-snug">
                            {typeof feature === 'string' ? feature : (
                              <>
                                <strong className="font-semibold">{feature.title}</strong>
                                {feature.desc && <span className="text-[#86868B] font-normal ml-1">{feature.desc}</span>}
                              </>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                </motion.div>
              </div>
            );
          })}
        </div>

        {/* REMAINING MODELS */}
        {gridChairs.length > 0 && (
          <div className="pt-10 sm:pt-12 md:pt-16 border-t border-black/10">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h3 className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight">Explore More Models</h3>
              <p className="text-[#86868B] text-sm mt-3 max-w-2xl mx-auto">Reliable, high-performance dental units ready for your clinic.</p>
            </div>

            <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {gridChairs.map((chair, index) => {
                const targetUrl = customRoutes[chair.slug] || `/products/${chair.slug}`;
                const badge = socialProof[chair.slug];

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ delay: index * 0.08 }}
                    key={chair.id || index}
                    className="group flex flex-row sm:flex-col rounded-2xl sm:rounded-3xl overflow-hidden border border-black/[0.04] hover:border-black/10 hover:shadow-xl transition-all duration-300 bg-white"
                  >
                    {/* Image */}
                    <Link href={targetUrl} className="w-32 h-32 sm:w-full sm:h-56 lg:h-64 shrink-0 relative block cursor-pointer">
                      <ChairShowcase
                        chair={chair}
                        badge={badge}
                        index={index + 3}
                        className="h-full w-full !rounded-none sm:!rounded-none"
                      />
                    </Link>

                    {/* Text */}
                    <div className="flex flex-col flex-grow justify-center p-4 sm:p-6 sm:text-center">
                      <h4 className="text-[#F26522] font-semibold tracking-wide text-[10px] uppercase mb-1">{chair.tagline}</h4>
                      <h3 className="text-base sm:text-xl md:text-2xl font-semibold text-[#1D1D1F] tracking-tight mb-2">{chair.name}</h3>
                      
                      {/* Condensed feature list for smaller cards */}
                      {chair.features && chair.features.length > 0 ? (
                        <ul className="flex flex-col gap-1.5 mb-4 text-left">
                          {chair.features.slice(0, 2).map((feature, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <svg className="w-4 h-4 text-[#10b981] mt-[2px] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                              </svg>
                              <span className="text-[#86868B] text-xs sm:text-sm leading-snug line-clamp-2">
                                {typeof feature === 'string' ? feature : feature.title}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[#86868B] text-xs sm:text-sm leading-relaxed mb-3 sm:mb-5 line-clamp-2 sm:line-clamp-3">{chair.description}</p>
                      )}

                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
