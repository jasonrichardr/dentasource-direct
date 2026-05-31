"use client";

import { motion } from "framer-motion";
import {
    Armchair,
    Lightbulb,
    CircleDot,
    Footprints,
    User,
    Sofa,
    Star,
    Pipette,
    Cable,
    BookOpen,
} from "lucide-react";

const items = [
    {
        icon: Armchair,
        title: "Main Dental Unit",
        description: "Complete chair + base assembly",
    },
    {
        icon: Lightbulb,
        title: "8-Tooth Smile Oral Light",
        description: "Philips LED array with daylight-quality illumination",
    },
    {
        icon: CircleDot,
        title: "Swiveling Cuspidor Bowl",
        description: "With integrated flushing system",
    },
    {
        icon: Footprints,
        title: "Upgraded Foot Control",
        description: "4-way foot controller (IPX4 rated) \u2014 free upgrade on all units",
        badge: "DentaSource Exclusive",
    },
    {
        icon: User,
        title: "Multi-Articulated Headrest",
        description: "Adjustable for all patient sizes",
    },
    {
        icon: Sofa,
        title: "Backrest + Seat",
        description: "With your choice of upholstery color",
    },
    {
        icon: Star,
        title: "6-Way Adjustable Dentist Stool",
        description: "Complete with gas spring, casters, and ergonomic support",
        highlight: true,
    },
    {
        icon: Pipette,
        title: "3-Way Syringe + Suction",
        description: "Stainless steel syringe, strong suction + weak suction",
    },
    {
        icon: Cable,
        title: "Handpiece Tubing",
        description: "Stainless steel spiral, short tube design",
    },
    {
        icon: BookOpen,
        title: "Documentation Kit",
        description: "User manual, quality certificate, warranty card & accessories kit",
    },
];

export default function S9WhatsInTheBox() {
    return (
        <section className="py-16 lg:py-24 bg-zinc-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Section Header */}
                <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-blue-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
                            Your Complete Setup
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                            Built to Start, Built to Last
                        </h2>
                        <p className="mt-4 text-base sm:text-lg leading-8 text-gray-600">
                            10 precision-engineered components. One delivery. Zero surprises.
                        </p>
                    </motion.div>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.05,
                            }}
                            className={`relative rounded-2xl border p-6 ${
                                item.highlight
                                    ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/20"
                                    : "bg-white border-gray-100 shadow-sm"
                            }`}
                        >
                            {item.highlight && (
                                <div className="absolute -top-3 right-4">
                                    <span className="inline-flex items-center rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-gray-900 uppercase tracking-wider">
                                        Included Free
                                    </span>
                                </div>
                            )}
                            {"badge" in item && item.badge && (
                                <div className="absolute -top-3 right-4">
                                    <span className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                                        {item.badge}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-start gap-4">
                                <div
                                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                                        item.highlight
                                            ? "bg-white/20"
                                            : "bg-blue-50"
                                    }`}
                                >
                                    <item.icon
                                        className={`w-5 h-5 ${
                                            item.highlight
                                                ? "text-white"
                                                : "text-blue-600"
                                        }`}
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className={`text-xs font-bold ${
                                                item.highlight
                                                    ? "text-blue-200"
                                                    : "text-gray-400"
                                            }`}
                                        >
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <h3
                                            className={`text-base font-bold ${
                                                item.highlight
                                                    ? "text-white"
                                                    : "text-gray-900"
                                            }`}
                                        >
                                            {item.title}
                                        </h3>
                                    </div>
                                    <p
                                        className={`text-sm leading-relaxed ${
                                            item.highlight
                                                ? "text-blue-100"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-10 text-center"
                >
                    <p className="text-sm text-gray-500">
                        The 6-way adjustable dentist stool comes included as standard with every S9.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
