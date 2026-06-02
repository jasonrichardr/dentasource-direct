'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { m as motion, AnimatePresence } from 'framer-motion';

export default function Lightbox({ images, index, onClose, onPrev, onNext, alt }) {
  const open = index !== null && index !== undefined && index >= 0;

  const handleKey = useCallback((e) => {
    if (!open) return;
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowLeft') onPrev();
    else if (e.key === 'ArrowRight') onNext();
  }, [open, onClose, onPrev, onNext]);

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, handleKey]);

  const total = images?.length ?? 0;
  const canNav = total > 1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Expanded image"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
        >
          <motion.button
            onClick={onClose}
            aria-label="Close expanded image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>

          {canNav && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                aria-label="Previous image"
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                aria-label="Next image"
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          <motion.div
            key={images[index]}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-full flex items-center justify-center px-4 py-16 md:px-16 md:py-10"
          >
            <div className="relative w-full h-full max-w-6xl">
              <Image
                src={images[index]}
                alt={`${alt} — image ${index + 1} of ${total}`}
                fill
                sizes="95vw"
                className="object-contain"
                priority
                quality={95}
              />
            </div>
          </motion.div>

          {canNav && (
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm">
              {index + 1} / {total}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
