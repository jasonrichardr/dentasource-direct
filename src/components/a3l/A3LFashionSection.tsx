"use client";

import { motion } from "framer-motion";
import { Palette, Sparkles, Wand2, Crown } from "lucide-react";

const features = [
    {
        icon: Palette,
        title: "Fashion-Forward Customization",
        description:
            "Expanded aesthetic options — customize colors, upholstery, and design elements to match your clinic's brand identity.",
    },
    {
        icon: Sparkles,
        title: "A3 Core Technology",
        description:
            "Same chassis, same motor, same LCD, same handpiece system. The A3L doesn't compromise on engineering — just on price.",
    },
    {
        icon: Wand2,
        title: "EOW-TECH Available",
        description:
            "The A3's revolutionary electrolytic disinfection system is available as an optional upgrade — add it when you're ready.",
    },
    {
        icon: Crown,
        title: "Premium Feel, Accessible Price",
        description:
            "PU leather standard keeps the price accessible. Upgrade to seamless microfiber when budget allows — same 5-year warranty.",
    },
];

export default function A3LFashionSection() {
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
                            The Fashion Story
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                            Same A3 Platform. Your Clinic&apos;s Identity.
                        </h2>
                        <p className="mt-4 text-lg sm:text-xl leading-8 text-emerald-100/70">
                            The A3L delivers the same core technology as our flagship — but lets you customize the look.
                        </p>
                    </motion.div>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative rounded-2xl border border-emerald-500/20 bg-emerald-950/30 p-8 backdrop-blur-sm"
                        >
                            <div className="flex items-start gap-5">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                    <feature.icon className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-emerald-100/60 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
