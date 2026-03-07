"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ZoomIn, ChevronRight, ChevronLeft } from "lucide-react";

// S3 Visual Tour Images
const tourImages = [
    {
        id: 1,
        src: "/images/products/s3/S3 Dental Chair/S3_1.jpg",
        alt: "Roson S3 Dental Chair - Profile View",
        caption: "S3 Profile View",
    },
    {
        id: 2,
        src: "/images/products/s3/S3 Dental Chair/S3_2.jpg",
        alt: "Roson S3 Dental Chair - Front Angled View",
        caption: "Front Angled View",
    },
    {
        id: 3,
        src: "/images/products/s3/S3 Dental Chair/S3_3.jpg",
        alt: "Roson S3 Dental Chair - Overhead View",
        caption: "Overhead View",
    },
    {
        id: 4,
        src: "/images/products/s3/S3 Dental Chair/S3_4.jpg",
        alt: "Roson S3 Dental Chair - Rear View",
        caption: "Rear View",
    },
    {
        id: 5,
        src: "/images/products/s3/S3 Dental Chair/S3_5.jpg",
        alt: "Roson S3 Dental Chair - Doctor Table Detail",
        caption: "Primary Doctor's Table",
    },
    {
        id: 6,
        src: "/images/products/s3/S3 Dental Chair/S3_6.jpg",
        alt: "Roson S3 Dental Chair - Assistant Side Detail",
        caption: "Assistant's Console",
    },
];

export default function S3VisualTour() {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImage !== null) {
            const currentIndex = tourImages.findIndex((img) => img.id === selectedImage);
            const nextIndex = (currentIndex + 1) % tourImages.length;
            setSelectedImage(tourImages[nextIndex].id);
        }
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImage !== null) {
            const currentIndex = tourImages.findIndex((img) => img.id === selectedImage);
            const prevIndex = (currentIndex - 1 + tourImages.length) % tourImages.length;
            setSelectedImage(tourImages[prevIndex].id);
        }
    };

    return (
        <section className="py-24 bg-zinc-950 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl font-bold text-white mb-4"
                    >
                        Visual Tour
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-zinc-400 max-w-2xl mx-auto"
                    >
                        Explore the S3 from every angle.
                    </motion.p>
                </div>

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {tourImages.map((image, index) => (
                        <motion.div
                            key={image.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group cursor-pointer break-inside-avoid rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800"
                            onClick={() => setSelectedImage(image.id)}
                        >
                            <div className="relative w-full aspect-[4/3]">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                                    <ZoomIn className="w-8 h-8 text-white mb-2" />
                                    <span className="text-white font-medium">{image.caption}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <button
                            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
                            onClick={handlePrev}
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>

                        <button
                            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
                            onClick={handleNext}
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-5xl aspect-video rounded-lg overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={tourImages.find((img) => img.id === selectedImage)?.src || ""}
                                alt={tourImages.find((img) => img.id === selectedImage)?.alt || ""}
                                fill
                                className="object-contain"
                            />
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
                                <span className="text-white font-medium">
                                    {tourImages.find((img) => img.id === selectedImage)?.caption}
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
