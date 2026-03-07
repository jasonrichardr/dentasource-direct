"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PaintBucket, Hand, Check, Layers } from "lucide-react";

// Types
type ColorOption = {
    id: string;
    name: string;
    value: string; // Tailwind hex or class mapping
    image: string;
};

type HandpieceOption = {
    id: string;
    name: string;
    desc: string;
    image: string;
};

type UpholsteryOption = {
    id: string;
    name: string;
    image: string;
};

// Data
const COLORS: ColorOption[] = [
    { id: "col-1", name: "Coloured Glaze Blue", value: "#004B87", image: "/images/products/a3s/Unit Color Selection/Coloured-glaze-blue.webp" },
    { id: "col-2", name: "Gray", value: "#5c5c5c", image: "/images/products/a3s/Unit Color Selection/Gray.webp" },
    { id: "col-3", name: "Begonia Red", value: "#c41e3a", image: "/images/products/a3s/Unit Color Selection/Begonia-red.webp" },
    { id: "col-4", name: "Olive Green", value: "#808000", image: "/images/products/a3s/Unit Color Selection/Olive-green.webp" },
    { id: "col-5", name: "Light Green", value: "#90EE90", image: "/images/products/a3s/Unit Color Selection/Light-green.webp" },
    { id: "col-6", name: "Orange", value: "#FFA500", image: "/images/products/a3s/Unit Color Selection/Orange.webp" },
    { id: "col-7", name: "Tiffany Blue", value: "#0ABAB5", image: "/images/products/a3s/Unit Color Selection/Tiffany-blue.webp" },
];

const HANDPIECES: HandpieceOption[] = [
    {
        id: "hp-1",
        name: "Top-Mounted Delivery",
        desc: "Continental style - Over the patient",
        image: "/images/products/a3s/Handpiece Placement Choices/Over-the-Patient.jpg"
    },
    {
        id: "hp-2",
        name: "Hanging Delivery",
        desc: "Traditional style - Swing mounted",
        image: "/images/products/a3s/Handpiece Placement Choices/Swing-Mounted.jpg"
    },
    {
        id: "hp-3",
        name: "Mobile Cart",
        desc: "Cart mounted delivery",
        image: "/images/products/a3s/Handpiece Placement Choices/Cart-Mounted.jpg"
    }
];

const UPHOLSTERY: UpholsteryOption[] = [
    { id: "uph-1", name: "Seamless Microfiber", image: "/images/products/a3s/Upholstery Selection/Seamless-Microfiber.webp" },
    { id: "uph-2", name: "Sewn Microfiber Leather", image: "/images/products/a3s/Upholstery Selection/Sewn-Microfiber.webp" },
    { id: "uph-3", name: "PU Leather", image: "/images/products/a3s/Upholstery Selection/PU-Leather.webp" }
];

export default function A3SProductConfigurator() {
    const [activeTab, setActiveTab] = useState<"color" | "handpiece" | "upholstery">("color");
    const [activeColor, setActiveColor] = useState<ColorOption>(COLORS[0]);
    const [activeHandpiece, setActiveHandpiece] = useState<HandpieceOption>(HANDPIECES[0]);
    const [activeUpholstery, setActiveUpholstery] = useState<UpholsteryOption>(UPHOLSTERY[0]);

    // Derived active image for the visualizer
    const currentMainImage =
        activeTab === "color" ? activeColor.image :
            activeTab === "handpiece" ? activeHandpiece.image :
                activeUpholstery.image;

    return (
        <section className="py-24 bg-zinc-50 border-t border-gray-100">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Configure Your A3S
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Personalize your KLT-6220 A3S with our curated selection of colors, delivery systems, and premium upholstery.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Visualizer (Left) */}
                    <div className="w-full lg:w-1/2 relative lg:sticky lg:top-24 z-10 mb-8 lg:mb-0">
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white shadow-xl shadow-gray-200/40 border border-gray-100 p-8 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentMainImage}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative w-full h-full"
                                >
                                    <Image
                                        src={currentMainImage}
                                        alt="Configuration Preview"
                                        fill
                                        className="object-contain mix-blend-darken"
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Controls (Right) */}
                    <div className="w-full lg:w-1/2 flex flex-col pt-4">
                        {/* Custom Tabs */}
                        <div className="flex space-x-2 p-1.5 bg-slate-100 rounded-2xl mb-12 w-full lg:w-fit overflow-x-auto whitespace-nowrap flex-nowrap no-scrollbar">
                            <button
                                onClick={() => setActiveTab("color")}
                                className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === "color" ? "bg-white text-blue-600 shadow-sm border border-gray-200/50" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <PaintBucket className="w-4 h-4" />
                                <span>Unit Color</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("handpiece")}
                                className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === "handpiece" ? "bg-white text-blue-600 shadow-sm border border-gray-200/50" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <Hand className="w-4 h-4" />
                                <span>Delivery</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("upholstery")}
                                className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === "upholstery" ? "bg-white text-blue-600 shadow-sm border border-gray-200/50" : "text-gray-500 hover:text-gray-700"
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
                                        <p className="text-gray-500 text-sm mb-6">Match your clinic's aesthetic perfectly.</p>
                                    </div>

                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
                                        {COLORS.map((color) => (
                                            <button
                                                key={color.id}
                                                onClick={() => setActiveColor(color)}
                                                className={`group flex flex-col items-center space-y-3 p-2 rounded-xl transition-all ${activeColor.id === color.id ? 'bg-white shadow-md ring-1 ring-gray-200 scale-105' : 'hover:bg-gray-100'
                                                    }`}
                                            >
                                                <div
                                                    className="w-12 h-12 rounded-full shadow-inner border-2 border-white flex items-center justify-center transition-transform group-hover:scale-110"
                                                    style={{ backgroundColor: color.value }}
                                                >
                                                    {activeColor.id === color.id && <Check className="w-5 h-5 text-white drop-shadow-md" />}
                                                </div>
                                                <span className="text-xs font-medium text-gray-600 text-center leading-tight">
                                                    {color.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-white p-2 rounded-lg shadow-sm w-12 h-12 flex items-center justify-center shrink-0">
                                                <div className="w-full h-full rounded-md" style={{ backgroundColor: activeColor.value }} />
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
                                                className={`relative flex flex-col text-left p-4 sm:p-6 rounded-2xl border-2 transition-all ${activeHandpiece.id === hp.id
                                                    ? 'border-blue-500 bg-blue-50/10'
                                                    : 'border-gray-100 hover:border-gray-200 hover:bg-zinc-50/50'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-2 pr-8">
                                                    <h4 className="font-bold text-gray-900 text-lg">{hp.name}</h4>
                                                    <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${activeHandpiece.id === hp.id ? 'border-blue-500' : 'border-gray-300'}`}>
                                                        {activeHandpiece.id === hp.id && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500 max-w-[90%]">{hp.desc}</p>
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
                                                className={`flex items-center p-3 sm:p-4 rounded-xl border-2 transition-all ${activeUpholstery.id === mat.id
                                                    ? 'border-blue-500 bg-blue-50/30'
                                                    : 'border-gray-100 hover:border-gray-200 hover:bg-white'
                                                    }`}
                                            >
                                                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 mr-4 sm:mr-6 border border-gray-200 shadow-sm">
                                                    <Image src={mat.image} alt={mat.name} fill className="object-cover" />
                                                </div>
                                                <div className="text-left flex-grow">
                                                    <h4 className="font-bold text-lg text-gray-900 mb-1">{mat.name}</h4>
                                                    <p className="text-sm text-gray-500">Premium resilient material designed for maximum hygiene.</p>
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
