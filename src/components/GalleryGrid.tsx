"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

const GALLERY_IMAGES = [
    { src: "/images/products/n2-pro/N2 Pro Dental Chair/1-1.jpg", title: "N2 Pro Overview" },
    { src: "/images/products/n2-pro/N2 Pro Dental Chair/2-2.jpg", title: "Front view" },
    { src: "/images/products/n2-pro/N2 Pro Dental Chair/3-1.jpg", title: "Assistant Delivery System" },
    { src: "/images/products/n2-pro/N2 Pro Dental Chair/4-1.jpg", title: "On/Off Independent Water Supply" },
    { src: "/images/products/n2-pro/N2 Pro Dental Chair/5-1.jpg", title: "Rotatable Ceramic Spittoon" },
    { src: "/images/products/n2-pro/N2 Pro Dental Chair/6-1.jpg", title: "Adjustable Handpiece Holder" },
    { src: "/images/products/n2-pro/N2 Pro Dental Chair/7-foot-control.jpg", title: "All-in-One Foot control" },
];

export default function GalleryGrid() {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    return (
        <section className="relative py-16 lg:py-24 bg-zinc-900 border-t border-zinc-800">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">

                <div className="mb-12 lg:mb-16 md:w-3/4 lg:w-1/2 text-center md:text-left mx-auto md:mx-0">
                    <span className="text-blue-400 font-semibold tracking-widest text-sm uppercase mb-3 block">
                        Visual Excellence
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4 lg:mb-6 text-white">
                        Design in Detail
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Explore the Roson Elite Model N2 PRO from every angle. Our uncompromising commitment to premium design and ergonomic excellence is visible in every carefully crafted component.
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {GALLERY_IMAGES.map((img, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -8 }}
                            className="bg-white/5 backdrop-blur-md rounded-xl p-3 md:p-4 border border-white/10 group cursor-pointer hover:border-blue-500/50 transition-all duration-300"
                            onClick={() => setLightboxImage(img.src)}
                        >
                            <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4 bg-white/10 shadow-inner">
                                <Image
                                    src={img.src}
                                    alt={img.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <ZoomIn className="text-white w-10 h-10" />
                                </div>
                            </div>
                            <h3 className="text-center font-medium text-gray-200 text-sm truncate px-2">{img.title}</h3>
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
                            className="relative w-full max-w-5xl h-[85vh] bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center border border-white/10 shadow-2xl"
                        >
                            <Image
                                src={lightboxImage}
                                alt="Gallery View"
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
