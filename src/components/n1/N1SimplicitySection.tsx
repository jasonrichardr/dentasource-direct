"use client";

import { motion } from "framer-motion";
import { Zap, Wrench, Timer, DollarSign } from "lucide-react";

const features = [
    {
        icon: Zap,
        title: "One Starter",
        description:
            "Air, water, electricity — one switch starts everything. No sequence to memorize, no steps to miss.",
    },
    {
        icon: Wrench,
        title: "Fastest Install",
        description:
            "Simpler plumbing, simpler electrical. Your technician finishes faster. Your clinic opens sooner.",
    },
    {
        icon: Timer,
        title: "Rotatable Arm",
        description:
            "Right arm swings out for patient entry/exit. No awkward maneuvering. Fast turnover between patients.",
    },
    {
        icon: DollarSign,
        title: "Proven Platform",
        description:
            "Same core N-series platform trusted by 80,000+ dentists. Same ceramic spittoon, same Philips LED light, same build quality.",
    },
];

export default function N1SimplicitySection() {
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
                            Simplicity by Design
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                            Simplicity Is the Ultimate Sophistication
                        </h2>
                        <p className="mt-4 text-lg sm:text-xl leading-8 text-emerald-100/70">
                            The N1 proves you don&apos;t need complexity to deliver excellence.
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
