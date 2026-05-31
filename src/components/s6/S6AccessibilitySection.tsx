"use client";

import { motion } from "framer-motion";
import { Accessibility, Heart, Baby, Armchair } from "lucide-react";

const features = [
    {
        icon: Accessibility,
        title: "Wheelchair Transfers",
        description:
            "380mm floor height makes wheelchair-to-chair transfers safe and dignified. No awkward lifting.",
    },
    {
        icon: Baby,
        title: "Pediatric Patients",
        description:
            "Children can climb on and off without adult lifting. Less anxiety, faster appointments.",
    },
    {
        icon: Heart,
        title: "Elderly Comfort",
        description:
            "Patients with mobility issues sit down with confidence. No fear of falling.",
    },
    {
        icon: Armchair,
        title: "Universal Design",
        description:
            "Casting steel frame supports up to 150kg. The S6 serves every patient that walks through your door.",
    },
];

export default function S6AccessibilitySection() {
    return (
        <section className="py-16 lg:py-24 bg-[#0A1410] overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Section Header */}
                <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-emerald-400 font-semibold tracking-widest text-sm uppercase mb-3 block">
                            380mm Lowest Position
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                            The Most Accessible Chair in Our Lineup
                        </h2>
                        <p className="mt-4 text-lg sm:text-xl leading-8 text-emerald-100/70">
                            380mm lowest position — designed for every patient.
                        </p>
                    </motion.div>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16 lg:mb-20">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
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
