"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Cog, ArrowRight } from "lucide-react";

const WARRANTY_DATA = [
    {
        category: "Structural Components",
        coverage: "5 Years",
        details: "Covers the chair frame, base cast iron components, and major mechanical structures against manufacturing defects."
    },
    {
        category: "Motors and Actuators",
        coverage: "2 Years",
        details: "Covers the lifting motors, backrest actuators, and associated drive mechanisms."
    },
    {
        category: "Circuit Boards & Electronics",
        coverage: "1 Year",
        details: "Covers the main PCB, control panels, foot pedal electronics, and sensor mechanisms."
    },
    {
        category: "Upholstery",
        coverage: "1 Year",
        details: "Covers abnormal degradation or tearing of PU and Microfiber leather under normal clinical use."
    },
    {
        category: "Tubing and Valves",
        coverage: "6 Months",
        details: "Covers internal water and air tubing, solenoid valves, and pneumatic switches."
    }
];

export default function N1WarrantyTable() {
    return (
        <section className="py-24 bg-white border-t border-zinc-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

                    {/* Left Column - Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-4 sticky top-32"
                    >
                        <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-blue-50 rounded-2xl mb-6">
                            <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                            Reliable Warranty Coverage
                        </h2>
                        <p className="text-base sm:text-lg text-slate-600 mb-8 font-medium leading-relaxed">
                            The Roson Classic Model N1 is built for long-term clinical durability, backed by our comprehensive warranty and dedicated support network.
                        </p>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                <Cog className="w-5 h-5 text-blue-500" />
                                Post-Sale Support
                            </h4>
                            <p className="text-sm text-slate-600">
                                Need assistance or a replacement part? We stock necessary components and can ship out technical replacements swiftly to minimize your clinic's downtime.
                            </p>
                        </div>
                    </motion.div>

                    {/* Right Column - Table/List */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-8"
                    >
                        <div className="bg-white border text-sm sm:text-base border-slate-200 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            {/* Table Header */}
                            <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 p-4 sm:p-6 lg:p-8">
                                <div className="col-span-2 font-bold text-slate-800 uppercase tracking-wider text-xs sm:text-sm">Coverage Area</div>
                                <div className="col-span-1 font-bold text-slate-800 uppercase tracking-wider text-xs sm:text-sm text-right">Duration</div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-slate-100">
                                {WARRANTY_DATA.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="grid grid-cols-3 p-4 sm:p-6 lg:p-8 hover:bg-blue-50/50 transition-colors group"
                                    >
                                        <div className="col-span-2 pr-4 sm:pr-8">
                                            <h3 className="font-bold text-slate-900 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors">
                                                {item.category}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                                                {item.details}
                                            </p>
                                        </div>
                                        <div className="col-span-1 flex items-start justify-end">
                                            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg bg-blue-100/50 text-blue-700 font-bold text-xs sm:text-sm border border-blue-200/50">
                                                {item.coverage}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Table Footer Action */}
                            <div className="bg-slate-50 p-4 sm:p-6 border-t border-slate-200 flex justify-center sm:justify-end">
                                <button className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm sm:text-base">
                                    Download Full Warranty PDF
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
