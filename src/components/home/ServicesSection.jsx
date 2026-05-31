'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const steps = [
  {
    num: '1',
    title: 'You Reach Out',
    desc: 'Call, message, or walk in. Tell us about your clinic — size, specialty, patient volume, budget.',
    time: 'Day 1',
  },
  {
    num: '2',
    title: 'We Visit Your Space',
    desc: "Our team does a free ocular visit. We measure your operatory, assess plumbing and electrical, and photograph the layout.",
    time: 'Day 2–3',
  },
  {
    num: '3',
    title: 'Your Architect Draws the Plan',
    desc: 'Our licensed architect designs your operatory layout — optimized for workflow, infection control, and patient comfort.',
    time: 'Day 4–7',
  },
  {
    num: '4',
    title: 'You Visit the Showroom',
    desc: "Sit on every chair. Test the hydraulic, the light, the handpiece connections. Compare models side by side. Bring your team.",
    time: 'Your schedule',
  },
  {
    num: '5',
    title: 'We Deliver & Install',
    desc: 'White-glove delivery. Professional positioning and calibration. Staff training. Post-install cleanup. We leave when your clinic is ready for patients.',
    time: 'On your date',
  },
  {
    num: '6',
    title: 'We Stay in Touch',
    desc: "Genuine spare parts on hand. Trained technicians on call. Continuing education at our training center. We're your partner — not just your supplier.",
    time: 'Ongoing',
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-white rounded-t-[3rem] -mt-8 relative z-20">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-20 sm:py-28">

        {/* Journey Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          className="text-center mb-14"
        >
          <span className="text-[#369078] font-semibold tracking-[0.2em] uppercase text-xs block mb-3">
            From First Call to First Patient
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1a1a1a]">
            Your Journey With Us
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-gray-100" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="relative pl-14 pb-10 last:pb-0"
            >
              {/* Circle */}
              <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-[#1a3c34] flex items-center justify-center text-white text-sm font-bold z-10">
                {step.num}
              </div>

              {/* Time badge */}
              <span className="inline-block text-[10px] font-semibold tracking-wider uppercase text-[#369078] bg-[#369078]/8 px-2.5 py-1 rounded-full mb-2">
                {step.time}
              </span>

              <h3 className="text-lg font-bold text-[#1a1a1a] mb-1.5">
                {step.title}
              </h3>
              <p className="text-gray-500 text-[15px] leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 sm:px-6 pb-20 sm:pb-28">
        <div className="max-w-4xl mx-auto bg-[#1a3c34] rounded-3xl p-10 sm:p-16 text-center overflow-hidden relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#369078]/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Ready to Start Your Journey?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: 0.1 }}
              className="text-white/60 mb-8 max-w-lg mx-auto"
            >
              Book a free consultation. We'll visit your space, design your layout, and recommend equipment that fits your stage.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 bg-white text-[#1a3c34] rounded-full font-semibold hover:scale-105 transition-transform text-center"
              >
                Book Free Consultation
              </Link>
              <Link
                href="/news"
                className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white rounded-full font-semibold hover:bg-white/10 transition-colors text-center"
              >
                Read Our News
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
