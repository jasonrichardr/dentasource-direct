"use client";

import { motion } from "framer-motion";

export default function N2PlusWarrantyTable() {
    return (
        <section className="py-16 lg:py-24 bg-white relative">
            {/* Decorative background element */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            <div className="mx-auto max-w-4xl px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-blue-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
                        Our Commitment
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Comprehensive Warranties
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600">
                        The Classic Model N2+ is backed by industry-leading warranties to ensure complete peace of mind and reliable performance.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
                >
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-gray-100">
                                <th className="py-4 lg:py-5 px-4 lg:px-8 text-xs lg:text-sm font-semibold text-gray-900 uppercase tracking-wider w-2/3 md:w-1/2">
                                    Component
                                </th>
                                <th className="py-4 lg:py-5 px-4 lg:px-8 text-xs lg:text-sm font-semibold text-gray-900 uppercase tracking-wider w-1/3 md:w-1/2 border-l border-gray-100">
                                    Coverage Period
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { item: "Water & Air Pipelines", duration: "5-year Warranty" },
                                { item: "Premium Upholstery (Microfiber/PU)", duration: "5-year Warranty" },
                                { item: "Chair Lift Motor", duration: "5-year Warranty" },
                                { item: "Premium LED Dental Light", duration: "3-year Warranty" },
                            ].map((row, index) => (
                                <tr key={index} className="hover:bg-zinc-50/50 transition-colors">
                                    <td className="py-4 lg:py-5 px-4 lg:px-8 text-sm lg:text-base font-medium text-gray-900">
                                        {row.item}
                                    </td>
                                    <td className="py-4 lg:py-5 px-4 lg:px-8 text-sm lg:text-base text-gray-600 border-l border-gray-100">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {row.duration}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            </div>
        </section>
    );
}
