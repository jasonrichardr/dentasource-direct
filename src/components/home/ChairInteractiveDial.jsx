"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// Premium chair models extracted directly from products.js
const chairs = [
  { id: "roson-dxa3", name: "A3 Flagship", img: "/images/products/dxa3/img01.jpg", scale: 1.25 },
  { id: "roson-s9", name: "S9 Signature", img: "/images/products/s9/main.jpg", scale: 1.1 },
  { id: "roson-dxn2-pro", name: "N2 PRO Elite", img: "/images/products/dxn2pro/main.jpg", scale: 1.2 },
  { id: "roson-dxs6", name: "S6 Professional", img: "/images/products/dxs6/main.jpg", scale: 1.1 },
  { id: "roson-dxn2plus", name: "N2 Plus Classic", img: "/images/products/dxn2plus/main.jpg", scale: 1.1 }, 
];

export default function ChairInteractiveDial() {
  const [currentIndex, setCurrentIndex] = useState(0); // Start on A3
  const router = useRouter();

  const handleDragEnd = (e, { offset }) => {
    // Determine swipe threshold
    const swipe = offset.x;
    if (swipe < -40) {
      setCurrentIndex((prev) => (prev + 1) % chairs.length);
    } else if (swipe > 40) {
      setCurrentIndex((prev) => (prev - 1 + chairs.length) % chairs.length);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-end overflow-hidden pb-4 md:pb-0 pointer-events-auto">
      
      {/* 3D Swipeable Dial Container */}
      <motion.div 
        className="relative w-full h-[70%] sm:h-[80%] flex items-end justify-center active:cursor-grabbing mb-4"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        {chairs.map((chair, i) => {
          let offset = i - currentIndex;
          // Handle circular wrap around math for an infinite loop feel
          if (offset < -2) offset += chairs.length;
          if (offset > 2) offset -= chairs.length;

          const absOffset = Math.abs(offset);
          const isActive = offset === 0;

          // Only render active, left adjacent, and right adjacent to save DOM nodes and keep performance high
          if (absOffset > 1) return null;

          return (
            <motion.div
              key={chair.id}
              className="absolute origin-bottom flex items-end justify-center w-[85%] sm:w-[50%] md:w-[65%] h-full"
              initial={false}
              animate={{
                x: offset * 180, // Horizontal spread of adjacent items
                scale: isActive ? chair.scale : 0.7 * chair.scale, // Shrink side items to create depth
                opacity: isActive ? 1 : 0.25, // Fade side items
                zIndex: isActive ? 10 : 0, // Ensure active is layered on top
                rotateY: offset * -35, // True 3D rotation facing inward
                rotateZ: offset * -5, // Slight angled tilt for realism
                translateY: isActive ? 0 : 20 // Drop side items slightly lower
              }}
              transition={{ type: "spring", stiffness: 280, damping: 25, mass: 1.2 }}
              onClick={() => {
                if (isActive) router.push(`/products/${chair.id}`); // Route to specific page if clicked while active
                else setCurrentIndex(i); // If clicking a side item, rotate the dial to it
              }}
            >
              <img 
                src={chair.img} 
                alt={chair.name} 
                className={`object-contain object-bottom w-full h-full mix-blend-darken drop-shadow-2xl select-none ${isActive ? 'cursor-pointer' : 'cursor-grab'}`} 
                draggable="false"
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Modern Badge for the active chair name */}
      <AnimatePresence mode="wait">
        <motion.div
          key={chairs[currentIndex].id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-2 right-4 md:right-8 flex flex-col items-end gap-1 pointer-events-none mix-blend-multiply"
        >
          <span className="bg-[#E8F1FC] text-[#0071E3] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            {chairs[currentIndex].name}
          </span>
          <span className="text-[10px] text-[#86868B]  font-semibold">Tap to view model</span>
        </motion.div>
      </AnimatePresence>

      {/* Interactive Pagination Dots at the very bottom */}
      <div className="absolute bottom-4 flex items-center gap-1.5 z-20">
        {chairs.map((chair, i) => (
          <button
            key={`dot-${chair.id}`}
            onClick={() => setCurrentIndex(i)}
            className={`transition-all duration-300 rounded-full ${
              i === currentIndex ? "w-6 h-1.5 bg-[#0071E3]" : "w-1.5 h-1.5 bg-black/15 hover:bg-black/30"
            }`}
            aria-label={`Go to ${chair.name}`}
          />
        ))}
      </div>
    </div>
  );
}
