'use client';

import { motion } from 'framer-motion';

/**
 * One product dot on the constellation map.
 *
 * Props:
 *  - product: a denjoyProducts entry
 *  - chapterColor: hex string for glow
 *  - isSelected: boolean — currently expanded in InlineDetail
 *  - onSelect: (slug) => void — fires on click
 *  - position: { left, top } as CSS percentage strings
 *  - showLabel: boolean — always-visible label (for chapter anchors); else tooltip-on-hover
 */
export default function ConstellationNode({
  product,
  chapterColor,
  isSelected,
  onSelect,
  position,
  showLabel = false,
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product.slug)}
      className="absolute group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 rounded-full"
      style={{
        left: position.left,
        top: position.top,
        transform: 'translate(-50%, -50%)',
        zIndex: isSelected ? 6 : 4,
      }}
      aria-label={`${product.name} — ${product.fullName}`}
      aria-pressed={isSelected}
    >
      <motion.span
        className="block rounded-full"
        style={{
          width: isSelected ? 22 : 14,
          height: isSelected ? 22 : 14,
          background: isSelected
            ? `radial-gradient(circle, #fff 0%, ${chapterColor} 100%)`
            : 'rgba(255,255,255,0.85)',
          boxShadow: isSelected
            ? `0 0 22px ${chapterColor}, 0 0 44px ${chapterColor}80`
            : `0 0 8px ${chapterColor}AA`,
        }}
        whileHover={isSelected ? {} : { scale: 1.25 }}
        animate={isSelected ? { scale: 1.15 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      />
      {/* ✦ NEW tag */}
      {product.isNew && (
        <span
          className="absolute -top-1 -right-3 text-amber-200 text-[9px] leading-none font-bold tracking-wider"
          aria-hidden="true"
        >
          ✦
        </span>
      )}
      {/* Label — always-visible variant */}
      {showLabel && (
        <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-white/80 text-[10px] font-semibold tracking-[0.08em]">
          {product.name}
        </span>
      )}
      {/* Tooltip — hover variant */}
      {!showLabel && (
        <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-black/70 px-2 py-1 text-[10px] font-semibold text-white tracking-[0.08em] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          {product.name}
          {product.isNew && <span className="ml-1 text-amber-200" aria-hidden="true">✦</span>}
        </span>
      )}
    </button>
  );
}
