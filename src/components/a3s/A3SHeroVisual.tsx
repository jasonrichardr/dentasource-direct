"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function A3SHeroVisual() {
    return (
        <section className="relative w-full h-[90vh] md:h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-zinc-900">
            {/* Full-bleed background image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/products/sunlit/chair_a3s_teal_sunlight.png"
                    alt="Roson Smart Model A3S"
                    fill
                    className="object-cover object-[70%_center] sm:object-center opacity-80"
                    priority
                />
                {/* Gradient overlays for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-zinc-900 to-transparent" />
            </div>

            {/* Content — left aligned */}
            <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col items-start justify-center h-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-2xl"
                >
                    <span className="text-white/80 font-semibold tracking-[0.2em] text-xs sm:text-sm md:text-base uppercase mb-3 block">
                        Smart Series
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                        ROSON Smart Model <br />
                        <span className="text-emerald-400">A3S</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-100 max-w-xl leading-relaxed font-medium">
                        7 Colors. Smart Comfort. Seamless Leather.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <a
                            href="#configurator"
                            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-4 text-base font-semibold text-zinc-900 transition-all hover:bg-emerald-400"
                        >
                            Build Your A3S
                        </a>
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10"
                        >
                            Talk to a Specialist
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-10"
            >
                <span className="text-white/50 text-sm tracking-widest uppercase mb-2">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-[1px] h-12 bg-white/50"
                />
            </motion.div>
        </section>
    );
}
