"use client";

import { motion } from "framer-motion";
import { Eye, GraduationCap, Sparkles, Shield } from "lucide-react";

const cards = [
  {
    icon: Eye,
    title: "Showroom-First Experience",
    description:
      "140 sqm. Every chair on display. Sit on it, test the ergonomics, compare side by side. Specs inform — experience convinces.",
  },
  {
    icon: GraduationCap,
    title: "Training & Education",
    description:
      "We don't just sell equipment — we build capability. Our training center offers hands-on programs in digital dentistry, oral surgery, and endodontics.",
  },
  {
    icon: Sparkles,
    title: "White-Glove Service",
    description:
      "Free ocular visit. Professional installation. Staff training. After-sales support. Post-install cleanup. We stay until your operatory is ready for patients.",
  },
  {
    icon: Shield,
    title: "Honest Recommendations",
    description:
      "We optimize for your clinic's reality, not our short-term margin. If a lower-priced chair fits your needs better, we'll tell you.",
  },
];

export default function AboutDifference() {
  return (
    <section className="pt-32 sm:pt-36 md:pt-40 pb-16 lg:pb-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-emerald-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
              Why DentaSource
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              The DentaSource Difference
            </h2>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-2xl border border-gray-100 bg-zinc-50 p-8"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <card.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
