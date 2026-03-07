"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Lightbulb, Maximize, Share2, Footprints, Move, ShieldCheck } from "lucide-react";

const features = [
    {
        title: "Rolight S Dental Light",
        description: "Employs high-quality Philips LEDs with precise digital control over illumination and color temperature, plus infrared touchless operation.",
        icon: <Lightbulb className="w-5 h-5 text-sky-400" />,
        image: "/images/products/s6/Advanced features and components/01_light.webp",
        highlight: "Philips LEDs",
    },
    {
        title: "Efficient & Compact Workflow",
        description: "The dentist's table can be quickly positioned using an ergonomic handle, ensuring instruments and touch panels are reached with minimal movement.",
        icon: <Maximize className="w-5 h-5 text-sky-400" />,
        image: "/images/products/s6/Advanced features and components/02_compact.jpg",
        highlight: "Rapid Positioning",
    },
    {
        title: "Four-Hand Operation",
        description: "Features a flexible, swiveling assistant unit that is always easy to reach, maximizing space for effective teamwork.",
        icon: <Share2 className="w-5 h-5 text-sky-400" />,
        image: "/images/products/s6/Advanced features and components/03_four_hand.jpg",
        highlight: "Optimal Teamwork",
    },
    {
        title: "Hands-Free Operation",
        description: "Versatile 4-way foot control including dedicated buttons for the cup filler and rinsing spittoon to prevent cross-infection.",
        icon: <Footprints className="w-5 h-5 text-sky-400" />,
        image: "/images/products/s6/Advanced features and components/04_foot_control.jpg",
        highlight: "Infection Control",
    },
    {
        title: "Stable Headrest",
        description: "One-handed operation utilizing two articulators. The multi-joint design delivers unparalleled stability for all patient types.",
        icon: <ShieldCheck className="w-5 h-5 text-sky-400" />,
        image: "/images/products/s6/Advanced features and components/06_headrest.jpg",
        highlight: "Swift Adjustment",
    },
    {
        title: "Casting Steel Frame",
        description: "Solid, cast steel foundation provides exceptional durability and an unwavering sense of security and comfort for the patient.",
        icon: <Move className="w-5 h-5 text-sky-400" />,
        image: "/images/products/s6/Advanced features and components/07_chair_frame.jpg",
        highlight: "Built to Last",
    },
];

export default function S6FeatureGrid() {
    return (
        <section id="features" className="py-20 lg:py-32 bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03)_0%,transparent_100%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
                    >
                        Advanced Features for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Essential Clinical Performance</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-zinc-400"
                    >
                        The S6 is engineered with smart ergonomics and robust materials to ensure a reliable and highly efficient clinical environment.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl overflow-hidden group hover:bg-zinc-900 transition-colors"
                        >
                            <div className="relative h-64 w-full bg-zinc-800 overflow-hidden">
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/20 to-transparent" />
                                <div className="absolute bottom-4 left-4 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 px-3 py-1 rounded-full text-xs font-semibold text-sky-400">
                                    {feature.highlight}
                                </div>
                            </div>
                            <div className="p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2.5 bg-sky-500/10 rounded-xl border border-sky-500/20">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                                </div>
                                <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
