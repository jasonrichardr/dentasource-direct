"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const features = [
    {
        title: "Premium LED Oral Light",
        description: "Features double mode control with digital illumination and color temperature adjustments. Includes infrared non-inductive control, premium Philips lamp beads, and a condition breathing lamp.",
        image: "/images/products/n2-plus/Advanced features and components/01_Oral_Light.jpg",
        bullets: [
            "Digital Illumination",
            "Infrared Non-inductive Control",
            "Philips Lamp Beads",
            "Condition Breathing Lamp"
        ]
    },
    {
        title: "Wide-Surface Dentist Table",
        description: "Expansive 650x300mm silicone-padded work surface. Features an integral handle and a swiveling 5-position instrument holder pre-positioned for scaler or electric motor integration.",
        image: "/images/products/n2-plus/Advanced features and components/02_Dentist_Table.jpg",
        bullets: [
            "650x300mm Surface Area",
            "Swiveling Instrument Holder",
            "Cleanable Protective Pad",
            "Integral Positioning Handle"
        ]
    },
    {
        title: "180° Rotatable Ceramic Spittoon",
        description: "Provides expanded workspace for the assistant. The highly durable ceramic bowl rotates 180 degrees for effortless cleaning and features programmable cup filling and bowl rinsing presets.",
        image: "/images/products/n2-plus/Advanced features and components/03_Spittoon.jpg",
        bullets: [
            "180° Rotation Capability",
            "Programmable Rinsing",
            "Warm Water Cup Fill",
            "Integrated Pure Water Supply"
        ]
    },
    {
        title: "Detachable Suction Filter",
        description: "An intelligently redesigned suction filter stops bacterial accumulation via a specialized internal filter net. Designed for rapid removal and effortless daily maintenance.",
        image: "/images/products/n2-plus/Advanced features and components/04_Suction_Filter.jpg",
        bullets: [
            "Prevents Bacterial Accumulation",
            "High-Flow Filter Net",
            "Effortless Maintenance",
            "Detachable Design"
        ]
    },
    {
        title: "Multifunctional Tissue Box",
        description: "A 5-in-1 integrated console with dual-layer storage for supreme organization. Features eco-friendly high-durability materials, impact-resistant edges, and an innovative slide-mouth dispensing design.",
        image: "/images/products/n2-plus/Advanced features and components/05_Tissue_Box.jpg",
        bullets: [
            "Dual-Layer Storage",
            "Eco-Friendly Construction",
            "Impact-Resistant Edging",
            "Innovative Slide-Mouth Dispenser"
        ]
    },
    {
        title: "Independent Disinfectant Water Supply",
        description: "Maintains optimal asepsis through an isolated, dedicated disinfectant water system, ensuring clean and safe operation throughout lengthy clinical procedures.",
        image: "/images/products/n2-plus/Advanced features and components/06_Water_Supply.jpg",
        bullets: [
            "Dedicated Disinfectant Supply",
            "Guaranteed Clean Operation",
            "Simplified Refilling"
        ]
    },
    {
        title: "Assistant Control Center",
        description: "Features a wide side table and flexible articulation for convenient positioning. The comprehensive control panel oversees chair movements, includes a 3-way warm water syringe, and is pre-positioned for a curing light.",
        image: "/images/products/n2-plus/Advanced features and components/07_Assistant_Table.jpg",
        bullets: [
            "Comprehensive Chair Controls",
            "3-Way Warm Water Syringe",
            "Flexible Positional Articulation",
            "Pre-Positioned Curing Light Mount"
        ]
    }
];

export default function N2PlusFeatureGrid() {
    return (
        <section className="bg-zinc-50 py-24 sm:py-32 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-16 lg:mb-20">
                    <h2 className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-widest">
                        Classic Reliability
                    </h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-5xl">
                        Advanced Components.
                    </p>
                    <p className="mt-6 text-base sm:text-lg leading-8 text-gray-600">
                        The N2+ integrates robust, high-performance hardware engineered for durability, maximizing clinical efficiency without compromising patient comfort.
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
            {/* Image Container with Parallax */}
            <div className="w-full lg:w-1/2 relative aspect-[4/3] sm:aspect-video md:aspect-auto md:h-[500px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl bg-[#EBEBEB] border border-gray-100">
                <motion.div className="absolute inset-0 w-full h-[120%]" style={{ y }}>
                    <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-contain p-6 sm:p-10 scale-110"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                </motion.div>
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
            </div>

            {/* Text Content */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0, x: isReversed ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
                        {feature.title}
                    </h3>
                    <p className="text-sm sm:text-lg text-gray-600 mb-6 lg:mb-8 leading-relaxed">
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
