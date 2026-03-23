'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const services = [
  { icon: '🚚', title: 'White Glove Delivery', desc: 'Equipment placed exactly where you need it.' },
  { icon: '🔧', title: 'Pro Installation', desc: 'Proper positioning and calibration by technicians.' },
  { icon: '📋', title: 'Training & Orientation', desc: 'Staff walkthrough on safe operation.' },
  { icon: '🛠️', title: 'After-Sales Service', desc: 'Repairs, parts sourcing, and technical support.' },
];

export default function ServicesSection() {
  return (
    <section className="py-32 bg-white rounded-t-[3rem] -mt-8 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-32">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-black mb-4">Full-Service Support</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {services.map((svc, i) => (
              <motion.div key={svc.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="pt-6 border-t border-black/10">
                <div className="text-3xl mb-4">{svc.icon}</div>
                <h4 className="text-lg font-semibold text-black mb-2">{svc.title}</h4>
                <p className="text-[#86868B] text-sm leading-relaxed">{svc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="bg-[#1D1D1F] rounded-[2.5rem] p-12 md:p-20 text-center overflow-hidden relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#0071E3]/20 blur-[150px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">Ready to Build Your Dream Clinic?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Link href="/contact" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform">Book Free Consultation</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
