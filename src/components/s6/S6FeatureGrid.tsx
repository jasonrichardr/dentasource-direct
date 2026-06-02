"use client";

import Image from "next/image";
import { m as motion } from "framer-motion";

const features = [
    {
        title: "Rolight S Dental Light",
        description: "Philips LED array with infrared on/off control — no physical contact between patients. Professional-grade illumination for precision work.",
        image: "/images/products/s6/Advanced features and components/01_light.webp",
        bullets: [
            "Philips LEDs",
            "Infrared Control"
        ]
    },
    {
        title: "380mm Lowest Chair Position",
        description: "The S6 goes 20mm lower than any other ROSON chair. Elderly patients, children, and wheelchair users can transfer safely and comfortably — no other model can do this.",
        image: "/images/products/s6/Advanced features and components/02_compact.jpg",
        bullets: [
            "380mm Floor Height",
            "20mm Below Standard",
            "Wheelchair Accessible"
        ]
    },
    {
        title: "Casting Steel Frame",
        description: "While other chairs use standard steel, the S6 features a casting steel frame and backrest support — zero flex under patient weight, built to last 15+ years.",
        image: "/images/products/s6/Advanced features and components/07_chair_frame.jpg",
        bullets: [
            "Casting Steel",
            "Zero Flex",
            "15+ Year Lifespan"
        ]
    },
    {
        title: "Four-Hand Operation Ready",
        description: "Compact assistant unit designed specifically for four-handed dentistry — everything your assistant needs within arm's reach.",
        image: "/images/products/s6/Advanced features and components/03_four_hand.jpg",
        bullets: [
            "Compact Design",
            "Assistant Optimized"
        ]
    },
    {
        title: "4-Way Hands-Free Foot Control",
        description: "Adjust height and tilt without hands — reduces dentist repetitive strain injuries. Non-skid design with water rinsing and supply buttons.",
        image: "/images/products/s6/Advanced features and components/04_foot_control.jpg",
        bullets: [
            "4-Way Control",
            "Hands-Free",
            "Non-Skid"
        ]
    },
    {
        title: "Stable Multi-Joint Headrest",
        description: "Adjusts to any patient height with rock-solid stability. One-handed positioning for fast patient transitions.",
        image: "/images/products/s6/Advanced features and components/06_headrest.jpg",
        bullets: [
            "Multi-Joint",
            "One-Handed Adjust",
            "Rock-Solid"
        ]
    },
    {
        title: "Compact Workflow Design",
        description: "Streamlined layout minimizes cross-contamination touchpoints while keeping every instrument within natural reach.",
        image: "/images/products/s6/Advanced features and components/05_optimized_space.jpg",
        bullets: [
            "Streamlined",
            "Minimal Touchpoints"
        ]
    },
];

export default function S6FeatureGrid() {
    return (
        <section className="py-16 lg:py-24 bg-zinc-50 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-24">
                    <span className="text-emerald-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
                        Clinical Innovation
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        Professional-Grade Features.
                    </h2>
                    <p className="mt-6 text-base sm:text-lg leading-8 text-gray-600">
                        The S6 is built for accessibility and durability — with a 380mm lowest position, casting steel frame, and Philips LED lighting.
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
