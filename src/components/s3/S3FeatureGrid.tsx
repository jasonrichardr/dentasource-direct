"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Lightbulb, Maximize, Stethoscope, Droplet, Move, ShieldCheck } from "lucide-react";

const features = [
    {
        title: "LED Sensor Operation Light",
        description: "Optimal illumination of ≥35,000 Lux with touchless on/off operation, stepless intensity control, and a sterilizable, detachable handle.",
        icon: <Lightbulb className="w-5 h-5 text-sky-400" />,
        image: "/images/products/s3/Advanced features and components/01_light.webp",
        highlight: "35,000+ Lux",
    },
    {
        title: "Compact Workflow Design",
        description: "Maximized efficiency allowing the dentist to quickly reach instruments and touchless panels, featuring ample space on both primary and expanded tables.",
        icon: <Maximize className="w-5 h-5 text-sky-400" />,
        image: "/images/products/s3/Advanced features and components/02_compact.jpg",
        highlight: "Expanded Table",
    },
    {
        title: "Swiveling Detachable Spittoon",
        description: "Designed for easy accessibility and maximum hygiene, the spittoon bowl can be effortlessly detached for deep cleaning and high-level disinfection.",
        icon: <Droplet className="w-5 h-5 text-sky-400" />,
        image: "/images/products/s3/Advanced features and components/03_spittoon.jpg",
        highlight: "Easy Clean",
    },
    {
        title: "Detachable Suction Filter",
        description: "Innovative design that prevents bacterial accumulation in unit water using a specialized filter net. Easily removed for routine sterilization.",
        icon: <ShieldCheck className="w-5 h-5 text-sky-400" />,
        image: "/images/products/s3/Advanced features and components/04_filter.jpg",
        highlight: "Infection Control",
    },
    {
        title: "Multi-Articulated Headrest",
        description: "Allows swift positioning through one-handed operation. Delivers unparalleled stability, making it exceptionally safe for children and disabled patients.",
        icon: <Stethoscope className="w-5 h-5 text-sky-400" />,
        image: "/images/products/s3/Advanced features and components/08_headrest.jpg",
        highlight: "Supreme Stability",
    },
    {
        title: "Flexible Dentist Stool",
        description: "Provides robust 6-way adjustment capabilities. Ergonomic design fits back and hips perfectly, relaxing thigh muscles to prevent fatigue.",
        icon: <Move className="w-5 h-5 text-sky-400" />,
        image: "/images/products/s3/Advanced features and components/07_stool.jpg",
        highlight: "6-Way Adjust",
    },
];

export default function S3FeatureGrid() {
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
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Superior Dental Care</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-zinc-400"
                    >
                        The S3 is engineered to withstand the rigors of a busy practice while providing an intuitive, premium experience for both practitioner and patient.
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
