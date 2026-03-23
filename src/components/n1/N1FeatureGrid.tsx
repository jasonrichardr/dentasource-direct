"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const features = [
    {
        title: "8-Tooth Smile Oral Light",
        description: "Same Philips LED light as the N2+ — double mode, infrared on/off. No compromise on visibility just because it\u2019s the entry model.",
        image: "/images/products/n1/Advanced features and components/01_light.jpg",
        bullets: ["Philips LEDs", "Double Mode", "Infrared On/Off"],
    },
    {
        title: "Rotatable Right Arm",
        description: "The armrest swings completely out of the way — elderly patients, children, and patients with limited mobility can sit down and stand up without obstruction.",
        image: "/images/products/n1/Advanced features and components/02_dentist_table.jpg",
        bullets: ["Swings Out", "Easy Entry", "Easy Exit"],
    },
    {
        title: "180\u00b0 Rotatable Ceramic Spittoon",
        description: "Same ceramic cuspidor as the entire N-series. More hygienic, more durable, more professional than plastic.",
        image: "/images/products/n1/Advanced features and components/03_spittoon.jpg",
        bullets: ["Ceramic", "180\u00b0 Rotation", "Programmable Flushing"],
    },
    {
        title: "One Starter System",
        description: "A single connection point for air, water, and electricity. Installation is faster, troubleshooting is simpler, and your technician will thank you.",
        image: "/images/products/n1/Advanced features and components/05_foot_control.jpg",
        bullets: ["Single Switch", "Fast Install", "Simple Troubleshooting"],
    },
    {
        title: "Constant Temperature Warm Water",
        description: "Warm water (40\u00b0C \u00b15\u00b0C) flows to your handpieces and syringe — eliminates cold-water shock for patients.",
        image: "/images/products/n1/Advanced features and components/04_filter.jpg",
        bullets: ["40\u00b0C \u00b15\u00b0C", "Handpieces & Syringe", "Patient Comfort"],
    },
    {
        title: "RS03 Ergonomic Dentist Stool",
        description: "Wide cast aluminum base, integrated armrest and backrest, noiseless nylon wheels. Proper support included as standard.",
        image: "/images/products/n1/Advanced features and components/06_stool.jpg",
        bullets: ["Cast Aluminum", "Armrest & Backrest", "Noiseless Wheels"],
    },
    {
        title: "Multifunction Foot Control",
        description: "Non-skid design with water rinsing and supply buttons. Hands stay free for clinical work.",
        image: "/images/products/n1/Advanced features and components/07_assistant_table.jpg",
        bullets: ["Non-Skid", "Water Rinsing", "Hands-Free"],
    },
];

export default function N1FeatureGrid() {
    return (
        <section className="py-16 lg:py-24 bg-zinc-50 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-24">
                    <span className="text-blue-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
                        Clinical Innovation
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        Engineered for Clinical Excellence.
                    </h2>
                    <p className="mt-6 text-base sm:text-lg leading-8 text-gray-600">
                        The N1 is packed with comprehensive components designed to enhance both patient comfort and practitioner efficiency.
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
