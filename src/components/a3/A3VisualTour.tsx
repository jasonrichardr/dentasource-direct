"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

const ANGLES = [
    { src: "/images/products/a3/Angles/roson-a3-left-side.jpg", title: "A3 Overview" },
    { src: "/images/products/a3/Angles/roson-a3-front-view-with-stool.jpg", title: "Front View & Stool" },
    { src: "/images/products/a3/Angles/roson-a3-left-side-angled.jpg", title: "Left Isometric" },
    { src: "/images/products/a3/Angles/roson-a3-right-side-angled.jpg", title: "Right Isometric" },
    { src: "/images/products/a3/Angles/roson-a3-top-down-angled.jpg", title: "Top Down Perspective" },
    { src: "/images/products/a3/Angles/roson-a3-back-view.png", title: "Rear View & Base" },
];

export default function A3VisualTour() {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    return (
        <section className="py-16 lg:py-24 bg-[#0A0A0A]">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-12 lg:mb-16">
                    <span className="text-blue-500 font-bold tracking-widest text-sm uppercase mb-3 block">
                        Visual Tour
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Discover the A3
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Precision engineering meets elegant design in every detail of the Flagship Model A3.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ANGLES.map((angle, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            onClick={() => setLightboxImage(angle.src)}
                            className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-zinc-800"
                        >
                            <Image
                                src={angle.src}
                                alt={angle.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {/* Gradient Overlay for Text */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <h3 className="text-xl font-bold text-white tracking-wide">
                                    {angle.title}
                                </h3>
                            </div>
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
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-12 cursor-pointer"
                        onClick={() => setLightboxImage(null)}
                    >
                        <button
                            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50"
                            onClick={() => setLightboxImage(null)}
                        >
                            <X className="w-10 h-10" />
                        </button>
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-5xl h-[85vh] rounded-lg overflow-hidden flex items-center justify-center pointer-events-none"
                        >
                            <Image
                                src={lightboxImage}
                                alt="View angle"
                                fill
                                className="object-contain"
                                quality={100}
                                priority
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
