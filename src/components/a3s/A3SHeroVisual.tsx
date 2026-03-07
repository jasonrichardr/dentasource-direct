"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function A3SHeroVisual() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <section
            ref={containerRef}
            className="relative h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-gray-200"
        >
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl mix-blend-multiply" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-zinc-300/30 rounded-full blur-3xl mix-blend-multiply" />
            </div>

            <div className="container relative z-10 mx-auto px-6 max-w-7xl flex flex-col items-center">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-center mb-12 sm:mb-20 w-full"
                    style={{ y, opacity }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="inline-block mb-6 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 shadow-sm"
                    >
                        <span className="text-blue-600 font-semibold tracking-widest text-xs uppercase">
                            Premium Reliability • Unparalleled Comfort
                        </span>
                    </motion.div>

                    <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-gray-900 tracking-tight mb-6">
                        Roson <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">A3S</span>
                    </h1>
                    <p className="text-lg sm:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
                        Advanced Technological Integrations for Modern Dental Practices.
                    </p>
                </motion.div>

                {/* Main Product Image Container */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-6xl aspect-[4/3] sm:aspect-[21/9]"
                >
                    {/* CSS Masking for fading the bottom edge into the background */}
                    <div
                        className="absolute inset-0 z-10"
                        style={{
                            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                            maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
                        }}
                    >
                        <Image
                            src="/images/products/a3s/A3S Dental Chair/1-8.jpg"
                            alt="Roson A3S Dental Chair"
                            fill
                            priority
                            className="object-contain object-bottom scale-110 translate-y-10 mix-blend-darken"
                            sizes="(max-width: 1280px) 100vw, 1280px"
                            quality={100}
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
