"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Factory,
  Globe,
  Users,
  Award,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";

const rosonStats = [
  { value: "20+", label: "Years", icon: Factory },
  { value: "120+", label: "Countries", icon: Globe },
  { value: "100,000+", label: "Users", icon: Users },
  { value: "8,000+", label: "Chairs/Year", icon: Factory },
  { value: "30+", label: "Patents", icon: Award },
];

const qcSteps = [
  {
    step: "SQE",
    label: "Supplier Quality Engineering",
    image: "/images/about/roson/qc-supplier-engineering.webp",
  },
  {
    step: "IQC",
    label: "Incoming Quality Control",
    image: "/images/about/roson/qc-iqc.webp",
  },
  {
    step: "Debugging",
    label: "In-Line Debugging",
    image: "/images/about/roson/qc-debugging.webp",
  },
  {
    step: "OQC",
    label: "Outgoing Quality Control",
    image: "/images/about/roson/qc-oqc.webp",
  },
  {
    step: "Ship",
    label: "Final Inspection & Shipping",
    image: "/images/about/roson/shipping.webp",
  },
];

const rdImages = [
  {
    src: "/images/about/roson/rd-product-design.webp",
    alt: "ROSON product design",
  },
  {
    src: "/images/about/roson/rd-materials-testing.webp",
    alt: "ROSON materials testing",
  },
  {
    src: "/images/about/roson/rd-electronics-dev.webp",
    alt: "ROSON electronics development",
  },
  { src: "/images/about/roson/rd-team.webp", alt: "ROSON R&D team" },
];

const certifications = [
  {
    name: "ISO 9001 & ISO 13485",
    image: "/images/about/roson/cert-iso.jpg",
  },
  { name: "CE Marking", image: "/images/about/roson/cert-ce.jpg" },
  { name: "SGS Certified", image: "/images/about/roson/cert-sgs.jpg" },
];

const credibilityPoints = [
  "President of the Foshan Dental Equipment Association",
  "Appointed to WRITE the industry standards for dental treatment units",
  "Featured on CCTV Finance (China national TV)",
  "National Hidden Champion in Nanhai Manufacturing (2025)",
];

export default function AboutROSON() {
  return (
    <section className="py-16 lg:py-24 bg-[#0A1410] overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-6">
              Our Manufacturing Partner
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Backed by ROSON — 20 Years of Dental Engineering Excellence
            </h2>
            <p className="text-lg sm:text-xl text-emerald-100/70 leading-relaxed">
              As the exclusive Philippine distributor, every chair in our
              showroom comes directly from one of the world&apos;s most advanced
              dental equipment manufacturers.
            </p>
          </motion.div>
        </div>

        {/* Factory Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden mb-12"
        >
          <div className="relative aspect-[21/9]">
            <Image
              src="/images/about/roson/factory-floor.png"
              alt="ROSON 30,000 sqm digital smart factory"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
              <div className="text-2xl sm:text-3xl font-bold text-white">
                30,000 sqm Digital Smart Factory
              </div>
              <div className="text-emerald-300 text-sm sm:text-base mt-1">
                Foshan, Guangdong — Fully automated MES production lines
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-16 lg:mb-20"
        >
          {rosonStats.map((stat) => (
            <div
              key={stat.label}
              className="text-center rounded-2xl border border-emerald-500/20 bg-emerald-950/30 px-4 py-6"
            >
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-emerald-300 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* R&D Section */}
        <div className="mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Dedicated R&D Laboratory
              </h3>
            </div>
            <p className="text-emerald-100/60 text-lg max-w-2xl">
              10 engineers with 10+ years average experience. Dedicated testing
              facilities for materials, electronics, ergonomics, and product
              design.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {rdImages.map((img, index) => (
              <motion.div
                key={img.alt}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative rounded-xl overflow-hidden aspect-[4/3]"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* QC Pipeline */}
        <div className="mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                5-Stage Quality Control Pipeline
              </h3>
            </div>
            <p className="text-emerald-100/60 text-lg max-w-2xl">
              Every chair passes through 5 rigorous quality checkpoints before
              it reaches your clinic.{" "}
              <span className="text-emerald-400 font-semibold">
                99% Out-of-Box Quality Rate.
              </span>
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {qcSteps.map((qc, index) => (
              <motion.div
                key={qc.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-3">
                  <Image
                    src={qc.image}
                    alt={qc.label}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  {/* Step number */}
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                  {/* Arrow connector */}
                  {index < qcSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 text-emerald-500">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M6 3l5 5-5 5V3z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="text-sm font-bold text-emerald-400 mb-0.5">
                  {qc.step}
                </div>
                <div className="text-xs text-emerald-100/60">{qc.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="mb-16 lg:mb-20"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            International Certifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-4 text-center"
              >
                <div className="relative aspect-[3/2] rounded-lg overflow-hidden mb-3 bg-white">
                  <Image
                    src={cert.image}
                    alt={cert.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="text-sm font-semibold text-white">
                  {cert.name}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Global Market Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="mb-16 lg:mb-20"
        >
          <div className="relative rounded-2xl overflow-hidden">
            <div className="relative aspect-[21/9]">
              <Image
                src="/images/about/roson/global-market-map.png"
                alt="ROSON global market presence across 120+ countries"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </motion.div>

        {/* Credibility Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-emerald-500/15 bg-emerald-950/20 p-8 lg:p-10"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">
              Why We Chose ROSON
            </h3>
            <p className="text-emerald-100/60">
              Look at the caliber of manufacturer that trusts us for the
              Philippines.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {credibilityPoints.map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 rounded-xl bg-emerald-950/40 border border-emerald-500/10 px-5 py-4"
              >
                <svg
                  className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm font-medium text-emerald-100/80">
                  {point}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
