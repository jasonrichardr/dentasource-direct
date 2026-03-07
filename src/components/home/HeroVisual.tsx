"use client";

import { motion } from "framer-motion";

export default function HeroVisual() {
    const trustItems = [
        "White Glove Installation",
        "Hands-On Training Included",
        "2-Year Warranty",
        "Free Ocular Visitation",
        "Zero Down Payment Options",
        "After-Sales Service",
        "Open Mon–Sun 9AM–8PM",
        "Philippine-Based Support",
    ];

    return (
        <section className="relative w-full overflow-hidden bg-[#1E3A2E] text-white selection:bg-white/20">
            {/* Background Styling (Gradient mimicking premium green theme) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#182e24] via-[#1E3A2E] to-[#12241c] z-0" />

            {/* Hero Content */}
            <div className="relative z-10 pt-24 pb-16 md:pt-32 md:pb-24 max-w-7xl mx-auto px-6 flex flex-col items-center text-center">

                {/* Subtle top trust badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/90">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        Trusted Dental Equipment Partner in the Philippines
                    </span>
                </motion.div>

                {/* Main Typography */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight mb-8"
                >
                    Your <span className="text-[#F26522] italic pr-2">Growth Partner</span> <br className="hidden md:block" /> in Dentistry.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-lg md:text-xl text-white/70 font-light max-w-2xl mb-12 leading-relaxed"
                >
                    Premium dental chairs and equipment with white glove installation, hands-on training, and the personalized support your practice deserves.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6"
                >
                    <a
                        href="/contact"
                        className="px-8 py-4 bg-[#F26522] text-white rounded-full font-medium transition-all duration-300 hover:bg-[#d95517] hover:scale-105 shadow-[0_0_30px_rgba(242,101,34,0.3)]"
                    >
                        Book a Showroom Experience
                    </a>
                    <a
                        href="/products"
                        className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-medium transition-all duration-300 hover:bg-white/10"
                    >
                        Explore Products
                    </a>
                </motion.div>
            </div>

            {/* Marquee Trust Bar */}
            <div className="relative z-10 w-full bg-black/40 border-y border-white/10 py-4 overflow-hidden mt-8">
                <div className="flex w-max animate-marquee items-center gap-12">
                    {/* First set */}
                    {trustItems.map((item, i) => (
                        <div key={`trust-1-${i}`} className="flex items-center gap-3 text-white/60 text-sm font-medium whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00c2ff]/60" />
                            {item}
                        </div>
                    ))}
                    {/* Duplicate set for seamless infinite loop */}
                    {trustItems.map((item, i) => (
                        <div key={`trust-2-${i}`} className="flex items-center gap-3 text-white/60 text-sm font-medium whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00c2ff]/60" />
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}} />
        </section>
    );
}
