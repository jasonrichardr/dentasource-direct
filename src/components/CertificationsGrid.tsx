"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

const CERTIFICATES = [
    { src: "/images/products/n2-pro/Bacteria and fungi total count/Bacteria and fungi total count.jpg", title: "Bacteria & Fungi Total Count" },
    { src: "/images/products/n2-pro/Surface disinfection test/Surface disinfection test.jpg", title: "Surface Disinfection Test" },
    { src: "/images/products/n2-pro/Hydrogen peroxide static condition/Hydrogen peroxide static condition.jpg", title: "Hydrogen Peroxide Static Condition" },
    { src: "/images/products/n2-pro/Acute oral toxicity safety/Acute oral toxicity safety.jpg", title: "Acute Oral Toxicity Safety" },
    { src: "/images/products/n2-pro/Ozone concentration ratio/Ozone concentration ratio.jpg", title: "Ozone Concentration Ratio" },
    { src: "/images/products/n2-pro/Candida albicans resistance/Candida albicans resistance.jpg", title: "Candida Albicans Resistance" },
];

export default function CertificationsGrid() {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    return (
        <section className="relative py-24 bg-zinc-900 border-t border-zinc-800">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">

                <div className="mb-16 md:w-3/4 lg:w-1/2">
                    <span className="text-blue-400 font-semibold tracking-widest text-sm uppercase mb-3 block">
                        EOW-TECH Integration
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6 text-white">
                        Tested. Proven. Safe.
                    </h2>
                    <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
                        The ROSON Elite Model N2 PRO features our proprietary EOW-TECH water disinfection system.
                        All internal waterways are certified to eradicate common pathogens, ensuring complete safety
                        for every procedure. Review our rigorous third-party testing certifications below.
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {CERTIFICATES.map((cert, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -8 }}
                            className="bg-white/5 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/10 group cursor-pointer hover:border-blue-500/50 transition-all duration-300"
                            onClick={() => setLightboxImage(cert.src)}
                        >
                            <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4 bg-white/10 shadow-inner">
                                <Image
                                    src={cert.src}
                                    alt={cert.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <ZoomIn className="text-white w-10 h-10" />
                                </div>
                            </div>
                            <h3 className="text-center font-medium text-gray-200 text-sm">{cert.title}</h3>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-12 cursor-pointer"
                        onClick={() => setLightboxImage(null)}
                    >
                        <button
                            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
                            onClick={() => setLightboxImage(null)}
                        >
                            <X className="w-10 h-10" />
                        </button>
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-4xl h-[85vh] bg-white rounded-lg overflow-hidden flex items-center justify-center border border-white/10"
                        >
                            <Image
                                src={lightboxImage}
                                alt="Certification"
                                fill
                                className="object-contain p-2 md:p-8"
                                quality={100}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
