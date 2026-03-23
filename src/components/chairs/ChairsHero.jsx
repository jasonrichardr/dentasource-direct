'use client';
import { motion } from 'framer-motion';

const stats = [
  { value: 'ISO 13485', label: 'Certified' },
  { value: '5-Year', label: 'Motor Warranty' },
  { value: '#1', label: 'Showroom in PH' },
];

export default function ChairsHero() {
  return (
    <section className="relative w-full bg-[#0A1410] pt-[100px] sm:pt-[120px] md:pt-36 pb-16 sm:pb-20 md:pb-28 px-4 sm:px-6 md:px-8 overflow-hidden transform-gpu flex flex-col items-center">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[400px] bg-[#0071E3]/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#10b981]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-white text-[2.5rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-4 sm:mb-6">
            Engineered for{' '}
            <span className="text-white/60">Absolute Precision.</span>
          </h1>

          <p className="text-white/50 text-sm sm:text-base md:text-lg leading-relaxed mb-8 md:mb-12 max-w-2xl">
            Built-in medical-grade water disinfection, intelligent infrared sensors, and a whisper-quiet lift system — for clinics that never compromise.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-8 sm:gap-12 md:gap-16">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="text-center"
              >
                <span className="block text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{stat.value}</span>
                <span className="block text-white/40 text-[10px] sm:text-xs uppercase tracking-wider mt-1">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
