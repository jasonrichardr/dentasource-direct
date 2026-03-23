"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Droplets, FlaskConical, Microscope } from "lucide-react";

const features = [
    {
        icon: ShieldCheck,
        title: "Exceptional Disinfection",
        description:
            "Eliminates 99.9999% of bacteria through electrolyzed oxidizing water. No harsh chemicals needed.",
    },
    {
        icon: Microscope,
        title: "Biofilm Prevention",
        description:
            "Continuous micro-electrolysis inhibits biofilm formation in the SMC pipelines, drastically reducing cross-contamination risks.",
    },
    {
        icon: Droplets,
        title: "Non-Toxic & Gentle",
        description:
            "Produces safe, medically-verified active oxygen clusters. Water is the only by-product — zero irritation for patients.",
    },
    {
        icon: FlaskConical,
        title: "Corrosion-Free",
        description:
            "Zero free chlorine ions produced, protecting internal metal valves and components from premature wear.",
    },
];

const certifications = [
    "Hydrogen Peroxide Concentration Test",
    "Static Liquid Bactericidal Test",
    "Oral Toxicity Test",
    "Ozone Concentration Test",
    "Colony Inspection Test",
    "Dynamic Liquid Bactericidal Test",
];

export default function A3DisinfectionSection() {
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
                            EOW-TECH Waterline System
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                            Revolutionary EOW-TECH Disinfection
                        </h2>
                        <p className="mt-4 text-lg sm:text-xl leading-8 text-emerald-100/70">
                            99.9999% Bacteria Elimination — powered by electrolyzed oxidizing water technology built directly into the A3 waterline system.
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

                {/* Certifications Strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="rounded-2xl border border-emerald-500/15 bg-emerald-950/20 p-8 lg:p-10"
                >
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 mb-4">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                                Backed by 6 Laboratory Certifications
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {certifications.map((cert, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 rounded-xl bg-emerald-950/40 border border-emerald-500/10 px-4 py-3"
                            >
                                <svg
                                    className="w-5 h-5 text-emerald-400 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                <span className="text-sm font-medium text-emerald-100/80">
                                    {cert}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
