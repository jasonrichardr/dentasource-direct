"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const features = [
    {
        title: "Rolight S with Breathing Lamp",
        description: "The A3S-exclusive Rolight S features Philips LEDs, infrared control, and a condition breathing lamp \u2014 an ambient light that signals chair status while calming anxious patients. Double mode for examination and treatment.",
        image: "/images/products/a3s/Advanced features and components/10-1.jpg",
        bullets: [
            "Breathing Lamp",
            "Infrared Control",
            "Double Mode"
        ]
    },
    {
        title: "Seamless Microfiber Leather \u2014 Standard",
        description: "Unlike other models where seamless leather is an upgrade, the A3S includes it as standard. Zero seam crevices means easier disinfection and superior infection control \u2014 no extra cost.",
        image: "/images/products/a3s/Advanced features and components/17-1.jpg",
        bullets: [
            "Standard Not Upgrade",
            "Zero Seam Crevices",
            "5-Year Durability"
        ]
    },
    {
        title: "Medical-Grade Color LCD",
        description: "See everything at a glance \u2014 chair position, system status, error codes, timer. Smart power-on self-test catches issues before your first patient. Fault code display tells you exactly what to fix.",
        image: "/images/products/a3s/Advanced features and components/4-7.jpg",
        bullets: [
            "Self-Test Diagnostics",
            "Fault Code Display",
            "Timer & Clock"
        ]
    },
    {
        title: "Soft Start/Stop Motor System",
        description: "No jarring movements. The embedded motor control rises and falls smoothly \u2014 patients describe it as sitting on a cloud. Reduces anxiety for nervous patients.",
        image: "/images/products/a3s/Advanced features and components/6-7.jpg",
        bullets: [
            "Smooth Movement",
            "Patient Comfort",
            "Silent Operation"
        ]
    },
    {
        title: "4-Angle Adjustable Handpiece Holder",
        description: "Set your handpiece angle anywhere from 30\u00b0 to 80\u00b0 \u2014 find the exact position that reduces your wrist strain. Four adjustable holders mean every instrument sits exactly where you need it.",
        image: "/images/products/a3s/Advanced features and components/7-2.jpg",
        bullets: [
            "30\u00b0-80\u00b0 Range",
            "4 Positions"
        ]
    },
    {
        title: "Ergonomic RS06 Dentist Stool",
        description: "The #1 cause of disability in dentistry is back and neck problems. The RS06 fights this with 8-way adjustability, a 5\u00b0 forward tilt, and antibacterial foam that won\u2019t flatten after years of use.",
        image: "/images/products/a3s/Advanced features and components/az-img.jpg",
        bullets: [
            "8-Way Adjustable",
            "5\u00b0 Forward Tilt",
            "Antibacterial Foam"
        ]
    }
];

export default function A3SFeatureGrid() {
    return (
        <section className="py-16 lg:py-24 bg-zinc-50 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-24">
                    <span className="text-blue-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
                        Clinical Innovation
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        Smart Intelligence.
                    </h2>
                    <p className="mt-6 text-base sm:text-lg leading-8 text-gray-600">
                        The Smart A3S is packed with intelligent hardware and software solutions to streamline your workflow and enhance operational safety.
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
            whileInView={{ opacity: 1, y: 0 }}
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
                    whileInView={{ opacity: 1, x: 0 }}
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
