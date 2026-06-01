'use client';

import { motion } from 'framer-motion';
import { Stethoscope, HeartHandshake, Sparkles, Sprout } from 'lucide-react';

const pillars = [
    {
        Icon: Stethoscope,
        title: 'Clinic-Raised',
        body: 'Each one spent five to seven years working professionally inside real dental clinics — across many practices and many dentists. They know a clinic from the inside, not the sales floor.',
    },
    {
        Icon: HeartHandshake,
        title: 'Leaders, No Egos',
        body: "A room full of natural leaders who'd rather lift each other than stand out — so the strength you get is the whole team, not one person.",
    },
    {
        Icon: Sparkles,
        title: 'Humble by Habit',
        body: "Fully equipped, deeply experienced, and still the first to say they don't know everything — quietly out to defeat who they were yesterday.",
    },
    {
        Icon: Sprout,
        title: 'Built to Grow',
        body: 'Growth is the house rule here: every day we sharpen, study, and get a little better — because the people who serve you deserve a team that never stops learning.',
    },
];

export default function MeetTheTeam() {
    return (
        <section className="bg-[#F8F7F4] px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl"
                >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                        Our People
                    </p>
                    <h2 className="mt-2 text-[1.7rem] leading-[1.12] font-semibold tracking-tight text-[#1D1D1F] sm:text-4xl md:text-5xl">
                        The people I&rsquo;d build anything with.
                    </h2>
                    <p className="mt-4 text-[15px] leading-relaxed text-[#52525B] sm:text-base">
                        Behind the country&rsquo;s largest dental showroom is a team I love with my whole heart —
                        people who didn&rsquo;t learn this trade from a brochure. They learned it standing beside
                        dentists, in real clinics, on real cases, for years. So when you talk to them, it doesn&rsquo;t
                        feel like a pitch — it feels like someone who&rsquo;s been on your side of the chair.
                    </p>
                </motion.div>

                <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5">
                    {pillars.map((p, i) => (
                        <motion.div
                            key={p.title}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                            className="rounded-2xl border border-black/[0.06] bg-white p-5 sm:p-6"
                        >
                            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                <p.Icon className="size-5" strokeWidth={1.75} />
                            </div>
                            <h3 className="mt-3.5 text-[15px] font-semibold text-[#1D1D1F] sm:text-base">
                                {p.title}
                            </h3>
                            <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#52525B] sm:text-[14px]">
                                {p.body}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.figure
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                    className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 sm:mt-12 sm:p-8"
                >
                    <blockquote className="text-[17px] leading-snug font-medium tracking-tight text-[#1a3c34] sm:text-xl md:text-2xl">
                        &ldquo;This isn&rsquo;t a company I built around products — it&rsquo;s a family I built around
                        people. And I&rsquo;d choose every one of them again.&rdquo;
                    </blockquote>
                    <figcaption className="mt-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                        Jarich · Founder, DentaSource Direct
                    </figcaption>
                </motion.figure>
            </div>
        </section>
    );
}
