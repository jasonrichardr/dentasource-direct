'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  denjoyChapters,
  getProductsByChapter,
  getFlagship,
  getDenjoyBySlug,
} from '@/data/denjoy';
import ChapterAnchor from './ChapterAnchor';
import ConstellationNode from './ConstellationNode';
import InlineDetail from './InlineDetail';

// Pentagon anchor positions (CSS % values from map center).
// Order matches denjoyChapters array order: 0°, 72°, 144°, 216°, 288°.
const ANCHOR_POSITIONS = [
  { left: '50%',  top: '14%' }, // I  · top
  { left: '80%',  top: '36%' }, // II · upper-right
  { left: '69%',  top: '80%' }, // III · lower-right
  { left: '31%',  top: '80%' }, // IV · lower-left
  { left: '20%',  top: '36%' }, // V  · upper-left
];

// Per-chapter SKU node positions (offsets around their anchor).
// Each chapter has up to 4 nodes; only the first N are used per chapter SKU count.
const NODE_POSITIONS = {
  integrated:  [{ left: '34%', top: '8%'  }, { left: '66%', top: '8%'  }, { left: '50%', top: '24%' }],
  apex:        [{ left: '88%', top: '20%' }, { left: '92%', top: '46%' }],
  microscopes: [{ left: '60%', top: '88%' }, { left: '78%', top: '93%' }],
  motors:      [{ left: '22%', top: '93%' }],
  auxiliary:   [{ left: '8%',  top: '20%' }, { left: '6%',  top: '50%' }, { left: '14%', top: '70%' }, { left: '32%', top: '52%' }],
};

export default function Constellation() {
  const [selectedSlug, setSelectedSlug] = useState(null);

  const flagship = useMemo(() => getFlagship(), []);
  const productsByChapter = useMemo(
    () => Object.fromEntries(
      denjoyChapters.map((ch) => [
        ch.id,
        getProductsByChapter(ch.id).filter((p) => !p.isFlagship),
      ])
    ),
    []
  );

  const selectedProduct = selectedSlug ? getDenjoyBySlug(selectedSlug) : null;

  const scrollToChapter = (chapterId) => {
    const el = document.getElementById(`chapter-${chapterId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="denjoy-constellation"
      aria-labelledby="constellation-heading"
      className="relative w-full bg-gradient-to-br from-[#06101e] via-[#0d1626] to-[#1a2342] py-12 md:py-16"
    >
      <h2 id="constellation-heading" className="sr-only">
        The Denjoy line — 12 instruments, 5 chapters
      </h2>

      <div className="mx-auto max-w-7xl px-4">
        {/* Map — all viewports, scales via aspect-ratio */}
        <div className="relative block aspect-square md:aspect-[16/10] w-full">
          {/* Connecting SVG lines from center to each anchor */}
          <svg
            className="absolute inset-0 h-full w-full pointer-events-none"
            viewBox="0 0 1000 625"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {ANCHOR_POSITIONS.map((pos, i) => {
              const cx1 = 500;
              const cy1 = 312.5;
              const cx2 = (parseFloat(pos.left) / 100) * 1000;
              const cy2 = (parseFloat(pos.top) / 100) * 625;
              return (
                <line
                  key={`line-${i}`}
                  x1={cx1}
                  y1={cy1}
                  x2={cx2}
                  y2={cy2}
                  stroke={`${denjoyChapters[i].color}66`}
                  strokeWidth="1"
                  strokeDasharray="2 4"
                />
              );
            })}
            {/* Two orbit guide circles */}
            <circle cx="500" cy="312.5" r="120" fill="none" stroke="rgba(180,220,255,0.08)" strokeWidth="1" strokeDasharray="2 6" />
            <circle cx="500" cy="312.5" r="200" fill="none" stroke="rgba(180,220,255,0.08)" strokeWidth="1" strokeDasharray="2 6" />
          </svg>

          {/* Center: Meet Endo */}
          <Link
            href={`/denjoy/${flagship.slug}`}
            className="absolute z-10 flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
            aria-label={`${flagship.fullName} — flagship — open detail page`}
          >
            <span
              className="block rounded-full w-14 h-14 md:w-20 md:h-20"
              style={{
                background:
                  'radial-gradient(circle, #fff 0%, #cce4ff 60%, #6aa8ff 100%)',
                boxShadow:
                  '0 0 22px rgba(180,220,255,0.85), 0 0 44px rgba(120,180,255,0.5)',
              }}
              aria-hidden="true"
            />
            <span className="mt-1 font-serif italic text-white/70 text-[9px] md:text-[10px] tracking-widest">
              ★ FLAGSHIP
            </span>
            <span className="mt-0.5 whitespace-nowrap rounded border border-white/20 bg-black/40 px-1.5 md:px-2.5 py-0.5 md:py-1 text-[9px] md:text-[11px] font-bold tracking-[0.2em] text-white">
              {flagship.name.toUpperCase()}
            </span>
          </Link>

          {/* Chapter anchors + their SKU nodes */}
          {denjoyChapters.map((chapter, ci) => {
            const products = productsByChapter[chapter.id] ?? [];
            return (
              <div key={chapter.id}>
                <ChapterAnchor
                  chapter={chapter}
                  skuCount={
                    chapter.id === 'integrated'
                      ? products.length + 1 /* +1 for flagship */
                      : products.length
                  }
                  position={ANCHOR_POSITIONS[ci]}
                  onClick={() => scrollToChapter(chapter.id)}
                />
                {products.map((product, pi) => {
                  const pos = NODE_POSITIONS[chapter.id]?.[pi];
                  if (!pos) return null;
                  return (
                    <ConstellationNode
                      key={product.slug}
                      product={product}
                      chapterColor={chapter.color}
                      isSelected={selectedSlug === product.slug}
                      onSelect={setSelectedSlug}
                      position={pos}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Manifesto — bridge between the system and the detail */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mt-12 md:mt-16 px-4 text-center text-white"
        >
          <p className="font-serif italic text-xl md:text-3xl lg:text-4xl tracking-tight leading-[1.15]">
            Centralized. Digital. Wireless.
          </p>
          <p className="mt-2 md:mt-3 font-serif text-xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-[1.15]">
            Endodontics, made possible — by <em className="not-italic font-semibold">Denjoy</em>.
          </p>
          <p className="mt-4 text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-amber-200/80">
            The 2026 line, exclusive to DentaSource Direct
          </p>
        </motion.div>

        {/* Inline detail card */}
        <InlineDetail
          product={selectedProduct}
          onClose={() => setSelectedSlug(null)}
        />
      </div>
    </section>
  );
}
