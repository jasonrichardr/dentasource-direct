"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const features = [
    {
        title: "8-Rolight S Dental Light",
        description: "Double mode control with digital illumination and color temperature adjustments via an infrared non-inductive sensor. Features Philips lamp beads for longevity.",
        image: "/images/products/a3s/Advanced features and components/7-2.jpg",
        bullets: [
            "Digital Color Temp",
            "Infrared Sensor",
            "Philips Lamp Beads",
            "Condition Breathing Lamp"
        ]
    },
    {
        title: "Adjustable Handpiece Holder",
        description: "Every habit should be valued. The angle of the bracket adjusts securely from 30° to 80° for flexible, effortless instrument retrieval and placement.",
        image: "/images/products/a3s/Advanced features and components/10-1.jpg",
        bullets: [
            "30°–80° Range",
            "Flexible & Adjustable",
            "Effortless Handling"
        ]
    },
    {
        title: "Soft Start/Stop System",
        description: "Embedded soft start and soft stop control algorithm guarantees smooth transitions without sudden jolts, providing a true 'cloud experience'.",
        image: "/images/products/a3s/Advanced features and components/4-7.jpg",
        bullets: [
            "Smooth Transitions",
            "No Sudden Jolts",
            "Maximized Comfort"
        ]
    },
    {
        title: "Seamless Microfiber Leather",
        description: "Luxurious, skin-friendly, wear and scratch resistant. Soft and highly breathable to ensure maximum patient coziness during prolonged treatments.",
        image: "/images/products/a3s/Advanced features and components/6-7.jpg",
        bullets: [
            "Skin-friendly",
            "Scratch Resistant",
            "Fatigue-free Comfort"
        ]
    }
];

export default function A3SFeatureGrid() {
    return (
        <section className="py-16 lg:py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16 lg:mb-24">
                    <span className="text-blue-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
                        Technological Edge
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        Engineered for Precision
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        The A3S incorporates advanced features to ensure superior dental care and maximize both patient comfort and practitioner efficiency.
                    </p>
                </div>

                <div className="space-y-24 lg:space-y-32">
                    {features.map((feature, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <FeatureRow key={index} feature={feature} isEven={isEven} />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function FeatureRow({ feature, isEven }: { feature: any, isEven: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
    const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const xText = useTransform(scrollYProgress, [0, 1], [isEven ? 50 : -50, 0]);

    return (
        <div ref={ref} className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
            {/* Image Side */}
            <motion.div
                style={{ scale, opacity }}
                className="w-full lg:w-1/2"
            >
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-100 p-8 shadow-2xl shadow-gray-200/50">
                    <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-contain p-8 mix-blend-darken"
                    />
                </div>
            </motion.div>

            {/* Text Side */}
            <motion.div
                style={{ x: xText, opacity }}
                className="w-full lg:w-1/2"
            >
                <h3 className="text-3xl font-bold text-gray-900 mb-6">{feature.title}</h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {feature.description}
                </p>

                <ul className="space-y-4">
                    {feature.bullets.map((bullet: string, i: number) => (
                        <li key={i} className="flex items-center text-gray-700">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="font-medium">{bullet}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>
        </div>
    );
}
