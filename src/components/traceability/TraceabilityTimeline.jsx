'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const timelineSteps = [
  {
    id: 1,
    title: 'SQE',
    subtitle: 'Supplier Quality Engineering',
    desc: 'Vetting raw materials and components at their source to ensure baseline perfection before they ever reach our factory.',
    img: '/images/traceability/供应商品质工程风采.webp',
  },
  {
    id: 2,
    title: 'IQC',
    subtitle: 'Incoming Quality Control',
    desc: '30~100% Spot-Check on all incoming parts. Utilizing electronic testing arrays to ensure every chip and valve meets exacting ISO standards.',
    img: '/images/traceability/home-IQC.webp',
  },
  {
    id: 3,
    title: 'Debugging',
    subtitle: 'In-Process Quality Control',
    desc: 'During assembly, our MES digital management system actively traces components, maintaining extreme precision throughout the build process.',
    img: '/images/traceability/home-Debugging.webp',
  },
  {
    id: 4,
    title: 'OQC',
    subtitle: 'Outgoing Quality Control',
    desc: '100% testing rate. Every completed dental unit undergoes rigorous operational tests simulating 10 years of clinical extreme usage.',
    img: '/images/traceability/home-oqc.webp',
  },
  {
    id: 5,
    title: 'Ready to Ship',
    subtitle: 'Packaging and Dispatch',
    desc: 'Carefully crated and protected, achieving a 99% Out-of-Box Quality Rate. From our factory direct to your clinic worldwide.',
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
    <section ref={containerRef} className="py-24 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-cyan-900/30 px-4 py-2 rounded-full mb-6 border border-cyan-500/20"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold text-cyan-300 tracking-widest uppercase">100% Traceability</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-light text-white mb-6"
          >
            Tracking Quality Through <br /> <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">Every Phase</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 max-w-2xl mx-auto"
          >
            Our MES digital management system records critical production steps and component information, allowing for full visibility and total confidence.
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-neutral-800 rounded-full md:-translate-x-1/2" />
          
          {/* Animated SVG Line */}
          <svg className="absolute left-4 md:left-1/2 top-0 h-full w-8 -translate-x-1/2 md:-ml-4 z-10 hidden md:block" viewBox="0 0 8 1000" preserveAspectRatio="none">
            <motion.line 
              x1="4" y1="0" x2="4" y2="1000"
              stroke="url(#gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              style={{ pathLength }}
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>

          <div className="space-y-24">
            {timelineSteps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={step.id} className="relative flex items-center md:justify-between flex-col md:flex-row gap-8">
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)] md:-translate-x-1/2 z-20 top-8 md:top-1/2" />

                  {/* Content Desktop Layout: alternate left/right */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className={`w-full md:w-5/12 ml-12 md:ml-0 ${isEven ? 'md:text-right md:pr-12' : 'md:text-left md:order-last md:pl-12'}`}
                  >
                    <div className="text-sm font-bold text-cyan-400 tracking-widest uppercase mb-2">Step 0{step.id}</div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-white mb-2">{step.title}</h3>
                    <h4 className="text-lg text-neutral-300 font-medium mb-4">{step.subtitle}</h4>
                    <p className="text-neutral-400 leading-relaxed">{step.desc}</p>
                  </motion.div>

                  {/* Image */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className={`nav-glow-container w-full md:w-[45%] rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-900 ml-12 md:ml-0 ${isEven ? 'md:order-last' : ''}`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={step.img}
                        alt={step.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
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
