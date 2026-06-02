'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { m as motion } from 'framer-motion';
import MessengerButton from './MessengerButton';
import VideoSection from './VideoSection';
import Lightbox from './Lightbox';

export default function CoStarDetail({ product }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const total = product.gallery?.length ?? 0;

  return (
    <article className="bg-[#0f1419] text-white min-h-screen pb-20">

      <div className="pt-28 md:pt-32 max-w-6xl mx-auto px-6 md:px-12">
        <Link
          href="/denjoy"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-8"
        >
          <span aria-hidden="true">←</span> Back to Denjoy
        </Link>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#f0c7db] mb-3">
              {product.chapter.replace(/-/g, ' ')}
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight mb-5">
              {product.name}
            </h1>
            <p className="text-lg md:text-xl text-white/75 leading-relaxed mb-8">
              {product.tagline}
            </p>
            <MessengerButton product={product.name} prefillText={product.messengerText} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square w-full max-w-lg mx-auto"
          >
            <Image
              src={product.heroImage}
              alt={product.fullName}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </motion.div>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Features</h2>
          <ul className="grid md:grid-cols-2 gap-4">
            {product.keyFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-3 p-5 rounded-xl bg-white/5 border border-white/10">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#f0c7db] shrink-0" aria-hidden="true" />
                <span className="text-base text-white/85 leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        {product.gallery.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">Gallery</h2>
            <p className="text-sm text-white/50 mb-4">Tap any image to expand.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {product.gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`Expand ${product.name} image ${i + 1}`}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-black/40 cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-[#f0c7db] focus:ring-offset-2 focus:ring-offset-[#0f1419]"
                >
                  <Image
                    src={src}
                    alt={`${product.name} view ${i + 1}`}
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
        )}

        <Lightbox
          images={product.gallery}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => (i - 1 + total) % total)}
          onNext={() => setLightboxIndex((i) => (i + 1) % total)}
          alt={product.fullName}
        />

        <VideoSection videos={product.videos} productName={product.name} />

        <section className="rounded-2xl bg-gradient-to-br from-[#1a3c34] to-[#0f1419] p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">
            See the {product.name} in person.
          </h2>
          <p className="text-white/75 mb-6 max-w-xl mx-auto">
            Message us on Facebook or drop by our Manila showroom — the full Denjoy lineup is ready to demo.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <MessengerButton product={product.name} prefillText={product.messengerText} />
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#1a3c34] font-semibold hover:bg-white/90 transition-colors"
            >
              Visit showroom
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

      </div>
    </article>
  );
}
