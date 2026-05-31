"use client";

import { motion } from "framer-motion";
import { Globe, Shield, Zap, Clock } from "lucide-react";

const features = [
    {
        icon: Globe,
        title: "Global Track Record",
        description:
            "From Russia to Mexico to the Philippines — the N-series is the backbone of dental practices across 120+ countries.",
    },
    {
        icon: Shield,
        title: "Shield-Shape Design",
        description:
            "Inspired by the shield — a symbol of patient protection. Every curve and line is engineered with safety in mind.",
    },
    {
        icon: Zap,
        title: "Intelligent Soft Start/Stop",
        description:
            "No jarring movements. The motor system rises and falls smoothly, keeping even the most anxious patients completely relaxed.",
    },
    {
        icon: Clock,
        title: "Built for Decades",
        description:
            "Chair lifespan of 10-15+ years with proper maintenance. Backed by ROSON\u2019s 20 years of manufacturing excellence.",
    },
];

export default function N2ProTrustSection() {
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
                            Trusted by 80,000+ Dentists
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                            The Most-Proven Chair in Our Lineup
                        </h2>
                        <p className="mt-4 text-lg sm:text-xl leading-8 text-emerald-100/70">
                            Over 80,000 dental professionals worldwide trust the N-series platform.
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
