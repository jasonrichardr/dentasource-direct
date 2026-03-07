"use client";

import { motion } from "framer-motion";

const values = [
    {
        title: "Closer to the Dentist",
        description: "We operate at clinic level, not corporate scale. We understand startup clinics, expanding practices, and multi-branch realities. Decisions are fast, human, and practical. Dentists aren't just customers — they're partners."
    },
    {
        title: "Showroom-First Experience",
        description: "Visit our showroom and experience the equipment firsthand. Sit on the chair, feel the stability, test the ergonomics. We believe equipment should be experienced, not just explained. Specs inform. Experience convinces."
    },
    {
        title: "Training & Education Built In",
        description: "We don't just sell products — we build capability. Hands-on training, product mastery, workflow understanding, and a growth mindset for your practice. We help dentists grow into stronger operators."
    },
    {
        title: "Flexible & Transparent",
        description: "Flexible payment options, practical bundles, and honest recommendations — even if it means selling less. We optimize for your clinic's reality, not our margin. Long-term trust over short-term margin."
    },
    {
        title: "Built in the Philippines, For Filipino Dentists",
        description: "We understand local clinic economics, space constraints, staffing realities, and patient behavior. Our support is faster, culturally aligned, and grounded in local reality. We don't just sell here — we're building here."
    }
];

export default function ValueProposition() {
    return (
        <section className="bg-white text-zinc-900 py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-24 md:w-2/3"
                >
                    <h2 className="text-sm uppercase tracking-[0.2em] text-zinc-500 mb-6">Our Philosophy</h2>
                    <h3 className="text-4xl md:text-5xl font-light leading-tight">
                        Built for Dentists, by People Who <span className="font-medium">Understand Dentistry.</span>
                    </h3>
                    <p className="mt-8 text-xl text-zinc-600 font-light leading-relaxed max-w-2xl">
                        We&apos;re not just another distributor. We&apos;re a partner invested in your clinic&apos;s success.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                    {values.map((value, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="group"
                        >
                            <div className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center mb-8 group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-500">
                                <span className="text-sm font-medium">{String(idx + 1).padStart(2, '0')}</span>
                            </div>
                            <h4 className="text-xl font-medium mb-4">{value.title}</h4>
                            <p className="text-zinc-500 leading-relaxed font-light">{value.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
