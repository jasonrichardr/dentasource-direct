"use client";

import Image from "next/image";
import { m as motion } from "framer-motion";

const features = [
    {
        title: "8-LED Shadowless Operating Light (RoLight)",
        description: "8 Philips LED beads deliver daylight-quality light that shows true tooth color — no more guessing shades under yellow operatory lights. Infrared on/off means zero physical contact between patients.",
        image: "/images/products/a3/Advanced features and components/01_8Tooth_Oral_Light.jpg",
        bullets: [
            "Shadowless Illumination",
            "Customizable Settings",
            "Precision Control",
            "Eye Protection"
        ]
    },
    {
        title: "Intuitive Clinical Interface",
        description: "See everything at a glance — chair position, system status, error codes, timer. Three memory positions let you save your preferred setups for different procedures and recall them instantly.",
        image: "/images/products/a3/Advanced features and components/02_LCD_Screen.jpg",
        bullets: [
            "Intuitive Interface",
            "Real-Time Monitoring",
            "Smart Diagnostics",
            "Built-in Utilities"
        ]
    },
    {
        title: "Active Safety Stop System",
        description: "If the chair touches a leg, hand, or obstacle while moving — it stops immediately and reverses. Protects your patients, your staff, and your investment. Works on both the assistant arm and the main chair.",
        image: "/images/products/a3/Advanced features and components/06_Anti-Collision.jpg",
        bullets: [
            "Smart Protection",
            "Safety First",
            "Seamless Operation"
        ]
    },
    {
        title: "Adjustable Ergonomic Handpiece Block",
        description: "Set your handpiece angle anywhere from 30° to 80° — find the exact position that reduces your wrist strain. Four adjustable holders mean every instrument sits exactly where you need it.",
        image: "/images/products/a3/Advanced features and components/03_Handpiece_Holder.jpg",
        bullets: [
            "Flexible Positioning",
            "Ergonomic Access"
        ]
    },
    {
        title: "Sensory Cup Fill System",
        description: "Place a cup under the filler — it fills automatically via infrared and gravity sensors. No buttons to touch, no cross-contamination risk, no overflow. Standard on the A3 (optional on other models).",
        image: "/images/products/a3/Advanced features and components/05_Dual_IR_Water.jpg",
        bullets: [
            "Touch-Free Hygiene",
            "Efficiency",
            "Seamless Integration"
        ]
    },
    {
        title: "Integrated Thermal Water System",
        description: "Warm water (40°C ±5°C) flows to your handpieces and 3-way syringe — eliminates the cold-water shock that makes patients flinch. Especially important for sensitivity cases and pediatric patients.",
        image: "/images/products/a3/Advanced features and components/04_Water_Heating.jpg",
        bullets: [
            "Maximum Comfort",
            "Consistent Temperature"
        ]
    },
    {
        title: "Ergonomic RS06 Provider Stool",
        description: "The #1 cause of disability in dentistry is back and neck problems. The RS06 stool fights this with 8-way adjustability, a 5° forward tilt that maintains your natural spine curve, and antibacterial foam that won't flatten after years of use.",
        image: "/images/products/a3/Advanced features and components/Dynamic_Comfort_Stool.jpg",
        bullets: [
            "Eight-way Adjustability",
            "5° Forward Tilt",
            "Ultra-breathable Material"
        ]
    },
    {
        title: "One-Key Smart Drainage System",
        description: "Press one button. The chair rises to its highest position and runs a 5-minute automated flushing cycle through the spittoon and all tubing. End-of-day cleaning goes from 10 minutes to 1 button press.",
        image: "/images/products/a3/Advanced features and components/08_Smart_Drainage.jpg",
        bullets: [
            "One-Key Smart Drainage",
            "Efficient Turnover",
            "Hygienic Flushing",
            "Eco-Friendly"
        ]
    }
];

export default function A3FeatureGrid() {
    return (
        <section className="py-16 lg:py-24 bg-zinc-50 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-24">
                    <span className="text-emerald-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
                        Clinical Innovation
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        Advanced Intelligence.
                    </h2>
                    <p className="mt-6 text-base sm:text-lg leading-8 text-gray-600">
                        The Flagship A3 is packed with intelligent hardware and software solutions to streamline your workflow and enhance operational safety.
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
