"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PaintBucket, Hand, Check, Layers } from "lucide-react";

const COLORS = [
    { id: "glaze-blue", name: "Coloured Glaze Blue", hex: "#42A5F5", image: "/images/products/a3/Unit Color Selection/Coloured_Glaze_Blue.jpg" },
    { id: "gray", name: "Gray", hex: "#9E9E9E", image: "/images/products/a3/Unit Color Selection/Gray.jpg" },
    { id: "begonia-red", name: "Begonia Red", hex: "#E53935", image: "/images/products/a3/Unit Color Selection/Begonia_Red.jpg" },
    { id: "hermes-orange", name: "Hermes Orange", hex: "#F57C00", image: "/images/products/a3/Unit Color Selection/Hermes_Orange.jpg" },
    { id: "olive-green", name: "Olive Green", hex: "#558B2F", image: "/images/products/a3/Unit Color Selection/Olive_Green.jpg" },
    { id: "tiffany-blue", name: "Tiffany Blue", hex: "#81D4FA", image: "/images/products/a3/Unit Color Selection/Tiffany_Blue.jpg" },
    { id: "light-green", name: "Light Green", hex: "#A5D6A7", image: "/images/products/a3/Unit Color Selection/Light_Green.jpg" },
];

const HANDPIECES = [
    {
        id: "over-patient",
        title: "Over-the-Patient",
        description: "Classic ergonomic delivery system.",
        image: "/images/products/a3/Handpiece Placement Choices/Over_The_Patient.jpg"
    },
    {
        id: "swing",
        title: "Swing-Mounted",
        description: "Versatile ambidextrous design.",
        image: "/images/products/a3/Handpiece Placement Choices/Swing_Mounted.jpg"
    },
    {
        id: "cart",
        title: "Cart-Mounted",
        description: "Highly mobile standalone cart.",
        image: "/images/products/a3/Handpiece Placement Choices/Cart_Mounted.jpg"
    }
];

const UPHOLSTERY = [
    {
        id: "pu-leather",
        name: "PU Leather",
        image: "/images/products/a3/Upholstery Selection/PU_Leather.webp",
        description: "Standard durable polyurethane leather."
    },
    {
        id: "sewn-microfiber",
        name: "Sewn Microfiber Leather",
        image: "/images/products/a3/Upholstery Selection/Sewn_Microfiber.webp",
        description: "Premium microfiber with elegant stitching."
    },
    {
        id: "seamless-microfiber",
        name: "Seamless Microfiber Leather",
        image: "/images/products/a3/Upholstery Selection/Seamless_Microfiber.webp",
        description: "Top-tier seamless microfiber leather."
    }
];

export default function A3ProductConfigurator() {
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
        <section id="configurator" className="py-16 lg:py-24 bg-white border-t border-gray-100">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
                        Your Dental Unit, Your Way
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Build Your Flagship A3
                    </h2>
                </div>

                {/* Main Configuration Layout */}
                <div className="flex flex-col lg:flex-row gap-12 items-start">

                    {/* Visualizer Column (Sticky) */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative lg:sticky lg:top-24 z-10 space-y-8 mb-8 lg:mb-0">
                            {/* Color Visualizer */}
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
                                            className="object-cover"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Options Column */}
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
                                                    style={{ backgroundColor: color.hex }}
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
                                                className={`relative flex flex-col text-left p-4 sm:p-6 rounded-2xl border-2 transition-all ${activeHandpiece.id === hp.id
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
