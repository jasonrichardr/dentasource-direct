'use client';
import { motion } from 'framer-motion';

export default function ProductGallery({ image, alt }) {
  return (
    <div className="w-full h-full min-h-[50vh] lg:min-h-[calc(100vh-8rem)] bg-[#F5F5F7] rounded-[2rem] lg:rounded-[3rem] p-8 lg:p-16 flex items-center justify-center relative overflow-hidden group">
      <motion.img initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} src={image} alt={alt} className="relative z-10 w-full h-full object-contain max-h-[70vh] mix-blend-multiply drop-shadow-2xl group-hover:scale-105 transition-transform duration-700 ease-out" />
    </div>
  );
}
