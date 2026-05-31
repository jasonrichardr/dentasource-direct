"use client";

import { motion } from "framer-motion";
import { Sun, Shield, Eye, Sparkles } from "lucide-react";

const features = [
    {
        icon: Sun,
        title: "\u226535,000 Lux Output",
        description:
            "Published, documented spec. Most competitors don\u2019t even tell you their lux rating. The S3 puts it in writing.",
    },
    {
        icon: Shield,
        title: "Autoclavable Handle",
        description:
            "Remove the handle, autoclave at 134\u00b0C, reattach. True infection control at the light \u2014 not just the chair.",
    },
    {
        icon: Eye,
        title: "Touchless Sensor Control",
        description:
            "Wave near the sensor to turn on/off. Stepless intensity adjustment without touching anything.",
    },
    {
        icon: Sparkles,
        title: "Multi-Angle Rotating Arm",
        description:
            "Position the light exactly where you need it. The rotating arm meets different treatment angle requirements.",
    },
];

export default function S3LightSection() {
    return (
        <section className="py-16 lg:py-24 bg-[#0A1410] overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Section Header */}
                <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-emerald-400 font-semibold tracking-widest text-sm uppercase mb-3 block">
                            \u226535,000 Lux LED System
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                            The Brightest Light in Our Lineup
                        </h2>
                        <p className="mt-4 text-lg sm:text-xl leading-8 text-emerald-100/70">
                            \u226535,000 lux \u2014 more than most chairs at twice the price.
                        </p>
                    </motion.div>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16 lg:mb-20">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
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
