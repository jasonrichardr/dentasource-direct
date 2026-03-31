'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Wrench, GraduationCap, Phone } from 'lucide-react';

const metrics = [
  {
    value: '99%',
    label: 'Out-of-Box Quality',
    detail: 'Every unit tested before it leaves the factory',
    icon: ShieldCheck,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    value: 'Genuine',
    label: 'Traceable Parts',
    detail: 'All spare parts available — genuine, traceable, factory-sourced',
    icon: ShieldCheck,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
  {
    value: 'Day-One',
    label: 'Staff Training',
    detail: 'Your team trained on operation before we leave',
    icon: GraduationCap,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    value: 'Free',
    label: 'Delivery + Install',
    detail: 'White-glove to your door, positioned and calibrated',
    icon: Truck,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
  },
  {
    value: 'In-House',
    label: 'Trained Technicians',
    detail: 'Fully trained, digitally equipped — local service reaching Mindanao',
    icon: Wrench,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    badge: 'Mindanao branch coming soon',
  },
  {
    value: '7 Days',
    label: 'Open Weekly',
    detail: 'Mon–Sun, 9AM–8PM — we work on your schedule',
    icon: Phone,
    color: 'text-sky-400',
    bg: 'bg-sky-400/10',
  },
];

export default function QualityMetrics() {
  return (
    <section className="py-16 bg-neutral-900 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/30 via-emerald-900/5 to-transparent rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 relative z-10">
        <div className="text-center mb-12">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight"
          >
            What You Actually Get
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400 max-w-xl mx-auto text-sm sm:text-base"
          >
            Not promises on a brochure — these are commitments we deliver on every single install.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.12] transition-all duration-300 group text-center"
            >
              <div className={`p-3 rounded-xl ${metric.bg} ${metric.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <metric.icon size={24} strokeWidth={1.5} />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight">{metric.value}</div>
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold mb-2">{metric.label}</div>
              <div className="text-[11px] text-neutral-500 leading-snug">{metric.detail}</div>
              {metric.badge && (
                <span className="mt-2 inline-block text-[9px] font-semibold tracking-wider uppercase px-2 py-1 rounded-full border border-orange-400/20 text-orange-400/70 bg-orange-400/5">
                  {metric.badge}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
