"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function S6HeroVisual() {
    return (
        <section className="relative w-full h-[90vh] md:h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-zinc-900">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/products/s6/S6 Dental Chair/S6_1.jpg"
                    alt="Roson S6 Dental Chair"
                    fill
                    className="object-cover object-center opacity-70"
                    priority
                />
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-zinc-900 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col items-start justify-center h-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-2xl"
                >
                    <span className="text-white/80 font-semibold tracking-[0.2em] text-xs sm:text-sm md:text-base uppercase mb-3 block">
                        Advanced Clinical Model
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 lg:mb-6">
                        ROSON Advanced Model <br />
                        <span className="text-blue-400">S6</span>
                    </h1>
                    <p className="text-sm sm:text-lg md:text-xl text-gray-100 mb-6 lg:mb-8 max-w-xl leading-relaxed font-medium">
                        Reliable Innovations. Durable Engineering. Essential Clinical Performance.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="#configure"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 sm:py-4 rounded-full font-medium transition-colors text-center text-sm md:text-base shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                        >
                            Configure S6
                        </motion.a>
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="#features"
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 sm:py-4 rounded-full font-medium transition-colors text-center text-sm md:text-base"
                        >
                            Explore Innovations
                        </motion.a>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
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
