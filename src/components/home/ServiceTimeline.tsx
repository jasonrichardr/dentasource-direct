"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const services = [
    {
        id: "delivery",
        title: "White Glove Delivery",
        desc: "Equipment transported with care, unpacked and placed exactly where you need it. Zero stress."
    },
    {
        id: "installation",
        title: "Professional Installation",
        desc: "Proper positioning, connections, and calibration by experienced technicians — ready to operate on day one."
    },
    {
        id: "training",
        title: "Training & Orientation",
        desc: "Staff walkthrough on safe operation, maintenance basics, and workflow optimization for your specific setup."
    },
    {
        id: "after-sales",
        title: "After-Sales Service",
        desc: "Rehousing, repairs, parts sourcing, and ongoing technical support whenever you need it."
    },
    {
        id: "ocular",
        title: "Free Ocular Visitation",
        desc: "We visit your space before purchase to assess layout, utilities, and recommend the best configuration."
    },
    {
        id: "cleanup",
        title: "Post-Install Cleanup",
        desc: "We clean up after ourselves. Your operatory is left spotless and ready for patients."
    }
];

export default function ServiceTimeline() {
    const [activeId, setActiveId] = useState(services[0].id);

    return (
        <section className="bg-zinc-50 py-32 px-6">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">

                {/* Left Side: Sticky Headers */}
                <div className="lg:w-1/2">
                    <div className="sticky top-32">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-sm uppercase tracking-[0.2em] text-zinc-500 mb-6"
                        >
                            The White Glove Standard
                        </motion.h2>
                        <motion.h3
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl md:text-5xl font-light leading-tight text-zinc-900 mb-10"
                        >
                            From Delivery to Daily Operations — <span className="font-medium">We&apos;ve Got You.</span>
                        </motion.h3>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="hidden lg:block space-y-8 mt-16"
                        >
                            <h4 className="text-xl font-medium text-zinc-900">Start Without Financial Stress</h4>
                            <p className="text-zinc-600 font-light leading-relaxed max-w-md">
                                Zero down payment options, flexible installment plans, and a trade-in program — because cost shouldn&apos;t be a barrier to building a great practice.
                            </p>
                            <a href="/contact" className="inline-block mt-4 text-sm font-medium tracking-wide uppercase border-b border-black pb-1 hover:text-black/60 transition-colors">
                                Explore Trade-in Options
                            </a>
                        </motion.div>
                    </div>
                </div>

                {/* Right Side: Interactive Service List */}
                <div className="lg:w-1/2">
                    <div className="border-l border-zinc-200 pl-8 md:pl-16 space-y-16 py-8">
                        {services.map((service, idx) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ margin: "-10%" }}
                                onViewportEnter={() => setActiveId(service.id)}
                                transition={{ duration: 0.5 }}
                                className="relative cursor-pointer group"
                                onClick={() => setActiveId(service.id)}
                            >
                                {/* Timeline Dot Indicator */}
                                <div
                                    className={`absolute -left-[35px] md:-left-[67px] w-2 h-2 rounded-full transition-all duration-500 mt-2.5 ${activeId === service.id ? 'bg-black scale-150' : 'bg-zinc-300 group-hover:bg-zinc-400'
                                        }`}
                                />

                                <h4 className={`text-2xl font-light transition-colors duration-300 ${activeId === service.id ? 'text-black' : 'text-zinc-400'}`}>
                                    {service.title}
                                </h4>

                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: activeId === service.id ? "auto" : 0,
                                        opacity: activeId === service.id ? 1 : 0,
                                        marginTop: activeId === service.id ? "1rem" : 0
                                    }}
                                    className="overflow-hidden"
                                >
                                    <p className="text-zinc-500 font-light leading-relaxed text-lg pb-4">
                                        {service.desc}
                                    </p>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Mobile Only Callout */}
                    <div className="mt-16 block lg:hidden border-t border-zinc-200 pt-12">
                        <h4 className="text-xl font-medium text-zinc-900 mb-4">Start Without Financial Stress</h4>
                        <p className="text-zinc-600 font-light leading-relaxed mb-6">
                            Zero down payment options, flexible installment plans, and a trade-in program.
                        </p>
                        <a href="/contact" className="inline-block text-sm font-medium tracking-wide uppercase border-b border-black pb-1">
                            Explore Options
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}
