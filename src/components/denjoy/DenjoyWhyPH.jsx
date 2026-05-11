'use client';

import { motion } from 'framer-motion';

const DIGITAL_PILLARS = [
  {
    icon: '🔋',
    title: 'Centralized Charging',
    copy: 'One 4,700 mAh station charges five wireless handpieces simultaneously. No cable spaghetti, no juggling batteries mid-procedure — the whole endo workflow lives in one dock.',
  },
  {
    icon: '📊',
    title: 'Real-Time Data Visualization',
    copy: 'Live operation data — torque, file progression, apex position — rendered on the control screen as the procedure runs. The clinician sees what the handpiece feels, in real time.',
  },
  {
    icon: '📡',
    title: 'Intelligent Wireless Pairing',
    copy: 'Every Meet module auto-connects after the first pairing. MeetPex, MeetMotor, MeetFill, MeetPack, MeetPulp — they recognize the hub and sync instantly. No re-pairing, no lost signal.',
  },
  {
    icon: '🪶',
    title: 'Compact, Light, Ergonomic',
    copy: 'Human-oriented handpiece design. Small enough for Philippine operatories, light enough for full-day endo cases, balanced for right or left-handed clinicians.',
  },
];

const OPERATIONAL_TRUST = [
  { label: 'Transparent PHP pricing', icon: '₱' },
  { label: 'Local warranty & service', icon: '🛡' },
  { label: 'Training & CPD included', icon: '📚' },
  { label: 'Same-week nationwide delivery', icon: '🚚' },
];

export default function DenjoyWhyPH() {
  return (
    <section
      className="relative snap-start min-h-screen w-full bg-gradient-to-b from-slate-900 to-slate-950 text-white py-20 px-6"
      aria-labelledby="denjoy-why-ph-title"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-emerald-300 mb-4">
            Digital Advantage · Philippines
          </p>
          <h2
            id="denjoy-why-ph-title"
            className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight mb-6"
          >
            The only real-time, fully wireless<br />endodontic hub in the Philippines.
          </h2>
          <p className="text-base md:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            Every other endo setup sold here is a stack of disconnected devices — separate motor,
            separate apex locator, separate battery for each, cords everywhere, different UIs.
            Meet Endo unifies the entire workflow: five wireless handpieces, one charging dock, one
            touchscreen, live data on every file stroke.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {DIGITAL_PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-emerald-400/40 transition-colors"
            >
              <div className="text-3xl mb-4" aria-hidden="true">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-emerald-200">{pillar.title}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{pillar.copy}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="border-t border-white/10 pt-10"
        >
          <p className="text-center text-xs md:text-sm font-semibold tracking-[0.25em] uppercase text-white/50 mb-6">
            Distributed exclusively in the Philippines by DentaSource Direct
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {OPERATIONAL_TRUST.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3"
              >
                <span className="text-xl text-emerald-300" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="text-sm md:text-base text-white/85 font-medium">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 text-center text-sm text-white/50"
        >
          Trusted by clinicians in 30+ countries including Russia, Italy, Indonesia, and Singapore. Now
          available in the Philippines — exclusive to DentaSource Direct.
        </motion.p>
      </div>
    </section>
  );
}
