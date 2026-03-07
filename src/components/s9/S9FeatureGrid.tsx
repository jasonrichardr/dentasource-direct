"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const features = [
    {
        title: "Efficient & Compact Workflow",
        description: "45-degree angled operation panel with 3 preset smart memory positions designed for highly efficient, effortless access.",
        image: "/images/products/s9/Advanced features and components/14.jpg",
        bullets: [
            "Ergonomic Console",
            "Smart Memory Positions"
        ]
    },
    {
        title: "Premium Leather Upholstery",
        description: "Elastic, skin-friendly, eco-friendly, and ultra-breathable materials designed for maximum patient coziness. Described as 'as comfortable as sitting on a throne.'",
        image: "/images/products/s9/Advanced features and components/4-5.jpg",
        bullets: [
            "Supreme Comfort",
            "Skin-friendly & Eco-friendly",
            "Ultra-breathable"
        ]
    },
    {
        title: "Dynamic Comfort: RS06 Stool",
        description: "Eight-way adjustability with a 5° forward tilt capability that maintains the natural curvature of the spine for postural health.",
        image: "/images/products/s9/Advanced features and components/18.jpg",
        bullets: [
            "8-Way Adjustability",
            "5° Forward Tilt",
            "360° Silent Casters"
        ]
    },
    {
        title: "One-Key Smart Drainage Position",
        description: "A single-button activation streamlines your end-of-day cleaning routine by automatically raising the chair to its highest position and triggering a comprehensive 5-minute spittoon flushing cycle.",
        image: "/images/products/s9/Advanced features and components/6-14.jpg",
        bullets: [
            "Automated Cleaning",
            "Efficient Operation",
            "Single-button Activation"
        ]
    }
];

export default function S9FeatureGrid() {
    return (
        <section id="features" className="bg-zinc-50 py-16 lg:py-24 sm:py-32 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-12 lg:mb-20">
                    <h2 className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-widest mb-3">
                        Affordable Luxury
                    </h2>
                    <p className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        Advanced Features.
                    </p>
                    <p className="mt-6 text-base sm:text-lg leading-8 text-gray-600">
                        The S9 model is equipped with a suite of advanced, user-centric features designed to optimize clinical workflow and elevate patient care.
                    </p>
                </div>

                <div className="space-y-16 lg:space-y-32">
                    {features.map((feature, index) => (
                        <FeatureRow
                            key={feature.title}
                            feature={feature}
                            isReversed={index % 2 !== 0}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeatureRow({ feature, isReversed }: { feature: any, isReversed: boolean }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 80%", "end 20%"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

    return (
        <motion.div
            ref={containerRef}
            style={{ opacity }}
            className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-24 items-center`}
        >
            <div className="w-full lg:w-1/2 relative aspect-square md:aspect-auto md:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-[#EBEBEB] border border-gray-100">
                <motion.div className="absolute inset-0 w-full h-[120%]" style={{ y }}>
                    <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-contain p-4 sm:p-10 scale-[1.15]"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0, x: isReversed ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
                        {feature.title}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-600 mb-6 lg:mb-8 leading-relaxed">
                        {feature.description}
                    </p>

                    <ul className="space-y-4">
                        {feature.bullets.map((bullet: string, i: number) => (
                            <li key={i} className="flex items-center text-gray-700">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="font-medium text-lg">{bullet}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </motion.div>
    );
}
