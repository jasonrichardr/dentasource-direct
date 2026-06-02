'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import ChairInteractiveDial from './ChairInteractiveDial';

export default function BentoShowcase() {
  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-[#F5F5F7] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 sm:mb-16 md:mb-20 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#1D1D1F] mb-4">Precision instruments for <br/><span className="text-[#86868B]">the modern practice.</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 auto-rows-auto md:auto-rows-[400px]">
          <motion.div whileHover={{ scale: 0.99 }} className="md:col-span-2 md:row-span-2 rounded-[2rem] p-8 md:p-10 flex flex-col relative overflow-hidden shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)] transition-all min-h-[450px] md:min-h-0 isolate group">
            <Image src="/images/home/authentic-a3.png" alt="A3 Dental Chair Clinic" fill sizes="(max-width: 768px) 100vw, 66vw" priority className="object-cover object-right -z-20 group-hover:scale-[1.02] transition-transform duration-1000 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-r md:bg-gradient-to-r from-white/95 via-white/70 to-transparent sm:w-2/3 -z-10"></div>
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/80 to-transparent md:hidden -z-10"></div>

            <div className="relative z-10 max-w-sm">
              <h3 className="text-3xl font-semibold text-[#1D1D1F] mb-2">Dental Chairs</h3>
              <p className="text-[#515154] text-sm md:text-base leading-relaxed mb-4">
                Every angle, feature, and dimension relies on millimeter precision. Engineered to perfection.
              </p>
              <div className="flex items-center gap-4 mb-6 md:mb-8 mt-6">
                  <div className="h-8 w-28 relative shrink-0">
                    <Image src="/images/brand/roson-logo-final.png" alt="Roson Dental" fill className="object-contain object-left" />
                  </div>
                  <div className="flex flex-col gap-1.5 border-l border-black/10 pl-4 py-0.5">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53-1.595-1.595a.75.75 0 10-1.06 1.06l2.125 2.125a.75.75 0 001.14-.094l3.846-5.388z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[10px] sm:text-[11px] text-[#86868B] uppercase tracking-wider font-semibold">5-Year Warranty</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53-1.595-1.595a.75.75 0 10-1.06 1.06l2.125 2.125a.75.75 0 001.14-.094l3.846-5.388z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[10px] sm:text-[11px] text-[#86868B] uppercase tracking-wider font-semibold">Researched & Developed</span>
                    </div>
                  </div>
              </div>
              <Link href="/dentalchairs" className="inline-flex items-center text-sm font-semibold text-[#0071E3] hover:text-[#2997FF] hover:underline underline-offset-4 transition-colors bg-white/50 backdrop-blur-md px-4 py-2 rounded-full">Explore models →</Link>
            </div>
          </motion.div>
          
          <motion.div whileHover={{ scale: 0.99 }} className="rounded-[2rem] p-6 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-xl transition-all min-h-[300px] md:min-h-0 isolate group bg-gradient-to-br from-[#EDF1F4] to-[#DBE2E8]">
            <Image src="/images/home/authentic-xray.png" alt="ROSON dental X-ray imaging" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover object-center -z-20 group-hover:scale-[1.04] transition-transform duration-700" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/[0.04] via-transparent to-black/[0.10]"></div>
            <h3 className="relative z-10 w-max text-lg font-semibold text-[#1D1D1F] bg-white/75 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm ring-1 ring-black/[0.04]">X-Rays</h3>
            <Link href="/products?category=imaging" className="relative z-10 w-max inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 bg-white/75 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm ring-1 ring-black/[0.04] hover:bg-white transition">Learn more →</Link>
          </motion.div>

          <motion.div whileHover={{ scale: 0.99 }} className="rounded-[2rem] p-6 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-xl transition-all min-h-[300px] md:min-h-0 isolate group bg-gradient-to-br from-[#EDF1F4] to-[#DBE2E8]">
            <Image src="/images/home/authentic-endo.png" alt="Denjoy endodontic cart and motor" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover object-center -z-20 group-hover:scale-[1.04] transition-transform duration-700" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/[0.04] via-transparent to-black/[0.10]"></div>
            <h3 className="relative z-10 w-max text-lg font-semibold text-[#1D1D1F] bg-white/75 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm ring-1 ring-black/[0.04]">Endodontics</h3>
            <Link href="/products?category=endo" className="relative z-10 w-max inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 bg-white/75 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm ring-1 ring-black/[0.04] hover:bg-white transition">Learn more →</Link>
          </motion.div>

          <motion.div whileHover={{ scale: 0.99 }} className="md:col-span-3 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center relative overflow-hidden shadow-sm hover:shadow-xl transition-all min-h-[400px] md:min-h-0 isolate group">
            <Image src="/images/home/authentic-microscope.png" alt="Surgical Microscope" fill sizes="(max-width: 768px) 100vw, 100vw" className="object-cover object-center md:object-[center_20%] -z-20 group-hover:scale-[1.02] transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-white/95 via-white/60 to-transparent md:w-2/3 -z-10"></div>
            <div className="relative z-10 w-full md:max-w-md">
              <h3 className="text-3xl font-semibold text-[#1D1D1F] mb-4">Microscopes</h3>
              <Link href="/products?category=microscopes" className="px-6 py-3 bg-[#1D1D1F] text-white rounded-full text-sm font-medium hover:bg-black transition-colors shadow-lg shadow-black/10 inline-block">View Microscopes</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
