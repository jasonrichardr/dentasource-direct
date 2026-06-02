"use client";

import Image from "next/image";
import { m as motion } from "framer-motion";

const features = [
    {
        title: "8-Tooth Smile Oral Light",
        description: "Philips LED array with double lighting mode and infrared on/off. Wave your hand to switch modes — zero physical contact between patients.",
        image: "/images/products/n2-plus/Advanced features and components/01_Oral_Light.jpg",
        bullets: ["Philips LEDs", "Double Mode", "Infrared On/Off"],
    },
    {
        title: "Wide Dentist Table (650\u00d7300mm)",
        description: "Five handpiece holder positions keep every instrument organized and within reach. The widest standard table in the classic N-series.",
        image: "/images/products/n2-plus/Advanced features and components/02_Dentist_Table.jpg",
        bullets: ["650\u00d7300mm", "5-Position Holder"],
    },
    {
        title: "180\u00b0 Rotatable Ceramic Spittoon",
        description: "Ceramic is more hygienic and durable than plastic. Rotates 180\u00b0 for easy patient access. Programmable cup filler and spittoon rinsing.",
        image: "/images/products/n2-plus/Advanced features and components/03_Spittoon.jpg",
        bullets: ["Ceramic Bowl", "180\u00b0 Rotation", "Programmable"],
    },
    {
        title: "5-in-1 Multifunctional Tissue Box",
        description: "Built-in dual-layer storage for enhanced organization. Exclusive to N2+ in the N-series standard config — other models don\u2019t include this.",
        image: "/images/products/n2-plus/Advanced features and components/05_Tissue_Box.jpg",
        bullets: ["Dual-Layer", "N2+ Exclusive", "Built-In"],
    },
    {
        title: "Dual Pure Water Bottles + Warm Water",
        description: "Two 1L pure water bottles mean fewer mid-session interruptions. Constant temperature warm water (40\u00b0C \u00b15\u00b0C) for patient comfort.",
        image: "/images/products/n2-plus/Advanced features and components/06_Water_Supply.jpg",
        bullets: ["2\u00d7 1L Bottles", "Warm Water", "40\u00b0C \u00b15\u00b0C"],
    },
    {
        title: "Built-in LED X-Ray Viewer",
        description: "Instant diagnostic reference right on the dentist element. LED backlit for clear visibility — no separate viewer needed.",
        image: "/images/products/n2-plus/Advanced features and components/04_Suction_Filter.jpg",
        bullets: ["LED Backlit", "Built-In", "Instant Reference"],
    },
    {
        title: "Complete Assistant Module",
        description: "Control panel, 3-way warm water syringe, and curing light pre-position. Everything for true four-hand dentistry.",
        image: "/images/products/n2-plus/Advanced features and components/07_Assistant_Table.jpg",
        bullets: ["Control Panel", "Warm Syringe", "Curing Light Position"],
    },
];

export default function N2PlusFeatureGrid() {
    return (
        <section className="py-16 lg:py-24 bg-zinc-50 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-24">
                    <span className="text-emerald-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
                        Clinical Innovation
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        Advanced Components.
                    </h2>
                    <p className="mt-6 text-base sm:text-lg leading-8 text-gray-600">
                        The N2+ integrates robust, high-performance hardware engineered for durability, maximizing clinical efficiency without compromising patient comfort.
                    </p>
                </div>

                <div className="space-y-24 lg:space-y-32">
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

type Feature = {
    title: string;
    description: string;
    image: string;
    bullets: string[];
};

function FeatureRow({ feature, isReversed }: { feature: Feature; isReversed: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 lg:gap-16 items-center`}
        >
            {/* Static image — no border, no background, no parallax */}
            <div className="w-full lg:w-1/2 relative aspect-[4/3] md:aspect-auto md:h-[500px]">
                <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                />
            </div>

            {/* Text Content */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0, x: isReversed ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                        {feature.title}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
                        {feature.description}
                    </p>

                    <ul className="space-y-4">
                        {feature.bullets.map((bullet, i) => (
                            <li key={i} className="flex items-center text-gray-700">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mr-4">
                                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
