"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function A3HeroVisual() {
    return (
        <section className="relative h-[90vh] min-h-[600px] w-full bg-gradient-to-b from-gray-50 to-gray-200 overflow-hidden flex items-center justify-center">
            {/* Background Image Setup */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-full h-full max-w-7xl mx-auto">
                    <Image
                        src="/images/products/a3/A3 Dental Chair/img01.jpg"
                        alt="Roson Flagship Model A3"
                        fill
                        className="object-contain mix-blend-darken scale-110 lg:scale-125 object-bottom translate-y-10 lg:translate-y-20 opacity-90"
                        style={{
                            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
                            maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
                            WebkitMaskComposite: 'source-in',
                            maskComposite: 'intersect'
                        }}
                        priority
                    />
                </div>
            </div>

            {/* Content overlay */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto -mt-32 md:-mt-48">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="text-blue-600 font-bold tracking-widest text-sm md:text-base uppercase mb-4 block">
                        Flagship Series
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-6 tracking-tight leading-tight drop-shadow-sm">
                        ROSON Flagship <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Model A3</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-base sm:text-lg md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10 font-medium"
                >
                    Performance. Reliability. Excellence.
                </motion.p>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-gray-400"
            >
                <span className="text-xs uppercase tracking-widest mb-2 font-bold">Explore A3</span>
                <div className="w-[1px] h-12 bg-gray-300 relative overflow-hidden">
                    <motion.div
                        className="w-full h-1/2 bg-gray-600 absolute top-0"
                        animate={{ top: ["-50%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            </motion.div>
        </section>
    );
}
