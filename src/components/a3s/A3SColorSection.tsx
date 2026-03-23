"use client";

import { motion } from "framer-motion";
import { Palette } from "lucide-react";

const colors = [
    "Tiffany Blue",
    "Begonia Red",
    "Olive Green",
    "Gray",
    "Coloured Glaze Blue",
    "Orange",
    "Light Green",
];

const colorHexMap: Record<string, string> = {
    "Tiffany Blue": "#0ABAB5",
    "Begonia Red": "#E53935",
    "Olive Green": "#558B2F",
    "Gray": "#9E9E9E",
    "Coloured Glaze Blue": "#42A5F5",
    "Orange": "#F57C00",
    "Light Green": "#A5D6A7",
};

export default function A3SColorSection() {
    return (
        <section className="py-16 lg:py-24 bg-[#0A1410] overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Section Header */}
                <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-emerald-400 font-semibold tracking-widest text-sm uppercase mb-3 block">
                            Express Your Identity
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                            7+ Colors. Your Clinic&apos;s Personality.
                        </h2>
                        <p className="mt-4 text-lg sm:text-xl leading-8 text-emerald-100/70">
                            The widest color palette in the entire ROSON lineup. Express your clinic&apos;s identity.
                        </p>
                    </motion.div>
                </div>

                {/* Color Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16 lg:mb-20">
                    {colors.map((color, index) => (
                        <motion.div
                            key={color}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative rounded-2xl border border-emerald-500/20 bg-emerald-950/30 p-8 backdrop-blur-sm"
                        >
                            <div className="flex items-start gap-5">
                                <div
                                    className="flex-shrink-0 w-12 h-12 rounded-xl border border-emerald-500/20 flex items-center justify-center"
                                    style={{ backgroundColor: colorHexMap[color] }}
                                />
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {color}
                                    </h3>
                                    <p className="text-emerald-100/60 leading-relaxed">
                                        Highly durable finish that resists fading and chemical wear. Match your clinic&apos;s branding perfectly.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="rounded-2xl border border-emerald-500/15 bg-emerald-950/20 p-8 lg:p-10"
                >
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 mb-4">
                            <Palette className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                                Widest Color Selection in ROSON Lineup
                            </span>
                        </div>
                        <p className="text-emerald-100/60 max-w-2xl mx-auto">
                            No other ROSON model offers this many color options. The A3S lets you create a cohesive, branded patient experience from the moment they walk in.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
