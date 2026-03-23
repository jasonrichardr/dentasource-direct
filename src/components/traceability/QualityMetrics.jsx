'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Globe, Clock, RefreshCcw, BookOpen, UserCheck } from 'lucide-react';

const metrics = [
  {
    id: 'out-of-box',
    value: '99%',
    label: 'Out-of-Box Quality Rate',
    icon: ShieldCheck,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10'
  },
  {
    id: 'warranty',
    value: '12M',
    label: 'Month Warranty',
    icon: Clock,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10'
  },
  {
    id: 'support',
    value: '24/7',
    label: 'After-Sales Support',
    icon: Globe,
    color: 'text-teal-400',
    bg: 'bg-teal-400/10'
  },
  {
    id: 'feedback',
    value: 'Closed-Loop',
    label: 'Feedback System',
    icon: RefreshCcw,
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10'
  },
  {
    id: 'training',
    value: 'Online/Offline',
    label: 'Comprehensive Training',
    icon: BookOpen,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10'
  },
  {
    id: 'checkup',
    value: 'Regular',
    label: 'Follow-ups',
    icon: UserCheck,
    color: 'text-sky-400',
    bg: 'bg-sky-400/10'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function QualityMetrics() {
  return (
    <section className="py-16 bg-neutral-900 border-t border-white/5 relative overflow-hidden">
      {/* Subtle Background Glow - Optimized for iOS Safari (No heavy blur calculations) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/40 via-cyan-900/5 to-transparent rounded-full pointer-events-none" style={{ WebkitTransform: 'translateZ(0)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight"
          >
            Our Commitment to Your <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Satisfaction</span>
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400 max-w-2xl mx-auto"
          >
            Every product goes through rigorous tests with our advanced assurance equipment before reaching your clinic.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-6 gap-6"
        >
          {metrics.map((metric) => (
            <motion.div
              key={metric.id}
              variants={itemVariants}
              className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 group"
            >
              <div className={`p-4 rounded-xl ${metric.bg} ${metric.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <metric.icon size={28} strokeWidth={1.5} />
              </div>
              <div className="text-2xl font-bold text-white mb-1 tracking-tight">{metric.value}</div>
              <div className="text-xs text-neutral-400 text-center uppercase tracking-wider font-medium">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Testing Equipment List Minimal */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest mb-6">Powered by Advanced Testing Systems</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-300">
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/5">Temperature & Humidity Chamber</span>
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/5">Salt Spray Tester</span>
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/5">Elastic Arm Tester</span>
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/5">Chair Frame Performance</span>
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/5">Control System Aging</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
