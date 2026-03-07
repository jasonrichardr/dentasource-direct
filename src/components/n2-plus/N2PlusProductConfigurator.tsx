"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PaintBucket, Hand, Layers } from "lucide-react";

// N2+ Data Mappings
const COLORS = [
    { id: "dark-blue", name: "Dark Blue", hex: "#1A3B5C", image: "/images/products/n2-plus/Unit Color Selection/Dark_blue.webp" },
    { id: "light-grey", name: "Light Grey", hex: "#E0E0E0", image: "/images/products/n2-plus/Unit Color Selection/Light_Grey.webp" },
    { id: "bordeaux", name: "Bordeaux (Red)", hex: "#800020", image: "/images/products/n2-plus/Unit Color Selection/Bordeaux_2.webp" },
    { id: "green", name: "Green", hex: "#4CAF50", image: "/images/products/n2-plus/Unit Color Selection/Green.webp" },
    { id: "orange", name: "Orange", hex: "#FF9800", image: "/images/products/n2-plus/Unit Color Selection/Orange_1.webp" },
    { id: "apple-green", name: "Apple Green", hex: "#8BC34A", image: "/images/products/n2-plus/Unit Color Selection/Apple_Green.webp" },
    { id: "middle-grey", name: "Middle Grey", hex: "#9E9E9E", image: "/images/products/n2-plus/Unit Color Selection/Middle_Grey.webp" },
];

const HANDPIECES = [
    {
        id: "over-patient",
        title: "Over-the-Patient",
        description: "Provides ergonomic access directly above the patient.",
        image: "/images/products/n2-plus/Handpiece Placement Choices/Standard.png"
    },
    {
        id: "swing",
        title: "Swing-Mounted",
        description: "Offers versatile positioning and easy access from either side.",
        image: "/images/products/n2-plus/Handpiece Placement Choices/Standard.png"
    },
    {
        id: "cart",
        title: "Cart-Mounted",
        description: "Ensures maximum mobility and flexibility within the operatory.",
        image: "/images/products/n2-plus/Handpiece Placement Choices/Standard.png"
    }
];

const UPHOLSTERY = [
    {
        id: "pu-leather",
        name: "PU Leather",
        image: "/images/products/n2-plus/Upholstery Selection/PU.webp",
        description: "Durable and easy to maintain standard polyurethane leather."
    },
    {
        id: "sewn-microfiber",
        name: "Sewn Microfiber Leather",
        image: "/images/products/n2-plus/Upholstery Selection/Sewn_Microfiber.webp",
        description: "Premium microfiber combining superior comfort with elegant stitching."
    },
    {
        id: "seamless-microfiber",
        name: "Seamless Microfiber Leather",
        image: "/images/products/n2-plus/Upholstery Selection/Seamless_Microfiber.webp",
        description: "Top-tier seamless microfiber for unmatched hygiene and aesthetics."
    }
];

export default function N2PlusProductConfigurator() {
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
                <div className="text-center mb-12 lg:mb-16">
                    <span className="text-blue-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
                        Classic Excellence
                    </span>
                    <h2 className="text-4xl sm:text-5xl md:text-5xl font-bold text-gray-900 mb-4">
                        Build Your N2+
                    </h2>
                </div>

                {/* Main Configuration Layout */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

                    {/* Visualizer Column (Sticky) */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative lg:sticky lg:top-24 z-10 space-y-8 mb-8 lg:mb-0">
                            {/* Main Visualizer */}
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F5F5F7] border border-gray-100 shadow-xl">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentMainImage}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="absolute inset-0 flex items-center justify-center p-8"
                                    >
                                        <Image
                                            src={currentMainImage}
                                            alt="Configuration Preview"
                                            fill
                                            className={activeTab === 'color' ? "object-contain p-4 mix-blend-multiply" : "object-cover"}
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Options Column */}
                    <div className="w-full lg:w-1/2 flex flex-col space-y-12">

                        {/* Custom Tabs */}
                        <div className="flex space-x-2 p-1.5 bg-slate-100 lg:rounded-2xl mb-6 w-full lg:w-fit mx-auto lg:mx-0 overflow-x-auto scrollbar-hide snap-x rounded-xl">
                            <button
                                onClick={() => setActiveTab("color")}
                                className={`flex items-center space-x-2 px-4 lg:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap snap-center ${activeTab === "color" ? "bg-white text-blue-600 shadow-sm border border-gray-200/50" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <PaintBucket className="w-4 h-4" />
                                <span>Unit Color</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("handpiece")}
                                className={`flex items-center space-x-2 px-4 lg:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap snap-center ${activeTab === "handpiece" ? "bg-white text-blue-600 shadow-sm border border-gray-200/50" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <Hand className="w-4 h-4" />
                                <span>Delivery</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("upholstery")}
                                className={`flex items-center space-x-2 px-4 lg:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap snap-center ${activeTab === "upholstery" ? "bg-white text-blue-600 shadow-sm border border-gray-200/50" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <Layers className="w-4 h-4" />
                                <span>Upholstery</span>
                            </button>
                        </div>

                        {/* Control Panels */}
                        <div className="flex-grow">
                            {/* Color Tab */}
                            {activeTab === "color" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Unit Color</h3>
                                        <p className="text-gray-500 text-sm mb-6">A vibrant spectrum to integrate fluidly with your practice's aesthetic.</p>
                                    </div>
                                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-3 lg:gap-4">
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
                                                {/* Tooltip */}
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

                            {/* Handpiece Tab */}
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

                                    <div className="grid grid-cols-1 gap-4">
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

                            {/* Upholstery Tab */}
                            {activeTab === "upholstery" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Upholstery Material</h3>
                                        <p className="text-gray-500 text-sm mb-6">Select from our premium, state-of-the-art materials for maximum comfort.</p>
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
                                                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 mr-6 border border-gray-200 shadow-sm bg-white">
                                                    <Image src={mat.image} alt={mat.name} fill className="object-cover" />
                                                </div>
                                                <div className="text-left flex-grow">
                                                    <h4 className="font-bold text-lg text-gray-900 mb-1">{mat.name}</h4>
                                                    <p className="text-sm text-gray-500 leading-relaxed max-w-sm">{mat.description}</p>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-4 ${activeUpholstery.id === mat.id ? 'border-blue-500' : 'border-gray-300'}`}>
                                                    {activeUpholstery.id === mat.id && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
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
