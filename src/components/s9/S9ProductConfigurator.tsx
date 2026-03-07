"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PaintBucket, Hand, Check, Layers } from "lucide-react";

const COLORS = [
    { id: "olive-green", name: "Olive Green (FS06)", hex: "#558B2F", image: "/images/products/s9/Unit Color Selection/Olive-green.webp" },
    { id: "orange", name: "Orange (HX001-12)", hex: "#F57C00", image: "/images/products/s9/Unit Color Selection/Orange.webp" },
    { id: "tiffany-blue", name: "Tiffany Blue (FS07)", hex: "#81D4FA", image: "/images/products/s9/Unit Color Selection/Tiffany-blue.webp" },
    { id: "jewel-green", name: "Jewel Green (HX001-9)", hex: "#00695C", image: "/images/products/s9/Unit Color Selection/Jewel-green.webp" },
    { id: "glaze-blue", name: "Coloured Glaze Blue (FS02)", hex: "#42A5F5", image: "/images/products/s9/Unit Color Selection/Coloured-glaze-blue.webp" },
    { id: "gray", name: "Gray (FS03)", hex: "#9E9E9E", image: "/images/products/s9/Unit Color Selection/Gray.webp" },
    { id: "begonia-red", name: "Begonia Red (FS04)", hex: "#E53935", image: "/images/products/s9/Unit Color Selection/Begonia-red.webp" },
];

const HANDPIECES = [
    {
        id: "over-patient",
        title: "Over-the-Patient",
        description: "Ergonomic whip-arm system to minimize wrist fatigue directly over the patient.",
        image: "/images/products/s9/S9 Dental Chair/1-3.jpg"
    },
    {
        id: "swing",
        title: "Swing-Mounted",
        description: "Classic hanging hose system on a smooth, flexible arm.",
        image: "/images/products/s9/S9 Dental Chair/2-2.jpg"
    },
    {
        id: "cart",
        title: "Cart-Mounted",
        description: "Independent mobile cart for maximum spatial flexibility.",
        image: "/images/products/s9/S9 Dental Chair/4-1.jpg"
    }
];

const UPHOLSTERY = [
    {
        id: "pu-leather",
        name: "PU Leather",
        image: "/images/products/s9/Upholstery Selection/PU-Leather.webp",
        description: "Extremely durable and simple to clean for high-traffic environments."
    },
    {
        id: "seamless-microfiber",
        name: "Seamless Microfiber Leather",
        image: "/images/products/s9/Upholstery Selection/Seamless-Microfiber.webp",
        description: "Smooth finish without seams for the absolute highest hygiene."
    },
    {
        id: "sewn-microfiber",
        name: "Sewn Microfiber Leather",
        image: "/images/products/s9/Upholstery Selection/Sewn-Microfiber.webp",
        description: "High-grade leather featuring elegant stitching and superior breathability."
    }
];

export default function S9ProductConfigurator() {
    const [activeTab, setActiveTab] = useState<"color" | "handpiece" | "upholstery">("color");
    const [activeColor, setActiveColor] = useState(COLORS[0]);
    const [activeHandpiece, setActiveHandpiece] = useState(HANDPIECES[0]);
    const [activeUpholstery, setActiveUpholstery] = useState(UPHOLSTERY[0]);

    // Derived active image for the visualizer
    const currentMainImage =
        activeTab === "color" ? activeColor.image :
            activeTab === "handpiece" ? activeHandpiece.image :
                activeUpholstery.image;

    return (
        <section id="configurator" className="py-16 lg:py-24 bg-white">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
                        Your Dental Unit, Your Way
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Build Your S9
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">

                    <div className="w-full lg:w-1/2">
                        <div className="relative lg:sticky lg:top-24 z-10 mb-8 lg:mb-0">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-50 border border-gray-100 shadow-xl">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentMainImage}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="absolute inset-0"
                                    >
                                        <Image
                                            src={currentMainImage}
                                            alt="Configuration Preview"
                                            fill
                                            className={activeTab === 'color' ? "object-contain p-4" : "object-cover"}
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-col pt-0 lg:pt-4 space-y-8 lg:space-y-16">
                        {/* Custom Tabs */}
                        <div className="flex overflow-x-auto hide-scrollbar sm:overflow-visible space-x-2 p-1.5 bg-slate-100 rounded-2xl mb-8 lg:mb-12 w-full sm:w-fit mx-0 sm:mx-auto lg:mx-0 flex-nowrap shrink-0 justify-start sm:justify-center">
                            <button
                                onClick={() => setActiveTab("color")}
                                className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 w-max ${activeTab === "color" ? "bg-white text-blue-600 shadow-sm border border-gray-200/50" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <PaintBucket className="w-4 h-4" />
                                <span>Unit Color</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("handpiece")}
                                className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 w-max ${activeTab === "handpiece" ? "bg-white text-blue-600 shadow-sm border border-gray-200/50" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <Hand className="w-4 h-4" />
                                <span>Delivery</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("upholstery")}
                                className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 w-max ${activeTab === "upholstery" ? "bg-white text-blue-600 shadow-sm border border-gray-200/50" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <Layers className="w-4 h-4" />
                                <span>Upholstery</span>
                            </button>
                        </div>

                        {/* Control Panels */}
                        <div className="flex-grow">
                            {activeTab === "color" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Unit Color</h3>
                                        <p className="text-gray-500 text-sm mb-6">Match your clinic&apos;s aesthetic perfectly.</p>
                                    </div>
                                    <div className="grid grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
                                        {COLORS.map((color) => (
                                            <button
                                                key={color.id}
                                                onClick={() => setActiveColor(color)}
                                                className={`group relative aspect-square rounded-full flex items-center justify-center transition-all ${activeColor.id === color.id
                                                    ? 'ring-2 ring-blue-500 ring-offset-4 scale-110'
                                                    : 'hover:scale-105 hover:shadow-md border border-gray-200'
                                                    }`}
                                                style={{ backgroundColor: color.hex }}
                                                aria-label={`Select ${color.name}`}
                                            >
                                                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs whitespace-nowrap px-3 py-1.5 rounded pointer-events-none z-10 shadow-lg">
                                                    {color.name}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-white p-2 rounded-lg shadow-sm w-12 h-12 flex items-center justify-center shrink-0">
                                                <div className="w-full h-full rounded-md" style={{ backgroundColor: activeColor.hex }} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{activeColor.name}</h4>
                                                <p className="text-sm text-gray-600 mt-1">Currently selected unit color. This highly durable finish resists fading and chemical wear.</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "handpiece" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Delivery System</h3>
                                        <p className="text-gray-500 text-sm mb-6">Choose the ergonomic setup that matches your workflow.</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {HANDPIECES.map((hp) => (
                                            <button
                                                key={hp.id}
                                                onClick={() => setActiveHandpiece(hp)}
                                                className={`relative flex flex-col text-left p-6 rounded-2xl border-2 transition-all ${activeHandpiece.id === hp.id
                                                    ? 'border-blue-500 bg-blue-50/10'
                                                    : 'border-gray-100 hover:border-gray-200 hover:bg-zinc-50/50'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-2 pr-8">
                                                    <h4 className="font-bold text-gray-900 text-lg">{hp.title}</h4>
                                                    <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${activeHandpiece.id === hp.id ? 'border-blue-500' : 'border-gray-300'}`}>
                                                        {activeHandpiece.id === hp.id && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500 max-w-[90%]">{hp.description}</p>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "upholstery" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Upholstery Material</h3>
                                        <p className="text-gray-500 text-sm mb-6">Select from our premium, state-of-the-art materials.</p>
                                    </div>
                                    <div className="flex flex-col space-y-4">
                                        {UPHOLSTERY.map((mat) => (
                                            <button
                                                key={mat.id}
                                                onClick={() => setActiveUpholstery(mat)}
                                                className={`flex items-center p-4 rounded-xl border-2 transition-all ${activeUpholstery.id === mat.id
                                                    ? 'border-blue-500 bg-blue-50/30'
                                                    : 'border-gray-100 hover:border-gray-200 hover:bg-white'
                                                    }`}
                                            >
                                                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 mr-4 sm:mr-6 border border-gray-200 shadow-sm">
                                                    <Image src={mat.image} alt={mat.name} fill className="object-cover" />
                                                </div>
                                                <div className="text-left flex-grow">
                                                    <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-1">{mat.name}</h4>
                                                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-sm">{mat.description}</p>
                                                </div>
                                                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 sm:ml-4 ${activeUpholstery.id === mat.id ? 'border-blue-500' : 'border-gray-300'}`}>
                                                    {activeUpholstery.id === mat.id && <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
