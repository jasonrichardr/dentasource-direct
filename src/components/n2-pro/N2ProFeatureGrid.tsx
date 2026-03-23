"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Feature = {
    title: string;
    description: string;
    image: string;
    bullets: string[];
};

const features: Feature[] = [
    {
        title: "Rolight S Dental Light",
        description: "Philips LED array with infrared on/off control — no physical contact between patients. Double lighting mode lets you switch between examination and treatment illumination.",
        image: "/images/products/n2-pro/Advanced features and components/Rolight_S_Dental_Light.webp",
        bullets: ["Philips LEDs", "Infrared Control", "Double Mode"],
    },
    {
        title: "Widest Dentist Table in the N-Series",
        description: "At 650\u00d7315mm, the N2 PRO gives you 5% more surface area than the N2+ — enough to keep every instrument organized and within reach. Five handpiece holder positions with dedicated scaler and micromotor pre-positions.",
        image: "/images/products/n2-pro/Advanced features and components/Dentist_Table.jpg",
        bullets: ["650\u00d7315mm Surface", "5-Position Holder", "Scaler Pre-Position"],
    },
    {
        title: "180\u00b0 Rotatable Ceramic Spittoon",
        description: "Ceramic is more hygienic, more durable, and more professional-looking than standard plastic bowls. Rotates 180\u00b0 for easy patient access. Programmable cup filler and spittoon rinsing included.",
        image: "/images/products/n2-pro/Advanced features and components/Rotatable_Spittoon.jpg",
        bullets: ["Ceramic Bowl", "180\u00b0 Rotation", "Programmable Flushing"],
    },
    {
        title: "Independent Disinfectant Water Supply",
        description: "Separate disinfectant water supply keeps your waterlines clean without mixing chemicals into the patient water circuit. Plus constant temperature warm water (40\u00b0C \u00b15\u00b0C) for patient comfort.",
        image: "/images/products/n2-pro/Advanced features and components/Water_Supply_System.jpg",
        bullets: ["Independent Disinfection", "Warm Water", "Pure Water Supply"],
    },
    {
        title: "Detachable Suction Filter",
        description: "Quick-clean anti-bacteria suction filter detaches without tools. Clean between patients in seconds — designed for clinics that see 20+ patients daily.",
        image: "/images/products/n2-pro/Advanced features and components/Detachable_Suction_Filter.jpg",
        bullets: ["Tool-Free Removal", "Anti-Bacteria", "Quick Clean"],
    },
    {
        title: "Compact Assistant Module",
        description: "Complete assistant table with control panel, 3-way warm water syringe, and curing light pre-position. Everything your assistant needs within arm\u2019s reach for true four-hand dentistry.",
        image: "/images/products/n2-pro/Advanced features and components/Assistant_Table.jpg",
        bullets: ["Control Panel", "Warm Water Syringe", "Curing Light Position"],
    },
];

export default function N2ProFeatureGrid() {
    return (
        <section className="py-16 lg:py-24 bg-zinc-50 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-24">
                    <span className="text-blue-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
                        Clinical Innovation
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        Advanced Features & Components
                    </h2>
                    <p className="mt-6 text-base sm:text-lg leading-8 text-gray-600">
                        The N2 PRO is built with advanced features that streamline your workflow, enhance infection control, and maximize patient comfort.
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

function FeatureRow({ feature, isReversed }: { feature: Feature; isReversed: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
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
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
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
