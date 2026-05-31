"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const features = [
    {
        title: "\u226535,000 Lux LED Sensor Light",
        description: "The brightest operating light in the entire ROSON lineup. Touchless sensor on/off \u2014 no physical contact needed. Stepless intensity control for precision.",
        image: "/images/products/s3/Advanced features and components/01_light.webp",
        bullets: [
            "\u226535,000 Lux",
            "Touchless Sensor",
            "Stepless Control"
        ]
    },
    {
        title: "Autoclavable Light Handle",
        description: "The light handle can be removed and sterilized at 134\u00b0C in an autoclave \u2014 a real infection control advantage most chairs don\u2019t offer.",
        image: "/images/products/s3/Advanced features and components/02_compact.jpg",
        bullets: [
            "134\u00b0C Autoclave",
            "Removable Handle",
            "Infection Control"
        ]
    },
    {
        title: "Detachable Swiveling Spittoon",
        description: "The spittoon bowl detaches without tools for thorough cleaning. Swivels for easy patient access. Designed for clinics that see 20+ patients daily.",
        image: "/images/products/s3/Advanced features and components/03_spittoon.jpg",
        bullets: [
            "Detachable",
            "Swiveling",
            "Tool-Free"
        ]
    },
    {
        title: "Detachable Anti-Bacteria Suction Filter",
        description: "Innovative filter net prevents bacterial accumulation. Easily removed for routine sterilization \u2014 no tools needed.",
        image: "/images/products/s3/Advanced features and components/04_filter.jpg",
        bullets: [
            "Anti-Bacteria",
            "Easy Removal",
            "Quick Sterilize"
        ]
    },
    {
        title: "4-Way Hands-Free Foot Control",
        description: "Adjust height and tilt without hands. Non-skid design keeps it stable during procedures.",
        image: "/images/products/s3/Advanced features and components/05_foot_control.jpg",
        bullets: [
            "4-Way Control",
            "Hands-Free",
            "Non-Skid"
        ]
    },
    {
        title: "Wide Elbow Support Cushion",
        description: "Generous elbow cushion reduces upper body fatigue during long procedures. Your arms stay relaxed \u2014 even after a full day.",
        image: "/images/products/s3/Advanced features and components/06_cushion.jpg",
        bullets: [
            "Wide Cushion",
            "Fatigue Reduction"
        ]
    },
    {
        title: "6-Way Adjustable Dentist Stool",
        description: "Robust 6-way adjustment fits back and hips perfectly, relaxing thigh muscles to prevent fatigue. Included as standard.",
        image: "/images/products/s3/Advanced features and components/07_stool.jpg",
        bullets: [
            "6-Way Adjust",
            "Ergonomic Fit",
            "Included Free"
        ]
    },
    {
        title: "Multi-Articulated Headrest",
        description: "One-handed positioning with unparalleled stability. Safe for children and patients with limited mobility.",
        image: "/images/products/s3/Advanced features and components/08_headrest.jpg",
        bullets: [
            "One-Handed",
            "Stable",
            "Safe for Children"
        ]
    },
];

export default function S3FeatureGrid() {
    return (
        <section className="py-16 lg:py-24 bg-zinc-50 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-24">
                    <span className="text-blue-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
                        Clinical Innovation
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        Best-Selling Features.
                    </h2>
                    <p className="mt-6 text-base sm:text-lg leading-8 text-gray-600">
                        The S3 delivers the brightest light in the ROSON lineup, autoclavable infection control, and rock-solid reliability for high-volume clinics.
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

function FeatureRow({ feature, isReversed }: { feature: Feature, isReversed: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-16 items-center`}
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
