'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { denjoyChapters } from '@/data/denjoy';

/**
 * Slide-up detail card displayed below the constellation when a node is selected.
 *
 * Props:
 *  - product: selected denjoyProducts entry, or null when nothing is selected
 *  - onClose: () => void — clears selection
 */
export default function InlineDetail({ product, onClose }) {
  return (
    <AnimatePresence mode="wait">
      {product && (
        <motion.div
          key={product.slug}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative mt-6 grid grid-cols-1 md:grid-cols-[5fr_6fr] gap-6 rounded-lg border border-white/10 bg-white/5 p-6 text-white"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-10 rounded p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
            aria-label="Close detail"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Hero image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded">
            <Image
              src={product.heroImage}
              alt={product.fullName}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>

          {/* Body */}
          <div>
            <div className="text-amber-200 text-[10px] font-bold uppercase tracking-[0.25em] mb-2">
              Chapter {chapterRomanFor(product.chapter)} ·{' '}
              {chapterNameFor(product.chapter)}
            </div>
            <h2 className="font-serif italic text-2xl md:text-3xl mb-2 tracking-tight">
              {product.name} —{' '}
              <strong className="font-semibold not-italic">
                {product.tagline}
              </strong>
            </h2>
            <ul className="space-y-1.5 text-white/80 text-sm leading-snug">
              {product.keyFeatures.map((feat, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-amber-200/80 mt-0.5" aria-hidden="true">
                    ·
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={`/denjoy/${product.slug}`}
                className="inline-block rounded bg-amber-200 px-4 py-2 text-[12px] font-semibold text-amber-900 transition-colors hover:bg-amber-100"
              >
                See full {product.name} page →
              </Link>
              <Link
                href={messengerHref(product.messengerText)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded border border-white/30 px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                Chat about {product.name}
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function chapterRomanFor(id) {
  return denjoyChapters.find((c) => c.id === id)?.roman ?? '';
}

function chapterNameFor(id) {
  return denjoyChapters.find((c) => c.id === id)?.name ?? '';
}

function messengerHref(prefill) {
  const text = encodeURIComponent(prefill);
  return `https://m.me/dentasourcedirect?ref=denjoy_2026_landing&text=${text}`;
}
