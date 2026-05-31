"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const programs = [
  {
    img: "digital-dentistry",
    title: "Digital Dentistry",
    desc: "End-to-end digital workflows. Learn intraoral scanning, CAD design, and 3D printing for absolute precision.",
    active: true,
  },
  {
    img: "oral-surgery",
    title: "Oral Surgery",
    desc: "Advanced surgical techniques utilizing the latest in guided implantology and minimally invasive tools.",
    active: true,
  },
  {
    img: "endodontics",
    title: "Endodontics",
    desc: "Master modern rotary systems, apical locators, and warm obturation for predictable success.",
    active: false,
  },
  {
    img: "prosthodontics",
    title: "Prosthodontics",
    desc: "From single units to full-mouth rehabs. Elevate your restorative skills with cutting-edge materials.",
    active: false,
  },
  {
    img: "aesthetics",
    title: "Aesthetics",
    desc: "Art meets science. Perfect anterior restorations, composite bonding, and smile design principles.",
    active: false,
  },
  {
    img: "business",
    title: "Dental Business Management",
    desc: "Master the business side of dentistry. Optimize daily clinic operations, patient acquisition, and financial growth.",
    active: false,
  },
];

export default function AboutTrainingCenter() {
  return (
    <section className="py-16 lg:py-24 bg-[#0A1410] overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-6">
              DentaSource Training Center
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Master the Future of Dentistry.
            </h2>
            <p className="text-lg sm:text-xl text-emerald-100/70 leading-relaxed">
              Learn, scan, design, and create. Innovation meets clinical
              practice in our state-of-the-art facility designed to elevate your
              skills.
            </p>
          </motion.div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {programs.map((program, i) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative rounded-2xl overflow-hidden group h-80"
            >
              {/* Background Image */}
              <Image
                src={`/images/training/${program.img}.png`}
                alt={program.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {program.title}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed mb-3">
                  {program.desc}
                </p>
                <span
                  className={`inline-flex self-start items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                    program.active
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-white/10 text-white/60 border border-white/20"
                  }`}
                >
                  {program.active ? "Active Program" : "Coming Soon"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3.5 text-base transition-colors duration-200 shadow-lg shadow-emerald-500/25"
          >
            Inquire About Next Batch
          </Link>
        </div>
      </div>
    </section>
  );
}
