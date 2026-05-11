'use client';

/**
 * One chapter anchor on the constellation — Roman numeral, label, SKU count.
 *
 * Props:
 *  - chapter: denjoyChapters entry (id, roman, name, color, position)
 *  - skuCount: number of products in this chapter
 *  - position: { left, top } as CSS percentage strings (anchor center)
 *  - onClick: () => void — scrolls to ChaptersBand card for this chapter
 */
export default function ChapterAnchor({ chapter, skuCount, position, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute z-5 flex flex-col items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 rounded"
      style={{
        left: position.left,
        top: position.top,
        transform: 'translate(-50%, -50%)',
      }}
      aria-label={`Chapter ${chapter.roman}: ${chapter.name}, ${skuCount} SKUs`}
    >
      {/* Anchor dot */}
      <span
        className="block rounded-full w-5 h-5 md:w-7 md:h-7"
        style={{
          background: `radial-gradient(circle, #fff 0%, ${chapter.color} 100%)`,
          boxShadow: `0 0 18px ${chapter.color}D9`,
        }}
        aria-hidden="true"
      />
      {/* Label — always visible */}
      <span className="whitespace-nowrap rounded border border-white/20 bg-white/10 px-1 md:px-2 py-0.5 md:py-1 text-center text-[9px] md:text-[10px] font-bold uppercase leading-tight tracking-[0.15em] md:tracking-[0.2em] text-white backdrop-blur-sm">
        <span className="mr-0.5 md:mr-1 italic font-normal text-white/55 font-serif">
          {chapter.roman}
        </span>
        {chapter.name}
        <span className="block text-[8px] md:text-[9px] font-normal italic text-white/55 font-serif tracking-normal">
          {skuCount} SKU{skuCount === 1 ? '' : 's'}
        </span>
      </span>
    </button>
  );
}
