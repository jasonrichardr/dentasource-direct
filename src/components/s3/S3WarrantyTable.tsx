"use client";

import { motion } from "framer-motion";
import { Shield, Clock, Wrench, CheckCircle2 } from "lucide-react";

export default function S3WarrantyTable() {
    return (
        <section className="py-20 lg:py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-6"
                    >
                        <Shield className="w-4 h-4" />
                        DentaSource Direct Protection
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                    >
                        5-Year Comprehensive Warranty
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-gray-500"
                    >
                        We stand behind the engineering of the Roson S3. Every purchase includes our industry-leading 5-year warranty, ensuring total peace of mind for your practice.
                    </motion.p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                    {/* Benefits Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/3 space-y-8"
                    >
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">5 Full Years</h3>
                                <p className="text-gray-500">Extensive coverage across all core chair components, extending far beyond industry standards.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                                <Wrench className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Local Support</h3>
                                <p className="text-gray-500">Factory-trained technicians ready to deploy for rapid on-site service and resolution.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Genuine Parts</h3>
                                <p className="text-gray-500">Only authentic Roson replacement components are used to ensure lasting performance.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Coverage Table */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-2/3"
                    >
                        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-gray-200">
                                            <th className="py-5 px-6 font-semibold text-gray-900 w-1/2">Component Category</th>
                                            <th className="py-5 px-6 font-semibold text-gray-900 text-center w-1/4">Coverage</th>
                                            <th className="py-5 px-6 font-semibold text-gray-900 text-center w-1/4">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-5 px-6">
                                                <span className="font-medium text-gray-900 block">Chair Frame & Motors</span>
                                                <span className="text-sm text-gray-500">Lift mechanisms, structural integrity</span>
                                            </td>
                                            <td className="py-5 px-6 text-center">
                                                <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                                            </td>
                                            <td className="py-5 px-6 font-medium text-gray-900 text-center">5 Years</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-5 px-6">
                                                <span className="font-medium text-gray-900 block">PCB & Electronics</span>
                                                <span className="text-sm text-gray-500">Mainboards, LCD display, control panels</span>
                                            </td>
                                            <td className="py-5 px-6 text-center">
                                                <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                                            </td>
                                            <td className="py-5 px-6 font-medium text-gray-900 text-center">5 Years</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-5 px-6">
                                                <span className="font-medium text-gray-900 block">Delivery System & Spittoon</span>
                                                <span className="text-sm text-gray-500">Valves, tubing (internal), ceramic/glass bowl</span>
                                            </td>
                                            <td className="py-5 px-6 text-center">
                                                <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                                            </td>
                                            <td className="py-5 px-6 font-medium text-gray-900 text-center">5 Years</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-5 px-6">
                                                <span className="font-medium text-gray-900 block">Operating Light (LED)</span>
                                                <span className="text-sm text-gray-500">LED arrays, articulating arm, sensors</span>
                                            </td>
                                            <td className="py-5 px-6 text-center">
                                                <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                                            </td>
                                            <td className="py-5 px-6 font-medium text-gray-900 text-center">3 Years</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-5 px-6">
                                                <span className="font-medium text-gray-900 block">Upholstery & Wear Items</span>
                                                <span className="text-sm text-gray-500">Cushions, external tubing, filters</span>
                                            </td>
                                            <td className="py-5 px-6 text-center">
                                                <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                                            </td>
                                            <td className="py-5 px-6 font-medium text-gray-900 text-center">1 Year</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
