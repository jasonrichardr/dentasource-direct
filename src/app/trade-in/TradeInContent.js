'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import FaqAccordion from './FaqAccordion';

const processSteps = [
  {
    title: '1. Get an Estimate',
    desc: 'Tell us about your current chair. We evaluate brand, year, and condition to give you a fair market estimate.',
    icon: (
      <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
      </svg>
    ),
  },
  {
    title: '2. We Pick It Up',
    desc: 'No heavy lifting required. Our white-glove team will safely uninstall and remove your old equipment.',
    icon: (
      <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.143-.504 1.125-1.125a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    title: '3. Get Instant Credit',
    desc: 'The value of your old chair is instantly applied as a discount toward your new ROSON setup.',
    icon: (
      <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
];

const roiPoints = [
  {
    title: 'Elevate Clinical Confidence',
    desc: 'A modern, high-tech dental chair elevates your skills and confidence handling specialized procedures.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
  {
    title: 'Zero Operational Downtime',
    desc: 'We coordinate the removal of your old chair and the installation of your new one on the exact same day.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
];

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export default function TradeInContent() {
  return (
    <main className="w-full bg-white selection:bg-[#10b981] selection:text-white">

      {/* ── HERO ── */}
      <section className="relative w-full bg-[#0A1410] pt-[120px] md:pt-36 pb-16 sm:pb-20 md:pb-28 px-5 md:px-8 overflow-hidden flex flex-col items-center">
        {/* Gradient blur orbs */}
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-[#F26522]/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#0071E3]/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#F26522] text-xs md:text-sm font-semibold tracking-[0.15em] uppercase mb-4 md:mb-5">
              DentaSource Trade-In Program
            </p>
            <h1 className="text-white text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] mb-5 md:mb-6">
              Turn the chair you have <br className="hidden sm:block" />
              into the clinic you{' '}
              <span className="text-white/50">want.</span>
            </h1>
            <p className="text-[#86868B] text-[15px] md:text-lg leading-relaxed mb-7 md:mb-10 max-w-xl mx-auto">
              Upgrade your practice effortlessly. Trade in your old dental chair for instant credit toward a state-of-the-art ROSON dental chair.
            </p>
            <Link
              href="#appraisal"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-[#F26522] text-white rounded-full font-medium text-sm md:text-base hover:bg-[#e05a1a] transition-colors shadow-lg shadow-[#F26522]/20"
            >
              Get an Estimate
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 3 STEPS ── */}
      <section className="bg-white relative z-30 pt-16 md:pt-24 pb-16 md:pb-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16 max-w-2xl mx-auto">
            <span className="text-[#F26522] text-xs md:text-sm font-semibold tracking-[0.15em] uppercase block mb-3">
              How It Works
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1D1D1F] tracking-tight mb-4">
              Seamless Upgrades in 3 Steps
            </h2>
            <p className="text-[#86868B] text-sm md:text-base leading-relaxed">
              We handle the logistics so you can focus on dentistry. Our streamlined process makes trading in your old equipment completely hassle-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6 md:p-8 bg-[#F5F5F7] rounded-2xl md:rounded-3xl"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#F26522]/10 text-[#F26522] flex items-center justify-center mx-auto mb-4 md:mb-5">
                  {step.icon}
                </div>
                <h3 className="text-base md:text-lg font-semibold text-[#1D1D1F] mb-2">
                  {step.title}
                </h3>
                <p className="text-[#86868B] text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI / BENEFITS ── */}
      <section className="bg-[#F5F5F7] py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-stretch gap-6 md:gap-10">

            {/* Left: Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2 flex flex-col justify-center"
            >
              <span className="text-[#F26522] text-xs md:text-sm font-semibold tracking-[0.15em] uppercase block mb-3">
                The Hidden Value
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1D1D1F] tracking-tight mb-4">
                More Than Just a New Chair
              </h2>
              <p className="text-[#86868B] text-sm md:text-base leading-relaxed mb-6 md:mb-8">
                Trading in older equipment isn&apos;t just an aesthetics upgrade — it&apos;s a strategic business decision that pays dividends.
              </p>

              <ul className="space-y-4 md:space-y-5">
                {roiPoints.map((point) => (
                  <li key={point.title} className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-[#F26522]/10 text-[#F26522] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {point.icon}
                    </div>
                    <div>
                      <strong className="block text-[#1D1D1F] text-sm md:text-base font-semibold mb-0.5">
                        {point.title}
                      </strong>
                      <span className="text-[#86868B] text-sm leading-relaxed">
                        {point.desc}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right: Planet Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2"
            >
              <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-10 h-full flex flex-col justify-center relative overflow-hidden shadow-sm">
                {/* Decorative recycle icon */}
                <svg className="absolute top-4 right-4 md:top-8 md:right-8 w-20 h-20 md:w-28 md:h-28 opacity-[0.06]" viewBox="0 0 24 24" fill="#00c853" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.20459 13.916C6.71186 13.916 7.15175 14.1687 7.42415 14.5457H8.64756L10.3601 11.5238H7.72911C6.72852 11.5238 5.86903 10.9577 5.43261 10.1264L2.80164 5.48281V13.916H6.20459ZM21.1984 5.48281L18.5674 10.1264C18.131 10.9577 17.2715 11.5238 16.2709 11.5238H13.6399L15.3524 14.5457H16.5759C16.8482 14.1687 17.2881 13.916 17.7954 13.916H21.1984V5.48281ZM16.2709 3.09062H7.72911C6.9142 3.09062 6.18247 3.48441 5.72758 4.10304L3.8996 7.33083L5.61214 10.3527L8.24311 5.70914H15.7569L18.3879 10.3527L20.1004 7.33083L18.2724 4.10304C17.8175 3.48441 17.0858 3.09062 16.2709 3.09062ZM14.4443 20.3551L12 16.0357L9.55569 20.3551C9.09802 21.1664 8.24647 21.6853 7.31952 21.6853C6.39257 21.6853 5.54101 21.1664 5.08334 20.3551L3.86877 18.2044L5.5813 15.1825L8.21227 19.8261C8.36199 20.0911 8.64805 20.2608 8.96162 20.2608C9.27519 20.2608 9.56125 20.0911 9.71097 19.8261L12 15.7797L14.289 19.8261C14.4388 20.0911 14.7248 20.2608 15.0384 20.2608C15.352 20.2608 15.638 20.0911 15.7877 19.8261L18.4187 15.1825L20.1312 18.2044L18.9167 20.3551C18.459 21.1664 17.6074 21.6853 16.6805 21.6853C15.7535 21.6853 14.902 21.1664 14.4443 20.3551Z" />
                </svg>

                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1D1D1F] tracking-tight leading-[0.95] mb-4 md:mb-5 relative z-10">
                  Good for<br />the planet.
                </h3>
                <p className="text-[#86868B] text-sm md:text-base leading-relaxed mb-6 md:mb-8 max-w-sm relative z-10">
                  If your dental chair is in good shape, we&apos;ll help get it to a new owner. Or, if it&apos;s seen better days, we can recycle it for free.
                </p>
                <Link
                  href="/contact?type=recycle"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-[#0071E3] text-white rounded-full font-medium text-sm hover:bg-[#0077ED] transition-colors relative z-10"
                >
                  Recycle your dental chair
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FaqAccordion />

      {/* ── CTA / APPRAISAL ── */}
      <section id="appraisal" className="relative bg-[#0A1410] py-16 md:py-24 px-5 md:px-8 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#F26522]/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto text-center">
          <span className="text-[#F26522] text-xs md:text-sm font-semibold tracking-[0.15em] uppercase block mb-3">
            Start Your Upgrade
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight mb-6 md:mb-8">
            Ready to Find Out What It&apos;s Worth?
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/[0.05] border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-10 backdrop-blur-sm"
          >
            <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6 md:mb-8">
              Send us a few details and photos of your current equipment. Our team will evaluate it and provide a trade-in estimate within 24 hours.
            </p>
            <Link
              href="/contact?type=trade-in"
              className="group w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#F26522] text-white rounded-full font-medium text-sm md:text-base hover:bg-[#e05a1a] transition-colors shadow-lg shadow-[#F26522]/20"
            >
              <span>Request Free Appraisal</span>
              <ArrowIcon />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
