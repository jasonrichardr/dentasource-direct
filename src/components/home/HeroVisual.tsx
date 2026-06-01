"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const stats = [
    { value: "140", unit: "sqm", label: "Showroom" },
    { value: "ISO 13485", unit: "", label: "Certified" },
    { value: "Up to 5-Yr", unit: "", label: "Motor Warranty" },
    { value: "120+", unit: "", label: "Countries Trust ROSON" },
];

export default function HeroVisual() {
    return (
        <section className="relative w-full min-h-[100svh] overflow-hidden bg-zinc-950">

            {/* Background chair image — cinematic, full-bleed */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero/dxa3-hero-original.jpg"
                    alt="ROSON A3 Flagship Dental Chair in DentaSource Direct Showroom"
                    fill
                    className="object-cover object-[60%_center] sm:object-center opacity-40 sm:opacity-50 scale-105"
                    priority
                />
                {/* Layered gradients for depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/60" />
                {/* Subtle green tint overlay for brand identity */}
                <div className="absolute inset-0 bg-[#1E3A2E]/20 mix-blend-overlay" />
            </div>

            {/* Main content */}
            <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-20 md:pb-28 min-h-[100svh] flex flex-col justify-between">

                {/* Top: Badge + Headline */}
                <div className="max-w-3xl">

                    {/* Showroom badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-6 sm:mb-8"
                    >
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/[0.06] border border-white/10 text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-white/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            The Philippines&apos; Largest Dental Equipment Showroom
                        </span>
                    </motion.div>

                    {/* Main headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[2.75rem] leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-5 sm:mb-6"
                    >
                        Your Growth Partner{" "}
                        <br className="hidden sm:block" />
                        <span className="text-[#F26522]">in Dentistry.</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-base sm:text-lg md:text-xl text-white/60 max-w-xl leading-relaxed mb-8 sm:mb-10"
                    >
                        Premium dental chairs and equipment with white-glove installation, hands-on training, and the personalized support your practice deserves.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                    >
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center px-7 py-3.5 bg-[#F26522] text-white rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:bg-[#d95517] hover:scale-[1.02] shadow-[0_0_40px_rgba(242,101,34,0.25)]"
                        >
                            Book a Showroom Visit
                        </Link>
                        <Link
                            href="/dentalchairs"
                            className="inline-flex items-center justify-center px-7 py-3.5 bg-white/[0.06] border border-white/15 text-white rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:bg-white/10"
                        >
                            Explore Dental Chairs
                        </Link>
                    </motion.div>
                </div>

                {/* Bottom: Stats strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-12 sm:mt-0"
                >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 sm:divide-x sm:divide-white/10 border-t border-white/10 pt-6 sm:pt-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="sm:px-6 first:sm:pl-0 last:sm:pr-0">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                                        {stat.value}
                                    </span>
                                    {stat.unit && (
                                        <span className="text-sm sm:text-base font-medium text-white/40">
                                            {stat.unit}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[11px] sm:text-xs font-medium text-white/40 uppercase tracking-wider mt-1 block">
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
