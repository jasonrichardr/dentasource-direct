'use client';

import { useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'What dental chair is eligible for trade-in?',
    answer: 'You can trade in almost any make or model of dental chair for a trade-in credit toward a new premium ROSON dental chair. Even if your dental chair does not qualify for trade-in value, our team can still dismantle and recycle it for free to clear out your space.',
  },
  {
    question: 'Does my current chair need to be in working condition?',
    answer: "Not at all. While fully functional chairs typically command higher trade-in values, our comprehensive appraisal process evaluates your dental chair in any condition\u2014from legacy units to non-operational chairs. Our priority is maximizing your value to ensure a smooth clinic upgrade.",
  },
  {
    question: 'How do I prepare my dental chair before I trade it in?',
    answer: 'There is no heavy lifting or dismantling required on your part. Our specialized white-glove team handles everything from safely uninstalling your old chair to flawlessly installing your new ROSON setup. We coordinate everything for the exact same day, guaranteeing zero operational downtime.',
  },
  {
    question: 'How quickly can I get an appraisal?',
    answer: 'It is a completely seamless process. Simply send us a few photos and basic details of your current dental chair, and our evaluation team will provide a transparent, no-obligation estimate within 24 hours. Once accepted, your credit is instantly applied toward your new purchase.',
  },
];

function AccordionItem({ faq, isOpen, onClick }) {
  return (
    <div className="border-b border-black/[0.06]">
      <button
        className="w-full flex justify-between items-center py-5 md:py-6 text-left group"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <h3 className="text-[15px] md:text-lg font-medium text-[#1D1D1F] pr-4 group-hover:text-[#0071E3] transition-colors">
          {faq.question}
        </h3>
        <span
          className={`flex-shrink-0 text-[#86868B] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <p className="text-[#86868B] text-sm md:text-base leading-relaxed pb-5 md:pb-6 pr-8">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-white py-16 md:py-24 px-5 md:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1D1D1F] tracking-tight mb-8 md:mb-12">
          Trade-in Eligibility
        </h2>
        <div className="border-t border-black/[0.06]">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              faq={faq}
              isOpen={index === openIndex}
              onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
