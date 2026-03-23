"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const features = [
    {
        title: "6-Way Dynamic Adjustability",
        description: "Supports diverse body types with a full range of ergonomic adjustments.",
    },
    {
        title: "Ergonomic Hip & Back Support",
        description: "Contoured design cradles your hips and lower back for all-day comfort.",
    },
    {
        title: "Relaxes Thigh Muscles",
        description: "Seat geometry reduces pressure on thigh muscles during extended procedures.",
    },
    {
        title: "Maintains Spine Curvature",
        description: "Prevents fatigue and musculoskeletal strain during 8+ hour clinical days.",
    },
    {
        title: "Stable Base",
        description: "Heavy-duty base provides rock-solid stability during precise clinical work.",
    },
    {
        title: "Silent Casters",
        description: "Smooth, silent repositioning across any clinic floor without disruption.",
    },
];

export default function S9ErgonomicsSection() {
    return (
        <section className="py-16 lg:py-24 bg-zinc-50 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Section Header */}
                <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-blue-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
                            Practitioner Wellness
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                            Engineered for Practitioner Longevity
                        </h2>
                        <p className="mt-4 text-base sm:text-lg leading-8 text-gray-600">
                            Musculoskeletal disorders are the #1 cause of disability in dentistry. The 6-way adjustable stool is designed to prevent them.
                        </p>
                    </motion.div>
                </div>

                {/* Content: Image + Features */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="w-full lg:w-5/12"
                    >
                        <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-[#EBEBEB] border border-gray-100">
                            <Image
                                src="/images/products/a3/Advanced features and components/Dynamic_Comfort_Stool.jpg"
                                alt="6-Way Adjustable Dentist Stool"
                                fill
                                className="object-contain p-8"
                                sizes="(max-width: 1024px) 100vw, 40vw"
                            />
                        </div>
                        <div className="mt-6 text-center">
                            <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                                The 6-Way Adjustable Dentist Stool
                            </span>
                        </div>
                    </motion.div>

                    {/* Features Grid */}
                    <div className="w-full lg:w-7/12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.4,
                                        delay: index * 0.08,
                                    }}
                                    className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mt-0.5">
                                            <svg
                                                className="w-4 h-4 text-blue-600"
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
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900 mb-1">
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
