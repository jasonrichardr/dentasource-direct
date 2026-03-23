'use client';
import { motion } from 'framer-motion';

const whyUsItems = [
  { num: '01', title: 'Closer to the Dentist', desc: "We operate at clinic level. Decisions are fast, human, and practical." },
  { num: '02', title: 'Showroom-First', desc: 'Visit our showroom. Sit on the chair, test the ergonomics. Experience convinces.' },
  { num: '03', title: 'Built-In Education', desc: "We don't just sell products — we build capability. Hands-on training included." },
  { num: '04', title: 'Transparent Flexibility', desc: "Practical bundles and honest recommendations optimizing for your reality." },
];

export default function WhyUsSection() {
  return (
    <section className="py-32 bg-[#0A1410] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F26522]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[#10b981] font-semibold tracking-wider uppercase text-sm mb-4 block">The DentaSource Difference</span>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">Built for Dentists, by People Who Understand Dentistry.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {whyUsItems.map((item, i) => (
            <motion.div key={item.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-10 rounded-[2rem] border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-xl transition-colors group">
              <div className="text-5xl font-serif italic text-white/20 mb-6 group-hover:text-[#F26522]/40 transition-colors">{item.num}</div>
              <h3 className="text-2xl font-semibold text-white mb-4">{item.title}</h3>
              <p className="text-white/60 leading-relaxed text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
