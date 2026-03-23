"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const features = [
    {
        title: "8-Tooth Smile Oral Light",
        description: "Philips LED array with natural daylight-quality illumination. Infrared on/off means zero physical contact between patients. Dynamic atmosphere lighting creates a calming environment.",
        image: "/images/products/dxa3l/022_ROSON_dental_light_fixture_with_LED_illumination__.jpg",
        bullets: [
            "Philips LEDs",
            "Infrared On/Off",
            "Dynamic Atmosphere Light"
        ]
    },
    {
        title: "Medical-Grade Color LCD",
        description: "See everything at a glance — chair position, system status, error codes, timer. Smart power-on self-test catches issues before your first patient. Fault code display for quick troubleshooting.",
        image: "/images/products/dxa3l/013_Roson_Fashion_Model_A3L_Dental_Chair_with_brown_se.jpg",
        bullets: [
            "Self-Test Diagnostics",
            "Fault Code Display",
            "Real-Time Status"
        ]
    },
    {
        title: "Anti-Collision Safety System",
        description: "Smart sensors in the assistant arm instantly halt movement if an obstruction is detected — protecting your staff, your patients, and your investment.",
        image: "/images/products/dxa3l/012_Roson_Fashion_Model_A3L_Dental_Chair__ergonomic_br.jpg",
        bullets: [
            "Auto-Pause",
            "Auto-Reverse",
            "Always Active"
        ]
    },
    {
        title: "4-Angle Adjustable Handpiece Holder",
        description: "Set your handpiece angle anywhere from 30° to 80°. Four adjustable holders mean every instrument sits exactly where you need it.",
        image: "/images/products/dxa3l/010_Roson_Fashion_Model_A3L_dental_chair__ergonomic_de.jpg",
        bullets: [
            "30°-80° Range",
            "4 Positions"
        ]
    },
    {
        title: "Soft Start/Stop Whisper-Silent Motor",
        description: "Buttery-smooth, near-silent chair movement. Patients describe it as sitting on a cloud — no jarring, no jerking.",
        image: "/images/products/dxa3l/014_Roson_Fashion_Model_A3L_dental_chair__brown_seat__.jpg",
        bullets: [
            "Smooth Movement",
            "Silent Operation",
            "Patient Comfort"
        ]
    },
    {
        title: "Ergonomic RS06 Dentist Stool",
        description: "8-way adjustability, 5° forward tilt, antibacterial foam that won't flatten. The #1 cause of disability in dentistry is back problems — the RS06 fights that.",
        image: "/images/products/dxa3l/detail.jpg",
        bullets: [
            "8-Way Adjustable",
            "5° Forward Tilt",
            "Antibacterial Foam"
        ]
    }
];

export default function A3LFeatureGrid() {
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
                        The Fashion A3L is packed with intelligent hardware and software solutions to streamline your workflow and enhance operational safety.
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
            viewport={{ once: true, margin: "-80px" }}
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
