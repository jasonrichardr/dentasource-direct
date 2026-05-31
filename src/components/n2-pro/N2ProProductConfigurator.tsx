"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PaintBucket, Hand, Check, Layers } from "lucide-react";

const COLORS = [
    { id: "glaze-blue", name: "Coloured Glaze Blue", hex: "#42A5F5", image: "/images/products/n2-pro/Unit Color Selection/Coloured Glaze Blue.jpg" },
    { id: "skyscraper-gray", name: "Skyscraper Gray", hex: "#9E9E9E", image: "/images/products/n2-pro/Unit Color Selection/Skyscraper Gray.jpg" },
    { id: "begonia-red", name: "Begonia Red", hex: "#E53935", image: "/images/products/n2-pro/Unit Color Selection/Begonia Red.jpg" },
    { id: "hermes-orange", name: "Hermes Orange", hex: "#F57C00", image: "/images/products/n2-pro/Unit Color Selection/Hermes Orange.jpg" },
    { id: "olive-green", name: "Olive Green", hex: "#558B2F", image: "/images/products/n2-pro/Unit Color Selection/Olive Green.jpg" },
    { id: "mountain-blue", name: "Mountain Blue", hex: "#37474F", image: "/images/products/n2-pro/Unit Color Selection/Mountain Blue.jpg" },
    { id: "roson-blue", name: "ROSON Blue", hex: "#1565C0", image: "/images/products/n2-pro/Unit Color Selection/ROSON Blue.jpg" },
];

const HANDPIECES = [
    {
        id: "over-patient",
        title: "Over-the-Patient",
        description: "Classic ergonomic delivery — instruments swing over the patient for direct access.",
        image: "/images/products/n2-pro/Handpiece Placement Choices/Over-the-Patient.jpg",
    },
    {
        id: "cart",
        title: "Cart-Mounted",
        description: "Standalone mobile cart — maximum flexibility, easy to reposition.",
        image: "/images/products/n2-pro/Handpiece Placement Choices/Cart-Mounted.jpg",
    },
];

const UPHOLSTERY = [
    {
        id: "pu-leather",
        name: "PU Leather",
        image: "/images/products/n2-pro/Upholstery Selection/PU Leather.webp",
        description: "Durable, easy to clean. Standard option.",
    },
    {
        id: "sewn-microfiber",
        name: "Sewn Microfiber",
        image: "/images/products/n2-pro/Upholstery Selection/Sewn Microfiber.webp",
        description: "Premium feel with elegant stitching.",
    },
    {
        id: "seamless-microfiber",
        name: "Seamless Microfiber",
        image: "/images/products/n2-pro/Upholstery Selection/Seamless Microfiber.webp",
        description: "Top-tier. No seams = better infection control. 5-year warranty.",
    },
];

const TABS = [
    { id: "color" as const, label: "Color", shortLabel: "Color", icon: PaintBucket },
    { id: "handpiece" as const, label: "Delivery", shortLabel: "Delivery", icon: Hand },
    { id: "upholstery" as const, label: "Upholstery", shortLabel: "Material", icon: Layers },
];

export default function N2ProProductConfigurator() {
    const [activeTab, setActiveTab] = useState<"color" | "handpiece" | "upholstery">("color");
    const [activeColor, setActiveColor] = useState(COLORS[0]);
    const [activeHandpiece, setActiveHandpiece] = useState(HANDPIECES[0]);
    const [activeUpholstery, setActiveUpholstery] = useState(UPHOLSTERY[0]);

    const currentMainImage =
        activeTab === "color" ? activeColor.image :
            activeTab === "handpiece" ? activeHandpiece.image :
                activeUpholstery.image;

    const currentAlt =
        activeTab === "color" ? `N2 PRO in ${activeColor.name}` :
            activeTab === "handpiece" ? `N2 PRO ${activeHandpiece.title} delivery` :
                `N2 PRO ${activeUpholstery.name} upholstery`;

    return (
        <section id="configurator" className="py-16 lg:py-24 bg-white border-t border-gray-100">
            <div className="mx-auto px-4 sm:px-6 max-w-7xl">
                <div className="text-center mb-10 sm:mb-16">
                    <span className="text-emerald-600 font-semibold tracking-widest text-xs sm:text-sm uppercase mb-3 block">
                        Your Dental Unit, Your Way
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                        Build Your N2 PRO
                    </h2>
                </div>

                {/* Mobile-first: tabs on top, preview below, options below that */}
                {/* Desktop: side by side */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

                    {/* LEFT: Preview image */}
                    <div className="w-full lg:w-1/2">
                        <div className="lg:sticky lg:top-24">
                            {/* Tabs — always visible above the image on mobile */}
                            <div className="flex w-full mb-4 bg-zinc-100 rounded-xl p-1 lg:hidden">
                                {TABS.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                                                activeTab === tab.id
                                                    ? "bg-white text-emerald-600 shadow-sm"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            <span>{tab.shortLabel}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Preview image */}
                            <div className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-50">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentMainImage}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-0"
                                    >
                                        <Image
                                            src={currentMainImage}
                                            alt={currentAlt}
                                            fill
                                            className="object-contain p-4 sm:p-6"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Options */}
                    <div className="w-full lg:w-1/2 flex flex-col">

                        {/* Desktop tabs — hidden on mobile (shown above image instead) */}
                        <div className="hidden lg:flex space-x-2 p-1.5 bg-zinc-100 rounded-2xl mb-10 w-fit">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                            activeTab === tab.id
                                                ? "bg-white text-emerald-600 shadow-sm border border-gray-200/50"
                                                : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* COLOR OPTIONS */}
                        {activeTab === "color" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Select Unit Color</h3>
                                    <p className="text-gray-500 text-sm">Match your clinic&apos;s aesthetic.</p>
                                </div>

                                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                                    {COLORS.map((color) => (
                                        <button
                                            key={color.id}
                                            onClick={() => setActiveColor(color)}
                                            className={`group flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${
                                                activeColor.id === color.id
                                                    ? "bg-white shadow-md ring-1 ring-emerald-200 scale-105"
                                                    : "hover:bg-gray-50"
                                            }`}
                                        >
                                            <div
                                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-inner border-2 border-white flex items-center justify-center transition-transform group-hover:scale-110"
                                                style={{ backgroundColor: color.hex }}
                                            >
                                                {activeColor.id === color.id && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                                            </div>
                                            <span className="text-[10px] sm:text-xs font-medium text-gray-600 text-center leading-tight">
                                                {color.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {/* Selected color info */}
                                <div className="p-4 sm:p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg shrink-0" style={{ backgroundColor: activeColor.hex }} />
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">{activeColor.name}</h4>
                                            <p className="text-xs text-gray-600">Highly durable finish. Resists fading and chemical wear.</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* DELIVERY OPTIONS */}
                        {activeTab === "handpiece" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Delivery System</h3>
                                    <p className="text-gray-500 text-sm">Choose the setup that matches your workflow.</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {HANDPIECES.map((hp) => (
                                        <button
                                            key={hp.id}
                                            onClick={() => setActiveHandpiece(hp)}
                                            className={`relative flex items-start text-left p-4 rounded-2xl border-2 transition-all ${
                                                activeHandpiece.id === hp.id
                                                    ? "border-emerald-500 bg-emerald-50/30"
                                                    : "border-gray-100 hover:border-gray-200"
                                            }`}
                                        >
                                            <div className="flex-grow pr-8">
                                                <h4 className="font-bold text-gray-900">{hp.title}</h4>
                                                <p className="text-sm text-gray-500 mt-1">{hp.description}</p>
                                            </div>
                                            <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                activeHandpiece.id === hp.id ? "border-emerald-500" : "border-gray-300"
                                            }`}>
                                                {activeHandpiece.id === hp.id && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* UPHOLSTERY OPTIONS */}
                        {activeTab === "upholstery" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Upholstery Material</h3>
                                    <p className="text-gray-500 text-sm">Select your preferred material grade.</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {UPHOLSTERY.map((mat) => (
                                        <button
                                            key={mat.id}
                                            onClick={() => setActiveUpholstery(mat)}
                                            className={`flex items-center p-3 rounded-xl border-2 transition-all ${
                                                activeUpholstery.id === mat.id
                                                    ? "border-emerald-500 bg-emerald-50/30"
                                                    : "border-gray-100 hover:border-gray-200"
                                            }`}
                                        >
                                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 mr-3 sm:mr-4">
                                                <Image src={mat.image} alt={mat.name} fill className="object-cover" sizes="64px" />
                                            </div>
                                            <div className="text-left flex-grow">
                                                <h4 className="font-bold text-sm text-gray-900">{mat.name}</h4>
                                                <p className="text-xs text-gray-500 leading-snug mt-0.5">{mat.description}</p>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
                                                activeUpholstery.id === mat.id ? "border-emerald-500" : "border-gray-300"
                                            }`}>
                                                {activeUpholstery.id === mat.id && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
