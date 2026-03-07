"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const features = [
    {
        title: "8-LED Shadowless Operating Light (RoLight)",
        description: "Features 8 Philips LED modules calibrated for daylight-equivalent illumination (>90 CRI). Adjustable color temperature prevents premature composite curing, while shadowless optics reduce clinical eye strain.",
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
        description: "High-contrast LCD control center providing real-time system status. Built-in diagnostic firmware runs an automated initialization check and displays exact error codes to minimize downtime.",
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
        description: "Integrated sensors detect resistance during unit descent, automatically halting and slightly reversing movement to protect equipment and prevent crushing injuries.",
        image: "/images/products/a3/Advanced features and components/06_Anti-Collision.jpg",
        bullets: [
            "Smart Protection",
            "Safety First",
            "Seamless Operation"
        ]
    },
    {
        title: "Adjustable Ergonomic Handpiece Block",
        description: "The delivery arm block adjusts from 30° to 80°, allowing customized instrument angle presentation to reduce wrist fatigue and support healthy ergonomic posturing.",
        image: "/images/products/a3/Advanced features and components/03_Handpiece_Holder.jpg",
        bullets: [
            "Flexible Positioning",
            "Ergonomic Access"
        ]
    },
    {
        title: "Sensory Cup Fill System",
        description: "Infrared and gravity dual-sensors provide touchless, precise cup filling. Eliminates cross-contamination while preventing overflow and water waste.",
        image: "/images/products/a3/Advanced features and components/05_Dual_IR_Water.jpg",
        bullets: [
            "Touch-Free Hygiene",
            "Efficiency",
            "Seamless Integration"
        ]
    },
    {
        title: "Integrated Thermal Water System",
        description: "Maintains consistent, gentle water temperature for syringes and handpieces to minimize dentinal hypersensitivity during treatments and cleanings.",
        image: "/images/products/a3/Advanced features and components/04_Water_Heating.jpg",
        bullets: [
            "Maximum Comfort",
            "Consistent Temperature"
        ]
    },
    {
        title: "Ergonomic RS06 Provider Stool",
        description: "Engineered to prevent musculoskeletal disorders. Features 8-way adjustability and a 5° forward-tilt mechanism that maintains neutral lumbar lordosis during lengthy procedures.",
        image: "/images/products/a3/Advanced features and components/Dynamic_Comfort_Stool.jpg",
        bullets: [
            "Eight-way Adjustability",
            "5° Forward Tilt",
            "Ultra-breathable Material"
        ]
    },
    {
        title: "One-Key Smart Drainage System",
        description: "Single-button activation automatically raises the chair and triggers a comprehensive 5-minute spittoon and tubing flushing cycle, streamlining post-operative room turnover.",
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
                    <span className="text-blue-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
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
            className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-16 items-center`}
        >
            {/* Image Container with Parallax */}
            <div className="w-full lg:w-1/2 relative aspect-[4/3] sm:aspect-video md:aspect-auto md:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-[#EBEBEB] border border-gray-100">
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
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                        {feature.title}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
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
