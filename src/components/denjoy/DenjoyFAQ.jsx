'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Script from 'next/script';

const FAQS = [
  {
    q: 'How much does a Denjoy endo motor cost in the Philippines?',
    a: 'Denjoy endo motors in the Philippines are priced in transparent PHP with installment options for dental clinics. The flagship Meet Endo All-in-One (cordless endo motor with built-in apex locator) is our most-requested unit. Contact DentaSource Direct for current pricing — no dollar-linked surprises, full warranty included.',
  },
  {
    q: 'What is the difference between an endo motor and an apex locator?',
    a: 'An endo motor drives rotary or reciprocating files during root canal treatment with controlled torque. An apex locator electronically measures the root canal length to find the apical foramen. Denjoy Meet Endo combines both into one cordless unit, which is why it is popular with Philippine clinics upgrading from hand filing.',
  },
  {
    q: 'Is Denjoy a reliable brand for endodontic equipment?',
    a: 'Denjoy Dental Co., Ltd has been manufacturing endodontic equipment for over 20 years and exports to 30+ countries including Russia, Italy, Indonesia, and Singapore. Their product line — endo motors, apex locators, obturation systems, and ultrasonic scalers — is FDA and CE certified. DentaSource Direct is the exclusive distributor in the Philippines.',
  },
  {
    q: 'Do you deliver Denjoy endo motors outside Metro Manila?',
    a: 'Yes. DentaSource Direct ships Denjoy endodontic equipment nationwide — Cebu, Davao, Iloilo, Baguio, and throughout Luzon, Visayas, and Mindanao. Most orders are delivered within the same week from our Manila stock.',
  },
  {
    q: 'Does the warranty cover local service and calibration?',
    a: 'Yes. Every Denjoy unit purchased from DentaSource Direct includes local warranty, apex locator calibration, and access to our Manila service center. Replacement handpieces, batteries, chargers, and compatible rotary files are stocked in PH — no offshore shipping delays.',
  },
  {
    q: 'Do you provide training on how to use the Denjoy Meet Endo?',
    a: 'Absolutely. DentaSource Direct includes live product demos, torque-setting walkthroughs, and ongoing CPD support with every Denjoy endo motor purchase. We work especially closely with general dentists transitioning from hand filing to rotary and reciprocating endodontics.',
  },
  {
    q: 'What makes Denjoy Meet Endo the most digitally advanced endo system in the Philippines?',
    a: 'Four things no competing system sold in the Philippines offers together: (1) Centralized charging — a single 4,700 mAh dock powers five wireless handpieces simultaneously; (2) Real-time data visualization — live torque, file progression, and apex position on the control screen as the procedure runs; (3) Intelligent wireless pairing — MeetPex, MeetMotor, MeetFill, MeetPack, and MeetPulp auto-connect to the hub after first pairing; (4) Compact, ergonomic handpiece design built for long endo cases. Eighteeth, Woodpecker, Acteon, and J.Morita all sell strong standalone devices, but none integrate the full workflow into one digital hub.',
  },
  {
    q: 'How does Denjoy compare to Eighteeth, Woodpecker, or Acteon endo motors?',
    a: 'Denjoy competes directly in the mid-to-premium segment but pulls ahead on digital integration. Eighteeth, Woodpecker, and Acteon sell strong standalone motors and apex locators, but they are discrete devices. Denjoy Meet Endo is the only system in the Philippine market that integrates motor + apex + obturation into one wireless, touchscreen-controlled hub. Add exclusive PH distribution (faster support) and lower total cost of ownership, and the gap widens further.',
  },
  {
    q: 'What products are included in the Denjoy Philippines launch?',
    a: 'Five flagship instruments: (1) Meet Endo All-in-One endodontic system, (2) FREE PEX apex locator, (3) i-Pexo apex locator, (4) AIKE ultrasonic activator, and (5) imate3 entry-level endo motor. The Meet Endo is the anchor product, with the other four covering apex location, obturation, and scaling workflows.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
};

export default function DenjoyFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      className="relative snap-start min-h-screen w-full bg-white text-slate-900 py-20 px-6"
      aria-labelledby="denjoy-faq-title"
    >
      <Script id="denjoy-faq-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(faqSchema)}
      </Script>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-emerald-600 mb-4">
            Frequently asked
          </p>
          <h2
            id="denjoy-faq-title"
            className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight mb-4"
          >
            Everything PH dentists ask about Denjoy.
          </h2>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Wireless workflow, centralized control, pricing, warranty — answered for Philippine clinics.
          </p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.q}
                className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-slate-100/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-base md:text-lg font-semibold text-slate-900">
                    {faq.q}
                  </span>
                  <span
                    className={`text-emerald-600 text-xl transition-transform duration-200 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.25 }}
                    className="px-6 pb-5 text-sm md:text-base text-slate-700 leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
