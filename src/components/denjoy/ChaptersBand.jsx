'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  denjoyChapters,
  getProductsByChapter,
} from '@/data/denjoy';

/**
 * Linear band of 5 chapter cards. Renders below the constellation as a
 * navigable category index. Each card lists its SKUs as inline links.
 */
export default function ChaptersBand() {
  return (
    <section
      aria-labelledby="chapters-band-heading"
      className="bg-white py-12 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-4">
        <h2
          id="chapters-band-heading"
          className="font-serif italic text-2xl md:text-3xl text-zinc-900 mb-6 tracking-tight"
        >
          The line, by chapter.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {denjoyChapters.map((chapter, i) => {
            const products = getProductsByChapter(chapter.id);
            return (
              <motion.div
                key={chapter.id}
                id={`chapter-${chapter.id}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="block h-3 w-3 rounded-full"
                    style={{ background: chapter.color }}
                    aria-hidden="true"
                  />
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                    <span className="font-serif italic font-normal text-zinc-400 mr-1">
                      {chapter.roman}
                    </span>
                    Chapter
                  </span>
                </div>
                <div className="font-serif italic text-lg text-zinc-900 mb-3 leading-tight">
                  {chapter.name}
                </div>
                <ul className="space-y-1">
                  {products.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/denjoy/${p.slug}`}
                        className="block text-sm text-zinc-700 hover:text-amber-700 transition-colors"
                      >
                        {p.isFlagship && (
                          <span className="text-amber-600 mr-1" aria-hidden="true">
                            ★
                          </span>
                        )}
                        {p.name}
                        {p.isNew && (
                          <span className="ml-1 text-amber-500 text-xs" aria-hidden="true">
                            ✦
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
