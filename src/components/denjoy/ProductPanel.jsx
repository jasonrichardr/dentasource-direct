'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import MessengerButton from './MessengerButton';

export default function ProductPanel({ product, imagePosition = 'right', accentColor = '#7a2a4d' }) {
  const isImageRight = imagePosition === 'right';

  return (
    <section
      id={`denjoy-${product.slug}`}
      className="relative snap-start min-h-screen w-full bg-[#0f1419] text-white overflow-hidden"
      aria-labelledby={`${product.slug}-title`}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
        aria-hidden="true"
      />

      <div className={`min-h-screen flex flex-col ${isImageRight ? 'md:flex-row' : 'md:flex-row-reverse'} items-center max-w-7xl mx-auto px-6 md:px-12 gap-10 md:gap-16 py-20 md:py-24`}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex-1 max-w-xl w-full"
        >
          <p
            className="text-xs font-bold tracking-[0.3em] uppercase mb-4"
            style={{ color: accentColor === '#7a2a4d' ? '#f0c7db' : accentColor }}
          >
            {product.chapter.replace(/-/g, ' ')}
          </p>
          <h2
            id={`${product.slug}-title`}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-5"
          >
            {product.name}
          </h2>
          <p className="text-lg md:text-xl text-white/70 mb-8 leading-relaxed">
            {product.tagline}
          </p>

          <ul className="space-y-3 mb-10">
            {product.keyFeatures.slice(0, 4).map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-base text-white/85 leading-relaxed">
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: accentColor }}
                  aria-hidden="true"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            <MessengerButton product={product.name} prefillText={product.messengerText} />
            <Link
              href={`/denjoy/${product.slug}`}
              className="inline-flex items-center gap-1 px-5 py-3 rounded-full border border-white/25 text-white/80 hover:border-white hover:text-white text-sm font-semibold transition-colors"
            >
              Learn more
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
          className="flex-1 w-full max-w-2xl relative aspect-[4/5] md:aspect-square"
        >
          <div
            className="absolute inset-0 rounded-[2rem] blur-3xl opacity-40"
            style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
            aria-hidden="true"
          />
          <Image
            src={product.heroImage}
            alt={product.fullName}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain relative z-10 drop-shadow-2xl"
          />
        </motion.div>

      </div>
    </section>
  );
}
