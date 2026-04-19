'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import MessengerButton from './MessengerButton';
import VideoSection from './VideoSection';

export default function CoStarDetail({ product }) {
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
              {product.category.replace(/-/g, ' ')}
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {product.gallery.map((src, i) => (
                <div key={src} className="relative aspect-square rounded-xl overflow-hidden bg-black/40">
                  <Image
                    src={src}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

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
