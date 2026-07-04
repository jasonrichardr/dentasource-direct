'use client';

import { m as motion } from 'framer-motion';

const stats = [
    { value: '140', unit: 'sqm', label: 'Showroom' },
    { value: 'ISO 13485', unit: '', label: 'Certified' },
    { value: 'Up to 5-Yr', unit: '', label: 'Motor Warranty' },
    { value: '120+', unit: '', label: 'Countries Trust ROSON' },
];

export default function HeroSection() {
    return (
        <section className="relative w-full min-h-[100svh] overflow-hidden bg-[#0A1410]">
            {/* Autoplay video background — always silent; the lounge music pill carries the audio mood */}
            <div className="absolute inset-0 z-0">
                <video
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster="/videos/dsd-hero-poster.jpg"
                >
                    <source src="/videos/dsd-hero-loop.mp4" type="video/mp4" />
                </video>
                {/* Legibility overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0A1410] to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-28 sm:pt-32 md:pt-36 pb-8 sm:pb-12 min-h-[100svh] flex flex-col">
                <div className="flex-1 flex flex-col justify-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[2rem] leading-[1.12] sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-3xl"
                    >
                        Your Growth Partner{' '}
                        <br className="hidden sm:block" />
                        <span className="text-emerald-400">in Dentistry.</span>
                    </motion.h1>
                </div>

                {/* Stats strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 sm:divide-x sm:divide-white/15 border-t border-white/15 pt-6 sm:pt-8 mt-8 lg:mt-10">
                        {stats.map((stat) => (
                            <div key={stat.label} className="sm:px-6 first:sm:pl-0 last:sm:pr-0">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                                        {stat.value}
                                    </span>
                                    {stat.unit && (
                                        <span className="text-sm sm:text-base font-medium text-white/60">{stat.unit}</span>
                                    )}
                                </div>
                                <span className="text-[11px] sm:text-xs font-medium text-white/60 uppercase tracking-wider mt-1 block">
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
