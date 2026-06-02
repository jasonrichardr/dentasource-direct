"use client";

import { m as motion } from "framer-motion";
import { useState } from "react";

type SpecGroup = {
    label: string;
    specs: { name: string; value: string }[];
};

const specGroups: SpecGroup[] = [
    {
        label: "Electrical",
        specs: [
            { name: "Model", value: "S9" },
            { name: "Input Power", value: "720 VA max" },
            { name: "Voltage", value: "230V AC \u00b110%, 50/60Hz" },
            { name: "Protection Class", value: "Class I, Type B applied parts" },
            { name: "Water Protection", value: "IPX0 (main unit), IPX4 (foot controller)" },
        ],
    },
    {
        label: "Chair Mechanics",
        specs: [
            { name: "Height Range", value: "400\u2013750mm (\u00b110mm)" },
            { name: "Backrest Range", value: "115\u00b0\u2013170\u00b0" },
            { name: "Max Patient Load", value: "150 kg (ISO 7494-1)" },
            { name: "Motor", value: "Whisper-Silent Motor with soft start/stop" },
            { name: "Motor Warranty", value: "3-year warranty" },
            { name: "Motor Duty", value: "Max 2 min ON / Min 18 min OFF" },
        ],
    },
    {
        label: "Water System",
        specs: [
            { name: "Water Pressure", value: "0.2\u20130.4 MPa" },
            { name: "Water Flow", value: "\u22655 L/min" },
            { name: "Disinfection", value: "EOW-TECH electrolyzed oxidizing water" },
            { name: "Warm Water Temp", value: "40\u00b0C \u00b15\u00b0C" },
        ],
    },
    {
        label: "Air Supply",
        specs: [
            { name: "Air Pressure", value: "0.55\u20130.8 MPa" },
            { name: "Air Flow", value: "\u226590 L/min" },
            { name: "Oil", value: "None (oil-free compressor only)" },
        ],
    },
    {
        label: "Physical",
        specs: [
            { name: "Net Weight", value: "~230 kg" },
            { name: "Operation Panel", value: "45\u00b0 ergonomic angle" },
            { name: "Memory Positions", value: "3 preset positions (P1, P2, P3)" },
        ],
    },
];

const standards = [
    "IEC 60601-1:2005+A1:2012",
    "EN ISO 7494-1:2018",
    "ISO 9680:2014",
    "CE marked per Council Directive 93/42/EEC",
];

export default function S9TechSpecs() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="py-16 lg:py-24 bg-zinc-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Section Header */}
                <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-emerald-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
                            Technical Reference
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                            Full Technical Specifications
                        </h2>
                        <p className="mt-4 text-base sm:text-lg leading-8 text-gray-600">
                            Everything your technician needs to know \u2014 from the ROSON CE Manual.
                        </p>
                    </motion.div>
                </div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-wrap gap-2 mb-8 justify-center" role="tablist" aria-label="Technical specification categories">
                        {specGroups.map((group, index) => (
                            <button
                                key={group.label}
                                role="tab"
                                aria-selected={activeTab === index}
                                aria-controls={`spec-panel-${index}`}
                                onClick={() => setActiveTab(index)}
                                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                                    activeTab === index
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
                                        : "bg-zinc-100 text-gray-600 hover:bg-zinc-200"
                                }`}
                            >
                                {group.label}
                            </button>
                        ))}
                    </div>

                    {/* Spec Table */}
                    <div className="mx-auto max-w-3xl" role="tabpanel" id={`spec-panel-${activeTab}`} aria-label={specGroups[activeTab].label}>
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="bg-zinc-50 border-b border-gray-100 px-6 sm:px-8 py-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                                    {specGroups[activeTab].label}
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {specGroups[activeTab].specs.map((spec, index) => (
                                    <div
                                        key={spec.name}
                                        className={`flex justify-between items-center px-6 sm:px-8 py-4 ${
                                            index % 2 === 0 ? "bg-white" : "bg-zinc-50/50"
                                        }`}
                                    >
                                        <span className="text-sm sm:text-base font-medium text-gray-600">
                                            {spec.name}
                                        </span>
                                        <span className="text-sm sm:text-base font-semibold text-gray-900 text-right">
                                            {spec.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Standards */}
                    <div className="mx-auto max-w-3xl mt-10">
                        <div className="text-center mb-5">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Compliance & Standards
                            </span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                            {standards.map((standard) => (
                                <span
                                    key={standard}
                                    className="inline-flex items-center rounded-full bg-zinc-100 border border-gray-200 px-4 py-2 text-xs sm:text-sm font-medium text-gray-700"
                                >
                                    {standard}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
