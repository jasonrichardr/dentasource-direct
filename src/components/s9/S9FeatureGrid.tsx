"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const features = [
    {
        title: "45\u00b0 Ergonomic Operation Panel",
        description: "The angled console puts every control at the natural position of your hand \u2014 no reaching, no twisting. Three memory positions (P1, P2, P3) let you save your preferred setups for different procedures.",
        image: "/images/products/s9/Advanced features and components/13.jpg",
        bullets: [
            "45\u00b0 Angled Console",
            "3 Memory Positions",
            "Natural Hand Position"
        ]
    },
    {
        title: "8-Tooth Smile Oral Light",
        description: "Philips LED array delivers broad, pristine visibility across the entire oral cavity. Reduces eye strain during long procedures with daylight-quality illumination.",
        image: "/images/products/s9/Advanced features and components/14.jpg",
        bullets: [
            "Philips LEDs",
            "Daylight Quality",
            "Broad Coverage"
        ]
    },
    {
        title: "Anti-Collision Backrest",
        description: "If the backrest encounters any obstacle while moving \u2014 it stops immediately. Protects your staff, your patients, and your investment. The S9\u2019s safety system is always active.",
        image: "/images/products/s9/Advanced features and components/17.jpg",
        bullets: [
            "Auto-Stop",
            "Patient Safety",
            "Always Active"
        ]
    },
    {
        title: "One-Key Smart Drainage",
        description: "Press one button. The chair rises to its highest position and runs a 5-minute automated flushing cycle. End-of-day cleaning goes from 10 minutes to 1 button press.",
        image: "/images/products/s9/Advanced features and components/18.jpg",
        bullets: [
            "One Button",
            "5-Min Auto-Flush",
            "End-of-Day Simple"
        ]
    },
    {
        title: "5-in-1 Multifunctional Tissue Box",
        description: "Built-in dual-layer storage keeps your operatory organized and professional. Eco-friendly materials, impact-resistant design, innovative slide-mouth installation.",
        image: "/images/products/s9/Advanced features and components/3-5.jpg",
        bullets: [
            "Dual-Layer Storage",
            "Built-In",
            "Impact Resistant"
        ]
    },
    {
        title: "Breathable Seamless Microfiber Leather",
        description: "Premium upholstery that\u2019s easy to sanitize, ultra-breathable, and comes with a 5-year warranty. Seamless construction means zero crevices for bacteria.",
        image: "/images/products/s9/Advanced features and components/4-5.jpg",
        bullets: [
            "5-Year Warranty",
            "Seamless Construction",
            "Ultra-Breathable"
        ]
    },
    {
        title: "Compact Four-Hand Assistant Module",
        description: "Space-saving assistant unit optimized for four-handed dentistry. Suction, syringe, and controls within arm\u2019s reach \u2014 everything your assistant needs.",
        image: "/images/products/s9/Advanced features and components/6-8.jpg",
        bullets: [
            "Four-Hand Ready",
            "Space-Saving",
            "Complete Controls"
        ]
    }
];

export default function S9FeatureGrid() {
    return (
        <section className="py-16 lg:py-24 bg-zinc-50 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-24">
                    <span className="text-emerald-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
                        Clinical Innovation
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        Premium Features.
                    </h2>
                    <p className="mt-6 text-base sm:text-lg leading-8 text-gray-600">
                        The S9 delivers advanced clinical features at an exceptional value \u2014 streamlining your workflow and elevating patient care.
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
