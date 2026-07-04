'use client';

import { m as motion } from 'framer-motion';
import { Stethoscope, HeartHandshake, Sparkles, Sprout, Database, Handshake } from 'lucide-react';
import GlassMarbles from './GlassMarbles';

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
    {
        Icon: Database,
        title: 'Digitally Advanced',
        body: 'We run lean, tech-driven operations — including an in-house database of our entire product line — so stock, specs, and answers are always a click away, never a guess.',
    },
    {
        Icon: Handshake,
        title: 'Relational, Never Transactional',
        body: "We're not here for a one-time sale. We invest in long-term relationships with the practices we serve — because your growth, not the transaction, is the point.",
    },
];

export default function MeetTheTeam() {
    return (
        <section className="bg-transparent px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
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
                        Behind the country&rsquo;s largest dental showroom is a team — people who didn&rsquo;t learn
                        this trade from a brochure. They learned it standing beside dentists, in real clinics, on real
                        cases, for years. So when you talk to them, it doesn&rsquo;t feel like a pitch — it feels like
                        someone who&rsquo;s been on your side of the chair.
                    </p>
                </motion.div>

                <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                    {pillars.map((p, i) => (
                        <motion.div
                            key={p.title}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
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

                {/* Culture, on camera — the FFC glass marble cluster, 1:1 */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className="mt-12 sm:mt-16"
                >
                    <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                        Culture, On Camera
                    </p>
                    <div className="mt-6">
                        <GlassMarbles />
                    </div>
                </motion.div>

                <motion.figure
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                    className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 sm:mt-12 sm:p-8"
                >
                    <blockquote className="text-[16px] leading-snug font-medium tracking-tight text-[#1a3c34] sm:text-xl md:text-[22px]">
                        &ldquo;This isn&rsquo;t a company built around products, it&rsquo;s a team built around
                        people. Aligned in standards, united in purpose, accountable to each other and to you.&rdquo;
                    </blockquote>
                    <figcaption className="mt-4 text-[12px] font-semibold tracking-[0.06em] text-emerald-700">
                        Jarich · Founder, DentaSource Direct
                    </figcaption>
                </motion.figure>
            </div>
        </section>
    );
}
