'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import MessengerButton from './MessengerButton';

export default function DenjoyCTA() {
  return (
    <section
      className="relative snap-start min-h-screen w-full bg-[#1a3c34] text-white overflow-hidden flex items-center justify-center"
      aria-labelledby="denjoy-cta-title"
    >
      <div className="absolute inset-0 pointer-events-none opacity-20" aria-hidden="true">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,#10b981_0%,transparent_60%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-3xl mx-auto px-6 text-center"
      >
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-emerald-300 mb-5">
          Ready when you are
        </p>
        <h2
          id="denjoy-cta-title"
          className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight mb-6"
        >
          See Meet Endo in person.
        </h2>
        <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto">
          The Meet Endo demo unit is already installed at our Manila showroom.
          Message us on Facebook, or come visit — chai, coffee, and a full walkthrough on us.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <MessengerButton
            prefillText="Hi DSD, I'd like to chat about the Denjoy launch."
            label="Message us on Messenger"
          />
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#1a3c34] font-semibold hover:bg-white/90 transition-colors"
          >
            Visit our Manila showroom
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
