"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

const IMAGES = [
    { src: "/images/products/n1/N1 Dental Chair/N1_1.jpg", alt: "N1 Dental Chair View 1" },
    { src: "/images/products/n1/N1 Dental Chair/N1_2.jpg", alt: "N1 Dental Chair View 2" },
    { src: "/images/products/n1/N1 Dental Chair/N1_3.jpg", alt: "N1 Dental Chair View 3" },
    { src: "/images/products/n1/N1 Dental Chair/N1_4.jpg", alt: "N1 Dental Chair View 4" },
    { src: "/images/products/n1/N1 Dental Chair/N1_5.jpg", alt: "N1 Dental Chair View 5" },
    { src: "/images/products/n1/N1 Dental Chair/N1_6.jpg", alt: "N1 Dental Chair View 6" },
];

export default function N1VisualTour() {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'unset';
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);
    };

    return (
        <section className="py-24 bg-zinc-900 border-t border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-white mb-6"
                    >
                        Visual Gallery
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-zinc-400"
                    >
                        Explore the structural design and aesthetic details of the Roson N1 from every angle.
                    </motion.p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                    {IMAGES.map((img, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => openLightbox(index)}
                            className="relative aspect-square sm:aspect-video rounded-2xl overflow-hidden group cursor-pointer border border-zinc-800"
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white">
                                    <Maximize2 className="w-6 h-6" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
                        onClick={closeLightbox}
                    >
                        <button
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50 p-2"
                            onClick={closeLightbox}
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center px-4 md:px-20">
                            <button
                                className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors p-4 z-50 bg-black/50 hover:bg-black/80 rounded-full"
                                onClick={prevImage}
                            >
                                <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
                            </button>

                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="relative w-full max-w-6xl aspect-video md:aspect-[21/9] lg:aspect-video"
                            >
                                <Image
                                    src={IMAGES[currentIndex].src}
                                    alt={IMAGES[currentIndex].alt}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </motion.div>

                            <button
                                className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors p-4 z-50 bg-black/50 hover:bg-black/80 rounded-full"
                                onClick={nextImage}
                            >
                                <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
                            </button>
                        </div>

                        {/* Status/Counter */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 tracking-widest text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
                            {currentIndex + 1} / {IMAGES.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
