"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const features = [
    {
        id: "01",
        title: "8-Tooth Smile Oral Light",
        description: "Dual control options (manual & touchless sensor) for ultimate hygiene. Philips LED lamp beads provide high-quality natural light with adjustable intensity and color temperature.",
        image: "/images/products/n1/Advanced features and components/01_light.jpg"
    },
    {
        id: "02",
        title: "Dentist Table",
        description: "Spacious 650x300mm side table with an integral handle. Features a swiveling instrument holder and 5-position handpiece holder, including pre-positioned scaler/motor slots.",
        image: "/images/products/n1/Advanced features and components/02_dentist_table.jpg"
    },
    {
        id: "03",
        title: "Spittoon",
        description: "Ceramic spittoon, easy to clean, rotatable up to 180° to maximize assistant space. Includes programmable cup filler, rinsing system, and a constant temperature warm water system.",
        image: "/images/products/n1/Advanced features and components/03_spittoon.jpg"
    },
    {
        id: "04",
        title: "Detachable Suction Filter",
        description: "Innovative suction filter effectively prevents bacterial accumulation in the internal water systems. Designed to be easily and securely extracted for routine cleaning.",
        image: "/images/products/n1/Advanced features and components/04_filter.jpg"
    },
    {
        id: "05",
        title: "Multifunction Foot Control",
        description: "Exclusive Foshan design with non-skid bottom plate. Reliable, low-noise operation with exceptionally long working life. Convenient water rinsing and supply pedals free the dentist's hands.",
        image: "/images/products/n1/Advanced features and components/05_foot_control.jpg"
    },
    {
        id: "06",
        title: "Dentist Stool (RS03)",
        description: "Integral backrest relieves stress on back and elbows for healthier posture. Wide, heavy-duty casting aluminum base ensures stability, equipped with noiseless nylon wheels.",
        image: "/images/products/n1/Advanced features and components/06_stool.jpg"
    },
    {
        id: "07",
        title: "Assistant Table",
        description: "Integrates a complete control panel and wide side table. Includes a 3-way syringe (warm/cold) and is pre-positioned for a curing light, offering flexible movement.",
        image: "/images/products/n1/Advanced features and components/07_assistant_table.jpg"
    },
    {
        id: "08",
        title: "Patient Seat",
        description: "Multi-articulated headrest for exceptional support. Rotatable right armrest for easy entry/exit. Single main switch instantly controls air, water, and electricity.",
        image: "/images/products/n1/Advanced features and components/08_patient_seat.jpg"
    }
];

export default function N1FeatureGrid() {
    return (
        <section id="features" className="py-24 bg-zinc-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-4 block"
                    >
                        Advanced Features
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold text-gray-900 mb-6"
                    >
                        Engineered for Clinical Excellence
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-600"
                    >
                        The N1 is packed with comprehensive components designed to enhance both patient comfort and practitioner efficiency.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-300"
                        >
                            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    fill
                                    className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-3xl font-light text-blue-200">{feature.id}</span>
                                    <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
