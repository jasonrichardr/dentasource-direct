"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Check, Info, PaintBucket, Layers, Hand } from "lucide-react";

type ConfigurationTab = "color" | "handpiece" | "upholstery";

const COLORS = [
    { id: "light-blue", name: "Light Blue", hex: "#7E9AB3", image: "/images/products/s3/Unit Color Selection/HX001-51_Light_blue.webp", code: "HX001-51" },
    { id: "orange", name: "Orange", hex: "#E77A41", image: "/images/products/s3/Unit Color Selection/HX001-12_Orange.webp", code: "HX001-12" },
    { id: "ivory", name: "Ivory", hex: "#EBE6D6", image: "/images/products/s3/Unit Color Selection/HX001-31_Ivory.webp", code: "HX001-31" },
    { id: "bordeaux", name: "Bordeaux", hex: "#8A2E3B", image: "/images/products/s3/Unit Color Selection/HX001-78_Bordeaux.webp", code: "HX001-78" },
    { id: "brown", name: "Brown", hex: "#5C4033", image: "/images/products/s3/Unit Color Selection/HX001-97_Brown.webp", code: "HX001-97" },
    { id: "apple-green", name: "Apple Green", hex: "#A8E160", image: "/images/products/s3/Unit Color Selection/HX012-43_Apple_Green.webp", code: "HX012-43" },
    { id: "green", name: "Green", hex: "#2E8B57", image: "/images/products/s3/Unit Color Selection/HX012-54_Green.webp", code: "HX012-54" },
];

const HANDPIECES = [
    {
        id: "swing",
        name: "Swing-Mounted",
        description: "Classic ergonomic access and movement.",
        image: "/images/products/s3/Handpiece Placement Choices/Standard.jpg"
    },
    {
        id: "top",
        name: "Over-the-Patient",
        description: "Integrated top-mounted delivery system.",
        image: "/images/products/s3/Handpiece Placement Choices/top.jpg"
    },
    {
        id: "cart",
        name: "Cart-Mounted",
        description: "Mobile standalone cart for maximum flexibility.",
        image: "/images/products/s3/Handpiece Placement Choices/cart.jpg"
    }
];

const UPHOLSTERY = [
    {
        id: "pu",
        name: "PU Leather",
        description: "Standard, durable, and reliable.",
        image: "/images/products/s3/Upholstery Selection/pu.webp"
    },
    {
        id: "seamless",
        name: "Seamless Microfiber",
        description: "Sleek, modern, and easy-to-sanitize.",
        image: "/images/products/s3/Upholstery Selection/seamless.webp"
    },
    {
        id: "sewn",
        name: "Sewn Microfiber",
        description: "Supreme tactile comfort with elegant stitching.",
        image: "/images/products/s3/Upholstery Selection/sewn.webp"
    }
];

export default function S3ProductConfigurator() {
    const [activeTab, setActiveTab] = useState<ConfigurationTab>("color");
    const [selectedColor, setSelectedColor] = useState(COLORS[0].id);
    const [selectedHandpiece, setSelectedHandpiece] = useState(HANDPIECES[0].id);
    const [selectedUpholstery, setSelectedUpholstery] = useState(UPHOLSTERY[0].id);

    const currentColorImage = COLORS.find(c => c.id === selectedColor)?.image || COLORS[0].image;
    const currentHandpieceImage = HANDPIECES.find(h => h.id === selectedHandpiece)?.image || HANDPIECES[0].image;
    const currentUpholsteryImage = UPHOLSTERY.find(u => u.id === selectedUpholstery)?.image || UPHOLSTERY[0].image;

    const currentVisualizerImage =
        activeTab === "color" ? currentColorImage :
            activeTab === "handpiece" ? currentHandpieceImage :
                currentUpholsteryImage;

    return (
        <section id="configure" className="pt-24 lg:pt-32 pb-0 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Phase */}
                <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs sm:text-sm font-semibold mb-6 shadow-sm"
                    >
                        <PaintBucket className="w-4 h-4" />
                        Interactive Configuration
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
                    >
                        Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">Perfect S3</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-gray-500 font-medium"
                    >
                        Customize the color, delivery system, and upholstery to match your clinical environment and workflow perfectly.
                    </motion.p>
                </div>

                <div className="lg:h-[800px] flex flex-col lg:flex-row gap-6 lg:gap-16 pb-12">
                    {/* Visualizer Side (Left) - Sticky on Desktop, Static on Mobile */}
                    <div className="w-full lg:w-1/2 relative lg:sticky lg:top-32 h-[400px] sm:h-[500px] lg:h-[700px] bg-white rounded-3xl border border-gray-100 flex items-center justify-center p-8 overflow-hidden shadow-sm group mb-8 lg:mb-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        {/* Dynamic Background Circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-gray-200/40 to-white/60 blur-3xl pointer-events-none" />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${activeTab}-${selectedColor}-${selectedHandpiece}-${selectedUpholstery}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="relative w-full h-full z-10"
                            >
                                <Image
                                    src={currentVisualizerImage}
                                    alt="S3 Configuration Preview"
                                    fill
                                    className="object-contain drop-shadow-2xl mix-blend-multiply"
                                    priority
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Top Context Badge */}
                        <div className="absolute top-6 left-6 z-20">
                            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2">
                                <Info className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-semibold text-gray-700 capitalize">
                                    {activeTab} Preview
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Controls Side (Right) - Scrolling */}
                    <div className="w-full lg:w-1/2 flex flex-col pt-0 lg:pt-4 space-y-8 lg:space-y-16">

                        {/* Custom Tabs */}
                        <div className="flex space-x-2 p-1.5 bg-slate-100 lg:rounded-2xl mb-6 w-full lg:w-fit mx-auto lg:mx-0 overflow-x-auto scrollbar-hide snap-x rounded-xl">
                            <button
                                onClick={() => setActiveTab("color")}
                                className={`flex items-center space-x-2 px-4 lg:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap snap-center ${activeTab === "color" ? "bg-white text-blue-600 shadow-sm border border-gray-200/50" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <PaintBucket className="w-4 h-4" />
                                <span>1. Color</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("handpiece")}
                                className={`flex items-center space-x-2 px-4 lg:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap snap-center ${activeTab === "handpiece" ? "bg-white text-blue-600 shadow-sm border border-gray-200/50" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <Hand className="w-4 h-4" />
                                <span>2. Delivery</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("upholstery")}
                                className={`flex items-center space-x-2 px-4 lg:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap snap-center ${activeTab === "upholstery" ? "bg-white text-blue-600 shadow-sm border border-gray-200/50" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <Layers className="w-4 h-4" />
                                <span>3. Upholstery</span>
                            </button>
                        </div>

                        {/* Panel Content */}
                        <div className="flex-1 w-full mx-auto pb-12 lg:pb-0 relative min-h-[400px]">
                            <AnimatePresence mode="popLayout">
                                {/* COLOR SELECTION */}
                                {activeTab === "color" && (
                                    <motion.div
                                        key="color-panel"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-8"
                                    >
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Unit Color</h3>
                                            <p className="text-gray-500 text-sm mb-6">Match your clinic's aesthetic perfectly.</p>
                                        </div>
                                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-3 lg:gap-4">
                                            {COLORS.map((color) => (
                                                <button
                                                    key={color.id}
                                                    onClick={() => setSelectedColor(color.id)}
                                                    className={`relative group flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${selectedColor === color.id
                                                        ? "bg-slate-100 ring-2 ring-blue-500 ring-offset-2 scale-105"
                                                        : "hover:bg-slate-50 border border-transparent hover:border-gray-200 hover:-translate-y-1"
                                                        }`}
                                                >
                                                    <div
                                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-3 shadow-[inset_0_-2px_6px_rgba(0,0,0,0.15)] ring-1 ring-black/5"
                                                        style={{ backgroundColor: color.hex }}
                                                    >
                                                        {selectedColor === color.id && (
                                                            <div className="absolute inset-0 flex items-center justify-center top-[-1.5rem]">
                                                                <Check className="w-5 h-5 text-white drop-shadow-md" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className={`text-[10px] sm:text-xs font-semibold text-center leading-tight ${selectedColor === color.id ? "text-blue-600" : "text-gray-600"
                                                        }`}>
                                                        {color.name}
                                                    </span>
                                                    <span className="text-[9px] text-gray-400 mt-0.5">{color.code}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* HANDPIECE SELECTION */}
                                {activeTab === "handpiece" && (
                                    <motion.div
                                        key="handpiece-panel"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-8"
                                    >
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Delivery System</h3>
                                            <p className="text-gray-500 text-sm mb-6">Select the ideal instrument delivery method for your workflow.</p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {HANDPIECES.map((hp) => (
                                                <button
                                                    key={hp.id}
                                                    onClick={() => setSelectedHandpiece(hp.id)}
                                                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left group ${selectedHandpiece === hp.id
                                                        ? "border-blue-500 bg-blue-50/30 shadow-md"
                                                        : "border-gray-100 hover:border-blue-200 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedHandpiece === hp.id ? 'border-blue-500' : 'border-gray-300 group-hover:border-blue-300'}`}>
                                                        {selectedHandpiece === hp.id && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                                                    </div>
                                                    <div>
                                                        <h4 className={`font-semibold mb-1 ${selectedHandpiece === hp.id ? "text-blue-700" : "text-gray-900"}`}>{hp.name}</h4>
                                                        <p className="text-sm text-gray-500">{hp.description}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* UPHOLSTERY SELECTION */}
                                {activeTab === "upholstery" && (
                                    <motion.div
                                        key="upholstery-panel"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-8"
                                    >
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Upholstery Material</h3>
                                            <p className="text-gray-500 text-sm mb-6">Choose between durability, aesthetics, and hygiene.</p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {UPHOLSTERY.map((up) => (
                                                <button
                                                    key={up.id}
                                                    onClick={() => setSelectedUpholstery(up.id)}
                                                    className={`flex flex-col gap-3 p-5 rounded-2xl border-2 transition-all text-left group ${selectedUpholstery === up.id
                                                        ? "border-blue-500 bg-blue-50/30 shadow-md"
                                                        : "border-gray-100 hover:border-blue-200 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3 w-full">
                                                        <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedUpholstery === up.id ? 'border-blue-500' : 'border-gray-300 group-hover:border-blue-300'}`}>
                                                            {selectedUpholstery === up.id && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                                                        </div>
                                                        <h4 className={`font-semibold ${selectedUpholstery === up.id ? "text-blue-700" : "text-gray-900"}`}>{up.name}</h4>
                                                    </div>
                                                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-100">
                                                        <Image
                                                            src={up.image}
                                                            alt={up.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1">{up.description}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
