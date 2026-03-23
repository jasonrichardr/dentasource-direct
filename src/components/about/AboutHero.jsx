'use client';
import { motion } from 'framer-motion';

export default function AboutHero() {
  return (
    <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center bg-[#0A1410] pt-[120px] md:pt-32 pb-20 px-4 overflow-hidden transform-gpu">
      {/* Surgical Green Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#10b981]/15 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <span className="text-[#F26522] font-semibold tracking-widest uppercase text-sm border border-[#F26522]/30 px-6 py-2 rounded-full bg-[#F26522]/5">
            Our Story
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] leading-[1.05] font-semibold tracking-tight mb-8"
        >
          We build <span className="text-white/40 italic font-serif">clinics</span>,<br className="hidden sm:block" />
          not just transactions.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/60 text-lg sm:text-xl font-light max-w-2xl leading-relaxed"
        >
          DentaSource Direct was founded on a simple premise: Filipino dentists deserve access to world-class equipment without the corporate friction. We operate at clinic level, bringing state-of-the-art technology directly to your practice.
        </motion.p>
      </div>
    </section>
  );
}
