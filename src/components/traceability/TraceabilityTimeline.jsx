'use client';

import { m as motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const timelineSteps = [
  {
    id: 1,
    title: 'Raw Materials Verified',
    subtitle: 'Before production even starts',
    desc: "Every component — from hydraulic valves to circuit boards — is vetted at the source. If it doesn't meet spec, it never enters the factory.",
    img: '/images/traceability/供应商品质工程风采.webp',
  },
  {
    id: 2,
    title: 'Parts Inspected on Arrival',
    subtitle: '30–100% spot-check rate',
    desc: "Every incoming batch gets electronically tested against ISO standards. The chips controlling your chair's motor? Each one is individually verified.",
    img: '/images/traceability/home-IQC.webp',
  },
  {
    id: 3,
    title: 'Built With Digital Precision',
    subtitle: 'Every step tracked by MES',
    desc: "During assembly, a digital management system traces every component installed in your specific unit. Your chair has a build history — like a medical record.",
    img: '/images/traceability/home-Debugging.webp',
  },
  {
    id: 4,
    title: 'Researched & Developed',
    subtitle: 'Every model, purpose-engineered',
    desc: "Each dental chair model goes through extensive R&D before production begins — ergonomics tested by dentists, materials selected for clinical durability, and every mechanism refined until it meets ROSON's engineering standard.",
    img: '/images/traceability/home-oqc.webp',
  },
  {
    id: 5,
    title: 'Delivered to Your Clinic',
    subtitle: '99% out-of-box quality rate',
    desc: "Factory-crated, shipped direct, white-glove installed in your operatory. From ROSON's production line to your patient's chair — fully traceable.",
    img: '/images/traceability/运输-.webp',
  }
];

export default function TraceabilityTimeline() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={containerRef} className="py-20 sm:py-24 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">

        <div className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            className="inline-flex items-center space-x-2 bg-emerald-900/30 px-4 py-2 rounded-full mb-6 border border-emerald-500/20"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300 tracking-widest uppercase">How Your Chair Is Built</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight"
          >
            5 Quality Gates Between <br className="hidden sm:block" />
            the Factory and{' '}
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-300">Your Clinic</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 max-w-xl mx-auto text-sm sm:text-base mb-8"
          >
            Every ROSON dental chair passes through five checkpoints before it reaches your operatory. Nothing ships until everything checks out.
          </motion.p>

          {/* Legitimacy Badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              { label: 'ISO 13485', sub: 'Medical Device QMS' },
              { label: 'ISO 9001', sub: 'Quality Management' },
              { label: 'CE Certified', sub: 'European Conformity' },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                  <circle cx="7" cy="7" r="6" stroke="#34d399" strokeWidth="1.5" />
                  <path d="M4.5 7L6.5 9L10 5" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-left">
                  <div className="text-[11px] font-bold text-white/80 leading-none">{badge.label}</div>
                  <div className="text-[9px] text-white/35 leading-none mt-0.5">{badge.sub}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-neutral-800 rounded-full md:-translate-x-1/2" />

          {/* Animated SVG Line */}
          <svg className="absolute left-4 md:left-1/2 top-0 h-full w-8 -translate-x-1/2 md:-ml-4 z-10 hidden md:block" viewBox="0 0 8 1000" preserveAspectRatio="none">
            <motion.line
              x1="4" y1="0" x2="4" y2="1000"
              stroke="url(#gradient-line)"
              strokeWidth="4"
              strokeLinecap="round"
              style={{ pathLength }}
            />
            <defs>
              <linearGradient id="gradient-line" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          <div className="space-y-16 sm:space-y-24">
            {timelineSteps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={step.id} className="relative flex items-center md:justify-between flex-col md:flex-row gap-6 sm:gap-8">
                  {/* Timeline Dot — hidden on mobile, shown on desktop */}
                  <div className="absolute hidden md:block md:left-1/2 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.3)] md:-translate-x-1/2 z-20 md:top-1/2" />

                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={`w-full md:w-5/12 ml-12 md:ml-0 ${isEven ? 'md:text-right md:pr-12' : 'md:text-left md:order-last md:pl-12'}`}
                  >
                    <div className="text-[11px] font-bold text-emerald-400 tracking-[0.2em] uppercase mb-2">Gate {step.id}</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{step.title}</h3>
                    <h4 className="text-sm text-neutral-400 font-medium mb-3">{step.subtitle}</h4>
                    <p className="text-neutral-500 leading-relaxed text-sm sm:text-base">{step.desc}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className={`w-full md:w-[45%] rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-900 ml-12 md:ml-0 ${isEven ? 'md:order-last' : ''}`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={step.img}
                        alt={step.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
