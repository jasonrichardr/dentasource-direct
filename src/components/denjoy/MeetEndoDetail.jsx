'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getFlagship } from '@/data/denjoy';
import MessengerButton from './MessengerButton';
import VideoSection from './VideoSection';
import Lightbox from './Lightbox';

export default function MeetEndoDetail() {
  const product = getFlagship();
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const total = product.gallery?.length ?? 0;

  return (
    <article className="bg-gradient-to-b from-[#1a0f1a] via-[#0f1419] to-[#0a0a0f] text-white min-h-screen pb-20">

      <div className="pt-28 md:pt-32 max-w-7xl mx-auto px-6 md:px-12">
        <Link
          href="/denjoy"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-8"
        >
          <span aria-hidden="true">←</span> Back to Denjoy
        </Link>

        <section className="text-center mb-16 md:mb-20">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#f0c7db] mb-4">
            The Flagship Endodontic System
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-8xl font-semibold tracking-tight leading-[1.05] mb-6"
          >
            Meet Endo
          </motion.h1>
          <p className="text-lg md:text-2xl text-white/75 max-w-3xl mx-auto leading-relaxed">
            {product.tagline}
          </p>
        </section>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative aspect-video w-full max-w-5xl mx-auto mb-20 md:mb-24 rounded-3xl overflow-hidden bg-black/40"
        >
          <Image
            src={product.heroImage}
            alt="Meet Endo with integrated touchscreen running MeetPex, MeetMotor, MeetFill"
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </motion.div>

        <section className="mb-20">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-center mb-4">
            Three modules. One system.
          </h2>
          <p className="text-center text-white/60 max-w-2xl mx-auto mb-12">
            Meet Endo&apos;s touchscreen orchestrates three connected sub-modules — each powerful
            standalone, profound when combined.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {product.modules.map((module, i) => (
              <motion.div
                key={module.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="rounded-2xl p-8 backdrop-blur-sm border border-white/10"
                style={{ background: `linear-gradient(145deg, ${module.color}30, ${module.color}05)` }}
              >
                <div
                  className="w-3 h-10 rounded-full mb-5"
                  style={{ background: module.color, boxShadow: `0 0 24px ${module.color}` }}
                  aria-hidden="true"
                />
                <h3 className="text-3xl font-semibold mb-2">{module.name}</h3>
                <p className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">
                  {module.role}
                </p>
                <p className="text-base text-white/80 leading-relaxed">
                  {module.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-center mb-12">
            Why dentists choose Meet Endo
          </h2>
          <ul className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {product.keyFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-4 p-6 rounded-xl bg-white/5 border border-white/10">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-[#f0c7db] shrink-0" aria-hidden="true" />
                <span className="text-base md:text-lg text-white/90 leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-center mb-3">
            In our showroom
          </h2>
          <p className="text-center text-white/50 text-sm mb-10">Tap any image to expand.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {product.gallery.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setLightboxIndex(i)}
                aria-label={`Expand Meet Endo image ${i + 1}`}
                className="group relative aspect-square rounded-xl overflow-hidden bg-black/40 cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-[#f0c7db] focus:ring-offset-2 focus:ring-offset-[#0f1419]"
              >
                <Image
                  src={src}
                  alt={`Meet Endo view ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100" aria-hidden="true">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f1419" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <Lightbox
          images={product.gallery}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => (i - 1 + total) % total)}
          onNext={() => setLightboxIndex((i) => (i + 1) % total)}
          alt={product.fullName}
        />

        <VideoSection videos={product.videos} productName={product.name} />

        <section className="rounded-3xl bg-gradient-to-br from-[#7a2a4d] to-[#1a3c34] p-10 md:p-16 text-center">
          <h2 className="text-3xl md:text-5xl font-semibold mb-4">
            The Meet Endo demo unit is at our Manila showroom.
          </h2>
          <p className="text-white/85 mb-8 max-w-2xl mx-auto text-lg">
            See the touchscreen light up. Hold the MeetMotor handpiece.
            Judge it for yourself before you decide.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <MessengerButton product={product.name} prefillText={product.messengerText} />
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#1a3c34] font-semibold hover:bg-white/90 transition-colors"
            >
              Book a showroom visit
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

      </div>
    </article>
  );
}
