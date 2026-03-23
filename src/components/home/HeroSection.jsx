'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const stats = [
    { value: '140', unit: 'sqm', label: 'Showroom' },
    { value: 'ISO 13485', unit: '', label: 'Certified' },
    { value: '5-Year', unit: '', label: 'Motor Warranty' },
    { value: '120+', unit: '', label: 'Countries Trust ROSON' },
];

export default function HeroSection() {
    return (
        <section className="relative w-full min-h-[100svh] overflow-hidden bg-[#FAFAFA]">

            {/* Subtle background elements */}
            <div className="absolute inset-0 z-0">
                {/* Soft gradient wash */}
                <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-blue-50/50 to-transparent" />
                <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-gradient-to-tr from-orange-50/30 to-transparent" />
            </div>

            {/* Main layout */}
            <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-28 sm:pt-32 md:pt-36 pb-8 sm:pb-12 min-h-[100svh] flex flex-col">

                {/* Content area — split layout */}
                <div className="flex-1 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

                    {/* Text */}
                    <div className="w-full flex flex-col justify-center">

                        {/* Showroom badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-5 sm:mb-6"
                        >
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-emerald-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                The Philippines&apos; Largest Dental Equipment Showroom
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[2.75rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1D1D1F] mb-5 sm:mb-6"
                        >
                            Your Growth Partner{' '}
                            <br className="hidden sm:block" />
                            <span className="text-[#F26522]">in Dentistry.</span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-base sm:text-lg text-[#86868B] max-w-lg leading-relaxed mb-8 sm:mb-10"
                        >
                            Premium dental chairs and equipment with white-glove installation, hands-on training, and the personalized support your practice deserves.
                        </motion.p>

                        {/* Scroll hint */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="hidden sm:flex items-center gap-2 mt-2 text-[#86868B]"
                        >
                            <motion.div
                                animate={{ y: [0, 6, 0] }}
                                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                                className="w-[1px] h-8 bg-[#86868B]/40"
                            />
                            <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
                        </motion.div>
                    </div>

                </div>

                {/* Bottom: Stats strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 sm:divide-x sm:divide-[#1D1D1F]/10 border-t border-[#1D1D1F]/10 pt-6 sm:pt-8 mt-8 lg:mt-0">
                        {stats.map((stat) => (
                            <div key={stat.label} className="sm:px-6 first:sm:pl-0 last:sm:pr-0">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1D1D1F] tracking-tight">
                                        {stat.value}
                                    </span>
                                    {stat.unit && (
                                        <span className="text-sm sm:text-base font-medium text-[#86868B]">
                                            {stat.unit}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[11px] sm:text-xs font-medium text-[#86868B] uppercase tracking-wider mt-1 block">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
