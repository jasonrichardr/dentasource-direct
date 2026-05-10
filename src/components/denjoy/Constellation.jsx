'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  denjoyChapters,
  denjoyProducts,
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
        {/* Map (desktop only) */}
        <div className="relative hidden md:block aspect-[16/10] w-full">
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
              className="block rounded-full"
              style={{
                width: 80,
                height: 80,
                background:
                  'radial-gradient(circle, #fff 0%, #cce4ff 60%, #6aa8ff 100%)',
                boxShadow:
                  '0 0 30px rgba(180,220,255,0.95), 0 0 60px rgba(120,180,255,0.6)',
              }}
              aria-hidden="true"
            />
            <span className="mt-2 font-serif italic text-white/70 text-[10px] tracking-widest">
              ★ FLAGSHIP
            </span>
            <span className="mt-1 whitespace-nowrap rounded border border-white/20 bg-black/40 px-2.5 py-1 text-[11px] font-bold tracking-[0.2em] text-white">
              MEET ENDO
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

        {/* Mobile fallback — vertical chapters list */}
        <div className="md:hidden flex flex-col gap-4">
          <Link
            href={`/denjoy/${flagship.slug}`}
            className="block rounded-lg border border-white/15 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 p-6 text-center"
          >
            <div className="font-serif italic text-white/70 text-[10px] tracking-widest mb-2">
              ★ FLAGSHIP
            </div>
            <div className="font-serif italic text-2xl text-white">
              {flagship.name}
            </div>
            <div className="text-white/70 text-sm mt-1">
              {flagship.tagline}
            </div>
          </Link>
          {denjoyChapters.map((chapter) => {
            const products = productsByChapter[chapter.id] ?? [];
            if (products.length === 0) return null;
            return (
              <div
                key={chapter.id}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <div className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                  <span className="font-serif italic font-normal mr-1 text-white/40">
                    {chapter.roman}
                  </span>
                  {chapter.name}
                </div>
                <div className="flex flex-col gap-2">
                  {products.map((p) => (
                    <button
                      key={p.slug}
                      type="button"
                      onClick={() => setSelectedSlug(p.slug)}
                      className="flex items-center justify-between text-left text-white py-1 px-2 rounded transition-colors hover:bg-white/5 focus:outline-none focus-visible:bg-white/10"
                    >
                      <span className="font-medium text-sm">
                        {p.name}
                        {p.isNew && (
                          <span className="ml-1 text-amber-200" aria-hidden="true">
                            ✦
                          </span>
                        )}
                      </span>
                      <span className="text-white/40 text-xs">→</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Inline detail card */}
        <InlineDetail
          product={selectedProduct}
          onClose={() => setSelectedSlug(null)}
        />
      </div>
    </section>
  );
}
