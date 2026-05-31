"use client";

import { motion } from "framer-motion";
import {
  Search,
  Truck,
  Wrench,
  Users,
  Sparkles,
  HeadphonesIcon,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Free Ocular Visit",
    description:
      "We visit your clinic space, assess layout, recommend the right configuration.",
  },
  {
    icon: Truck,
    number: "02",
    title: "White-Glove Delivery",
    description:
      "Equipment transported with care, placed exactly where needed.",
  },
  {
    icon: Wrench,
    number: "03",
    title: "Professional Installation",
    description:
      "Positioning, connections, calibration by experienced technicians.",
  },
  {
    icon: Users,
    number: "04",
    title: "Training & Orientation",
    description:
      "Staff walkthrough on operation, maintenance, workflow.",
  },
  {
    icon: Sparkles,
    number: "05",
    title: "Post-Install Cleanup",
    description: "Operatory left spotless and ready for patients.",
  },
  {
    icon: HeadphonesIcon,
    number: "06",
    title: "After-Sales Support",
    description:
      "Rehousing, repairs, parts sourcing — ongoing for the life of your equipment.",
  },
];

export default function AboutServiceJourney() {
  return (
    <section className="py-16 lg:py-24 bg-white">
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
              Full-Service Experience
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              From Visit to Fully Operational
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Every DentaSource purchase comes with a complete end-to-end
              experience. Here&apos;s what happens when you choose us.
            </p>
          </motion.div>
        </div>

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-6 gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative text-center"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-[60%] right-0 h-[2px] bg-emerald-200 z-0" />
                )}
                {/* Icon */}
                <div className="relative z-10 mx-auto w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4">
                  <step.icon className="w-7 h-7 text-emerald-600" />
                </div>
                {/* Number */}
                <div className="text-xs font-bold text-emerald-600 tracking-wider mb-1">
                  STEP {step.number}
                </div>
                {/* Title */}
                <h3 className="text-sm font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                {/* Description */}
                <p className="text-xs text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="flex items-start gap-4"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-5 h-5 text-emerald-600" />
                </div>
                {index < steps.length - 1 && (
                  <div className="w-[2px] h-6 bg-emerald-200 mt-2" />
                )}
              </div>
              <div className="pt-1">
                <div className="text-xs font-bold text-emerald-600 tracking-wider mb-0.5">
                  STEP {step.number}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
