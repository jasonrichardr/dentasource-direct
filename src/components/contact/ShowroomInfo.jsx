'use client';
import { motion } from 'framer-motion';

export default function ShowroomInfo() {
  return (
    <div className="w-full h-full bg-[#0A1410] p-10 lg:p-20 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#10b981]/10 blur-[120px] rounded-full pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 max-w-lg mt-12 lg:mt-0">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-6">Hands-on experience.<br /><span className="text-white/50">before you buy.</span></h1>
        <div className="space-y-8 mt-12">
          <div>
            <h4 className="text-white font-medium mb-2 uppercase tracking-wider text-sm">Headquarters & Showroom</h4>
            <p className="text-white/60 leading-relaxed">610 C. Maybunga Rd, Pasig City <br />Metro Manila, Philippines</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
