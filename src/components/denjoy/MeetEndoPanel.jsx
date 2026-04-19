'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getFlagship } from '@/data/denjoy';
import MessengerButton from './MessengerButton';

export default function MeetEndoPanel() {
  const product = getFlagship();

  return (
    <section
      id="denjoy-meet-endo"
      className="relative snap-start min-h-screen w-full bg-gradient-to-b from-[#1a0f1a] via-[#0f1419] to-[#0a0a0f] text-white overflow-hidden"
      aria-labelledby="meet-endo-title"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#7a2a4d] blur-[120px] opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#2a4d7a] blur-[120px] opacity-25" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-24 min-h-screen flex flex-col justify-center">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#f0c7db] mb-4">
            The Flagship
          </p>
          <h2
            id="meet-endo-title"
            className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[1.05] mb-6"
          >
            Meet Endo
          </h2>
          <p className="text-lg md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            {product.tagline}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className="relative w-full max-w-3xl mx-auto aspect-[4/3] mb-12"
        >
          <div
            className="absolute inset-0 rounded-[2rem] blur-3xl opacity-50"
            style={{ background: 'radial-gradient(circle, #7a2a4d 0%, transparent 70%)' }}
            aria-hidden="true"
          />
          <Image
            src={product.heroImage}
            alt="Meet Endo All-in-One with integrated touchscreen"
            fill
            sizes="(max-width: 768px) 100vw, 70vw"
            className="object-contain relative z-10 drop-shadow-2xl"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {product.modules.map((module, i) => (
            <motion.div
              key={module.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 + i * 0.15 }}
              className="relative rounded-2xl p-6 backdrop-blur-sm border border-white/10"
              style={{ background: `linear-gradient(135deg, ${module.color}30, ${module.color}10)` }}
            >
              <div
                className="w-2 h-8 rounded-full mb-4"
                style={{ background: module.color, boxShadow: `0 0 20px ${module.color}` }}
                aria-hidden="true"
              />
              <h3 className="text-2xl font-semibold mb-1">{module.name}</h3>
              <p className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-3">
                {module.role}
              </p>
              <p className="text-sm text-white/75 leading-relaxed">
                {module.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <MessengerButton product={product.name} prefillText={product.messengerText} />
          <Link
            href="/denjoy/meet-endo"
            className="inline-flex items-center gap-1 px-6 py-3 rounded-full border border-white/25 text-white/85 hover:border-white hover:text-white text-base font-semibold transition-colors"
          >
            See the full system
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
